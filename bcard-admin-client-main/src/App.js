import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { Header } from './components/Header'
import { Users } from './components/Users'
// import { Accounts } from './components/Accounts'
import { DisplayBoard } from './components/DisplayBoard'
import CreateUser from './components/CreateUser'
import { TradeForm } from './components/TradeForm'
import { SwapForm } from './components/SwapForm'
import { TransferForm } from './components/TransferForm'
import { FaucetForm } from './components/FaucetForm'
// service return
import { getAllUsers, createUser, getAccount, getCustomers, getVC, getBalance, showTrades, newBTCMaster, newBTCAccount, newWalletAddress, getEthAddress, walletAddressInfo, newUSDWallet } from './services/UserService'    // all data retrieval request functions 
import { getPrices } from './services/BcardApi'           // move bcard server calls here
import { newWalletKey, newETHWallet } from './services/TatumSecured'    // highly secured private key, etc. tx here


import { adminWhitelist } from './utils/adminWhitelist'

// newXpubAccount

// , getAccount, getCustomers, getVC, getBalance, createTrade, showTrades, newBTCMaster, newBTCAccount, newWalletAddress, walletAddressInfo, newWalletKey

// internal utils
import { convertToCAD } from './utils/convertToCAD'


// firebase AUTH
// import Login from './components/LoginPage';
// import Home from './components/HomePage';

import { signInWithEAndP, createUserWithEAndP, logout, 
      signInWithPhoneNumber } from './services/firebase'    // packaged services
// Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// // import { getAnalytics } from "firebase/analytics";
import { getAuth, onAuthStateChanged, RecaptchaVerifier } from "firebase/auth";

// function triggerShowTrades() {
//   // update display of ACTIVE trades in UI after account is loaded
//   showTrades()
//   .then(trades => {

//     console.log(trades);
//     let buyOrders = trades[0];
//     let sellOrders = trades[1];

//     console.log("THIS FUNCTION RETURN FROM CALL BCARD API FOR TRADES")
//     return { buyOrders: buyOrders, sellOrders: sellOrders };

//   });
// }


function orderInfo(order) {
  console.log("Take order ID and display detail w/button to CANCEL or FILL.")
}


function GetUniqueCust(props) {

  // console.log(props.state.user);

  if(props.state.user.uid){
      return (
        <h4>Welcome Back <small>{props.state.user.email}</small></h4>
      )
    // check state to see if customer ID is set
  } else if(props.state.custId){
      return (
        <h4>Hello <small>{props.state.custId}</small></h4>
      )
  } else {
      return (
        <p>Login above to Display list of all Accounts, or Create New Account</p>)
  }

  
}


function TradeTableView(props) {

  // console.log(props);

  let list_of_trades = props.trades;

  const TradeRow = (trade,index) => {

        return(
              <tr key = {index} className={index%2 === 0?'odd':'even'}>
                  
                  <td>
                    <button 
                      type="btn"
                      onClick={() =>  {
                        // this.setState({acctId: account.id}); 
                        console.log("Need to setState with click here -> emit event?");
                        alert("Display popup w/ order details: If Owner -> delete this post; else -> fill this order");

                        orderInfo("ORDER ID #");
                        // also popup account info alert panel
                        // walletAddressInfo(account.id);
                      }} >
                      
                      {trade.id}
                    </button>
                  </td> 
                  <td>{trade.pair}</td>
                  <td>{trade.amount}</td>
                  <td>{trade.price}</td>
                  <td>{ convertToCAD(trade.amount,trade.pair, props.state).toFixed(2) }</td>
                  <td>{trade.fill} tokens</td>
                  <td>{ ((props.state.prices.time - trade.created)/60000).toFixed(2) } min</td>
              </tr>
          )
    }

  const tradeTable = list_of_trades.map((trade,index) => TradeRow(trade,index))

  return(
        <div className="container">
            <h4>{props.title}</h4>
            <table className="table table-bordered">
                <thead>
                <tr>
                    <th>id</th>
                    <th>currency pair</th>
                    <th>token</th>
                    <th>price</th>
                    <th>{props.state.baseCurrency} value</th>
                    <th>Fill Amt.</th>
                    <th>Age</th>
                </tr>
                </thead>
                <tbody>
                    {tradeTable}
                </tbody>
            </table>
        </div>
    )
}



class App extends Component {

