import React,{Component} from 'react';
import _ from 'lodash';
import {reduxForm, Field} from 'redux-form';
import { Link } from 'react-router-dom';
import validateEmails from '../../utils/validateEmail';
import SurveyField from './SurveyField';
import formFields from './formFields';


class SurveyForm extends Component {
    RenderFields()
    {
        return(
            _.map(formFields, ({name,label}) => {
                return(<Field key={name} label={label} type="text" name={name} component={SurveyField} />);
            })
        );
    }
    render(){
        return(
            <div>
                <form onSubmit={this.props.handleSubmit(this.props.onSurveySubmit)}>
                {this.RenderFields()}
                <Link to="/surveys" className="red btn-flat white-text">Cancle</Link>
                <button type="submit" className="teal btn-flat right white-text">Next<i className="material-icons right">done</i></button>
                </form>
            </div>
        );
    }
}
function validate(values){
    const errors = {}

    
    errors.recipients = validateEmails(values.recipients || ' ');
    _.each(formFields,({name,noValueError}) => {
        if(!values[name])
        {
            errors[name] = noValueError;
        } 
    });
    
    return errors;
}
export default reduxForm({
    validate,
    form:'surveyForm',
    destroyOnUnmount:false
})(SurveyForm);