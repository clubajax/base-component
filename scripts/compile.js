let suffix = `}));`;
function getPrefix(DEFINES, REQUIRES, ROOTS, ARGS, NAME) {
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

const babel = require("babel-core");

function babelize (code) {
	let options = {
		presets: ["latest"]
	};
	let result = babel.transform(code, options);
	return result.code;
}

module.exports = function (name) {

	let
		fs = require('fs'),
		dir = './src/',
		fileName = dir + name + '.js',
		repRegExp = /\(\'(\w*)\'\)/,
		rePath = /\(\'(@*\w*\/*\w+)\'\)/,
		reName = /\(\'@*\w*\/*(\w+)\'\)/,
		deps = [],
		dep,
		modName,
		lines,
		code,
		prefix,
		suffix;

	console.log('fileName', fileName);

	lines = fs.readFileSync(fileName).toString().split('\n').filter(function (line) {
		if (line.indexOf('require') > -1) {
			dep = rePath.exec(line);
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

	code = babelize(lines.join('\n'));

	if(modName) {
		suffix = `
	return ${modName};

}));`;
	}else{
		suffix = '\n}));';
	}

	let defines, requires, roots, args;

	defines = deps.map(function (dep) {
		return JSON.stringify(dep);
	}).join(', ');

	requires = deps.map(function (dep) {
		return `require('${dep}')`;
	}).join(', ');

	roots = deps.map(function (dep) {
		return `root.${nameOnly(dep)}`;
	}).join(', ');

	args = deps.map(function (dep) {
		return nameOnly(dep);
	}).join(', ');

	console.log('deps:', deps);
	console.log('mod', modName);

	console.log('', defines);
	console.log('', requires);
	console.log('', roots);
	console.log('', args);


	prefix = getPrefix(defines, requires, roots, args, modName);

	fs.writeFileSync(`dist/${name}.js`, [prefix, code, suffix].join('\n'));

	console.log('code compilation successful.');
};

function nameOnly (dep) {
	return dep.replace('@clubajax/', '');
}