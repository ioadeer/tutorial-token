//pragma solidity >= 0.4.24 <= 0.7.0;
pragma solidity ^0.6.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

//https://docs.openzeppelin.com/contracts/3.x/erc20

contract TutorialToken is ERC20, AccessControl {
//  uint INITIAL_SUPPLY = 12000;

 bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
 bytes32 public constant BURNER_ROLE = keccak256("BURNER_ROLE");

  constructor() public ERC20("MyToken", "TKN") {
      // Grant the minter role to a specified account
      _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
  }

  function mint(address to, uint256 amount) public {
    // Check that the calling account has the minter role
    require(hasRole(MINTER_ROLE, msg.sender), "Caller is not a minter");
    _mint(to, amount);
  }
    
  function burn(address from, uint256 amount) public {
    require(hasRole(BURNER_ROLE, msg.sender), "Caller is not a burner");
    _burn(from, amount);
  }

}
