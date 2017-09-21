import {Component} from '@angular/core';
import {LostFoundService} from '../../../common/services/lost-found.service';
@Component({
  selector: 'location',
  template: require('./location.template.html'),
  styles: [ require('./location.scss')]
})

export class LocationComponent { 
constructor(public LostService: LostFoundService) {}
}
