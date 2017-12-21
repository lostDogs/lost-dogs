import { Injectable } from '@angular/core';
import {ApiService} from './api.service';
import {Subscription} from 'rxjs/Rx';

enum cardNames {
Mastercard = 'Mastercard',
​Visa = 'Visa',
Visa_electron = 'Visa Electron',
American_express = 'American Express',
Diners_Club_Carte_Blanche = 'Diners Club Carte Blanche',
Discover = 'Discover',
JCB = 'JCB'
}

@Injectable()
export class OpenSpayService {
  private openPay: any = Window['OpenPay'];
  private deviceSession: any;
  public chargeRequest: any;

  constructor (public api: ApiService) {
    this.openPay.setId('mrvo5dylz7xeq7pnyoqx');
    this.openPay.setApiKey('pk_85e195c76956425d973944d88521d47e');
    this.openPay.setSandboxMode(true);

  }
  public createToken (form: any): Subscription {
    return this.api.post('https://sandbox-api.openpay.mx/v1/mrvo5dylz7xeq7pnyoqx/tokens/', form , {}).subscribe(
      data => {},
      error => {}
    )
  }
  public validateCardNum(cardNum: string): cardNames {
    if (this.openPay.card.validateCardNumber(cardNum)) {
      return this.openPay.card.cardType(cardNum);
    }
    return undefined;
  }

  public validateCvc(cardNum: string, cvc: string): boolean {
    return this.openPay.card.validateCVC(cvc, cardNum);
  }

  public mapChargeRequest(formObj: any): void {
      const chargeRequest = {
      'source_id' : 'token_id',
      'method' : 'card',
      'amount' : 'amount',
       'currency' : 'MXN',
      'description' : 'description',
      'customer' : {
        'name' : 'name',
        'last_name' : 'last_name',
        'phone_number' : 'phone_number',
        'email' : 'email'
       }
     }
     const deviceSession = this.openPay.deviceData.setup(chargeRequest);
     chargeRequest['device_session_id'] = deviceSession;
     this.chargeRequest = chargeRequest; 
  }

  public chargeClient(): void {
    this.openPay.customers.charges.create(this.chargeRequest, (error: any, charged: any) => {
      console.error('error', error)
      console.log('charged data sucess', charged);
    });    
  }
}