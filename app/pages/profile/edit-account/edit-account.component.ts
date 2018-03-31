import { Component} from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router';
import {Iuser, formObj} from '../../create-account/account.component';
import {UserService} from '../../../common/services/user.service';
import {ApiService} from '../../../common/services/api.service';
import {accountComponent} from '../../create-account/account.component'

@Component({
  selector: 'editaccount',
  template: require('./edit-account.template.html'),
  styles: [ require('./edit-account.scss')]
})
export class editAccountComponent {
  public profilepage: string;
  public user: Iuser;
  public orginalUser: Iuser;

  constructor (public userService: UserService, public activeRoute: ActivatedRoute) {}

  public ngOnInit(): void {
    $('.input-field.alt-black label').addClass('active');
    this.user = {
      pic: {value: this.userService.user.avatar, valid: true, required: true, label: 'imagen de perfil'},
      name: {
        first: {valid: true, value: this.userService.user.name, required: true , label: 'Nombre'},
        last1: {valid: true, value: this.userService.user.lastName, required: true , label: 'Apellido paterno'},
        last2: {valid: true, value: this.userService.user.lastName2, required: true, label: 'Apellido materno'}
      },
      adress: {
        adressName: {valid: true, value: this.userService.user.address.neighborhood, required: false , label: 'Colonia'},
        postalCode: {valid: true, value: this.userService.user.address.zip_code, required: false , label: 'Código Postal'},
        city: {valid: true, value: this.userService.user.address.city, required: false , label: 'Ciudad'},
        numberExt: {valid: true, value: this.userService.user.address.ext_number, required: false , label: 'Número exterior'},
        numberInt: {valid: true, value: this.userService.user.address.int_number, required: false , label: 'Número interior'},
        country: {valid: true, value: this.userService.user.address.country, required: true , label: 'País'},
        street: {valid: true, value: this.userService.user.address.street, required: false , label: 'Calle'}
      },
      contact: {
        phone: {valid: true, value: this.userService.user.phoneNumber.number, required: true , label: 'Teléfono celular'},
        email: {valid: true, value: this.userService.user.email, required: true, label: 'Correo electrónico'}
      },
      access: {
        password: {valid: true, value: this.userService.user.fbId || undefined, required: true , label: 'Contraseña'},
        password2: {valid: true, value: this.userService.user.fbId || undefined, required: true, label: 'Repetir contraseña'}
      }
    };
    this.orginalUser = JSON.parse(JSON.stringify(this.user));
  }
  public ngAfterViewInit(): void {}

  public disableButton(userBlock: any, originalUserBlock: any): boolean {
     // this function is being executed on the create-account.template.html every dom interaction.
    const objKeys = Object.keys(userBlock);
    return objKeys.some((userElement: string, userElementIndex: number) => {
      if (userBlock[userElement] && userBlock[userElement].value) {
        const userValue: string = (userElement==='password'  || userElement==='password2') ? userBlock[userElement].value: (userBlock[userElement].value + '').trim().toLowerCase();
        const originalUserValue: string = originalUserBlock[userElement].value && (userElement==='password'  || userElement==='password2') ? originalUserBlock[userElement].value : (originalUserBlock[userElement].value + '').trim().toLowerCase();
        if (userValue === originalUserValue) {
          return false;
        }
        return true;
      }
    });
  }
  public hoverRetainState(): void {
    const jqueryObj: JQuery =  $('input[type=text],input[type=password]');
    jqueryObj.focusin((event) => {
      if (event.target && event.target.id) {
        const idparent: string = $('#'+ event.target.id).parents().eq(2)[0].id;
        $('#' + idparent).addClass('hover');
      }
    });

    jqueryObj.focusout((event) => {
      if (event.target && event.target.id) {
        const idparent: string = $('#'+event.target.id).parents().eq(2)[0].id;
        $('#' + idparent).removeClass('hover');
      }
    });
  }
};
