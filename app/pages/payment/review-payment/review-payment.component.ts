import { Component, ViewChild, ElementRef} from '@angular/core';
import {UserService} from '../../../common/services/user.service';
import {Router, ActivatedRoute, Params} from '@angular/router';
import {DogCardService} from '../../../common/services/dog-card.service';
import {GlobalFunctionService} from '../../../common/services/global-function.service';
import {SearchService, IdogData} from '../../../common/services/search.service';
import {MailingRewardService} from '../../../common/services/mailing-reward.service';

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
  constructor (
    public userService: UserService,
    public router: Router,
    public dogCardService: DogCardService,
    public activeRoute: ActivatedRoute,
    public globalService: GlobalFunctionService,
    public searchService: SearchService,
    public mailingService: MailingRewardService
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
    if (this.dogIndex && this.searchService.results && this.searchService.results[this.dogIndex] && this.searchService.results[this.dogIndex]._id === this.dogID) {
      this.dogData = this.dogCardService.dogData = this.searchService.results[this.dogIndex];
    }else if (this.dogID) {
      this.dogCardService.getDog(this.dogID).add(() => {
        this.dogData = this.dogCardService.dogData;
      });
    }else if (this.transcationId) {
      this.mailingService.getTransaction(this.userService.token, this.transcationId).add(() => {
        this.dogCardService.getDog(this.mailingService.transaction.dog_id).add(() => {
          this.dogData = this.dogCardService.dogData;
        });
      });
    }
  }

  public ngAfterViewInit(): void {
    $('.tooltipped').tooltip({delay: 50});
  }

  public next(): void {
    if (this.lost) {
      this.router.navigate(['/payment/form'],  {preserveQueryParams: true});
    } else {
      this.mailingService.sendEmailsToUsers(!this.lost, this.userService.token, this.dogData._id).add(() => {
        this.ShowSendEmail = this.globalService.emailSendedReview = true;
      });
    }
     $('html, body').animate({ scrollTop: 0 }, 500);
  }
};
