
/** this functio uses Tatum API and CoinGecko API to get published crypto prices **/
export async function getPrices(base) {
    
    // console.log(base);

    if(base === undefined || base === '') {
        base = "USD";    
        console.log("USD default set here at API call for initial load.");
    }

    const response = await fetch('/api/prices/'+base);
    if(response.status === 200) console.log("Successful call to /api/prices");
    return await response.json();
}



// export async function getCustomers() {

//     const response = await fetch('/api/customers');
//     // console.log(response);
//     return await response.json();
// }

// export async function getAccount(id) {

//     console.log(id);

//     const response = await fetch('/api/account/'+ id );
//     // console.log(response;                  // these are logging OK to console, but are not being displayed for third acct.
//     return await response.json();
// }

// export async function getVC(name) {

//     console.log(name);

//     const response = await fetch('/api/vc/'+ name );
//     console.log(response);
//     return await response.json();
// }

// export async function createTrade(data) {

//     console.log(data);

//     const response = await fetch(`/api/trade`, {
//         method: 'POST',
//         headers: {'Content-Type': 'application/json'},
//         body: JSON.stringify(data)
//       })
//     return await response;
// }

// export async function showTrades() {

//     const response = await fetch('/api/trades' );
//     // console.log(response);
//     console.log("function showTrades fetched from /api/trades");
//     return await response.json();
// }

// export async function getBalance(list, state) {
//     // console.log(list, state);

//     let myAccounts = list;
//     let runTotal = 0;

//     // map allows forEach account, do a thing
//     myAccounts.map(
//         (acct)=>{

//             // console.log(acct);

//           let currencyId = acct.currency
//           if( acct.currency.startsWith("VC_") ) {
//             // console.log('hotfix');
//             currencyId = currencyId.substring(3);               // remove the VC to get the FIAT FX
//           }

//           // this will depend on default currency (CAD in my case)

//           console.log("Placeholder CAD Hardcoded",state.prices);

//           // e.g. if BASEprice is 1, account BASE is set to CAD, then 
//           // prices should be listed/displayed in home currency

//           const BASEprice = 1;
//           const BTCprice = state.prices.btc || 27000/BASEprice;
//           const ETHprice = state.prices.eth || 2111/BASEprice;
//           const CHFprice = state.prices.chf || 1.3/BASEprice;
//           const USDprice = state.prices.usd || 1.37/BASEprice;


//           let balInit = acct.balance.accountBalance;
//           let balConv = parseFloat(balInit);  //* parseFloat(BTCprice);
//           // let thisPrice = CADprice;

//           // console.log(currencyId);

//           if(currencyId === "BTC") {
//             balConv = parseFloat(balInit) * parseFloat(BTCprice);
//           } else if(currencyId === "ETH"){
//             balConv = parseFloat(balInit) * parseFloat(ETHprice);
//           } else if(currencyId === "CHF") {
//             balConv = parseFloat(balInit) * parseFloat(CHFprice);
//           } else if(currencyId === "USD") {
//             balConv = parseFloat(balInit) * parseFloat(USDprice);
//           }

//           // console.log(balConv);

//           runTotal = runTotal + balConv;        // sum total in default currency (CAD)

//           return runTotal;

//       });

//     return runTotal;                // return sum when completed
// }

// export async function newBTCMaster(){
//     const response = await fetch('/api/bitcoin/wallet');
//     console.log(response);
//     return await response.json();
// }

// export async function newBTCAccount(data) {

//     console.log(data);

//     if(data.xpub === ""){
//         // fail without xpub - this is ok for internal accounts without blockchain/wallet required, but YMMV
//         return false;
//     }

//     const response = await fetch('/api/ledger/account', {
//         method: 'POST',
//         headers: {'Content-Type': 'application/json'},
//         body: JSON.stringify(data)
//       });
//     // console.log(response);
//     // return await response.json();
//     return await response;
// }

// export async function newWalletAddress(id) {

//     console.log(id);

//     if(id === "accountId") {
//         // default account id is for BCARD_FEES BTC account with id: 636bb54f5f95f8f981cbc519
//         id = "636bb54f5f95f8f981cbc519";
//     }

//     const response = await fetch('/api/address/account/'+ id );
//     console.log(response);
//     return await response.json();
// }

// export async function walletAddressInfo(id) {
//     console.log(id);

//     if(id === "accountId") {
//         // default account id is for BCARD_FEES BTC account with id: 636bb54f5f95f8f981cbc519
//         id = "636bb54f5f95f8f981cbc519";
//     }

//     const response = await fetch('/api/ledger/account/'+ id );
//     console.log(response);
//     return await response.json();
// }

// export async function newWalletKey(index,input) {
//     console.log(index,input);

//     if(index === "") {
//         index = 0;
//     }

//     let data = {
//         "index": index,
//         "mnemonic": input
//     }

//     const response = await fetch('/api/bitcoin/wallet/priv', {
//         method: 'POST',
//         headers: {'Content-Type': 'application/json'},
//         body: JSON.stringify(data)
//       });

//     return await response.json();

//     // const response = await fetch('/api/key/account/'+ id );
//     // console.log(response);
//     // return await response.json();
// }

