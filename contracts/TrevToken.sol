pragma solidity >=0.4.22 <0.9.0;

contract TrevToken {
  string public name = "Trev Token"; //Token name
  string public symbol = "TVT"; //Token symbol
  string public standard = "Trev Token v1.0"; //Token symbol
  uint256 public totalSupply; //Number of tokens available

  event Transfer(
    address indexed _from,
    address indexed _to,
    uint256 _value
  );


  mapping(address => uint256) public balanceOf; //Returns balence of owner via owner address

  constructor(uint256 _initialSupply) public {
    balanceOf[msg.sender] = _initialSupply;
    totalSupply = _initialSupply;
  }

  //Transfer
  function transfer(address _to, uint256 _value) public returns (bool success) {
    require(balanceOf[msg.sender] >= _value);
    balanceOf[msg.sender] -= _value;
    balanceOf[_to] += _value;

    emit Transfer(msg.sender, _to, _value);

    return true;
  }
}
