module.exports = {
  apps: [
    {
      name: 'mesto-back',
      script: 'npm',
      args: 'start',
      instances: 1,
      autorestart: true,
      watch: true,
    },
  ],
};
