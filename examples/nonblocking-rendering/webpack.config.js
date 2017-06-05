const path = require('path');

const babelOptions = {
  babelrc: false,
  presets: [
    require.resolve('babel-preset-es2017'),
    require.resolve('babel-preset-stage-3'),
  ]
};

module.exports = {
  module: {
    rules: [
      { test: /js$/, exclude: /node_modules/,
        use: [{ loader: 'babel-loader',
                options: babelOptions }] }
    ]
  },
  resolve: {
    alias: {
      'actor-system': path.resolve(__dirname, '../../'),
    }
  },
  devtool: 'inline-source-map'
};
