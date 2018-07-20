module.exports = (req,res,next) => {
    if(!req.user)
    {
        return req.status(401).send({error:'you must login!'});
    }
    next();
}