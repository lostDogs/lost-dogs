import {Component} from '@angular/core';
import {LostFoundService} from '../../../common/services/lost-found.service';
@Component({
  selector: 'Pattern',
  template: require('./pattern.template.html'),
  styles: [ require('./pattern.scss')]
})

export class PatternComponent {
  public colorsSelected: string[];
  constructor(public LostService: LostFoundService) {
    this.LostService.question2 = undefined;
    this.LostService.question3 = undefined;
    this.LostService.optional = false;
    this.LostService.multipleImgAnswers = [];
  }
  
  public ngOnInit(): void {
    this.LostService.imgAnswer = undefined;
    this.LostService.inputField = {type: 'multiple', label: 'Patron'};
    this.LostService.retrieveData = this.fillData;
    this.LostService.question = 'Cual es su Patron?';
    const colorIndex: number = this.LostService.defualtSequence.indexOf('color');
    if (~colorIndex) {
      let tempColor: string[] = [];
      this.LostService.pageAnswers[colorIndex].forEach((value: any, index: number) => {
        tempColor.push(value.name)
      });
      this.colorsSelected = tempColor;
    }
  }

  public fillData(pageAnswer: any, lostService: any): void {
    if (pageAnswer) {
      lostService.retrieveMultipleImgAnswers = pageAnswer;
    }
  }

  public changeElement(event: any): void {
    this.LostService.multipleImgAnswers = event;
  }
}
