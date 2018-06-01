const proxyGetCommandName = "proxy|*get";

export class ProxyGetCommand {
  constructor(
    protected $logger: ILogger) {
  }

  public async execute(args: string[]): Promise<void> {
    this.$logger.out('test');
  }
}

$injector.registerCommand(proxyGetCommandName, ProxyGetCommand);
