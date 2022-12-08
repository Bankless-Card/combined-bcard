
/** getPrices in BcardApi.js **/

// list functions is access/use order

// user login - firebase auth

// getCustomers:
// getAccounts:
// 


// returning users (autologin) - auth from state

// getCustomers: logged-in user ID matchup with CustID for tatum internal system

export async function getLedgerAccounts() {

    const response = await fetch('/api/ledgeraccounts');
    // console.log(response);
    return await response.json();
}

export async function getCustomers() {

    console.log("Running getCustomers");

    const response = await fetch('/api/customers');
    return await response.json();
}

export async function getAccount(id) {

    console.log("Running getAccount");        // id here is CustID

    const response = await fetch('/api/account/'+ id );
    // console.log(response);                  // these are logging OK to console, but are not being displayed for third acct.
    return await response.json();
}

export async function getVC(name) {

    console.log(name);

    const response = await fetch('/api/vc/'+ name );
    console.log(response);
    return await response.json();
}

export async function createTrade(data) {

    console.log(data);

    const response = await fetch(`/api/trade`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
      })
    return await response;
}

export async function showTrades() {

    const response = await fetch('/api/trades' );
    // console.log(response);
    console.log("function showTrades fetched from /api/trades");
    return await response.json();
}

export async function getBalance(list, state) {
    // console.log(list, state);

    let myAccounts = list;
    let runTotal = 0;

    // map allows forEach account, do a thing
    myAccounts.map(
        (acct)=>{

            // console.log(acct);
            let BTCprice,
                ETHprice,
                CHFprice,
                USDprice,
                BANKprice = 0;

          let currencyId = acct.currency
          if( acct.currency.startsWith("VC_") ) {
            // console.log('hotfix');
            currencyId = currencyId.substring(3);               // remove the VC to get the FIAT FX
          }

          // this will depend on default currency (CAD in my case)

          // console.log(state.prices)
          // console.log(state.baseCurrency)
          if(state.prices.length < 1) {
            // no prices yet...
            console.log("Placeholder CAD Hardcoded",state.prices);

            BTCprice = 21741;
            ETHprice = 1526;
            CHFprice = 1.404;
            USDprice = 1.341;
            BANKprice = 0.1;

          } else {
            // e.g. if BASEprice is 1, account BASE is set to CAD, then 
              // prices should be listed/displayed in home currency

              const BASEprice = 1;

              if(state.baseCurrency === "USD"){
                // usd defaults - hard coded if prices not set
                   BTCprice = state.prices.btc || 16104/BASEprice;
                   ETHprice = state.prices.eth || 1124/BASEprice;
                   CHFprice = state.prices.chf || 1.0/BASEprice;
                   USDprice = state.prices.usd || 1.043/BASEprice;
                   BANKprice = state.prices.bank || 0.08/BASEprice;
              } else {
                // cad defaults
                   BTCprice = state.prices.btc || 21741/BASEprice;
                   ETHprice = state.prices.eth || 1526/BASEprice;
                   CHFprice = state.prices.chf || 1.404/BASEprice;
                   USDprice = state.prices.usd || 1.341/BASEprice;
                   BANKprice = state.prices.bank || 0.1/BASEprice;
              }

              


              let balInit = acct.balance.accountBalance;
              let balConv = parseFloat(balInit);  //* parseFloat(BTCprice);
              // let thisPrice = CADprice;

              // console.log(currencyId);

              if(currencyId === "BTC") {
                balConv = parseFloat(balInit) * parseFloat(BTCprice);
              } else if(currencyId === "ETH"){
                balConv = parseFloat(balInit) * parseFloat(ETHprice);
              } else if(currencyId === "CHF") {
                balConv = parseFloat(balInit) * parseFloat(CHFprice);
              } else if(currencyId === "USD") {
                balConv = parseFloat(balInit) * parseFloat(USDprice);
              } else if(currencyId === "BANK") {
                balConv = parseFloat(balInit) * parseFloat(BANKprice);
              }

              // console.log(balConv);

              runTotal = runTotal + balConv;        // sum total in default currency (CAD)

              return runTotal;
          }

        return runTotal;                // return sum on price failure


      });

    return runTotal;                // return sum when completed
}

export async function newBTCMaster(){
    const response = await fetch('/api/bitcoin/wallet');
    console.log(response);
    return await response.json();
}

export async function newBTCAccount(data) {

    console.log(data);

    if(data.xpub === ""){
        // fail without xpub - this is ok for internal accounts without blockchain/wallet required, but YMMV
        return false;
    }

    const response = await fetch('/api/ledger/account', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
      });
    // console.log(response);
    // return await response.json();
    return await response;
}

export async function newUSDWallet(userId) {

    console.log(userId);
    
    if(userId === ""){
        // fail without xpub - this is ok for internal accounts without blockchain/wallet required, but YMMV
        return false;
    }

    let data = {
        "currency": "VC_USD",
        "customer": {
            "accountingCurrency": "USD",            
            "externalId": userId,                  
        },
        "accountingCurrency": "USD"
    }

    const response = await fetch('/api/ledger/account/', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
      });

    console.log(response);
    return await response;
}



export async function getEthAddress(acctId, index) {

    console.log(acctId, index);

    const response = await fetch('/api/ethereum/address/'+acctId+'/'+index );
    console.log(response);
    return await response.json();
}

export async function newWalletAddress(id) {

    console.log(id);

    if(id === "accountId") {
        // default account id is for BCARD_FEES BTC account with id: 636bb54f5f95f8f981cbc519
        id = "636bb54f5f95f8f981cbc519";
    }

    const response = await fetch('/api/address/account/'+ id );
    console.log(response);
    return await response.json();
}

export async function walletAddressInfo(id) {
    console.log("Get Info Modal for Account with Id: " + id);


    if(id === "accountId" || id === "") {
        // default account id is for BCARD_FEES BTC account with id: 636bb54f5f95f8f981cbc519
        id = "636bb54f5f95f8f981cbc519";
    }

    const response = await fetch('/api/ledger/account/'+ id );
    console.log(response);
    return await response.json();
}



/********************************* Obsolete? ******************************/

export async function getAllUsers() {

    const response = await fetch('/api/users');
    return await response.json();
}


export async function createUser(data) {
    const response = await fetch(`/api/user`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({user: data})
      })
    return await response.json();
}