  /** Internal application state: variable storage **/
  state = {
    signedIn: false,    // initial state for application
    user: {},           // use the user variable to store data for logged in user via firebase (user.uid)
    customers: [],      // customers list is loaded first (in bg) to connect auth user to tatum
    prices: [],         // IMPORTANT for price storage - TBD dynamic list of token prices

    custId: "",         // tatum customer ID
    baseCurrency: "",   // is Set on login from customer object (can we update this with POSTMAN calls?)
    balance: 0.0,       // customer balance storage as calculated via getBalance
    account_list: [],   // list of customer accounts
    hasDAO: false,      // does customer have a DAO Account (BANK)
    hasVISA: false,     // doess custoemr have a VISA (USDC) Account
    recipients: [],     // storage of a list of users customer can send to 

    buyOrders: [],      // open buy orders on tradeBook
    sellOrders: [],     // open sell orders on tradeBook

    currentVC: [],      // LOOK: do we still have links? set on CLICK -> active current VC, display INFO
    acctId: "",         // set on CLICK -> set active account in side panel
    acctAddress: "",    // LOOK: is This Used?
    acctTx: [],         // list of transactions that correspond to the currently selected account.


    // eth: 0.1,
    users: [],          // obsolete
    userMap: new Map(), // not used
    numberOfUsers: 0,   // not used
    uniqCust: new Set(),  // not used

  }


  // constructor(props) {
  //   super(props);   // no props on intial app load, but use =fu
  //   // Don't call this.setState() here!
  //   // this.state = { counter: 0 };
  //   // this.handleClick = this.handleClick.bind(this);
  // }

