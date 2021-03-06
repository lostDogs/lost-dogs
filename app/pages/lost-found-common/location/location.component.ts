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
    this.LostService.inputField = {type:'address', label:''}
    if (this.LostService.parentPage === 'lost') {
      this.LostService.question = '¿Dónde lo perdiste?';
    } else if(this.LostService.parentPage === 'found') {
      this.LostService.question = '¿Dónde lo econtraste?';
    }
  }

   public fillData(pageAnswer: any, lostService: any): void {
    if (pageAnswer) {
      lostService.address = pageAnswer.address;
      lostService.latLng = pageAnswer.latLng;
    }
  }

}
