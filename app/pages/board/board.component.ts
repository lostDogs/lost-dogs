import {Component, ViewChildren, QueryList, ElementRef, ViewChild, Inject, HostListener} from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser';
import {DogCardService} from '../../common/services/dog-card.service';
import {SearchService, IdogData} from '../../common/services/search.service';
import {LostFoundService} from '../../common/services/lost-found.service';
import {AsyncPipe} from '@angular/common';
require('../../common/plugins/masks.js');

export interface Ifiltes {
  [componentName: string]: {
    enable?: boolean;
    answer?: any;
    label?: string;
    typeOfAnswer?: string;
    width?: string;
    asnwerExtraWidth?: number;
  }
}

@Component({
  selector: 'board',
  template: require('./board.template.html'),
  styles: [ require('./board.scss')]
})
export class boardComponent {
  public filterElements: Ifiltes = {};
  public activeIndex: number;
  public filtersKey: string[];
  public previousElementSelected: string;
  public rechangeDate: any;
  public location:  {latLng?: any, address?: string} = {};
  public window: Window;
  public screenWidth: number;
  @ViewChild('Location')
  public LocationDom: ElementRef;
  @ViewChild('Components')
  public ComponentsDom: ElementRef;
  @ViewChildren('AnswerBlock')
  public answersDom: QueryList<any>;
  @ViewChild('Results')
  public resultsDom: ElementRef;
  public dom: ElementRef;
  public widthPerFilter: number;
  public extraWidth: number = 0;
  
  public initMapAnswer: boolean;
  public tempMapAnswer: any;
  public initDateAnswer: boolean;
  public tempDateAnswer: string;
  public dateModel: string;
  public showMapInput: boolean;
  public showNameInput: boolean;
  public nameInput: string;
  public mobile: boolean;
  public mapWidth: number;
  public colorsSelected: string[];
  public searchFound: boolean;
  public filteredResults: IdogData[];
  
  public rangeDiameter: number = 1;
  public radioInMap: number = 0.5;

  public showArrowUp: boolean;
  
  @ViewChild('ButtonBreedSearch')
  public buttonBreedSearchDom: ElementRef;

  constructor(@Inject(DOCUMENT) private document:  Document, public dogCardService: DogCardService, public lostService: LostFoundService, public searchService: SearchService) {
    this.filtersKey = [];
    this.window = window;
    this.mobile = window.screen.width <= 767;
    this.screenWidth = document.documentElement.clientWidth;
    this.mapWidth = this.screenWidth;
    if (this.mobile) {
       this.screenWidth *= 2;
    }
    this.dogCardService.open = false;
    // TEMP block
    //TODO: integrate pattern well
    this.lostService.resetService();
    const disPat: number = this.lostService.defaultDisplayedSequence.indexOf('Patron');
    const seqPat: number = this.lostService.defualtSequence.indexOf('pattern');
    const keyPat: number = this.lostService.defaulApikeys.indexOf('pattern_id');

    if (~disPat && ~seqPat && ~keyPat) {
      const displayed = this.lostService.defaultDisplayedSequence.splice(disPat, 1);
      const sequence = this.lostService.defualtSequence.splice(seqPat, 1);
      const apikey = this.lostService.defaulApikeys.splice(keyPat, 1);
    }
    // TEMP end of  block
    this.lostService.defaultDisplayedSequence.forEach((componentLabel: string, index: number) => {
      this.filtersKey.push(this.lostService.defualtSequence[index]);
      this.filterElements[this.lostService.defualtSequence[index]] = {label: componentLabel};
    });

    this.widthPerFilter = this.screenWidth / this.filtersKey.length - 1;
    this.lostService.defaultDisplayedSequence.forEach((componentLabel: string, index: number) => {
      this.filterElements[this.lostService.defualtSequence[index]].width = this.widthPerFilter + 'px';
    });
  }
  @HostListener('window:scroll', ['$event'])
  onWindowScroll(event: any) {
    const scrollTop: number = this.document && this.document.documentElement.scrollTop;
    const scrollToResults: number =  this.resultsDom && this.resultsDom.nativeElement && this.resultsDom.nativeElement.offsetTop - 170;
    this.showArrowUp = scrollTop >= scrollToResults;
  }  

  public ngDoCheck(): void {
    this.reziseFiltersRow();
  }

  public ngOnInit(): void {
    $('#date-input').mask('0000/00/00');
    this.searchService.resetResults();
    this.searchService.addQuery('lost', !this.searchFound);
    this.searchService.addQuery('pageSize', this.searchService._pageSize);
    this.searchService.search();
  }

