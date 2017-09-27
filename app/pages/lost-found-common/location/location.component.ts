import {Component} from '@angular/core';
import {LostFoundService} from '../../../common/services/lost-found.service';
@Component({
  selector: 'location',
  template: require('./location.template.html'),
  styles: [ require('./location.scss')]
})

export class LocationComponent { 
  constructor(public LostService: LostFoundService) {
    this.LostService.question2 = undefined;
    this.LostService.question3 = undefined;  
    this.LostService.optional = false;
  }

  public ngOnInit(): void {
    this.LostService.retrieveData = this.fillData;
  }

   public fillData(pageAnswer: any, lostService: any): void {
    if (pageAnswer) {
      lostService.address = pageAnswer.address;
      lostService.location = pageAnswer.location;
    }
  } 
}
