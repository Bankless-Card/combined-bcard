import * as bodyParser from "body-parser";
import * as express from "express";
import { Logger } from "../logger/logger";
import * as dotenv from 'dotenv';       // environment variables
dotenv.config();                        // init


//move to secured variable
let REACT_APP_TATUM_API_FREE_MAINNET = process.env.REACT_APP_TATUM_API_FREE_MAINNET; 
let REACT_APP_TATUM_API_FREE_TESTNET = process.env.REACT_APP_TATUM_API_FREE_TESTNET;
let activeAPI = REACT_APP_TATUM_API_FREE_TESTNET;

let TATUM_API_URL = "https://api-eu1.tatum.io/v3/";
let CG_API_URL = "https://api.coingecko.com/api/v3/";       

const axios = require('axios');

const tatumHeaders = { 'x-api-key': activeAPI, 'x-testnet-type': 'ethereum-goerli' };
const tatumHeadersPost = { 'x-api-key': activeAPI, 'Content-Type': 'application/json', 'x-testnet-type': 'ethereum-goerli' };
const coinGeckoHeaders = {'accept': 'application/json'}



class User {

    public express: express.Application;
    public logger: Logger;

    // array to hold users
    public users: any[];
    // array to hold trades executed
    public trades: any[];

    constructor() {
        this.express = express();
        this.middleware();
        this.routes();
        this.users = [];
        // this.trades = [];
        this.logger = new Logger();
    }

    // Configure Express middleware.
    private middleware(): void {
        this.express.use(bodyParser.json());
        this.express.use(bodyParser.urlencoded({ extended: false }));
    }

