import {Location} from '@angular/common';
import { Component, ViewChild, ElementRef} from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router';
import {UserService} from '../../../common/services/user.service';
import {DogCardService} from '../../../common/services/dog-card.service';
import {GlobalFunctionService} from '../../../common/services/global-function.service';
import {SearchService, IdogData} from '../../../common/services/search.service';
import {MailingRewardService} from '../../../common/services/mailing-reward.service';
import * as estimationsRew from '../../../common/content/rewards-per-day.mx.json';
import * as dogSizes from '../../../common/content/sizes.json';
const imgCompress = require('@xkeshi/image-compressor');

@Component({
  selector: 'review-payment',
  template: require('./review-payment.template.html'),
  styles: [ require('./review-payment.scss')]
})
export class ReviewPaymentComponent {
  @ViewChild('DogCard')
  public dogCardDom: any;
  public lost:boolean;
  public dogIndex: string;
  public ShowSendEmail: boolean;
  public dogData: IdogData;
  public dogID: string;
  public transcationId: string;
  public reward: string;
  public rewardSetted: boolean;
  public EstimReward: string;
  public fixedReward: string;
  public dogSize: string = '';
  public totalDays: number;
  public errorImg: boolean;

  public evidenceText: JQuery;
  public evidenceNext: boolean;

  public missingFields: string[];
  public missFieldObj: Object;
  public missFieldNext: boolean;
  public createUser: boolean;
  constructor (
    public userService: UserService,
    public router: Router,
    public dogCardService: DogCardService,
    public activeRoute: ActivatedRoute,
    public globalService: GlobalFunctionService,
    public searchService: SearchService,
    public mailingService: MailingRewardService,
    public location: Location
  ) {
    this.activeRoute.queryParams.subscribe((params: Params) => {
      this.lost = params.Lt === 'true';
      this.dogIndex = params.iD;
      this.dogID = params.cID;
      this.transcationId = params.transcation;
    });
    this.missingFields = this.userService.missingReqFilds();
    this.missFieldObj = this.userService.missingFieldsToObj(this.missingFields);
  }

  public ngOnInit(): void {
    this.dogCardService.open = false;
    this.mailingService.evidence.text = localStorage.getItem('evidence-text-0');
    this.mailingService.evidence.picture = localStorage.getItem('evidence-picture-0');
    if (!this.userService.isAuth) {
      return;
    }
    if (this.dogIndex && this.searchService.results && this.searchService.results[this.dogIndex] && this.searchService.results[this.dogIndex]._id === this.dogID) {
      this.dogData = this.dogCardService.dogData = this.searchService.results[this.dogIndex];
      this.reward = this.calcEstimatedReward(this.dogData);
      this.backToBard();
    } else if (this.dogID) {
      this.dogCardService.getDog(this.dogID).add(() => {
        this.dogData = this.dogCardService.dogData;
        this.reward = this.calcEstimatedReward(this.dogData);
        this.backToBard();
      });
    } else if (this.transcationId) {
      this.mailingService.getTransaction(this.userService.token, this.transcationId).add(() => {
        this.dogCardService.getDog(this.mailingService.transaction.dog_id).add(() => {
          this.dogData = this.dogCardService.dogData;
          this.rewardSetted = +this.dogData.reward > +this.calcEstimatedReward(this.dogData);
          this.backToBard();
          if (!this.rewardSetted) {
            this.fixedReward = (+this.dogData.reward).toFixed(2);
            this.reward = this.calcEstimatedReward(this.dogData);
          }
        });
      });
    }
  }

  public backToBard(): void {
    if (this.dogData.reporter_id === this.userService.user.email) {
      this.router.navigateByUrl('/board');
      this.globalService.clearErroMessages();
      this.globalService.setErrorMEssage('El perro fue reportado por ti');
      this.globalService.openErrorModal();
    } else if (this.dogData.rewardPayed) {
      this.globalService.clearErroMessages();
      this.globalService.setErrorMEssage('El perro ya tiene una transacción en proceso');
      this.globalService.setSubErrorMessage('Espera a que termine la transacción pediente');
      this.globalService.openErrorModal();
      this.router.navigateByUrl('/board');
    }
  }

  public ngAfterViewInit(): void {
    $('.tooltipped').tooltip({delay: 50});
    $('#money-input').mask('000,000.00', {reverse: true});
    this.evidenceText = $('#evidence-text');
  }

