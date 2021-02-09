const TrevToken = artifacts.require("./TrevToken.sol")

contract('TrevToken', function(accounts){
  it('sets the total supply upon deployment', function(){
    return TrevToken.deployed().then(function(instance) {
      totalInstance = instance;
      return totalInstance.totalSupply();
    }).then(function(totalSupply) {
      assert.equal(totalSupply.toNumber(), 1000000, 'sets the total supply to 1,000,000');
    });
  });
})
