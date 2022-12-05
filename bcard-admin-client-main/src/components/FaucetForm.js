import React, { useState } from 'react'
// import { showTrades } from '../services/UserService'


async function createFaucet(amount, acct1, acct2) {

    console.log(amount, acct1, acct2);

    if(!acct1){
      acct1 = "6388bfd1345a7219f7e369e9";          // fund with BCARD VC_USD Wallet
    } 

    // detail needed to exexute the trade request via API
    let data = {
      "senderAccountId": acct1,
      "recipientAccountId": acct2,
      "amount": amount     
    }

    console.log(data);

    if (parseFloat(amount) > 100) {
      alert("Please enter an amount =< $100 to be funded.");
    } else if(false) {
      // check dropdown selector to ensure proper currency is selected
      alert("transaction.currency.incompatible");

    } else {
      // proceed with transfer request
    

      const response = await fetch(`/api/transfer`, {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify(data)
        })
      await response;

      let transfer_conf = response;

      console.log(transfer_conf);
      console.log("RETURN FROM TATUM API FOR CREATE TRANSFER - admin function");
      alert("Your Transfer has been successfully completed");  

      alert("Refresh Accounts above to see updated balance - automate.")

      // refresh the trades display

    }
    

  }

export function FaucetForm(props) {

    // console.log(props.state.custId);   // use PROPS to pass in the account list for the selected user with which to buld the options for selection
    // const [solo, setSolo] = useState({});

    let solo = "XYZ";
    var acct1 = "";


    const [inputs, setInputs] = useState({});
    // const [acct, setAcct] = useState({});
    const handleSubmit = (event) => {
        // alert('Your balance is: ' + balance);
        console.log("SUBMIT:", inputs, acct1);

        console.log("Find a way to submit this request to API", acct1);

        let selAct2 = document.getElementById('selAcct2');
        let acct2 = selAct2.value;    // should be account id for selected currency

        // acct1 = curVal;

        console.log("Need to get account number for base Currency Account")
        console.log("Cheat for now by funding all trades from the BCARD VC_CAD Wallet")

        console.log(acct2)

        // let acct2;

        createFaucet(inputs.amount, acct1, acct2);

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

    return (
      <div className="col-md-6">
        <form className="tsForm" onSubmit={handleSubmit}>
        <h3>Get VC_USD from faucet</h3>
        <select id="acct1" name="acct1" defaultValue="" onChange={handleChange} disabled>
          <option value="">->from</option>

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
        <select id="selAcct2" name="acct2" onChange={handleChange}>
          <option value="">->to</option>
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
        <input 
          name="amount" 
          type="text" 
          value={inputs.amount} 
          placeholder={props.state.account_list.length > 0 ? props.state.account_list[0].balance.accountBalance : 0} 
          onChange={handleChange} 
        />
    
        <input type="submit" value="Submit Transfer" />
        TOTAL: ${solo}
        <p>Chose your VC_USD account from the dropdown and enter amount (less than 100) to fund your virtual account.</p>
       </form>
      </div>

    )

}