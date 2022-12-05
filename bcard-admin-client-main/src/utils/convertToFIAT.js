export function convertToCAD(amount, currency, state) {

  // console.log(amount, currency);    // , state);
  // currency also can receive pair from trades

  let rate = 1;   // default to 1-1 token rate

  // catch and reject all undefined requests for price conversion 
  if(currency) {

    if(currency.includes("/")) {
      console.log("It's a pair price instead for trades - FIX req.");

      // add in pairs quotes here
      if(currency.startsWith("BTC/VC_")) {
        // it's a BTC Trade for FIAT
        rate = state.prices.btc || 27111;
      } else if(currency.startsWith("BTC/")) {
        // it's a BTC trade for Crypto
      } else if(currency.startsWith("BANK/")) {
        // it's a BANK trade for FIAT
        rate = state.prices.bank;
      } else if(currency === "VC_USD/VC_CAD") {
        rate = state.prices.usd;
      } 

    } else if(currency === "ETH") {
      rate = state.prices.eth || 2111;
    } else if(currency === "BTC" ) {
      rate = state.prices.btc || 27111;
    } else if (currency === "VC_USD") {
      rate = state.prices.usd || 1.3;
    } else if (currency === "VC_CHF" || currency === "VC_CHF/VC_CAD") {
      rate = state.prices.chf || 1.3;
    } else if (currency === "BANK" || currency === "BANK/VC_CAD") {
      rate = state.prices.bank || 0.1;
    } else if (currency === "VC_CAD" ) {
      rate = state.prices.cad || 0.8;
    } else {
      console.log("Not in set of matched prices.");
    }

    //finish result 
    // console.log(currency, state.prices,rate,amount*rate);
    return amount * rate;


  } else {
    console.log("Check call, currency is UNDEFINED.");
    return 0;
  }


}