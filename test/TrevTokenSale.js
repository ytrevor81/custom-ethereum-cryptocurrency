const TrevToken = artifacts.require("./TrevToken.sol")
const TrevTokenSale = artifacts.require("./TrevTokenSale.sol")

contract('TrevTokenSale', function(accounts){
  var tokenSaleInstance;
  var tokenPrice = 1000000000000000; //wei
  var admin = accounts[0];
  var buyer = accounts[1];
  var tokenInstance;
  var tokensAvailable = 750000;
  var numberOfTokens;

  it('initializes contract with correct values', function() {
    return TrevTokenSale.deployed().then(function(instance) {
    tokenSaleInstance = instance;
    return tokenSaleInstance.address
  }).then(function(address) {
    assert.notEqual(address, 0x0, 'has contract address');
    return tokenSaleInstance.tokenContract();
  }).then(function(address) {
    assert.notEqual(address, 0x0, 'has token contract');
    return tokenSaleInstance.tokenPrice();
  }).then(function(price) {
    assert.equal(price, tokenPrice, 'token price is correct');
  });
});

  it ('facilitates token buying', function() {
    return TrevToken.deployed().then(function(instance) {
      tokenInstance = instance;
      return TrevTokenSale.deployed();
    }).then(function(instance){
      tokenSaleInstance = instance;
      return tokenInstance.transfer(tokenSaleInstance.address, tokensAvailable, { from: admin });
    }).then(function(receipt) {
      numberOfTokens = 10;
      return tokenSaleInstance.buyTokens(numberOfTokens, { from: buyer, value: numberOfTokens * tokenPrice });
    }).then(function(receipt) {
      assert.equal(receipt.logs.length, 1, 'triggers one event');
      assert.equal(receipt.logs[0].event, 'Sell', 'should be the Sell event');
      assert.equal(receipt.logs[0].args._buyer, buyer, 'logs the account that purchased the tokens');
      assert.equal(receipt.logs[0].args._amount, numberOfTokens, 'logs the number of tokens purchased');
      return tokenSaleInstance.tokensSold();
    }).then(function(amount) {
      assert.equal(amount.toNumber(), numberOfTokens, 'increments number of tokens sold');
      return tokenInstance.balanceOf(buyer);
    }).then(function(balance) {
      assert.equal(balance.toNumber(), numberOfTokens);
      return tokenInstance.balanceOf(tokenSaleInstance.address);
    }).then(function(balance) {
      assert.equal(balance.toNumber(), tokensAvailable - numberOfTokens);
      return tokenSaleInstance.buyTokens(numberOfTokens, { from: buyer, value: 1 });
    }).then(assert.fail).catch(function(error) {
      assert(error.message.indexOf('revert') >= 0, 'msg.value must equal amount of wei');
      return tokenSaleInstance.buyTokens(800000, { from: buyer, value: 1 });
    }).then(assert.fail).catch(function(error) {
      assert(error.message.indexOf('revert') >= 0, 'cannot purchase more tokens than wei');
  });
  });

  it('ends token sale', function() {
    return TrevToken.deployed().then(function(instance) {
      tokenInstance = instance;
      return TrevTokenSale.deployed();
    }).then(function(instance) {
        tokenSaleInstance = instance;
        return tokenSaleInstance.endSale({ from: buyer });
    }).then(assert.fail).catch(function(error) {
      assert(error.message.indexOf('revert' >= 0, 'must be admin to end sale'));
      return tokenSaleInstance.endSale({ from: admin });
    }).then(function(receipt) {
      return tokenInstance.balanceOf(admin);
    }).then(function(balance) {
      assert.equal(balance.toNumber(), 999990, 'returns all unsold trev tokens to admin');
      return tokenSaleInstance.tokenPrice();
    }).then(function(price) {
      assert.equal(price.toNumber(), 0, 'price was reset');
    });
  });
});
