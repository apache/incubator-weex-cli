import * as log4js from "log4js";
import * as util from "util";

const chalk = require("chalk");

export class Logger implements ILogger {

  private log4jsLogger: log4js.ILogger;
  private static LABEL = "[WARNING]:";

  constructor() {
    log4js.configure({
      appenders: { out: {
        type: 'stdout',
        // type: 'file', filename: 'out.log',
        layout: {
          // type: 'pattern',
          // pattern: '%d{hh:mm:ss}: [%p] %m',
          type: 'messagePassThrough'
        }
      } },
      categories: { default: { appenders: ['out'], level: 'debug' } }
    });
    this.log4jsLogger = log4js.getLogger('WEEX_CLI');
    this.log4jsLogger.level = 'debug';
  }

  setLevel(level: string) {
    this.log4jsLogger.level = level;
  }
  getLevel() {
    return this.log4jsLogger.level.toString();
  }
  fatal(...args: any[]) {
    this.log4jsLogger.fatal(util.format.apply(util, args));
  }
  error(...args: any[]) {
    const message = util.format.apply(util, args);
    const colorizedMessage = chalk.red(message);
    this.log4jsLogger.error(colorizedMessage);
  }
  warn(...args: any[]) {
    const message = util.format.apply(util, args);
    const colorizedMessage = chalk.yellow(message);
    this.log4jsLogger.warn(colorizedMessage);
  }
  warnWithLabel(...args: any[]) {
    const message = util.format.apply(util, args);
    this.warn(`${Logger.LABEL} ${message}`);
  }
  info(...args: any[]) {
    this.log4jsLogger.info(util.format.apply(util, args));
  }
  debug(...args: any[]) {
    this.log4jsLogger.debug(util.format.apply(util, args));
  }

  out(...args: any[]) {
    console.log(util.format.apply(null, args));
  }
  write(...args: any[]) {
    process.stdout.write(util.format.apply(null, args));
  }

  public printInfoMessageOnSameLine(message: string): void {
    this.write(message);
  }

  public printMsgWithTimeout(message: string, timeout: number) {
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        this.printInfoMessageOnSameLine(message);
        resolve();
      }, timeout);
    });
  }
}

$injector.register("logger", Logger);
