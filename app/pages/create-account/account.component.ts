import { Component} from '@angular/core';
import {ValidationService} from  '../../common/services/validation.service';
import {ApiService} from '../../common/services/api.service';
import * as countryData from '../../common/services/countries.json';
import {Router} from '@angular/router';

export interface formObj {
  valid: boolean;
  value: any;
  required: boolean;
}

export interface user {
  pic: formObj;
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
  public countries: any;

  constructor (public validate: ValidationService, public api: ApiService, public router: Router) {
    this.countries = countryData;
    this.user = {
      pic: {value:'./static/profile-undef.png', valid: true, required: true},
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


  public ngAfterViewInit(): void {
   $('select').material_select();
  }

  public ngOnInit(): void {
    $('select').change(() => {
      const input = $('#country');
      this.user.adress.country.value = input.val();
    });
  }

  public createUser (form: any): void {
    // Check for undefined and set formvalue to false
    let validForm: boolean = true;
    const userFirts: any[] = Object.keys(this.user);
    userFirts.forEach((userKey: any, elementIndex: number) => {
      const element: any = this.user[userKey];
      if (element instanceof Object) {
        const propKey: any = Object.keys(element);
        for (let i = 0; i < propKey.length; i++) {
          const content: string = element[propKey[i]].value;
          if (element[propKey[i]].required && !content) {
            element[propKey[i]].valid = false;
            validForm = false;
          }else if (!element[propKey[i]].valid) {
            validForm = false;
            break;
          }
        }
      }
    });
    if (validForm) {
      this.postUser();
    }
  }

  public filePicChange(ev: any): void {
    const file: File = ev.target.files[0];
      if (ev.target && ev.target.files && file && file.type.match('image.*')) {
        try {
          const reader = new FileReader();
          reader.onload = (event: any) => {
            this.user.pic.value = event.target.result;
          };
          reader.readAsDataURL(file);
        }catch (error) {
          // do nothing
        }
      } else {
        this.user.pic.valid = false;
        this.user.pic.value = './static/profile-undef.png';
        console.error('not an image');
      }
  }

  public toHomePage(): void {
    this.router.navigate(['/home'], {queryParams:{nU:true}});
    window.scroll(0,0);
  }

  public postUser(): void {
    const userPost: any = {
      'name': this.user.name.first.value,
      'surname':  this.user.name.last1.value,
      'lastname':  this.user.name.last2.value,
      'address': {
        'ext_number': this.user.adress.numberExt.value,
        'neighborhood': this.user.adress.adressName.value,
        'zip_code': this.user.adress.postalCode.value,
        'city': this.user.adress.city.value,
        'country': this.user.adress.country.value
      },
      'phone_number': {
        'number': this.user.contact.phone.value,
        'area_code': this.user.contact.areaCode.value
      },
      'email': this.user.contact.email.value,
      'username': this.user.access.userName.value,
      'confirm_password': this.user.access.password.value,
      'password': this.user.access.password2.value
    }
    this.api.post('http://52.42.250.238/api/users', userPost).subscribe(
      data => console.log('creating user post ', data),
      e => console.error('on post user', e),
       () => this.toHomePage(),
      );
  }
};
