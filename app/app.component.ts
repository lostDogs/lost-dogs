import { Component} from '@angular/core';
import {ViewEncapsulation} from '@angular/core';
import {Router, NavigationEnd} from '@angular/router';
import 'jquery';
import 'materialize-css/dist/js/materialize.js';
import 'materialize-css/bin/materialize.css';
import 'hammerjs';
import 'hammer-timejs';

@Component({
  selector: 'my-app',
  encapsulation: ViewEncapsulation.None,
  template: '<general-header class="row"></general-header><global-error></global-error><router-outlet></router-outlet><general-footer></general-footer>',
  styles: [require('./main.scss')]
})
export class appComponent {
  constructor (public router: Router) {
    this.router.events.subscribe(data => {
      if (data instanceof NavigationEnd) {
        window.scroll(0,0);
      }
    });
  }
};
