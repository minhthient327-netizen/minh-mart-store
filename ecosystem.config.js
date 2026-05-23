module.exports = {
  apps: [
    {
      name: "minh-mart-store",
      script: "./server.js",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
      },
    },
  ],
};
