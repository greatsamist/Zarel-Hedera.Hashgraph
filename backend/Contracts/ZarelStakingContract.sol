// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.11;

import "./hip-206/HederaTokenService.sol";
import "./hip-206/HederaResponseCodes.sol";

interface IERC20 {
    function transfer(address _to, uint256 _amount) external returns (bool);

    function balanceOf(address account) external view returns (uint256);
}

interface IERC721 {
    function balanceOf(address owner) external view returns (uint256 balance);
}

contract ZarelStaking is HederaTokenService {
    struct Staker {
        address stakedBy;
        bool isActive;
        uint64 stakedAt;
        uint64 amount;
    }
    mapping(address => Staker) private Stakers;

    IERC20 public immutable ZarelToken;
    IERC721 public immutable ZarelNFT;

    address admin;
    address ZToken;

    uint8 public immutable minStake;
    uint8 public constant MPY = 10;

    constructor(
        address _admin,
        address _tokenAddr,
        address _NFTAddr,
        address _ZToken,
        uint8 _minStake
    ) {
        admin = _admin;
        ZarelToken = IERC20(_tokenAddr);
        ZarelNFT = IERC721(_NFTAddr);
        ZToken = _ZToken;
        minStake = _minStake;
    }

    modifier onlyAdmin() {
        admin == msg.sender;
        _;
    }

    modifier IsMember(address sender) {
        require(ZarelNFT.balanceOf(sender) > 0, "Not a Zarel member");
        _;
    }

    modifier validStake(uint64 _amount) {
        require(_amount >= minStake, "Invalid Stake");
        _;
    }

    // calculates and returns yield
    function _calculateYield(Staker memory _s) internal view returns (uint64) {
        uint64 _yield = 0;
        // cycle is 1 second long
        uint64 cycle = 1 seconds;
        uint64 minCycle = 3 days;

        uint64 _maturity = uint64(block.timestamp - _s.stakedAt);

        if (_maturity < minCycle) {
            return _yield;
        }

        uint64 _cycles = _maturity / cycle;
        _yield = (_cycles * MPY * _s.amount) / (259200000); // yield earned to a second
        return _yield;
    }

    function stake(uint64 _amount, address sender)
        public
        validStake(_amount)
        IsMember(sender)
        returns (bool)
    {
        // Token transfer code
        int256 response = HederaTokenService.transferToken(
            ZToken,
            sender,
            address(this),
            int64(_amount)
        );

        if (response != HederaResponseCodes.SUCCESS) {
            revert("Token Transfer Failed");
        }

        Staker storage s = Stakers[sender];

        if (s.isActive) {
            _amount += _calculateYield(s);
        } else {
            s.stakedBy = sender;
            s.isActive = true;
        }

        s.amount = _amount;
        s.stakedAt = uint64(block.timestamp);

        return true;
    }

    function withdraw(address receiver) public returns (bool) {
        Staker storage s = Stakers[receiver];
        require(s.isActive, "No active record found");
        uint64 _yield = _calculateYield(s);
        uint64 _totalReturns = _yield + s.amount;

        // effect and record
        s.isActive = false;

        int256 response = HederaTokenService.transferToken(
            ZToken,
            address(this),
            receiver,
            int64(_totalReturns)
        );

        if (response != HederaResponseCodes.SUCCESS) {
            revert("Token Transfer Failed");
        }
    }

    ////////////////////////////////////////////////
    //================ onlyAdmin =================//

    function tokenAssociate(address _tokenAddress) external onlyAdmin {
        int256 response = HederaTokenService.associateToken(
            address(this),
            _tokenAddress
        );

        if (response != HederaResponseCodes.SUCCESS) {
            revert("Associate Failed");
        }
    }

    function TokenBalance() public view onlyAdmin {
        ZarelToken.balanceOf(address(this));
    }
}
