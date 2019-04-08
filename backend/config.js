const fs = require('fs');
const env = process.env.NODE_ENV || 'development';
console.log('env ***********', env);

if (env === 'development' || env === 'test') {
  const config = require('./config.json')

  const envConfig = config[env];
  Object.keys(envConfig).forEach((key) => {
    console.log(`process.env[${key}] = ${envConfig[key]}`)
    process.env[key] = envConfig[key];
  });
}
