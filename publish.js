import { appList } from './app-list.js';
import replace from 'replace';
import fs from 'fs';
import { normalizePath } from './src/utils.js';
import { execSync } from 'child_process';


for (const app of appList) {
    const basePath = process.cwd();
    execSync(`git checkout -- Appfile && git checkout -- Fastfile`, { cwd: `${basePath}/fastlane` }, (error, stdout, stderr) => {
        if (error) {
            console.log(`error: ${error.message}`);
            return
        };
        if (stdout) {
            console.log(`stdout: ${stdout}`);
        };
        if (stderr) {
            console.log(`stderr: ${stderr}`);
        };
    });
    const configPath = normalizePath(basePath + `/apps/${app}/config.json`);
    const { appType, packageName } = JSON.parse(fs.readFileSync(configPath, 'UTF-8'));
    console.log('INICIANDO A PUBLICAÇÃO DO APLICATIVO =', packageName);
    const basePathOutput = `${basePath}/apps/${app}`;
    const outputhMap = {
        'apk': `${basePathOutput}/entregador-2.0.11-${packageName}.apk`,
        'bundle': `${basePathOutput}/entregador-2.0.11-release.aab`
    };
    const typeMap = {
        'apk': 'apkpath',
        'bundle': 'aabpath'
    };
    const laneMap = {
        'apk': 'fastlane apk',
        'bundle': 'fastlane aab'
    };
    replace({
        regex: 'nomedopacote',
        replacement: packageName,
        paths: [
            normalizePath(basePath + `/fastlane/Appfile`),
        ],
        recursive: false,
        silent: false,
    });
    replace({
        regex: typeMap[appType],
        replacement: outputhMap[appType],
        paths: [
            normalizePath(basePath + `/fastlane/Fastfile`),
        ],
        recursive: false,
        silent: false,
    });
    const command = laneMap[appType];
    execSync(command, { cwd: basePath }, (error, stdout, stderr) => {
        if (error) {
            console.log(`error: ${error.message}`);
            return
        };
        if (stdout) {
            console.log(`stdout: ${stdout}`);
        };
        if (stderr) {
            console.log(`stderr: ${stderr}`);
        };
    });
    execSync(`git checkout -- Appfile && git checkout -- Fastfile`, { cwd: `${basePath}/fastlane` }, (error, stdout, stderr) => {
        if (error) {
            console.log(`error: ${error.message}`);
            return
        };
        if (stdout) {
            console.log(`stdout: ${stdout}`);
        };
        if (stderr) {
            console.log(`stderr: ${stderr}`);
        };
    });
};
