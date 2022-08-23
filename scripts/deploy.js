const files = require('@clubajax/node-file-managment');

files.updateBuildPackage('./scripts', './build');
files.copyFile('./README.md', './build/README.md');

files.swapJK('README.md', 'package.json', 'index.js.map', 'index.js');
