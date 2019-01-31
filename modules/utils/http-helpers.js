module.exports.setHeaders = (token) => {
    let header = {
        // 'Content-Type': 'application/json'
    };
    if (token) {
        header['auth_token'] = token;
    }
    return header;
};