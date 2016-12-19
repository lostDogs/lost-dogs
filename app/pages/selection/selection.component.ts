import { Component} from '@angular/core';

@Component({
  selector: 'selection',
  template: '<h2>{{selecionpage}}</h2> <input type="button" value="I have lost a dog =..("><input type="button" value="I have found a dog =)"><br>'
})
export class selectionComponent {
  public selecionpage: string;
  constructor () {
    this.selecionpage = 'Make your selection';
  }
};
