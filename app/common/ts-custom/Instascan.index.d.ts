//  Type definitions for Instascan module
// Definitions by: Chris Zepeda <https://github.com/ChrisZeag1>
// rename to -> index.d.ts

declare namespace Instascan {
  export class Scanner {
    constructor(opts?: {continuous?: boolean, video?: HTMLElement, mirror?: boolean, captureImage?: boolean, backgroundScan?: boolean, refractoryPeriod?: number, scanPeriod?: number});
    scan(): void;
    stop(): void;
    start(n?: any): void;
    addListener(type: string, callback: (content?: any, image?: any) => any): any;
  }
  export class Camera {
    constructor(id?: string, name?: string);
    start(): void;
    stop(): void;
    static getCameras(): any;
  }
}
export = Instascan;
