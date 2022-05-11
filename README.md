# hardhat-deploy catchUnknowSigner tutorial

This project demonstrates how to deploy an update to a contract that used `OpenZeppelinTransparentProxy` via a `ProxyAdmin` contract where the deploying account is not the owner of the `ProxyAdmin` contract.

# Step 1: Deploy all the contracts

In a terminal start a hardhat node with the no deploy option, we will use this local network to deploy our contract and then perform an upgrade.

```
yarn hardhat node --no-deploy
```

If we look at the deploy script _deploy/HelloWorld.js_ we can observe the following:
1. If there is no current deployment for the `DefaultProxyAdmin` the proxy owner variable is set the same as the deployer.
2. After the deploy if the contract is `newlyDeployed` we get the `DefaultProxyAdmin` contract and transfer its ownership to a hardcoded address `0x1d9D82344E76769EB727521822D1EacB834A9024`.

Leave that running and deploy the `HelloWorld` contract.

```
➜ yarn hardhat deploy --network localhost
in deploy script
proxy owner is  0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
deployer owner is  0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
deploying "DefaultProxyAdmin" (tx: 0xa46c43ff13eeb3ae96e16b7e70afb082f2d4f1350092aa023d79dbe68ce04a18)...: deployed at 0x2279B7A0a67DB372996a5FaB50D91eAA73d2eBe6 with 643983 gas
deploying "HelloWorld_Implementation" (tx: 0x811413f2afa43a7d44a2978d680d28cf467cfcaa39b824c5aa8cc9ef6583b99d)...: deployed at 0x8A791620dd6260079BF849Dc5567aDC3F2FdC318 with 135079 gas
deploying "HelloWorld_Proxy" (tx: 0xff9294215a4a9539b2c96fa7d2e83151cec6cbb8ff6764334549cd66e66a7b97)...: deployed at 0x610178dA211FEF7D417bC0e6FeD39F05609AD788 with 720430 gas
Changing owner of DefaultProxyAdmin after first deploy
Done in 4.36s.
```

Now in order to update this deployment we need to change the `HelloWorld` contract so hardhat-deploy knows it needs to be updated. In our case we can simply change the string returned from the `greet` function.

```
sed -i 's/Hello World/Hello Universe/' contracts/HelloWorld.sol
```

Running the deploy script for a second time the `proxyOwner` variable will get set to the address the we transferred the ownership to the first time we deployed. This causes the `catchUnknowSigner` to see we don't have the private key for this account in our config and will print to the console the transaction that needs to be broadcast to update the implementation.

```
➜ yarn hardhat deploy --network localhost
Generating typings for: 1 artifacts in dir: typechain for target: ethers-v5
Successfully generated 5 typings!
Compiled 1 Solidity file successfully
proxy owner is  0x1d9D82344E76769EB727521822D1EacB834A9024
deployer owner is  0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
reusing "DefaultProxyAdmin" at 0xA51c1fc2f0D1a1b8494Ed1FE312d7C3a78Ed91C0
deploying "HelloWorld_Implementation" (tx: 0x56ed197296122620ac8478fde2c2d43cef1d22a4eec0ae770104a6305f15747b)...: deployed at 0x9A9f2CCfdE556A7E9Ff0848998Aa4a0CFD8863AE with 135103 gas
---------------------------------------------------------------------------------------
no signer for 0x1d9D82344E76769EB727521822D1EacB834A9024
Please execute the following:
---------------------------------------------------------------------------------------

from: 0x1d9D82344E76769EB727521822D1EacB834A9024
to: 0xA51c1fc2f0D1a1b8494Ed1FE312d7C3a78Ed91C0 (DefaultProxyAdmin)
method: upgrade
args:
  - 0x9A676e781A523b5d0C0e43731313A708CB607508
  - 0x9A9f2CCfdE556A7E9Ff0848998Aa4a0CFD8863AE

(raw data: 0x99a88ec40000000000000000000000009a676e781a523b5d0c0e43731313a708cb6075080000000000000000000000009a9f2ccfde556a7e9ff0848998aa4a0cfd8863ae )

---------------------------------------------------------------------------------------
Done in 6.02s.
```
