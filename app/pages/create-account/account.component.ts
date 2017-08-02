import { Component} from '@angular/core';
import {ValidationService} from  '../../common/services/validation.service';
import {ApiService} from '../../common/services/api.service';
export interface formObj {
  valid: boolean;
  value: any;
  required: boolean;
}

export interface user {
  pic: string;
  name: {first: formObj, last1: formObj, last2: formObj};
  adress: {adressName: formObj, postalCode: formObj, city: formObj, numberExt: formObj, numberInt: formObj, country: formObj};
  contact: {areaCode: formObj, phone: formObj, email: formObj};
  access: {userName: formObj, password: formObj, password2: formObj};
}

@Component({
  selector: 'account',
  template: require('./create-account.template.html'),
  styles: [ require('./account-style.scss')]
})
export class accountComponent {
  public user: user;

  constructor (public validate: ValidationService, public api: ApiService) {
    this.user = {
      pic: './static/profile-undef.png',
      name: {
        first: {valid: true, value: undefined, required: true},
        last1: {valid: true, value: undefined, required: true},
        last2: {valid: true, value: undefined, required: true}
      },
      adress: {
        adressName: {valid: true, value: undefined, required: true},
        postalCode: {valid: true, value: undefined, required: true},
        city: {valid: true, value: undefined, required: true},
        numberExt: {valid: true, value: undefined, required: true},
        numberInt: {valid: true, value: undefined, required: false},
        country: {valid: true, value: undefined, required: true}
      },
      contact: {
        areaCode: {valid: true, value: undefined, required: true},
        phone: {valid: true, value: undefined, required: true},
        email: {valid: true, value: undefined, required: true}
      },
      access: {
        userName: {valid: true, value: undefined, required: true},
        password: {valid: true, value: undefined, required: true},
        password2: {valid: true, value: undefined, required: true}
      }
    };
  }

  public createUser (): void {
    // Check for undefined and set formvalue to false
    const userFirts: any[] = Object.keys(this.user);
    userFirts.forEach((userKey: any, elementIndex: number) => {
      const element: any = this.user[userKey];
      if (element instanceof Object) {
        const propKey: any = Object.keys(element);
        for (let i = 0; i < propKey.length; i++) {
          const content: string = element[propKey[i]].value;
          if (element[propKey[i]].required && !content) {
            element[propKey[i]].valid = false;
          }
        }
      }
    });
    let userPost: any = {
      "name": this.user.name.first,
      "surname":  this.user.name.last1,
      "lastname":  this.user.name.last2,
      "address": {
        "ext_number": this.user.adress.numberExt,
        "neighborhood": this.user.adress.adressName,
        "zip_code": this.user.adress.postalCode,
        "city": this.user.adress.city,
        "country": this.user.adress.country
      },
      "phone_number": {
        "number": this.user.contact.phone,
        "area_code": this.user.contact.areaCode
      },
      "email": this.user.contact.email,
      "username": this.user.access.userName,
      "confirm_password": this.user.access.password,
      "password": this.user.access.password2
    }
    this.api.post('http://52.42.250.238/api/users', userPost).subscribe((data: any) => {console.log('data', data)});
    //this.api.get('http://52.42.250.238/api/users').subscribe((data: any) => {console.log('data', data)});
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
