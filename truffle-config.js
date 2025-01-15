module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*", // Junsukai id ma connect hos na
      gas: 5000000
    }
  },
  compilers: {
    solc: {
      version:"0.8.0",// version mentioned  gardeko
      settings: {
        optimizer: {
          enabled: true,
          runs: 200      
        },
      }
    }
  }
};