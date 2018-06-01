import * as path from "path";
import { CommandsDelimiters, COMMANDS_NAMESPACE } from "./constants";
import { annotate } from "./helpers";

export function register(...rest: any[]) {
  return function (target: any): void {
    // TODO: Check if 'rest' has more arguments that have to be registered
    $injector.register(rest[0], target);
  };
}

export interface IDependency {
  require?: string;
  resolver?: () => any;
  instance?: any;
  shared?: boolean;
}

interface ICommandArgument { }

class Xot {
  public overrideAlreadyRequiredModule: boolean = false;
  private modules: {
    [name: string]: IDependency;
  } = {};
  private hierarchicalCommands: IDictionary<string[]> = {};
  private resolutionProgress: any = {};
  constructor() {
    this.register("injector", this);
  }

  public register(name: string, resolver: any, shared?: boolean): void {
    shared = shared === undefined ? true : shared;

    const dependency: any = this.modules[name] || {};
    dependency.shared = shared;

    if (_.isFunction(resolver)) {
      dependency.resolver = resolver;
    } else {
      dependency.instance = resolver;
    }

    this.modules[name] = dependency;
  }
  public registerCommand(names: any, resolver: any): void {
    this.forEachName(names, (name) => {
      const commands = name.split(CommandsDelimiters.HierarchicalCommand);
      this.register(this.createCommandName(name), resolver);

      if (commands.length > 1) {
        this.createHierarchicalCommand(commands[0]);
      }
    });
  }
  public require(names: any, file: string): void {
    this.forEachName(names, (name) => this.requireOne(name, file));
  }
  public requireCommand(names: any, file: string): void {
    this.forEachName(names, (commandName) => {
      const commands = commandName.split(CommandsDelimiters.HierarchicalCommand);

      if (commands.length > 1) {
        if (_.startsWith(commands[1], '*') && this.modules[this.createCommandName(commands[0])]) {
          throw new Error("Default commands should be required before child commands");
        }

        const parentCommandName = commands[0];

        if (!this.hierarchicalCommands[parentCommandName]) {
          this.hierarchicalCommands[parentCommandName] = [];
        }

        this.hierarchicalCommands[parentCommandName].push(_.tail(commands).join(CommandsDelimiters.HierarchicalCommand));
      }

      if (commands.length > 1 && !this.modules[this.createCommandName(commands[0])]) {
        this.require(this.createCommandName(commands[0]), file);
        if (commands[1] && !commandName.match(/\|\*/)) {
          this.require(this.createCommandName(commandName), file);
        }
      } else {
        this.require(this.createCommandName(commandName), file);
      }
    });
  }
  public buildHierarchicalCommand(parentCommandName: string, commandLineArguments: string[]): any {
    const subCommands = this.hierarchicalCommands[parentCommandName];
    let currentSubCommandName: string;
    let finalSubCommandName: string = '';
    let remainingArguments = commandLineArguments;
    let finalRemainingArguments = commandLineArguments;
    _.each(commandLineArguments, arg => {
      arg = arg.toLowerCase();
      currentSubCommandName = currentSubCommandName ? this.getHierarchicalCommandName(currentSubCommandName, arg) : arg;
      remainingArguments = _.tail(remainingArguments);
      const matchingSubCommandName = _.find(subCommands, sc => sc === currentSubCommandName || sc === `${CommandsDelimiters.DefaultCommandSymbol}${currentSubCommandName}`);
      if (matchingSubCommandName) {
        finalSubCommandName = matchingSubCommandName;
        finalRemainingArguments = remainingArguments;
      }
    });

    if (!finalSubCommandName) {
      finalSubCommandName = this.getDefaultCommand(parentCommandName, commandLineArguments) || "";
      finalRemainingArguments = _.difference(commandLineArguments, finalSubCommandName
        .split(CommandsDelimiters.HierarchicalCommand)
        .map(command => _.startsWith(command, CommandsDelimiters.DefaultCommandSymbol) ? command.substr(1) : command));

    }

    if (finalSubCommandName) {
      return { commandName: this.getHierarchicalCommandName(parentCommandName, finalSubCommandName), remainingArguments: finalRemainingArguments };
    }

  }

  public resolveCommand(name: string): any {
    let command: any;
    const commandModuleName = this.createCommandName(name);
    if (!this.modules[commandModuleName]) {
      return null;
    }
    command = this.resolve(commandModuleName);

    return command;
  }

