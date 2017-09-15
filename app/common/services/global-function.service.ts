import { Injectable } from '@angular/core';


@Injectable()
export class GlobalFunctionService {
  public scrollOpacity: number = .1;

  public globalError: boolean;
  public openErrorModal: () => void;
  public closeErrorModal: () => void;
  public errorMessages: string[];
  public subErrorMessage: string[];
  public mapsApi: any;
  constructor() {
    this.errorMessages = [];
    this.subErrorMessage = [];
  }

  public setErrorMEssage(erorr: string): void {
    this.errorMessages.push(erorr);
  }

  public setSubErrorMessage(subError: string): void {
    this.subErrorMessage.push(subError);
  }

  public clearErroMessages(): void {
    this.errorMessages = [];
    this.subErrorMessage = [];
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