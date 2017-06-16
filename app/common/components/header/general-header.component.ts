import { Component,Directive, OnInit} from '@angular/core';

@Component({
  selector: 'general-header',
  template: require('./general-header.template.html'),
  styles: [ require('./_general-header.scss')],

})
export class generalHeaderComponent implements OnInit  {
  constructor () {
  }

  ngOnInit() {
      $('.home-mobile').sideNav();
  }
};