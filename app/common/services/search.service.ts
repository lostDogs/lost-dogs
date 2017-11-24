import { Injectable } from '@angular/core';
import {ApiService} from './api.service';
import {UserService} from './user.service';
import {Subscription} from 'rxjs/Rx';

export interface IdogData {
  found_date: string;
  images?: [{image_url: string, uploadImageUrl: string, _id: string}];
  color: any;
  kind: any;
  location: {coordinates: [number, number]}; //lng, lat.
  address: string;
  lost: boolean;
  description?: string;
  accessories_id?: string[];
  male: boolean;
  name: string;
  pattern_id: string;
  reporter_id: string;
  reward: string;
  size_id: string;
  _id: string;
  //attrs added here.
  patternColors?: {[patternName: string]: string};
  match?: number;
  matchAtHist?: string[];
  matchValHist?: number[];
}

@Injectable()
export class SearchService {
  public results: IdogData[];
  // dimeter in meters for the geolocation.
  public maxDistance: number;
  // 1km diameter initially
  public maxDistanceDefault: number = 1000;
  public _endpointUrl: string = 'https://fierce-falls-25549.herokuapp.com/api/dogs?searchTerms=';
  public queryObj: any;
  public totalResults: number;
  public beforeFilterResults: IdogData[];
  public innerFiltes: any;
  public loading: boolean;
  //pagination
  public _pageSize: number = 12;
  public atPage: number = 0;
  public totalPages: number;
  public pagesCalled: number[];
  public pagedResults: IdogData[];
  public window: Window;

  constructor(public api: ApiService, public userService: UserService) {
    this.queryObj = {};
    this.innerFiltes = {};
    this.results = [];
    this.pagesCalled = [];
    this.window = window;
    this.maxDistance = this.maxDistanceDefault;
  }
  // add queries adds the Query-filters that are going to be send to the api call in the queryObj.
  // for filters that are happening internally in the app are saved in the inner filter.
  public addQuery(queryName: string, value: any): void {
    if (queryName === 'location') {
      this.setLocationFilter(queryName, value);
    }else if(queryName === 'found_date') {
      // every time filter date change, we need to filter for the orginal data. which is beforeFilterRes
      // results could have filtered data, that is why is not the original.
      this.results = this.beforeFilterResults;
      this.setDateFilter(value);
      this.addInnerFilter(queryName, value);
    }else {
      this.queryObj[queryName] = value;
    }
    console.log('query obj', this.queryObj);
  }

  public removeQuery(queryName:string): void {
    if (queryName === 'location') {
      delete this.queryObj.location;
      delete this.queryObj.maxDistance;
    }else if(queryName === 'found_date') {
      this.results = this.beforeFilterResults;
      this.removeInnerFilter(queryName);
    }else  {
     delete this.queryObj[queryName]; 
    }
  }

  public addInnerFilter(compName: string, value: any): void {
    this.innerFiltes[compName] = value;
  }

  public removeInnerFilter(compName: string): void {
    delete this.innerFiltes[compName];
  }

  public search(): Subscription {
    const headers: any = {
      'Content-Type': 'application/json',
      'Authorization': 'token ' + this.userService.token
    };
    this.loading = true;
    return this.api.get(this._endpointUrl + '&', this.queryObj, headers).subscribe(data => {
      console.log('sucessss', data);
      const results = data['results'] && data['results'].length ? data['results'] : undefined;
      results && results.forEach((res: IdogData, resIndex: number) => {
        results[resIndex] = this.parseDogData(res);
        this.results.push(results[resIndex]);
      });
      this.totalResults = data['hits'];
      console.log('results', this.results);
      this.beforeFilterResults = this.results && JSON.parse(JSON.stringify(this.results));
      const innerKeys: string[] = Object.keys(this.innerFiltes);
      // one a call is made the inner filters will be overwritten by the new call. so we need to apply them again.
      if (innerKeys.length) {
        innerKeys.forEach((name: string, nameIndex: number) => {
          this.addQuery(name, this.innerFiltes[name]);
        });
      }
      this.loading = false;
      this.totalPages = Math.ceil(this.totalResults / this._pageSize);
      console.log('total pages', this.totalPages);
      if (this.atPage === 0) {
        this.pagedResults = this.results;
        this.pagesCalled.push( this.atPage);
      }
    });
  }

  public setQueryInUrl(queryName: string, value: any): void {
  }

  public readQueryInUrl(): string {
    return 'yes';
  }

