import { Injectable } from '@angular/core';


@Injectable()
export class GlobalFunctionService {
  public scrollOpacity: number = .1;

  public globalError: boolean;
  public openErrorModal: () => void;
  public openBlueModal: () => void;
  public closeErrorModal: () => void;
  public errorMessages: string[];
  public subErrorMessage: string[];
  public mapsApi: any;
  public paymentRewardSucess: boolean;
  public emailSendedReview: boolean;
  public subErrorTemplate: string;

  constructor() {
    this.errorMessages = [];
    this.subErrorMessage = [];
    window['erroModal'] = this;
  }

  public setErrorMEssage(erorr: string): void {
    this.errorMessages.push(erorr);
  }

  public setSubErrorMessage(subError: string): void {
    this.subErrorMessage.push(subError);
  }

  public setSubErrorTemplate(template: string): void {
    //this.subErrorTemplate = this.domSan.bypassSecurityTrustHtml(template);
    $('#subErrorTemplate').append(template);
    console.log('sub error message', this.subErrorTemplate);
  }

  public clearErroMessages(): void {
    this.errorMessages = [];
    this.subErrorMessage = [];
    $('#subErrorTemplate').empty();
  }

  public parseJsonError(e: any): string {
    let errorMessage: string;
    try {
      errorMessage = JSON.parse(e._body).code;
    } catch(e) {
      errorMessage = e._body;
      console.error('unable to parse json');
    }
    return errorMessage;
  }
}