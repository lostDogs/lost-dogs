import { Component} from '@angular/core';
import {Iuser} from '../../create-account/account.component';
import {UserService} from '../../../common/services/user.service';

@Component({
  selector: 'editaccount',
  template: require('./edit-account.template.html'),
  styles: [ require('./edit-account.scss')]
})
export class editAccountComponent {
  public profilepage: string;
  public user: Iuser;
  public orginalUser: Iuser;
  constructor (public userService: UserService) {

  }
  public ngOnInit(): void {
    $('.input-field.alt-black label').addClass('active');
    this.user = {
      pic: {value: this.userService.user.avatar, valid: true, required: true, label: 'imagen de perfil'},
      name: {
        first: {valid: true, value: this.userService.user.name, required: true},
        last1: {valid: true, value: this.userService.user.lastName, required: true},
        last2: {valid: true, value: this.userService.user.lastName2, required: true}
      },
      adress: {
        adressName: {valid: true, value: this.userService.user.address.neighborhood, required: true},
        postalCode: {valid: true, value: this.userService.user.address.zip_code, required: true},
        city: {valid: true, value: this.userService.user.address.city, required: true},
        numberExt: {valid: true, value: this.userService.user.address.ext_number, required: true},
        numberInt: {valid: true, value: this.userService.user.address.int_number, required: false},
        country: {valid: true, value: this.userService.user.address.country, required: true}
      },
      contact: {
        areaCode: {valid: true, value: this.userService.user.phoneNumber.area_code, required: true},
        phone: {valid: true, value: this.userService.user.phoneNumber.number, required: true},
        email: {valid: true, value: this.userService.user.email, required: true}
      },
      access: {
        userName: {valid: true, value: this.userService.user.username, required: true},
        password: {valid: true, value: undefined, required: true},
        password2: {valid: true, value: undefined, required: true}
      }
    };
    this.orginalUser = JSON.parse(JSON.stringify(this.user));
  }
  public ngAfterViewInit(): void {

  }

  public disableButton(userBlock: any, originalUserBlock: any): boolean {
    const objKeys = Object.keys(userBlock);
    return objKeys.some((userElement: string, userElementIndex: number) => {
      if (userBlock[userElement].value) {
        const userValue: string = (userElement==='password'  || userElement==='password2') ? userBlock[userElement].value: (userBlock[userElement].value + '').trim().toLowerCase();
        const originalUserValue: string = originalUserBlock[userElement].value && (userElement==='password'  || userElement==='password2') ? originalUserBlock[userElement].value : (originalUserBlock[userElement].value + '').trim().toLowerCase();
        if (userValue === originalUserValue) {
          return false;
        }
        return true;
      }
    });
  }  
};