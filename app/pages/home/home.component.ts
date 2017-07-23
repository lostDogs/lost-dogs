import { Component, HostListener, Inject} from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser';
import {ScrollService} from '../../common/services/scroll.service';

@Component({
  selector: 'home',
  template: require('./home.template.html'),
  styles: [ require('./_home-style.scss')]
})

export class homeComponent {
  public scrollnormalize: number
  constructor (@Inject(DOCUMENT) private document:  Document, public scrollService : ScrollService) { }
  @HostListener('window:scroll', ['$event'])
  onWindowScroll() {
    const scrollMax: number = 300;
    const scrollTop = this.document.body.scrollTop;
    this.scrollnormalize = (scrollMax - scrollTop) / scrollMax;
    this.scrollService.scrollOpacity = 1.2 - this.scrollnormalize;
  }  
};
