// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.11;
pragma experimental ABIEncoderV2;

import "./hip-206/HederaTokenService.sol";
import "./hip-206/HederaResponseCodes.sol";

contract ZarelNFT is HederaTokenService {
    address tokenAddress;

    constructor(address _tokenAddress) {
        tokenAddress = _tokenAddress;
    }

    function mintZarelNFT(bytes[] memory metadata) external {
        (
            int256 response,
            uint64 newTotalSupply,
            int64[] memory serialNumbers
        ) = HederaTokenService.mintToken(tokenAddress, 1, metadata);

        if (response != HederaResponseCodes.SUCCESS) {
            revert("Mint Failed");
        }
    }

    function NFTAssociate(address _account) external {
        int256 response = HederaTokenService.associateToken(
            _account,
            tokenAddress
        );

        if (response != HederaResponseCodes.SUCCESS) {
            revert("Associate Failed");
        }
    }

    function transferZarelNFT(
        address sender,
        address receiver,
        int64 serialNumber
    ) external {
        int256 response = HederaTokenService.transferNFT(
            tokenAddress,
            sender,
            receiver,
            serialNumber
        );

        if (response != HederaResponseCodes.SUCCESS) {
            revert("Transfer Failed");
        }
    }
}
