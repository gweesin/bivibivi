import { logger, streamParser } from '@pnpm/logger'

// Automatically setup terminal logger on import
function setupTerminalLogger(): void {
  streamParser.on('data', (log: any) => {
    const output = `[${log.level.toUpperCase()}] [${log.name}] ${log.message}`
    // eslint-disable-next-line ts/ban-ts-comment
    // @ts-expect-error
    // eslint-disable-next-line no-console
    console[log.level] ? console[log.level](output) : console.log(output)
  })
}

// Initialize logger
setupTerminalLogger()

// Export the logger instance
export const log = logger('wav-to-mp3')
