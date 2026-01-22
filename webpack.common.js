const path = require("path");

module.exports = {
  entry: "./src/index.js",
  output: {
    filename: "text-to-movie.js",
    path: path.resolve(__dirname, "dist"),
    clean: true,
    iife: true,
    library: {
      name: "TextToMovie",
      type: "var"
    }
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /node_modules/,
        use: "babel-loader"
      }
    ]
  },
  target: ["web"],
  devtool: false
};
