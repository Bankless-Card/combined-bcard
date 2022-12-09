import React from 'react'

import {convertToCAD} from '../utils/convertToCAD'
import {walletAddressInfo} from '../services/UserService'

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
        let fiatBalance = convertToCAD(account.balance.accountBalance,account.currency,state).toFixed(3).replace(/\d(?=(\d{3})+\.)/g, '$&,');;

        if(account.currency === "BANK"){
            // ok with defaults
        } else if(account.currency === "VC_USD"){
            tokenImg = "img/us-flag-icon.png";
            tokenName = "US Dollar FIAT";
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
                        <img className="tokenBadge" src={tokenImg} alt="BDAO" />
                    </div>
                  </td>
                  <td className="tokenLabel" title={ state.acctAddress || "SHOW WALLET ADDRESS ON HOVER: " }>
                  {tokenName} <span>-1.81%</span><br/>
                  
                    <div
                      type="btn"
                      onClick={async () => {
                        let returnData = await walletAddressInfo(account.id);
                        console.log(returnData);
                        if(returnData[0]) {

                            let walletAddress = returnData[0].address
                            alert("Address is:" + walletAddress);
                            console.log("Need to setState here to set address & QR");
                            console.log(state);
                            
                        } else {
                            alert("Submit Deposit to fund FIAT Account");
                            console.log("It's a FIAT account - likely - or no addresses created");
                        }
                        
                      }} >
                      <small>{tokenTag}</small>
                    </div>
                  </td>
                  <td>
                    {tokenBalance} <small>{account.currency}</small><br/>
                    <span>$ { fiatBalance }</span> <small>{account.accountingCurrency}</small>
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
        for (let row of moreRows) {
            console.log(row);
            row.classList.remove('surplus')
        }
    }
    
    // moreRows.forEach(element => console.log(element))

    return(
        <div className="container">
            <h2>My Tokens</h2>
            <table className="table" isactive={moreShow.toString()}>
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
                    <td colSpan="3"><hr/><br/>
                        <button
                            onClick={() => {
                                showAll(moreRows)
                            }}
                        >...show more ... </button>
                    </td>
                }</tr></tfoot>
            </table>
        </div>
    )
}