  public resolve(param: any, ctorArguments?: IDictionary<any>): any {
    if (_.isFunction(param)) {
      return this.resolveConstructor(<Function>param, ctorArguments);
    } else {
      return this.resolveByName(<string>param, ctorArguments);
    }
  }
  private resolveByName(name: string, ctorArguments?: IDictionary<any>): any {
    if (name[0] === "$") {
      name = name.substr(1);
    }

    if (this.resolutionProgress[name]) {
      throw new Error(`Cyclic dependency detected on dependency '${name}'`);
    }
    this.resolutionProgress[name] = true;

    // trace("resolving '%s'", name);

    let dependency: IDependency;
    try {
      dependency = this.resolveDependency(name);
      if (name === '$logger') {
        console.log(dependency);
      }
      if (!dependency) {
        throw new Error("unable to resolve " + name);
      }

      if (!dependency.instance || !dependency.shared) {
        if (!dependency.resolver) {
          throw new Error("no resolver registered for " + name);
        }
        if (name === '$logger') {
          console.log(dependency.resolver, ctorArguments);
        }
        dependency.instance = this.resolveConstructor(dependency.resolver, ctorArguments);
      }
    } finally {
      delete this.resolutionProgress[name];
    }

    return dependency.instance;
  }

  private resolveDependency(name: string): IDependency {
    const module = this.modules[name];
    if (!module) {
      throw new Error("unable to resolve " + name);
    }

    if (module.require) {
      require(module.require);
    }
    return module;
  }

  private resolveConstructor(ctor: Function, ctorArguments?: { [key: string]: any }): any {
    annotate(ctor);

    const resolvedArgs = ctor.$inject.args.map(paramName => {
      if (ctorArguments && ctorArguments.hasOwnProperty(paramName)) {
        return ctorArguments[paramName];
      } else {
        return this.resolve(paramName);
      }
    });

    const name = ctor.$inject.name;
    if (name && name[0] === name[0].toUpperCase()) {
      return new (<any>ctor)(...resolvedArgs);
    } else {
      return ctor.apply(null, resolvedArgs);
    }
  }
  private getHierarchicalCommandName(parentCommandName: string, subCommandName: string) {
    return [parentCommandName, subCommandName].join(CommandsDelimiters.HierarchicalCommand);
  }
  private getDefaultCommand(name: string, commandArguments: string[]) {
    const subCommands = this.hierarchicalCommands[name];
    const defaultCommand = _.find(subCommands, command => _.some(command.split(CommandsDelimiters.HierarchicalCommand), c => _.startsWith(c, CommandsDelimiters.DefaultCommandSymbol)));

    return defaultCommand;
  }
  private createHierarchicalCommand(name: string) {
    const factory = () => {
      return {
        disableAnalytics: true,
        isHierarchicalCommand: true,
        execute: async (args: string[]): Promise<void> => {
          const commandsService = $injector.resolve("commandsService");
          let commandName: string | null = null;
          const defaultCommand = this.getDefaultCommand(name, args);
          let commandArguments: ICommandArgument[] = [];

          if (args.length > 0) {
            const hierarchicalCommand = this.buildHierarchicalCommand(name, args);
            if (hierarchicalCommand) {
              commandName = hierarchicalCommand.commandName;
              commandArguments = hierarchicalCommand.remainingArguments;
            } else {
              commandName = defaultCommand ? this.getHierarchicalCommandName(name, defaultCommand) : "help";
              // If we'll execute the default command, but it's full name had been written by the user
              // for example "appbuilder cloud list", we have to remove the "list" option from the arguments that we'll pass to the command.
              if (_.includes(this.hierarchicalCommands[name], CommandsDelimiters.DefaultCommandSymbol + args[0])) {
                commandArguments = _.tail(args);
              } else {
                commandArguments = args;
              }
            }
          } else {
            //Execute only default command without arguments
            if (defaultCommand) {
              commandName = this.getHierarchicalCommandName(name, defaultCommand);
            } else {
              commandName = "help";

              // Show command-line help
              const options = this.resolve("options");
              options.help = true;
            }
          }

          await commandsService.tryExecuteCommand(commandName, commandName === "help" ? [name] : commandArguments);
        }
      };
    };

    $injector.registerCommand(name, factory);
  }
  private createCommandName(name: string) {
    return `${COMMANDS_NAMESPACE}.${name}`;
  }

  private forEachName(names: any, action: (name: string) => void): void {
    if (_.isString(names)) {
      action(names);
    } else {
      names.forEach(action);
    }
  }

  private requireOne(name: string, file: string): void {
    const relativePath = path.join("../", file);
    const dependency: IDependency = {
      require: require("fs").existsSync(path.join(__dirname, relativePath + ".js")) ? relativePath : file,
      shared: true
    };

    if (!this.modules[name] || this.overrideAlreadyRequiredModule) {
      this.modules[name] = dependency;
    } else {
      throw new Error(`module '${name}' require'd twice.`);
    }
  }
}

export let injector = new Xot();
