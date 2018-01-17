import { Component} from '@angular/core';
import {ViewEncapsulation} from '@angular/core';
import {Router, NavigationEnd, Routes} from '@angular/router';
import {GlobalFunctionService} from './common/services/global-function.service';
import {ApiService} from './common/services/api.service';
import {CookieManagerService} from './common/services/cookie-manager.service';
import {resetConfing} from './app.router';
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

  constructor (public routing: Router, public globalService: GlobalFunctionService, public api: ApiService, public cookieService: CookieManagerService) {
    this.routing.events.subscribe(data => {
      if (data instanceof NavigationEnd) {
        this.globalService.paymentRewardSucess = this.globalService.emailSendedReview = undefined;
        window.scroll(0,0);
      }
    });
  }

  // TODO: remove in prod only for temp access.
  public ngOnInit(): void {
    const prevAccess: boolean = this.cookieService.getCookie('appAccesss');
    if (prevAccess) {
      this.show = true;
      window.scroll(0,0);
      setTimeout(()=> {
      resetConfing(this.routing);
      this.routing.navigateByUrl('/home');
      }, 20);
    }
  }
// TODO: remove in prod only for temp access.
  public showApp(username: string, password: string): void {  
    const user = {password: password, username: username};
    this.loading = true;
    this.api.post('https://fierce-falls-25549.herokuapp.com/api/users/login', user).subscribe(
      data => { 
        if (data['name'] || data['username']) {
          this.show = true;
          this.loading = false;
          this.errors = false;
          window.scroll(0,0);
          this.cookieService.setCookie('appAccesss', true);
          setTimeout(()=> {
          resetConfing(this.routing);
          this.routing.navigateByUrl('/home');
          }, 20);
        } else {
        this.show = false;
        this.loading = false;
        this.errors = true;          
        }
      },
      error => {
        this.show = false;
        this.loading = false;
        this.errors = true;
      });
  }
};
