import {Component} from '@angular/core';
import {Router} from '@angular/router';
import * as instaCam from 'instascan';
// instaCam from https://github.com/schmich/instascan

@Component({
  selector: 'reward-picker',
  template: require('./reward-picker.template.html'),
  styles: [ require('./reward-picker.scss')]
})

export class RewardPickerComponent {
  public scanner: any;
  public scannedValue: string;
  constructor() {
  }
  public ngOnInit(): void {
    this.scanner = new instaCam.Scanner({ video: document.getElementById('preview')});
    this.scanner.addListener('scan',(content: any) => {
        if (content) {
          console.log(content);
          this.scannedValue = content;
          this.scanner.stop();
        }
      });
    instaCam.Camera.getCameras().then((cameras: instaCam.Camera[]) => {
        if (cameras.length > 0) {
          this.scanner.start(cameras[0]);
        } else {
          console.error('No cameras found.');
        }
      }).catch((e: any) => {
        console.error(e);
      });

  }

  public ngAfterViewInit(): void {}

}