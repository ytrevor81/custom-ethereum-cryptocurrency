import TrevToken from '../abis/TrevToken.json'
import TrevTokenSale from '../abis/TrevTokenSale.json'
import React, { Component } from 'react';
import Web3 from 'web3';
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
        this.setState({ account: accounts[0], balance: balance, web3: web3 })
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
        console.log(tokenWeiPrice, tokenEthPrice);

        console.log(tokenAddress, tokenSaleAddress);
        this.setState({ token: token,
                        tokenSale: tokenSale,
                        tokenAddress: tokenAddress,
                        tokenSaleAddress: tokenSaleAddress,
                        tokenWeiPrice: tokenWeiPrice,
                        tokenEthPrice: tokenEthPrice});
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
        await this.state.tokenSale.methods.buyTokens(numberOfTokens).send({ from: this.state.account, value: numberOfTokens * this.state.tokenPrice, gas: 500000})
      } catch (e) {
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
      tokensAvailable: 750000
    }
  }

  render() {
    return (
      <div className='text-monospace'>
        <div className="container">
          <br/>
          <h1 class="text-center">Trev Token ICO Sale</h1>
          <br/>
          <h6 class="text-center">
            This application is on the Rinkeby test network.
          </h6>
          <hr/><br/>
          <div id="content" class="main-content row">
            <p class="intro-paragraph">Introducing "Trev Token" (TVT)!
            Token price is {this.state.tokenEthPrice} Ether.
            You currently have {this.state.balance} TVT</p>
            <br/><br/>
            <form class="col-lg-12 col-md-12"
                  onSubmit={(e) => {
              e.preventDefault();
              let numberOfTokens = this.numberOfTokens.value;
              this.buyTokens(numberOfTokens);
            }}>
              <div class="form-group">
                <div class="input-group">
                  <input type="number"
                  id="numberOfTokens"
                  name="number"
                  value="1"
                  min="1"
                  pattern="[0-9]"
                  class="form-control input-lg"
                  ref={(input) => { this.numberOfTokens = input }}></input>
                  <span class="input-group-btn left-spacing">
                    <button class="btn btn-primary btn-lg" type="submit">Buy Tokens</button>
                  </span>
                </div>
              </div>
            </form>
            <br/>
            <div class="progress">
              <div id="progress" class="progress-bar progress-bar-striped active" aria-valuemin="0" aria-valuemax="100">

              </div>
            </div>
            <hr/>
            <div class="col-lg-12 col-md-12">
              <p class="text-center">{this.state.tokensSold} / {this.state.tokensAvailable} TVT tokens sold</p>
              <br/>
              <h6 class="text-center">Account: {this.state.account}</h6>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
