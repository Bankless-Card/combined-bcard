import React, { useState } from 'react'

import { feesAccts } from '../services/feesAccounts'

// import these constants
// const feesAcctCAD = "637e60e2600305b81f027d14";
// const feesAcctBTC = "636bb54f5f95f8f981cbc519";

const feesAcctUSDC = feesAccts.USDC;
const feesAcctUSD = feesAccts.USD;
const feesAcctETH = feesAccts.ETH;
const feesAcctBANK = feesAccts.BANK;

// import { showTrades } from '../services/UserService'

// function getOptionText(sel) {
//   return sel.options[sel.selectedIndex].text;
// }

async function createSwap(amount, acct1, acct2, prices){

    console.log(amount, acct1, acct2, prices);

    console.log("price not needed here, calculated as market value swap");
    console.log("Need to do some determination here to figure out currency then account number for MM");


    let selectedCurrencyOut = document.getElementById('currencyOut');
    // let curVal = selectedCurrencyOut.value;
    let tokenOut = selectedCurrencyOut.options[selectedCurrencyOut.selectedIndex].text;
    // console.log(curVal, tokenOut);

    let selectedCurrencyIn = document.getElementById('currencyIn');
    let tokenIn = selectedCurrencyIn.options[selectedCurrencyIn.selectedIndex].text;
    console.log("OUT", tokenOut, "IN", tokenIn);

    let mmAccountUSDC = feesAcctUSDC   // VC_USD on BCARD ONE
    let mmAccountUSD = feesAcctUSD   // VC_USD on BCARD ONE
    let mmAccountETH = feesAcctETH   // ETH on BCARD ONE
    let mmAccountBANK = feesAcctBANK // BANK on BCARD Service

    // data default
    //  for SEND USD 
    let data = {
      "senderAccountId": acct1,
      // "recipientAccountId": mmAccountUSD,
      "amount": amount     
    }

    let data2 = {
      "senderAccountId": mmAccountETH,
      "recipientAccountId": acct2,
      // calculate amount with token inputs
    }

    if(tokenOut === "BANK") {
      data.recipientAccountId = mmAccountBANK;
      data2.senderAccountId = mmAccountBANK;   // set 


    } else if(tokenOut === "ETH") {
      data.recipientAccountId = mmAccountETH;
      data2.senderAccountId = mmAccountETH;   // set
      
    } else if(tokenOut === "VC_USD") {
      // need to send VC_USD to the Market Maker
      //  for SEND USD -> ok with default
      
      console.log(data);
      data.recipientAccountId = mmAccountUSD;
      data2.senderAccountId = mmAccountUSD;   // set

    } else if(tokenOut === "USDC_V"){
      data.recipientAccountId = mmAccountUSDC;
      data2.senderAccountId = mmAccountUSDC;   // set

    }

    console.log(data);




    if(tokenIn === tokenOut) {
      data2.amount = amount;    // equal is a pass-through
      // set sender ID here

    } else if (tokenIn === "BANK") {
      data2.senderAccountId = mmAccountBANK;   // set 

      // calculate amount using price
      if(tokenOut === "VC_USD") {
        data2.amount = (amount/prices.bank).toString();    // USD -> BANK
      } else if(tokenOut === "ETH") {               // ETH -> BANK
        data2.amount = (amount*prices.eth/prices.bank).toString();
      } 

    } else if (tokenIn === "ETH") {
      data2.senderAccountId = mmAccountETH;   // set 

      // calculate amount using price
      if(tokenOut === "VC_USD") {
        data2.amount = (amount/prices.eth).toString();    // USD -> ETH
      } else if(tokenOut === "BANK") {
        data2.amount = (amount*prices.bank/prices.eth).toString();    // BANK -> ETH
      }
      
      

      // alert("You get back: " + (amount/prices.eth).toString() + " ETH (confirm)");

    } else if (tokenIn === "VC_USD") {
      data2.senderAccountId = mmAccountUSD;   // set 

      // calculate amount using price
      if(tokenOut === "ETH") {
        data2.amount = (amount*prices.eth).toString();    // ETH -> USD
      } else if(tokenOut === "BANK") {
        data2.amount = (amount*prices.bank).toString();    // BANK -> USD
      } else {
        // usd to usd exchange from FIAT wallet
        data2.amount = amount;
      }

    } else if (tokenIn === "USDC_V") {
      data2.senderAccountId = mmAccountUSDC;   // set 

      // calculate amount using price
      if(tokenOut === "ETH") {
        data2.amount = (amount*prices.eth).toString();    // ETH -> USD
      } else if(tokenOut === "BANK") {
        data2.amount = (amount*prices.bank).toString();    // BANK -> USD
      } else {
        // usd to usd exchange from FIAT wallet
        data2.amount = amount;
      }
    }

    console.log(data2);

    if(tokenIn === "USDC_V") {
      // its a CC Load
      alert("You are loading your CC for FIAT Spending with " + data2.amount + " USD");
    } else {
      alert("You get back: " + data2.amount + " of "+tokenIn+" (confirm)");

    }



    // if its ETH

    //  for SEND USD 
    // let data = {
    //   "senderAccountId": acct1,
    //   "recipientAccountId": mmAccountUSD,
    //   "amount": amount     
    // }

    // console.log(data);



    // let data2 = {
    //   "senderAccountId": mmAccountETH,
    //   "recipientAccountId": acct2,
    //   "amount": calcAmount  
    // }

    // first send out
    const response = await fetch(`/api/transfer`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
      })
    await response;

    // second send out
    const responseTwo = await fetch(`/api/transfer`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data2)
      })
    await responseTwo;

    alert("Your SWAP has been successfully completed with status: "+responseTwo.status + " Manual refresh accounts.");  

    // refresh the accounts display


  }

