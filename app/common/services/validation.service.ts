import {Injectable} from '@angular/core';

@Injectable ()
export class ValidationService {
  
  constructor(){};

  public name(field: string):boolean {
    const nameRegex: RegExp = /^(?!.*\s\s)(?!.*-)[a-zA-Z- ]+$/i;
    if (!nameRegex.test(field) || !field) {
      return false;
    }
    return true;
  }

  public phone(field: string): boolean {
    const phoneRegex: RegExp = /^[0-9-\.\+\(\)]+$/i;
    if (!phoneRegex.test(field)) {
      return false;
    }
    return true;    
  }

  public email(field: string): boolean {
    const emailRegex: RegExp = /^[\w\-\.\+]+@[\w\-\.\+]+\.[A-Za-z]{2,}$/;
    if (!emailRegex.test(field)) {
      return false;
    }
    return true;
  }

  public userName(field: string): boolean {
    const userNameRegex: RegExp = /^([a-zA-Z0-9]{5,30})$/i;
    if (!field || !userNameRegex.test(field)) {
      return false;
    }
    return true;
  }
}
