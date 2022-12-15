import React from 'react'
import Modal from "../components/Modal";
import { feesAccts } from '../services/feesAccounts'
import { currencyLabelOverride } from '../utils/currencyLabelOverride';

const feesAcctUSDC = feesAccts.USDC;
const feesAcctUSD = feesAccts.USD;
const feesAcctETH = feesAccts.ETH;
const feesAcctBANK = feesAccts.BANK;

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

// export function SwapForm(props) {

class SwapForm extends React.Component {

  state = {
    show: false,
    inputs: [],
    accounts: []
  };

  showModal = e => {
   // e.preventDefault();
   console.log(this.state)
    // state.show = !state.show
    this.setState({
      show: !this.state.show
    });
  };

    handleSubmit = (event) => {

      event.preventDefault();

        console.log("SUBMIT:", this.state.inputs);

        let curOut = document.getElementById('currencyOut');
        let curIn = document.getElementById('currencyIn');

        let acct1 = curOut.value;       // account 1 is user account they are sending tokens from
        let acct2 = curIn.value;        // account 2 is user account to receive tokens

        console.log("SWAP confrimation sheet required here w/ " + this.state.inputs.amount + ", etc.")

        this.showModal();

        // await modal confirmation then
        alert("await modal confirmation then");

        console.log(this.state.inputs.amount, acct1, acct2, this.props.state.prices)

        createSwap(this.state.inputs.amount, acct1, acct2, this.props.state.prices);

        
    }

    handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;

        let accts = this.props.state.account_list;

        let curOut = document.getElementById('currencyOut');
        let curOutText = curOut.options[curOut.selectedIndex].text;
        let curIn = document.getElementById('currencyIn');
        let curInText = curIn.options[curIn.selectedIndex].text;
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
              totalAmt = tokenAmt * this.props.state.prices.bank;    // in USD

            } else if (curOutText === "ETH") {
              // sending ETH
              totalAmt = tokenAmt * this.props.state.prices.eth;     // USD

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
                calcAmt = tokenAmt / this.props.state.prices.eth;    // in ETH Tokens
              } else if (curInText === "BANK"){
                // receiving BANK
                calcAmt = tokenAmt / this.props.state.prices.bank;    // in BANK Tokens
              }


            } else if (curOutText === "BANK") {
              // sending BANK
              totalAmt = tokenAmt * this.props.state.prices.bank;    // in USD

              if(curInText === "USDC_V" || curInText === "VC_USD") {
                calcAmt = totalAmt;     // receiving USD
              } else if (curInText === "ETH"){
                // receiving ETH
                calcAmt = totalAmt / this.props.state.prices.eth;    // in ETH Tokens
              } else if (curInText === "BANK"){
                // receiving BANK
                calcAmt = totalAmt / this.props.state.prices.bank;    // in BANK Tokens
              }
            } else if (curOutText === "ETH") {
              // sending ETH
              totalAmt = tokenAmt * this.props.state.prices.eth;     // USD

              if(curInText === "USDC_V" || curInText === "VC_USD") {
                calcAmt = totalAmt;     // receiving USD
              } else if (curInText === "ETH"){
                // receiving ETH
                calcAmt = totalAmt / this.props.state.prices.eth;    // in ETH Tokens
              } else if (curInText === "BANK"){
                // receiving BANK
                calcAmt = totalAmt / this.props.state.prices.bank;    // in BANK Tokens
              }
            }

            let labelTotal = document.getElementById('totalAmt');
            labelTotal.innerHTML = totalAmt.toFixed(3);

            let labelCalc = document.getElementById('calcAmt');
            labelCalc.innerHTML = calcAmt.toFixed(8);
          }


        }

        if(name === "amount") {
        // break this down as it needs to set the state.inputs
        var inputsState = { ...this.state.inputs }
        inputsState.amount = value;

        this.setState({
          inputs: inputsState
        });
        } 

        // this.setInputs(values => ({...values, [name]:value }));

        // console.log("Also toggles on select dropdown");
    }


      render(){
        if(this.props.state.account_list.length > 0) {
          return (
            <div className="col-md-6">
              <form className="trForm ssForm" onSubmit={this.handleSubmit}>
                <h5>Self Swap your own tokens @ market</h5>

                <h4 className="swapTitle">I want to change my <span id="outName">{"BANK"}</span> to <span id="inName">{"ETH"}</span></h4>
                <div className="swapBoxContainer">
                  <div className="swapBox">
                    <div className="row">
                      <div className="col">
                        <select id="currencyOut" name="currencyOut" defaultValue="lime" onChange={this.handleChange}>
                        <option value="">...</option>
                        { this.props.state.account_list.length > 1 ? 

                          this.props.state.account_list
                              .sort((a,b) => a.currency > b.currency ? 1 : -1)
                              .map((account, index) => (
                                  <option data-index={index} value={account.id} key={account.id} > 
                                    {currencyLabelOverride(account.currency)}
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
                        <p className="muted">Balance: <span id="maxAvailable">0</span></p>
                      </div>
                      <div className="col">
                        <div className="">
                          <input 
                            id="swapAmount"
                            name="amount" 
                            type="text" 
                            value={this.state.inputs ? this.state.inputs.amount : 0}
                            placeholder={0} 
                            onChange={this.handleChange} 
                          />
                        </div>
                        <div
                          className="maxBtn muted"
                          onClick={(e) => setMax(e,this.handleChange)}
                        >MAX</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flipButtonBox"
                  onClick={() => console.log("this should flip token currency names?")}
                  >
                  <img className='alertLogo' src='img/swap.png' alt='swap-logo' />
                </div>

              <div className="swapBoxContainer">
                <div className="swapBox">
                  <div className="row">
                    <div className="col">
                      <select id="currencyIn" name="currencyIn" defaultValue="lime" onChange={this.handleChange}>
                      <option value="">...</option>
                      { this.props.state.account_list.length > 1 ? 

                        this.props.state.account_list
                            .sort((a,b) => a.currency > b.currency ? 1 : -1)
                            .map((account, index) => (
                                <option data-index={index} value={account.id} key={account.id} > 
                                  {currencyLabelOverride(account.currency)}
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
                      <p className="muted">Balance: <span id="myBalance">0</span></p>
                    </div>
                    <div className="col">
                      <p id="calcAmt"><strong>RCV num</strong></p>
                      <p className="muted textRight">TOTAL: $<span id="totalAmt">XX.YY</span></p>
                    </div>
                  </div>
                </div>
              </div>
                
                <button className="btn btn-danger" id="swapSubmit" type="submit" value="Done" >Done</button>
                
                <hr />
                <h6>BUY/SELL from/to your accounts using Bcard MM.</h6>

              </form>

              <Modal show={this.state.show} />

                <button onClick={e => {
                          console.log(e);
                          this.showModal();
                        }}
                > show Modal </button>
            </div>
          )
        } else {
          // if no accounts, don't show the trade form
          return "";
        }
      }

    

}

export default SwapForm;