const { gitDescribeSync } = require('git-describe');
const crypto = require('crypto');

process.env.VUE_APP_GIT_HASH = gitDescribeSync().hash;

const cryptoOrigCreateHash = crypto.createHash;
crypto.createHash = (algorithm) => cryptoOrigCreateHash(algorithm === 'md4' ? 'sha256' : algorithm);

module.exports = {
  transpileDependencies: ['vuetify', 'feathers-vuex', '@feathersjs/hooks'],
};
