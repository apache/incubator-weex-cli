declare module "log4js" {
	interface ILogger {
		fatal(...args: string[]): void;
		error(...args: string[]): void;
		warn(...args: string[]): void;
		info(...args: string[]): void;
		debug(...args: string[]): void;
		trace(...args: string[]): void;

		setLevel(level: string): void;
		level: any;
	}

	interface IConfiguration {
		appenders: {
			[key:string]:any
		};
		categories: {
			[key:string]:any
		}
	}

	interface IAppender {
		type: string;
		layout: ILayout;
	}

	interface ILayout {
		type: string;
	}

	function configure(conf: IConfiguration): void;
	function getLogger(categoryName?: string): ILogger;

	export class Level {
		isEqualTo(level: any): boolean;
		isLessThanOrEqualTo(level: any): boolean;
		isGreaterThanOrEqualTo(level: any): boolean;
	}

	export namespace levels {
		var ALL: Level;
		var TRACE: Level;
		var DEBUG: Level;
		var INFO: Level;
		var WARN: Level;
		var ERROR: Level;
		var FATAL: Level;
		var MARK: Level;
		var OFF: Level;
	}
}
