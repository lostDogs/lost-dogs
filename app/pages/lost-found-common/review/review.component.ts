import {Component} from '@angular/core';
import {LostFoundService} from '../../../common/services/lost-found.service';
import {Router} from '@angular/router';
import {DogCardService} from '../../../common/services/dog-card.service';

@Component({
  selector: 'review',
  template: require('./review.template.html'),
  styles: [ require('./review.scss')]
})

export class ReviewComponent { 
  public imgwidth: number = 80 / 2;
  public window: Window;
  public pageAnswersCopy: any[];

  constructor(public LostService: LostFoundService, public router: Router, public dogCardService: DogCardService) {
    this.window = window;
    this.LostService.question2 = undefined;
    this.LostService.question3 = undefined;
    this.LostService.question = 'Revisa los datos!';
    this.LostService.imgAnswer = undefined;
    this.LostService.answer = undefined;
    this.LostService.inputField = undefined;
  }


  public ngOnInit(): void {
    this.setReviewToLocalStorage();
    this.LostService.getReviewFromLocalStorage();
    this.dogCardService.open = false;
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
     this.setFinalToLocalStorage();
  }

  public toPaymentForm(): void {
    this.router.navigate(['payment/form'], {queryParams:{Cr: true}});
  }

  public setFinalToLocalStorage(): void {
    console.log('saving to localStorage');
    if (Array.isArray(this.LostService.pageAnswers) && this.LostService.pageAnswers[0]) {
      const dog: any = this.LostService.objDogBuilder();
      localStorage.setItem('reported-dog-data', JSON.stringify(dog));
    }
  }

  public setReviewToLocalStorage(): void {
    if (Array.isArray(this.LostService.pageAnswers) && this.LostService.pageAnswers[0]) {
     localStorage.setItem('temp-anwers', JSON.stringify(this.LostService.pageAnswers));
    }
    if (this.LostService.reward && this.LostService.reward !== this.LostService.defaultReward) {
     localStorage.setItem('temp-reward', JSON.stringify(this.LostService.reward)); 
    }
    if (this.LostService.dogName) {
      localStorage.setItem('temp-name', JSON.stringify(this.LostService.dogName)); 
    }
    if (this.LostService.comments) {
      localStorage.setItem('temp-comments', JSON.stringify(this.LostService.dogName)); 
    }
    if (this.LostService.dogPicture && this.LostService.dogPicture !== this.LostService.defaultDogPic) {
      localStorage.setItem('reported-dog-img-0', this.LostService.dogPicture);
    }    
  }
}
