/*
 * The general idea of Match making is ...
 * after passing the location, gender and date filters all dog become a match.
 * the points addition and sorting by points comes after there are _minMatch number of candidates.
 * If the rest properties match, they will be just adding points.
 * Also if the total results are less o equal to _minMatch we will stop calling the service.
 * after loc, date and gender, if the query doesnt bring results it will not be added. 
 * take _topCandidates number
*/

import { Injectable } from '@angular/core';
import {IdogData, SearchService} from './search.service';
@Injectable()
export class MatchMakerService {
  private _minRangeRes: number = 10;
  //minimum number of values that the DB should have in order to start adding points
  private _minMatch: number = 5;
  public point: number = 10;
  private _topCandidates = 3;

// variables required to increase range
  public timesIncreased: number = 0;
  public rangeRadius: number;
  public defaultRangeRadius: number =  0.5;
  private _increaseByMap: number = 2;
  private _maxTimesIn: number = 3;  
  
  constructor() {
    this.rangeRadius = this.defaultRangeRadius;
  }

  public stopCalling (totalResults: number, pagePosition: number): boolean {
    if ( pagePosition > 2 && totalResults <= this._minMatch) {
      return true;
    }
    return false;
  }

   public extendRange(searchService: SearchService): void {
      searchService.search().add(() => {
        if (!searchService.totalResults && this.timesIncreased < this._maxTimesIn) {
          this.timesIncreased++;
          console.log('increasing range!!!! >.<!', this.timesIncreased);
          const maxditance: number = searchService.queryObj.maxDistance;
          searchService.queryObj.maxDistance = maxditance * this._increaseByMap;
          searchService.maxDistance = maxditance * this._increaseByMap;
          this.rangeRadius = this.rangeRadius * this._increaseByMap;
          this.extendRange(searchService);
        }
      });
  }

  public findInString(result: string, filterValue: string): number {
    // result => a long string of all answers
    // keyword per dogObj array
    filterValue = filterValue ||  typeof filterValue === 'boolean' ? filterValue : null;
    const regex: RegExp = new RegExp(filterValue, 'g');
    const found: string[] = result.match(regex);
    return (found && found.length);
  }

  public filterByString(results: IdogData[], answer: string, apiKey: string): IdogData[] {
    results && Array.isArray(results) && results.forEach((res: IdogData, resIndes: number) => {
      let response: string[] = !Array.isArray(res[apiKey]) && res[apiKey] && res[apiKey].length ? res[apiKey].split(',') : res[apiKey];
      response = !Array.isArray(res[apiKey]) && res[apiKey] && res[apiKey].length ? res[apiKey].split(' ') : res[apiKey];
      let matches: number = 0;
      Array.isArray(response) && response.forEach((val: string, valIndex: number) => {
        matches = matches + this.findInString(answer, val);
      });
      console.log('matches', matches);
      const histIndex = res.matchAtHist.indexOf(apiKey);
      if (matches) {
        if (!~histIndex) {
          // adding matching points
          res.matchAtHist.push(apiKey)
          res.matchValHist.push(this.point*matches);
        } else {
          // adjusting matching points
          res.matchValHist[histIndex] =  this.point * matches;
        }
      } else if (!matches && ~histIndex) {
        // removing matching points
        res.matchValHist[histIndex] = 0;
      }
      results[resIndes].match = res.matchValHist.reduce((a, b) => a + b, 0);
    });
    return results;
  }
}