  public ngAfterViewInit(): void {
    $('select').material_select();
    const input = $('#sort-by');
    const self: boardComponent = this;
    input.change(() => {
      const selectedElement: string = $('.sort-dropdown option[value="' +input.val() +'"]')[0].innerHTML;
       const initReplazable: JQuery = $('input.select-dropdown');
       if (!initReplazable.hasClass('invisible')) {
         initReplazable.addClass('invisible');
       }
      const replaceBlock: string = '<div class="select-dropdown replaced">' + selectedElement + '</div>'
      const replacedBlock: JQuery = $('div.select-dropdown.replaced');
      if (!replacedBlock.length) {
        initReplazable.after(replaceBlock);
      } else {
        replacedBlock.replaceWith(replaceBlock);
      }
      const sortVal: string = input.val() && (input.val()).split(':');
      self.searchService.sort(sortVal[0], !!sortVal[1]);
    });    
  }

  public reziseFiltersRow(): void {
    if ((this.answersDom && this.answersDom.length) || this.LocationDom) {
      const LastAnswerDom: ElementRef = this.answersDom.last;
      let id: string = LastAnswerDom.nativeElement.id;
      let index = this.filtersKey.indexOf(id);
      if (~index) {
        if (this.filterElements[this.filtersKey[index]].answer) {
          this.filterElements[this.filtersKey[index]].width = 'auto';
          if (LastAnswerDom.nativeElement.clientWidth >= this.widthPerFilter) {
             this.filterElements[this.filtersKey[index]].asnwerExtraWidth = (LastAnswerDom.nativeElement.clientWidth - this.widthPerFilter);
          } else {
            this.filterElements[this.filtersKey[index]].asnwerExtraWidth = 0;
            this.filterElements[this.filtersKey[index]].width = this.widthPerFilter + 'px';
          }
        }
      }
      /*
      * for some reason the locaton answer dom is not being detected in the QueryList nor Jquery so I have added a #Location to target it. It could be due to the ngFor and async data problems. 
      * Therefore I am dding the followings lines of code to force the change of the width only on the location element
      */
      if (this.LocationDom && this.answersDom.last.nativeElement.id !== 'location') {
         this.filterElements.location.width = 'auto';
         this.filterElements.location.asnwerExtraWidth = this.LocationDom.nativeElement.clientWidth - this.widthPerFilter;
      }
      // setting the general fitlers row witdth
      let widthTemp: number =  0;
      this.filtersKey.forEach((elementKey: string, elementIndex: number) => {
        if (this.filterElements[elementKey].asnwerExtraWidth) {
          widthTemp += this.filterElements[elementKey].asnwerExtraWidth;
        }
      });
      this.extraWidth = widthTemp;
    }
  }

  public enableComponent(componentName: string, activeIndex: number) {
    if (this.previousElementSelected && this.previousElementSelected !==componentName) {
      this.filterElements[ this.previousElementSelected].enable = false;
    }
    this.filterElements[componentName].enable = !this.filterElements[componentName].enable;
    this.activeIndex = activeIndex;
    this.previousElementSelected = componentName;

    if (this.filterElements.location.enable) {
       this.initMapAnswer = true;
       this.filterElements[componentName].answer = this.tempMapAnswer;
       this.queryAndSearch(componentName, this.tempMapAnswer);
    }
    if (this.filterElements.date.enable) {
      /// se for query and search add console log and see why is not being added in the first call.
      this.initDateAnswer = true;
      this.filterElements[componentName].answer = this.tempDateAnswer;
      this.rechangeDate = JSON.parse(JSON.stringify( this.filterElements[componentName].answer));
      this.queryAndSearch(componentName, this.tempDateAnswer);
    }
  }

  public selectionReciver(componentName: string, event: any): void {
   let typeOfAnswer: string;
   event = JSON.parse(JSON.stringify(event));
   if (event.name) {
     typeOfAnswer = 'image';
   } else if (!Array.isArray(event)) {
     typeOfAnswer = 'date';
     this.dateModel = event;
     this.tempDateAnswer = event;
     event = this.initDateAnswer ? event : undefined;
   }else if (Array.isArray(event)) {
     let indexSplice: number;
     event.forEach((el: any, elIndex: number) => {
       if (!el.disabled) {
         // watch out you are modifing the array inside the loop.
         event.splice(elIndex, 1);
       }
     });
     event = !event.length ? undefined : event;
   }
   this.filterElements[componentName].answer =  event;
   this.filterElements[componentName].typeOfAnswer = typeOfAnswer;
   if (event) {
     this.queryAndSearch(componentName, event);
   }
   if (componentName =  'color') {
     this.colorsSelected = this.getOnlyNames(event);
   }
   this.searchForName(componentName);
  }

