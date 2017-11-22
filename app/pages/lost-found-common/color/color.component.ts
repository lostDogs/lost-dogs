import {Component} from '@angular/core';
import {LostFoundService} from '../../../common/services/lost-found.service';
@Component({
  selector: 'color',
  template: require('./color.template.html'),
  styles: [ require('./color.scss')]
})

export class ColorComponent { 
  constructor(public LostService: LostFoundService) {
    this.LostService.question2 = undefined;
    this.LostService.question3 = undefined;
    this.LostService.optional = false;
    this.LostService.multipleImgAnswers = [];
  }
  
  public ngOnInit(): void {
    this.LostService.imgAnswer = undefined;
    this.LostService.inputField = {type: 'multiple', label: 'Color'};
    this.LostService.retrieveData = this.fillData;
    this.LostService.question = 'Cual es su color?';
  }

  public fillData(pageAnswer: any, lostService: any): void {
    if (pageAnswer) {
      pageAnswer.push('retrieve');
      lostService.multipleImgAnswers = lostService.copyAnswer(pageAnswer);
    }
  }

  public changeElement(event: any): void {
    this.LostService.multipleImgAnswers = event.filter((value: any, index: number)=>{return value.disabled});

  }
}
