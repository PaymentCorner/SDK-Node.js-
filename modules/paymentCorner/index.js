const config = require('../config');
const api = require('../APICalls/index');
const errorMessages = require('../errorMessages');
const utils = require('../utils');

class Payment {
    constructor(data) {
        this.email = '';
        this.password = '';
        this.client_id = '';
        this.sandbox = false;
        data.email ? this.setEmail(data.email) : '';
        data.password ? this.setPassword(data.password) : '';
        data.client_id ? this.setClientId(data.client_id) : '';
        this.API = new api();
        data.sandbox ? this.setSandBoxMode(data.sandbox) : '';
    }

    setEmail(email) {
        if (!email) {
            throw new Error(errorMessages.invalidEmail);
        }
        this.email = email;
    }

    setPassword(password) {
        if (!password) {
            throw new Error(errorMessages.invalidPassword);
        }
        this.password = password;
    }

    setClientId(clientId) {
        if (!clientId) {
            throw new Error(errorMessages.invalidClientId);
        }
        this.client_id = clientId;
    }

    setSandBoxMode(mode) {
        if (!mode) {
            this.sandbox = false;
            process.env.paymentSDKSandBoxMode = false;
            this.API.setAPIBaseURL(config.APIBaseURLSandBox);
            return;
        }
        this.sandbox = true;
        process.env.paymentSDKSandBoxMode = true;
        this.API.setAPIBaseURL(config.APIBaseURLProduction);
    }


    getEmail() {
        return this.email;
    }

    getPassword() {
        return this.password;
    }

    getClientId() {
        return this.client_id;
    }

    getDevMode() {
        return this.sandbox;
    }

    getAPIBaseURL() {
        return this.API.getAPIBaseURL();
    }


    async login() {
        if (!this.email) {
            throw new Error(errorMessages.invalidEmail)
        }
        if (!this.password) {
            throw new Error(errorMessages.invalidPassword);
        }
        if (!this.client_id) {
            throw  new Error(errorMessages.invalidClientId);
        }
        let result;
        try {
            result = await this.API.post(
                config.APIURL.login,
                {
                    email: this.email,
                    password: this.password,
                    session_time: 5
                },
                utils.httpHelpers.setHeaders()
            );
            utils.logger.log("login", result);
        }
        catch (e) {
            utils.logger.log("e", e);
            if ((typeof e) === 'string') {
                throw new Error(e);
            }
            throw new Error(e.message);
        }
        if (!result['success']) {
            throw new Error(result['error']);
        }

        return result;
    }

    async logout(token) {
        if (!token) {
            throw new Error(errorMessages.invalidToken);
            return
        }
        let result;
        try {
            console.log(utils.httpHelpers.setHeaders(token));
            result = await this.API.post(config.APIURL.logout, {}, utils.httpHelpers.setHeaders(token));
            utils.logger.log("logout", result);
        }
        catch (e) {
            utils.logger.log(e);
            if ((typeof e) === 'string') {
                throw new Error(e);
            }
            throw new Error(e.message);
        }

        if (!result['success']) {
            throw new Error(result['error']);
        }

        return result;
    }

    async fxTransaction(data) {

        data.client_id = this.client_id;

        if (!data.currency_to_buy || data.currency_to_buy.length !== 3 || !(data.currency_to_buy === data.currency_to_buy.toUpperCase())) {
            throw new Error(errorMessages.invalidCurrencyToBuy);
        }
        if (!data.currency_to_sell || data.currency_to_sell.length !== 3 || !(data.currency_to_sell === data.currency_to_sell.toUpperCase())) {
            throw new Error(errorMessages.invalidCurrencyToSell);
        }
        if (!data.side_of_fx_tx) {
            throw new Error(errorMessages.invalidSideOfFxTx);
        }
        if (isNaN(data.amount)) {
            throw new Error(errorMessages.invalidAmount);
        }
        if (!(data.fx_tx_gtc === true || data.fx_tx_gtc === false)) {
            throw new Error(errorMessages.invalidFxTxGtc);
        }

        //Optional Params

        if (data.fx_tx_date) {
            if (!new Date(data.fx_tx_date).getTime()) {
                throw new Error(errorMessages.invalidFxTxDate);
            }
        }

        if (data.amount_to_sell) {
            if (isNaN(data.amount_to_sell)) {
                throw new Error(errorMessages.invalidAmountToSell);
            }
        }
        if (data.amount_to_buy) {
            if (isNaN(data.amount_to_buy)) {
                throw new Error(errorMessages.invalidAmountToBuy);
            }
        }

        // data.fx_tx_unique_id

        let fxTransactionResult;
        try {
            let loginResult = await this.login();
            fxTransactionResult = await this.API.post(config.APIURL.fx_transaction, data, utils.httpHelpers.setHeaders(loginResult.data.auth_token));
        }
        catch (e) {
            utils.logger.log(e);
            if ((typeof e) === 'string') {
                throw new Error(e);
            }
            throw new Error(e.message);
        }

        if (!fxTransactionResult['success']) {
            throw new Error(fxTransactionResult['error']);
        }

        return fxTransactionResult.data;


    }

