import { Component, ViewChild, ElementRef} from '@angular/core';
import {UserService} from '../../../common/services/user.service';
import {Router} from '@angular/router';
import {DogCardService} from '../../../common/services/dog-card.service';

@Component({
  selector: 'review-payment',
  template: require('./review-payment.template.html'),
  styles: [ require('./review-payment.scss')]
})
export class ReviewPaymentComponent {
  @ViewChild('DogCard')
  public dogCardDom: any;

  constructor (public userService: UserService, public router: Router, public dogCardService: DogCardService) {
  }

  public ngOnInit(): void {
  }

  public ngAfterViewInit(): void {
  }

  public next(): void {
    this.router.navigateByUrl('/payment/form');
  }
};
