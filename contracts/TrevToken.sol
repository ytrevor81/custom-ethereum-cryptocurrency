pragma solidity >=0.4.22 <0.9.0;

contract TrevToken {
  string public name = "Trev Token"; //Token name
  string public symbol = "TVT"; //Token symbol
  string public standard = "Trev Token v1.0"; //Token symbol
  uint256 public totalSupply; //Number of tokens available

  event Transfer (
    address indexed _from,
    address indexed _to,
    uint256 _value
  );

  event Approval (
    address indexed _owner,
    address indexed _spender,
    uint256 _value
  );

  mapping(address => uint256) public balanceOf; //Returns balence of owner via owner address
  mapping(address => mapping(address => uint256)) public allowance;

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

  //Delegated transfer
  function approve(address _spender, uint256 _value) public returns (bool success) {
    allowance[msg.sender][_spender] = _value;

    emit Approval(msg.sender, _spender, _value);

    return true;
  }

  function transferFrom(address _from, address _to, uint256 _value) public returns (bool success) {
    require(_value <= balanceOf[_from]);
    require(_value <= allowance[_from][msg.sender]);

    //Change account balances of sender and receiver
    balanceOf[_from] -= _value;
    balanceOf[_to] += _value;

    //Update allowance
    allowance[_from][msg.sender] -= _value;

    emit Transfer(_from, _to, _value);

    return true;
  }
}
