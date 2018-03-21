import {Component} from '@angular/core';
import {LostFoundService} from '../../../common/services/lost-found.service';
@Component({
  selector: 'gender',
  template: require('./gender.template.html'),
  styles: [ require('./gender.scss')]
})

export class GenderComponent {

  constructor(public LostService: LostFoundService) {
    this.LostService.question2 = undefined;
    this.LostService.question3 = undefined;
    this.LostService.optional = false;
  }
  
  public ngOnInit(): void {
    this.LostService.question = '¿Cuál es su género?';
    this.LostService.imgAnswer = undefined;
    this.LostService.inputField = {type: 'image', label: 'Gender'};
    this.LostService.retrieveData = this.fillData;
  }

  public fillData(pageAnswer: any, lostService: any): void {
    if (pageAnswer) {
      lostService.imgAnswer = pageAnswer;
    }
  }

  public changeElement(event: any): void {
    this.LostService.imgAnswer = event;
    this.LostService.setAnwer();
  }
}
