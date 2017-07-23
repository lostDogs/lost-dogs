import { Component} from '@angular/core';
import {ValidationService} from  '../../common/services/validation.service';

export interface user {
  pic: string;
  name: {first: string, last1: string, last2: string};
  adress: {adressName: string, postalCode: string, city: string, numberExt: string, numberInt: string};
  contact: {lada: number, phone: number, email: string};
  access: {userName: string, password: string};
}

@Component({
  selector: 'account',
  template: require('./create-account.template.html'),
  styles: [ require('./account-style.scss')]
})
export class accountComponent {
  public user: user;
  public formValid: any;

  constructor (public validate: ValidationService) {
    this.user = {
      pic: './static/profile-undef.png' ,
      name: {first: undefined, last1: undefined, last2: undefined},
      adress: {adressName: undefined, postalCode: undefined, city: undefined, numberExt: undefined, numberInt: undefined},
      contact: {lada: undefined, phone: undefined, email: undefined},
      access: {userName: undefined, password: undefined}
    };
    this.formValid = {
     fname: true,
     lname1: true,
     lname2: true,
     adressName: true,
     postalCode: true,
     city: true,
     numberExt: true,
     numberInt: true,
     lada: true,
     phone: true,
     email: true,
     userName: true,
     password: true
    };
  }
  public createUser (): void {
    console.log('this', this);

  }

  public filePicChange(ev: any): void {
    const file: File = ev.target.files[0];
      if (file.type.match('image.*')) {
        try {
          const reader = new FileReader();
          reader.onload = (event: any) => {
             this.user.pic = event.target.result;
          };
          reader.readAsDataURL(file);
        }catch (error){
          // do nothing
        }
      } else {
        console.error('not an image');
      }
  }
};
