const TrevToken = artifacts.require("./TrevToken.sol")

contract('TrevToken', function(accounts){
  var tokenInstance;

  it('initializes the contract with the correct values', function() {
    return TrevToken.deployed().then(function(instance) {
      tokenInstance = instance;
      return tokenInstance.name();
    }).then(function(name) {
      assert.equal(name, 'Trev Token', 'has the correct name');
      return tokenInstance.symbol();
    }).then(function(symbol){
      assert.equal(symbol, 'TVT', 'has the correct symbol');
      return tokenInstance.standard();
    }).then(function(standard) {
      assert.equal(standard, "Trev Token v1.0", "has correct standard");
    });
  })


  it('sets the total supply upon deployment', function(){
    return TrevToken.deployed().then(function(instance) {
      tokenInstance = instance;
      return tokenInstance.totalSupply();
    }).then(function(totalSupply) {
      assert.equal(totalSupply.toNumber(), 1000000, 'allocates the initial supply to 1,000,000');
      return tokenInstance.balanceOf(accounts[0]);
    }).then(function(adminBalance){
      assert.equal(adminBalance.toNumber(), 1000000, 'it allocates the initial supply to the admin account');
    });
  });


  it('transfers token ownership', function(){
    return TrevToken.deployed().then(function(instance) {
      tokenInstance = instance;
      return tokenInstance.transfer.call(accounts[1], 250000, { from: accounts[0] });
    }).then(function(success) {
      assert.equal(success, true, 'it returns true');
      return tokenInstance.transfer(accounts[1], 250000, { from: accounts[0] });
    }).then(function(receipt) {
      assert.equal(receipt.logs.length, 1, 'triggers one event');
      assert.equal(receipt.logs[0].event, 'Transfer', 'should be the Transfer event');
      assert.equal(receipt.logs[0].args._from, accounts[0], 'logs the account the tokens are transferred from');
      assert.equal(receipt.logs[0].args._to, accounts[1], 'logs the account the tokens are transferred to');
      assert.equal(receipt.logs[0].args._value, 250000, 'logs the transfer amount');
      return tokenInstance.balanceOf(accounts[1]);
    }).then(function(balance) {
      assert.equal(balance.toNumber(), 250000, 'adds the amount to the receiving account');
      return tokenInstance.balanceOf(accounts[0]);
    }).then(function(balance) {
      assert.equal(balance.toNumber(), 750000, 'deducts the amount from the sending account');
    });
  });


});
