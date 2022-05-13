// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.11;

///////////////////////////////////////////////////////////////////////////
// To avoid over collateralization of token,
// only 80% value will be giving to the borrower from the collateral value
// for a 30 days period. => Example.  if borrower collateral is valued at 500,
// the amount of loan the user get is 400 for 30 days OR
// 450 tokens for a 15 day period loan time. If the value of the collateral
// drops below loan amount, the borrower risk their collateral been liquidated.
///////////////////////////////////////////////////////////////////////////

import "./hip-206/HederaTokenService.sol";
import "./hip-206/HederaResponseCodes.sol";

interface IERC20 {
    function transfer(address _to, uint256 _amount) external returns (bool);

    function balanceOf(address account) external view returns (uint256);
}

interface IERC721 {
    function balanceOf(address owner) external view returns (uint256 balance);

    function ownerOf(uint256 _tokenId) external view returns (address);
}

contract ZarelBorrow is HederaTokenService {
    IERC20 public immutable ZarelToken;
    IERC721 public immutable ZarelNFT;

    // set floor price of a token
    mapping(address => int64) TokenFloorPrice;

    // fee to experiment with, when there is a default in payment
    int16 constant fee = 100;

    //// an array of LiquidatedNfts
    mapping(address => uint64[]) LiquidatedNfts;

    address admin;
    address NftToken;
    address ZToken;

    struct Borrower {
        uint40 startTime;
        uint40 dueTime;
        int64 serialNumber;
        int64 balance;
        bool isActive;
        address borrower;
    }
    mapping(address => Borrower) public BorrowerDetails;

    constructor(
        address _admin,
        address _tokenAddr,
        address _NFTAddr,
        address _NFTToken,
        address _ZToken
    ) {
        admin = _admin;
        ZarelToken = IERC20(_tokenAddr);
        ZarelNFT = IERC721(_NFTAddr);
        NftToken = _NFTToken;
        ZToken = _ZToken;
    }

    modifier onlyAdmin() {
        admin == msg.sender;
        _;
    }

    modifier IsMember(address borrower, address _tokenAddr) {
        require(
            IERC721(_tokenAddr).balanceOf(borrower) > 0,
            "not a Zarel member"
        );
        _;
    }

    modifier isLiquidated(address borrower) {
        Borrower storage b = BorrowerDetails[borrower];
        require(b.dueTime > block.timestamp, "Collateral already liquidated");
        _;
    }

    function Borrow(
        address borrower,
        address _tokenAddr,
        int64 _serialNumber,
        uint40 _dueTime
    ) public IsMember(borrower, _tokenAddr) returns (bool) {
        require(borrower == msg.sender);
        Borrower storage b = BorrowerDetails[borrower];
        uint256 Id = uint64(_serialNumber);
        require(
            borrower == IERC721(_tokenAddr).ownerOf(Id),
            "Not owner of this NFT"
        );
        require(!b.isActive, "You have an active loan");

        // receive zarel Nft as collateral for token
        int256 response = HederaTokenService.transferNFT(
            _tokenAddr,
            borrower,
            address(this),
            _serialNumber
        );

        if (response != HederaResponseCodes.SUCCESS) {
            revert("NFT Transfer Failed");
        }
        // transfer zarel token to user => 80% worth of floor price
        int64 floorPrice = TokenFloorPrice[_tokenAddr];
        require(
            ZarelToken.transfer(borrower, uint64(floorPrice)),
            "Token transfer failed"
        );
        // update borrower details
        b.balance = floorPrice;
        b.startTime = uint40(block.timestamp);
        b.dueTime = _dueTime;
        b.serialNumber = _serialNumber;
        b.borrower = borrower;
        b.isActive = true;

        return true;
    }

    function payBack(address borrower, int64 _amount) public {
        Borrower storage b = BorrowerDetails[borrower];
        require(b.isActive == true, "You do not have a loan");
        // checks diff between  present time and borrowing start time;
        // if greater than 30 days, a fee is attached to the loan repayable;
        if ((block.timestamp - b.startTime) / 86400 > 30) {
            require(_amount >= (b.balance + fee), "Pay up total debt");
            int256 res = HederaTokenService.transferToken(
                ZToken,
                borrower,
                address(this),
                _amount
            );

            if (res != HederaResponseCodes.SUCCESS) {
                revert("Token Transfer Failed");
            }

            int256 res1 = HederaTokenService.transferNFT(
                NftToken,
                address(this),
                borrower,
                b.serialNumber
            );

            if (res1 != HederaResponseCodes.SUCCESS) {
                revert("NFT Transfer Failed");
            }

            b.isActive = false;
        }

        int256 res2 = HederaTokenService.transferToken(
            ZToken,
            borrower,
            address(this),
            _amount
        );

        if (res2 != HederaResponseCodes.SUCCESS) {
            revert("Token Transfer Failed");
        }

        int256 res3 = HederaTokenService.transferNFT(
            NftToken,
            address(this),
            borrower,
            b.serialNumber
        );

        if (res3 != HederaResponseCodes.SUCCESS) {
            revert("NFT Transfer Failed");
        }

        b.isActive = false;
    }

    function userTokenAssociate(address _tokenAddress) external onlyAdmin {
        int256 response = HederaTokenService.associateToken(
            msg.sender,
            _tokenAddress
        );

        if (response != HederaResponseCodes.SUCCESS) {
            revert("Associate Failed");
        }
    }

    ////////////////////////////////////////////////////
    //=================== onlyAdmin =================//

    function setFloorPrice(address _tokenAddr, int64 _floorPrice)
        public
        onlyAdmin
    {
        TokenFloorPrice[_tokenAddr] = _floorPrice;
    }

    function TokenBalance() public view onlyAdmin returns (uint256) {
        uint256 balance = ZarelToken.balanceOf(address(this));
        return balance;
    }

    function NFTBalance() public view onlyAdmin returns (uint256) {
        uint256 balance = ZarelNFT.balanceOf(address(this));

        return balance;
    }

    function getNFt(int64 serialNumber) public onlyAdmin {
        int256 response2 = HederaTokenService.transferNFT(
            NftToken,
            address(this),
            admin,
            serialNumber
        );

        if (response2 != HederaResponseCodes.SUCCESS) {
            revert("NFT Transfer Failed");
        }
    }

    function tokenAssociate(address _tokenAddress) external onlyAdmin {
        int256 response = HederaTokenService.associateToken(
            address(this),
            _tokenAddress
        );

        if (response != HederaResponseCodes.SUCCESS) {
            revert("Associate Failed");
        }
    }
}