    private routes(): void {


    /*************************** LIVE ROUTES *****************************/
        // BUTTON request to get all the prices
        this.express.get("/prices/:base", async (req, res, next) => {

            this.logger.info("url:" + req.url);

            let pricesBase = "USD";
            // override base price if set (USD/CAD, etc.)
            if(req.params.base !== undefined) {
                console.log("Override")
                pricesBase = req.params.base;
            } 

            interface Prices { base: string, eth: number, usd: number, btc: number, chf:number, bank:number, time: number };        // storage variable for future export
            let prices: Prices = {
                base: pricesBase,
                eth: 0.1,
                usd: 0.1,
                btc: 0.1,
                chf: 0.1,
                bank: 0.1,
                time: 1
            };

            

            // console.log(req.params.base, prices.base)

            console.log("FUTURE IMPLEMENTAION: LIST OF INPUTS AND BASE, THEN LOOP");
            
            // FIRST ONE
            axios.get(TATUM_API_URL+'tatum/rate/ETH?basePair=' + prices.base, {
                headers: tatumHeaders
            })
            .then((response:any) => {
                // console.log(response.data);     // this shows the correctly retrieved data in the server console
                prices.eth = response.data.value;
                prices.time = response.data.timestamp;

                // SECOND ONE
                axios.get(TATUM_API_URL+'tatum/rate/USD?basePair='+ prices.base, {
                    headers: tatumHeaders
                })
                .then((response:any) => {
                    //console.log(response.data);     // this shows the correctly retrieved data in the server console
                    prices.usd = response.data.value;
                    if(response.data.timestamp > prices.time) prices.time = response.data.timestamp;


                    // THIRD ONE
                    axios.get(TATUM_API_URL+'tatum/rate/CHF?basePair='+ prices.base, {
                        headers: tatumHeaders
                    })
                    .then((response:any) => {
                        // console.log(response.data);     // this shows the correctly retrieved data in the server console
                        prices.chf = response.data.value;
                        if(response.data.timestamp > prices.time) prices.time = response.data.timestamp;

                        // FOURTH ONE
                        axios.get(TATUM_API_URL+'tatum/rate/BTC?basePair='+ prices.base, {
                            headers: tatumHeaders
                        })
                        .then((response:any) => {
                            // console.log(response.data);     // this shows the correctly retrieved data in the server console
                            prices.btc = response.data.value;
                            if(response.data.timestamp > prices.time) prices.time = response.data.timestamp;

                            // console.log("Final prices object");
                            // console.log(prices);

                            // one more API call for BANK (CoinGecko)

                            // inputs for coinGecko API
                            let tokenId = 'bankless-dao';
                            // let baseCurrency = 'CAD';
                            let precision = '6';        // significat digtis


                            console.log("Using Coin Gecko API for BANK token.");
                            axios.get(CG_API_URL + 'simple/price?ids='+tokenId+'&vs_currencies='+ prices.base+'&precision='+precision, {
                            headers: coinGeckoHeaders
                            })
                            .then((response:any) => {
                                // console.log(response.data);     // this shows the correctly retrieved data in the server console

                                if(prices.base === "USD"){
                                    prices.bank = response.data['bankless-dao'].usd.toString();

                                } else {
                                    // default CAD
                                    prices.bank = response.data['bankless-dao'].cad.toString();

                                }

                                // if(response.data.timestamp > prices.time) prices.time = response.data.timestamp;

                                console.log("Final prices object");
                                console.log(prices);

                                // MOVE SEND RESPONSE TO HERE AND SEND OBJECT WITH ALL DATA
                                res.send(prices);        // return data for prices to the front end
                            })
                            .catch((error:any) => {
                                console.log(error);
                            });

                        })
                        .catch((error:any) => {
                            console.log(error);
                        });


                    })
                    .catch((error:any) => {
                        console.log(error);
                    });


                })
                .catch((error:any) => {
                    console.log(error);
                });


            })
            .catch((error:any) => {
                console.log(error);
            });

            



        });

        // get account info by specified ID number for account
        this.express.get("/ledger/account/:id", (req, res, next) => {
            this.logger.info("url:::::::" + req.url);

            console.log(req.params.id);

            axios.get(TATUM_API_URL + 'ledger/account/' + req.params.id, {
                headers: tatumHeaders,
            })
            .then((response:any) => {

                console.log(response.data);     // this shows the correctly retrieved data in the server console
                
                let firstResponse = response.data;

                // use this to lookup wallet address
                axios.get(TATUM_API_URL + 'offchain/account/' + req.params.id + '/address', {
                    headers: tatumHeaders,
                })
                .then((response:any) => {
                    
                    console.log(response.data);     // this shows the correctly retrieved data in the server console
                    
                    let secondResonse = response.data;
                    let merged = {...firstResponse, ...secondResonse};

                    console.log(merged);        // can get both ok here, can we get them to the front end?

                    let addrForQR = response.data.addres;

                    console.log("LAST Thing: get QR and return to front end" );

                    // THIRD CALL OUT - QR API
                    axios.get('https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=' + req.params.id, {
                            headers: tatumHeaders,
                        })
                        .then((response:any) => {
                            // res.send(merged);        // return data to the front end
                            res.send(JSON.stringify(merged));
                        }).catch((error:any) => {
                            console.log(error);
                        });

                    
                })
                .catch((error:any) => {
                    console.log(error);
                });


            })
            .catch((error:any) => {
                console.log(error);
            });
        });


        // Get/ Refresh all active trades on orderBook
        this.express.get("/trades", (req, res, next) => {
            this.logger.info("url:::::::" + req.url);

            var trades:any = [];        // set to null for each new request

            // const tatumHeadersPost = { 'x-api-key': REACT_APP_TATUM_API_FREE_MAINNET, 'Content-Type': 'application/json' }
            const data = { "pageSize":10 };

            axios.post(TATUM_API_URL + 'trade/buy',  data, {
                headers: tatumHeadersPost,
            })
            .then((response:any) => {
                trades.push(response.data);

                // NOW ALSO GET SELL ORDERS AND RETURN COMPLETE LIST TO USER REQUEST
                axios.post(TATUM_API_URL + 'trade/sell',  data, {
                    headers: tatumHeadersPost,
                })
                .then((response:any) => {
                    console.log(response.data);
                    trades.push(response.data);
                    console.log(trades);
                    res.send(trades);
                })
                .catch((error:any) => {
                    console.log(error);
                });

            })
            .catch((error:any) => {
                console.log(error);
            });

        });

        // ASSET trade request to the TATUM API 
        this.express.post("/trade", (req, res, next) => {
            this.logger.info("url:::::::" + req.url);

            /* req.body has object of type {
                  "type": type,
                  "price": price,
                  "amount": amount,
                  "pair": currency+"/VC_CAD",
                  "currency1AccountId": account1Id,
                  "currency2AccountId": "63583054e6657347720ffe1d",
                  "fee": feeAmount,
                  "feeAccountId": feeAccount     
                }

            */

            // console.log("need to read from body data and then call trade api");     // passed in variable, not realy used verification perhaps)
            console.log(req.body);      // looking for . trade item attached

            axios.post(TATUM_API_URL + 'trade',  req.body, {
                headers: tatumHeadersPost,
            })
            .then((response:any) => {
                console.log(response.data);     // this shows the correctly retrieved data in the server console
                res.send(response.data);        // return data to the front end
            })
            .catch((error:any) => {
                console.log(error);
            });
        });

        // ASSET TRANSFER
        this.express.post("/transfer", (req, res, next) => {
            this.logger.info("url:::::::" + req.url);

            // console.log(req.body);      // looking for . transfer item attached

            axios.post(TATUM_API_URL + 'ledger/transaction',  req.body, {
                headers: tatumHeadersPost,
            })
            .then((response:any) => {
                console.log(response.data);     // this shows the correctly retrieved data in the server console
                res.send(response.data);        // return data to the front end
            })
            .catch((error:any) => {
                console.log(error);
                // console.log(res)
                res.send(error)
            });
        });


    /*************************** ADMIN ONLY ROUTES *****************************/

        // 1. BUTTON request to generate a new ETH Account xpub & mnemonic & address
        this.express.get("/ethereum/wallet/:id", async (req, res, next) => {
            
            this.logger.info("url:" + req.url);

            console.log(req.params.id);                // should be local user ID
            
            // FIRST ONE
            axios.get(TATUM_API_URL + 'ethereum/wallet', {
                headers: tatumHeaders
            })
            .then((response:any) => {
                console.log(response.data);     // this shows the correctly retrieved data in the server console

                // from the respnse data get the xpub and create a wallet right away ?

                let xpub = response.data.xpub;
                console.log(xpub);              // keep this private, also mnemonic

                let body = {
                    "currency": "ETH",
                    "xpub": xpub,
                    "customer": {
                        "externalId": req.params.id,
                        "accountingCurrency": "USD"
                    },
                    "accountingCurrency": "USD"
                }

                console.log(body);      // looking for . trade item attached

                axios.post(TATUM_API_URL + 'ledger/account',  body, {
                    headers: tatumHeadersPost,
                })
                .then((response:any) => {
                    console.log(response.data);     // this shows the correctly retrieved data in the server console

                    // responses.push(response.data);

                    let newAccountId = response.data.id;

                    console.log("TESTING WITH INDEX 1 HARD CODED FOR NEW ACCOUNT CREATION")

                    // also get wallet address and send back to end user (maybe need to make a consolidation object)
                    axios.post(TATUM_API_URL + 'offchain/account/'+ newAccountId+'/address?index=1', {}, {
                        headers: tatumHeaders,
                    })
                    .then((response:any) => {
                        console.log(response.data);     // this shows the correctly retrieved data in the server console

                        res.send(response.data);        // return data to the front end (OR responses)
                    })
                    .catch((error:any) => {
                        console.log(error);
                    });

                })
                .catch((error:any) => {
                    console.log(error);
                });

            })
            .catch((error:any) => {
                console.log(error);
            });


        });

         // 2. BUTTON request to generate a new USDC (ETH MAinnet) Account. 
        // xpub & mnemonic & address
        this.express.get("/usdc/wallet/:id", async (req, res, next) => {
            
            this.logger.info("url:" + req.url);

            console.log(req.params.id);                // should be local user ID
            
            // FIRST ONE
            axios.get(TATUM_API_URL + 'ethereum/wallet', {
                headers: tatumHeaders
            })
            .then((response:any) => {
                console.log(response.data);     // this shows the correctly retrieved data in the server console

                // from the respnse data get the xpub and create a wallet right away ?

                let xpub = response.data.xpub;
                console.log(xpub);              // keep this private, also mnemonic

                // THIS IS THE CALL TO GENERATE THE VISA ACCOUNT (USDC on ETH)

                console.log("for mainnet, change currency to USDC for LIVE token.");

                let body = {
                    "currency": "USDC_V",
                    "xpub": xpub,
                    "customer": {
                        "externalId": req.params.id,
                        "accountingCurrency": "USD"
                    },
                    "accountingCurrency": "USD"
                }



                console.log(body);      // looking for . trade item attached

                axios.post(TATUM_API_URL + 'ledger/account',  body, {
                    headers: tatumHeadersPost,
                })
                .then((response:any) => {
                    console.log(response.data);     // this shows the correctly retrieved data in the server console

                    // responses.push(response.data);

                    let newAccountId = response.data.id;

                    console.log("TESTING WITH INDEX 1 HARD CODED FOR NEW ACCOUNT CREATION - highlander rule")

                    // also get wallet address and send back to end user (maybe need to make a consolidation object)
                    axios.post(TATUM_API_URL + 'offchain/account/'+ newAccountId+'/address?index=1', {}, {
                        headers: tatumHeaders,
                    })
                    .then((response:any) => {

                        console.log("NEXT UP - PRIVATE KEY REQUIRED FOR NUCLEUS AUTH. use wallet PRIVATE_KEY (generate) and API - TBD");

                        let newWalletAddr = response.data.address;

                        console.log(response.data);     // this shows the correctly retrieved data in the server console

                        // alert("ONLYLIVE");

                        console.log("ONLYLIVE Will Need: USDC approval - set $400");

                        let nucleusContract = "0x88E64F31Fa68EDDb97187b403fDFE949d7ED2146";
                        let USDC_Contract = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";       // mainnet
                        let USDC_Testnet = "0x07865c6E87B9F70255377e024ace6630C1Eaa37F";        // goerli - TBD

                        let approveBody = {
                          "chain": "ETH",
                          "amount": "400",
                          "spender": nucleusContract,
                          "contractAddress": USDC_Contract,
                          "fromPrivateKey": "0xPkey"
                        }

                        console.log("SEND:", approveBody);

                        console.log("POST TO: /v3/blockchain/token/approve");

                        // confirmed success with manual test to approve AliceB on mainnet, need to connect to testnet.

                        // axios.post(TATUM_API_URL + 'blockchain/token/approve', approveBody, {
                        //     headers: tatumHeadersPost,
                        // })
                        // .then((response:any) => {

                        //     console.log(response.data);

                            res.send(response.data);        // return data to the front end (tx for approval )

                        // })
                    })
                    .catch((error:any) => {
                        console.log(error);
                    });

                })
                .catch((error:any) => {
                    console.log(error);
                });

            })
            .catch((error:any) => {
                console.log(error);
            });


        });


        // 3. ONE BUTTON request to generate a new BANK (ETH Mainnet) Account. 
        // xpub & mnemonic & address
        this.express.get("/BANK/wallet/:custid/:uid", async (req, res, next) => {
            
            this.logger.info("url:" + req.url);
            
            // FIRST ONE -> lookup if they already have an eth address
            axios.get(TATUM_API_URL + 'ledger/account/customer/'+req.params.custid+'?pageSize=50', {
                headers: tatumHeaders
            })
            .then((response:any) => {
                // console.log(response.data);     // this shows the correctly retrieved data in the server console

                let accounts = response.data;
                let ethAct, xpub;
                let hasBank = false;
                let uid = req.params.uid;

                accounts.forEach(function(item:any,array:any,index:any){

                    if(item.currency === "BANK") {
                        // console.log("Already has a BANK Account");
                        console.log(item);
                        hasBank = true;
                    } else if(item.currency === "ETH") {
                        console.log("Already has an ETH Account - use it");
                        console.log(item);
                        ethAct = item.id;
                        xpub = item.xpub;
                    } 

                });

                let body =  {
                    "currency": "BANK",
                    "xpub": xpub,
                    "customer": {
                        "accountingCurrency": "USD",
                        "externalId": uid
                    },
                    "accountingCurrency": "USD"
                }

                console.log(xpub, uid, hasBank);      // looking for . trade item attached

                if(xpub && uid && !hasBank) {

                    console.log(body);

                    // console.log("This is not working - cannot set headers after sent to the client.");

                    axios.post(TATUM_API_URL + 'ledger/account',  body, {
                        headers: tatumHeadersPost,
                    })
                    .then((response:any) => {
                        //     console.log(response.data);     // this shows the correctly retrieved data in the server console

                        let newAccountId = response.data.id;

                        // console.log(newAccountId);

                        // now we have new account id, we can generate wallet address
                        axios.post(TATUM_API_URL + 'offchain/account/'+ newAccountId+'/address?index=99', {}, {
                            headers: tatumHeaders,
                        })
                        .then((response:any) => {
                            // we got it all, send back address

                            console.log(response.data);

                            res.send(response.data.address);        
                            // return data to the front end (OR responses)

                        }).catch((error:any) => {
                            console.log(error)
                            // console.log(error.response.data)
                        });

                    })
                    .catch((error:any) => {
                        console.log(error.response.data)
                    });

                    // end if has the correct data xpub and uid
                } else if(xpub === undefined){
                    console.log("has no ETH account - create one");
                    // generate one and use it
                    // FIRST ONE -> get the xpub
                    axios.get(TATUM_API_URL + 'ethereum/wallet', {
                        headers: tatumHeaders
                    })
                    .then((response:any) => {
                        // console.log(response.data);     // this shows the 
                        let xpub = response.data.xpub;
                        // console.log(xpub);              // keep this private, also mnemonic

                        let body = {
                            "currency": "ETH",
                            "xpub": xpub,
                            "customer": {
                                "externalId": uid,
                                "accountingCurrency": "USD"
                            },
                            "accountingCurrency": "USD"
                        }

                        // console.log(body);      // looking for . trade item attached

                        axios.post(TATUM_API_URL + 'ledger/account',  body, {
                            headers: tatumHeadersPost,
                        })
                        .then((response:any) => {
                            // console.log(response.data);     // this shows 

                            let newAccountId = response.data.id;

                            // console.log("TESTING WITH INDEX 1 HARD CODED FOR NEW ACCOUNT CREATION")

                            axios.post(TATUM_API_URL + 'offchain/account/'+ newAccountId+'/address?index=1', {}, {
                                headers: tatumHeaders,
                            })
                            .then((response:any) => {
                                // console.log(response.data);     

                                res.send(response.data.address);        // return addressdata to the front end (OR responses)
                            })
                            .catch((error:any) => {
                                console.log(error);
                            });

                        })
                        .catch((error:any) => {
                            console.log(error);
                        });

                    })
                    .catch((error:any) => {
                        console.log(error);
                    });

                } else {
                    console.log("ERROR or: Already has a BANK account");
                }      
                

            })
            .catch((error:any) => {
                console.log(error.response.data)    // first request
            });


        });

        // BUTTON Create a Virtual Currency (VC) account - process body
        this.express.post("/ledger/account", (req, res, next) => {
            this.logger.info("url:::::::" + req.url);

            /* req.body has object of type {
                  "currency": "VC_USD",
                  "customer": {
                        "accountingCurrency": "USD"             
                        "externalId": user.uid                  -> this uid connects auth users to tatum accounts
                  },
                  "accountingCurrency": "USD"    
                }

            */

            console.log("need to read from body data and then call account creation api");     // passed in variable, not realy used verification perhaps)
            console.log(req.body);      // looking for . trade item attached

            axios.post(TATUM_API_URL + 'ledger/account',  req.body, {
                headers: tatumHeadersPost,
            })
            .then((response:any) => {
                console.log(response.data);     // this shows the correctly retrieved data in the server console
                res.send(response.data);        // return data to the front end
            })
            .catch((error:any) => {
                console.log(error);
            });
        });







        // send a POST to GET a wallet address for account with specified id
        this.express.get("/ethereum/address/:account/:index", async (req, res, next) => {

            this.logger.info("url:::::::" + req.url);

            // need to handle derivationKey (querystring input)
            // return -> address & keyNum

            let accountId = req.params.account;     //  "637150c63de6e1ac21787fdd";         // temp tests for new customer accoutn creation

            // let xpub = "xpub6Dm4JzjGRBM5mf79iE5avqZFFQrMW3ityYbwD3p7hZtMJHFsHApiNAAjBw6XpZ7mLkcRcZx1iSSkqSS36W5B2aEpuBLHFHX364MSRJP2rQd";

            axios.post(TATUM_API_URL + 'offchain/account/'+ accountId+'/address?index='+req.params.index, {}, {
                headers: tatumHeaders,
            })
            .then((response:any) => {
                console.log(response.data);     // this shows the correctly retrieved data in the server console
                res.send(response.data);        // return data to the front end
            })
            .catch((error:any) => {
                console.log(error);
            });

        });



        // AUTORUN to get all the customers list (includes external id for accounts -> need for mapping)
        this.express.get("/customers", async (req, res, next) => {
            
            this.logger.info("url:" + req.url);
            
            axios.get(TATUM_API_URL + 'ledger/customer/?pageSize=20', {
                headers: tatumHeaders
            })
            .then((response:any) => {
                // console.log(response.data);     // this shows the correctly retrieved data in the server console
                res.send(response.data);        // return data to the front end
            })
            .catch((error:any) => {
                console.log(error);
            });

        });










        




            // BUTTON to get all the accounts list (ledger accounts)
        this.express.get("/ledgeraccounts", async (req, res, next) => {
            
            this.logger.info("url:" + req.url);
            
            axios.get(TATUM_API_URL + 'ledger/account/?pageSize=50', {
                headers: tatumHeaders
            })
            .then((response:any) => {
                console.log(response.data);     // this shows the correctly retrieved data in the server console
                res.send(response.data);        // return data to the front end
            })
            .catch((error:any) => {
                console.log(error);
            });

        });

        



        // BUTTON request to get all the accounts for user with specified ID
        this.express.get("/account/:id", async (req, res, next) => {
            this.logger.info("url:" + req.url);

            // console.log(req.params.id);

            axios.get(TATUM_API_URL+'ledger/account/customer/'+req.params.id+'?pageSize=50`,', {
                headers: tatumHeaders
            })
            .then((response:any) => {
                // console.log(response.data);     // this shows the correctly retrieved data in the server console
                res.send(response.data);        // return data to the front end
            })
            .catch((error:any) => {
                console.log("error");
            });

        });

        this.express.get("/vc/:name", async (req, res, next) => {
            this.logger.info("url:" + req.url);

            console.log(req.params.name);

            axios.get(TATUM_API_URL+'ledger/virtualCurrency/'+req.params.name , {
                headers: tatumHeaders
            })
            .then((response:any) => {
                console.log(response.data);     // this shows the correctly retrieved data in the server console
                res.send(response.data);        // return data to the front end
            })
            .catch((error:any) => {
                console.log(error);
            });

        });


        /*************************** TESTS *****************************/
                // THIS FOR TEST ONLY HARDCODED SEND OF TRADE 1
        this.express.get("/trade/:id", (req, res, next) => {
            this.logger.info("url:::::::" + req.url);

            console.log(req.params.id);     // passed in variable, not realy used verification perhaps)

            // console.log(req);
            console.log(req.body);

            const data = {
              "type": "BUY",
              "price": "1.333",
              "amount": "20.0",
              "pair": "VC_USD/VC_CAD",
              "currency1AccountId": "635832ba97c17c93c28f0168",
              "currency2AccountId": "63583054e6657347720ffe1d",
              "fee": 0.01,
              "feeAccountId": "6358321a0fe7806f3c6822c7"     
            }

            this.trades.push(data);         // add to the global varibale here for TRADES


            axios.post(TATUM_API_URL + 'trade',  data, {
                headers: tatumHeadersPost,
                // data
            })
            .then((response:any) => {
                console.log(response.data);     // this shows the correctly retrieved data in the server console
                res.send(response.data);        // return data to the front end

                //            res.json(this.trades);          // return as result all trades

            })
            .catch((error:any) => {
                console.log(error);
            });

        });

        // BUTTON request to generate a new BTC Account xpub & mnemonic
        this.express.get("/bitcoin/wallet", async (req, res, next) => {
            
            this.logger.info("url:" + req.url);

            // interface Prices { base: string, eth: number, usd: number, btc: number, chf:number };        // storage variable for future export
            // let prices: Prices = {
            //     base: "CAD",
            //     eth: 0.1,
            //     usd: 0.1,
            //     btc: 0.1,
            //     chf: 0.1
            // };

            // console.log("FUTURE IMPLEMENTAION: LIST OF INPUTS AND BASE, THEN LOOP");
            
            // FIRST ONE
            axios.get(TATUM_API_URL + 'bitcoin/wallet', {
                headers: tatumHeaders
            })
            .then((response:any) => {
                console.log(response.data);     // this shows the correctly retrieved data in the server console
                // prices.eth = response.data.value;
                res.send(response.data);

            })
            .catch((error:any) => {
                console.log(error);
            });


        });

                // Proper POST for expressing an private key generation request
        this.express.post("/bitcoin/wallet/priv", (req, res, next) => {
            this.logger.info("url:::::::" + req.url);

            /* req.body has object of type {
                  "index": type,
                  "mnemonic": price,    
                }
            */

            // console.log("need to read from body data and then call account creation api");     // passed in variable, not realy used verification perhaps)
            console.log(req.body);      // looking for . trade item attached

            axios.post(TATUM_API_URL + 'bitcoin/wallet/priv',  req.body, {
                headers: tatumHeadersPost,
            })
            .then((response:any) => {
                console.log(response.data);     // this shows the correctly retrieved data in the server console
                res.send(response.data);        // return data to the front end
            })
            .catch((error:any) => {
                console.log(error.toJSON());
                res.send(error.toJSON());
            });
        });

        /*************************** OBSOLETE? *****************************/

        /* Code for internal System - obsolete with firebase auth */
        // BUTTON request to get all the users FROM THE GLOBAL VARIABLE ABOVE
        this.express.get("/users", async (req, res, next) => {
            this.logger.info("url:" + req.url);

            res.json(this.users);
            console.log(this.users);

            // axios.get('https://api-eu1.tatum.io/v3/ledger/account/customer/6357fa3d7511407e6d732fe4?pageSize=50`,', {
            //     headers: tatumHeaders
            // })
            // .then((response:any) => {
            //     console.log(response.data);     // this shows the correctly retrieved data in the server console
            //     // console.log(response);

            //     res.send(response.data);        // return data to the front end
            // })
            // .catch((error:any) => {
            //     console.log(error);
            // });

            });


        // request to get all the users by userName
        this.express.get("/users/:userName", (req, res, next) => {
            this.logger.info("url:::::" + req.url);
            const user = this.users.filter(function(user) {
                if (req.params.userName === user.userName) {
                    return user;
                }
            });
            res.json(user);
        });

        // request to post the user
        // req.body has object of type {firstName:"fnam1",lastName:"lnam1",userName:"username1"}
        this.express.post("/user", (req, res, next) => {
            this.logger.info("url:::::::" + req.url);
            this.users.push(req.body.user);         // add to the global varibale here for users

            console.log('Add user '+req.body.user.userName+'to firebase permanent storage.');

            res.json(this.users);
        });
    }
}

export default new User().express;