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

        return(
              <tr key = {index} className={index%2 === 0?'odd':'even'}>
                  <td>{index + 1}</td>
                  { !hideId && 
                    <td>
                    <button 
                      type="btn"
                      onClick={() =>  {
                        // this.setState({acctId: account.id}); 
                        console.log("NOT SHOWN: Need to setState with click here -> emit event?");
                        // also popup account info alert panel
                        walletAddressInfo(account.id);
                      }} >
                      
                      {account.id}
                    </button></td> 
                  }
                  <td title={ state.acctAddress || "SHOW WALLET ADDRESS ON HOVER: " }>
                    <button 
                      type="btn"
                      onClick={async () => {
                        let returnData = await walletAddressInfo(account.id);
                        console.log(returnData);
                        if(returnData[0]) {

                            let walletAddress = returnData[0].address
                            alert("Address is:" + walletAddress);
                            console.log("Need to setState here to set address & QR");
                            console.log(state);
                            
                            // this.setState((state) => {
                            //     return {acctAddress: walletAddress}     // override state with new addr
                            // })
                        } else {
                            console.log("It's a FIAT account - likely - or no addresses created");
                        }
                        
                      }} >
                        {account.currency}
                    </button>
                  </td>
                  <td>{account.balance.availableBalance}</td>
                  <td>$ { convertToCAD(account.balance.accountBalance,account.currency,state).toFixed(3) }</td>
              </tr>
          )
    }

    const userTable = accounts.map((user,index) => AcctRow(user,index))

    return(
        <div className="container">
            <h2>Accounts</h2>
            <table className="table table-bordered">
                <thead>
                <tr>
                    <th>Account #</th>
                    { !hideId && <th>id</th> }
                    <th>currency</th>
                    <th>token</th>
                    <th>{state.prices.base} balance</th>
                </tr>
                </thead>
                <tbody>
                    {userTable}
                </tbody>
            </table>
        </div>
    )
}