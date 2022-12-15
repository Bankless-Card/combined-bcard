import React, {useRef} from 'react'
import { Accounts } from './Accounts'
import { Transactions } from './Transactions'

import {adminWhitelist} from '../utils/adminWhitelist'


let spacing = 5;

function niceFiatFromString(priceString, digits) {
    if(digits) return "$" + parseFloat(priceString).toFixed(digits);
    return "$" + parseFloat(priceString).toFixed(3);        // 3 default
}

function PriceBar(props) {
  // console.log(props.state);
  // console.log(props.state.prices)

  // Confirm CAD as price base or adjust
  if(props.state.baseCurrency === "CAD" || props.state.baseCurrency === "USD"){             //props.state.prices.base === "CAD"
    return (
      <>
        {/*<h4>{props.state.prices.eth} {props.state.prices.btc} {props.state.prices.usd} {props.state.prices.chf}</h4>*/}
        <div className="container text-center priceBoxes">
            <div className="row">
                <div className="col top">
                    <h4>currencyBase = {props.state.prices.base}</h4>
                </div>
            </div>
          <div className="row">
            <div className="col order-1">
              ETH<br />
              { niceFiatFromString(props.state.prices.eth) }
            </div>
            <div className="col order-2">
              BTC<br />
              { niceFiatFromString(props.state.prices.btc) }
            </div>
            <div className="col order-3">
              BANK<br />
              { niceFiatFromString(props.state.prices.bank, 4) }
            </div>
            <div className="col order-4">
              USD<br />
              { niceFiatFromString(props.state.prices.usd) }
            </div>
            <div className="col order-5">
              CHF<br />
              { niceFiatFromString(props.state.prices.chf) }
            </div>
          </div>
        </div>
      </>
    )
  } else {
    return (
      <h4>Login & Complete onboarding to <button type="button" onClick={ (e) => props.getPrices() } >Get Prices</button></h4>)
  }

  
}

function UserLogo(props) {

    // should return a profile logo based on input graphic
    // css style for circle crop as per figma

    // console.log(props.custId);      // use custId to get stored profile picture

    let userPanel = document.getElementById('userPanel');


    return (
        <div className="profileContainer" onClick={() => {
            console.log("User Panel Toggle");
            userPanel.classList.toggle('active');
        }}>
            <img className='userLogo' src='img/profile-pic.png' alt='' />
        </div>
        )
}

function AlertButton(props) {

    // should return a profile logo based on input graphic
    // css style for circle crop as per figma

    return (
        <div className="alertContainer">
            <img className='alertLogo' src='img/alert.png' alt='' />
        </div>
        )
}


function MakeButton(props) {
    return (
        <div className="buttonContainer">
            <button className="btn btn-lg btn-danger bigBtn buttonGradient" onClick={props.clickAction}>
                <img src={props.img} alt={props.alt} />
                &nbsp;
                {props.label}
            </button>
        </div>
        )
}

function MyTools(props) {

    return (
        <div id="myTokensContainer" className="container">
            <div id="myTokensBacker">
                <h4>My tools</h4>
                <select className="toolSelect" defaultValue="Bankless DAO">
                    <option>Bankless DAO</option>
                    <option>The DAO DAO</option>
                </select>

                <h4>Go to academy</h4>
            </div>
        </div>
    )
}

