pragma solidity >=0.4.22 <0.9.0;

contract TrevToken {
  uint256 public totalSupply; //Number of tokens available

  constructor() public {
    totalSupply = 1000000;
  }
}
