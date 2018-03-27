import { Injectable } from '@angular/core';
import {ApiService} from './api.service';
import {Router} from '@angular/router';
import {Subscription} from 'rxjs/Rx';
import {GlobalFunctionService} from './global-function.service';
import {CookieManagerService} from './cookie-manager.service';

@Injectable()
export class UserService {
  public isAuth: boolean;
  public isAvatarSet: boolean;
  public user: any;
  public token: string;
  public location: {lat: number , lng: number};
  public userCookieName: string = 'user';
  public locCookieName: string = 'location_user';
  public loading: boolean;
  public errors: {passwordReq: boolean, userReq: boolean, invalidUser: boolean};
  public mapsApi: any;
  public previousUrl: string;
  public timesTrying: number = 0;
  public forgotloading: boolean;
  public forgotSucess: boolean;
  public tempUserName: any;
  public noAuthSubs: Subscription;
  public validCaptcha: boolean;
  public defaultAvatar: string = 'https://www.lostdog.mx/assets/img/profile-undef.png';


  constructor (public api: ApiService, public router: Router, public globalService: GlobalFunctionService, public CookieService: CookieManagerService) {
    this.user = {};
    this.errors = {passwordReq: false, userReq: false, invalidUser: false};
    const userCookie: any = this.CookieService.getCookie(this.userCookieName);
    const userToken: any = this.CookieService.getCookie('authToken');
    const locCookie: any = this.CookieService.getCookie(this.locCookieName);
    if (userCookie) {
      this.user = userCookie;
      this.isAuth = true;
      this.isAvatarSet = true;
    } else {
      console.log('else login with no values auth');
      this.noAuthSubs = this.login(undefined, undefined, true);
      this.isAvatarSet = false;
    }
    if (userToken) {
      this.token = userToken.authToken;
    }
    if (locCookie) {
      this.location = locCookie;
    }
  }

  public setUser(response: any): void {
    if (response.token) {
      this.token = response.token;
      this.CookieService.setCookie('authToken', {authToken: this.token});
    }
    if (response.surname) {
      this.user.name = response.name || response.username;
      this.user.lastName = response.surname;
      this.user.avatar = response.avatar_url;
      this.user.email = response.email;
      this.user.lastName2 = response.lastname;
      this.user.address = response.address;
      this.user.phoneNumber = response.phone_number;
      this.user.username = response.username;
      this.user.id = response.id;
      this.isAuth = true;
      this.CookieService.setCookie(this.userCookieName, this.user);
    }
  }

