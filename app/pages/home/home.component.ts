import { Component, HostListener, Inject} from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser';

@Component({
  selector: 'home',
  template: require('./home.template.html'),
  styles: [ require('./_home-style.scss')]
})

export class homeComponent {
  public dir: string;
  constructor (@Inject(DOCUMENT) private document:  Document) { }
  @HostListener('window:scroll', ['$event'])
  onWindowScroll() {
    let number = this.document.body.scrollTop;
    //console.log('Scrolling', number);
  }  
};
