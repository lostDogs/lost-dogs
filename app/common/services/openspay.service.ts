import { Injectable } from '@angular/core';
import {ApiService} from './api.service';
import {Subscription} from 'rxjs/Rx';
import {ICard} from '../../pages/payment/form-payment/form-payment.component';
import {GlobalFunctionService} from '../../common/services/global-function.service';

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
  public trasnferData: any;

  constructor (public api: ApiService, public globalService: GlobalFunctionService) {}

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
      card_number: card.number.value.replace(/-/g, ''),
      expiration_year: card.expYear.value,
      expiration_month: card.expMonth.value,
      cvv2: card.ccv.value,
      holder_name: card.ownerName.value   
    }
    return tokenData;
  }

  public mapChargeRequest(amount: string, user: any, description: string): object {
      amount = amount.replace(/,/g, '');
      const chargeRequest ={
        paymentInfo: {
          method: 'card',
          source_id: this.tokenId,
          amount: +amount,
          currency: 'MXN',
          description: description,
          capture: true
        },
        saveCard: true
      }
     const deviceSession = this.openPay.deviceData.setup(chargeRequest);
     chargeRequest.paymentInfo['device_session_id'] = deviceSession;
     console.log('chargeRequest >> ', chargeRequest);
     return chargeRequest;
  }

  public chargeClient(chargeobj: any, userToken: string, transID?: string): Subscription {
    const headers: any = {
      'Content-Type': 'application/json',
      'Authorization': 'token ' + userToken
    }; 
    const url: string = transID ? '/api/transactions/' + transID + '/pay' : '/api/transactions/pay';
    return this.api.post('https://fierce-falls-25549.herokuapp.com' + url , chargeobj, headers).subscribe(
      data => {
        console.log('charged data sucess!', data);
        this.sucessPaymentId = data['paymentResult'].id;
      },
      error => {
       this.globalService.clearErroMessages();
       this.globalService.setErrorMEssage('Ops! no hacer el cargo por el momento');
       this.globalService.setSubErrorMessage(error._body && error._body.code);
       this.globalService.openErrorModal();
        console.error('error making charge to customers', error);
      });
  }

  public transfer(qrObj: {identifier: string, transactionId: string}, transferData: any, userToken: string): Subscription {
    const headers: any = {
      'Content-Type': 'application/json',
      'Authorization': 'token ' + userToken
    };
    console.log('qrObj identifier', qrObj.identifier);
    const url: string = '/api/transactions/' + qrObj.transactionId + '/reward/' + qrObj.identifier;
    return this.api.post('https://fierce-falls-25549.herokuapp.com' + url , transferData, headers).subscribe(
      data => {
        console.log('transfer sucess!', data);
        this.trasnferData = data;
      },
      error => {
       this.globalService.clearErroMessages();
       this.globalService.setErrorMEssage('Ops! no hacer el cargo por el momento');
       if (error._body && error._body.code) {
         this.globalService.setSubErrorMessage(error._body.code);
       }
       this.globalService.openErrorModal();        
        console.error('error making a transfer', error);
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