  public locationReciver(event: any): void {
     if (event.lat) {
      this.location.latLng = event;
    } else  {
      this.location.address = event;
    }
    if (this.initMapAnswer) {
     this.filterElements.location.answer = this.location.latLng &&  this.location.address ? this.location : undefined;
    } else  {
      this.tempMapAnswer = this.location.latLng &&  this.location.address ? this.location : undefined;
    } 
    this.showMapInput = !!event;
    this.filterElements.location.typeOfAnswer = 'location';
  }

  public locationQuery(event: any): void {
     if (this.initMapAnswer && this.filterElements.location.answer) {
       this.queryAndSearch('location', this.location);
     }
  }

  public imgBlockRemove(componentName: string): void {
    this.filterElements[componentName].answer = undefined;
    this.filterElements[componentName].asnwerExtraWidth = 0;
    this.filterElements[componentName].width = this.widthPerFilter + 'px';
    this.delQueryAndSearch(componentName);
  }

  public multipleBlockRemove(componentName: string, index: number): void {
    let disabledAmount: number = 0;
    this.filterElements[componentName].answer = JSON.parse(JSON.stringify(this.filterElements[componentName].answer));
    this.filterElements[componentName].answer[index].disabled = false;
    // this.filterElements[componentName].answer.splice(index, 1);
    console.log('answer', this.filterElements[componentName].answer[index]);
    setTimeout(() => {
      this.filterElements[componentName].answer.splice(index, 1);
      if (!this.filterElements[componentName].answer.length) {
        this.filterElements[componentName].asnwerExtraWidth = 0;
        this.filterElements[componentName].width = this.widthPerFilter + 'px';
        this.filterElements[componentName].answer = undefined;
      }
    }, 2);
    this.queryAndSearch(componentName, this.filterElements[componentName].answer);
    this.searchForName(componentName);
  }

  public queryAndSearch(compName: string, answer: any): void {
    const apiName: string = this.getApiName(compName);
    const answerToApi: string = this.searchService.answerToApi(answer, true);
    this.searchService.addQuery(apiName, answerToApi);
      this.searchService.resetResults();
    if (compName === 'date') {
      this.searchService.loading = true;
      this.searchService.callByTimer(this.searchService.search, this.searchService);
    } else  {
      this.searchService.search();
    }
  }

  public delQueryAndSearch(compName: string): void {
    const apiName: string = this.getApiName(compName);
    this.searchService.removeQuery(apiName);
    this.searchService.resetResults();
    this.searchService.search();
  }

  public toogleLost(): void {
    this.searchFound = !this.searchFound;
    this.searchService.addQuery('lost', !this.searchFound);
    if (this.initDateAnswer && (this.searchService.queryObj[this.searchService.apiDate.fromDate] || this.searchService.queryObj[this.searchService.apiDate.toDate])) {
      this.searchService.setDateFilter(this.tempDateAnswer);
    }
    this.searchService.resetResults();
    this.searchService.search();
  }

  public getApiName(componentName: string): string {
    const index: number = this.lostService.defualtSequence.indexOf(componentName);
    return ~index && this.lostService.defaulApikeys[index];
  }

  public searchForName(componentName: string): void {
    if (this.filterElements[componentName].answer && Array.isArray(this.filterElements[componentName].answer)) {
      this.showNameInput = this.filterElements[componentName].answer.some((answer: any, answerIndex: number) => {
        if (answer.name === 'Placa Id') {
          return true;
        }
        return false;
      });
    }
  }

  public getOnlyNames(answers: any): string[] {
    let colors: string[] = [];
    Array.isArray(answers) && answers.length && answers.forEach((answer: any, answerIndex: number) => {
      colors.push(answer.name);
    });
    return colors.length ? colors : undefined;
  }

  public increaseRange(): void {
    this.rangeDiameter = this.rangeDiameter >= 8 ? this.rangeDiameter : this.rangeDiameter * 2;
    this.searchService.maxDistance =  this.rangeDiameter * this.searchService.maxDistanceDefault;
    this.radioInMap =  this.rangeDiameter * 0.5;
    this.queryAndSearch('location', this.location);    
  }

 public decreaseRange(): void {
    this.rangeDiameter = this.rangeDiameter <= 1 ? this.rangeDiameter : this.rangeDiameter / 2;
    this.searchService.maxDistance =  this.rangeDiameter * this.searchService.maxDistanceDefault;
    this.radioInMap =  this.rangeDiameter * 0.5;
    this.queryAndSearch('location', this.location);
 }

 public scrollTop(): void {
   $('html, body').animate({ scrollTop: 0 }, 600);
 }
};
