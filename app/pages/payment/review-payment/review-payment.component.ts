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
  public dogSize: string = '';
  public totalDays: number;
  public fixedReward: string;

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

  }

  public ngOnInit(): void {
    this.dogCardService.open = false;
    if (!this.userService.isAuth) {
      return;
    }
    console.log('calling on Init');
    if (this.dogIndex && this.searchService.results && this.searchService.results[this.dogIndex] && this.searchService.results[this.dogIndex]._id === this.dogID) {
      this.dogData = this.dogCardService.dogData = this.searchService.results[this.dogIndex];
      this.reward = this.calcEstimatedReward(this.dogData);
    }else if (this.dogID) {
      this.dogCardService.getDog(this.dogID).add(() => {
        this.dogData = this.dogCardService.dogData;
        this.reward = this.calcEstimatedReward(this.dogData);
      });
    }else if (this.transcationId) {
      this.mailingService.getTransaction(this.userService.token, this.transcationId).add(() => {
        this.dogCardService.getDog(this.mailingService.transaction.dog_id).add(() => {
          this.dogData = this.dogCardService.dogData;
          this.rewardSetted = +this.dogData.reward > +this.calcEstimatedReward(this.dogData);
          if (!this.rewardSetted) {
            this.fixedReward = this.dogData.reward;
            this.reward = this.calcEstimatedReward(this.dogData);
          }
        });
      });
    }
  }

  public ngAfterViewInit(): void {
    $('.tooltipped').tooltip({delay: 50});
    $('#money-input').mask('000,000.00', {reverse: true});


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
    this.reward =this.reward.slice(0, this.reward.length - 2) + '.' + this.reward.slice(this.reward.length - 2);
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
};
