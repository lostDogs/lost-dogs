import {Component} from '@angular/core';
import {DomSanitizer, SafeHtml} from '@angular/platform-browser';
import {Router, NavigationEnd} from '@angular/router';
import {GlobalFunctionService} from '../../common/services/global-function.service';
require('../../common/plugins/masks.js');

@Component({
  selector: 'payment',
  template: require('./payment.template.html'),
  styles: [ require('./payment.scss')]
})

export class PaymentComponent {
  public title: string = 'Payment';
  constructor(public globalService: GlobalFunctionService, public router: Router) {
  this.router.events.subscribe(data => {
    if (data instanceof NavigationEnd) {
      const urlChildLoction = data.url.split('/')[2];
      if (urlChildLoction === 'review') {
        this.title = 'Revisa';
      }else if (urlChildLoction === 'form') {
        this.title = 'Agrega tu tarjeta';
      }
    }
  });
  }
}