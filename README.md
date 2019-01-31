

![alt text <>](http://documentationapi.paymentcorner.com/images/doc_image.png "")

# **Payment Corner Node JS SDK**


[![Version](https://img.shields.io/badge/npm-v%206.1.0-brightgreen.svg)]() [![Build Status](https://img.shields.io/badge/node-%3E%3D%20V%208%20.X-blue.svg)]()



## Introduction
Payment Corner (Switzerland) Ltd is an open foreign exchange platform that enables customers to create their own products that need Forex capabilities into their systems, apps and workflows.

Customers connect to Payment Corner platform via Node JS SDK using their client ID , email and password which can be obtained from the user dashboard.


## Supported Currencies
Our FX platform currently supports the following 28 currencies:

| Currency (ISO)| Currency   | SWIFT  | Local Payment |
| ------------- |:-------------:| -----:|-----:|
|AUD	|Australian Dollar |	Yes | 	Yes |
|GBP	|British Pound	|Yes	|Yes |
|BGN	|Bulgarian Lev	|Yes	|No  |
|CAD	|Canadian Dollar	|Yes|	Yes |
|CNY	|Chinese Yuan Renminbi	|Yes|	No  |
|HRK	|Croatian Kuna	|Yes	|No  |
|CZK	|Czech Koruna	|Yes	|Yes |
|AED	|Emirati Dirham	|Yes	|No  |
|EUR	|Euro	|Yes	|Yes |
|HKD	|Hong Kong Dollar|	Yes	|Yes |
|HUF	|Hungarian Forint	|Yes|	Yes |
|ILS	|Israeli Shekel|	Yes	|No  |
|JPY	|Japanese Yen	|Yes|	No  |
|MXN	|Mexican Peso	|Yes	|Yes |
|NZD	|New Zealand Dollar|	Yes|	No  |
|NOK	|Norwegian Krone|	Yes	|Yes |
|PLN	|Polish Zloty	|Yes|	Yes |
|QAR	|Qatari Rial|	Yes	|No  |
|RON	|Romanian New Leu	|Yes	|No  |
|RUB	|Russian Ruble (Sell only)	|Yes	|No  |
|SAR	|Saudi Riyal	|Yes|	No  |
|SGD	|Singapore Dollar|	Yes|	Yes |
|ZAR	|South African Rand	|Yes	|No  |
|SEK	|Swedish Krona	|Yes	|Yes |
|CHF	|Swiss Franc	|Yes|	No  |
|THB	|Thai Baht	|Yes|	No  |
|TRY	|Turkish Lira|	Yes	|No  |
|USD	|United States Dollar|	Yes|	Yes |

## Installation
Install the package with:
````npm i @accubits/payment-corner````

## Usage
The package needs to be configured with your account's email , passpword and client id, Client id can be obtained from your Payment Corner Dashboard.

```javascript
const paymentCorner = require('@accubits/payment-corner');

let Payment = new paymentCorner({
    email: 'user@domain.com',
    password: 'password',
    client_id: 'xxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxx',
    sandbox: true
});
````

## Enable  sandbox Mode

Set  `sandbox : true` while Initalizing the SDK .

## FX Transaction
Proceed with an FX transaction (buy and sell side), get your quote and confirm the FX trade.

__Required Parameters__

| Parameter| Description   |
| ------------- |:-------------:| 
|currency_to_buy|	ISO 4217 format ( YYYY-MM-DD) |
|currency_to_sell|		ISO 4217 format ( YYYY-MM-DD)|
|side_of_fx_tx	|	Choose the side of the FX transaction|
|amount|		Amount of the fixed side|
|fx_tx_gtc|		General terms and conditions|

__Optional Parameters__

| Parameter| Description   |
| ------------- |:-------------:| 
|fx_tx_date	|	ISO 8601 format (YYYY-MM-DD)|
|amount_to_buy|		Amount of buy side|
|amount_to_sell|		Amount of sell side|
|fx_tx_unique_id|		Idempotency key|

__Usage__
````javascript

    Payment.fxTransaction({
        currency_to_buy: 'EUR',
        currency_to_sell: 'USD',
        side_of_fx_tx: 'sell',
        amount: 150,
        fx_tx_gtc: true,
    }).then(data => {
        console.log("fxTransaction result", data);
    }).catch(err => {
        console.log("fxTransaction err", err);
    });

````
___Result___

````javascript
{ 
    path: '1ca9c450-0c48-472c-9fc1-6ae0544b3f2c',
    date_of_settlement: '2019-01-28T14:30:00+00:00',
    fx_tx_date: '2019-01-28T00:00:00+00:00',
    creator_contact_id: '08b45825-3ded-481d-ac93-9c22b908e10a',
    account_id: '0f1c61be-64ca-4c93-bdd3-1b384370378e',
    currency_pair: 'EURUSD',
    currency_to_buy: 'EUR',
    currency_to_sell: 'USD',
    amount_to_buy: '126.51',
    amount_to_sell: '150.00',
    side_of_fx_tx: 'sell',
    market_rate: '1.1857',
    client_net_rate: '1.1857',
    fx_tx_unique_id: null,
    fx_tx_creation_date: '2019-01-28T08:49:10+00:00',
    fx_tx_update_date: '2019-01-28T08:49:10+00:00',
    mid_market_rate: '1.1856',
    fx_tx_status: 'Funds_to_receive',
    ref: '20190128-ZVDHJZ-EbJF8960'
  }

````

__Fx transaction status__ (fx_tx_status)

| status| Description   |
| ------------- |:-------------:| 
|Funds_to_receive	|Funds that are related to a FX transaction and that have not reached Payment Corner settlement account(s) yet|
|Funds_sent|	Funds have been sent by Payment Corner to requested beneficiary|
|Funds_received|Funds have been received by Payment Corner|
|FX_deal_settled|The FX transaction is completed|
|FX_deal_closed|	The FX transaction has been cancelled|


## Retrieve FX Transaction(s)
Retrieve one or several FX transaction(s) based on one or several parameter(s).

__Optional Parameters__

| Parameter| Description   |
| ------------- |:-------------:| 
|ref|Reference code|
|fx_tx_status|FX transaction status|
|currency_to_buy|The ISO 4217 format|
|currency_to_sell|The ISO 4217 format|
|fx_tx_id|One or several ID(s) to retrieve one or several FX transaction(s)|
|tx_from_first|ISO 8601 format (e.g.2018-11-30)|
|tx_to_last|ISO 8601 format (e.g.2018-11-30)|
|tx_time_update_first|ISO 8601 format (e.g.2018-11-30)|
|tx_time_update_last|ISO 8601 format (e.g.2018-11-30)|
|tx_date_from|ISO 8601 format (e.g.2018-11-30)|
|tx_date_to|ISO 8601 format (e.g.2018-11-30)|
|currency_pair|Two ISO 4217 format concatenated|
|min_amount_to_buy|Minimum amount on buy side|
|max_amount_to_buy|Maximum amount on buy side|
|min_amount_to_sell|Minimum amount of sell side|
|max_amount_to_sell|Maximum amount on sell side|
|date_tx_debit_first|ISO 8601 format (e.g.2018-11-30)|
|date_tx_debit_last|ISO 8601 format (e.g.2018-11-30)|
|fx_tx_unique_id|Idempotency key|
|page_nb|Page number|
|result_per_page|Number of results per page|
|sort_order|Change the sort order|
|sort_asc_to_desc|Sort in ascending or descending order.

__Usage__

````javascript
  Payment.retrieveFxTransaction({
  
    })
    .then(data => {
        console.log("retrieveFxTransaction", data);
    })
    .catch(err => {
        console.log("retrieveFxTransaction err", err);
    });
````

__Result__

````javascript
{
         "conversions": [
         {
             "path": "832d46cd-d0ec-4717-9435-cc34d587dc95",
             "date_of_settlement": "2018-11-28T16:30:00+00:00",
             "date_of_conversion": "2018-11-28T00:00:00+00:00",
             "creator_contact_id": "f72a98bf-2d4d-421f-b5c1-425d19077002",
             "account_id": "0f1c61be-64ca-4c93-bdd3-1b384370378e",
             "currency_pair": "GBPUSD",
             "currency_to_buy": "USD",
             "currency_to_sell": "GBP",
             "amount_to_buy": "1000.00",
             "amount_to_sell": "710.28",
             "side_of_fx_tx": "buy",
             "client_rate": "1.4079",
             "fx_tx_unique_id": null,
             "fx_tx_creation_date": "2018-11-26T09:00:48+00:00",
             "fx_tx_update_date": "2018-11-28T06:31:04+00:00",
             "mid_market_rate": "1.4080",
             "fx_tx_status": "FX_deal_settled",
             "ref": "20181126-KSBMRW-IWwN2584"
         }
         ],
         "pagination": {
             "tot_nbr_entries": 2,
             "tot_nbr_pages": 1,
             "current_page": 1,
             "result_per_page": 25,
             "goto_previous_page": -1,
             "goto_next_page": 2,
             "sort_order": "created_at",
             "sort_asc_to_desc": "asc"
         }
     }
````

## Retrieve a FX Transaction Record

Retrieve a single FX transaction based on the unique FX transaction ID.


__Required Parameters__

| Parameter| Description   |
| ------------- |:-------------:| 
|path|	Conversion UUID|

__Usage__

````javascript
    
     Payment.retrieveFxTransactionRecord({
        path: '832d46cd-d0ec-4717-9435-cc34d587dc95'
    })
    .then(data => {
        console.log("retrieveFxTransactionRecord", data);
    })
    .catch(err => {
        console.log("retrieveFxTransactionRecord err", err);
    })

````

__Result__

````javascript
{
          "path": "832d46cd-d0ec-4717-9435-cc34d587dc95",
          "date_of_settlement": "2018-11-28T16:30:00+00:00",
          "date_of_conversion": "2018-11-28T00:00:00+00:00",
          "creator_contact_id": "f72a98bf-2d4d-421f-b5c1-425d19077002",
          "account_id": "0f1c61be-64ca-4c93-bdd3-1b384370378e",
          "currency_pair": "GBPUSD",
          "currency_to_buy": "USD",
          "currency_to_sell": "GBP",
          "amount_to_buy": "1000.00",
          "amount_to_sell": "710.28",
          "side_of_fx_tx": "buy",
          "client_rate": "1.4079",
          "fx_tx_unique_id": null,
          "fx_tx_creation_date": "2018-11-26T09:00:48+00:00",
          "fx_tx_update_date": "2018-11-28T06:31:04+00:00",
          "mid_market_rate": "1.4080",
          "fx_tx_status": "FX_deal_settled",
          "ref": "20181126-KSBMRW-QgGW6160"
      }
````

## Change FX conversion value date

Change FX conversion value date by using the unique FX transaction path.

__Required Parameters__

| Parameter| Description   |
| ------------- |:-------------:| 
|path|ID of the conversion that is being changed|
|new_date_fx_tx	|New FX transaction settlement date (YYYY-MM-DD)|

__Usage__
````javascript
 Payment.changeFxConversionValueDate({
        path: 'e5cce1bf-af7e-4633-b6ae-bae4b8bcaf36',
        new_date_fx_tx: '2019-01-28'
    })
    .then(data => {
        console.log("changeFxConversionValueDate", data);
    })
     .catch(err => {
       console.log("changeFxConversionValueDate err", err.message)
    });
````

__Result__

````javascript
 {
         "path": "e5cce1bf-af7e-4633-b6ae-bae4b8bcaf36",
         "amount": "2.00",
         "currency": "USD",
         "new_conversion_date": "2018-12-20T00:00:00+00:00",
         "new_date_fx_tx": "2018-12-20T16:30:00+00:00",
         "old_conversion_date": "2018-12-11T00:00:00+00:00",
         "old_settlement_date": "2018-12-11T16:30:00+00:00",
         "event_date_time": "2018-12-11T06:37:12+00:00"
     }
````

## Change FX Conversion Delivery Date Quotation

Allows you to get the new rates in case you want to change the FX transaction settlement date.

__Required Parameters__

| Parameter| Description   |
| ------------- |:-------------:| 
|path|Conversion UUID|
|new_date_fx_tx	|Desired new settlement date of conversion (YYYY-MM-DD)|

__Usage__

````javascript

    Payment.changeFxConversionDeliveryDateQuotation({
        path: 'e5cce1bf-af7e-4633-b6ae-bae4b8bcaf36',
        new_date_fx_tx: '2019-01-28'
    })
    .then(data => {
            console.log("changeFxConversionDeliveryDateQuotation", data);
    })
    .catch(err => {
            console.log("changeFxConversionDeliveryDateQuotation err", err.message);
    });

````

__Result__
````javascript
{
         "path": "e5cce1bf-af7e-4633-b6ae-bae4b8bcaf36",
         "amount": "2.00",
         "currency": "USD",
         "new_conversion_date": "2018-12-20T00:00:00+00:00",
         "new_date_fx_tx": "2018-12-20T16:30:00+00:00",
         "old_conversion_date": "2018-12-11T00:00:00+00:00",
         "old_settlement_date": "2018-12-11T16:30:00+00:00",
         "event_date_time": "2018-12-11T06:37:12+00:00"
     }
````

## FX market rate w/ mark-up

Get the FX market rate of any currency pairs which includes your mark-up.

__Required Parameters__

| Parameter| Description   |
| ------------- |:-------------:| 
|currency_to_buy|	ISO 4217 format|
|currency_to_sell|	ISO 4217 format|
|side_of_fx_tx|	Choose the side of the FX transaction|
|amount|	Amount of the fixed buy or sell currency|

__Usage__

```javascript

    Payment.fxMarketRateWithMarkUp({
        currency_to_buy: 'USD',
        currency_to_sell: 'GBP',
        side_of_fx_tx: 'buy',{
         "settlement_cut_off_time": "2018-12-13T16:30:00Z",
         "currency_pair": "GBPUSD",
         "currency_to_buy": "USD",
         "currency_to_sell": "GBP",
         "amount_to_buy": "10.00",
         "amount_to_sell": "7.10",
         "side_of_fx_tx": "buy",
         "client_rate": "1.4079",
         "mid_market_rate": "1.4080"
     }
        amount: 10.00
    })
    .then(data => {
       console.log("fxMarketRateWithMarkUp ", data);
     })
     .catch(err => {
        console.log("fxMarketRateWithMarkUp err", err)
     });
````

__Result__

````javascript

{
    "settlement_cut_off_time": "2018-12-13T16:30:00Z",
    "currency_pair": "GBPUSD",
    "currency_to_buy": "USD",
    "currency_to_sell": "GBP",
    "amount_to_buy": "10.00",
    "amount_to_sell": "7.10",
    "side_of_fx_tx": "buy",
    "client_rate": "1.4079",
    "mid_market_rate": "1.4080"
}
````

## FX Market Rate

Get the interbank rates for any currency pairs.


__Required Parameters__

| Parameter| Description   |
| ------------- |:-------------:| 
|currency_pair|	ISO 4217 format(YYYY-MM-DD)|

__Usage__
````javascript

    Payment.fxMarketRate({
        currency_pair: 'GBPUSD'
    })
    .then(data => {
        console.log("fxMarketRate", data);
    })
    .catch(err => {
        console.log("fxMarketRate err", err);
    });
````

__Result__

````javascript
{
    "rates": {
        "GBPUSD": [
            "1.407700",
            "1.408300"
        ]
    },
    "unavailable": []
}
````


