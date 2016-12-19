import { Component} from '@angular/core';

@Component({
  selector: 'lostfound-form',
  template: '<h1>{{formpage}} </h1><div>dogs name:<input type="text" name="dogname"></div>'
})
export class lostformComponent {
  public formpage: string;
  constructor () {
    this.formpage = 'ohh!  have you lost/found a dog?';
  }
};
