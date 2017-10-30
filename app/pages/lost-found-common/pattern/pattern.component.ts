import {Component} from '@angular/core';
import {LostFoundService} from '../../../common/services/lost-found.service';
@Component({
  selector: 'Pattern',
  template: require('./pattern.template.html'),
  styles: [ require('./pattern.scss')]
})

export class PatternComponent { 
  constructor(public LostService: LostFoundService) {
    this.LostService.question2 = undefined;
    this.LostService.question3 = undefined;
    this.LostService.optional = false;
  }
  
  public ngOnInit(): void {
    this.LostService.imgAnswer = undefined;
    this.LostService.inputField = {type: 'mutiple', label: 'Patron'};
    this.LostService.retrieveData = this.fillData;
    this.LostService.question = 'Cual es su Patron?';
  }

  public fillData(pageAnswer: any, lostService: any): void {
    if (pageAnswer) {
      if (pageAnswer[0].names) {
        const tempAns: any[] = [];
        pageAnswer[0].names.forEach((value: any, index: number) => {
          const obj = {name: value, orginalIndex: pageAnswer[0].Indexs[index]};
          tempAns.push(obj);
        });
        lostService.multipleImgAnswers = tempAns;
      } else {
        lostService.multipleImgAnswers = pageAnswer;
      }

    }
  }

  public changeElement(event: any): void {
    this.LostService.multipleImgAnswers = event;
  }
}
