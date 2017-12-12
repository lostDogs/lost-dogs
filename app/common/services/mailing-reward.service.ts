import { Injectable} from '@angular/core';
import {ApiService} from '../services/api.service';
import {Subscription} from 'rxjs/Rx';

@Injectable()
export class MailingRewardService {
  private _endpointUrl: string = 'https://fierce-falls-25549.herokuapp.com/api/dogs/';

  constructor(private api: ApiService) {
  }

  public sendEmailsToUsers(lost: boolean, userToken: string, dogId: string): Subscription {
    const headers: any = {
      'Content-Type': 'application/json',
      'Authorization': 'token ' + userToken
    };
    const lostFound: string = lost ? 'lost' : 'found';
    const url: string = this._endpointUrl + dogId + '/' + lostFound;
    return this.api.post(url , {}, headers).subscribe(data => {
      console.log('sucess', data);
    });
  }
}


