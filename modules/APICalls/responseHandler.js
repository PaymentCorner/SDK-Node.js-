module.exports.errorCodes = {
    400: 'Bad request',
    401: 'Unauthorised/expired token',
    404: 'Not found',
    405: 'Method not allowed',
    408: 'Request timeout',
    412: 'Precondition failed',
    429: 'Too many requests',
    500: 'Internal server error',
    503: 'Service unavailable',
    default: 'Unable to handle request'
};

module.exports.handleError = (error) => {
    console.log(error.body);
    if ((typeof error.body.error) === 'string') {
        return (error.body.error)
    }
    if ((typeof error.body.error) === 'object') {
        return (Object.values(error.body.error).join(','));
    }

};

module.exports.handleResponse = (response) => {
    if (response['status']) {
        return {success: true, data: response.result};
    }
    else {
        if ((typeof response.error) === 'string') {
            return (response.error)
        }
        if ((typeof response.error) === 'object') {
            return (Object.values(response.error).join(','));
        }
    }

};
