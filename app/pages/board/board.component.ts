import { Component} from '@angular/core';

@Component({
  selector: 'board',
  template: '<h1>{{mainboard}} </h1>'
})
export class boardComponent {
  public mainboard: string;
  constructor () {
    this.mainboard = 'Here is the main board';
  }
};
