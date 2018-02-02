#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
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

getFileName(root);

console.log(`js行数为：${filesJsLine} \nj行数为(去空行)：${filesJsLineNoBlank}`);
console.log(`js行数为：${filesCssLine} \nj行数为(去空行)：${filesCssLineNoBlank}`);