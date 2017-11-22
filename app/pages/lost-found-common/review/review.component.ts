import {Component} from '@angular/core';
import {LostFoundService} from '../../../common/services/lost-found.service';
@Component({
  selector: 'review',
  template: require('./review.template.html'),
  styles: [ require('./review.scss')]
})

export class ReviewComponent { 
  public imgwidth: number = 80 / 2;
  public window: Window;
  public pageAnswersCopy: any[];

  constructor(public LostService: LostFoundService) {
    this.window = window;
    this.LostService.question2 = undefined;
    this.LostService.question3 = undefined;
    this.LostService.question = 'Revisa los datos!';
    this.LostService.imgAnswer = undefined;
    this.LostService.answer = undefined;
    this.LostService.inputField = undefined;
  }

  public ngOnInit(): void {
    if (this.LostService.reward) {
      const newVal: string = (' ' + this.LostService.reward).replace('.','');
      const rewardNewDecimal: string = newVal.substr(0, newVal.length - 2) + '.' + newVal.substr(newVal.length - 2);
      this.LostService.reward = rewardNewDecimal;
    }
    this.pageAnswersCopy =  JSON.parse(JSON.stringify(this.LostService.pageAnswers));
    this.pageAnswersCopy.forEach((answer: any, index: number) => {
      let names: string[] = [];
      let imgUrls: string[] = [];
      let originalIndexs: number[] = []
      if(Array.isArray(answer)) {
        answer.forEach((innerAns: any, innerIndex: number) => {
          if (innerAns.disabled) {
            names.push(innerAns.name);
            imgUrls.push(innerAns.imgUrl);
            originalIndexs.push(innerAns.orginalIndex);
          }
        });
        this.pageAnswersCopy[index] = [{names: names, imgUrls: imgUrls, Indexs: originalIndexs}];
      }
    });
    this.LostService.inReviewPage = true;
  }
}
