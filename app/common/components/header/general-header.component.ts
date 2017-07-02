import {Component,Directive, OnInit} from '@angular/core';

@Component({
  selector: 'general-header',
  template: require('./general-header.template.html'),
  styles: [ require('./_general-header.scss')],
})

export class generalHeaderComponent implements OnInit  {
  public showLoginFrom : boolean;
  public offsetY: string;
  constructor () {
  }
  public toggleLoginFrom(event: any) {
    this.offsetY = 50 + event.pageY- event.offsetY + 'px';
    this.showLoginFrom = !this.showLoginFrom;    
  }

  ngOnInit() {
      $('.home-mobile').sideNav({
        menuWidth: 700,
        closeOnClick: true,
        draggable: true
      });
  }
};