  public next(): void {
    if (this.lost || this.transcationId) {
      this.router.navigate(['/payment/form'],  {queryParams: {Lt: this.lost, iD: this.dogIndex, cID: this.dogID, transcation: this.transcationId, rW: this.reward}});
    } else {
      this.mailingService.sendEmailsToUsers(!this.lost, this.userService.token, this.dogData._id).add(() => {
        this.ShowSendEmail = this.globalService.emailSendedReview = true;
      });
    }
     $('html, body').animate({ scrollTop: 0 }, 500);
  }

  public foucusMoney(): void {
    $('#money-input').focus();
    this.reward = this.reward === this.EstimReward ? '' : this.reward;
  }

  public clearInput(): void {
    this.reward = !this.reward ? this.EstimReward : this.reward;
  }

  public setReward(): void {
    this.rewardSetted = true;
    this.reward = typeof  this.reward === 'string' ? this.reward : this.reward + '';
    this.reward = this.reward.replace('.','').replace(',', '');
    this.reward = (this.reward.slice(0, this.reward.length - 2) + '.' + this.reward.slice(this.reward.length - 2));
  }

  public calcEstimatedReward(dog: any): string {
    //created_at
    // calculate the min amount to maintain the dog, then added a gain of 15%.
    // then add our 20 commision
    const gain: number = 1.15;
    const ourGain: number = 0.20;
    const dateApp: any = new Date(dog.created_at.split('T')[0].replace(/-/g, '/'));
    const today: any = new Date();
    const daysDiff: number = Math.round((today - dateApp) / (1000 * 60 * 60 * 24));
    const minEstRew: number = +estimationsRew[dog.size_id] * daysDiff;
    const total: any = ((minEstRew * gain) / (1 - ourGain)).toFixed(2);
    this.totalDays = daysDiff;
    this.dogSize = dogSizes[dog.size_id].name;
    return this.EstimReward = total + '';
  }

  public changeReward(): void {
    if (this.reward === this.fixedReward || !this.reward || this.reward === '') {
      this.reward = this.calcEstimatedReward(this.dogData);
    }
  }

  public filePicChange(ev: any): void {
    let file: File = ev.target.files[0];
    if (ev.target && ev.target.files && file && file.type.match('image.*')) {
      try {
        this.minifyImgFile(file).then(miniFile => {
          const reader = new FileReader();
          reader.onload = (event: any) => {
            this.mailingService.evidence.picture = event.target.result;
            this.errorImg = undefined;
          };
          reader.readAsDataURL(miniFile);
        });
      }catch (error) {
        // do nothing
      }
    } else {
      this.errorImg = true;
      console.error('not an image');
    }    
  }

  public resize(): void {
    this.evidenceText.trigger('autoresize');
    this.mailingService.evidence.text = this.evidenceText.val();
}

  public continueEvidence(): void {
    this.evidenceNext = true;
    if (this.mailingService.evidence.text) {
      localStorage.setItem('evidence-text-0', this.mailingService.evidence.text);
    }
    if (this.mailingService.evidence.picture) {
      localStorage.setItem('evidence-picture-0', this.mailingService.evidence.picture);
    }
  }

  public minifyImgFile(file: File): Promise<any> {
    return new Promise((resolve: any, reject: any) => {
      new imgCompress(file, {
        quality: .8,
        maxWidth: 650,
         success(result: any) {
          console.log('reducing file zise quality: 0.6 width: 350px', result);
          resolve(result);
         },
          error(error: any) {
            reject(error);
          }
      });
    });
  }

  public userCreatePromise(postUser: any): void {
    this.missFieldNext = undefined;
    if (postUser) {
      console.log('getting postUser', postUser);
      postUser().add(() => {
        if (this.userService.user.phoneNumber) {
          console.log('user created! ');
          this.missFieldNext = true;
        } else {
          this.missFieldNext = this.createUser = false;
          this.globalService.clearErroMessages();
          this.globalService.setErrorMEssage('No se creo bien la cuenta');
          this.globalService.openErrorModal();
        }
        setTimeout(() => {this.userService.postUser = undefined}, 500);
      });
    } else {
      this.missFieldNext = this.createUser = false;
      this.globalService.clearErroMessages();
      this.globalService.setErrorMEssage('Hubo un error al completar tus datos');
      this.globalService.openErrorModal();
    }    
  }

  public disableCreateUser(): boolean {
    return this.createUser && (typeof this.missFieldNext === 'boolean');
  }

};
