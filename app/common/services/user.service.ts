import { Injectable } from '@angular/core';
import {ApiService} from './api.service';
@Injectable()
export class UserService {
  public isAuth: boolean;
  public isAvatarSet: boolean;
  public user: any;
  public userCookieName: string = 'user';

  constructor (public api: ApiService) {
    this.user = {};
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
    this.isAuth = true;
    this.setCookie(this.userCookieName, this.user);
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
    this.setUser(data);
    this.isAvatarSet = true;
  }

  public login(password: string, username: string): void {
    const user:any = {password: password, username: username};
    this.api.post('https://fierce-falls-25549.herokuapp.com/api/users/login', user).subscribe(
      data => this.loginSucess(data),
      e => console.error('error in login', e),
    );
  }

  public logout(): void {
    this.isAuth = false;
    this.isAvatarSet = false;
    this.deleteCookie(this.userCookieName);
    this.user = {};
  }
}