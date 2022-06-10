const path = require('path');

module.exports = {
  entry: path.join(__dirname, '/src/sigsauer.ts'),
  mode: 'production',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'sigsauer.js',
    library: 'sigsauer',
    libraryTarget: 'umd',
    globalObject: 'this'
  },
  performance: {
    hints: false,
    maxEntrypointSize: 512000,
    maxAssetSize: 512000
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        include: [
          path.resolve(__dirname)
        ],
      },
    ]
  },
  resolve: {
    extensions: [".ts", ".js"]
  },
  plugins: [

  ],
  devServer: {
    port: 8080,
    static: './dist',
    liveReload: true,
    open: true,
  }
};