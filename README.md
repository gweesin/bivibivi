# music-converter

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![bundle][bundle-src]][bundle-href]
[![JSDocs][jsdocs-src]][jsdocs-href]
[![License][license-src]][license-href]

batch convert wav files to mp3 files.

<!-- Badges -->

[npm-version-src]: https://img.shields.io/npm/v/music-converter?style=flat&colorA=080f12&colorB=1fa669
[npm-version-href]: https://npmjs.com/package/music-converter
[npm-downloads-src]: https://img.shields.io/npm/dm/music-converter?style=flat&colorA=080f12&colorB=1fa669
[npm-downloads-href]: https://npmjs.com/package/music-converter
[bundle-src]: https://img.shields.io/bundlephobia/minzip/music-converter?style=flat&colorA=080f12&colorB=1fa669&label=minzip
[bundle-href]: https://bundlephobia.com/result?p=music-converter
[license-src]: https://img.shields.io/github/license/gweesin/music-converter.svg?style=flat&colorA=080f12&colorB=1fa669
[license-href]: https://github.com/gweesin/music-converter/blob/main/LICENSE
[jsdocs-src]: https://img.shields.io/badge/jsdocs-reference-080f12?style=flat&colorA=080f12&colorB=1fa669
[jsdocs-href]: https://www.jsdocs.io/package/music-converter

# Usage Guide for `music-converter`

## Overview

`music-converter` is a command-line tool to batch convert WAV files to MP3 format. It supports converting individual files or entire directories with configurable concurrency.

## Installation

To install `music-converter`, use npm:

```sh
npm install -g music-converter
```

## Usage

### Command Line Interface

The `music-converter` tool provides a command-line interface (CLI) with the following options:

```sh
wav-to-mp3 <input> [output] [options]
```

- `<input>`: Path to the input WAV file or directory.
- `[output]`: Path to the output directory (optional). If not specified, the output files will be saved in the same directory as the input.

### Options

- `-c, --concurrency <number>`: Number of concurrent file conversions (default: number of CPU cores).

### Examples

#### Convert a Single File

To convert a single WAV file to MP3:

```sh
wav-to-mp3 /path/to/input.wav /path/to/output.mp3
```

#### Convert a Directory

To convert all WAV files in a directory to MP3:

```sh
wav-to-mp3 /path/to/input-directory /path/to/output-directory
```

#### Specify Concurrency

To convert files with a specified number of concurrent conversions:

```sh
wav-to-mp3 /path/to/input-directory /path/to/output-directory --concurrency 4
```

## Logging

The tool uses a custom logger to provide detailed information about the conversion process. Logs include messages about the start and completion of conversions, progress updates, and any errors encountered.

## License

This project is licensed under the MIT License. See the `LICENSE` file for more details.
