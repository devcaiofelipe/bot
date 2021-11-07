'use strict';

import path from 'path';
import fs from 'fs';

export function recFindByExt(base,ext,files,result) {
    files = files || fs.readdirSync(base)
    result = result || []
    files.forEach(function (file) {
        let newbase = path.join(base,file)
        if( fs.statSync(newbase).isDirectory()) {
            result = this.recFindByExt(newbase,ext,fs.readdirSync(newbase),result)
        }
        else {
            if(file.substr(-1*(ext.length+1)) == '.' + ext ) {
                result.push(newbase)
            }
        }
    })
    return result
}

export function removeFiles(files) {
    for(const filePath of files) {
        fs.unlinkSync(filePath, function(err){
            if(err) return console.log(err);
            console.log('file deleted successfully');
       });
    };
};