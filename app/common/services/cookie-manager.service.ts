import { Injectable } from '@angular/core';
@Injectable()
export class CookieManagerService {
  constructor() {}

 public setCookie(name: string, value: any): void {
    if(value instanceof Object) {
      value = JSON.stringify(value);
    }
    window.document.cookie =  name + '=' + value + '; path=/';
  }

  public deleteCookie(name: string): void {
    if (this.getCookie) {
          document.cookie = name + '=' + ';expires=Thu, 01 Jan 1970 00:00:01 GMT';
    }
  }

  public getCookie(name: string): any {
    const regex = new RegExp('[; ]'+name+'=([^\\s;]*)');
    const sMatch = (' ' + document.cookie).match(regex);
    if (name && sMatch)  {
      try {
        const input = sMatch[1];
        return JSON.parse(input);

      } catch (e) {
        console.error('error in json parser in get cookie', e);
      }
    }
    return null;
  }
}


