import { Component, HostListener} from '@angular/core';
import {ViewEncapsulation} from '@angular/core';
import {Router, NavigationEnd, Routes} from '@angular/router';
import {GlobalFunctionService} from './common/services/global-function.service';
import {UserService} from './common/services/user.service';
import {CookieManagerService} from './common/services/cookie-manager.service';
import {FacebookService} from './common/services/facebook.service';
import 'jquery';
import 'materialize-css/dist/js/materialize.js';
import 'materialize-css/bin/materialize.css';
import 'hammerjs';
import 'hammer-timejs';

@Component({
  selector: 'my-app',
  encapsulation: ViewEncapsulation.None,
  template:  require('./app.template.html'),
  styles: [require('./main.scss')]
})
export class appComponent {
  // TODO: remove in prod only for temp access.
  public show: boolean;
  public loading: boolean;
  public errors: boolean;

  constructor (public routing: Router, public globalService: GlobalFunctionService, public cookieService: CookieManagerService, public userService: UserService, public facebookService: FacebookService) {
    this.routing.events.subscribe(data => {
      if (data instanceof NavigationEnd) {
        this.globalService.paymentRewardSucess = this.globalService.emailSendedReview = undefined;
        window.scroll(0,0);
      }
    });
  }

  @HostListener('window:beforeunload', ['$event'])
    beforeunloadHandler(event: any) {
      this.cookieService.deleteCookie(this.userService.locCookieName);
      if (this.facebookService.adSetId) {
        this.facebookService.deleteAdset(this.facebookService.adSetId);
      }
    }


  public ngOnInit(): void {}

  public ngAfterViewInit(): void {
    if (!this.facebookService.fbInitialized) {
      this.facebookService.fbInitialized = true;
      this.facebookService.fbAsyncInit();
    }
  }

  public ngOnDestroy(): void {
  }

};
