const fs = require('fs');
const path = require('path');
const root = process.cwd();
const ignoreDir = ['node_modules'];
const fileTypes = ['.js'];
let filesLine = 0;
let filesLineNoBlank = 0;
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

        if(isFile && fileTypes.indexOf(extname) > -1) {
            readLine(currentPath);
        } else if(isDir) {
            if(ignoreDir.indexOf(item) === -1) {
                getFileName(currentPath);
            }
        }
    })
}

function readLine(file) {
    let lines = fs.readFileSync(file, 'utf-8').split('\n');
    filesLine += lines.length;    
    lines = lines.filter(item => item !== '')
    filesLineNoBlank += lines.length;
}

getFileName(root)

console.log(`行数为：${filesLine} \n去空白行行数：${filesLineNoBlank}`);