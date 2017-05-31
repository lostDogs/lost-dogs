import { Component} from '@angular/core';
import {ViewEncapsulation} from '@angular/core';
// <div><a routerLink="home">home</a>  <a routerLink="board">board</a>  <a routerLink="account">account</a>  <a routerLink="lostfound">lostfound</a>  <a routerLink="profile">profile</a>  <a routerLink="selection">selection</a></div>
@Component({
  selector: 'my-app',
  encapsulation: ViewEncapsulation.None,
  template: '<general-header></general-header><router-outlet></router-outlet><div>{{footer}}</div>',
  styles: [require('./main.scss')]
})
export class appComponent {
  public header: string;
  public footer: string;
  constructor () {
    this.header = 'this is the header';
    this.footer = 'this is the footer';
  }
};
