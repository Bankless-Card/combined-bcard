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

function setMax(event, handleChange) {
  event.preventDefault();

  let thisMax = document.getElementById('maxAvailable').innerHTML;
  let thisSwapAmt = document.getElementById('swapAmount');
  thisSwapAmt.value = thisMax;

  event.target.name = "amount";
  event.target.value = thisMax;

  // event.target.name
  // event.target.value
  
  handleChange(event);
}

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

    // let solo = "XYZ";


    const [inputs, setInputs, ] = useState({});   //inputNames, setInputNames
    // const [acct, setAcct] = useState({});
    // let [outName, setOutName] = useState({});
    // const [inName, setInName] = useState("IN");

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

    // setOutName("OUT");
    //setInName ("IN");

    const handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;

        let accts = props.state.account_list;

        let curOut = document.getElementById('currencyOut');
        // let curVal = curOut.value;
        let curOutText = curOut.options[curOut.selectedIndex].text;
        let curIn = document.getElementById('currencyIn');
        let curInText = curIn.options[curIn.selectedIndex].text;
        //console.log(curOutText);
        console.log(name);

        let myPrevBal = document.getElementById('myBalance');

        let calcAmt = 0.00;
        let tokenAmt = value;
        let totalAmt = 0.00;

        if(name==="currencyOut" && curOutText) {
          // relabel title

          let labelTokenOut = document.getElementById('outName');
          labelTokenOut.innerHTML = curOutText

          // get balance from current account
          // let accts = props.state.account_list;
          // console.log(accts);
          let matchAcct = accts.find(e => e.currency === curOutText);
          console.log(matchAcct.balance.availableBalance);

          let maxAvailableOutput = parseFloat(matchAcct.balance.availableBalance).toFixed(3);
          if(curOutText === "ETH"){
            maxAvailableOutput = parseFloat(matchAcct.balance.availableBalance).toFixed(6);
          }

          // relabel out Balance
          let maxLabel = document.getElementById('maxAvailable');
          maxLabel.innerHTML = maxAvailableOutput;
          // maxLabel.blur();

        } else if(name==="currencyIn" && curInText) {

          let labelTokenIn = document.getElementById('inName');
          labelTokenIn.innerHTML = curInText

          myPrevBal.innerHTML = 0.00;

          // get balance from current account
          let matchAcct = accts.find(e => e.currency === curInText);
          // console.log(matchAcct.balance.availableBalance);

          let currentBal = parseFloat(matchAcct.balance.accountBalance).toFixed(3);
          if(curInText === "ETH"){
            currentBal = parseFloat(matchAcct.balance.accountBalance).toFixed(6);
          }

          // relabel out Balance
          let currentLabel = document.getElementById('myBalance');
          currentLabel.innerHTML = currentBal;
          // maxLabel.blur();

          // also update total on token desired update
          // update the TOTAL in USD, if both tokens are selected
          if(curOutText && curInText) {

            // value here is token amount
            if(curOutText === "USDC_V" || curOutText === "VC_USD") {
              totalAmt = tokenAmt;    // sending USD, pass through value

            } else if (curOutText === "BANK") {
              // sending BANK
              totalAmt = tokenAmt * props.state.prices.bank;    // in USD

            } else if (curOutText === "ETH") {
              // sending ETH
              totalAmt = tokenAmt * props.state.prices.eth;     // USD

            }

            let labelTotal = document.getElementById('totalAmt');
            labelTotal.innerHTML = totalAmt;

          }


        } else if(name === "amount") {
          // then value is the amount of token to be traded

          // update the TOTAL in USD, if both tokens are selected
          if(curOutText && curInText) {

            // value here is token amount
            if(curOutText === "USDC_V" || curOutText === "VC_USD") {
              totalAmt = tokenAmt;    // sending USD, pass through value

              if(curInText === "USDC_V" || curInText === "VC_USD") {
                calcAmt = tokenAmt;     // receiving USD
              } else if (curInText === "ETH"){
                // receiving ETH
                calcAmt = tokenAmt / props.state.prices.eth;    // in ETH Tokens
              } else if (curInText === "BANK"){
                // receiving BANK
                calcAmt = tokenAmt / props.state.prices.bank;    // in BANK Tokens
              }


            } else if (curOutText === "BANK") {
              // sending BANK
              totalAmt = tokenAmt * props.state.prices.bank;    // in USD

              if(curInText === "USDC_V" || curInText === "VC_USD") {
                calcAmt = totalAmt;     // receiving USD
              } else if (curInText === "ETH"){
                // receiving ETH
                calcAmt = totalAmt / props.state.prices.eth;    // in ETH Tokens
              } else if (curInText === "BANK"){
                // receiving BANK
                calcAmt = totalAmt / props.state.prices.bank;    // in BANK Tokens
              }
            } else if (curOutText === "ETH") {
              // sending ETH
              totalAmt = tokenAmt * props.state.prices.eth;     // USD

              if(curInText === "USDC_V" || curInText === "VC_USD") {
                calcAmt = totalAmt;     // receiving USD
              } else if (curInText === "ETH"){
                // receiving ETH
                calcAmt = totalAmt / props.state.prices.eth;    // in ETH Tokens
              } else if (curInText === "BANK"){
                // receiving BANK
                calcAmt = totalAmt / props.state.prices.bank;    // in BANK Tokens
              }
            }

            let labelTotal = document.getElementById('totalAmt');
            labelTotal.innerHTML = totalAmt;

            let labelCalc = document.getElementById('calcAmt');
            labelCalc.innerHTML = calcAmt;
          }
        }

        setInputs(values => ({...values, [name]:value }));

        // console.log("Also toggles on select dropdown");
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

            <h4>I want to swap my <span id="outName">{"outName"}</span> for <span id="inName">{"inName"}</span></h4>

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
                  <p>Balance: <span id="maxAvailable">0</span></p>
                </div>
                <div className="col">
                  <div className="col-sm-10">
                    <input 
                      id="swapAmount"
                      name="amount" 
                      type="text" 
                      value={inputs.amount}
                      placeholder={placeholderAmount} 
                      onChange={handleChange} 
                    />
                  </div>
                  <button
                    className="maxBtn"
                    onClick={(e) => setMax(e,handleChange)}
                  >MAX</button>
                </div>
              </div>
            </div>

            <div className="flipButtonBox"
              onClick={() => console.log("this should flip token currency names")}
              >
              <img className='alertLogo' src='img/swap.png' alt='swap-logo' />
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
                  <p>MyBalance: <span id="myBalance">0</span></p>
                </div>
                <div className="col">
                  <p id="calcAmt"><strong>RCV num</strong></p>
                  <p>TOTAL: $<span id="totalAmt">XX.YY</span></p>
                </div>
              </div>
            </div>
            
            
            <input class="btn btn-danger" id="tradeSubmit" type="submit" value="Submit Swap" />
            
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