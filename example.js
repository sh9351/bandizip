const fs = require('fs')
const Bandizip = require('./')
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