// PM2 ecosystem config — use this if deploying WITHOUT Docker
// Run: pm2 start ecosystem.config.js --env production

module.exports = {
  apps: [
    {
      name: 'myperfecttrips',
      script: 'node_modules/.bin/next',
      args: 'start',
      cwd: '/var/www/myperfecttrips',
      instances: 'max',           // Use all CPU cores
      exec_mode: 'cluster',       // Cluster mode for load balancing
      watch: false,
      max_memory_restart: '512M', // Restart if memory exceeds 512MB (KVM2 VPS)
      env: {
        NODE_ENV: 'development',
        PORT: 3000,
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 3000,
        NEXT_TELEMETRY_DISABLED: '1',
      },
      // Logging
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
      error_file: '/var/log/pm2/myperfecttrips-error.log',
      out_file: '/var/log/pm2/myperfecttrips-out.log',
      merge_logs: true,
      // Auto-restart on crash
      autorestart: true,
      restart_delay: 3000,
      max_restarts: 10,
    },
  ],
};
