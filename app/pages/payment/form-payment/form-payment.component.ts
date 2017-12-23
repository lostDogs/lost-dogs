import { Component, ViewChild, ElementRef} from '@angular/core';
import {UserService} from '../../../common/services/user.service';
import {ValidationService} from '../../../common/services/validation.service';
import {formObj} from '../../create-account/account.component';
import {GlobalFunctionService} from '../../../common/services/global-function.service';
import {MailingRewardService} from '../../../common/services/mailing-reward.service';
import {DogCardService} from '../../../common/services/dog-card.service';
import {Router, ActivatedRoute, Params} from '@angular/router';
import {OpenSpayService} from '../../../common/services/openspay.service';

export interface ICard {
  number: formObj;
  ownerName: formObj;
  expMonth: formObj;
  expYear: formObj;
  ccv: formObj;
  method: formObj;
  type: formObj;
}

@Component({
  selector: 'form-payment',
  template: require('./form-payment.template.html'),
  styles: [ require('./form-payment.scss')]
})
export class FormPaymentComponent {
  public creaditCard: ICard;
  public extra: {
    terms: formObj,
    noPersonalData: formObj
  };
  public months: string[];
  public years: string[];
  public cardSpin: boolean;
  public loading: boolean;
  public sucess: boolean;
  public dogId: string;
  public transcationId: string;
  public rewardAmount: string;
  public lostParam: string;

  constructor (
    public userService: UserService,
    public router: Router,
    public validate: ValidationService,
    public globalService: GlobalFunctionService,
    public mailingService: MailingRewardService,
    public dogService: DogCardService,
    public activeRoute: ActivatedRoute,
    public openSpayService: OpenSpayService
  ) {
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
      noPersonalData: {valid: true, value: undefined, required: true, label: 'No proporciones tu domicilio'}
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
    this.openSpayService.loadOpenPayScript();
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
    this.activeRoute.queryParams.subscribe((params: Params) => {
      this.dogId = params.cID;
      this.transcationId = params.transcation;
      this.lostParam = params.Lt;
      this.rewardAmount = params.rW || (this.dogService.dogData && this.dogService.dogData.reward);
      if (!this.dogService.dogData && this.dogId) {
        this.dogService.getDog(this.dogId).add(() => {
          this.setReward(params.rW);
        });
      }else if (!this.dogService.dogData && this.transcationId) {
      this.mailingService.getTransaction(this.userService.token, this.transcationId).add(() => {
        this.dogService.getDog(this.mailingService.transaction.dog_id).add(() => {
          this.setReward(params.rW);
        });
      });
    }
    });
  }

  public ngAfterViewInit(): void {
    $('select').material_select();
    $('#cc-number').mask('0000-0000-0000-0000');
    $('#ccv'). mask('0000');
    if (this.userService.isAuth) {
      this.creaditCard.ownerName.value = this.userService.user.name + ' ' + this.userService.user.lastName + ' ' + this.userService.user.lastName2;
    }
  }

  public setReward(param: string): void  {
    this.rewardAmount =  !param ? this.dogService.dogData.reward : param;
     this.rewardAmount =  this.rewardAmount || '00.00';
  }

  public pay(event: Event): void {
    event.preventDefault();
    this.creaditCard.type.value = this.validate.cardType;
    this.globalService.clearErroMessages();
    const card: boolean = this.validation(this.creaditCard);
    const extras: boolean = this.validation(this.extra);
    const openPayValidation: any = this.openSpayService.validateCardNum(this.creaditCard.number.value) && this.openSpayService.validateCvc(this.creaditCard.number.value, this.creaditCard.ccv.value);
    if (card && extras && openPayValidation) {
      this.cardSpin = true;
      this.loading = true;
      this.proccedTransaction();
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
    const tokenData: any = this.openSpayService.mapTokenData(this.creaditCard);
    this.openSpayService.createToken(tokenData).then(() => {
      if (this.openSpayService.tokenId) {
        const transDesc: string = 'pago de recompenza de ' + this.userService.user.name + 'para el perro >' + this.dogService.dogData.id;
        const chargeObj: any = this.openSpayService.mapChargeRequest(this.rewardAmount, this.userService.user,transDesc);
        this.openSpayService.chargeClient(chargeObj).add(() => {
        if (this.openSpayService.sucessPaymentId) {
          alert('SUCESS ID: ' + this.openSpayService.sucessPaymentId);
          this.mailingService.sendEmailsToUsers(false, this.userService.token, this.dogService.dogData._id).add(() => {
            this.loading = false;
            this.sucess = true;
            this.globalService.paymentRewardSucess = true;
          });
        }

        })
      }
    });
  }

};
