const config = require('./config.json')

module.exports = {
  networks: {
    development:{
      host: config.host,
      port: config.port,
      network_id: config.network_id
    }
  },

  mocha: {
  },

  // Configure your compilers
  compilers: {
    solc: {
    }
  }
};
