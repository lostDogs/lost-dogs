import { Injectable } from '@angular/core';
import {Subscription} from 'rxjs/Rx';
import * as breedContent from '../content/breeds.json';
import * as colorsContent from '../content/colors.json';
import * as sizesContent from '../content/sizes.json';
import * as gendersContent from '../content/genders.json';
import * as accessories from  '../content/accessories.json';
import {IdogData} from './search.service';
import {ApiService} from './api.service';
import {UserService} from './user.service';
import {GlobalFunctionService} from './global-function.service';
import {SearchService} from'./search.service';

export interface ImappedData {
  gender: {name: string, imgUrl: string};
  colors: string[];
  date: {name: string, short: string};
  size: {name: string, imgUrl: string};
  breed: string;
  accessories: {name: string, imgUrl: string} [];
  };

@Injectable()
export class DogCardService {
  public open: boolean;
  public width: number;
  // filled in dog-figure component;
  public patterns: string[];
  public breeds: any;
  public colors: any;
  public shortMonths: string[];
  public months: string[];
  public sizes: any;
  public genders: any;
  public accessories: any;
  public dogData: any;
  public loadingApi: boolean;
  // used on main profile template only
   public lostDogs: IdogData[];
  public foundDogs: IdogData[]; 

  constructor(public api: ApiService, public userService: UserService, public globalService: GlobalFunctionService, private searchService: SearchService) {
    this.shortMonths = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    this.months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    this.breeds = breedContent;
    this.colors = colorsContent;
    this.sizes = sizesContent;
    this.genders = gendersContent;
    this.accessories = accessories;
  }

  public getDog(dogID: string): Subscription {
    const headers: any = {
      'Content-Type': 'application/json',
      'Authorization': 'token ' + this.userService.token
    };
    return this.api.get('https://fierce-falls-25549.herokuapp.com/api/dogs', dogID, headers).subscribe(
      data => {
        this.dogData = this.searchService.parseDogData(data);
      },
      error => {
       this.globalService.clearErroMessages();
       this.globalService.setErrorMEssage('Ops! no se pudo obtener la info. del perro');
       this.globalService.openErrorModal();             
      }
      );
  }

  public deleteDog(dogID: string): Subscription {
    let index: number;
    const headers: any = {
      'Content-Type': 'application/json',
      'Authorization': 'token ' + this.userService.token
    };
    this.loadingApi = true;
    this.searchService.results.some((dog:IdogData, dogIndex: number) => {
      if(dog._id === dogID) {
        index = dogIndex;
        return true;
      }
    });
    return this.api.delete('https://fierce-falls-25549.herokuapp.com/api/dogs', dogID, headers).subscribe(
      data => {
        this.loadingApi = false;
        this.open = false;
        this.searchService.results.splice(index, 1);
      },
      error => {
       this.loadingApi = false;
       this.globalService.clearErroMessages();
       this.globalService.setErrorMEssage('Ops! no se pudo remover por el momento');
       this.globalService.openErrorModal();             
      }
      );
  }

  public setLostDogs(): void {
   this.lostDogs =  this.searchService.results.filter((dog: IdogData) => {
     return dog.lost;
   });    
  }

public setFoundDogs(): void {
   this.foundDogs =  this.searchService.results.filter((dog: IdogData) => {
     return !dog.lost;
   });  
}

  public mapData(dogData: IdogData): ImappedData {
    let mappedData: ImappedData = {
      gender: this.retrieveValue(dogData.male, this.genders),
      colors: this.getKeysFromValues(dogData.color, this.colors),
      date: this.getMappedDate(dogData.found_date),
      size: this.retrieveValue(dogData.size_id, this.sizes),
      breed: (this.getArrayOfStrings(dogData.kind, this.breeds, 'name') + '').replace(/,/g, ', '),
      accessories: this.retrieveValues(dogData.accessories_id, this.accessories)
    }
    return mappedData;
  }

  public retrieveValue(id: any, content: any): any {
    const value = content && content.length && content.filter((element: any, elIndex: number) => {
      return element.id === id;
    });
    return value.length && value[0];
  }

  public retrieveValues(ids: any[], content: any): any[] {
    let values: any[] = [];
    content && content.length && content.filter((element: any, elIndex: number) => {
      ids && ids.length && ids.forEach((id: any, idIndex: number) => {
        if(id === element.id) {
          values.push(element);
        }
      });
    });
    return values;
  }

  public getArrayOfStrings(ids: any[], content: any, attrName: string): string[] {
    let values: any[] = [];
    content && content.length && content.forEach((element: any, elIndex: number) => {
      ids && ids.length && ids.forEach((id: any, idIndex: number) => {
        if(id === element.id) {
          values.push(element[attrName]);
        }
      });
    });
    return values;
  }

  public getKeysFromValues(names: string[], content: any): string[] {
    const keys: string[] = Object.keys(content);
    const values: string[] = Object.values(content);
    const paresedValues: string[] = [];
    names && names.length && names.forEach((name: string, nameIndex: number) => {
      const colorIndex: number = values.indexOf(name);
      ~colorIndex && paresedValues.push(keys[colorIndex]);
    });
    return paresedValues;
  }

  public getMappedDate(date: string): {name: string, short: string} {
    const splited: string = date.split('T')[0];
    const newDate: string[] = splited && splited.split('-');
    const shortDate: string = newDate.length && newDate[0] + ' ' + this.shortMonths[+newDate[1] - 1];
    const fullDate: string = this.months[+newDate[1] - 1] + ' del ' + newDate[0];
    return {name: fullDate, short: shortDate};
  }

}