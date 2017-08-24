import { Http, Response, Headers, RequestOptions, URLSearchParams} from '@angular/http';
import { Injectable } from '@angular/core';
import {Observable} from 'rxjs/Rx';

@Injectable()
export class ApiService {
  constructor (public http: Http) { }

  public get(url: string, queryObj?: any): Observable<Response> {
    console.log('calling GET! >');
    let headers: Headers = new Headers({ 'Content-Type': 'application/json' });
    let options: RequestOptions = new RequestOptions({ headers: headers });
    let queryParams: URLSearchParams =  new URLSearchParams();
    if (queryObj) {
      for (let key in queryObj) {
        queryParams.set(key, queryObj[key]);
      }
      url = url + queryParams;
    }
      console.log('url', url);
    return this.http.get(url, options)
      .map((res: Response) =>  res.json())
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }

  public post(url: string, bodyObj: any): Observable<Response> {
    console.log('calling POST! >');
    let headers: Headers = new Headers({ 'Content-Type': 'application/json' });
    let options: RequestOptions = new RequestOptions({ headers: headers });
    let queryParams: URLSearchParams =  new URLSearchParams();
    return this.http.post(url, bodyObj, options)
      .map((res: Response) =>  res.json())
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }

  public put(url: string, bodyObj: any, header?: any): Observable<Response> {
    console.log('calling PUT! >');
    let headersObj: any;
    if ( !header) {
      headersObj = {'Content-Type': 'application/json'};
    } else {
      headersObj = header;
    }
    let headers: Headers = new Headers(headersObj);
    let options: RequestOptions = new RequestOptions({ headers: headers });
    let queryParams: URLSearchParams =  new URLSearchParams();
    return this.http.put(url, bodyObj, options)
      .map((res: Response) =>  res)
      .catch((error: any) => Observable.throw(error || 'Server error'));
  }  
  
}