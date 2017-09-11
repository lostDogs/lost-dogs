import { Component} from '@angular/core';
import {DogCardService} from '../../common/services/dog-card.service';
require('../../common/plugins/masks.js');

@Component({
  selector: 'lostfound-form',
  template: require('./lostfound.template.html'),
  styles: [ require('./lostfound.scss')]
})
export class lostformComponent {
  public dogCards: number[];
  public question: string;
  public inputField: {type: string, label: string};
  public answer: string;

  constructor (public dogCardService: DogCardService) {
    this.dogCards = [];
    for (let i = 0; i < 13; ++i) {
      this.dogCards.push(i);
    }
  }
  public ngOnInit(): void {
    $('#question').mask('0000/00/00');
  }

};
