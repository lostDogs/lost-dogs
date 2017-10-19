import { Component, ViewChild, ElementRef} from '@angular/core';
import {UserService} from '../../../common/services/user.service';
import {ValidationService} from '../../../common/services/validation.service';
import {Router} from '@angular/router';
import {formObj} from '../../create-account/account.component';
import {GlobalFunctionService} from '../../../common/services/global-function.service';

@Component({
  selector: 'form-payment',
  template: require('./form-payment.template.html'),
  styles: [ require('./form-payment.scss')]
})
export class FormPaymentComponent {
  public creaditCard: {
    number: formObj,
    ownerName: formObj,
    expMonth: formObj,
    expYear: formObj,
    ccv: formObj,
    method: formObj,
    type: formObj
  };
  public extra: {
    terms: formObj,
    noPersonalData: formObj
  };
  public months: string[];
  public years: string[];
  public cardSpin: boolean;
  public loading: boolean;
  public sucess: boolean;

  constructor (public userService: UserService, public router: Router, public validate: ValidationService, public globalService: GlobalFunctionService) {
    this.creaditCard = {
      method: {valid: true, value: undefined, required: false, label: 'Metodo de pago'},
      number: {valid: true, value: undefined, required: true, label: 'Numero de tarjeta'},
      ownerName: {valid: true, value: undefined, required: true, label: 'Nombre del dueno'},
      expMonth: {valid: true, value: undefined, required: true, label: 'Mes'},
      expYear: {valid: true, value: undefined, required: true, label: 'Anio'},
      ccv: {valid: true, value: undefined, required: true, label: 'Ccv'},
      type: {valid: true, value: undefined, required: false, label: 'typo de tarjeta'}
    };
    this.extra = {
      terms: {valid: true, value: undefined, required: true , label: 'Terminos & condiciones'},
      noPersonalData: {valid: true, value: undefined, required: true, label: 'No proporcional domicilio'}
    };
    this.months = [];
    this.years = [];
    const todaysYear: number = (new Date()).getFullYear();
    for (let i = 1; i <= 12; i++) {
      const twodigit: string = i < 10 ? '0' + i : '' + i;
      this.months.push(twodigit);
    }
    for (let i = todaysYear; i <= todaysYear + 10; i++) {
      this.years.push('' + i);
    }
  }

  public ngOnInit(): void {
    const monthSelect: JQuery = $('#cc-month');
    const yearSelect: JQuery = $('#cc-year');

    monthSelect.change(() => {
      this.creaditCard.expMonth.value = monthSelect.val();
      this.creaditCard.expMonth.valid = true;
    });
    yearSelect.change(() => {
      this.creaditCard.expYear.value = yearSelect.val().substring(2, 4);
      this.creaditCard.expYear.valid = true;
    });
  }

  public ngAfterViewInit(): void {
    $('select').material_select();
    $('#cc-number').mask('0000-0000-0000-0000');
    $('#ccv'). mask('0000');
    this.creaditCard.ownerName.value = this.userService.user.name + ' ' + this.userService.user.lastName + ' ' + this.userService.user.lastName2;
  }
  public pay(): void {
    this.creaditCard.type.value = this.validate.cardType;
    this.globalService.clearErroMessages();
    const card: boolean = this.validation(this.creaditCard);
    const extras: boolean = this.validation(this.extra);
    if (card && extras) {
      this.cardSpin = true;
      this.loading = true;
      setTimeout(() => {
        this.proccedTransaction();
      }, 1020);
    } else  {
      this.globalService.openErrorModal();
    }
  }

  public validation(formObj: any): boolean {
    let validFrom: boolean = true;
    const formObjKeys: string[] = Object.keys(formObj);
    let message: string;
    formObjKeys.forEach((value: string, valueIndex: number) => {
      if (formObj[value].required && !formObj[value].value) {
        validFrom = false;
        formObj[value].valid = false;
        message = message ? message : formObj[value].label +' requerido';
      } else if (!formObj[value].valid) {
        validFrom = false;
        message = message ? message : formObj[value].label +' requerido';
      }
    });
    this.globalService.setErrorMEssage(message);
    return validFrom;
  }

  public proccedTransaction(): void {
    this.loading = false;
    this.sucess = true;
    this.globalService.paymentRewardSucess = true;
  }

};