  public changePageTo(pageNumber: number): void {
    this.atPage = pageNumber;
    if (this.pagesCalled[pageNumber] === pageNumber) {
      // means we already call this so we just the value in the array
      this.pagedResults = this.results.slice(pageNumber * this._pageSize , (pageNumber + 1)  * this._pageSize);
    } else {
      // means we dont have this page yet so we need to call the service.
      this.pagesCalled.push( this.atPage);
      this.pagesCalled.sort((a, b) => {return a-b});
      this.addQuery('page', this.atPage);
      this.search().add(() => {
        this.pagedResults = this.results.slice(pageNumber * this._pageSize , (pageNumber + 1)  * this._pageSize);
      });
    }
  }

  public resetResults(): void {
    this.results = [];
    this.pagedResults = [];
    this.atPage = 0;
    this.addQuery('page', 0);
  }

  public setDateFilter(value: string): void {
    const filteredDate: Date = new Date(value);
    let filteredResults: any[];
    filteredResults = this.results && this.results.length && this.results.filter((value: any, index: number) => {
      const date: Date = new Date(value.found_date.split('T')[0].replace(/-/g, '/'));
      if (this.queryObj.lost) {
        // If I have lost a dog  bring all found from the date I lost it until todays day
       return date <= filteredDate;
     } else {
       // if I have found a dog bring all lost dog from that day until todays day.
       return date >= filteredDate;
     }
    });
    this.results = filteredResults;
    this.pagedResults = this.results.slice(this.atPage * this._pageSize , (this.atPage + 1)  * this._pageSize);
    if (this.pagedResults.length < this._pageSize && this.results.length <= this.totalResults) {

    }
  } 

  public setLocationFilter(name: string, value: any): void {
    this.queryObj[name] = value;
    this.queryObj.maxDistance = this.maxDistance;
  }

  public sort(type: string, dsc: boolean) {
    this.results.sort((a: IdogData, b: IdogData) => {
      let aParse: any;
      let bParse: any;
      if (type === 'date') {
        aParse = new Date(a.found_date.split('T')[0].replace(/-/g, '/'));
        bParse = new Date(b.found_date.split('T')[0].replace(/-/g, '/'));
      } else if(type === 'reward') {
        aParse = a.reward || typeof a.reward === 'number' ? +a.reward : 0;
        bParse = b.reward || typeof b.reward === 'number' ? +b.reward : 0;
      }else if (type === 'match') {
        aParse = +a.match;
        bParse = +b.match;
      }
      return aParse - bParse;
    });
    if(dsc) {
      this.results.reverse();
    }
  }

  public answerToApi(answer: any, toString: boolean): string {
    let answerParsed: any;
    if (answer.latLng) {
      answerParsed = answer.latLng.lng + ',' + answer.latLng.lat;
    } else if (answer && answer.name) {
      answerParsed = answer.apiVal || typeof answer.apiVal === 'boolean' ? answer.apiVal : answer.name;
    } else if (Array.isArray(answer) && answer.length && answer[0].name) {
      let answers: any[] = [];
       answer.forEach((multAnswer: any,multAnswerIndex: number) => {
        answers.push(multAnswer.apiVal || typeof multAnswer.apiVal === 'boolean' ? multAnswer.apiVal : multAnswer.name);
       });
       answerParsed = toString ? '' + answers : answers;
    }else {
      answerParsed = answer;
    }
    return answerParsed;
  }

  public patternConvertion(dogData: IdogData): {[patternName: string]: string} {
    if (dogData.pattern_id && dogData.pattern_id.length) {
      const patterns = dogData.pattern_id.split(',');
      let patConverted: any = {};
      patterns.forEach((pattern: string, patIndex: number) => {
        const patAndColor: string[] = pattern.split(':');
        const color: string = patAndColor[1] && patAndColor[1].trim();
        patConverted[patAndColor[0]] = color;
      });
      return patConverted;
    }
  }

  public parseDogData(dogData: any): IdogData {
    dogData.patternColors = this.patternConvertion(dogData);
    dogData.pattern_id = dogData.pattern_id.replace(/\s/g, '').replace(/,/g, ' ');
    dogData.name =  dogData.name && dogData.name === 'NA/'  ? undefined : dogData.name;
    dogData.color =  dogData.color && dogData.color.split(',');
    dogData.kind = dogData.kind && dogData.kind.split(',');
    dogData.matchAtHist = [];
    dogData.matchValHist = [];
    return dogData;
  }
}