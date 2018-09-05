
declare module '@weex-cli/generator' {
  export interface Metadate {
    [propName: string]: any;
  }
  export interface CloneOption {
    cache: boolean;
  }
  export function generator(projectName: string, source: string, dest:string, metadata: Metadate): Promise<boolean>;
  export function clone(templateUrl: string, target?: string, option?: CloneOption): Promise<string>;
}