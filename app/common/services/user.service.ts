import { Injectable } from '@angular/core';
import {ApiService} from './api.service';
import {Router} from '@angular/router';
import {GlobalFunctionService} from './global-function.service';

@Injectable()
export class UserService {
  public isAuth: boolean;
  public isAvatarSet: boolean;
  public user: any;
  public userCookieName: string = 'user';
  public loading: boolean;
  public errors: {passwordReq: boolean, userReq: boolean, invalidUser: boolean};

  constructor (public api: ApiService, public router: Router, public globalService: GlobalFunctionService) {
    this.user = {};
    this.errors = {passwordReq: false, userReq: false, invalidUser: false};
    const userCookie: any = this.getCookie(this.userCookieName);
    if (userCookie) {
      this.user = userCookie;
      this.isAuth = true;
      this.isAvatarSet = true;
    }
  }

  public setUser(response: any): void {
    console.log('user >>>>', response);
    this.user.name = response.name || response.username;
    this.user.lastName = response.surname;
    this.user.avatar = response.avatar_url;
    this.user.email = response.email;
    this.isAuth = true;
    this.setCookie(this.userCookieName, this.user);
  }

    public getUserLocation(): Promise<any> {
      return new Promise((resolve, reject) => {
          let errorMessage: string;
            if (navigator.geolocation) {
              navigator.geolocation.getCurrentPosition(
                (sucess) => {
                  errorMessage = undefined;
                  this.user.location = {lat: sucess.coords.latitude , lng: sucess.coords.longitude};
                  resolve(this.user.location);
              }, (error) => {
                switch(error.code) {
                  case error.PERMISSION_DENIED:
                    errorMessage = 'User denied the request for Geolocation.';
                    break;
                  case error.POSITION_UNAVAILABLE:
                    errorMessage = 'Location information is unavailable.';
                    break;
                  case error.TIMEOUT:
                    errorMessage = 'The request to get user location timed out.';
                    break;
                  case error['UNKNOWN_ERROR']:
                    errorMessage = 'An unknown error occurred.';
                    break;
                }
                this.openErrorModal(errorMessage);
                reject(undefined);
              });
          } else {
              errorMessage = 'Geolocation is not supported by this browser.';
              this.openErrorModal(errorMessage);
              reject(undefined);
          }        
      })
  }

  public openErrorModal (errorMessage: string): void {
      this.globalService.clearErroMessages();
      this.globalService.setErrorMEssage(errorMessage);
      this.globalService.openErrorModal();
  }


  public setCookie(name: string, value: any): void {
    if(value instanceof Object) {
      value = JSON.stringify(value);
    }
    window.document.cookie =  name + '=' + value + '; path=/';
  }

  public deleteCookie(name: string): void {
    if (this.getCookie) {
          document.cookie = name + '=' + ';expires=Thu, 01 Jan 1970 00:00:01 GMT';
    }
  }

  public getCookie(name: string): any {
    const regex = new RegExp('[; ]'+name+'=([^\\s;]*)');
    const sMatch = (' '+document.cookie).match(regex);
    if (name && sMatch)  {
      try {
       return JSON.parse(sMatch[1]);
      } catch (e) {
        return decodeURI(sMatch[1]);
      }
    }
    return null;
  }
  public loginSucess(data: any): void {
    console.log('loggin sucess');
    this.loading = false;
      this.setUser(data);
      this.isAvatarSet = true;
      this.errors.invalidUser = false;
      this.router.navigate(['/home']);
      window.scroll(0,0);
  }

  public loginNotSuccess(e: any): void {
    console.error('error in login', e);
    this.loading = false;
    this.errors.invalidUser = true;
  }

  public login(username: string, password: string): void {
    if( password && username) {
      const user:any = {password: password, username: username};
      this.loading = true;
      this.api.post('https://fierce-falls-25549.herokuapp.com/api/users/login', user).subscribe(
        data => this.loginSucess(data),
        e => this.loginNotSuccess(e),
      );
    } else {
      this.errors.userReq = !username ? true : false;
      this.errors.passwordReq = !password ? true : false;
    }
  }

  public logout(): void {
    this.isAuth = false;
    this.isAvatarSet = false;
    this.deleteCookie(this.userCookieName);
    this.user = {};
  }
}