import { Component} from '@angular/core';

@Component({
  selector: 'account',
  template: '<h2>{{accountpage}}</h2>'
})
export class accountComponent {
  public accountpage: string;
  constructor () {
    this.accountpage = 'Create your account here';
  }
};