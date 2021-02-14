App = {
  web3Provider: null,
  contracts: {},
  account: '0x0',
  loading: false,
  tokenPrice: 1000000000000000,
  tokensSold: 0,
  tokensAvailable: 750000,

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
    }).done(function() {
      $.getJSON("TrevToken.json", function(trevToken) {
        App.contracts.TrevToken = TruffleContract(trevToken);
        App.contracts.TrevToken.setProvider(App.web3Provider);
        App.contracts.TrevToken.deployed().then(function(trevToken) {
          console.log("Trev Token Address: ", trevToken.address);
        });
        return App.render();
      });
    })
  },

  render: function() {
    if(App.loading){
      return;
    }
    App.loading = true;

    var loader = $('#loader');
    var content = $('#content');

    loader.show();
    content.hide();

    //Load account data
    web3.eth.getCoinbase(function(err, account) {
      if(err === null) {
        App.account = account;
        $('#accountAddress').html("Your Account: " + account);
      }
    });

    //Load token sale contract
    App.contracts.TrevTokenSale.deployed().then(function(instance) {
      trevTokenSaleInstance = instance;
      return trevTokenSaleInstance.tokenPrice();
    }).then(function(tokenPrice) {
      App.tokenPrice = tokenPrice;
      $('.token-price').html(web3.fromWei(App.tokenPrice, "ether").toNumber());
      return trevTokenSaleInstance.tokensSold();
    }).then(function(tokensSold) {
      App.tokensSold = tokensSold.toNumber();
      $('.tokens-sold').html(App.tokensSold);
      $('.tokens-available').html(App.tokensAvailable);

      var progressPercent = (App.tokensSold / App.tokensAvailable) * 100;
      $('#progress').css('width', progressPercent + '%');

      //Load token contract
      App.contracts.TrevToken.deployed().then(function(instance) {
        trevTokenInstance = instance;
        return trevTokenInstance.balanceOf(App.account);
      }).then(function(balance) {
        $('.tvt-balance').html(balance.toNumber());

        App.loading = false;
        loader.hide();
        content.show();
      });
    });
  },

  buyTokens: function() {
    $('#content').hide();
    $('#loader').show();
    var numberOfTokens = $('#numberOfTokens').val();
    App.contracts.TrevTokenSale.deployed().then(function(instance) {
      return instance.buyTokens(numberOfTokens, {
        from: App.account,
        value: numberOfTokens * App.tokenPrice,
        gas: 500000
      });
    }).then(function(result) {
      console.log("Tokens bought...");
      $('form').trigger('reset');
      $('#loader').hide();
      $('#content').show();
    });
  }
}

$(function() {
  $(window).load(function() {
    App.init();
  });
});
