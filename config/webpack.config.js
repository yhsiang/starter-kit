import OS from 'os';
import Path from 'path';
import webpack from 'webpack';


const interfaces = OS.networkInterfaces(),

      privateInterface = [].concat(...Object.keys(interfaces).map(name => interfaces[name]))
                           .find(({address, family, internal}) =>
                             !internal &&
                             family === 'IPv4' &&
                             address.split('.', 2).toString() === '192,168'
                           ),

      NODE_MODULES_DIR = Path.join(__dirname, '../node_modules'),

      PROJECT_DIR = Path.join(__dirname, '..');

var config = {
  entry: {
    app: './src/index.js',
  },
  output: {
    path: Path.resolve( __dirname + './dev'),
    filename: '[name].js'
  },

  devServer: {
    host: privateInterface.address || '0.0.0.0',
    port: process.env.PORT || 8888,
    contentBase: './src',
    colors: true
  },

  cache: true,
  debug: true,
  devtool: 'eval',

  module: {
    noParse: ['react/addons', 'react-router'],

    loaders: [{
      test: /\.css$/,
      include: [
        Path.resolve("./node_modules/react-select"),
        Path.resolve("./node_modules/react-datepicker")
      ],
      loader: "style!css"
    },
    {
      test: /\.css$/,
      exclude: /react-/,
      loader: 'style!css?modules&localIdentName=[name]-[local]__[hash:base64:5]!postcss'
    }, {
      test: /\.less$/,
      loader: 'style!css!less',
    }, {
      test: /\.woff2?$/,
      loader: 'url?limit=10000&minetype=application/font-woff'
    }, {
      test: /\.ttf$/,
      loader: 'url?limit=10000&minetype=application/octet-stream'
    }, {
      test: /\.eot$/,
      loader: 'file'
    }, {
      test: /\.svg$/,
      loader: 'url?limit=10000&minetype=image/svg+xml'
    }, {
      test: /\.gif$/,
      loader: 'url?limit=10000&mimetype=image/gif'
    }, {
      test: /\.jpg$/,
      loader: 'url?limit=10000&mimetype=image/jpg'
    }, {
      test: /\.png$/,
      loader: 'url?limit=10000&mimetype=image/png'
    }, {
      test: /\.jsx?$/,
      loader: 'react-hot!babel?cacheDirectory&cacheIdentifier',
      include: Path.join(__dirname, '../src')
    }, {
      test: /\.json$/,
      loader: 'json'
    }]
  },

  resolve: {
    extensions: ['', '.js', '.jsx'],

    root: [NODE_MODULES_DIR, PROJECT_DIR],

    alias: {
      'react/addons' : Path.resolve(NODE_MODULES_DIR, 'react/dist/react-with-addons.min.js'),
      'react-router': 'react-router/umd/ReactRouter.min.js'
    }
  },

  plugins: [
    new webpack.NormalModuleReplacementPlugin(/^react(\/addons)?$/, require.resolve('react/addons')),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': `'${process.env.NODE_ENV}'`
    })
  ],
  postcss: [
    require('autoprefixer-core'),
    require("postcss-custom-properties")
  ]
};

[
  'bluebird/js/browser/bluebird.min.js',
  'immutable/dist/immutable.min.js',
].forEach(lib => {
  const libPath = Path.resolve(NODE_MODULES_DIR, lib);

  config.module.noParse.push(libPath);
  config.resolve.alias[lib.split('/')[0]] = libPath;
});

export default config;
