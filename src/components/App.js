import TrevToken from '../abis/TrevToken.json';
import TrevTokenSale from '../abis/TrevTokenSale.json';
import React, { Component } from 'react';
import Web3 from 'web3';
import ProgressBar from './Progress';
import './App.css';

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
        this.setState({ account: accounts[0], web3: web3 })
      }
      else {
        window.alert('Please login to MetaMask.')
      }

      //load contracts
      try {
        const token = new web3.eth.Contract(TrevToken.abi, TrevToken.networks[netId].address);
        const tokenSale = new web3.eth.Contract(TrevTokenSale.abi, TrevTokenSale.networks[netId].address);
        const tokenAddress = TrevToken.networks[netId].address;
        const tokenSaleAddress = TrevTokenSale.networks[netId].address;
        const tokenWeiPrice = await tokenSale.methods.tokenPrice().call();
        const tokenEthPrice = await web3.utils.fromWei(tokenWeiPrice, "ether");
        const balance = await token.methods.balanceOf(this.state.account).call();
        const tokensSold = await tokenSale.methods.tokensSold().call();

        const progressPercent = tokensSold / 750000 * 100;

        console.log(progressPercent);
        this.setState({ token: token,
                        tokenSale: tokenSale,
                        tokenAddress: tokenAddress,
                        tokenSaleAddress: tokenSaleAddress,
                        tokenWeiPrice: tokenWeiPrice,
                        tokenEthPrice: tokenEthPrice,
                        balance: balance,
                        tokensSold: tokensSold,
                        progressPercent: progressPercent
                        });
      } catch (e) {
        console.log('Error', e);
        window.alert('Contracts not deployed to the current network.');
      }
    }
    else {
      window.alert('This is a blockchain website. Please install the MetaMask browser extension to continue.')
    }

  }

  async buyTokens(numberOfTokens) {
    if(this.state.tokenSale!=='undefined'){
      try {
        console.log(numberOfTokens)
        await this.state.tokenSale.methods.buyTokens(numberOfTokens).send({ from: this.state.account, value: numberOfTokens * this.state.tokenWeiPrice, gas: 500000 });
        await window.location.reload(false);
      } catch (e) {
        {
          window.alert('An error has occured: make sure you have enough Rinkeby funds, refresh the page, and enter a valid number');
        }
        console.log('Error, buying tokens: ', e);
      }
    }
  }

  constructor(props) {
    super(props)
    this.state = {
      web3: 'undefined',
      account: '',
      token: null,
      tokenSale: null,
      tokenAddress: null,
      tokenSaleAddress: null,
      balance: 0,
      tokenWeiPrice: 1000000000000000,
      tokenEthPrice: 0,
      tokensSold: 0,
      tokensAvailable: 750000,
      progressPercent: 0,
    }
  }

  render() {
    return (
      <div className='text-monospace'>
        <div className="container">
          <br/>
          <h1 className="text-center">Trev Token ICO Sale</h1>
          <br/>
          <h6 className="text-center">
            This application is on the Rinkeby test network. Please use an account connected to Rinkeby in order to use this application.
          </h6>
          <hr/><br/>
          <div id="content" className="row">
            <div className="col-lg-12 col-md-12">
              <p className="text-center">Introducing "Trev Token" (TVT)!
              Token price is {this.state.tokenEthPrice} Ether.
              You currently have {this.state.balance} TVT</p>
              <br/>
            </div>
            <form className="col-lg-12 col-md-12"
                  role="form"
                  onSubmit={(e) => {
              e.preventDefault();
              let numberOfTokens = this.numberOfTokens.value;
              this.buyTokens(numberOfTokens);
            }}>
                <div className="form-grid">
                  <div/>
                  <input
                  type="number"
                  id="numberOfTokens"
                  min="1"
                  pattern="[0-9]"
                  placeholder="amount..."
                  ref={(input) => { this.numberOfTokens = input }}></input>
                  <span className="input-group-btn left-spacing">
                    <button className="btn btn-primary btn-lg" type="submit">Buy Tokens</button>
                  </span>
                </div>
            </form>
            <div className="spaced col-lg-12 col-md-12 text-center">
              <ProgressBar value={this.state.progressPercent} max={100} width={'50%'} height={'25px'}/>
            </div>
            <div className="col-lg-12 col-md-12">
              <p className="text-center">{this.state.tokensSold} / {this.state.tokensAvailable} TVT tokens sold</p>
              <hr/><br/>
              <h6 className="text-center">Account: {this.state.account}</h6>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
