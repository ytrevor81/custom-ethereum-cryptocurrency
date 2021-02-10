const TrevToken = artifacts.require("./TrevToken.sol");
const TrevTokenSale = artifacts.require("./TrevTokenSale.sol");

module.exports = function (deployer) {
  deployer.deploy(TrevToken, 1000000).then(function() {
    var tokenPrice = 1000000000000000; //wei
    return deployer.deploy(TrevTokenSale, TrevToken.address, tokenPrice);
  });
};
