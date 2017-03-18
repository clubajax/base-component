let suffix = `}));`;
function prefix(DEFINES, REQUIRES, ROOTS, ARGS, NAME) {
	return `(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD
        define([${DEFINES}], factory);
    } else if (typeof module === 'object' && module.exports) {
        // Node / CommonJS
        module.exports = factory(${REQUIRES});
    } else {
        // Browser globals (root is window)
        root['${NAME}'] = factory(${ROOTS});
    }
	}(this, function (${ARGS}) {`;
}


module.exports = function (name) {

	let
		fs = require('fs'),
		dir = './src/',
		fileName = dir + name + '.js',
		repRegExp = /\(\'(\w*)\'\)/,
		deps = [],
		dep,
		modName,
		lines;

	console.log('fileName', fileName);

	lines = fs.readFileSync(fileName).toString().split('\n').filter(function (line) {
		if (line.indexOf('require') > -1) {
			dep = repRegExp.exec(line);
			if (dep && dep.length > 1) {
				console.log('', line);
				console.log('DEP', dep[1]);
				deps.push(dep[1]);
			}
			return false;
		}
		if (line.indexOf('module.exports') > -1 && line.indexOf('{') === -1) {
			modName = line.split('=')[1].replace(';', '').trim();
			return false;
		}
		return true;
	});

	if(modName) {
		lines.push(`
	return ${modName};

}));`);
	}else{
		lines.push('\n}));');
	}

	let defines, requires, roots, args;

	defines = deps.map(function (dep) {
		return JSON.stringify(dep);
	}).join(', ');

	requires = deps.map(function (dep) {
		return `require('${dep}')`;
	}).join(', ');

	roots = deps.map(function (dep) {
		return `root.${dep}`;
	}).join(', ');

	args = deps.join(', ');

	console.log('deps:', deps);
	console.log('mod', modName);

	console.log('', defines);
	console.log('', requires);
	console.log('', roots);
	console.log('', args);


	lines.unshift(prefix(defines, requires, roots, args, modName));

	fs.writeFileSync(`dist/${name}.js`, lines.join('\n'));

	console.log('code compilation successful.');
}