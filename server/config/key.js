// if in production mode, export production file module
// if not export development file module
if (process.env.NODE_ENV === 'production') {
    module.exports = require('./prod');
}
else {
    module.exports = require('./dev');
}