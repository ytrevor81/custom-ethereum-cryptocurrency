const TrevTokenSale = artifacts.require("./TrevTokenSale.sol")

contract('TrevTokenSale', function(accounts){
  var tokenSaleInstance;
  var tokenPrice = 1000000000000000; //wei 

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

});
