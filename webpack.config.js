const path = require('path');

module.exports = {
  entry: path.join(__dirname, '/src/libA01.ts'),
  mode: 'production',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'libA01.js',
    library: 'libA01',
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
    static: ['./dist', './static'],
    liveReload: true,
    open: true,
  }
};