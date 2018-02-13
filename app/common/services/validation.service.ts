import {Injectable} from '@angular/core';

@Injectable ()
export class ValidationService {
  public errors: any = {};
  public cardType: string;
  public VISA: string = 'visa';
  public MASTER: string = 'MasterCard';
  public AMEX: string = 'Amex';
  constructor(){
    this.errors.onlyNumbers = {};
  };

  public name(field: string):boolean {
    const nameRegex: RegExp = /^(?!.*\s\s)(?!.*-)[a-zA-Z- ]+$/i;
    if (!nameRegex.test(field) || !field) {
      this.errors.name = 'únicamente letras';
      return false;
    }
    return true;
  }

  public phone(field: string): boolean {
    const phoneRegex: RegExp = /^[0-9-\.\+\(\)]+$/i;
    if (!phoneRegex.test(field)) {
      this.errors.phone = 'únicamente números';
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
      this.errors.userName = 'únicamente letras y números entre 5 y 30';
      return false;
    }
    return true;
  }

  public onlyNumbers(field: string, min: number = undefined, max: number = undefined, fieldName: string): boolean {
    if ((typeof min !== 'number') || (typeof max !== 'number')) {
      min = 0;
      max = 100;
    }
    field = field ? field :  '1';
    const regexVar: string = '^[0-9]{min,max}$';
    const numRegex: RegExp = new RegExp(regexVar.replace('min', String(min)).replace('max', String(max)));
    if (!numRegex.test(field)) {
      const errorMessage = 'números entre ' + min + ' y ' + max;
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

   public stringHipensNumber(field: string): boolean {
    const nameRegex: RegExp = /^(?!.*\s\s)(?!.*--)[a-zA-Z0-9-\s]+$/i;
    if (!nameRegex.test(field) || !field) {
      this.errors.stringHipensNumber = 'letras, guiones y números';
      return false;
    }
    return true;
  } 

  public postalCode(field: string): boolean {
    const postalCodeRegex: RegExp = /^[a-z0-9-\s]+$/i;
    if (!field) {
      return false;
    } else if (!postalCodeRegex.test(field)) {
      this.errors.postalCode = 'números y letras';
      return false;
    }
    return true;
  }

  public password(field: string): boolean {
    const passwordRegex: RegExp = /^[\S]+$/i;
    if (!field || !passwordRegex.test(field) || field.length < 7 || field.length > 15) {
      this.errors.password = 'sin espacios y entre 7 y 15 caracters';
      return false;
    }
    return true;
  }

  public passMatch(field1: string, field2: string): boolean {
    if (!field2) {
      return false;
    } else if (field2 !== field1) {
      this.errors.passMatch = 'las contraseñas no coinciden';
      return false;
    }
    return true;
  }

  public cardLength(cardNumber: string, maxLength: number): boolean {
    const noHyphen = cardNumber.replace(/-/g, '');
    if (noHyphen.length < maxLength) {
      this.errors.creditcard = 'debe tener al menos ' + maxLength +  ' dígitos';
      return false;
    }
    return true;
  }

  public cardDetector(cardNumber: string): boolean {
    const firstTwoDigits: number = +cardNumber.substring(0, 2);
    if (cardNumber.charAt(0) === '4') {
      this.cardType = this.VISA;
      return true;
    } else if (firstTwoDigits >= 51 && firstTwoDigits <= 55 ) {
      this.cardType = this.MASTER;
      return true;
    } else if (firstTwoDigits >= 22 && firstTwoDigits <= 27 ) {
      this.cardType = this.MASTER;
      return true;
    } else if (firstTwoDigits === 34 || firstTwoDigits === 37) {
      this.cardType = this.AMEX;
      return true;
    } else {
      this.cardType = undefined;
      this.errors.creditcard = 'tarjeta no valida';
      return false;
    }
  }

  public creditcard(cardNumber: string): boolean {
    if (cardNumber && cardNumber.length) {
      const cardDetector: boolean = this.cardDetector(cardNumber);
      let cardLenght: boolean;
      if ( cardDetector && this.cardType === this.VISA) {
        cardLenght = this.cardLength(cardNumber, 13);
      }else if (cardDetector && this.cardType === this.MASTER) {
        cardLenght = this.cardLength(cardNumber, 16);
      }else if (cardDetector && this.cardType === this.AMEX) {
      cardLenght = this.cardLength(cardNumber, 15);
      }
      return cardDetector && cardLenght;
    }
    this.errors.creditcard = 'requerido ';
    this.cardType = undefined;
    return false;
  }

  public getCardnumber(cardNumber: string): number {
    const noHyphen = cardNumber.replace(/-/g, '');
    return +noHyphen;
  }

}
