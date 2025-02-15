#!/usr/bin/env esno

import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import process from 'node:process'
import { Command } from 'commander'
import { log } from './logger'
import { convertWavToMp3, processDirectory } from './processor'

const program = new Command()

program
  .name('wav-to-mp3')
  .description('Convert WAV files or directories to MP3 format')
  .version('1.0.0')
  .argument('<input>', 'Input WAV file or directory path')
  .argument('[output]', 'Output directory path (default: same directory as input)')
  .option('-c, --concurrency <number>', 'Number of concurrent file conversions', value => Number.parseInt(value, 10), os.cpus().length)
  .action(async (input: string, output: string | undefined, options: { concurrency: number }) => {
    const { concurrency } = options

    if (!fs.existsSync(input)) {
      log.error(new Error(`Input path "${input}" does not exist.`))
      process.exit(1)
    }

    const inputStat = fs.statSync(input)

    try {
      if (inputStat.isDirectory()) {
        await processDirectory(input, output, concurrency)
      }
      else {
        const resolvedOutput = output ?? path.join(path.dirname(input), `${path.basename(input, path.extname(input))}.mp3`)
        await convertWavToMp3(input, resolvedOutput)
      }
    }
    catch (error: any) {
      log.error(error, `General error while processing input: ${error.message}`)
    }
  })

program.parse()
