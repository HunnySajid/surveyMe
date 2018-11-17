const mongoose = require('mongoose');
const _ = require('lodash');
const Path = require('path-parser');
const {URL} = require('url');
const loginRequired = require('../middlewares/loginRequired');
const creditsRequired = require('../middlewares/creditsRequired');

const Mailer = require('../services/Mailer');
const surveyTemplate = require('../services/emailTemplates/surveyTemplate');
const Survey = mongoose.model('surveys');//modal class
module.exports = app => {

    app.get('/api/surveys',loginRequired,async (req,res) => {
        const surveys = await Survey.find({
            _user:req.user.id    
        }).select({
            recipients:false
        })
    
        res.send(surveys);
    });

    app.get('/api/surveys/:surveyId/:choice', (req,res)=> {
        res.send('Thanks for your feedback');
    });

    app.post('/api/surveys/webhooks', (req,res) => 
    {
        const p = new Path('/api/surveys/:surveyId/:choice');
            
        const event = _.chain(req.body).map(({email,url}) => {

            const match = p.test(new URL(url).pathname);
            if(match)
            {
                return {email,surveyId:match.surveyId, choice:match.choice};
            }
        })
        .compact()
        .uniqBy('email','surveyId')
        .each(({surveyId, email, choice}) => {
            Survey.updateOne({
                _id: surveyId,
                recipients:{
                    $elemMatch:{email: email,responded:false}
                }
            },
            {
                $inc:{[choice]:1},
                $set:{'recipients.$.responded' : true},
                lastResponded:new Date()
            }).exec();
        })
        .value();
        
        console.log(uniqueEvents);
        res.send({});
    });

    app.post('/api/surveys',loginRequired,creditsRequired,async (req,res) => {

        const {title,subject,body,recipients} = req.body;
        const survey = new Survey({
            title,
            subject,
            body,
            recipients: recipients.split(',').map(email => ({email:email.trim()})),
            _user:req.user,
            dateSent:Date.now()
        });
        
        const mailer = new Mailer(survey,surveyTemplate(survey));
        try
        {
            await mailer.send();
            await survey.save();
            req.user.credits -= 1;
            const user = await req.user.save();
            res.send(user);
        }
        catch(err)
        {
            res.status(422).send(err);
        }
    });
}