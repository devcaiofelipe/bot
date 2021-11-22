import { appList } from './app-list.js';
import replace from 'replace';
import fs from 'fs';
import { normalizePath } from './src/utils.js';
import { execSync } from 'child_process';


for (const app of appList) {
    const basePath = process.cwd();
    const configPath = normalizePath(basePath + `/apps/${app}/config.json`);
    const { domain, appType, packageName } = JSON.parse(fs.readFileSync(configPath, 'UTF-8'));
    const basePathOutput = `${basePath}/apps/${domain}`;
    const outputhMap = {
        'apk': `${basePathOutput}/entregador-1.0.72-${packageName}.apk`,
        'bundle': `${basePathOutput}/entregador-1.0.72-release.aab`
    };
    console.log(outputhMap[appType]);
    const typeMap = {
        'apk': 'apkpath',
        'bundle': 'aabpath'
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

    execSync(`git checkout -- .`, { cwd: basePath }, (error, stdout, stderr) => {
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
