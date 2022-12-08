import React, { useState } from 'react'
import { showTrades } from '../services/UserService'
import { feesAccts } from '../services/feesAccounts'

// import these constants
const feesAcctCAD = "637e60e2600305b81f027d14";
const feesAcctBTC = "636bb54f5f95f8f981cbc519";

const feesAcctUSD = feesAccts.USD;
const feesAcctETH = feesAccts.ETH;
const feesAcctBANK = feesAccts.BANK;

// console.log(feesAccts)

async function createTrade(type, currency, amount, price, acct1, acct2, base){

    console.log(type, currency, amount, price, acct1, acct2, base);

    // console.log(this.state);


    // confirm ID from state
    // send id to function getAccount
    // and receive back an account list array of objects

    // BCARD SERVICE ACCOUNTS

    // CHF: 63580d55cc7112263d5d04fd
    // CAD: 63583054e6657347720ffe1d
    // USD: 635832ba97c17c93c28f0168

    // NEW : BCARD FEE ACCOUNTS
    // BTC:
    // ETH:
    // VC_USD:
    // VC_CAD:
    // VC_CHF:

    // for BUY TXs

    let feeAccount = feesAcctUSD;    // default USD on BCARD_ONE


    console.log("Now need to dynamically retrieve the account Ids from the user selection form.");


    // if it is a type BUY then we are BUYING CAD and SELLING _currency_

    let account1Id;
    if(acct1){
      account1Id = acct1;    // "63580d55cc7112263d5d04fd";
    }

    console.log("Need to do some determination here to figure out base currency then account number");
    let account2Id;
    let baseCurrency; // = "VC_CAD";

    // base currency MUST match base currency of account 2 provided.
    console.log(base);

    // if it is a SELL, then acct2 is user account where funds will be deposited
    // if it is a BUY, then acct2 is user account where funds will come from.

    if(acct2){
      account2Id = acct2;    // "63580d55cc7112263d5d04fd";
      baseCurrency = base;
    } else {
      // fund with BCARD VC_CAD Wallet
      baseCurrency = "VC_CAD";
      account2Id = "63583054e6657347720ffe1d";
    }


    console.log(currency);

    // feeAccount needs to correspond to the same as currencyAccount1 (currency)
    if(type === "SELL"){

      // switch(currency) {
      //   case "VC_CHF": 
      //     feeAccount = "63580d55cc7112263d5d04fd";
      //     break;
      //   case "VC_USD":
      //     feeAccount = feesAcctUSD; 
      //     break;
      // }



      if(currency === "VC_CHF"){
        feeAccount = "63580d55cc7112263d5d04fd";      // SRV CHF Fees Account 
      } else if(currency === "VC_USD"){
        feeAccount = feesAcctUSD;      // SRV USD Fees Account
      } else if(currency === "VC_CAD"){
        feeAccount = feesAcctCAD;      // SRV USD Fees Account
      } else if(currency === "BTC"){
        feeAccount = feesAcctBTC;      // OK BTC Fees Account -> Correct (final)
      } else if(currency === "ETH"){
        feeAccount = feesAcctETH;      // SRV ETH Fees Account
      } else if(currency === "BANK"){
        feeAccount = feesAcctBANK;      // OK BANK Fees Account
      }
    } else if(type === "BUY" && baseCurrency === 'VC_USD') {

      // then user will be BUYING with USD, so fees must be captured to USD Account

      // if(currency === "VC_CHF"){
      //   feeAccount = "63580d55cc7112263d5d04fd";      // SRV CHF Fees Account
      // } else if(currency === "VC_USD"){
        feeAccount = feesAcctUSD;      // SRV USD Fees Account
      // } else if(currency === "BTC"){
      //   feeAccount = "636bb54f5f95f8f981cbc519";      // OK BTC Fees Account -> Correct (final)
      // } else if(currency === "ETH"){
      //   feeAccount = "6357fc0da1f24abbb23ff88b";      // SRV ETH Fees Account
      // } else if(currency === "BANK"){
      //   feeAccount = "6378fee8cf1a9e005ba957be";      // OK BANK Fees Account
      // }
    }

    let feeAmount = 0.01;

    // maybe have 0 fees for placing an order (maker) and low fees for closing one (taker).
    

    // detail needed to exexute the trade request via API
    let data = {
      "type": type,
      "price": price,
      "amount": amount,
      "pair": currency+"/"+baseCurrency,
      "currency1AccountId": account1Id,
      "currency2AccountId": account2Id,
      "fee": feeAmount,
      "feeAccountId": feeAccount     
    }

    console.log(data);

    const response = await fetch(`/api/trade`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
      })
    await response;

    let trade_conf = response;

    console.log(trade_conf);
    console.log("RETURN FROM TATUM API FOR CREATE TRADE - inline function");
    alert("Your Trade has been successfully posted to our order book with status: "+trade_conf.status+" & fee: " + feeAmount + "%");  

    showTrades();

    // refresh the trades display
    // showTrades()
    //   .then(trades => {

    //     console.log(trades);
    //     let buyOrders = trades[0];
    //     let sellOrders = trades[1];

    //     this.setState({ buyOrders: buyOrders, sellOrders: sellOrders });
    //     // this.setState({  });

    //     console.log("THIS FUNCTION RETURN FROM CALL BCARD API FOR TRADES")
    //     // this.setState({users: users, numberOfUsers: users.length})
    //   });

  }