    async retrieveFxTransaction(data) {

        data.client_id = this.client_id;

        // All Parameters are optional

        if (data.currency_to_buy) {
            if (!data.currency_to_buy || data.currency_to_buy.length !== 3 || !(data.currency_to_buy === data.currency_to_buy.toUpperCase())) {
                throw new Error(errorMessages.invalidCurrencyToBuy);
            }
        }
        if (data.currency_to_sell) {
            if (!data.currency_to_sell || data.currency_to_sell.length !== 3 || !(data.currency_to_sell === data.currency_to_sell.toUpperCase())) {
                throw new Error(errorMessages.invalidCurrencyToSell);
            }
        }
        if (data.fx_tx_status) {
            if (['Funds_to_receive', 'Funds_sent', 'Funds_received', 'FX_deal_settled', 'FX_deal_closed'].indexOf(data.fx_tx_status) < 0) {
                throw new Error(errorMessages.invalidFxTxStatus);
            }
        }
        if (data.fx_tx_creation_date_from) {
            if (!new Date(data.fx_tx_creation_date_from).getTime()) {
                throw new Error(errorMessages.invalidFxTxCreationDateFrom);
            }
        }
        if (data.fx_tx_creation_date_last) {
            if (!new Date(data.fx_tx_creation_date_last).getTime()) {
                throw new Error(errorMessages.invalidFxTxCreationDateLast);
            }
        }
        if (data.fx_tx_update_date_from) {
            if (!new Date(data.fx_tx_update_date_from).getTime()) {
                throw new Error(errorMessages.invalidFxTxUpdateDateFrom);
            }
        }
        if (data.fx_tx_update_date_last) {
            if (!new Date(data.fx_tx_update_date_last).getTime()) {
                throw new Error(errorMessages.invalidFxTxUpdateDateLast);
            }
        }
        if (data.tx_date_from) {
            if (!new Date(data.tx_date_from).getTime()) {
                throw new Error(errorMessages.invalidTxDateFrom);
            }
        }
        if (data.tx_date_to) {
            if (!new Date(data.tx_date_to).getTime()) {
                throw new Error(errorMessages.invalidTxDateTo);
            }
        }
        if (data.min_amount_to_buy) {
            if (isNaN(data.min_amount_to_buy)) {
                throw new Error(errorMessages.invalidMinAmountToBuy);
            }
        }
        if (data.max_amount_to_buy) {
            if (isNaN(data.max_amount_to_buy)) {
                throw new Error(errorMessages.invalidMaxAmountToBuy);
            }
        }
        if (data.min_amount_to_sell) {
            if (isNaN(data.min_amount_to_sell)) {
                throw new Error(errorMessages.invalidMinAmountToSell);
            }
        }
        if (data.max_amount_to_sell) {
            if (isNaN(data.max_amount_to_sell)) {
                throw new Error(errorMessages.invalidMaxAmountToSell);
            }
        }
        if (data.date_tx_debit_first) {
            if (!new Date(data.date_tx_debit_first).getTime()) {
                throw new Error(errorMessages.invalidDateTxDebitFirst);
            }
        }
        if (data.date_tx_debit_last) {
            if (!new Date(data.date_tx_debit_last).getTime()) {
                throw new Error(errorMessages.invalidDateTxDebiDateTxDebitLastFirst);
            }
        }
        if (data.page_nb) {
            if (isNaN(data.page_nb)) {
                throw new Error(errorMessages.invalidPageNb);
            }
        }
        if (data.result_per_page) {
            if (isNaN(data.result_per_page)) {
                throw new Error(errorMessages.invalidResultPerPage);
            }
        }
        if (data.sort_order) {
            if ([
                'amount_to_sell', 'amount_to_buy', 'fx_tx_creation_date', 'fx_tx_update_date', 'currency_to_buy', 'currency_to_sell',
                'currency_pair', 'date_of_settlement', 'fx_tx_date'].indexOf(data.sort_order) < 0) {
                throw new Error(errorMessages.invalidSortOrder);
            }
        }
        if (data.sort_asc_to_desc) {
            if (!(data.sort_asc_to_desc === 'asc' || data.sort_asc_to_desc === 'desc')) {
                throw new Error(errorMessages.invalidSortAscToDesc);
            }
        }
        //currency_pair
        let result;
        try {
            let loginResult = await this.login();
            result = await this.API.post(config.APIURL.retrieve_fx_transaction, data, utils.httpHelpers.setHeaders(loginResult.data.auth_token));
        }
        catch (e) {
            utils.logger.log(e);
            if ((typeof e) === 'string') {
                throw new Error(e);
            }
            throw new Error(e.message);
        }
        if (!result['success']) {
            throw new Error(result['error']);
        }

        return result.data;

    }

