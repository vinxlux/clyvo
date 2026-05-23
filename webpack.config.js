const createExpoWebpackConfigAsync = require('@expo/webpack-config');

// Ensure env variables for expo-router are set when plugin isn't available
process.env.EXPO_ROUTER_APP_ROOT = process.env.EXPO_ROUTER_APP_ROOT || './app';
process.env.EXPO_ROUTER_IMPORT_MODE = process.env.EXPO_ROUTER_IMPORT_MODE || 'sync';

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(env, argv);
  try {
    const { withExpoRouter } = require('expo-router/webpack');
    return withExpoRouter(config);
  } catch (e) {
    // If plugin isn't available, ensure the DefinePlugin contains necessary envs
    if (config && config.plugins) {
      // noop — expo webpack config should already include DefinePlugin
    }
    return config;
  }
};
