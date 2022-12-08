import React, { useState } from 'react'
// import { showTrades } from '../services/UserService'

import { feesAccts } from '../services/feesAccounts'

const feesAcctUSDC = feesAccts.USDC;
const feesAcctUSD = feesAccts.USD;
const feesAcctETH = feesAccts.ETH;
const feesAcctBANK = feesAccts.BANK;


async function createTransfer(amount, acct1, acct2) {

    // console.log(amount, acct1, acct2);

    if(!acct1){
      acct1 = "6388bfd1345a7219f7e369e9";          // fund with BCARD VC_USD Wallet
    } 

    // detail needed to exexute the trade request via API
    let data = {
      "senderAccountId": acct1,
      "recipientAccountId": acct2, // "6388bfd1345a7219f7e369e9",     //acct2 
      "amount": amount     
    }

    // console.log(data);

    if (parseFloat(amount) > 1000) {
      alert("Please enter an amount =< $1000 to be funded.");
    } else if(false) {
      // check dropdown selector to ensure proper currency is selected
      alert("transaction.currency.incompatible");

    } else {
      // proceed with transfer request

      alert("Confirm SEND of " + amount + " to " + acct2);
    

      await fetch(`/api/transfer`, {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify(data)
        })
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          if(data.reference){
            console.log("RETURN FROM TATUM API FOR CREATE TRANSFER - admin function");
            alert("Your Transfer has been successfully completed");  
            alert("Refresh Accounts above to see updated balance - automate.")
          } else if(data.message) {
            alert("FAILURE 403: No Compatible Currency At Recipient");
          } else {
            alert("FAILURE: ");
          }

        })



    }
    

  }

