# bivibivi

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![bundle][bundle-src]][bundle-href]
[![JSDocs][jsdocs-src]][jsdocs-href]
[![License][license-src]][license-href]

batch convert wav files to mp3 files.

# Usage Guide for `bivibivi`

## Overview

Merge and cut video for submitting bilibili.

## Installation

To install `bivibivi`, use pnpm:

```sh
pnpm i -g bivibivi
```

## Usage

```sh
bivibivi <input> [output] [options]
```

or

```sh
pnpx bivibivi <input> [output] [options]
```

### Arguments

- `<input>`: Path to the input directory containing MP4 files
- `[output]`: Output filename (default: input directory name)

### Options

- `-s, --size <size>`: Maximum size in GB for each output part (default: 16)
- `-h, --help`: Display help information
- `-V, --version`: Display version number

### Examples

```sh
# Merge videos with default 16GB size limit
bivibivi ./videos output.mp4

# Merge videos with 1GB size limit
bivibivi ./videos output.mp4 --size 1
```

## License

This project is licensed under the MIT License. See the `LICENSE` file for more details.

<!-- Badges -->
[npm-version-src]: https://img.shields.io/npm/v/bivibivi?style=flat&colorA=080f12&colorB=1fa669
[npm-version-href]: https://npmjs.com/package/bivibivi
[npm-downloads-src]: https://img.shields.io/npm/dm/bivibivi?style=flat&colorA=080f12&colorB=1fa669
[npm-downloads-href]: https://npmjs.com/package/bivibivi
[bundle-src]: https://img.shields.io/bundlephobia/minzip/bivibivi?style=flat&colorA=080f12&colorB=1fa669&label=minzip
[bundle-href]: https://bundlephobia.com/result?p=bivibivi
[license-src]: https://img.shields.io/github/license/gweesin/bivibivi.svg?style=flat&colorA=080f12&colorB=1fa669
[license-href]: https://github.com/gweesin/bivibivi/blob/main/LICENSE
[jsdocs-src]: https://img.shields.io/badge/jsdocs-reference-080f12?style=flat&colorA=080f12&colorB=1fa669
[jsdocs-href]: https://www.jsdocs.io/package/bivibivi
