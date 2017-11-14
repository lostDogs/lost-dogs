import { Injectable } from '@angular/core';
import {Ielement} from '../components/side-block/side-block.component';
import {Router} from '@angular/router';
import {CookieManagerService} from './cookie-manager.service';
import { DecimalPipe } from '@angular/common';
import {ApiService} from '../services/api.service';
import {UserService} from '../services/user.service';
import {SearchService, IdogData} from '../services/search.service';
import {MatchMakerService} from '../services/match-maker.service';

@Injectable()
export class LostFoundService {
  public locationAdressInput: string;
  public address: string;
  public latLng: {lat: number, lng: number};
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
  public extrasApiKeys: any = {name: 'name', img: 'imageFileType', images: 'images', comments: 'description', reward: 'reward', lost: 'lost', reporter: 'reporter_id', address: 'address'};
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
  
  constructor(public router: Router, public cookieService: CookieManagerService, public api: ApiService, public userService: UserService, public searchService: SearchService, public matchService: MatchMakerService) {
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
    const stopCall: boolean = this.matchService.stopCalling(this.searchService.totalResults, this.pagePosition);
    const apiConst: string = this.defaulApikeys[this.pagePosition];
    console.log('stop call', stopCall);
    this.pageAnswers[this.pagePosition] = this.getGeneralAnswer();
    this.searchFilter();
    if (this.defualtSequence[this.pagePosition] !== 'date' && !stopCall) {
      this.searchService.search();
      // match making logic starts
    } else if (stopCall && this.pagePosition <= this.defaultDisplayedSequence.length) {
      // page position should be greater than 2 because adding-points  start after date(0), loc(1) and gender(2);
      const answer: string = this.searchService.answerToApi(this.pageAnswers[this.pagePosition], true);
      const answers = apiConst === 'pattern_id' ? answer.replace(/\s/g, '') : answer;
      console.log('answers', answers);
      const resWithPoints: IdogData[] = this.matchService.filterByString(this.searchService.results, answers, apiConst);
      this.searchService.results = resWithPoints;
      this.searchService.sort('match', true);
      console.log('results', this.searchService.results);
      // now we need to sort for points and debug

    }
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

  public searchFilter(): void {
    const apiKey: string = this.defaulApikeys[this.pagePosition];
    const answer: string = this.searchService.answerToApi(this.pageAnswers[this.pagePosition], true);
    this.searchService.addQuery(apiKey, answer);
  }

  public objDogBuilder(): any {
    let dogObj = {};
    let addressVal: string;
    this.defaultDisplayedSequence.forEach((Keyname: string, nameIndex: number) => {
      let subObj: any;
      if (this.defualtSequence[nameIndex] === 'location') {
         subObj = {'coordinates': [this.pageAnswers[nameIndex].latLng.lng, this.pageAnswers[nameIndex].latLng.lat]};
         addressVal = this.pageAnswers[nameIndex].address;
      } else {
        subObj = this.searchService.answerToApi(this.pageAnswers[nameIndex], false);
      }
      dogObj[this.defaulApikeys[nameIndex]] = subObj;
    });
    if (this.comments) {
      dogObj[this.extrasApiKeys.comments] = this.comments;
    }
    if (this.reward && this.reward !== this.defaultReward) {
    dogObj[this.extrasApiKeys.reward] = this.reward.replace(',', '');
    }
    dogObj[this.extrasApiKeys.name] = this.dogName || 'NA/';
    dogObj[this.extrasApiKeys.lost] = this.parentPage === 'lost';
    dogObj[this.extrasApiKeys.img] = 'application/jpeg';
    dogObj[this.extrasApiKeys.reporter] = this.userService.user.username;
    //dogObj[this.extrasApiKeys.images] = [this.dogPicture];
    dogObj[this.extrasApiKeys.address] = addressVal;
    dogObj['color'] = dogObj['color'] ? dogObj['color'] + '': '';
    dogObj['pattern_id'] = dogObj['pattern_id'] ? dogObj['pattern_id'] + '' : '';
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
    } else if (this.inputField && this.inputField.type === 'address' && this.latLng && this.address) {
    return {address: this.address, latLng: this.latLng};
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
     this.latLng = undefined;
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
     this.defualtSequence = ['date', 'location', 'gender', 'breed', 'size', 'color', 'pattern', 'extras', 'details','review'];
     this.defaultDisplayedSequence  = ['Fecha', 'Ubicacion', 'Genero', 'Raza', 'Tamaño', 'Color', 'Patron','Accessorios'];
     this.defaulApikeys = ['found_date', 'location', 'male', 'kind', 'size_id', 'color','pattern_id','accessories_id'];
     this.searchService.results = [];
     this.searchService.totalResults = 0;
     this.searchService.innerFiltes = {};
     this.searchService.queryObj = {};
  }
}