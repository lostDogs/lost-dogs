import {Component, EventEmitter, Output, Input, SimpleChanges} from '@angular/core';
import * as instaCam from 'instascan';
// instaCam from https://github.com/schmich/instascan

@Component({
  selector: 'qr-scanner',
  template: require('./qr-scanner.template.html'),
  styles: [ require('./qr-scanner.scss')]
})

export class QrScannerComponent { 
  public scanner: any;
  @Output()
  public scannedValue: EventEmitter<any> = new EventEmitter<any>();
  @Output()
  public cameras: EventEmitter<string> = new EventEmitter<string>();
  @Input()
  public stopScan: boolean;

  constructor() {}
  public ngOnInit(): void {
    this.scanner = new instaCam.Scanner({ video: document.getElementById('preview')});
    this.scanner.addListener('scan', (content: any) => {
        if (content) {
          this.scannedValue.emit(content);
          this.scanner.stop();
        }
      });
    instaCam.Camera.getCameras().then((cameras: any[]) => {
        if (cameras.length > 0) {
          console.log('cameras', cameras);
          this.scanner.start(cameras[0]);
          this.cameras.emit(JSON.stringify(cameras));
        } else {
          console.error('No cameras found.');
        }
      }).catch((e: any) => {
        console.error(e);
      });
  }
  public ngAfterViewInit(): void {}

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes.stopScan && changes.stopScan.currentValue) {
      this.scanner.stop();
    }
  }
}
