//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract HelloWorld {

    function greet() public pure returns (string memory) {
        return "Hello World!";
    }
}
