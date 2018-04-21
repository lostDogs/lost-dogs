import { Injectable } from '@angular/core';
import {UserService} from './user.service';
import {Subscription} from 'rxjs/Rx';
import {ApiService} from './api.service';
import {Router} from '@angular/router';
import {CookieManagerService} from './cookie-manager.service';

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
  };
  public usersReach: any;
  public estimations: {maxDau?: number, curve?: any[]} = {};
  public adSetId: string;
  public mappedAd: any;
  public total: number = 0;
  private defaultBudget: number = +process.env.BASE_ADS_BUDGET;
  private defaultDuration: number = +process.env.BASE_ADS_DURATION;

  constructor(public userService: UserService, public api: ApiService, public router: Router, public cookies: CookieManagerService) {
    this.userData = { address: {} };
    this.FB = window['FB'];name
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

  public getAdReach(daily_budget: number, latLng: {lat: number, lng: number}): Subscription {
    this.usersReach = 'Cargando';
    const query = {
      'dailyBudget': +daily_budget * 100,
      'adSetId': this.adSetId,
      'currency': 'MXN',
      'name': this.userService.user.email + ' T: ' + (new Date()).toLocaleString(),
      'radius': 8,
      'latLng': JSON.stringify(latLng)
    };
    const headers: any = {
      'Content-Type': 'application/json',
      'Authorization': 'token ' + this.userService.token
    };
    return this.api.get(this.api.API_PROD + 'facebook/ads?', query).subscribe(
      response => this.setEstimations(response),
      error => {
        console.error('getting reach error >', error);
        this.usersReach = -1;
      },
    )
  }

  private setEstimations(result: any): void {
    this.estimations.maxDau = result.data[0].estimate_dau;
    this.estimations.curve = result.data[0].daily_outcomes_curve;
    this.adSetId = result.adSetId;
  }

  public calculateReach(budget: number): void {
    budget = budget * 100 * 0.9;
    let budgetIndex: number;
     this.estimations.curve.some((val: any, valIndex: number) => {
       if (budget <= val.spend) {
         budgetIndex = valIndex;
         return true;
       }
     });
     console.log('index >', budgetIndex);
     const top = this.estimations.curve[budgetIndex];
     const bottom = this.estimations.curve[budgetIndex - 1] || {reach: 0, spend: 0};
     const ofset = this.estimations.curve[budgetIndex - 2] || {reach: 0, spend: 0};
     const y = top.reach - bottom.reach;
     const x = top.spend - bottom.spend;
     const estimReach = ofset.spend / 2 + budget * y / x;
     this.usersReach = (estimReach.toFixed(0)).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,');
  }

  public mapAd(days: number, dailyBudget: number, adCreativeVals: any): void {
    if (!days || !dailyBudget) {
      days = this.defaultDuration;
      dailyBudget = this.defaultBudget;
    }
    this.mappedAd = {
      set: {
        adSetId: this.adSetId,
        endTime: days,
        dailyBudget: dailyBudget * 100
      },
      img: adCreativeVals.img,
      creative: {
        name: 'DogID > test1',
        link: 'https://www.lostdog.mx',
        body: adCreativeVals.body,
        title: adCreativeVals.title,
        description: adCreativeVals.description
      }
    };
   this.total = dailyBudget * days;
   console.log('this.mapped', this.mappedAd);
  }
  
  public resetService(): void {
    this.mapAd(undefined, undefined, {img: undefined, body: undefined, title: undefined});
    this.adSetId = undefined;
  }

  public deleteAdset(adSetId: string): Subscription {
    const headers: any = {
      'Content-Type': 'application/json',
      'Authorization': 'token ' + this.userService.token
    };
    return this.api.delete(this.api.API_PROD + 'facebook/ads', adSetId, headers).subscribe(
      data => {console.log('adset deleted')},
      error => {console.error('unable to delete adset', error)}
    )
  }
}