export function SwapForm(props) {

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


    const [inputs, setInputs, ] = useState({});   //inputNames, setInputNames
    // const [acct, setAcct] = useState({});
    const handleSubmit = (event) => {
        // alert('Your balance is: ' + balance);
        console.log("SUBMIT:", inputs);

        let acct1 = inputs.currencyOut;       // accoutn 1 is user accout they are sending tokens from
        let acct2 = inputs.currencyIn;        // accoutn 2 is user account to receive tokens
        // let baseCurrency = props.state.baseCurrency   // use base currency to enable SWAP from MM

        // console.log(props.state.baseCurrency);

        console.log("SWAP confrimation sheet required here w/ " + inputs.type, inputs.currencies, inputs.amount, inputs.price)

        // console.log(props.state.prices);

        createSwap(inputs.amount, acct1, acct2, props.state.prices);

        event.preventDefault();
    }

    const handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;

        // let curOut = document.getElementById('currencyOut');
        // let curVal = curOut.value;
        //let curOutText = curOut.options[curOut.selectedIndex].text;
        // console.log(curOut.value, curOut.options[curOut.selectedIndex].text);


        setInputs(values => ({...values, [name]:value }));
        // setInputNames(values => ({ ...values, [name]:curOutText }))

        console.log("Also toggles on select dropdown");
    }

    let accounts = props.state.account_list;

    if(accounts.length > 0) {
      let placeholderAmount = props.state.account_list.length > 0 ? props.state.account_list[0].balance.accountBalance : 0;
      // let placeholderPrice = props.state.account_list.length > 0 ? props.state.prices.bank : "add some accounts";


      return (

        <div className="col-md-6">
          <form className="trForm" onSubmit={handleSubmit}>
            <h5>Self Swap your own tokens @ market</h5>

            {/*<div className="row">
              <label htmlFor="selectBS" className="col-sm-2 col-form-label col-form-label-sm">Buy/Sell:</label>

              <div className="col-sm-10">
                <select id="selectBS" name="type" defaultValue="" onChange={handleChange}>
                  <option value="">...</option>
                  <option value="BUY">BUY</option>
                  <option value="SELL">SELL</option>
                </select>
              </div>
            </div>*/}

            <h4>I want to swap my {inputs.currencyOut} for {inputs.currencyIn}</h4>

            <div className="tokenBox">
              <div className="row">
                <div className="col">
                  <select id="currencyOut" name="currencyOut" defaultValue="lime" onChange={handleChange}>
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
                  <p>Balance:</p>
                </div>
                <div className="col">
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
                  <button>MAX</button>
                </div>
              </div>
            </div>

            <div className="flipButtonBox">
              <img className='alertLogo' src='https://via.placeholder.com/300' alt='' />
            </div>

            <div className="tokenBox">
              <div className="row">
                <div className="col">
                  <select id="currencyIn" name="currencyIn" defaultValue="lime" onChange={handleChange}>
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
                  <p>MyBalance:</p>
                </div>
                <div className="col">
                  <p>RCV num</p>
                  <p>TOTAL: ${solo}</p>
                </div>
              </div>
            </div>

{/*            <div className="row">
              <label htmlFor="currencyOut" className="col-sm-2 col-form-label col-form-label-sm">Token Out:</label>

              <div className="col-sm-10">
                
              </div>
            </div>*/}

            {/*<div className="row">
              <label htmlFor="amount" className="col-sm-2 col-form-label col-form-label-sm">Amount:</label>

              
            </div>*/}

            {/*<div className="row">
              <label htmlFor="currencyIn" className="col-sm-2 col-form-label col-form-label-sm">Token In:</label>

              <div className="col-sm-10">
                
              </div>
            </div>*/}


{/*            <div className="row">
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
            </div>*/}

            
            
            
            <input id="tradeSubmit" type="submit" value="Submit Swap" />
            
            <hr />
            <h6>BUY/SELL from/to your accounts using Bcard MM.</h6>

          </form>
        </div>

    )
    } else {
      // if no accounts, don't show the trade form
      return "";
    }

    

}