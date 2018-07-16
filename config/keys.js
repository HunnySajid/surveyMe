//keys.js figure out what set of credentials to return

if(process.env.NODE_ENV === 'production')
{
    //we are in production mode- return prod keys
    module.exports = require('./prod');
}
else {
    //we are in development mode - return dev keys
    module.exports = require('./dev');
}