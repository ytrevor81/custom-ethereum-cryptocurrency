const TrevToken = artifacts.require("./TrevToken.sol");

module.exports = function (deployer) {
  deployer.deploy(TrevToken, 1000000);
};
