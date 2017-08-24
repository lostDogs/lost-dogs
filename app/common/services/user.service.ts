import { Injectable } from '@angular/core';
import {ApiService} from './api.service';
@Injectable()
export class UserService {
  public isAuth: boolean;
  public user: any;

  constructor (public api: ApiService) {
  }

  public setUser(response: any) {
    console.log('login', response);
    this.user.name = response.name;
    this.user.lastName = response.surname;
    this.user.avatar = response.avatar_url;
    this.isAuth = true;
  }

  public login(user:{password: string, username: string}): void {
    this.api.post('52.42.250.238/api/users/login', user).subscribe(
      data => this.setUser(data),
      e => console.error('error in login', e),
    );
  }

  public logout(): void {
    console.log('loggin out');
    this.isAuth = false;
    this.user = {};
  }
}