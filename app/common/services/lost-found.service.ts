import { Injectable } from '@angular/core';
import {Ielement} from '../components/side-block/side-block.component';
import {Router} from '@angular/router';
import {CookieManagerService} from './cookie-manager.service';
import { DecimalPipe } from '@angular/common';
import {ApiService} from '../services/api.service';
import {UserService} from '../services/user.service';

@Injectable()
export class LostFoundService {
  public locationAdressInput: string;
  public address: string;
  public latLong: {lat: number, lng: number};
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
  public displayedSequence: string[];
  public defaultDisplayedSequence: string[];
  public defualtSequence: string[];
  public defaulApikeys: string[];
  public extrasApiKeys: any = {name: 'name', img: 'imageFileType', comments: 'description', reward: 'reward', lost: 'lost'};
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
  
  constructor(public router: Router, public cookieService: CookieManagerService, public api: ApiService, public userService: UserService) {
    this.reward = this.defaultReward;
    this.dogPicture = this.defaultDogPic;
    this.pageAnswers = [];
  }

  public next(): void {
     const nextIndex: number =  this.pagePosition === (this.sequence.length-1) ? this.pagePosition : this.pagePosition + 1;
    const nextPage: string = this.parentPage + '/' + this.sequence[nextIndex];
    this.router.navigate([nextPage]);
  }

  public goTo(index: number): void {
    const toPage = '/' + this.parentPage + '/' + this.sequence[index];
    this.router.navigateByUrl(toPage);
  }

  public goToReview(): void {
    const toPage = '/' + this.parentPage + '/' + this.sequence[this.defualtSequence.length - 1];
    this.router.navigate([toPage]);
  }

  public back(): void {
    const nextIndex = this.pagePosition === 0 ? this.pagePosition : this.pagePosition -1;
    const previous: string = this.parentPage + '/' + this.sequence[nextIndex];
    this.router.navigate([previous]);
  }

  public setAnwer(): void {
    this.pageAnswers[this.pagePosition] = this.getGeneralAnswer();
    console.log('page answers', this.pageAnswers);
  }

  public saveToApi(): void {
    const dog: any = this.objDogBuilder();
    const headers: any = {
        'Content-Type': 'application/json',
        'Authorization': 'token ' + this.userService.token
      };
    this.api.post('https://fierce-falls-25549.herokuapp.com/api/dogs',dog, headers).subscribe(data => {
      console.log('sucessss', data);
    });
  }

  public objDogBuilder(): any {
    let dogObj = {};
    this.defaultDisplayedSequence.forEach((Keyname: string, nameIndex: number) => {
      let subObj: any;
      if (this.pageAnswers[nameIndex] && this.pageAnswers[nameIndex].name) {
        subObj = this.pageAnswers[nameIndex].apiVal ? this.pageAnswers[nameIndex].apiVal : this.pageAnswers[nameIndex].name;
      } else if (Array.isArray(this.pageAnswers[nameIndex]) && this.pageAnswers[nameIndex].length && this.pageAnswers[nameIndex][0].name) {
        subObj = [];

        this.pageAnswers[nameIndex].forEach((multAnswer: any,multAnswerIndex: number) => {
          subObj.push(multAnswer.apiVal ? multAnswer.apiVal : multAnswer.name);
        });
      } else {
        subObj = this.pageAnswers[nameIndex];
      }
      console.log('this.defaulApikeys[nameIndex]', this.defaulApikeys[nameIndex]);
      dogObj[this.defaulApikeys[nameIndex]] = subObj;
    });
    if (this.comments) {
      dogObj[this.extrasApiKeys.comments] = this.comments;
    }
    if (this.reward && this.reward !== this.defaultReward) {
    dogObj[this.extrasApiKeys.reward] = this.reward;
    }
    dogObj[this.extrasApiKeys.name] = '' + this.dogName;
    dogObj[this.extrasApiKeys.lost] = this.parentPage === 'lost';
    //dogObj[this.extrasApiKeys.img] = this.binaryDogImg;
    console.log(dogObj);
    return dogObj;
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
    } else if (this.inputField && this.inputField.type === 'address' && this.latLong && this.address) {
    return {address: this.address, latLong: this.latLong};
    } else if(this.imgAnswer && this.imgAnswer.disabled===true) {
     return this.imgAnswer;
    } else if (this.multipleImgAnswers && this.multipleImgAnswers.length) {
      return this.multipleImgAnswers;
    }else if (this.inputField && this.inputField.type === 'binary') {
      return this.binaryDogImg;
    }
    return undefined;
  }
  public resetService() {
     this.locationAdressInput = undefined;
     this.address = undefined;
     this.latLong = undefined;
     this.question = undefined;
     this.question2 = undefined;
     this.question3 = undefined;
     this.inputField = undefined;
     this.optional = undefined;
     this.answer = undefined;
     this.rechangeDate = undefined;
     this.imgAnswer = undefined;
     this.pageAnswers = [];
     this.pagePosition = undefined;
     this.multipleImgAnswers = undefined;
     this.parentPage = undefined;
     this.inReviewPage = undefined;
     this.retrieveData = undefined;
     this.openNameInput = undefined;
     this.dogName = undefined;
     this.binaryDogImg = undefined;
     this.dogPicture = this.defaultDogPic;
     this.reward = this.defaultReward;
     this.comments = undefined;
     this.defualtSequence = ['date', 'location', 'breed', 'gender', 'size', 'color', 'pattern', 'extras', 'details','review'];
     this.defaultDisplayedSequence  = ['Fecha', 'Ubicacion', 'Raza', 'Genero', 'Tamaño', 'Color', 'Patron','Accessorios'];
     this.defaulApikeys = ['found_date', 'location', 'kind_id', 'male', 'size_Id', 'color','pattern_Id','accessories_Id'];;
  }
}