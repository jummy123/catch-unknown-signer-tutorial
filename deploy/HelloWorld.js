module.exports = async function ({ ethers, deployments, getNamedAccounts }) {
  const { deploy, catchUnknownSigner } = deployments;
  const { deployer } = await getNamedAccounts();

  const msProxyOwner = '0x1d9D82344E76769EB727521822D1EacB834A9024';
  let proxyOwner;
  try {
    await deployments.get('DefaultProxyAdmin');
    proxyOwner = msProxyOwner;
  }
  catch(err) {
    proxyOwner = deployer;
  }

  console.log('proxy owner is ', proxyOwner);
  console.log('deployer owner is ', deployer);

  await catchUnknownSigner(async () => {
    const bmcj = await deploy("HelloWorld", {
      from: deployer,
      proxy: {
        owner: proxyOwner,
        proxyContract: "OpenZeppelinTransparentProxy",
        viaAdminContract: "DefaultProxyAdmin",
      },
      log: true,
    });
    if (bmcj.newlyDeployed) {
      // If this is the first time we deploy transfer ownership of the proxy admin.
      console.log('Changing owner of DefaultProxyAdmin after first deploy')
      const proxyAdminContract = await ethers.getContract('DefaultProxyAdmin');
      await proxyAdminContract.transferOwnership(msProxyOwner);
    }
  });

};

module.exports.tags = ["HelloWorld"];
