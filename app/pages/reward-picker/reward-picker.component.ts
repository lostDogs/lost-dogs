import {Component} from '@angular/core';
import {Router} from '@angular/router';
const QCodeDecoder = require('../../common/vendor/qr-img-decoder.js');

@Component({
  selector: 'reward-picker',
  template: require('./reward-picker.template.html'),
  styles: [ require('./reward-picker.scss')]
})

export class RewardPickerComponent {
  public scannedValue: string;
  public cameras: string;
  public QrDecoder: {decodeFromImage?: (img: File, callback: (err: any, res: any) => any) => void};
  public img: any;
  public stopScan: boolean; 
  public focusUpload: boolean;
  public mobile: boolean;

  constructor() {
    const ios: boolean = !!navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform)
    this.mobile = window.screen.width <= 767 || ios;
    if (this.mobile) {
      this.focusUpload = true;
    }
    this.QrDecoder = new QCodeDecoder();
  }

  public ngOnInit(): void {
  }

  public ngAfterViewInit(): void {}

  public getScanned(event: string): void {
    console.log('scanned', event);
    this.scannedValue = event;
    this.img = 'http://cdn.lostdog.mx/assets/img/temp-qrcode.jpeg';
  }
    public getCameras(event: string): void {
    console.log('camaras', event);
    this.cameras = event;
  }
  public setFocusUpload(): void {
    this.focusUpload = true;
  }

  public unFocusUpload(): void {
      this.focusUpload = false;
  }

  public fileChange(ev: any): void {
    const file: File = ev.target.files[0];
    console.log('file change!!', file);
     if (ev.target && ev.target.files && file && file.type.match('image.*')) {
        try {
          const reader = new FileReader();
          reader.onload = (event: any) => {
            const pic = event.target.result;
            this.QrDecoder.decodeFromImage(pic, (error: any, ans: any) => {
              if (error) {
                console.error('error decoding qr img', error);
                return;
              }
              console.log('ans', ans);
              this.scannedValue = ans;
              this.img = pic;
              this.focusUpload = false;
              this.stopScan = true;
            });
          };
          reader.readAsDataURL(file);
        }catch (error) {
          // do nothing
        }
      } else {
        console.error('not an image');
      }    
  }

}