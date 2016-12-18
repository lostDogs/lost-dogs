import { Component} from '@angular/core';

@Component({
  selector: 'home',
  template: '<h1>{{homepage}} </h1>'
})
export class homeComponent {
  public homepage: string;
  constructor () {
    this.homepage = 'Welcome! This is Home Page :)';
  }
};
