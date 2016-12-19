import { Component} from '@angular/core';

@Component({
  selector: 'profile',
  template: '<h3>{{profilepage}}</h3> <img  alt="profile_picture" style="width:150px;height:150px;"><div>name: el loco fer<div><br>'
})
export class profileComponent {
  public profilepage: string;
  constructor () {
    this.profilepage = 'Your profile...';
  }
};
