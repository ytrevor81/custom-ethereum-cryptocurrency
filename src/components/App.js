import { Tabs, Tab } from 'react-bootstrap'
import dBank from '../abis/dBank.json'
import React, { Component } from 'react';
import Token from '../abis/Token.json'
import Web3 from 'web3';
import './App.css';

//h0m3w0rk - add new tab to check accrued interest

class App extends Component {

  async componentWillMount() {
    await this.loadBlockchainData(this.props.dispatch)
  }

  async loadBlockchainData(dispatch) {
    if(typeof window.ethereum!=='undefined'){
      const web3 = new Web3(window.ethereum);
      const netId = await web3.eth.net.getId();
      const accounts = await web3.eth.getAccounts();

      if(typeof accounts[0]!=='undefined'){
        const balance = await web3.eth.getBalance(accounts[0]);
        this.setState({ account: accounts[0], balance: balance, web3: web3 })
      }
      else {
        window.alert('Please login to MetaMask.')
      }

      //load contracts
      try {
        const token = new web3.eth.Contract(Token.abi, Token.networks[netId].address);
        const dbank = new web3.eth.Contract(dBank.abi, dBank.networks[netId].address);
        const dBankAddress = dBank.networks[netId].address;
        this.setState({ token: token, dbank: dbank, dBankAddress: dBankAddress });
      } catch (e) {
        console.log('Error', e);
        window.alert('Contracts not deployed to the current network.');
      }

    }
    else {
      window.alert('This is a blockchain website. Please install the MetaMask browser extension to continue.')
    }

  }

  async deposit(amount) {
    if(this.state.dbank!=='undefined'){
      try {
        await this.state.dbank.methods.deposit().send({ value: amount.toString(), from: this.state.account })
      } catch (e) {
        console.log('Error, deposit: ', e);
      }
    }
  }

  async withdraw(e) {
    e.preventDefault();
    if(this.state.dbank!=='undefined'){
      try {
        await this.state.dbank.methods.withdraw().send({ from: this.state.account })
      } catch (e) {
        console.log('Error, withdraw: ', e);
      }
    }
  }

  constructor(props) {
    super(props)
    this.state = {
      web3: 'undefined',
      account: '',
      token: null,
      dbank: null,
      balance: 0,
      dBankAddress: null
    }
  }

  render() {
    return (
      <div className='text-monospace'>
        <div className="container-fluid mt-5 text-center">
        <br></br>
          <h1>Welcome to Trev's DeFi Bank</h1>
          <h3>Account: {this.state.account}</h3>
          <br></br>
          <h6>
            This application is on the Rinkeby test network. To use this application: click "Deposit" and enter the amount of ETH you'd like to deposit into this bank. Then click "Withdraw" to withdraw your ETH from this bank + interest given to you in Trev Bank Currency (TBC). Make sure to have a Rinkeby account connected to MetaMask in order to use this application.
          </h6>
          <br></br>
          <div className="row">
            <main role="main" className="col-lg-12 d-flex text-center">
              <div className="content mr-auto ml-auto">
              <Tabs defaultActiveKey="profile" id="uncontrolled-tab-example">
                <Tab eventKey="deposit" title="Deposit">
                  <div>
                    <br/>
                    How much do you want to deposit?
                    <br/>
                    (min. amount is 0.01 ETH)
                    <br/>
                    (1 despoit is possible at a time)
                    <br/>
                    <form onSubmit={(e) => {
                      e.preventDefault();
                      let amount = this.depositAmount.value;
                      amount = amount * 10**18; //convert to Wei
                      this.deposit(amount);
                    }}>
                      <div className='form-group mr-sm-2'>
                        <br/>
                          <input id="depositAmount"
                                 step="0.01"
                                 className="form-control form-control-md"
                                 placeholder="amount..."
                                 type="number"
                                 ref={(input) => { this.depositAmount = input }}/>
                      </div>
                      <button type="submit" className="btn btn-primary">DEPOSIT</button>
                    </form>
                  </div>
                </Tab>
                <Tab eventKey="withdraw" title="Withdraw">
                  <div>
                    <br/>
                    Do you want to withdraw + take interest?
                    <br/>
                    <br/>
                    <div>
                      <button type="submit" className="btn btn-primary" onClick={(e) => this.withdraw(e)}>WITHDRAW</button>
                    </div>
                  </div>
                </Tab>
              </Tabs>
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
