#!/usr/bin/env esno

import path from 'node:path'
import process from 'node:process'
import { Command } from 'commander'
import { execa } from 'execa'
import fse from 'fs-extra'

const program = new Command()

program
  .name('bivibivi')
  .description('Merge and cut video for submitting bilibili')
  .version('1.0.0')
  .argument('<input>', 'Input mp4 directory path')
  .argument('[output]', 'Output file path (default: output.mp4)')
  .action(async (input: string, output: string | undefined) => {
    if (!await fse.pathExists(input)) {
      console.error(new Error(`Input path "${input}" does not exist.`))
      process.exit(1)
    }

    const inputStat = await fse.stat(input)

    if (!output) {
      output = path.basename(input)
    }

    try {
      if (inputStat.isDirectory()) {
        const files = (await fse.readdir(input))
          .filter(file => path.extname(file).toLowerCase() === '.mp4')
          .map(file => path.join(input, file))

        let currentFileList: string[] = []
        let currentSize = 0
        let partIndex = 1

        for (const file of files) {
          const stats = await fse.stat(file)
          const fileSizeInBytes = stats.size
          const fileSizeInGB = fileSizeInBytes / (1024 * 1024 * 1024)

          if (currentSize + fileSizeInGB > 16) {
            const fileListPath = path.join(input, `filelist_part${partIndex}.txt`)
            const fileListContent = currentFileList.map(f => `file '${f}'`).join('\n')
            await fse.writeFile(fileListPath, fileListContent)

            const outputFilePath = path.join(input, `${output}_part${partIndex}.mp4`)
            await execa('ffmpeg', ['-f', 'concat', '-safe', '0', '-i', fileListPath, '-c', 'copy', outputFilePath], { stdio: 'inherit' })

            console.log(`Merged video part ${partIndex} saved to ${outputFilePath}`)

            await fse.remove(fileListPath)
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
          await fse.writeFile(fileListPath, fileListContent)

          const outputFilePath = path.join(input, `${output}_part${partIndex}.mp4`)
          await execa('ffmpeg', ['-f', 'concat', '-safe', '0', '-i', fileListPath, '-c', 'copy', outputFilePath], { stdio: 'inherit' })

          console.log(`Merged video part ${partIndex} saved to ${outputFilePath}`)

          await fse.remove(fileListPath)
        }
      }
    }
    catch (error: any) {
      console.error(error, `General error while processing input: ${error.message}`)
    }
  })

program.parse()
