// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.11;

import "./hip-206/HederaTokenService.sol";
import "./hip-206/HederaResponseCodes.sol";

interface IERC20 {
    function totalSupply() external view returns (uint256);

    function balanceOf(address account) external view returns (uint256);

    function transfer(address recipient, uint256 amount)
        external
        returns (bool);
}

contract Treasury is HederaTokenService {
    event Authorised(address indexed addr);
    event Unauthorised(address indexed addr);
    event Erc20Recover(
        IERC20 indexed token,
        address indexed to,
        uint256 indexed amount
    );

    mapping(address => bool) public authorised;

    modifier onlyAuth() {
        require(authorised[msg.sender], "UNAUTHORISED");
        _;
    }

    constructor() {
        authorised[msg.sender] = true;
    }

    function authorise(address addr) external onlyAuth {
        require(!authorised[addr], "UNAUTHORISED");
        authorised[addr] = true;
        emit Authorised(addr);
    }

    function unauthorise(address addr) external onlyAuth {
        require(authorised[addr], "AUTHORISED");
        authorised[addr] = false;
        emit Unauthorised(addr);
    }

    function erc20Recover(
        IERC20 token,
        address to,
        uint256 amount
    ) external onlyAuth {
        token.transfer(to, amount);
        emit Erc20Recover(token, to, amount);
    }

    function erc20RecoverAll(IERC20 token, address to) external onlyAuth {
        uint256 amount = token.balanceOf(address(this));
        token.transfer(to, amount);
        emit Erc20Recover(token, to, amount);
    }

    function tokenAssociate(address _address) external onlyAuth {
        int256 response = HederaTokenService.associateToken(
            address(this),
            _address
        );

        if (response != HederaResponseCodes.SUCCESS) {
            revert("Associate Failed");
        }
    }
}
