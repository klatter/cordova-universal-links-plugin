/**
Hook is executed when plugin is added to the project.
It will check all necessary module dependencies and install the missing ones locally.
Also, it will suggest to user to install CLI client for that plugin.
It can be found in https://github.com/nordnet/cordova-hot-code-push-cli.git
*/

var exec = require('child_process').exec,
  modules = ['xml2js'];

// region NPM specific

/**
 * Check if node package is installed.
 *
 * @param {String} moduleName
 * @return {Boolean} true if package already installed
 */
function isNodeModuleInstalled(moduleName) {
  var installed = true;
  try {
    require.resolve(moduleName);
  } catch (err) {
    installed = false;
  }

  return installed;
}

/**
 * Install node module locally.
 * Basically, it runs 'npm install module_name'.
 *
 * @param {String} moduleName
 * @param {Callback(error)} callback
 */
function installNodeModule(moduleName, callback) {
  if (isNodeModuleInstalled(moduleName)) {
    console.log('Node module ' + moduleName + ' is found');
    callback(null);
    return;
  }
  console.log('Can\'t find module ' + moduleName + ', running npm install');

  var cmd = 'npm install ' + moduleName;
  exec(cmd, function(err, stdout, stderr) {
    callback(err);
  });
}

/**
 * Install all required node packages. For now we have to do it manually.
 * Once we make plugin as a node package - we can specify dependencies in package.json.
 */
function installRequiredNodeModules() {
  if (modules.length == 0) {
    console.log('All dependency modules are installed.');
    return;
  }

  var moduleName = modules.shift();
  installNodeModule(moduleName, function(err) {
    if (err) {
      console.log('Failed to install module ' + moduleName);
      console.log(err);
      return;
    } else {
      console.log('Package ' + moduleName + ' is installed');
      installRequiredNodeModules();
    }
  });
}

// endregion

module.exports = function(ctx) {
  installRequiredNodeModules();
};