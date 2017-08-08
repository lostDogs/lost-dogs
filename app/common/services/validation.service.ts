import {Injectable} from '@angular/core';

@Injectable ()
export class ValidationService {
  public errors: any = {};

  constructor(){
    this.errors.onlyNumbers = {};
  };

  public name(field: string):boolean {
    const nameRegex: RegExp = /^(?!.*\s\s)(?!.*-)[a-zA-Z- ]+$/i;
    if (!nameRegex.test(field) || !field) {
      this.errors.name = 'unicamente letras';
      return false;
    }
    return true;
  }

  public phone(field: string): boolean {
    const phoneRegex: RegExp = /^[0-9-\.\+\(\)]+$/i;
    if (!phoneRegex.test(field)) {
      this.errors.phone = 'unicamente numeros';
      return false;
    }
    return true;
  }

  public email(field: string): boolean {
    const emailRegex: RegExp = /^[\w\-\.\+]+@[\w\-\.\+]+\.[A-Za-z]{2,}$/;
    if (!emailRegex.test(field)) {
      this.errors.email = 'debe terminar en @XXX.com';
      return false;
    }
    return true;
  }

  public userName(field: string): boolean {
    const userNameRegex: RegExp = /^([a-zA-Z0-9]{5,30})$/i;
    if (!field || !userNameRegex.test(field)) {
      this.errors.userName = 'unicamente letras y numeros entre 5 y 30';
      return false;
    }
    return true;
  }

  public onlyNumbers(field: string, min: number = undefined, max: number = undefined, fieldName: string): boolean {
    if (!min || !max) {
      min = 0;
      max = 100;
    }
    field = field ? field :  '1';
    const regexVar: string = '^[0-9]{min,max}$';
    const numRegex: RegExp = new RegExp(regexVar.replace('min', String(min)).replace('max', String(max)));
    if (!numRegex.test(field)) {
      const errorMessage = 'numeros entre ' + min + ' y ' + max;
      if(fieldName) {
        this.errors.onlyNumbers[fieldName] = errorMessage;
      } else  {
        this.errors.onlyNumbers.default = errorMessage;
      }
      return false;
    }
    return true;
  }

  public stringHipens(field: string): boolean {
    const nameRegex: RegExp = /^(?!.*\s\s)(?!.*--)[a-zA-Z- ]+$/i;
    if (!nameRegex.test(field) || !field) {
      this.errors.stringHipens = 'letras y guiones';
      return false;
    }
    return true;
  }

  public postalCode(field: string): boolean {
    const postalCodeRegex: RegExp = /^[a-z0-9-\s]+$/i;
    if (!field) {
      return false;
    } else if (!postalCodeRegex.test(field)) {
      this.errors.postalCode = 'numeros y letras';
      return false;
    }
    return true;
  }

  public password(field: string): boolean {
    const passwordRegex: RegExp = /^[\S]+$/i;
    if (!field || !passwordRegex.test(field) || field.length < 7 || field.length > 15) {
      this.errors.password = 'sin espacion y entre 7 y 15 caracters';
      return false;
    }
    return true;
  }

  public passMatch(field1: string, field2: string): boolean {
    if (!field2) {
      return false;
    } else if (field2 !== field1) {
      this.errors.passMatch = 'las contrasenias no coinciden';
      return false;
    }
    return true;
  }


}
