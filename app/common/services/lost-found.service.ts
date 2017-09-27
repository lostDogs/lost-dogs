import { Injectable } from '@angular/core';
import {Ielement} from '../components/side-block/side-block.component';
import {Router} from '@angular/router';
import {CookieManagerService} from './cookie-manager.service';
@Injectable()
export class LostFoundService {
  public locationAdressInput: string;
  public address: string;
  public location: {lat: number, lng: number};
  public question: string;
  public question2: string;
  public question3: string;
  public inputField: {type: string, label: string};
  public optional: boolean;
  public answer: string;
  // used only when comming back to edit the date.
  public rechangeDate: string;
  public imgAnswer: Ielement;
  public sequence: string[];
  public displayedSequence: string[]
  public pageAnswers: any[];
  public pagePosition: number;
  public multipleImgAnswers: Ielement[];
  public parentPage: string;
  public inReviewPage: boolean;
  public retrieveData: (pageAnswer: any, lostService: this)=> void;

  public openNameInput: boolean;
  public dogName: string;
  public binaryDogImg: any;
    public dogPicture: string;
  public reward: string;
  public comments: string;
  public defaultReward: string = '000,000.00';
  public defaultDogPic: string = 'http://cdn.lostdog.mx/assets/img/default-dog-pic.jpg';
  
  constructor(public router: Router, public cookieService: CookieManagerService) {
    this.reward = this.defaultReward;
    this.dogPicture = this.defaultDogPic;
    this.pageAnswers = [];
  }

  public next() {
     const nextIndex: number =  this.pagePosition === (this.sequence.length-1) ? this.pagePosition : this.pagePosition + 1;
    const nextPage: string = this.parentPage + '/' + this.sequence[nextIndex];
    console.log('to page', nextPage);
    this.router.navigate([nextPage]);
  }

  public goTo(index: number): void {
    const toPage = '/' + this.parentPage + '/' + this.sequence[index];
    console.log('to page', toPage);
    this.router.navigateByUrl(toPage)
  }

  public goToReview(): void {
    const toPage = '/' + this.parentPage + '/' + this.sequence[this.sequence.length - 1];
    console.log('to page', toPage);
    this.router.navigate([toPage]);
  }

  public back() {
    const nextIndex = this.pagePosition === 0 ? this.pagePosition : this.pagePosition -1;
    const previous: string = this.parentPage + '/' + this.sequence[nextIndex];
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

  public saveIntoCookie(): void {
    let answers = {
      pageAnswers: this.pageAnswers,
      commets: this.comments,
      reward: this.reward,
      dogName: this.dogName
    }
    this.cookieService.setCookie('lostFoundAnswers', answers);
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
    }else if (this.inputField && this.inputField.type === 'binary') {
      return this.binaryDogImg;
    }
    return undefined;
  }
}