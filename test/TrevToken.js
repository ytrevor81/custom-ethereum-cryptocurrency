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

it('approves token for delegated transfer', function(){
  return TrevToken.deployed().then(function(instance) {
    tokenInstance = instance;
    return tokenInstance.approve.call(accounts[1], 100);
  }).then(function(success) {
    assert.equal(success, true, 'equals true');
    return tokenInstance.approve(accounts[1], 100, { from: accounts[0] });
  }).then(function(receipt) {
    assert.equal(receipt.logs.length, 1, 'triggers one event');
    assert.equal(receipt.logs[0].event, 'Approval', 'should be the Approve event');
    assert.equal(receipt.logs[0].args._owner, accounts[0], 'logs the account the tokens are authorized by');
    assert.equal(receipt.logs[0].args._spender, accounts[1], 'logs the account the tokens are authorized to');
    assert.equal(receipt.logs[0].args._value, 100, 'logs the transfer amount');
    return tokenInstance.allowance(accounts[0], accounts[1]);
  }).then(function(allowance) {
    assert.equal(allowance, 100, 'stores allowance for delegated transfer');
  });
});

  it('handles delegated transfer', function() {
    return TrevToken.deployed().then(function(instance) {
      tokenInstance = instance;
      fromAccount= accounts[2];
      toAccount = accounts[3];
      spendingAccount = accounts[3];
      return tokenInstance.transfer(fromAccount, 100, { from: accounts[0] });
    }).then(function(receipt) {
      return tokenInstance.approve(spendingAccount, 10, {from: fromAccount });
    }).then(function(receipt) {
      return tokenInstance.transferFrom(fromAccount, toAccount, 999, { from: spendingAccount });
    }).then(assert.fail).catch(function(error) {
      assert(error.message.indexOf('revert') >= 0, 'cannot transfer value larger than balance');
      return tokenInstance.transferFrom(fromAccount, toAccount, 20, { from: spendingAccount });
    }).then(assert.fail).catch(function(error) {
      assert(error.message.indexOf('revert') >= 0, 'cannot transfer value larger than approved amount');
      return tokenInstance.transferFrom.call(fromAccount, toAccount, 10, { from: spendingAccount });
    }).then(function(success) {
      assert.equal(success, true, 'successful approved transfer');
      return tokenInstance.transferFrom(fromAccount, toAccount, 10, { from: spendingAccount });
    }).then(function(receipt) {
      assert.equal(receipt.logs.length, 1, 'triggers one event');
      assert.equal(receipt.logs[0].event, 'Transfer', 'should be the transfer event');
      assert.equal(receipt.logs[0].args._from, fromAccount, 'logs the account the tokens are transferred from');
      assert.equal(receipt.logs[0].args._to, toAccount, 'logs the account the tokens are transferred to');
      assert.equal(receipt.logs[0].args._value, 10, 'logs the transfer amount');
      return tokenInstance.balanceOf(fromAccount);
    }).then(function(balance) {
      assert.equal(balance.toNumber(), 90, 'deducts the amount from the sending account');
      return tokenInstance.balanceOf(toAccount);
    }).then(function(balance) {
      assert.equal(balance.toNumber(), 10, 'adds the amount to receiving account');
      return tokenInstance.allowance(fromAccount, spendingAccount);
    }).then(function(allowance) {
      assert.equal(allowance, 0, 'deducts amount from the allowance');
    });
  });












});
