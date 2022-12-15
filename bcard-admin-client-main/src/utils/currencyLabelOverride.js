export function currencyLabelOverride(cur) {
    if(cur === "VC_USD") {
      return "USD";
    } else if(cur === "USDC_V") {
      return "USDC VISA";
    } else {
      return cur;
    }
  }