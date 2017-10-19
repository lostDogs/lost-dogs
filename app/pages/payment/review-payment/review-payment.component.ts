import { Component, ViewChild, ElementRef} from '@angular/core';
import {UserService} from '../../../common/services/user.service';
import {Router, ActivatedRoute, Params} from '@angular/router';
import {DogCardService} from '../../../common/services/dog-card.service';
import {GlobalFunctionService} from '../../../common/services/global-function.service'

@Component({
  selector: 'review-payment',
  template: require('./review-payment.template.html'),
  styles: [ require('./review-payment.scss')]
})
export class ReviewPaymentComponent {
  @ViewChild('DogCard')
  public dogCardDom: any;
  public lost:boolean;
  public dogId: string;
  public ShowSendEmail: boolean;
  constructor (public userService: UserService, public router: Router, public dogCardService: DogCardService, public activeRoute: ActivatedRoute, public globalService: GlobalFunctionService) {
    this.activeRoute.queryParams.subscribe((params: Params) => {
      this.lost = params.Lt === 'true';
      console.log('lost', this.lost);
      this.dogId = params.iD;
    });

  }

  public ngOnInit(): void {

  }

  public ngAfterViewInit(): void {
  }

  public next(): void {
    if (this.lost) {
      this.router.navigate(['/payment/form'],  {preserveQueryParams: true});
    } else {
      this.ShowSendEmail = this.globalService.emailSendedReview = true;
    } 
  }
};
