const path = require('path');

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // for more about customizing your Truffle configuration!
	compilers: {
		solc: {
			version: "0.6.2",
		},
	},
  networks: {
    development: {
      host: "127.0.0.1",
      // ganache
      port: 7545,
      // truffle-develop 
      //port: 9545,
      network_id: "*" // Match any network id
    }
  },
  contracts_build_directory: path.join(__dirname, "client3/src/contracts"),
  //networks: {
  //  development: {
  //    host: "127.0.0.1",
  //    port: 7545,
  //    network_id: "*" // Match any network id
  //  }
  //}
};
