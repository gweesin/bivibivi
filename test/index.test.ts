import path from 'node:path'
import ffmpegPath from 'ffmpeg-static'
import ffmpeg from 'fluent-ffmpeg'
import fse from 'fs-extra'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { program } from '../src/cli'

ffmpeg.setFfmpegPath(ffmpegPath!)

describe('bivibivi CLI', () => {
  const testDir = 'test-videos'
  const testVideos = ['video1.mp4', 'video2.mp4', 'video3.mp4']

  beforeEach(async () => {
    await fse.ensureDir(testDir)
    for (const video of testVideos) {
      const videoPath = path.join(testDir, video)

      await new Promise((resolve, reject) => {
        ffmpeg()
          .input('color=c=black:s=320x240:d=1') // 1-second black video
          .output(videoPath)
          .on('end', resolve)
          .on('error', reject)
          .run()
      })
    }
  })

  // afterEach(async () => {
  //   await fse.remove(testDir)
  // })

  it('should merge videos under size threshold', async () => {
    const output = 'output.mp4'
    const sizeThreshold = '1'

    // Mock file sizes to be small
    const statSpy = vi.spyOn(fse, 'stat').mockImplementation((file) => {
      return Promise.resolve({
        size: 100 * 1024 * 1024, // 100MB
        isDirectory: () => path.basename(file.toString()) === testDir,
      })
    })

    try {
      await program.parseAsync([
        'esno',
        '../src/cli.ts',
        testDir,
        output,
        '--size',
        sizeThreshold,
      ])

      const outputFile = path.join(testDir, `${output}_part1.mp4`)
      expect(await fse.pathExists(outputFile)).toBe(true)
    }
    finally {
      statSpy.mockRestore()
    }
  })

  it('should split videos exceeding size threshold', async () => {
    const output = 'output.mp4'
    const sizeThreshold = '0.1' // Small threshold to force splitting

    // Mock file sizes to be large
    const originalStat = fse.stat

    // @ts-expect-error Mocking fse.stat with vi.fn() causes type mismatch with original implementation
    fse.stat = vi.fn().mockImplementation((file) => {
      return Promise.resolve({
        size: 1024 * 1024 * 1024, // 1GB
        isDirectory: () => path.basename(file.toString()) === testDir,
      })
    })

    try {
      await program.parseAsync([
        'node',
        'bivibivi',
        testDir,
        output,
        '--size',
        sizeThreshold,
      ])

      expect(await fse.pathExists(path.join(testDir, `${output}_part1.mp4`))).toBe(true)
      expect(await fse.pathExists(path.join(testDir, `${output}_part2.mp4`))).toBe(true)
    }
    finally {
      // @ts-expect-error Restoring mocked fse.stat causes type mismatch with original implementation
      fse.stat = originalStat
    }
  })
  // @ts-expect-error Restoring mocked fse.stat causes type mismatch with original implementation
  fse.stat = originalStat
})
