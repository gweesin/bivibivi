#!/usr/bin/env esno

import { execSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { Command } from 'commander'
import { log } from './logger'

const program = new Command()

program
  .name('bivibivi')
  .description('Merge and cut video for submitting bilibili')
  .version('1.0.0')
  .argument('<input>', 'Input mp4 directory path')
  .argument('[output]', 'Output file path (default: output.mp4)')
  .action(async (input: string, output: string | undefined) => {
    if (!fs.existsSync(input)) {
      log.error(new Error(`Input path "${input}" does not exist.`))
      process.exit(1)
    }

    const inputStat = fs.statSync(input)

    if (!output) {
      output = path.basename(input)
    }

    try {
      if (inputStat.isDirectory()) {
        const files = fs.readdirSync(input)
          .filter(file => path.extname(file).toLowerCase() === '.mp4')
          .map(file => path.join(input, file))

        let currentFileList: string[] = []
        let currentSize = 0
        let partIndex = 1

        for (const file of files) {
          const stats = fs.statSync(file)
          const fileSizeInBytes = stats.size
          const fileSizeInGB = fileSizeInBytes / (1024 * 1024 * 1024)

          if (currentSize + fileSizeInGB > 16) {
            const fileListPath = path.join(input, `filelist_part${partIndex}.txt`)
            const fileListContent = currentFileList.map(f => `file '${f}'`).join('\n')
            fs.writeFileSync(fileListPath, fileListContent)

            const outputFilePath = path.join(input, `${output}_part${partIndex}.mp4`)
            execSync(`ffmpeg -f concat -safe 0 -i ${fileListPath} -c copy ${outputFilePath}`, { stdio: 'inherit' })

            log.info({ prefix: 'bivibivi', message: `Merged video part ${partIndex} saved to ${outputFilePath}` })

            fs.unlinkSync(fileListPath)
            currentFileList = []
            currentSize = 0
            partIndex++
          }

          currentFileList.push(file)
          currentSize += fileSizeInGB
        }

        if (currentFileList.length > 0) {
          const fileListPath = path.join(input, `filelist_part${partIndex}.txt`)
          const fileListContent = currentFileList.map(f => `file '${f}'`).join('\n')
          fs.writeFileSync(fileListPath, fileListContent)

          const outputFilePath = path.join(input, `${output}_part${partIndex}.mp4`)
          execSync(`ffmpeg -f concat -safe 0 -i ${fileListPath} -c copy ${outputFilePath}`, { stdio: 'inherit' })

          log.info({ prefix: 'bivibivi', message: `Merged video part ${partIndex} saved to ${outputFilePath}` })

          fs.unlinkSync(fileListPath)
        }
      }
    }
    catch (error: any) {
      log.error(error, `General error while processing input: ${error.message}`)
    }
  })

program.parse()
