import { Component} from '@angular/core';
import {DogCardService} from '../../common/services/dog-card.service';

@Component({
  selector: 'lostfound-form',
  template: require('./lostfound.template.html'),
  styles: [ require('./lostfound.scss')]
})
export class lostformComponent {
  public dogCards: number[];
  constructor (public dogCardService: DogCardService) {
    this.dogCards = [];
    for (let i = 0; i < 13; ++i) {
      this.dogCards.push(i);
    }
  }
};
