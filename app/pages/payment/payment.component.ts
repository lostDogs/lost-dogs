import {Component} from '@angular/core';
import {DomSanitizer, SafeHtml} from '@angular/platform-browser';
import {Router} from '@angular/router';
import {GlobalFunctionService} from '../../common/services/global-function.service';
require('../../common/plugins/masks.js');

@Component({
  selector: 'payment',
  template: require('./payment.template.html'),
  styles: [ require('./payment.scss')]
})

export class PaymentComponent {
  constructor(public globalService: GlobalFunctionService) {}
}