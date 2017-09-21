import {Component} from '@angular/core';
import {LostFoundService} from '../../../common/services/lost-found.service';
@Component({
  selector: 'date',
  template: require('./date.template.html'),
  styles: [ require('./date.scss')]
})

export class DateComponent { 
constructor(public LostService: LostFoundService) {}
}
