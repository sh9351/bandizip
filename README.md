[ENGLISH VERSION README](README.en.md)  
해당 패키지는 Windows 에서만 사용할 수 있어요.

# Bandizip
반디집을 이용해 쉽고 빠르게 압축 파일을 풀고 생성할 수 있어요. 그 어떠한 의존성 없이 빠르게 사용할 수 있어요.

## 설치
npm을 통해 패키지를 설치해주세요.
```shell
npm i bandizip
```
반디집(`bz.exe`)은 이 패키지에 exe 형태로 포함되어 있어요. 최신 버전의 반디집을 사용하고 싶다면 아래와 같이 반디집을 설치한 후 경로를 지정할 수 있어요.
```js
const Bandizip = require('bandizip')
const bz = Bandizip({
    bz: "C:\\Program Files\\Bandizip\\bz.exe"
})
```

## 예제
예제를 실행하려면 아래와 같이 Git을 이용해 레포지토리를 클론한 후 실행해주세요.
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

    // 압축 파일 정보
    const info = await bz.info('test/archive.zip')
    console.log(info)

    // 압축 해제
    const extract = await bz.extract('test/archive.zip', 'test/output/extract')
    console.log(extract)

    // Buffer 압축 해제
    const extract_buffer = await bz.extract(fs.readFileSync('test/archive.zip'), 'test/output/extract_buffer')
    console.log(extract_buffer)

    // Readable Stream 압축 해제
    const extract_stream = await bz.extract(fs.createReadStream('test/archive.zip'), 'test/output/extract_stream')
    console.log(extract_stream)

    // 지정한 파일만 압축 해제
    const extract_files = await bz.extract('test/archive.zip', 'test/output/extract_files', {
        files: ['Wallpapers/*']
    })
    console.log(extract_files)

    // 비밀번호로 보호된 파일 압축 해제
    const extract_password = await bz.extract('test/archive_password.zip', 'test/output/extract_password', {
        password: 'ESTSoftSucks!'
    })
    console.log(extract_password)

    // 압축 파일 생성
    const archive = await bz.archive('test/output/archive', {
        password: 'ESTSoftSucks!',
        files: ['README.md', 'index.js', 'bz/*'],
        format: 'zip', // zip, zipx, exe, tar, tgz, lzh, iso, 7z, gz, xz 지원
        comment: 'Node.js Bandizip 패키지를 이용해 생성한 압축 파일입니다',
        threads: 8
    })
    console.log(archive)

    // 압축 파일을 지정한 크기로 분할
    const archive_size = await bz.archive('test/output/archive_size.zip', {
        size: '1MB', threads: 1024, files: ['README.md', 'index.js', 'bz/*']
    })
    console.log(archive_size)

    // 압축 파일에 새로운 파일 추가
    fs.copyFileSync('test/archive.zip', 'test/output/archive_add.zip')
    const archive_add = await bz.add('test/output/archive_add.zip', {
        files: ['bz/*'],
        password: 'BandizipCLI' // 이 명령어는 bz/* 파일들에만 비밀번호를 설정해요
                                // 나머지 파일들은 비밀번호가 설정되지 않아요
    })
    console.log(archive_add)

    // 각 파일마다 다른 비밀번호 설정
    const archive_password = await bz.password('test/output/archive_password.zip', {
        files: {
            'bz/bz.exe': '',
            'bz/ark.x64.dll': 'ArkLibraryx64',
            'bz/bdzsfx.x86.sfx': 'BandizipSFX'
        },
        format: 'zip',
        comment: '각 파일마다 암호가 다르게 설정되어 있어요'
    })
    console.log(archive_password)
}
main()
```

## 참고
- [반디집 CLI 문서](https://kr.bandisoft.com/bandizip/help/parameter/)  
- [반디집 라이선스](https://www.bandisoft.com/bandizip/help/edition-comparison/) (스탠더드 에디션 상업적 이용 가능)