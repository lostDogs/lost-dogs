import { Component, ViewChild, ElementRef} from '@angular/core';
import {UserService} from '../../../common/services/user.service';
import {Router, ActivatedRoute, Params} from '@angular/router';
import {DogCardService} from '../../../common/services/dog-card.service';
import {GlobalFunctionService} from '../../../common/services/global-function.service';
import {SearchService} from '../../../common/services/search.service';

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
  public dogData: any;
  public dogID: string;
  constructor (
    public userService: UserService,
    public router: Router,
    public dogCardService: DogCardService,
    public activeRoute: ActivatedRoute,
    public globalService: GlobalFunctionService,
    public searchService: SearchService
  ) {
    this.activeRoute.queryParams.subscribe((params: Params) => {
      this.lost = params.Lt === 'true';
      this.dogIndex = params.iD;
      this.dogID = params.cID;
    });

  }

  public ngOnInit(): void {
    if (this.dogIndex && this.searchService.results && this.searchService.results[this.dogIndex]) {
      this.dogData = this.searchService.results[this.dogIndex];
    }else {
      this.dogCardService.getDog(this.dogID).add(() => {
        this.dogData = this.dogCardService.dogData;
      });
    }
    console.log('dogdata', this.dogData);
  }

  public ngAfterViewInit(): void {
    $('.tooltipped').tooltip({delay: 50});
  }

  public next(): void {
    if (this.lost) {
      this.router.navigate(['/payment/form'],  {preserveQueryParams: true});
    } else {
      this.ShowSendEmail = this.globalService.emailSendedReview = true;
    } 
  }
};
