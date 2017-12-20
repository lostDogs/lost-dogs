import {Component, ViewChild, ElementRef} from '@angular/core';
import {Router} from '@angular/router';
import {MailingRewardService} from '../../common/services/mailing-reward.service';
import {UserService} from '../../common/services/user.service';
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
  public startScan: boolean;
  public focusUpload: boolean;
  public mobile: boolean;
  public invalidQr: boolean;
  public transacionSucess: boolean;
  @ViewChild('RewardAprox')
  public formDom: ElementRef;

  constructor(public rewardService: MailingRewardService, public userService: UserService, public router: Router) {
    const ios: boolean = !!navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform)
    this.mobile = window.screen.width <= 767 || ios;
    if (this.mobile) {
      this.focusUpload = true;
    }
    this.QrDecoder = new QCodeDecoder();
  }

  public ngOnInit(): void {
    if (!this.userService.isAuth) {
      this.userService.previousUrl = this.router.url;
      this.router.navigate(['/login']);
    }    
  }

  public ngAfterViewInit(): void {}

  public getScanned(event: string): void {
    console.log('scanned', event);
    this.scannedValue = event;
    this.invalidQr = false;
    this.img = 'http://cdn.lostdog.mx/assets/img/temp-qrcode.jpeg';
    this.getTransaction(this.userService.token, this.scannedValue);
  }
    public getCameras(event: string): void {
    console.log('camaras', event);
    this.cameras = event;
  }
  public setFocusUpload(): void {
    if (this.invalidQr) {
      return;
    }
    this.focusUpload = true;

  }

  public unFocusUpload(): void {
      this.focusUpload = false;
      this.invalidQr = false;
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
                this.invalidQr = true;
                this.focusUpload = false;
                console.error('error decoding qr img', error);
                return;
              }
              console.log('ans', ans);
              this.scannedValue = ans;
              this.focusUpload = false;
              this.img = pic;
              this.invalidQr = false;
              this.stopScan = true;
              this.getTransaction(this.userService.token, this.scannedValue);
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

  public getTransaction(userToken: string, transactionId: string): void {
    this.rewardService.getTransaction(userToken, transactionId).add(() => {
      this.invalidQr = this.rewardService.invalidTransactionId;
      this.transacionSucess = this.rewardService.transaction && this.rewardService.transaction.dog_id;
      this.focusUpload = false;
      if (this.transacionSucess) {
        // getReward to user => procced to payment form.
        const formOffset: number = this.formDom.nativeElement.offsetTop - 120;
        setTimeout(() => {
          $('html, body').animate({ scrollTop: formOffset}, 500);
        }, 500)
      } else {
        this.scannedValue = undefined;
        this.img = undefined;
        this.startScan = JSON.parse(JSON.stringify(true));
        setTimeout(() => {
          this.startScan = false;
        }, 500);
      }
    });
  }

}