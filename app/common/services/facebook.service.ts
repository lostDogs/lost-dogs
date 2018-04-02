import { Injectable } from '@angular/core';
import {UserService} from './user.service';
@Injectable()

export class FacebookService {
  public FB: any;
  public fbInitialized: boolean;
  public loadingLogin: boolean;
  public userData: {
    fbId?: string;
    username?: string;
    name?: string;
    surname?: string;
    lastname?: string;
    phoneNumber?: string;
    email?: string;
    address?: {country?: string};
    avatar_url?: string;
    token?: string;
  }

  constructor(public userService: UserService) {
      this.userData = { address: {} };
      this.FB = window['FB'];
      //window['fbAsyncInit'] = this.fbAsyncInit.bind(this);
  }

  public fbAsyncInit(): void {
    this.fbInitialized = true;
    this.FB.init({
      appId      : '2098865313679573',
      cookie     : true,  // enable cookies to allow the server to access 
      xfbml      : false,  // parse social plugins on this page
      version    : 'v2.12'
    });
  }

  public login(): void {
    this.FB.getLoginStatus((response: any) => {
      this.statusChange(response);
      if (/unknown/g.test(response.status) || /not_authorized/g.test(response.status)) {
        this.FB.login((success: any) => {
        if (/connected/g.test(success.status)) {
          this.getUserData(); 
          } else {
            console.error('error in conection',  success);
          }
        },  {scope: 'public_profile,email,user_location'});
      }
    });
  }

  public statusChange(response: any): void {
    console.log('status of > ', response);
    if (/connected/g.test(response.status) && !this.userService.isAuth) {
      this.getUserData();
    }
  }

  public getUserData(): void {
    this.loadingLogin = true;
    this.FB.api('/me?fields=id,first_name,last_name,middle_name,email,location,picture', (success: any) => {
      console.log('me > ', success)
      if (!success || success.error) {
        console.error('error in getting user data from FB', success);
        this.loadingLogin = false;
        return;
      }
      this.userData.fbId = success.id;
      this.userData.name = success.first_name;
      this.userData.email = success.email;
      this.userData.username = success.email;
      if (success.last_name && success.last_name.length) {
        const lastNames: string = success.last_name.split(' ');
        this.userData.surname = lastNames[0];
        this.userData.lastname = lastNames[1] || success.middle_name;
      }
      this.userData.avatar_url = success.picture && success.picture.data && !success.picture.data.is_silhouette ? success.picture.data.url : this.userService.defaultAvatar;
      if (success.location && success.location.id) {
        this.FB.api('/' + success.location.id+'?fields=location' , (loSucces: any) => {
          this.userData.address.country = loSucces.location && loSucces.location.city || undefined;
          this.loginApp(this.userData);
          this.loadingLogin = false;
        });
      }  else {
        this.loginApp(this.userData);
        this.loadingLogin = false;
      }
    });
  }

  public loginApp(userData: any): void {
    this.userService.login(this.userData.email, this.userData.fbId).add(() => {
      if (this.userService.errors.invalidUser) {
        console.log('user not in DB going for FB loign >');
        this.userService.loginSucess(this.userData);
      }
    });
  }

  public logOut(): void {
    if (this.userService.user.fbId) {
      this.FB.logout((response: any) => {});
    }
  }
}