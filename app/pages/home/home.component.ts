import { Component} from '@angular/core';

@Component({
  selector: 'home',
  template: require('./home.template.html'),
  styles: [ require('./_home-style.scss')]
})
export class homeComponent {
  public dir: string;
  constructor () { }
};
