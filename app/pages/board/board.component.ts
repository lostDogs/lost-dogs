import { Component} from '@angular/core';

@Component({
  selector: 'board',
  template: require('./board.template.html'),
  styles: [ require('./board.scss')]
})
export class boardComponent {
  public mainboard: string;
  constructor () {
    this.mainboard = 'Here is the main board';
  }
};
