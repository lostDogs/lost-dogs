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
  public MERCHANT_ID: string = process.env.MERCHANT_ID;
  public PUBLIC_KEY: string = process.env.PUBLIC_KEY;
  public trasnferData: any;
  public loadingTrasnfer: boolean;
  public refundData: any;
  public dataPayment: any;

  constructor (public api: ApiService, public globalService: GlobalFunctionService) {}

  public initOpenPay(): void {
    if (!this.init) {
      this.openPay =window['OpenPay'];
      this.openPay.setId(this.MERCHANT_ID);
      this.openPay.setApiKey(this.PUBLIC_KEY);
      this.openPay.setSandboxMode(process.env.ENV !== 'prd');
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
          console.error('error in token >', error);
          this.tokenId = undefined;
          this.globalService.clearErroMessages();
          this.globalService.setErrorMEssage('Error al generar el token');
          this.globalService.openErrorModal();
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
      amount = typeof amount === 'string'  ? amount.replace(/,/g, ''): amount;
      const chargeRequest ={
        paymentInfo: {
          method: 'card',
          source_id: this.tokenId,
          amount: +amount,
          currency: 'MXN',
          description: description,
          capture: true
        },
        saveCard: false
      }
     const deviceSession = this.openPay.deviceData.setup(chargeRequest);
     chargeRequest.paymentInfo['device_session_id'] = deviceSession;
     console.log('chargeRequest >> ', chargeRequest);
     return chargeRequest;
  }

  public chargeClient(chargeobj: any, userToken: string, transID?: string): Subscription {
    this.dataPayment = undefined;
    this.sucessPaymentId = undefined;
    const headers: any = this.setheards(userToken);
    const url: string = transID ? 'transactions/' + transID + '/pay' : '/api/transactions/pay';
    return this.api.post(this.api.API_PROD + url , chargeobj, headers).subscribe(
      data => {
        console.log('charged data sucess >', data);
        this.sucessPaymentId = data['paymentResult'].id;
        this.dataPayment = data['paymentResult'];
      },
      error => {
        const bodyCode: string = JSON.parse(error._body)['code'];
        this.sucessPaymentId = undefined;
        this.dataPayment = undefined;
       this.globalService.clearErroMessages();
       if (/bounce/g.test(bodyCode) || /omplain/g.test(bodyCode)) {
         this.globalService.setErrorMEssage('Tu correo ha sido marcado como invalido');
         this.globalService.setSubErrorTemplate('cambialo en <a  routerLink="/profile/edit">Mi cuenta</a>');
       } else {
         this.globalService.setErrorMEssage('Ops! no hacer el cargo por el momento');
         this.globalService.setSubErrorMessage(error._body && error._body.code);
       }
       this.globalService.openErrorModal();
       console.error('error making charge to customers >', error);
      });
  }

  public transfer(qrObj: {identifier: string, transactionId: string}, transferData: any, userToken: string): Subscription {
    const headers: any = this.setheards(userToken);
    console.log('qrObj identifier >', qrObj.identifier);
    const url: string = 'transactions/' + qrObj.transactionId + '/reward/' + qrObj.identifier;
    this.loadingTrasnfer = true;
    return this.api.post(this.api.API_PROD + url , transferData, headers).subscribe(
      data => {
        console.log('transfer sucess >', data);
        this.trasnferData = data;
        this.loadingTrasnfer = false;
      },
      error => {
        this.loadingTrasnfer = false;
        this.globalService.clearErroMessages();
        const bodyCode: string = JSON.parse(error._body)['code'];
        if (/Refund/g.test(bodyCode) || /Reward/g.test(bodyCode) && error.status === 409) {
          this.globalService.setErrorMEssage(/Reward/g.test(bodyCode) ? 'Ya se solicitó la recompensa' : 'Ya se solicitó el rembolso');
        } else {
          this.globalService.setErrorMEssage('Ups! no hacer el cargo por el momento');
          this.globalService.setSubErrorMessage('Intenta más tarde!');
        }
        this.globalService.openErrorModal();
        console.error('error making a transfer >', error);
      });
  }

  public refund(userToken: string, transactionId: string, reason?: string): Subscription {
    const headers: any = this.setheards(userToken);
    const url: string = 'transactions/' + transactionId + '/refund';
    const reasonObj = reason ? {reason: reason} : {};
    return this.api.delete(this.api.API_PROD + url , reasonObj, headers).subscribe(
      data => {
        this.refundData = true;
      },
      error => {
        this.refundData = undefined;
        this.globalService.clearErroMessages();
        const bodyCode: string = JSON.parse(error._body)['code'];
        if (/Refund/g.test(bodyCode) || /Reward/g.test(bodyCode) && error.status === 409) {
          this.globalService.setErrorMEssage(/Reward/g.test(bodyCode) ? 'Ya se solicitó la recompensa' : 'Ya se solicitó el rembolso');
        } else {
          this.globalService.setErrorMEssage('Ups! no hacer el rembolso por el momento');
          this.globalService.setSubErrorMessage('Intenta más tarde!');
        }
        this.globalService.openErrorModal();
       console.error('error at refund call >', error);
      }
    );
  }

  public setheards(userToken: string, configObj?: any): any {
    configObj = configObj || {};
    const headers: any = {
      'Content-Type': 'application/json',
      'Authorization': 'token ' + userToken
    };
    Object.assign(headers, configObj);
    return headers;
  }

  public validateExpiry(month: string, year: string): boolean {
    return this.openPay.card.validateExpiry(month, year);
  }
  
}