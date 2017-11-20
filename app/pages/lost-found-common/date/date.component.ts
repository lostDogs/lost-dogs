import {Component} from '@angular/core';
import {LostFoundService} from '../../../common/services/lost-found.service';

@Component({
  selector: 'date',
  template: require('./date.template.html'),
  styles: [ require('./date.scss')]
})

export class DateComponent { 
  constructor(public LostService: LostFoundService) {
    this.LostService.question2 = undefined;
    this.LostService.question3 = undefined;
    this.LostService.optional = false;
  }

  public ngOnInit(): void {
    this.LostService.retrieveData = this.fillData;
    this.LostService.inputField = {type: 'date', label: 'dd/mm/aaaa'};

    if (this.LostService.parentPage === 'lost') { 
      this.LostService.question = 'Cuando lo Perdiste?';
    } else if(this.LostService.parentPage === 'found') {
      this.LostService.question = 'Cuando lo Encontraste?';
    }
  }

  public fillData(pageAnswer: any, lostService: any): void {
    if (pageAnswer) {
      lostService.answer = pageAnswer;
      lostService.rechangeDate = pageAnswer;
    }
  }  
}
