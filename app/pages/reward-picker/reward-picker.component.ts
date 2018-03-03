import {Component, ViewChild, ElementRef} from '@angular/core';
import {Router} from '@angular/router';
import {MailingRewardService} from '../../common/services/mailing-reward.service';
import {UserService} from '../../common/services/user.service';
import {DogCardService} from '../../common/services/dog-card.service';
import {OpenSpayService} from '../../common/services/openspay.service';
import {ValidationService} from '../../common/services/validation.service';
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
  public transObj: {identifier: string, transactionId: string};
  @ViewChild('RewardAprox')
  public formDom: ElementRef;
  public toBeRewarded: string;
  public rewardForm: {accountNumber: {value: string, valid: boolean}, holderName: {value: string, valid: boolean}};
  @ViewChild('TransSucess')
  public transSucessDom: ElementRef;

  constructor(public rewardService: MailingRewardService, public userService: UserService, public router: Router, public openPay: OpenSpayService, public dogService: DogCardService, public validate: ValidationService) {
    const ios: boolean = !!navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform)
    this.mobile = window.screen.width <= 767 || ios;
    this.rewardService.transaction = undefined;
    this.dogService.dogData = undefined;
    this.openPay.trasnferData = undefined;
    if (this.mobile) {
      this.focusUpload = true;
    }
    this.QrDecoder = new QCodeDecoder();
    this.rewardForm = {
      accountNumber: {value: undefined, valid: true},
      holderName: {value: undefined, valid: true}
    };
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
    this.img = 'https://www.lostdog.mx/assets/img/temp-qrcode.jpeg';
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

  public decoAndRotate(base64: File, times: number, callback?: (response: any) => any):  any {
      this.QrDecoder.decodeFromImage(base64, (error: any, ans: any) => {
        if (error) {
          if (times <= 3) {
          const newFile = this.rotateBase64img(base64, true);
           this.decoAndRotate(newFile, times++, callback);
          } else {
            console.error('error decoding img at', times);
            console.error('error >', error);
            callback(false);
          }
        }
        if (ans) {
          callback(ans);
        }
      });
  }

  public fileChange(ev: any): void {
    const file: File = ev.target.files[0];
     if (ev.target && ev.target.files && file && file.type.match('image.*')) {
        try {
          const reader = new FileReader();
          reader.onload = (event: any) => {
            const pic = event.target.result;
            console.log('file on looad!!');
            this.decoAndRotate(pic, 0, (answer: any)=>{
              if (answer) {
                this.scannedValue = answer;
                this.focusUpload = false;
                this.img = pic;
                this.invalidQr = false;
                this.stopScan = true;
                this.getTransaction(this.userService.token, this.scannedValue);
              }else {
                this.img =  undefined;
                this.invalidQr = true;
                this.focusUpload = false;
              }
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

  public rotateBase64img(base64data: any, isClockwise: boolean): any {
    const canvas = <HTMLCanvasElement>document.getElementById('img-rotation');
    const ctx: CanvasRenderingContext2D = canvas.getContext('2d');
    const img = new Image();
    img.src = base64data;
    canvas.height = img.width;
    canvas.width = img.height;
    if (isClockwise) { 
        ctx.rotate(90 * Math.PI / 180);
        ctx.translate(0, -canvas.width);
    } else {
        ctx.rotate(-90 * Math.PI / 180);
        ctx.translate(-canvas.height, 0);
    }    
    ctx.drawImage(img, 0, 0);
    return canvas.toDataURL('image/jpeg', 100);
  }

  public getTransaction(userToken: string, transactionId: string): void {
    this.transObj = JSON.parse(transactionId);
    this.rewardService.getTransaction(userToken, this.transObj.transactionId).add(() => {
      this.invalidQr = this.rewardService.invalidTransactionId;
      this.transacionSucess = this.rewardService.transaction && this.rewardService.transaction.dog_id;
      this.focusUpload = false;
      if (this.transacionSucess && this.rewardService.transaction) {
        this.toBeRewarded = (+this.rewardService.transaction.amount * 0.80).toFixed(2);
        const formOffset: number = this.formDom.nativeElement.offsetTop - 120;
        setTimeout(() => {
          $('html, body').animate({ scrollTop: formOffset}, 500);
        }, 500);
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

  public rewardMe(event: Event): void {
    event.preventDefault();
/*    const formObj = {
      bank_account: {
        clabe: '012298026516924616',
        holder_name: 'chris Tupper'
      },
      description: 'recompensa para Chris de transID > ' + this.transObj.transactionId      
    };   
    this.rewardForm.accountNumber.value && this.rewardForm.holderName.value
     */
     if (!this.rewardForm.holderName.value || !this.rewardForm.accountNumber.value) {
       this.rewardForm.accountNumber.valid = false;
       this.rewardForm.holderName.valid = false;
       return;
     }
    if (this.rewardForm.accountNumber.valid && this.rewardForm.holderName.valid) {
      const formObj = {
        bank_account: {
          clabe: this.rewardForm.accountNumber.value,
          holder_name: this.rewardForm.holderName.value
        },
        description: 'recompensa para ' + this.userService.user.name + ' de transactionID > ' + this.transObj.transactionId
      };
      this.openPay.trasnferData = undefined;
      this.openPay.transfer(this.transObj, formObj, this.userService.token).add(() => {
        if (this.openPay.trasnferData && this.openPay.trasnferData.id) {
          const self = this;
          setTimeout(() => {
            const sucessDomTop: number = self.transSucessDom.nativeElement.offsetTop - 120;
            $('html, body').animate({scrollTop: sucessDomTop}, 500);
          }, 100);
        }
      });
    }
  }

}