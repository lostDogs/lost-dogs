import { Injectable} from '@angular/core';
import {ApiService} from '../services/api.service';
import {Subscription} from 'rxjs/Rx';
import {Router} from '@angular/router';
import {GlobalFunctionService} from  '../services/global-function.service';

@Injectable()
export class MailingRewardService {
  private _endpointUrl: string = 'https://fierce-falls-25549.herokuapp.com/api/';
  // public transaction: {lost_id?: string, found_id?: string, dog_id?: string, status?: string, id?: string};
  public transaction: any;
  public invalidTransactionId: boolean;
  public errorInEmails: boolean;

  constructor(private api: ApiService, public router: Router, public globalService: GlobalFunctionService) {}

  public sendEmailsToUsers(lost: boolean, userToken: string, dogId: string, paymentInfo?: any): Subscription {
    const headers: any = {
      'Content-Type': 'application/json',
      'Authorization': 'token ' + userToken
    };
    const lostFound: string = lost ? 'lost' : 'found';
    paymentInfo = paymentInfo || {};
    const url: string = this._endpointUrl + 'dogs/' + dogId + '/' + lostFound;
    return this.api.post(url , paymentInfo, headers).subscribe(
      data => {
        console.log('sucess', data);
        this.errorInEmails = false;
      }, error => {
          this.errorInEmails = true;
         this.globalService.clearErroMessages();
         this.globalService.setErrorMEssage('Ops! hubo un error en la peticion');
         this.globalService.setSubErrorMessage('Intenta más tarde!');
         this.globalService.openErrorModal();        
      });
  }

  public getTransaction(userToken: string, transactionId: string): Subscription {
    const headers: any = {
      'Content-Type': 'application/json',
      'Authorization': 'token ' + userToken
    };
    return this.api.get(this._endpointUrl + 'transactions/' + transactionId , undefined, headers).subscribe(data => {
      console.log('sucess', data);
      this.transaction = data;
      this.invalidTransactionId = false;
    },
    error => {
        // not error.code === 404 then invalid trans else open global error message.
        this.invalidTransactionId = true;
         this.globalService.clearErroMessages();
         this.globalService.setErrorMEssage('Ops! no se pudo obtener la transaction');
         this.globalService.setSubErrorMessage('Intenta más tarde!');
         this.globalService.openErrorModal();
         //this.router.navigateByUrl('/home');
    });
  }
}


