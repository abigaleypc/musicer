'use strict';

const path = require('path');
const fs = require('fs');
const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = (relativePath ) => path.resolve(appDirectory, relativePath);
module.exports = function resolveProjectsConfig() {
  return {
    dotenv: resolveApp('./.env'),
    appBuild: resolveApp('./build'),
    appPublic: resolveApp('./public/entry'),
    appDist: resolveApp('./public/dist'),
    appConfig: resolveApp('./env.ts'),
    webHtml: resolveApp('./src/public/web.html'),
    appIndexJs: resolveApp('./src/index.tsx'),
    appPackageJson: resolveApp('./package.json'),
    appSrc: resolveApp('./src'),
    appNodeModules: resolveApp('./node_modules'),
    yarnLockFile: resolveApp('yarn.lock'),
    nodeModules: resolveApp('node_modules'),
    resolveApp
  };
};
