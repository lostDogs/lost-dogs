import { Component} from '@angular/core';
import {ViewEncapsulation} from '@angular/core';
import {Router, NavigationEnd} from '@angular/router';
import {GlobalFunctionService} from './common/services/global-function.service'
import 'jquery';
import 'materialize-css/dist/js/materialize.js';
import 'materialize-css/bin/materialize.css';
import 'hammerjs';
import 'hammer-timejs';

@Component({
  selector: 'my-app',
  encapsulation: ViewEncapsulation.None,
  template: '<general-header class="row"></general-header><global-error></global-error><router-outlet></router-outlet><general-footer></general-footer>',
  styles: [require('./main.scss')]
})
export class appComponent {
  constructor (public router: Router, public globalService: GlobalFunctionService) {
    this.router.events.subscribe(data => {
      if (data instanceof NavigationEnd) {
        this.globalService.paymentRewardSucess = this.globalService.emailSendedReview = undefined;
        window.scroll(0,0);
      }
    });
  }
};
