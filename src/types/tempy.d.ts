declare module "tempy" {
    interface IFileOptions {
        extension?: string;
    }

    export function file(options?: IFileOptions): string;

    export function directory(): string;

    export function directoryAsync(): Promise<string>;

    export let root: string;
}
