"use strict";

const
    fs = require('fs'),
    dir = '../src',
    ignores = 'create.js,loader.js';

function fromRequire (line) {
    // const on = require('on');
    return line.split("'")[1];
}

function fromImport (line) {
    // import BaseComponent from './BaseComponent';
    return line.split(' ')[1];
}

function fromExports (line) {
    // export default BaseComponent;
    let name = line.split(' ')[2];
    if(name.indexOf('{}') > -1){ return null; }
    return name;
}

function convert (fileName) {
    let
        imports = [],
        exports = [],
        lines = [];
    fs.readFileSync(dir + '/' + fileName).toString().split('\n').forEach(function (line) {
        if(/require\(/.test(line)){
            imports.push(fromRequire(line));
        }
        if(/import\s/.test(line)){
            imports.push(fromImport(line));
        }
        if(/export\s/.test(line)){
            exports.push(fromExports(line));
        }
    });
    console.log('imports', imports);
    console.log('exports', exports);
}

fs.readdirSync(dir).forEach(function (fileName) {
    if(ignores.indexOf(fileName) === -1) {
        console.log('fileName', fileName);
        convert(fileName);
    }
});