module.exports.log = function () {
    process.env.paymentSDKSandBoxMode ? console.log.apply(this, arguments) : '';
};
module.exports.warn = function () {
    process.env.paymentSDKSandBoxMode ? console.warn().apply(this, arguments) : '';
};
module.exports.error = function () {
    process.env.paymentSDKSandBoxMode ? console.error().apply(this, arguments) : '';
};