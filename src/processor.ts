import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import chalk from 'chalk'
import { Lame } from 'node-lame'
import pLimit from 'p-limit'
import { log } from './logger'

interface ProgressTracker {
  resolved: number
  total: number
}

// Function to convert a single WAV file to MP3
export async function convertWavToMp3(inputPath: string, outputPath: string): Promise<void> {
  const encoder = new Lame({
    output: outputPath,
    bitrate: 128, // MP3 bitrate
    quality: 2, // Higher quality (lower number is better quality)
  }).setFile(inputPath)

  try {
    log.debug({
      message: `Starting conversion: ${inputPath} -> ${outputPath}`,
      prefix: 'wav-to-mp3',
    })

    await encoder.encode()

    log.debug({
      message: `Conversion complete: ${outputPath}`,
      prefix: 'wav-to-mp3',
    })
  }
  catch (error: any) {
    log.error(error, `Encoding error for file "${inputPath}": ${error.message}`)
    throw error
  }
}

// Function to process a directory with concurrency control
export async function processDirectory(inputDir: string, outputDir?: string, concurrency: number = os.cpus().length): Promise<void> {
  const files = fs.readdirSync(inputDir).filter(file => file.endsWith('.wav'))
  if (files.length === 0) {
    log.warn({
      message: `No WAV files found in directory "${inputDir}".`,
      prefix: 'wav-to-mp3',
    })
    return
  }

  log.debug({
    message: `Processing directory: ${inputDir} with concurrency: ${concurrency}`,
    prefix: 'wav-to-mp3',
  })

  const limit = pLimit(concurrency)
  const progress: ProgressTracker = { resolved: 0, total: files.length }

  const tasks = files.map(file =>
    limit(async () => {
      log.info({
        message: `Progress: ${chalk.cyanBright(progress.resolved.toString())} resolved, ${chalk.cyanBright(progress.total - progress.resolved)} transferring, ${chalk.cyanBright(progress.total)} total`,
        prefix: 'wav-to-mp3',
      })

      const inputPath = path.join(inputDir, file)
      const outputFileName = `${path.basename(file, path.extname(file))}.mp3`
      const outputPath = outputDir
        ? path.join(outputDir, outputFileName)
        : path.join(inputDir, outputFileName)

      await convertWavToMp3(inputPath, outputPath)

      progress.resolved++
      log.info({
        message: `Progress: ${chalk.cyanBright(progress.resolved.toString())} resolved, ${chalk.cyanBright(progress.total - progress.resolved)} transferring, ${chalk.cyanBright(progress.total)} total`,
        prefix: 'wav-to-mp3',
      })
    }),
  )

  await Promise.all(tasks)

  log.info({
    message: `Finished processing directory: ${inputDir}`,
    prefix: 'wav-to-mp3',
  })
}
