App = {
  web3Provider: null,
  contracts: {},

  init: function() {
    console.log("App initialized")
    return App.initweb3();
  },

  initweb3: function() {
    if(typeof web3 !== 'undefined'){
      App.web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider);
    } else {
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:8545');
      web3 = new Web3(App.web3Provider);
    }
    return App.initContracts();
  },

  initContracts: function() {
    $.getJSON("TrevTokenSale.json", function(trevTokenSale) {
      App.contracts.TrevTokenSale = TruffleContract(trevTokenSale);
      App.contracts.TrevTokenSale.setProvider(App.web3Provider);
      App.contracts.TrevTokenSale.deployed().then(function(trevTokenSale) {
        console.log("Trev Token Sale Address: ", trevTokenSale.address);
      });
    })
  }
}

$(function() {
  $(window).load(function() {
    App.init();
  });
});
