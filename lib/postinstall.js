// @ts-check
'use strict';

const childProcess = require('child_process');
const download = require('download');
const fs = require('fs');
const os = require('os');
const util = require('util');

const mkdir = util.promisify(fs.mkdir);
const rename = util.promisify(fs.rename);

const isWindows = os.platform() === 'win32';
const extension = isWindows ? '.exe' : '';
const BIN_PATH = 'bin';

async function main() {
    await mkdir(BIN_PATH, { recursive: true });

    try {
        await downloadBinary();
        const fileName = await getFileName();
        await rename(`${BIN_PATH}/${fileName}`, `${BIN_PATH}/mcfunction-debug-adapter${extension}`)
    } catch (err) {
        console.error(`Downloading failed: ${err.stack}`);
        process.exit(1);
    }
}

async function downloadBinary() {
    const repo = 'https://github.com/vanilla-technologies/mcfunction-debugger';
    const version = '1.0.2';
    const fileName = await getFileName();
    const url = `${repo}/releases/download/v${version}/${fileName}`;
    console.log(`Downloading ${url}`);
    await download(url, BIN_PATH);
}

async function getFileName() {
    const target = await getTarget();
    return `mcfunction-debug-adapter-${target}${extension}`;
}

async function getTarget() {
    const arch = process.env.npm_config_arch || os.arch();
    const targetId = os.platform() + '-' + arch;

    switch (targetId) {
        case 'win32-x64': return 'x86_64-pc-windows-msvc';
        case 'win32-ia32': return 'i686-pc-windows-msvc';
        case 'win32-arm64': return 'aarch64-pc-windows-msvc';
        case 'linux-x64': return 'x86_64-unknown-linux-gnu';
        case 'linux-arm64': return 'aarch64-unknown-linux-gnu';
        case 'linux-armhf': return 'armv7-unknown-linux-gnueabihf';
        case 'alpine-x64': return 'x86_64-unknown-linux-musl';
        case 'alpine-arm64': return 'aarch64-unknown-linux-musl';
        case 'darwin-x64': return 'x86_64-apple-darwin';
        case 'darwin-arm64': return 'aarch64-apple-darwin';
        default: throw new Error('Unknown target: ' + targetId);
    }
}

main();
