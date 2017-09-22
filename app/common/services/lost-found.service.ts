import { Injectable } from '@angular/core';
import {Ielement} from '../components/side-block/side-block.component';
import {Router} from '@angular/router';
@Injectable()
export class LostFoundService {
  public address: string;
  public locationAdressInput: string;
  public location: {lat: number, lng: number};
  public question: string;
  public inputField: {type: string, label: string};
  public answer: string;
  public imgAnswer: Ielement;
  public sequence: [string, string, string];
  public pageAnswers: any[];
  public pagePosition: number;
  public multipleImgAnswers: Ielement[];

  constructor(public router: Router) {
    this.pageAnswers = [];
  }

  public next(parentUrl: string) {
     const nextIndex: number =  this.pagePosition === (this.sequence.length-1) ? this.pagePosition : this.pagePosition + 1;
    const nextPage: string = parentUrl + '/' + this.sequence[nextIndex];
    this.router.navigate([nextPage]);
  }

  public back(parentUrl: string) {
    const nextIndex = this.pagePosition === 0 ? this.pagePosition : this.pagePosition -1;
    const previous: string = parentUrl + '/' + this.sequence[nextIndex];
    this.router.navigate([previous]);
  }

  public setAnwer() {
    this.pageAnswers[this.pagePosition] = this.getGeneralAnswer();
    console.log('answer', this.pageAnswers);
  }

  public tooltipInit(): void {
    if (this.inputField && this.inputField.type === 'image' && this.imgAnswer) {
      $('#' + this.imgAnswer.key).attr('data-tooltip', this.imgAnswer.name);
      $('.tooltipped').tooltip({delay: 50});
    }
  }

  public maskInit(): void {
    if (this.inputField && this.inputField.type === 'date') {
      $('#question').mask('0000/00/00');
    }else {
      $('#question').unmask();
    }
  }

  public getGeneralAnswer(): any {
    if (this.inputField && this.inputField.type === 'date') {
      return this.answer;
    } else if (this.inputField && this.inputField.type === 'address' && this.location && this.address) {
    return {address: this.address, location: this.location};
    } else if(this.imgAnswer && this.imgAnswer.disabled===true) {
     return this.imgAnswer;
    } else if (this.multipleImgAnswers && this.multipleImgAnswers.length) {
      return this.multipleImgAnswers;
    }
    return undefined;
  }
}