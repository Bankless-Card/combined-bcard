import React from 'react'

import {convertToCAD} from '../utils/convertToCAD'
// import {walletAddressInfo} from '../services/UserService'

export const Transactions = ({state, hideId}) => {

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
                        // walletAddressInfo(account.id);
                      }} >
                      
                      {account.id}
                    </button></td> 
                  }
                  <td title={ state.acctAddress || "SHOW WALLET ADDRESS ON HOVER: " }>
                    <button 
                      type="btn"
                      onClick={async () => {} } >
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
            <p>Select Wallet to Display Transactions</p>
            <h5>TBD: List of ETH transactions (public chain)</h5>
            <h5>TBD: List of ETH internal transactions (tatum)</h5>
            <h2>Transactions</h2>
            <table className="table table-bordered">
                <thead>
                <tr>
                    <th>Account #</th>
                    <th>id</th>
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