#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
var argv = require('yargs')
    .usage('Usage: $0 -f [file] -i [directory]')
    .argv;
const root = process.cwd();
const ignoreDir = ['node_modules'];
const fileJsTypes = ['.js','.jsx'];
const fileCssTypes = ['.css', '.scss', '.less', '.sass', '.styl']
let filesJsLine = 0;
let filesJsLineNoBlank = 0;
let filesCssLine = 0;
let filesCssLineNoBlank = 0;
/**
 * @param {String} dir 
 * @returns {Object}
 */
function getFileName(dir) {
 
    const files = fs.readdirSync(dir);

    files.forEach((item) => {

        const extname = path.extname(item),
              currentPath = path.join(dir, item),
              isFile = fs.statSync(currentPath).isFile(),
              isDir = fs.statSync(currentPath).isDirectory();
        
        if(isFile) {
            if(fileJsTypes.indexOf(extname) > -1) {
                readJsLine(currentPath);
            }
            if(fileCssTypes.indexOf(extname) > -1) {
                readCssLine(currentPath);
            }
        } else if(isDir) {
            if(ignoreDir.indexOf(item) === -1) {
                getFileName(currentPath);
            }
        }
    })
}

function readJsLine(file) {
    let lines = fs.readFileSync(file, 'utf-8').split('\n');
    filesJsLine += lines.length;    
    lines = lines.filter(item => (item.trim() !== '' && item.trim() !== '\r'));
    filesJsLineNoBlank += lines.length;
}

function readCssLine(file) {
    let lines = fs.readFileSync(file, 'utf-8').split('\n');
    filesCssLine += lines.length;    
    lines = lines.filter(item => (item.trim() !== '' && item.trim() !== '\r'));
    filesCssLineNoBlank += lines.length;
}

function main() {
    if(argv.i){
        const ignodeList = argv.i.indexOf(',') > -1 ? argv.i.split(','): [argv.i];
        ignodeList.map((item) => {
            const isDir = fs.statSync(item).isDirectory();
            if(isDir) {
                ignoreDir.push(item);
            } else {
                console.warn(`${item} is not a dir`);
            }
        })
    }
    if(argv.f) {
        const fileList = argv.f.split(',') > -1 ? argv.f.split(','): [argv.f];
        fileList.map((item) => {
            const extname = path.extname(item);
            const isFile = fs.statSync(item).isFile();
            if(isFile) {
                if(fileJsTypes.indexOf(extname) > -1) {
                    readJsLine(item);
                }
                if(fileCssTypes.indexOf(extname) > -1) {
                    readCssLine(item);
                }
            }
        })
    }
    if(!argv.i && !argv.f){
        getFileName(root);
    }
}

main();

console.log(`js/jsx lines：${filesJsLine} \n(rm empty lines)：${filesJsLineNoBlank}`);
console.log(`css/sass/less/stylus lines：${filesCssLine} \n(rm empty lines)：${filesCssLineNoBlank}`);