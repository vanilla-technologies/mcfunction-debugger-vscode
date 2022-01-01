// @ts-check
'use strict';

const childProcess = require('child_process');
const download = require('download');
const fs = require('fs');
const os = require('os');
const util = require('util');

const copyFile = util.promisify(fs.copyFile);
const exec = util.promisify(childProcess.exec);
const mkdir = util.promisify(fs.mkdir);

const isWindows = os.platform() === 'win32';
const BIN_PATH = 'bin';

async function main() {
    await mkdir(BIN_PATH, { recursive: true });

    const path = await findInstallationPath();
    if (path) {
        console.log(`Copying ${path}`);
        const target = await getTarget();
        const extension = isWindows ? '.exe' : '';
        await copyFile(path, `${BIN_PATH}/mcfunction-debug-adapter-${target}${extension}`);
    } else {
        try {
            await downloadBinary();
        } catch (err) {
            console.error(`Downloading failed: ${err.stack}`);
            process.exit(1);
        }
    }
}

async function findInstallationPath() {
    const cmd = (() => {
        switch (os.platform()) {
            case 'win32': return 'where mcfunction-debug-adapter';
            case 'linux': return 'which mcfunction-debug-adapter';
            default: throw new Error('Unsupported platform: ' + os.platform());
        }
    })();

    try {
        const result = await exec(cmd);
        return result.stdout.trimEnd();
    } catch {
        return null;
    }
}

async function downloadBinary() {
    const repo = 'https://github.com/vanilla-technologies/mcfunction-debugger';
    const version = '0.1.0';
    const target = await getTarget();
    const extension = isWindows ? '.exe' : '';
    const url = `${repo}/releases/download/v${version}/mcfunction-debug-adapter-${target}${extension}`;
    console.log(`Downloading ${url}`);
    await download(url, BIN_PATH);
}

async function getTarget() {
    const arch = process.env.npm_config_arch || os.arch();
    const targetId = os.platform() + '-' + arch;

    switch (targetId) {
        case 'win32-x64': return 'x86_64-pc-windows-msvc';
        case 'linux-x64': return 'x86_64-unknown-linux-gnu';
        default: throw new Error('Unknown target: ' + targetId);
    }
}

main();
