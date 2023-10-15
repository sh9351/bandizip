[한국어 버전 README](README.md)  
This package is only available in Windows.

# Bandizip
Use Bandizip to easily and quickly extract and create compressed files. Get started instantly without any dependencies.

## 설치
Install this package via npm.
```shell
npm i bandizip
```
Bandizip(`bz.exe`) is included in this package as an exe. If you want to use the latest version of Bandizip, install Bandizip and specify the path as follows.
```js
const Bandizip = require('bandizip')
const bz = Bandizip({
    bz: "C:\\Program Files\\Bandizip\\bz.exe"
})
```

## Examples
To run this example, clone the repository using Git and run it as below.
```shell
git clone https://github.com/sh9351/bandizip.git
node example.js
```
```js
const fs = require('fs')
const Bandizip = require('bandizip')
async function main() {
    const bz = Bandizip({
        temp: process.env.TEMP
    })
    console.log(bz)

    // Get archive info
    const info = await bz.info('test/archive.zip')
    console.log(info)

    // Extract a zip file
    const extract = await bz.extract('test/archive.zip', 'test/output/extract')
    console.log(extract)

    // Extract a zip file buffer
    const extract_buffer = await bz.extract(fs.readFileSync('test/archive.zip'), 'test/output/extract_buffer')
    console.log(extract_buffer)

    // Same with readable streams
    const extract_stream = await bz.extract(fs.createReadStream('test/archive.zip'), 'test/output/extract_stream')
    console.log(extract_stream)

    // Extract only specified files from a zip file
    const extract_files = await bz.extract('test/archive.zip', 'test/output/extract_files', {
        files: ['Wallpapers/*']
    })
    console.log(extract_files)

    // Extract a password protected zip file
    const extract_password = await bz.extract('test/archive_password.zip', 'test/output/extract_password', {
        password: 'ESTSoftSucks!'
    })
    console.log(extract_password)

    // Create a new archive
    const archive = await bz.archive('test/output/archive', {
        password: 'ESTSoftSucks!',
        files: ['README.md', 'index.js', 'bz/*'],
        format: 'zip', // Can be zip, zipx, exe, tar, tgz, lzh, iso, 7z, gz, xz
        comment: 'Hello world from Bandizip in Node.js!',
        threads: 8
    })
    console.log(archive)

    // Split the archive into multiple files
    const archive_size = await bz.archive('test/output/archive_size.zip', {
        size: '1MB', threads: 1024, files: ['README.md', 'index.js', 'bz/*']
    })
    console.log(archive_size)

    // Add a file to an existing archive
    fs.copyFileSync('test/archive.zip', 'test/output/archive_add.zip')
    const archive_add = await bz.add('test/output/archive_add.zip', {
        files: ['bz/*'],
        password: 'BandizipCLI' // This will apply password only to the bz/* files,
                                // leaving the rest of the files passwordless
    })
    console.log(archive_add)

    // Set a different password for each file
    const archive_password = await bz.password('test/output/archive_password.zip', {
        files: {
            'bz/bz.exe': '',
            'bz/ark.x64.dll': 'ArkLibraryx64',
            'bz/bdzsfx.x86.sfx': 'BandizipSFX'
        },
        format: 'zip',
        comment: 'Different files have different passwords!'
    })
    console.log(archive_password)
}
main()
```

## Notes
- [Bandizip CLI](https://en.bandisoft.com/bandizip/help/parameter/)  
- [Bandizip License](https://en.bandisoft.com/bandizip/help/edition-comparison/) (Standard Edition can be used for commercial use, free of charge)

Who's ESTSoft? ESTSoft is the mega-giant corporation behind AlZip: [a *free* ZIP program with adverts that pop up repeatedly forever, forced installation of malware and PUPs you CAN'T disable, slow unzipping time without support for multi-core, and it's own file format ALZ/EGG without ANY OPEN-SOURCE SPECIFICATIONS which makes it the #1 GO-TO CHOICE FOR CRIMINALS DEPLOYING MALWARE.](https://en.wikipedia.org/wiki/Garbage)  
On the other hand, Bandizip is a free alternative to AlZip, and it's much better than AlZip in every single possible way. Even when extracting EGG files, Bandizip is relatively faster than AlZip.