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
  constructor(public LostService: LostFoundService) {
    this.window = window;
    this.LostService.question2 = undefined;
    this.LostService.question3 = undefined;
    this.LostService.question = 'Revisa los datos!';
  }

  public ngOnInit(): void {
    this.LostService.pageAnswers.forEach((answer: any, index: number) => {
      let names: string[] = [];
      let imgUrls: string[] = [];
      if(Array.isArray(answer)) {
        answer.forEach((innerAns: any, innerIndex: number) => {
          names.push(innerAns.name);
          imgUrls.push(innerAns.imgUrl);
        });
        this.LostService.pageAnswers[index] = [{names: names, imgUrls: imgUrls}];
      }
    });
    this.LostService.inReviewPage = true;
  }
}
