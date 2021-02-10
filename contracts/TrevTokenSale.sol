pragma solidity >=0.4.22 <0.9.0;

import "./TrevToken.sol";

contract TrevTokenSale {
  address admin;
  TrevToken public tokenContract;
  uint256 public tokenPrice;

  constructor(TrevToken _tokenContract, uint256 _tokenPrice) public {
    admin = msg.sender;
    tokenContract = _tokenContract;
    tokenPrice = _tokenPrice;
  }
}
