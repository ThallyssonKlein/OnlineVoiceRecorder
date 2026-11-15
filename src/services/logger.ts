interface Logger {
  info: (message: string) => void
  warn: (message: string) => void
  error: (message: string, error: unknown) => void
}

export const logger: Logger = {
  info: message => console.info(message),
  warn: message => console.warn(message),
  error: (message, error) => console.error(message, error),
}