   public getUserLocation(): Promise<any> {
      return new Promise((resolve, reject) => {
          let errorMessage: string;
            if (this.location && this.location.lat) {
              resolve(this.location);
            } else if (navigator.geolocation) {
              navigator.geolocation.getCurrentPosition(
                (sucess) => {
                  errorMessage = undefined;
                  this.location = {lat: sucess.coords.latitude , lng: sucess.coords.longitude};
                  this.CookieService.setCookie(this.locCookieName, this.location);
                  resolve(this.location);
              }, (error) => {
                this.location = {lat: 20.659698 , lng: -103.349609};
                switch(error.code) {
                  case error.PERMISSION_DENIED:
                    errorMessage = 'El usuario denegó la solicitud de geolocalización.';
                    break;
                  case error.POSITION_UNAVAILABLE:
                    errorMessage = 'La información de ubicación no está disponible.';
                    break;
                  case error.TIMEOUT:
                    errorMessage = 'La petición para la ubicación excedió el tiempo de espera';
                    break;
                  case error['UNKNOWN_ERROR']:
                    errorMessage = 'Un error desconocido ocurrió (ubicación).';
                    break;
                }
                this.openErrorModal(errorMessage);
                reject(this.location);
              }, {timeout: 15000, maximumAge: 60000});
          } else {
              errorMessage = 'Geolocalización no es compatible con este navegador.';
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


  public loginSucess(data: any, userName?: string): void {
    console.log('calling login succes');
    this.tempUserName = undefined;
    this.loading = false;
    this.timesTrying = 0;
    this.setUser(data);
    this.isAvatarSet = true;
    this.errors.invalidUser = false;
    if (this.previousUrl && (data.name || data.username)) {
      console.log('prevUrl', this.previousUrl);
      this.router.navigateByUrl(this.previousUrl);
      setTimeout(() => {this.previousUrl = undefined;}, 20);
    }
    window.scroll(0,0);
  }

  public forgot(userName: string): Subscription {
    const url: string = this.api.API_PROD + 'users/' + userName + '/forgotPassword';
    this.forgotloading = true;
    const headers: any = {
      'Content-Type': 'application/json',
      'Authorization': 'token ' + this.token
    };
    return this.api.post(url, {}, headers).subscribe(
      data => {
        this.forgotSucess = true;
        this.forgotloading = false;
        this.tempUserName = undefined;
      },
      error => {
        const bodyCode: string = JSON.parse(error._body)['code'];
        let messsage: string;
        this.forgotloading = false;
        this.forgotSucess = false;
        this.globalService.clearErroMessages();
        if (error.status === 404) {
          messsage = 'Usuario no encontrado';
        } else if (/bounce/g.test(bodyCode) || /omplain/g.test(bodyCode)) {
          messsage = 'Tu correo ha sido marcado como invalido';
          this.globalService.setSubErrorMessage('Contacta soporte@lostdog.mx para cambiarlo');
        } else {
          messsage = 'hubo un problema al enviar el correo';
        }
        this.globalService.setErrorMEssage(messsage);
        this.globalService.openErrorModal();        
      }
    );
  }

  public loginNotSuccess(e: any): void {
    this.loading = false;
    this.isAuth = false;
    this.errors.invalidUser = true;
    this.timesTrying++;
    console.error('error in login', e);
  }

  public login(username?: string, password?: string, noAuth?: boolean): Subscription {
    if( password && username || noAuth) {
      const user:any = {password: password, username: username && username.toLowerCase()};
      this.loading = true;
      return this.api.post(this.api.API_PROD + 'users/login', user).subscribe(
        data => this.loginSucess(data, username),
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
    this.token = undefined;
    this.user = {};
    this.CookieService.deleteCookie(this.userCookieName);
    this.CookieService.deleteCookie('authToken');
    console.log('login with no values auth');
    this.noAuthSubs = this.login(undefined, undefined, true);
  }

  public captchaSubmit(data: any): void {
    const headers: any = {
      'Authorization': 'token ' + this.token
    };
    this.api.post(this.api.API_PROD + 'users/captcha',{captchaVal: data}, headers).subscribe(
      data => {
        console.log('data', data);
        this.validCaptcha = data['success'];
      },
      error => {
        this.validCaptcha = undefined;
        console.log('error', error);
      }
    );
  }

  public onloadCallback(): void {
    window['grecaptcha'].render('g-captcha', {
      'sitekey' : '6LdnUEcUAAAAAKr9B2gqB23-sZsHN3tXRLYadPBX',
      'callback': window['captchaSubmit']
    });
    setTimeout(() => {$('body div').last().children().addClass('iframe-challenge-mobile')}, 3000);
  }

  public expiredCaptcha(): void {
    this.validCaptcha = undefined;
  }

  public loadCaptchaScript( ): any {
    const scripts: JQuery = $('script');
    const dynamicScripts: string[] = ['https://www.google.com/recaptcha/api.js?onload=onloadCallback&render=explicit'];
    const nodeType: string = 'text/javascript';
    const charset: string = 'UTF-8';
    for (let i = 0; i < scripts.length; ++i) {
        if (scripts[i].getAttribute('src') && scripts[i].getAttribute('src').includes(dynamicScripts[0])) {
            return;
        }
    }
    dynamicScripts.forEach((scriptName: string, scriptIndex: number) => {
      let node = document.createElement('script');
      node.type = nodeType;
      node.charset = charset;
      node.src = scriptName;
      node.async = true;
      node.id = 'captcha-script';
      node.setAttribute('defer','');
      document.getElementsByTagName('head')[0].appendChild(node);
    });
  }

  public missingAddress(): boolean {
    // return true if there one requried prop mising in the user.
    const requried: string [] = ['city', 'country', 'ext_number', 'neighborhood', 'street', 'zip_code'];
    if (this.user && this.user.address) {
      console.log('adddres', this.user.address);
      return requried.some ((prop: string, proIndex: number) => (
        !this.user.address[prop]
      ));
    } else {
      return true;
    }
  }

}