export function TradeForm(props) {

    // console.log(props.state.custId);   // use PROPS to pass in the account list for the selected user with which to buld the options for selection

    if(props.state.account_list.length > 1) {
      //no customer selected, use service account as default to build the trade UI
      // console.log("No customer selected - dummy data - Use Service Acct")

      // var temp = getAccount("6357fa3d7511407e6d732fe4");
      // console.log(temp);  // this is account list for id provided
      // console.log(props.state.account_list);
    }

    // const [solo, setSolo] = useState({});

    let solo = "XYZ";
    var acct1 = "";


    const [inputs, setInputs] = useState({});
    // const [acct, setAcct] = useState({});
    const handleSubmit = (event) => {
        // alert('Your balance is: ' + balance);
        console.log("SUBMIT:", inputs, acct1);

        console.log("Find a way to submit this request to API", acct1);

        let selectedCurrency = document.getElementById('sel-cur');
        let curVal = selectedCurrency.value;    // should be account id for selected currency

        acct1 = curVal;

        console.log("Need to get account number for base Currency Account")
        console.log("Cheat for now by funding all trades from the BCARD VC_CAD Wallet")

        console.log("acct1: " + acct1);

        console.log("Use props of current user state to get base currency & baseCurrency account# 2.")

        console.log(props.state.account_list[props.state.account_list.length-1].id);    // this to get the oldest account #

        let oldestAcct = props.state.account_list[props.state.account_list.length-1]

        let acct2 = oldestAcct.id;   // hard coded tomtranmer USD
        let baseCurrency = oldestAcct.currency;     // override for account change

        console.log(props.state.baseCurrency);

        alert("Trade confrimation sheet required here w/ " + inputs.type, inputs.currencies, inputs.amount, inputs.price)


        createTrade(inputs.type, inputs.currencies, inputs.amount, inputs.price, acct1, acct2, baseCurrency);

        event.preventDefault();
    }

    const handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;

        if(name === "currencies"){
          let selectedCurrency = document.getElementById('sel-cur');
          let curVal = selectedCurrency.value;
          let curText = selectedCurrency.options[selectedCurrency.selectedIndex].text;
          console.log(selectedCurrency.value, selectedCurrency.options[selectedCurrency.selectedIndex].text);

          acct1 = curVal;

          console.log(acct1);
            // store the value of the text in place of the value here as value is uesd to pass the account ID#
          setInputs(values => ({...values, [name]:curText }));
        } else {
          setInputs(values => ({...values, [name]:value }));
        }

        // console.log(inputs);
        // console.log(inputs.amount * inputs.price)

        // let soloAmt = (inputs.amount * inputs.price).toFixed(2);

        // setInputs("solo", soloAmt);

        // solo = (inputs.amount * inputs.price).toFixed(2);

        //setSolo("HOLLA");

        console.log("Also toggles on select dropdown");
    }

    // console.log(props.state.account_list);

    let accounts = props.state.account_list;

    if(accounts.length > 0) {
      let placeholderAmount = props.state.account_list.length > 0 ? props.state.account_list[0].balance.accountBalance : 0;
      let placeholderPrice = props.state.account_list.length > 0 ? props.state.prices.bank : "add some accounts";


      return (

        <div className="col-md-6">
          <form className="trForm" onSubmit={handleSubmit}>
            <h5>Post your own OrderBook Trade / {props.state.baseCurrency}</h5>

            <div className="row">
              <label htmlFor="selectBS" className="col-sm-2 col-form-label col-form-label-sm">Buy/Sell:</label>

              <div className="col-sm-10">
                <select id="selectBS" name="type" defaultValue="" onChange={handleChange}>
                  <option value="">...</option>
                  <option value="BUY">BUY</option>
                  <option value="SELL">SELL</option>
                </select>
              </div>
            </div>

            <div className="row">
              <label htmlFor="sel-cur" className="col-sm-2 col-form-label col-form-label-sm">Wallet:</label>

              <div className="col-sm-10">
                <select id="sel-cur" name="currencies" defaultValue="lime" onChange={handleChange}>
                  <option value="">...</option>
                  { props.state.account_list.length > 1 ? 

                    props.state.account_list
                        .sort((a,b) => a.currency > b.currency ? 1 : -1)
                        .map((account, index) => (
                            <option data-index={index} value={account.id} key={account.id} > 
                              {account.currency}
                            </option>
                          ))

                      : <>
                          <option value="grapefruit">Please Grapefruit </option>
                          <option value="lime">Select Lime </option>
                          <option value="coconut">An Coconut</option>
                          <option value="mango">Account Mango</option>
                        </>
                  }

                </select>
              </div>
            </div>

            <div className="row">
              <label htmlFor="selectBS" className="col-sm-2 col-form-label col-form-label-sm">Amount:</label>

              <div className="col-sm-10">
                <input 
                  id="tradeAmount"
                  name="amount" 
                  type="text" 
                  value={inputs.amount} 
                  placeholder={placeholderAmount} 
                  onChange={handleChange} 
                />
              </div>
            </div>

            <div className="row">
              <label htmlFor="selectBS" className="col-sm-2 col-form-label col-form-label-sm" title="Price per token sold.">Price:</label>

              <div className="col-sm-10">
                <input 
                  id="tradePrice"
                  name="price" 
                  type="text" 
                  value={inputs.price}
                  placeholder={
                    placeholderPrice
                  } 
                  onChange={handleChange} 
                />
                 (in {props.state.baseCurrency})
              </div>
            </div>

            
            
            
            <input id="tradeSubmit" type="submit" value="Submit Trade" />
            TOTAL: ${solo}
            <hr />
            <h6>BUY/SELL from/to your default FIAT Account</h6>

          </form>
        </div>

    )
    } else {
      // if no accounts, don't show the trade form
      return "";
    }

    

}