    async retrieveFxTransactionRecord(data) {
        if (!data) {
            throw new Error(errorMessages.invalidPayload)
        }
        data.client_id = this.client_id;
        if (!data.path) {
            throw new Error(errorMessages.invalidPath);
        }

        let result;
        try {
            let loginResult = await this.login();
            result = await this.API.post(config.APIURL.retrieve_fx_transaction_record, data, utils.httpHelpers.setHeaders(loginResult.data.auth_token));
        }
        catch (e) {
            utils.logger.log(e);
            if ((typeof e) === 'string') {
                throw new Error(e);
            }
            throw new Error(e.message);
        }

        if (!result['success']) {
            throw new Error(result['error']);
        }

        return result.data;

    }

    async changeFxConversionValueDate(data) {
        if (!data) {
            throw new Error(errorMessages.invalidPayload)
        }
        data.client_id = this.client_id;
        if (!data.path) {
            throw new Error(errorMessages.invalidPath);
        }

        if (!new Date(data.new_date_fx_tx).getTime()) {
            throw new Error(errorMessages.invalidNewDateFxTx);
        }


        let result;
        try {
            let loginResult = await this.login();
            result = await this.API.post(config.APIURL.change_fx_conversion_value_date, data, utils.httpHelpers.setHeaders(loginResult.data.auth_token));
        }
        catch (e) {
            utils.logger.log(e);
            if ((typeof e) === 'string') {
                throw new Error(e);
            }
            throw new Error(e.message);
        }
        if (!result['success']) {
            throw new Error(result['error']);
        }

        return result.data;

    }

    async changeFxConversionDeliveryDateQuotation(data) {
        if (!data) {
            throw new Error(errorMessages.invalidPayload)
        }
        data.client_id = this.client_id;
        if (!data.path) {
            throw new Error(errorMessages.invalidPath);
        }
        if (!new Date(data.new_date_fx_tx).getTime()) {
            throw new Error(errorMessages.invalidNewDateFxTx);
        }


        let result;
        try {
            let loginResult = await this.login();
            result = await this.API.post(config.APIURL.change_fx_conversion_delivery_date_quotation, data, utils.httpHelpers.setHeaders(loginResult.data.auth_token));
        }
        catch (e) {
            utils.logger.log(e);
            if ((typeof e) === 'string') {
                throw new Error(e);
            }
            throw new Error(e.message);
        }

        if (!result['success']) {
            throw new Error(result['error']);
        }

        return result.data;

    }

    async fxMarketRateWithMarkUp(data) {
        if (!data) {
            throw new Error(errorMessages.invalidPayload)
        }
        data.client_id = this.client_id;
        if (!data.currency_to_buy || data.currency_to_buy.length !== 3 || !(data.currency_to_buy === data.currency_to_buy.toUpperCase())) {
            throw new Error(errorMessages.invalidCurrencyToBuy);
        }
        if (!data.currency_to_sell || data.currency_to_sell.length !== 3 || !(data.currency_to_sell === data.currency_to_sell.toUpperCase())) {
            throw new Error(errorMessages.invalidCurrencyToSell);
        }
        if (['buy', 'sell'].indexOf(data.side_of_fx_tx) < 0) {
            throw new Error(errorMessages.invalidSideOfFxTx);
        }
        if (isNaN(data.amount)) {
            throw new Error(errorMessages.invalidAmount);
        }

        //optional Parameters

        if (data.fx_tx_date) {
            if (!new Date(data.fx_tx_date).getTime()) {
                throw new Error(errorMessages.invalidFxTxDate);
            }
        }


        let result;
        try {
            let loginResult = await this.login();
            result = await this.API.post(config.APIURL.fx_marketRate_with_markUp, data, utils.httpHelpers.setHeaders(loginResult.data.auth_token));
        }
        catch (e) {
            utils.logger.log(e);
            if ((typeof e) === 'string') {
                throw new Error(e);
            }
            throw new Error(e.message);
        }

        if (!result['success']) {
            throw new Error(result['error']);
        }

        return result.data;


    }

    async fxMarketRate(data) {
        if (!data) {
            throw new Error(errorMessages.invalidPayload)
        }
        data.client_id = this.client_id;
        if (!data.currency_pair) {
            throw new Error(errorMessages.invalidCurrencyPair)
        }


        let result;
        try {
            let loginResult = await this.login();
            result = await this.API.post(config.APIURL.fx_market_rate, data, utils.httpHelpers.setHeaders(loginResult.data.auth_token));
        }
        catch (e) {
            utils.logger.log(e);
            if ((typeof e) === 'string') {
                throw new Error(e);
            }
            throw new Error(e.message);
        }

        if (!result['success']) {
            throw new Error(result['error']);
        }

        return result.data;

    }

}

module.exports = Payment;


