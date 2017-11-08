import { Injectable } from '@angular/core';
import {ApiService} from './api.service';
import {UserService} from './user.service';

export interface IdogData {
  found_date: string;
  images: string[];
  color: any;
  kind: any;
  location: {coordinates: [number, number]}; //lng, lat.
  address: string;
  lost: boolean;
  description: string;
  accessories_id: string[];
  male: boolean;
  name: string;
  pattern_id: string;
  reporter_id: string;
  reward: string;
  size_id: string;
  _id: string;
  patternColors?: {[patternName: string]: string};
}

@Injectable()
export class SearchService {
  public results: IdogData[];
  // raidus in meters for the geolocation.
  public maxDistance: number = 1000;
  public _endpointUrl: string = 'https://fierce-falls-25549.herokuapp.com/api/dogs?searchTerms=';
  public queryObj: any;
  public totalResults: number;
  constructor(public api: ApiService, public userService: UserService) {
    this.queryObj = {};
  }

  public addQuery(QueryName: string, value: any): void {
    if (QueryName === 'location') {
      this.setLocationFilter(QueryName, value);
    }else if(QueryName === 'found_date') {
      this.setDateFilter(value);
    }else {
      this.queryObj[QueryName] = value;
    }
    console.log('query obj', this.queryObj);
  }

  public removeQuery(queryName:string): void {

  }

  public search(): void {
    const headers: any = {
      'Content-Type': 'application/json',
      'Authorization': 'token ' + this.userService.token
    };
    this.api.get(this._endpointUrl + '&', this.queryObj, headers).subscribe(data => {
      console.log('sucessss', data);
      this.results = data['results'] && data['results'].length ? data['results'] : undefined;
      this.results && this.results.forEach((res: IdogData, resIndex: number) => {
        this.results[resIndex].patternColors = this.patternConvertion(res);
        this.results[resIndex].pattern_id = res.pattern_id.replace(/\s/g, '').replace(/,/g, ' ');
        this.results[resIndex].name =  res.name && res.name === 'NA/'  ? undefined : res.name;
        this.results[resIndex].color =  res.color && res.color.split(',');
        this.results[resIndex].kind = res.kind && res.kind.split(',');
      });
      console.log('converted values', this.results);
      this.totalResults = data['hits'];
    });    
  }

  public setQueryInUrl(queryName: string, value: any): void {
  }

  public readQueryInUrl(): string {
    return 'yes';
  }

  public setDateFilter(value: string): void {
    const filteredDate: Date = new Date(value);
    let filteredResults: any[];
    filteredResults = this.results && this.results.length && this.results.filter((value: any, index: number) => {
      const date: Date = new Date(value.found_date.split('T')[0].replace(/-/g, '/'))
      if (this.queryObj.lost) {
        // If I lost a dog  bring all found from the date I lost it until todays day
       return date >= filteredDate;
     } else {
       // if I found a dog bring all lost dog from n until todays day.
       return date <= filteredDate;
     }
    });
      this.results = filteredResults;
      console.log('results', this.results);
  } 

  public setLocationFilter(name: string, value: any): void {
    this.queryObj[name] = value;
    this.queryObj.maxDistance = this.maxDistance;
  }

  public sort(value: string, ascent: boolean) {

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

}