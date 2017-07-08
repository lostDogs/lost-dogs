import { Component} from '@angular/core';

@Component({
  selector: 'account',
  template: require('./create-account.template.html'),
  styles: [ require('./account-style.scss')]
})
export class accountComponent {
  public accountpage: string;
  constructor () {
    this.accountpage = 'Create your account here';
  }
};