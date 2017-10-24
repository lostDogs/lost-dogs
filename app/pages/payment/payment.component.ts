import {Component} from '@angular/core';
import {DomSanitizer, SafeHtml} from '@angular/platform-browser';
import {Router, NavigationEnd} from '@angular/router';
import {GlobalFunctionService} from '../../common/services/global-function.service';
import {UserService} from  '../../common/services/user.service';
require('../../common/plugins/masks.js');

@Component({
  selector: 'payment',
  template: require('./payment.template.html'),
  styles: [ require('./payment.scss')]
})

export class PaymentComponent {
  public title: string;
  constructor(public globalService: GlobalFunctionService, public router: Router, public userService: UserService) {
    this.router.events.subscribe(data => {
      if (data instanceof NavigationEnd && data.url.length) {
        const urlChildLoction = data.url.split('/')[2].split('?')[0];
        if (urlChildLoction === 'review') {
          this.title = 'Revisa';
        }else if (urlChildLoction === 'form') {
          this.title = 'Agrega tu tarjeta';
        }
      }
    });
  }
  public ngOnInit(): void {
    console.log('url', this.router.url)
    if (!this.userService.isAuth) {
      this.userService.previousUrl = this.router.url;
      this.router.navigate(['/login']);
    }
  }
}