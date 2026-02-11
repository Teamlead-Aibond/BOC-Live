module.exports = {
  apps: [
    {
      name: "backend-app",
      script: "./bin/www",
      watch: false,
      force: true,
      env: {
        PORT: 3000,
        NODE_ENV: "production",
      },
    },
  ],
};
