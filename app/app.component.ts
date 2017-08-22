import { Component} from '@angular/core';
import {ViewEncapsulation} from '@angular/core';
import 'jquery';
import 'materialize-css/dist/js/materialize.js';
import 'materialize-css/bin/materialize.css';
@Component({
  selector: 'my-app',
  encapsulation: ViewEncapsulation.None,
  template: '<general-header class="row"></general-header><router-outlet></router-outlet><general-footer></general-footer>',
  styles: [require('./main.scss')]
})
export class appComponent {
  constructor () {
  }
};
