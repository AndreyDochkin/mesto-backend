module.exports = {
  apps: [
    {
      name: 'mesto-api',
      script: 'npm',
      args: 'start',
      instances: 1,
      autorestart: true,
      watch: false,
    },
  ],
};