export function TransferForm(props) {

    // console.log(props.state.custId);   // use PROPS to pass in the account list for the selected user with which to buld the options for selection

    let myRecipients = [];
    let sampleReceiver = {
      name: "Tom Jones", 
      usd: "638671aa4eae0996fbd56c5c",
      bank: "6388b714223d45b926e3995b",
      eth: "6388b5a6ee6fd766995da1c0",
      usdc: "6388ba0973184d447e74a595"
    }
    let bcardService = {
      name: "BCard Service",
      usd: feesAcctUSD,
      bank: feesAcctBANK,
      eth: feesAcctETH,
      usdc: feesAcctUSDC
    }

    // if(props.state.recipients.length < 1) {
     // console.log("recipients are empty, setting default recipients only"); 
     myRecipients.push( bcardService,sampleReceiver );
    // }

    let solo = "XYZ USD";
    // var acct1 = "";
    // var acct2 = "";

    const [inputs, setInputs] = useState({});
    // const [acct, setAcct] = useState({});
    const handleSubmit = (event) => {
        // alert('Your balance is: ' + balance);
        console.log("SUBMIT:", inputs.acct1, inputs.acct2);

        // acct1 -> currency_type of account for user from which to transfer tokens

        // acct2 -> user name -> SHORTCUT to whom to transfer funds (link below)


        // let selAct2 = document.getElementById('selAcct2');
        let selAct1 = document.getElementById('selAcct1');
        let acctVal1 = selAct1.value;

        let selAct2 = document.getElementById('rcvAcct2');
        let acctVal2 = selAct2.value;    // should be account id for selected user


        console.log(acctVal1,acctVal2);
        // console.log(acct2, myRecipients[0], myRecipients[0].name)


        let rcvAcct = feesAcctUSD;    // default receiver account SERVICE VC_USD


        if(inputs.acct2 === "BCard Service") {
          // set recipient account to SERVICE

          console.log(inputs.acct1)
          // needs to match currencies.
          if(inputs.acct1 === "VC_USD") {
            // same one is ok for default 
          } else if(inputs.acct1 === "USDC_V"){
            rcvAcct = feesAcctUSDC;
          } else if(inputs.acct1 === "BANK"){
            rcvAcct = feesAcctBANK;
          } else if(inputs.acct1 === "ETH"){
            rcvAcct = feesAcctETH;
          }


        } else if(inputs.acct2 === 'Tom Jones'){

          console.log("Hello", inputs.acct1);
          console.log(myRecipients[1]);         // match in recpients object
          if(myRecipients[1] === inputs.acct2) console.log("Winner");

          let sendAcct = inputs.acct1;

            switch(sendAcct){
              case "VC_USD":
                rcvAcct = myRecipients[1].usd;
                break;
              case "BANK":
                console.log("BBtime");
                // console.log(myRecipients[1].bank);
                rcvAcct = myRecipients[1].bank;
                break;
              case "ETH":
                rcvAcct = myRecipients[1].eth;
                break;
              case "USDC_V":
                rcvAcct = myRecipients[1].usdc;
                break;
              default:
                rcvAcct = feesAcctUSD;      // service account USD if nothing
            } 
            // rcvAcct = sampleReceiver.usd;   // user ...Tom Jones TESTUSER
        }



        // let acct2;

        createTransfer(inputs.amount, acctVal1, rcvAcct);

        event.preventDefault();
    }

    const handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;

        if(name === "acct1"){
          let selectedAccount = document.getElementById('selAcct1');
          let actVal = selectedAccount.value;
          let actText = selectedAccount.options[selectedAccount.selectedIndex].text;
          console.log(actVal, actText);

          // acct1 = actVal;

          // console.log(acct1);
            // store the text in place of the value here as it is uesd to pass the account ID#
          setInputs(values => ({...values, [name]:actText }));

        } else if(name === "acct2"){
          let selAcct2 = document.getElementById('rcvAcct2');

          // console.log(selAcct2)

          let act2Val = selAcct2.value;
          let act2Text = selAcct2.options[selAcct2.selectedIndex].text;
          console.log(act2Val, act2Text);

          // acct2 = act2Val;

          // console.log(acct2);
            // store the value of the text in place of the value here as value is uesd to pass the account ID#
          setInputs(values => ({...values, [name]:act2Text }));
        } 

        else {
          setInputs(values => ({...values, [name]:value }));
        }

        // console.log(inputs);
        // console.log(inputs.amount * inputs.price)

        // let soloAmt = (inputs.amount * inputs.price).toFixed(2);

        // setInputs("solo", soloAmt);

        // solo = (inputs.amount * inputs.price).toFixed(2);

        //setSolo("HOLLA");

        // console.log("Also toggles on select dropdown");
    }

    return (
      <div className="col-md-6">
        <form className="tsForm" onSubmit={handleSubmit}>
        <h5>SEND: any asset to another person</h5>
        <select id="selAcct1" name="acct1" defaultValue="" onChange={handleChange}>
          <option value="">->from (token)</option>

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
        <select id="rcvAcct2" name="acct2" onChange={handleChange} >
          <option value="">->to (user)</option>
          {/*<option value="BCARD_SERVICE">BCard Service </option>
          <option value="TOM">Tom Jones </option>*/}
          
          { myRecipients.length > 1 ? 

            myRecipients
                .sort((a,b) => a.name > b.name ? 1 : -1)
                .map((rec, index) => (
                    <option data-index={index} value={rec.name} key={rec.usd} > 
                      {rec.name}
                    </option>
                  ))

              : <>
                  {/*<option value="grapefruit">Please Grapefruit </option>
                  <option value="lime">Select Lime </option>
                  <option value="coconut">An Coconut</option>
                  <option value="mango">Account Mango</option>*/}
                  <option value="BCARD_SERVICE">BCard Service </option>
                  <option value="TOM">Tom Jones </option>
                </>
              }

              {/*TBD Add new recipient*/}
          <option value="ADD_USER" disabled>Add a new User...</option>
          
          
              

        </select>
        <input 
          name="amount" 
          type="text" 
          value={inputs.amount} 
          placeholder={props.state.account_list.length > 0 ? props.state.account_list[0].balance.accountBalance : 0} 
          onChange={handleChange} 
        />
    
        <input type="submit" value="Send" />
        TOTAL: ${solo}
        <p>Need: How to choose recipients from customers? Invite? </p>
       </form>
      </div>

    )

}