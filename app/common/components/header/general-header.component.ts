import { Component} from '@angular/core';
@Component({
  selector: 'general-header',
  template: require('./general-header.template.html'),
  styles: [ require('./_general-header.scss')]
})
export class generalHeaderComponent {

  constructor () {
  }
};