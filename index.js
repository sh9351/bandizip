const path = require('path')
const _fs = require('fs'),
    fs = _fs.promises
const { Buffer } = require('buffer')
const { Readable } = require('stream')
const { spawn } = require('child_process')

function Bandizip(options = {}) {
    if (!(this instanceof Bandizip)) return new Bandizip(options)
    this.options = options
    if (!options.bz) this.options.bz = path.join(__dirname, 'bz', 'bz.exe')
    if (!options.temp) this.options.temp = process.env.TEMP
}
Bandizip.prototype._spawn = function (...args) {
    return new Promise(resolve => {
        const child = spawn(this.options.bz, args, {
            detatched: true
        }), stdout = []
        child.stdout.on('data', data => {
            stdout.push(...data.toString().split('\r\n').filter(l => l.trim().length > 0))
        })
        child.on('close', () => {
            resolve({
                version: stdout[0],
                message: stdout[1],
                output: stdout
            })
        })
    })
}
Object.defineProperty(Bandizip.prototype, 'tmp', {
    get: function () {
        return path.join(this.options.temp, Math.random().toString(36).substring(2, 12) + '.bznode')
    }
})

Bandizip.prototype.info = async function (archive) {
    let tmp
    if (archive instanceof Buffer) {
        tmp = this.tmp
        await fs.writeFile(tmp, archive)
        archive = tmp
    } else if (archive instanceof Readable) {
        tmp = this.tmp
        await new Promise((resolve, reject) => {
            const write = fs.createWriteStream(tmp)
            archive.pipe(write)
            write.on('close', resolve)
            write.on('error', reject)
        })
        archive = tmp
    }
    const result = await this._spawn('l', '-list:v', archive)
    if (tmp) {
        await fs.unlink(tmp)
    }
    result.format = result.output[2].split(':')[1].trim()
    result.files = result.output.slice(5, result.output.length - 2).map(line => {
        const [date, time, attr, size, compSize, method, os, unixMode, zipFlag, extra, ...name] = line.split(/\s+/)
        return {
            date, time, attr, size, compSize, method, os, unixMode, zipFlag, extra, name: name.join(' ')
        }
    })
    const [_1, _2, size, compSize, files, _3, folders] = result.output[result.output.length - 1].split(/\s+/)
    result.size = size
    result.compSize = compSize
    result.count = {
        files, folders
    }
    return result
}
Bandizip.prototype.extract = async function (archive, output, options = {
    password: '', codepage: '65001', files: ['*']
}) {
    let tmp
    if (archive instanceof Buffer) {
        tmp = this.tmp
        await fs.writeFile(tmp, archive)
        archive = tmp
    } else if (archive instanceof Readable) {
        tmp = this.tmp
        await new Promise((resolve, reject) => {
            const write = _fs.createWriteStream(tmp)
            archive.pipe(write)
            write.on('close', resolve)
            write.on('error', reject)
        })
        archive = tmp
    }
    const result = await this._spawn('x', `-p:${options.password || ''}`, `-cp:${options.codepage || '65001'}`, `-o:${output}`, '-y', archive, ...options.files || '*')
    const errors = result.output.filter(l => l.startsWith('Error - '))
    result.success = errors.length == 0
    result.errors = errors.map(l => l.split(' (')[1]?.split(')')[0])
    if (tmp) {
        await fs.unlink(tmp)
    }
    return result
}
Bandizip.prototype.archive = async function (archive, options = {
    password: '', codepage: '65001', comment: '', format: 'zip',
    files: ['*'], sfx: path.join(__dirname, 'bz', 'bdzsfx.x86.sfx'),
    threads: 8, mode: 'c'
}, mode = 'c') {
    let tmp, format = options.format || 'zip'
    if (archive instanceof Buffer) {
        tmp = this.tmp
        await fs.writeFile(tmp, archive)
        archive = tmp
    } else if (archive instanceof Readable) {
        tmp = this.tmp
        await new Promise((resolve, reject) => {
            const write = _fs.createWriteStream(tmp)
            archive.pipe(write)
            write.on('close', resolve)
            write.on('error', reject)
        })
        archive = tmp
    } else {
        format = path.extname(archive).toLowerCase().replace('.', '')
    }
    const result = await this._spawn(mode || 'c', `-p:${options.password || ''}`, `-cp:${options.codepage || '65001'}`,
        `-cmt:${options.comment || ''}`, `-fmt:${format || 'zip'}`,
        ...(format == 'exe' ? [`-sfx:${options.sfx || path.join(__dirname, 'bz', 'bdzsfx.x86.sfx')}`] : []),
        `-t:${options.threads || 8}`, ...([`-v:${options.size}`] || []),
        '-y', archive, ...options.files || '*')
    if (tmp) {
        await fs.unlink(tmp)
    }
    return result
}
Bandizip.prototype.add = async function (archive, options) {
    return await this.archive(archive, options, 'a')
}
Bandizip.prototype.password = async function (archive, options) {
    let result
    for (const file in options.files) {
        result = await this.archive(archive, {
            ...options,
            password: options.files[file],
            files: typeof file == 'array' ? file : [file]
        }, 'a')
    }
    return result
}

module.exports = Bandizip