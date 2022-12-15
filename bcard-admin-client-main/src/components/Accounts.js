import React from 'react'

import {convertToCAD} from '../utils/convertToCAD'
import {walletAddressInfo} from '../services/UserService'

import { currencyLabelOverride } from '../utils/currencyLabelOverride';

async function handleTokenClick(id){
    let returnData = await walletAddressInfo(id);
    console.log(returnData);
    if(returnData[0]) {

        let walletAddress = returnData[0].address
        alert("Address is:" + walletAddress);
        console.log("Need to setState here to set address & QR -> use return");
        // console.log(state);
        
    } else {
        alert("Submit Deposit to fund FIAT Account");
        console.log("It's a FIAT account - likely - or no addresses created");
    }
}


export const Accounts = ({state, hideId}) => {

    let accounts = state.account_list;

    if (accounts.length === 0) {
        // console.log('accounts length:::', accounts.length)
        return null;
    } else {
        // console.log('accounts length:::', accounts.length)
    }

    const AcctRow = (account,index) => {

        //  console.log(account.accountingCurrency);

        let tokenImg = "img/bLogo.png";
        let tokenName = "Bankless DAO";
        let tokenTag = "BANK";

        let tokenBalance = parseFloat(account.balance.availableBalance).toFixed(4).replace(/\d(?=(\d{3})+\.)/g, '$&,');;
        let fiatBalance = convertToCAD(account.balance.accountBalance,account.currency,state).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');;

        if(account.currency === "BANK"){
            // ok with defaults
        } else if(account.currency === "VC_USD"){
            tokenImg = "img/us-flag-icon.png";
            tokenName = "USD FIAT";
            tokenTag = "USD";
        } else if(account.currency === "USDC_V"){
            tokenImg = "img/usdcToken.jpeg";
            tokenName = "USDC VISA";
            tokenTag = "USDC";
        } else if(account.currency === "ETH"){
            tokenImg = "img/ethToken.png";
            tokenName = "Ethereum Testnet";
            tokenTag = "ETH (sep)";

            tokenBalance = parseFloat(account.balance.availableBalance).toFixed(6);
        }


        return(
              <tr key={index} className={index > 1?'surplus':''}>
                  <td>
                    <div className="badgeContainer">
                        <img 
                            className="tokenBadge" 
                            src={tokenImg} 
                            alt="BDAO" 
                            onClick={async () => handleTokenClick(account.id)}
                            //     {
                            //     let returnData = await walletAddressInfo(account.id);
                            //     console.log(returnData);
                            //     if(returnData[0]) {
    
                            //         let walletAddress = returnData[0].address
                            //         alert("Address is:" + walletAddress);
                            //         console.log("Need to setState here to set address & QR");
                            //         console.log(state);
                                    
                            //     } else {
                            //         alert("Submit Deposit to fund FIAT Account");
                            //         console.log("It's a FIAT account - likely - or no addresses created");
                            //     }
                                
                            // }} 
                        />
                    </div>
                  </td>
                  <td className="tokenLabel" title={ state.acctAddress || "SHOW WALLET ADDRESS ON HOVER: " }>
                  <span className="heroTitle">{tokenName}</span><br className="clearFloat" />
                  
                    <div
                      type="btn"
                      onClick={() => handleTokenClick(account.id)}
                        
                    //     async () => {
                    //     let returnData = await walletAddressInfo(account.id);
                    //     console.log(returnData);
                    //     if(returnData[0]) {

                    //         let walletAddress = returnData[0].address
                    //         alert("Address is:" + walletAddress);
                    //         console.log("Need to setState here to set address & QR");
                    //         console.log(state);
                            
                    //     } else {
                    //         alert("Submit Deposit to fund FIAT Account");
                    //         console.log("It's a FIAT account - likely - or no addresses created");
                    //     }
                        
                    //   }} 
                      >
                      <small className="muted">{currencyLabelOverride(tokenTag)}</small>
                    </div>
                  </td>
                  <td>
                    <span className="heroBalance">{tokenBalance} </span>
                    {/* <small>{currencyLabelOverride(account.currency)}</small> */}
                    <br className="clearFloat"/>
                    <span className="muted">$ { fiatBalance } <small>{currencyLabelOverride(account.accountingCurrency)}</small> </span><span className="dailyMove">-1.81%</span>
                  </td>
                  
              </tr>
          )
    }

    // let fiatBalance = convertToCAD(account.balance.accountBalance,account.currency,state).toFixed(3).replace(/\d(?=(\d{3})+\.)/g, '$&,');;


    const tokenTable = accounts.sort((a,b) => a.balance.accountBalance < b.balance.accountBalance ? 1 : -1).map((user,index) => AcctRow(user,index))

    let moreShow = false;

    let moreRows = document.getElementsByClassName('surplus');
    // console.log(moreRows);

    function showAll(moreRows) {

        console.log(moreRows);

        // if moreRows conditional move to wallet page

        for (let row of moreRows) {
            console.log(row);
            row.classList.remove('surplus')
        }
    }
    
    // moreRows.forEach(element => console.log(element))

    return(
        <div id="myTokensContainer" className="container">
            <div id="myTokensBacker">
                <h4>My tokens</h4>
                <table id="myTokens" className="table" isactive={moreShow.toString()}>
                    {/*<thead>
                    <tr>
                        <th>TokenLogo</th>
                        <th>Info</th>
                        <th>token & balance</th>
                    </tr>
                    </thead>*/}
                    <tbody>
                        {tokenTable}
                    </tbody>
                    <tfoot><tr>{accounts.length > 2 &&
                        <td colSpan="3">
                            
                            <div className="btn"
                            onClick={() => {
                                showAll(moreRows);
                                console.log("show more, show more, see all -> wallet");
                            }}
                            ><p>See all</p></div>
                            
                        </td>
                    }</tr></tfoot>
                </table>
            </div>
        </div>
    )
}