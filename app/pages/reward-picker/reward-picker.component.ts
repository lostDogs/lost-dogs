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

  public ngAfterViewInit(): void {
    console.log('formDom', this.formDom.nativeElement.offsetTop);
  }

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
     if (ev.target && ev.target.files && file && file.type.match('image.*')) {
        try {
          const reader = new FileReader();
          reader.onload = (event: any) => {
            const pic = event.target.result;
                console.log('file on looad!!');
            this.QrDecoder.decodeFromImage(pic, (error: any, ans: any) => {
              console.log("coooming insde the deocide form image component")
              if (error) {
                this.invalidQr = true;
                this.focusUpload = false;
                this.img = undefined;
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
    this.transObj = JSON.parse(transactionId);
    this.rewardService.getTransaction(userToken, this.transObj.transactionId).add(() => {
      this.invalidQr = this.rewardService.invalidTransactionId;
      this.transacionSucess = this.rewardService.transaction && this.rewardService.transaction.dog_id;
      this.focusUpload = false;
      if (this.transacionSucess) {
        this.dogService.getDog(this.rewardService.transaction.dog_id).add(() => {
          if (!this.dogService.dogData) {
            console.error('unable to get data');
          } else {
            this.toBeRewarded = (+this.dogService.dogData.reward * 0.80).toFixed(2);
          const formOffset: number = this.formDom.nativeElement.offsetTop - 120;
          setTimeout(() => {
            $('html, body').animate({ scrollTop: formOffset}, 500);
          }, 500);
          }
        });
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
      description: 'recompenza para Chris de transID > ' + this.transObj.transactionId      
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
        description: 'recompenza para ' + this.userService.user.name + ' de transactionID > ' + this.transObj.transactionId
      };
      this.openPay.trasnferData = undefined;
      this.openPay.transfer(this.transObj, formObj, this.userService.token).add(() => {
        if (this.openPay.trasnferData && this.openPay.trasnferData.id) {
          const self = this;
          this.dogService.deleteDog(this.dogService.dogData._id);
          console.log('this.openPay.trasnferData.id,', this.openPay.trasnferData.id);
          console.log('this.openPay.trasnferData.id,', this.openPay.trasnferData);
          console.log('this', this);
          setTimeout(() => {
            console.log('self.transSucessDom.nativeElement.offsetTop', self.transSucessDom.nativeElement.offsetTop);
            const sucessDomTop: number = self.transSucessDom.nativeElement.offsetTop - 120;
            $('html, body').animate({scrollTop: sucessDomTop}, 500);
          }, 100);
        }
      });
    }
  }

}