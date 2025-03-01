const { getDefaultConfig } = require('expo/metro-config');

module.exports = (async () => {
    const defaultConfig = await getDefaultConfig(__dirname);

    defaultConfig.resolver = {
        ...defaultConfig.resolver,
        extraNodeModules: {
            crypto: require.resolve('react-native-crypto'),
            stream: require.resolve('stream-browserify'),
            events: require.resolve('events'),
            path: require.resolve('path-browserify'),
            process: require.resolve('process'),
        }
    };

    return defaultConfig;
})();
