import { Injectable } from '@angular/core';
@Injectable()

export class FacebookService {
  public FB: any;
  public userData: {
    id?: string;
    username?: string;
    givenName?: string;
    surName?: string;
    surname2?: string;
    phoneNumber?: string;
    email?: string;
    country?: string;
    avatar?: string;
  }

  constructor() {
      this.userData = {};
      this.FB = window['FB'];
      window['fbAsyncInit'] = this.fbAsyncInit.bind(this);
  }

  public fbAsyncInit(): void {
    this.FB.init({
      appId      : '2098865313679573',
      cookie     : true,  // enable cookies to allow the server to access 
      xfbml      : false,  // parse social plugins on this page
      version    : 'v2.12'
    });
    console.log('runing facebook init ...');
    this.FB.getLoginStatus((response: any) => {
      this.statusChange(response);
    });
  }

  public login(): void {
    this.FB.getLoginStatus((response: any) => {
      this.statusChange(response);
      if (/unknown/g.test(response.status)) {
        this.FB.login((success: any) => {
          this.getUserData();
        },  {scope: 'public_profile,email,user_location'});
      }
    });
  }

  public statusChange(response: any): void {
    console.log('status chage', response);
    if (/connected/g.test(response.status)) {
      this.getUserData();
    }
  }

  public getUserData(): void {
    //first_name', 'last_name', 'middle_name', 'email', user_mobile_phone
    this.FB.api('/me?fields=id,first_name,last_name,middle_name,email,location,picture', (success: any) => {
      console.log('me >', success);
      this.userData.id = success.id;
      this.userData.givenName = success.first_name;
      if (success.last_name && success.last_name.length) {
        const lastNames: string = success.last_name.split(' ');
        this.userData.surName = lastNames[0];
        this.userData.surname2 = lastNames[1] || success.middle_name;
      }
      this.userData.avatar = success.picture && success.picture.data && !success.picture.data.is_silhouette ? success.picture.data.url : undefined;
      success.location && success.location.id && this.FB.api('/' + success.location.id+'?fields=location' , (loSucces: any) => {
        console.log('loSucces', loSucces);
        this.userData.country = loSucces.location && loSucces.location.city || undefined;
      });    
    });

  }

  public logOut(): void {
    this.FB.logout((response: any) => {
      // user is now logged out

    });
  }
}