export const DisplayBoard = ({ state, getAllUsers, getPrices, getAccount, getMaster, getBalance, getCustomers, createTrade, showTrades, newBTCMaster, newBTCAccount, newWalletAddress, getEthAddress, walletAddressInfo, newWalletKey, newUSDWallet, newETHWallet, onboardExecute, newXpubAccount}) => {

        const ref = useRef(null);

        // console.log(adminWhitelist);

        // state for component - testing
        // state = {}

        // setState({ signedIn: true });

        // console.log(this.state);

        // determine if user already has a VISA account



        // determine if user already has a BANK token account




        let qrImg = "No Wallet Selected - Click Account to display QR.";
        let sepoliaTestnet = "Need Sepolia ETH? Fund Your Address Here:";
        if(state.acctAddress){
            qrImg = "https://api.qrserver.com/v1/create-qr-code/?data=" + state.acctAddress + "&amp;size=150x150";
        }

        let thisBalance = state.balance.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
        let halfBalance = ((state.balance/2).toFixed(2)).replace(/\d(?=(\d{3})+\.)/g, '$&,')

    return(
        <div>
            <PriceBar state={state} getPrices={getPrices} />
            <div className="display-board">
                <div>
                    <h6>
                        <AlertButton />
                        {state.custId ?
                            <UserLogo custId={state.custId} />
                            :  "[not set]"
                        }
                    </h6>
                    <h5 className="balanceLabel">
                        Total Balance&nbsp;
                        <img src="img/eye-balance.png" alt="Show Balance" />
                    </h5>

                    <div className="number">
                        ${state.balance ? thisBalance : "[...loading...]"} <small>{state.prices.base}</small>
                    </div>
                    <div className="row">
                        <h3 className="text-center">
                            <small className="muted avTitle">Assets Value ($)</small> 
                            <span className="hl"> |</span> ${ halfBalance }
                        </h3>
                    </div>
                    <div className="buttonRow d-flex justify-content-between">
                        {/* <div className="col"> */}
                            <MakeButton 
                                label="Receive" 
                                img="img/receive-arrow.png" 
                                alt="Receive Button" 
                                clickAction={() => console.log("Receive Button Press")}
                        />
                        {/* </div>
                        <div className="col"> */}
                            <MakeButton 
                                label="Send" 
                                img="img/send-arrow.png" 
                                alt="Send Button" 
                                clickAction={() => console.log("Send Button Press")}
                            />
                        {/* </div> */}
                    </div>
                    {/* <!-- Accounts list conditinally loaded here --> **/}
                    <div className="row">
                      <Accounts state={state} hideId={true} walletAddressInfo={walletAddressInfo} />
                    </div>

                    <div className="row">
                      <MyTools state={state} hideId={true} walletAddressInfo={walletAddressInfo} />
                    </div>

                    {state.acctAddress ?
                        <div className="row">
                            <div className="qrContainer">
                                <h3>Selected Wallet QR</h3>
                                <img src={qrImg} alt={"Wallet Address QR for " + state.acctAddress} title={state.acctAddress} />
                                <p><strong>Public Address:</strong><br />{state.acctAddress}</p>
                            </div>
                        </div> :
                        <div className="row">
                            {qrImg}
                            <a href="https://faucet.sepolia.dev/" rel="noopener noreferrer" target="_blank">{sepoliaTestnet}</a>
                        </div> 
                    }

                    {/* <!-- Transactions list conditinally loaded here --> **/}
                    <div className="row">
                        {state.acctAddress ?
                            <Transactions state={state} hideId={true} walletAddressInfo={walletAddressInfo} /> :
                            <p>- Select Account to view transactions</p>
                        }
                    </div>

                    <hr />
                    <fieldset>
                        {state.custId &&
                        <div>
                            <h4> Open Book has {state.buyOrders.length + state.sellOrders.length} (buy+sell) active trades. </h4>
                            <p>
                                <button 
                                    type="button" 
                                    onClick={(e) => getPrices()} 
                                    className="btn btn-warning"
                                    title="Refresh internal token prices manually"
                                    >   
                                        Refresh Prices
                                </button>
                                <button 
                                    type="button" 
                                    style={{marginLeft: spacing + "px"}} 
                                    onClick={(e) => showTrades()} 
                                    className="btn btn-warning">
                                        Refresh Trades
                                </button>
                                <button 
                                    type="button" 
                                    style={{marginLeft: spacing + "px"}} 
                                    onClick={ (e) => getMaster(state.custId) } 
                                    className="btn btn-warning">
                                        Refresh Accounts
                                </button>
                                 {/*<button 
                                    type="button" 
                                    style={{marginLeft: spacing + "px"}} 
                                    onClick={(e) => createTrade("BUY", "VC_CHF", "3.75", "1.325")} 
                                    className="btn btn-warning">
                                        Create Sample Trade: BUY (VC_CHF, 3.75, 1.325)
                                </button>
                                 <button 
                                    type="button" 
                                    style={{marginLeft: spacing + "px"}} 
                                    onClick={(e) => createTrade("SELL", "VC_USD", "11.25", "1.325")} 
                                    className="btn btn-warning">
                                        Create Sample Trade: SELL (VC_USD, 11.25, 1.325)
                                </button>*/}

                            </p>
                        </div>
                      }
                

                    </fieldset>
                </div>

                <hr />

                <div className="btn-container">
                    
                    <h4>TATUM System Controls - for {state.user.email}</h4>

                    {/* user is logged in BUT not assigned a custID - ONBOARDING */}
                    {!state.custId && state.user && 
                        <>
                            <button 
                                type="button" 
                                onClick={() => onboardExecute()} 
                                style={{marginLeft: spacing + "px", marginBottom:"10px"}} 
                                className="btn btn-primary"
                                title="Setup new user with USD wallet and ETH wallet & address for input"
                                >   
                                    Onboard New User (create FIAT, ETH wallets)
                            </button>

                            {/*<button 
                                type="button" 
                                onClick={() => console.log("IMPORT USING MNEMONIC")} 
                                style={{marginLeft: spacing + "px", marginBottom:"10px"}} 
                                className="btn btn-warning"
                                title="Import your own Non-Custodial Wallet"
                                >   
                                    Import Wallet (NC)
                            </button>*/}
                        </>
                    }

                {state.custId && <>

                    {!state.hasVISA &&

                            <button 
                                type="button"
                                style={{marginLeft: spacing + "px"}}
                                className="btn btn-secondary"
                                onClick={(e) => newETHWallet('usdc')} 
                                >
                                    New VISA (USDC Wallet)
                            </button>  

                    }
                    {!state.hasDAO &&

                            <button 
                                type="button"
                                style={{marginLeft: spacing + "px"}}
                                className="btn btn-secondary"
                                onClick={(e) => newETHWallet('BANK')} 
                                >
                                    Add BANK (ETH Wallet)
                            </button> 
                    }

                    </>
                }
                    
                    <hr />
                    
                    
                    
                
                    <hr />
                    {/* AUTH REQUIRED - For SERVICE ACCOUNTS ONLY */}
                    {/* AUTH with whitelist for admins using email or custId */}

                    { ( adminWhitelist.includes(state.user.email) || adminWhitelist.includes(state.custId) ) &&
                        <>
                        <h3>ADMIN ONLY</h3>
                        <h5>Manual Triggers</h5>
                        <button 
                        type="button" 
                        style={{marginLeft: spacing + "px"}} 
                        onClick={(e) => getCustomers()} 
                        className="btn btn-warning"
                        title="Refresh the list of all customers below - click to select">
                            Refresh Customers
                        </button>
                        <button 
                            type="button" 
                            style={{marginLeft: spacing + "px"}} 
                            onClick={ (e) => getAccount(state.custId) } 
                            className="btn btn-warning">
                                Refresh Account List ({state.custId || "BCARD_ONE"})
                        </button> {state.custId ? "Selected" : "UPGRADE_ADMIN"}
                        <div>
                            <h4>BCARD Internal - TBD</h4>
                            <button type="button" onClick={(e) => getAllUsers()} className="btn btn-warning">Get all Users</button>
                            <hr />
                            <h4>Custodial Wallets - in order</h4>
                            {state.account_list.length === 0 &&
                                <div>
                                    <button 
                                        type="button"
                                        style={{marginLeft: spacing + "px"}}
                                        className="btn btn-secondary"
                                        onClick={(e) => newUSDWallet()} 
                                        >
                                            Create New (VC_USD Wallet)
                                    </button>  - for {state.user.email} (if accounts=0)
                                </div>
                            }

                            {state.account_list.length > 1 &&
                                <div>
                                    <button 
                                        type="button"
                                        style={{marginLeft: spacing + "px"}}
                                        className="btn btn-secondary"
                                        onClick={(e) => newETHWallet()} 
                                        >
                                            Create New (ETH Wallet)
                                    </button>  - for {state.user.email} (if accounts=1+)
                                </div>
                            }

                            <hr />
                            <h4>Tests</h4>
                            <button 
                                type="button"
                                style={{marginLeft: spacing + "px"}}
                                className="btn btn-secondary"
                                onClick={(e) => newBTCMaster()} 
                                >
                                    Create New (BTC Master) - xpub, mnemonic
                            </button>
                            <button 
                                type="button"
                                style={{marginLeft: spacing + "px"}}
                                className="btn btn-primary"
                                onClick={(e) => newBTCAccount("BTC", "BCARD_FEES", "xpub")} 
                                >
                                    Create New (Account: "BTC", "BCARD_FEES", "xpub") - accountId
                            </button>
                            
                            <button 
                                type="button"
                                style={{marginLeft: spacing + "px"}}
                                className="btn btn-primary"
                                onClick={(e) => newWalletKey(0, ref.current.value)}
                                >
                                    Create New (PrivateKey: 0, "mnemonic -")
                            </button>
                            <textarea ref={ref} id="message" name="message" />
                            <hr />
                            <button 
                                type="button"
                                style={{marginLeft: spacing + "px"}}
                                className="btn btn-primary"
                                onClick={(e) => walletAddressInfo(state.acctId)} 
                                >
                                    Get Info (Wallet: {state.acctId || "not selected"})
                            </button>

                            <button 
                                type="button"
                                style={{marginLeft: spacing + "px"}}
                                className="btn btn-primary"
                                onClick={(e) => newXpubAccount("ETH", state.user.uid, "xpub6DbQz3y2wQHZkkw85c1JxJJeBVNqH2SpuApM5i2Ta1jeFGEebeNLJAMDEJD1uYKEaCF9JgTNPFDanJe3bccNsi4Vf99ngjLY5AVUfVtEYw2")} 
                                >
                                    Backend2(HC) - 
                            </button>
                            Create New (Account: "ETH", "USER.UID", "xpub") - accountId
                            <button 
                                type="button"
                                style={{marginLeft: spacing + "px"}}
                                className="btn btn-primary"
                                onClick={(e) => getEthAddress(state.acctId, 0)} 
                                >
                                    Create New (ETH Address: {state.acctId || "[click on acct]"} Index:[0])
                            </button>

                            
                        </div>
                        {/*<button 
                            type="button" 
                            style={{marginLeft: spacing + "px"}} 
                            onClick={ (e) => getBalance() } 
                            className="btn btn-warning">
                                Update Cust. Balance ({state.custId})
                        </button>*/}
                        </>
                    }
                    
                </div>
            </div>
        </div>
    )
}