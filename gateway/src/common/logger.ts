export class Logger {
  info(message: unknown) {
    console.log(JSON.stringify(message));
  }

  warn(message: unknown) {
    console.warn(JSON.stringify(message));
  }

  error(message: unknown) {
    console.error(JSON.stringify(message));
  }
}

export const logger = new Logger();
