import { Injectable } from '@angular/core';
import {ApiService} from './api.service';
import {Subscription} from 'rxjs/Rx';
import {ICard} from '../../pages/payment/form-payment/form-payment.component'

export enum cardNames {
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
  private openPay: any;
  private deviceSession: any;
  public init: boolean;
  public tokenId: any;
  public sucessPaymentId: string;
  public MERCHANT_ID: string = 'mrvo5dylz7xeq7pnyoqx';
  public PUBLIC_KEY: string = 'pk_85e195c76956425d973944d88521d47e';

  constructor (public api: ApiService) {}

  public initOpenPay(): void {
    if (!this.init) {
      this.openPay =window['OpenPay'];
      this.openPay.setId(this.MERCHANT_ID);
      this.openPay.setApiKey(this.PUBLIC_KEY);
      this.openPay.setSandboxMode(true);
      this.init = true;
    }

  }

  public createToken(tokenData: any): Promise<any> {
    const promise: Promise<any> = new Promise((resolve: any, reject: any) => {
      this.openPay.token.create(tokenData,
        (suscess: any) => {
          this.tokenId = suscess.data.id;
          console.log('sucess', suscess);
          resolve(suscess);
        },
        (error: any) => {
          console.log('error', error);
          this.tokenId = undefined;
          reject(error);
        })
    });
    return promise;
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

  public mapTokenData(card: ICard): object {
    const tokenData: any = {
      'card_number': card.number.value.replace(/-/g, ''),
      'expiration_year':card.expYear.value,
      'expiration_month': card.expMonth.value,
      'cvv2': card.ccv.value,
      'holder_name':card.ownerName
    }
    return tokenData;
  }

  public mapChargeRequest(amount: string, user: any, description: string): object {
      amount = amount.replace(/,/g, '');
      const chargeRequest = {
      'source_id' : this.tokenId,
      'method' : 'card',
      'amount' : +amount,
       'currency' : 'MXN',
      'description' : description,
      'customer' : {
        'name' : user.name,
        'last_name' : user.lastName,
        'phone_number' : user.phoneNumber,
        'email' : user.email
       }
     }
     const deviceSession = this.openPay.deviceData.setup(chargeRequest);
     chargeRequest['device_session_id'] = deviceSession;
     console.log('chargeRequest> ', chargeRequest);
     return chargeRequest;
  }

  public chargeClient(chargeobj: any): Subscription {
    return this.api.post('/api/transactions/' + 'id' + '/pay', chargeobj).subscribe(
      data => {
        console.log('charged data sucess!', data);
        this.sucessPaymentId = data['id'];
      },
      error => {
        console.error('error making charge to customers', error);
      });
  }

  public loadOpenPayScript(): any {
    //  Dynamically inserting payment scirpts on the dom.
    const scripts: JQuery = $('script');
    const mainOpenPayPath: string = 'https://openpay.s3.amazonaws.com/';
    const dynamicScripts: string[] = ['openpay.v1.min.js', 'openpay-data.v1.min.js'];
    const nodeType: string = 'text/javascript';
    const charset: string = 'UTF-8';
    for (let i = 0; i < scripts.length; ++i) {
        if (scripts[i].getAttribute('src') && scripts[i].getAttribute('src').includes(dynamicScripts[0]) || scripts[i].getAttribute('src').includes(dynamicScripts[1])) {
            return;
        }
    }
    console.log('dynamically inserting scripts ///');
    dynamicScripts.forEach((scriptName: string, scriptIndex: number) => {
      let node = document.createElement('script');
      node.type = nodeType;
      node.charset = charset;
      node.src = mainOpenPayPath + scriptName;
      node.async = false;
      document.getElementsByTagName('head')[0].appendChild(node);
      node.onload = ()=> {
        if (scriptIndex === dynamicScripts.length - 1) {
          this.initOpenPay();
        }
      };
    });
  }  
}