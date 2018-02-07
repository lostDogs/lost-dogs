import { Injectable} from '@angular/core';
import {ApiService} from '../services/api.service';
import {Subscription} from 'rxjs/Rx';
import {Router} from '@angular/router';
import {GlobalFunctionService} from  '../services/global-function.service';

@Injectable()
export class MailingRewardService {
  public transaction: any;
  public invalidTransactionId: boolean;
  public errorInEmails: boolean;
  public evidence: {picture?: string, text?: string};
  public uploadImgSucess: boolean;

  constructor(private api: ApiService, public router: Router, public globalService: GlobalFunctionService) {
    this.evidence = {};   
  }

  public sendEmailsToUsers(lost: boolean, userToken: string, dogId: string, paymentInfo?: any): Subscription {
    const headers: any = {
      'Content-Type': 'application/json',
      'Authorization': 'token ' + userToken
    };
    const lostFound: string = lost ? 'lost' : 'found';
    paymentInfo = paymentInfo || {};
    const url: string = this.api.API_PROD + 'dogs/' + dogId + '/' + lostFound;
    const evidenceObj = { 'fileType': localStorage.getItem('evidence-picture-0') && 'image/jpeg' , 'evidenceText': localStorage.getItem('evidence-text-0') };
    return this.api.post(url , Object.assign(paymentInfo, evidenceObj), headers).subscribe(
      data => {
        this.errorInEmails = false;
        localStorage.removeItem('evidence-text-0');
        this.uploadImgSucess = !localStorage.getItem('evidence-picture-0');
        data['uploadEvidenceUrl'] && this.uploadToBucket(data['uploadEvidenceUrl']);
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
    return this.api.get(this.api.API_PROD + 'transactions/' + transactionId , undefined, headers).subscribe(data => {
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

  public uploadToBucket(url: string): void {
    const img = localStorage.getItem('evidence-picture-0');
   if (img) {
     fetch(img)
      .then(res => res.blob())
      .then(blob => {
        this.api.put(url, blob, {'Content-Type': 'image/jpeg', 'Content-encoding': 'base64'}).subscribe(
          data => {
            this.uploadImgSucess = true;
            localStorage.removeItem('evidence-picture-0');
          },
          error => {
            this.uploadImgSucess = false;
            this.globalService.clearErroMessages();
            this.globalService.setErrorMEssage('No pudimos agregar la imagen');
            this.globalService.openErrorModal();
          }
        )
      })    
    }
  }
}


