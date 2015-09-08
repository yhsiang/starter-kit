require('babel/register');

module.exports = require(({
  'webpack-dev-server': './config/webpack.config'
})[process.argv[1].split('/').pop()]);
