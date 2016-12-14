import { Component} from '@angular/core';

@Component({
  selector: 'my-app',
  template: '<div>{{hello}}</div>'
})
export class HelloworldComponent {
  public hello: string;
  constructor () {
    this.hello = 'Hello World';
  }
};