  // this triggers for AUTH and prevState conditionals
  componentDidMount(prevProps, prevState, snapshot) {
    // console.log(prevProps, prevState, snapshot);

    // console.log(this.state);

    // determine authentication status
    const auth = getAuth();
    // console.log(auth);
    window.recaptchaVerifier = new RecaptchaVerifier('sign-in-button', {
      'size': 'invisible',
      'callback': (response) => {
        // reCAPTCHA Solve, allow sign in with phone Number
        console.log( "onSignInSubmit()" );
        this.loginUser();       // login execute after verification
                              // disconnect submit?
      }
    }, auth);

    onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("User is signed in");
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        // const uid = user.uid;   // this UID can be the unique identifier to breate Tatum accounts -> link to Google Auth Firebase Storage

        // console.log(uid);
        // console.log(user.email);
        //  console.log(user);    // user object is the storage for Google Auth

        // console.log("Welcome back " + user.email);

        this.setState({ signedIn: true });
        this.setState({ user: user });

        // set default to USD here to avoid the error checking along the way
        this.setState({ baseCurrency: "USD" })

        // check for customer_list mapping to get tatum customerId
        this.getCustomers();

        if(this.state.custId) {
          console.log(this.state.prices);

      
        }


      } else {
        // User is signed out
        console.log("User is signed Out");
        // ...
        this.setState({ signedIn: false });
        this.setState({ user: {} });
      }
    });

    if(prevState) {
      if (this.state.prices !== prevState.prices) {
        // then the pricing data has been updated, so a refresh of the UI is required.
        console.log("This on state recall, if prices are different - NEED A TIMER ANALYSIS - SET IN STATE")
      }
    } else if(this.state.signedIn) {
      // no previous state, so it is an initial load .
      

    } else {
      // catch all for not signed in
      console.log("Sign In");
    }

    

  }

  /** Internal user creation functions - add hooks to firebase **/

  loginUser = () => {
    // hard code for now
    // let email='tom@tranmer.ca';
    // let password = '123456';

    // console.log(this.state.user)

    console.log(this.state.user.email,this.state.user.password);

    signInWithEAndP(this.state.user.email,this.state.user.password)
      .then(response => {

        // get user object from auth
        console.log(this.state.user.uid);

        // set state for default currencyBase
        this.setState({ baseCurrency: "USD" });   // defualt USD hard-codedhere
        console.log("default USD hard-coded here on login");




        // console.log(response);
        if(response) {
          console.log(response)    
          // this to get user email -> use HASH of email for creation of new accounts belonging to this user. 
          // this.setState({numberOfUsers: this.state.numberOfUsers + 1})

          // may need to seState for user object
          this.setState({"signedIn": true});

          console.log("Request refresh due to state here.");
        }
    });
  }

  signInWithPhoneNumber = () => {
    // hard code for now
    // let email='tom@tranmer.ca';
    // let password = '123456';

    // console.log(this.state.user)

    // console.log(this.state.user.email,this.state.user.password);

    const auth = getAuth();
    console.log(auth);

    let phoneNo = "16478989204";    // hard code TOM
    let appVerifier = window.recaptchaVerifier;

    signInWithPhoneNumber(auth,phoneNo,appVerifier)
      .then(response => {

        console.log(response)    


        // get user object from auth
        // console.log(this.state.user.uid);

        // set state for default currencyBase
        //  this.setState({ baseCurrency: "USD" });   // defualt USD hard-codedhere
        // console.log("default USD hard-coded here on login");




        // console.log(response);
        if(response) {
          // this to get user email -> use HASH of email for creation of new accounts belonging to this user. 
          // this.setState({numberOfUsers: this.state.numberOfUsers + 1})

          // may need to seState for user object
          // this.setState({"signedIn": true});

          console.log("Request refresh due to state here.");
        }
    });
  }

  createNewUser = (e,pw) => {
    // hard code for now
    // let email='tom@jones.ca';
    // let password = '123456';

    // required from the CURRENT data entry inputs
    // console.log(this.state.user.email,this.state.user.password);

    createUserWithEAndP(this.state.user.email,this.state.user.password)
      .then(response => {

        this.setState({"signedIn": true});

        console.log("Request refresh due to state here.");

        console.log(response);

        // this fails because response fails
        if(response) {
          console.log(response.email)    
          // this to get user email -> use HASH of email for creation of new accounts belonging to this user. 
          // this.setState({numberOfUsers: this.state.numberOfUsers + 1})

          this.setState({user: 1})
        }
    });
  }

  // DEP
  createUser = (e) => {
      createUser(this.state.user)
        .then(response => {
          console.log(response);      // this is user object as submitted (body data)
          this.setState({numberOfUsers: this.state.numberOfUsers + 1})

          // now run creaetNewUser for the auth server
          createUserWithEAndP(response.email,response.password)
            .then(response => {
              console.log(response);    // this is not returning anything
              this.setState({user: 1});
            });
        });
  }

  getAllUsers = () => {
    getAllUsers()
      .then(users => {
        console.log(users)
        this.setState({users: users, numberOfUsers: users.length})
      });
  }
  // when user form is changed, update user object in app state variable
  
  // for form submit (user auth)
  onChangeForm = (e) => {      
    let user = this.state.user;   // perpetual storage in the app DOM

    // console.log(user);

    if (e.target.name === 'firstname') {
        user.firstName = e.target.value;
    } else if (e.target.name === 'password') {
        user.password = e.target.value;
    } else if (e.target.name === 'email') {
        user.email = e.target.value;
    }

    // this sets the state for the user to be created or logged in
    this.setState({user})
  }

  newBTCMaster = () => {

    // send request to generate BC Master
    // and receive back an account info list { array of: objects }

    newBTCMaster()
      .then(account_info => {

        console.log(account_info)   // accounts are good retrieved here
        console.log("RETURN FROM TATUM API FOR CREATE BTC MASTER")

        alert("xpub for account: " + account_info.xpub);
        alert("mnemonic (one-time only!): " +account_info.mnemonic);

      })

  }

  newBTCAccount = (currency,EXT_ID,xpub) => {

    // will need data from body: currency, EXT_ID, xpub, 

    // if no xpub, still will generate an account - but with no accessible wallets?
    if(xpub==="xpub"){
      // default to XPUB for BCARD_FEES account
      xpub = "xpub6Em42hjC1gHisq3h6f8vXr5ACAMMPV3QnorN5sojgT4f8t4Hd7qfWQJL6wAZtobukajR2vmnYEVPsUdvRE5f1FsWTuvdfh5xBMXwvkDftFX";
    }

    let data = {
      "currency": currency,
      "xpub": xpub,
      "customer": {
        "externalId": EXT_ID,
        "customerCountry": "US",
        "accountingCurrency": "USD"
      }    
    }

    newBTCAccount(data)
      .then(account_info => {
        
        console.log(account_info)
        console.log("accountId: " + account_info.id + " for custId: " + account_info.customerId + " has been created")
        console.log("RETURN FROM TATUM LEDGER ACCOUNT CREATION")
      })
  }


  newXpubAccount = (currency,EXT_ID,xpub) => {

    // will need data from body: currency, EXT_ID, xpub, 

    // if no xpub, still will generate an account - but with no accessible wallets?
    if(xpub==="xpub"){
      // default to XPUB for tomtranmeer ETH account
      xpub = "xpub6DbQz3y2wQHZkkw85c1JxJJeBVNqH2SpuApM5i2Ta1jeFGEebeNLJAMDEJD1uYKEaCF9JgTNPFDanJe3bccNsi4Vf99ngjLY5AVUfVtEYw2";
    }

    let data = {
      "currency": currency,
      "xpub": xpub,
      "customer": {
        "externalId": EXT_ID,
        "customerCountry": "US",
        "accountingCurrency": "USD"
      }    
    }

    newBTCAccount(data)
      .then(account_info => {
        
        console.log(account_info)
        console.log("accountId: " + account_info.id + " for custId: " + account_info.customerId + " has been created")
        console.log("RETURN FROM TATUM LEDGER ACCOUNT CREATION")
      })
  }



  /** Autorun / initial page load (after authentication) **/


  /** get list of all customers w/ uid and custID for mapping **/
  getCustomers = () => {
    // console.log("This is an autorun function to get the customer list and map the CustId to the External Id used in our auth system.");

    // console.log();

    this.getPrices(this.state.baseCurrency);                            // load in the prices as unauth users do not see them


    getCustomers()
      .then(customers => {
        this.setState({customers: customers})
        // console.log("THIS CALL TO TATUM API FOR CUSTOMERS (can map external id to internal id)");

        // customers -> all customers for TATUM backend system

        // if has a logged-in ID -> need to set specifics for THIS Customer

        // console.log('uid' in this.state.user);   // ok here for logged in users only should be running the getCustomers function
        const uid = this.state.user.uid;
        // const matchFlag = false;
        // console.log(uid,customers)   // customers are good retrieved here

        // foreach customers -> loop through each in list looking for external Id match

        let custMatch;

        customers.forEach(cust => {
          // console.log(cust.externalId);

          if(uid === cust.externalId) {
            // matchFlag = true;
            console.log("USER MATCH -> setState");
            
            custMatch = cust;
            this.setState({"custId":cust.id, baseCurrency: cust.accountingCurrency});
            this.getAccount(cust.id);         // next function call
            // this.setState                  // load in the customers accounts (calls prices update here)

          }  

          if(custMatch){}   // if a match is found, then progress to load in customer account

        });

      });

  }



  /************************** wallet creation function pieces - (admin only) *********************/

  // OBSOLETE? generate ETH address for specified account w/ derivation Key index
  getEthAddress = (acctId, index) => {

    getEthAddress(acctId, index)
      .then(info => {
        console.log(info);
        alert("Your new ETH Wallet Address is: " + info.address + "You can fund this wallet address or share it with your friends!")
        console.log("RETURN FROM TATUM ADDRESS GENERATION WITH address: " + info.address)
      })
  }

  // generate new private Key for 
  newWalletKey = (index, input) => {

    // index = 0;
    // let mnemonic = "aisle kidney upper grain explain payment wash donate visual praise budget garden moment bleak burst trip force come prosper beef hello naive sleep group";

    // console.log(input, "Need to connect input box in UI here to input mnemonic seed phrase to generate key[index]");

    newWalletKey(index,input)
      .then(key_data => {
        console.log(key_data);    // accessible directly at key_data.key
        console.log("RETURN FROM TATUM LEDGER ADDRESS KEY GENERATION -> Key only displayed on server (as it should be!")

      })
  }

    // create one based on NO(xpub) -> id only for custodial accounts as they already are associated with xpub
  newWalletAddress = (id) => {

    console.log(this.state.acctId);
    if(this.state.acctId !== ""){
      // then use this SET account as the ID for the wallet address generation
      id = this.state.acctId;
    }

    newWalletAddress(id)
      .then(account_info => {
        
        console.log(account_info)
        // console.log("accountId: " + account_info.id + " for custId: " + account_info.customerId + " has been created")
        console.log("RETURN FROM TATUM LEDGER ADDRESS CREATION")
      })
  }

  /************************** info functions (admin) *********************/

  getVC = (currency) => {

    console.log(this.state);
    // console.log(currency);
    console.log("Displaying Virtual Currency Stats for: " + currency);

    let useVC = currency || "VC_CHF"; // init ad service accoutn for testing purposes.
    // if(this.state.currentVC.name !== "") {
    //   useVC = this.state.currentVC;
    //   console.log('override vc name for VC');
    // }

    // confirm ID from state
    // send id to function getAccount
    // and receive back an account list array of objects

    getVC(useVC)
      .then(vcDetail => {
        this.setState({currentVC: vcDetail})

        console.log(vcDetail)   // accounts are good retrieved here
        console.log("RETURN FROM TATUM API FOR Virtual Currency")
      });
  }


  /************************** info functions (all) *********************/

  /** function call to gather prices from a list of available tokens **/
  getPrices = (base) => {

    // console.log(base);    // override base currency

    // use any currently set BASE rate for any price retrievals and display
    getPrices(base)
      .then(prices => {

        // use SetState for existing component
        this.setState({ prices: prices })   // eth setting legacy and can be removed

        // console.log("THIS CALL TO BCARD API FOR PRICES, with BASE")

      });
  }

  // get or refresh Accounts info for currently selected CustID
  getAccount = (custId) => {

    console.log("Running getAccount - rename this function");
    // console.log(custId);

    let useAcct = custId;   // default is the passed value
    if(custId === "") {
      // passed in a blank value so set some defaults
      useAcct = "6357fa3d7511407e6d732fe4"; // init service account for testing purposes.
      console.log('override acct num for customer SELECTED - DEFAULT SERVICE ACCT');

      // OVERRIDE -> set internally
      if(this.state.custId !== ""){
        console.log('override acct num for customer SELECTED - STATE VAR');
        useAcct = this.state.custId;
      }
    } 

    // confirm ID from state
    // send id to function getAccount
    // and receive back an account list array of objects

    //let setCurrency = "USD";
    // this.setState({baseCurrency:setCurrency});    // hard-code CAD
    // console.log(this.state.baseCurrency)

    // console.log("Get Account req. call to getPrices first");

    getPrices(this.state.baseCurrency).then(prices => {
      this.setState(prices);
    }).then(() =>{

    //then call customer accounts
    getAccount(useAcct)
        .then(account_list => {


          // console.log(account_list);    // merge these if matches multiple for single customer?

          // set defualtCurrency from account_list[0]

          // account_list[0] should be the olders account (first setup)

          // most recently created account should be available at :account_list[account_list.length-1]

          // console.log(account_list);

          // set controls for addDAO (BANK) and addVISA (based on current accounts)
          for(let i=0; i<account_list.length; i++) {
            // console.log(account_list[i]);
            let thisAccount = account_list[i];

            if(thisAccount.currency === "BANK"){
              this.setState({hasDAO:true})
            } else if(thisAccount.currency === "USDC" || thisAccount.currency === "USDC_V") {
              this.setState({hasVISA: true})
            }
          }

          this.setState({account_list: account_list, custId: useAcct})


          // console.log("account_list,defualtCurrency RETURN FROM BCARD API FOR CustID")

          // then load the customers balance
          getBalance(account_list, this.state)
              .then(balance => {
                // console.log(balance);       // ok here
                this.setState({balance:balance})
              })

          // then load in all the trades (optional)
          showTrades()
            .then(trades => {

              let buyOrders = trades[0];
              let sellOrders = trades[1];

              this.setState({ buyOrders: buyOrders, sellOrders: sellOrders });

            });

          })    // end then callback function

        console.log("THIS FUNCTION RETURN FROM CALL BCARD API FOR getAccount");


    })    // end then after prices

  }

  // rename getAccount method here to getMaster
  getMaster = (custId) => {

    console.log("Running getMaster - new name for this getAccount method");
    // console.log(custId);

    let useAcct = custId;   // default is the passed value
    if(custId === "") {
      // passed in a blank value so set some defaults
      useAcct = "6357fa3d7511407e6d732fe4"; // init service account for testing purposes.
      console.log('override acct num for customer SELECTED - DEFAULT SERVICE ACCT');

      // OVERRIDE -> set internally
      if(this.state.custId !== ""){
        console.log('override acct num for customer SELECTED - STATE VAR');
        useAcct = this.state.custId;
      }
    } 

    // check prices.time first,then update if needed

    // console.log(this.state.prices.time);       // last gathererd time
    // console.log(Date.now());                  //UNIX time in ms

    let priceElapsed = Date.now() - this.state.prices.time;

    if(priceElapsed > 200000){
      // 200K ms
      console.log(priceElapsed);

      getPrices(this.state.baseCurrency).then(prices => {
        this.setState(prices);
      }).then(() =>{

        //then call customer accounts
        getAccount(useAcct)
          .then(account_list => {

            // set controls for addDAO (BANK) and addVISA (based on current accounts)
            for(let i=0; i<account_list.length; i++) {
              // console.log(account_list[i]);
              let thisAccount = account_list[i];

              if(thisAccount.currency === "BANK"){
                this.setState({hasDAO:true})
              } else if(thisAccount.currency === "USDC" || thisAccount.currency === "USDC_V") {
                this.setState({hasVISA: true})
              }
            }

            this.setState({account_list: account_list, custId: useAcct})

            // then load the customers balance
            getBalance(account_list, this.state)
                .then(balance => {
                  this.setState({balance:balance})
                })

            // then load in all the trades (optional)
            showTrades()
              .then(trades => {

                let buyOrders = trades[0];
                let sellOrders = trades[1];

                this.setState({ buyOrders: buyOrders, sellOrders: sellOrders });

              });

          })    // end then callback function for getAccount

        console.log("THIS Method RETURN FROM CALL BCARD API FOR getMaster");


    })    // end then after prices calls  - skip for master refresh, unless time

    } else {
      // skip the prices update for display
      console.log(priceElapsed);
      //then call customer accounts
      getAccount(useAcct)
        .then(account_list => {

          // set controls for addDAO (BANK) and addVISA (based on current accounts)
          for(let i=0; i<account_list.length; i++) {
            // console.log(account_list[i]);
            let thisAccount = account_list[i];

            if(thisAccount.currency === "BANK"){
              this.setState({hasDAO:true})
            } else if(thisAccount.currency === "USDC" || thisAccount.currency === "USDC_V") {
              this.setState({hasVISA: true})
            }
          }

          this.setState({account_list: account_list, custId: useAcct})

          // then load the customers balance
          getBalance(account_list, this.state)
              .then(balance => {
                this.setState({balance:balance})
              })

          })    // end then callback function for getAccount

        console.log("THIS Method - Short RETURN FROM CALL BCARD API FOR getMaster");

    }



  }

  // lookup info based on specified ID
  walletAddressInfo = (id) => {

    console.log(this.state.acctId);
    if(this.state.acctId !== ""){
      // then use this SET account as the ID for the wallet address info request
      id = this.state.acctId;
    } else {
      this.setState({acctId: id}); 
    }

    walletAddressInfo(id)
      .then(account_info => {
        
        console.log(id, account_info);

        let walletAddress = "n/a";

        let info = account_info;
        if(account_info[0]){
          // override for CHAIN ACCOUNT
          info = account_info[0]
        }


        if( info.currency.startsWith("VC_") ){
          // no address available
          alert("Info for Account with id: "+id+" | Balance: " + account_info.balance.accountBalance + " " + account_info.currency + " | CustomerID: " + account_info.customerId +" No address for VC -> Use Deposit Function");
        } else {
          walletAddress = account_info[0].address;              // hard coded test for QR
          this.setState({"acctAddress":walletAddress});        // confirm setState for address of selected wallet

          console.log("Implement QR Code visual display on Account Info Click.");
        }

        // let walletAddress = account_info[0].address;
        // this.setState({"acctAddress":walletAddress});        // confirm setState for address of selected wallet

        // console.log("Implement QR Code visual display on Account Info Click.");

        alert("Info for Account with id: "+id+" | Balance: " + account_info.balance.accountBalance + " " + account_info.currency + " | CustomerID: " + account_info.customerId + " | Public Address: " + walletAddress);
        console.log("RETURN FROM TATUM LEDGER ADDRESS INFO LOOKUP:" + walletAddress)
      })
  }

  // manual show/refresh button for live orderBook trades
  showTrades = () => {
    showTrades()
      .then(trades => {

        console.log(trades);
        let buyOrders = trades[0];
        let sellOrders = trades[1];

        this.setState({ buyOrders: buyOrders, sellOrders: sellOrders });
        // this.setState({  });

        console.log("THIS FUNCTION RETURN FROM CALL BCARD API FOR TRADES")
        // this.setState({users: users, numberOfUsers: users.length})
      });
  }


  /************************** new User Functions *********************/

  newUSDWallet = () => {

    console.log(this.state.user)

    // require user.uid for account identifier
    newUSDWallet(this.state.user)
      .then(result => {

        console.log(result);
        // use SetState for existing component
        // this.setState({eth: prices.eth, prices: prices })   // eth setting legacy and can be removed

        console.log("THIS CALL TO BCARD API FOR NEW USD - Onboarding 1.")
      });
  }

  newETHWallet = (tokenOverride) => {
    console.log(this.state.user.uid);

    console.log(tokenOverride);   // this will be an ETH CHAIN walletbut for tokenOverride ID-> Check Tatum https://docs.tatum.io/introduction/supported-blockchains for list of supported blockchains and sets that can be implemented out of the box.

    let userID = this.state.user.uid;     // bcard internal ID
    let custID = this.state.custId;

    // require user.uid for account identifier
    newETHWallet(userID, tokenOverride, custID)
      .then(result => {

        console.log(result);
        // use SetState for existing component
        // this.setState({eth: prices.eth, prices: prices })   // eth setting legacy and can be removed

        console.log("THIS CALL TO BCARD API FOR NEW ETH Wallet & USDC (VISA) - Onboarding 2 & 3.");

        console.log("Will need to trigger an account reload or page refresh to display newly created accounts.");
        alert("Your account has been successsfully created.");
        window.location.reload();

      });
  }


  onboardExecute = () => {
    // consolidated onboarding function for new users who do not have a registered account in tatum system.
    console.log("Execute New User Onboarding Function.");

    // confirm we have logged-in ID, otherwise, login first alert.
    if(this.state.user.uid){

      // first, FIAT(USD) wallet: 
      newUSDWallet(this.state.user.uid)
      .then(result => {
        console.log(result);
        console.log("Complete - Onboarding 1.");

        // second, ETH wallet for ETH and ERC-20: 
        // require user.uid for account identifier
        newETHWallet(this.state.user.uid)
        .then(result => {

          console.log(result, "Hopefully wallet address is included in the return here, the rest can stay serverside or for later recall I think");
          // use SetState for existing component
          // this.setState({eth: prices.eth, prices: prices })   // eth setting legacy and can be removed

          console.log("Complete - Onboarding 2.");

          console.log(this.state);

          console.log("This can reload now, but FUTURE should just set CustID in state");
          
          alert('Congratulations, your accounts have been created.');
          window.location.reload();
        });
      });

    } else {
      alert('Please login or register first.');
    }
    
  }


  /******* end for methods for app.js ********/


  render() {
    
    return (
      <div className="App">
        <Header></Header>
        <div className="container mrgnbtm">
          <div className="row">
            <div className="col-md-4">
                {!this.state.user.uid &&
                <div className="new-user">

                  <CreateUser 
                    user={this.state.user}
                    onChangeForm={this.onChangeForm}
                    createNewUser={this.createNewUser}
                    loginUser={this.loginUser}
                    signInWithPhoneNumber={this.signInWithPhoneNumber}
                    >
                  </CreateUser>

                </div>
              }

                <div className="current-user">  

                  <GetUniqueCust state={this.state} getCustomers={this.getCustomers} />

                  {/*<button 
                    className="btn btn-success" 
                    onClick={() => {console.log("Test Account Creation Success");this.createNewUser("aliceb@coolasice.ca","123456")}}>
                      Signup Test -> No Repeat email      
                  </button>*/}

                  {/*<button 
                    className="btn btn-success" 
                    onClick={() => {console.log("Test Login Admin");this.loginUser("tom@tranmer.ca","123456")}}>
                      Login Test -> ADMIN      
                  </button>*/}
                  {/*<button 
                    className="btn btn-warning" 
                    onClick={() => {console.log("Test Login User");this.loginUser("aliceb@coolasice.ca","123456")}}>
                      Login Test -> USER      
                  </button>
                  <button 
                    className="btn btn-danger" 
                    onClick={() => {console.log("Test Login Fail");this.loginUser("tomjones","whatsnew")}}>
                      Login Test -> FAIL      
                  </button>*/}
                  <hr />
                  { this.state.user.uid &&
                    <button 
                      className="btn btn-danger" 
                      onClick={() => {console.log("Test Logout");logout()}}>
                        Logout      
                    </button>
                  }

                  <h3>User Selected: </h3>
                  <p><strong>user email: </strong> {this.state.user.email || "not signed in"}</p>
                  <p><strong>Bcard UserId: </strong> <small>{this.state.user.uid || "not signed in"}</small></p>
                  <p><strong>CustomerId: </strong> {this.state.custId || "not selected"}</p>
                  <p>
                    <strong>AccountId: </strong> {this.state.acctId || "not selected"}<br />
                    <strong>Wallet Address: </strong> <small>{this.state.acctAddress || "not selected"}</small>
                  </p>
                  <p>Currency Default: { this.state.baseCurrency !== '' ? this.state.baseCurrency : "getAccounts" }</p>
                  <p>FIAT Default: { this.state.baseCurrency } </p>
                  <hr />
                </div>

                
            </div>
            <div className="col-md-8">
                <DisplayBoard
                  // numberOfUsers={this.state.numberOfUsers}
                  // customerId={this.state.custId}
                  // balance={this.state.balance}

                  // Account={this.Account}

                  getAllUsers={this.getAllUsers}

                  getPrices={this.getPrices}
                  getAccount={this.getAccount}
                  getMaster={this.getMaster}

                  getBalance={this.getBalance}
                  getCustomers={this.getCustomers}

                  createTrade={this.createTrade}
                  showTrades={this.showTrades}
                  newBTCMaster={this.newBTCMaster}
                  newBTCAccount={this.newBTCAccount}

                  newWalletAddress={this.newWalletAddress}
                  getEthAddress={this.getEthAddress}

                  walletAddressInfo={this.walletAddressInfo}

                  newWalletKey={this.newWalletKey}
                  state={this.state}

                  newUSDWallet={this.newUSDWallet}
                  newETHWallet={this.newETHWallet}
                  newXpubAccount={this.newXpubAccount}

                  onboardExecute={this.onboardExecute}
                >
                </DisplayBoard>
            </div>
          </div>
        </div>

        <div className="container">
          <div className="row">
            <div className="col">

              <ul>
                {this.state.balance > 0 && <li><strong>USER BALANCE: ${this.state.balance} </strong></li>}
                <li>Current Prices:
                  <ul>
                    {this.state.prices.eth && <li>1 ETH = ${this.state.prices.eth} {this.state.baseCurrency} </li> }
                    {this.state.prices.btc && <li>1 BTC = ${this.state.prices.btc} {this.state.baseCurrency} </li> }
                    {this.state.prices.bank && <li>1 BANK = ${this.state.prices.bank} {this.state.baseCurrency} </li> }

                    {this.state.prices.usd && <li>1 USD = ${this.state.prices.usd} {this.state.baseCurrency} </li> }
                    {this.state.prices.chf && <li>1 CHF = ${this.state.prices.chf} {this.state.baseCurrency} </li> }

                  </ul>
                </li>
              </ul>

            </div>
          </div>
        </div>

        <div className="row mrgnbtm">
          <Users users={this.state.users}></Users>
        </div>
        <div className="container">

          { this.state.custId && 
            <div className="row">
              <TradeForm state={this.state} />
              <FaucetForm state={this.state} />
              <TransferForm state={this.state} />
              <SwapForm state={this.state} />
            </div>
          }

          {this.state.buyOrders.length > 0 &&
            <div> 
            <TradeTableView title="Buy Orders" trades={this.state.buyOrders} baseCurrency={this.state.baseCurrency} state={this.state} />
            <hr />
              

            </div>
          }
          {this.state.sellOrders.length > 0 &&
            <div> 
            <TradeTableView title="Sell Orders" trades={this.state.sellOrders} state={this.state} />

            <hr />
              

            </div>
          }
          
          <hr />
          <p><strong>Accounts of Selected User [Customer Account ID]: {this.state.custId || "[not set]"}</strong></p>

          {this.state.custId && 
            <p><strong>Click <button type="btn" onClick={ () => {} }>
              Accounts ID
            </button> Button to Select Account for Active -> <small>display detail info in panel above</small></strong></p>
          }

          {this.state.balance > -1 &&     // this.state.account_list.length > 0 &&

            <table className="table table-bordered">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>currency</th>
                  <th>token</th>
                  <th>{this.state.baseCurrency} balance</th>
                </tr>
              </thead>
              <tbody>
              {this.state.account_list.map((account, index) => (
                <tr data-index={index} key={account.id}>
                  <td>
                    <button 
                      type="btn"
                      onClick={() =>  {
                        // also popup account info alert panel
                        this.walletAddressInfo(account.id);
                      }} >
                      
                      {account.id}
                    </button></td>
                  <td>{account.currency}</td>
                  <td>{account.balance.accountBalance}</td>
                  <td>{ convertToCAD(account.balance.accountBalance,account.currency,this.state) }</td>
                </tr>
                ))}
              </tbody>
            </table> 

          }

          <hr />

          





          {/*{ ((this.state.custId === "6357fa3d7511407e6d732fe4") || (this.state.user.email === 'tom@tranmer.ca')) &&*/}
          { ( adminWhitelist.includes(this.state.user.email) || adminWhitelist.includes(this.state.custId) ) &&

          <div>

            <p><strong>MASTER List of all Customers</strong> 
              {!this.state.custId && <span> - click <button>Get Customers</button> and then click <button>CustID</button> to select customer:</span>}
            </p>
          
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th>Customer ID (tatum)</th>
                  <th>ExternalID (ours)</th>
                  <th>customerCountry</th>
                  <th>accountingCurrency</th>
                </tr>
              </thead>
              <tbody>
              {this.state.customers
                  .sort((a,b) => a.externalId > b.externalId ? 1 : -1)
                  .map((customer, index) => (
                <tr data-index={index} key={customer.id}>
                  <td><button 
                      className="btn" 
                      onClick={() => {
                          console.log("Can we use map here to map externalId to customerId? ");
                          this.setState({extId: customer.externalId});
                          this.setState({custId:customer.id});
                          console.log("Also pull accounts list - same time");
                          this.getAccount(customer.id);
                      }} >
                        <strong>{customer.id}</strong>
                  </button></td>
                  <td>{customer.externalId}</td>
                  <td><button 
                      className="btn" 
                      onClick={(e) =>{} }>
                      {customer.customerCountry}
                  </button></td>
                  <td>{customer.accountingCurrency}</td>
                </tr>
                ))}
              </tbody>
            </table>

            <hr />

            {this.state.customers.length > 1 && 
              <div>
                <p><strong>Click ON <button>VC_Name</button> to display VC Detail:</strong></p>
                <p><strong>{this.state.currentVC.name}</strong> with supply: {this.state.currentVC.supply}
                <br/>with FIAT basePair {this.state.currentVC.basePair}:{this.state.currentVC.baseRate}</p>
              </div>
            }

          </div>
          }

        </div>
      </div>
    );
  }
}

export default App;
