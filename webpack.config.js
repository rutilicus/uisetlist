module.exports = {
  mode: "production",

  entry: "./src/js/songapp_new.tsx",

  resolve: {
    extensions: [".ts", ".tsx", ".js"]
  },

  output: {
    path: `${__dirname}/src/main/resources/static/js`,
    filename: "songapp_main.js"
  },

  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        use: [
          {
            loader: "babel-loader",
            options: {
              presets: [
                "@babel/preset-env",
                "@babel/preset-react",
                "@babel/preset-typescript"
              ],
              plugins: [
                ["@babel/plugin-transform-runtime", { "corejs":3 }]
              ]
            }
          }
        ]
      }
    ]
  },
  target: ["web", "es5"],
};
