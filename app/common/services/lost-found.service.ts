import { Injectable } from '@angular/core';
import {Ielement} from '../components/side-block/side-block.component';
import {Router} from '@angular/router';
import {CookieManagerService} from './cookie-manager.service';
import { DecimalPipe } from '@angular/common';
import {ApiService} from '../services/api.service';
import {UserService} from '../services/user.service';
import {SearchService, IdogData} from '../services/search.service';
import {MatchMakerService} from '../services/match-maker.service';
import {GlobalFunctionService} from  '../services/global-function.service';

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

  public loadingSave: boolean;
  public savedSuccess: boolean;
  public savedData: any;
  public savedImgs: boolean;
  
  public start: boolean;
  public prevResState: {data?: IdogData[], totalRes?: number, beforeFilter?: IdogData[]};

  constructor(
    public router: Router,
    public cookieService: CookieManagerService,
    public api: ApiService,
    public userService: UserService,
    public searchService: SearchService, 
    public matchService: MatchMakerService,
    public globalService: GlobalFunctionService
  ) {
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

  public setAnwer(self?: LostFoundService): void {
    if (!self) {
      self = this;
    }
    const stopCall: boolean = self.matchService.stopCalling(self.searchService.totalResults, self.pagePosition);
    const apiConst: string = self.defaulApikeys[self.pagePosition];
    self.pageAnswers[self.pagePosition] = self.copyAnswer(self.getGeneralAnswer());
    self.searchFilter();
    if (self.defualtSequence[self.pagePosition] === 'location') {
      // location has its own search logic see location.component
      self.searchService.resetResults();
      self.matchService.extendRange();
    } else if (self.defualtSequence[self.pagePosition] !== 'date' && !stopCall) {
      // date is being handled with inner filters once we call the addQuery method.
      self.prevResState = {
        data: self.searchService.results,
        totalRes: self.searchService.totalResults,
        beforeFilter: self.searchService.beforeFilterResults
      };
      self.searchService.resetResults();
      self.searchService.search().add(() => {
       if (self.pagePosition > 2 && !self.searchService.totalResults) {
           //if we are here means there were values on the prev call 'stopCall'  but not on the new one 'searchService.totalResults'.
           // we need to have more than 5 (matchService._minMatch) results on prev call and none on the new one.
          //no more matches with that query, hence droping it and calling again
          self.searchService.removeQuery(apiConst);
          console.log(' Cero matches! with that query, hence droping it and calling again >', self.searchService.queryObj);
          //self.searchService.search(); calling again in order to retrieve prev state.
          // retrieving previous state without calling again.
          self.searchService.results = self.prevResState.data;
          self.searchService.totalResults = self.prevResState.totalRes;
          self.searchService.beforeFilterResults = self.prevResState.beforeFilter;
          self.prevResState = {};
       }
      });
      // match making logic starts when total results are less than 5.
    } else if (stopCall && self.pagePosition <= self.defaultDisplayedSequence.length) {
      // page position should be greater than 2 because adding-points  start after date(0), loc(1) and gender(2);
      const answer: string = self.searchService.answerToApi(self.pageAnswers[self.pagePosition], true);
      const answers = apiConst === 'pattern_id' ? answer.replace(/\s/g, '') : answer;
      const resWithPoints: IdogData[] = self.matchService.filterByString(self.searchService.results, answers, apiConst);
      self.searchService.results = resWithPoints;
      // sorting to see who has the highest matching value.
      self.searchService.results && self.searchService.results.length && self.searchService.sort('match', true);
      // take the first 3 or 1 and do something
      console.log('results', self.searchService.results);

    }
    if (self.defualtSequence[self.pagePosition] === 'color') {
      self.multipleImgAnswers && self.changePatternSequence(self.multipleImgAnswers.filter((value: any, index: number)=>{return value.disabled}));
    }
    console.log('page answers', self.pageAnswers);
  }

  // answer should not be modifed unless the button aswer is hit.
  // that is why I am making a copy of the answer obj to avoid pointing at the main obj.
  public copyAnswer(answer: any) {
    if(Array.isArray(answer)) {
      return answer.slice(0);
    }else if (typeof answer === 'object') {
      return Object.assign({}, answer);
    } else  {
      return answer;
    }
  }

  public saveToApi(): void {
    const dog: any = this.objDogBuilder();
    const headers: any = {
      'Content-Type': 'application/json',
      'Authorization': 'token ' + this.userService.token
    };
    this.loadingSave = true;
    this.api.post('https://fierce-falls-25549.herokuapp.com/api/dogs',dog, headers).subscribe(data => {
      console.log('sucessss', data);
      this.loadingSave = false;
      this.savedSuccess = true;
      this.question = 'Perro creado con exito!';
      this.savedData = this.trasnfromDogData(data);
      console.log("saved data >>>", this.savedData);
      this.setImgToBucket(data['images'][0].uploadImageUrl);
    },
    e => {
      this.loadingSave = false;
       this.globalService.clearErroMessages();
       this.globalService.setErrorMEssage('Ops! tuvimos un problema y no se pudo guardar');
       this.globalService.setSubErrorMessage('intenta mas tarde!');
       this.globalService.openErrorModal();      
    });
  }

  public setImgToBucket(url: string): void {
    this.api.put(url, this.binaryDogImg, {'Content-Type': 'image/jpeg', 'Content-encoding': 'base64'}).subscribe(
      data => {
        this.savedImgs = true;
        console.log('sucess', data);

      },
      e => {
       this.globalService.clearErroMessages();
       this.globalService.setErrorMEssage('No pudimos agregar las imagenes');
       this.globalService.openErrorModal();
      }
    );
  }

  public trasnfromDogData(data: any): any {
    data.patternColors = this.searchService.patternConvertion(data);
    data.pattern_id = data.pattern_id.replace(/\s/g, '').replace(/,/g, ' ');
    data.name =  data.name && data.name === 'NA/'  ? undefined : data.name;
    data.color =  data.color && data.color.split(',');
    data.kind = data.kind && data.kind.split(',');
    return data;
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
    dogObj[this.extrasApiKeys.images] =  ['image/jpeg'];
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
     //this.question = undefined;
     this.question2 = undefined;
     this.question3 = undefined;
     //this.inputField = undefined;
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
     this.savedSuccess = undefined;
     this.savedData = undefined;
     this.savedImgs = undefined;
     this.start = undefined;
     this.searchService.maxDistance = this.searchService.maxDistanceDefault;
  }

  public changePatternSequence(notDisabled: any[]) {
    const patternString: string = 'pattern';
    const patternName: string = 'Patron';
    const patternIndex: number = this.defualtSequence.indexOf(patternString);
    if (notDisabled.length > 1 && !(~patternIndex)) {
      this.pageAnswers.splice(this.pagePosition + 1, 0, undefined);
      this.defualtSequence.splice( this.pagePosition + 1, 0, patternString);
      this.defaultDisplayedSequence.splice(this.pagePosition + 1, 0, patternName);
      this.defaulApikeys.splice(this.pagePosition + 1, 0, patternString + '_id');
    }
    if (notDisabled.length && notDisabled.length <= 1 && ~patternIndex) {
      this.pageAnswers.splice(patternIndex, 1);
      this.defualtSequence.splice(patternIndex, 1);
      this.defaultDisplayedSequence.splice(patternIndex, 1);
      this.defaulApikeys.splice(patternIndex, 1);
    }
  }
}