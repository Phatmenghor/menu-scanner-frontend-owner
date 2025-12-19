module.exports = {
  apps: [
    {
      name: "e-menu-owner",
      script: "npm",
      args: "start",
      exec_mode: "fork",
      instances: 1,
      env: {
        NODE_ENV: "production",
        PORT: "3443",
      },
      env_file: ".env.production",
      out_file: "./logs/out.log",
      error_file: "./logs/error.log",
    },
  ],
};
