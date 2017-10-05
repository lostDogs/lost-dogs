import { Component, ViewChildren, QueryList, ElementRef} from '@angular/core';
import {DogCardService} from '../../common/services/dog-card.service';
import {LostFoundService} from '../../common/services/lost-found.service';

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
  public dogCards: any[];
  public resetDate: any;
  public location:  {latLng?: any, address?: string} = {};
  public window: Window;
  public initMap: boolean;
  public screenWidth: number;
  //location.reload();
  @ViewChildren('AnswerBlock') 
  public answersDom: QueryList<any>;
  public widthPerFilter: number;
  public extraWidth: number = 0;
  
  public initMapAnswer: boolean;
  public tempMapAnswer: any;
  public initDateAnswer: boolean;
  public tempDateAnswer: string;

  constructor(public dogCardService: DogCardService, public lostService: LostFoundService) {
    this.filtersKey = [];
    this.dogCards = [];
    this.window = window;
    this.screenWidth = window.screen.width;
    for (let i = 0; i < 13; ++i) {
      this.dogCards.push(i);
    } 
    this.dogCardService.open = false;
    this.lostService.defaultDisplayedSequence.forEach((componentLabel: string, index: number) => {
      this.filtersKey.push(this.lostService.defualtSequence[index]);
      this.filterElements[this.lostService.defualtSequence[index]] = {label: componentLabel};
    });

    this.widthPerFilter = this.screenWidth / this.filtersKey.length - 1;
    this.lostService.defaultDisplayedSequence.forEach((componentLabel: string, index: number) => {
      this.filterElements[this.lostService.defualtSequence[index]].width = this.widthPerFilter + 'px';
    });
  }

  public ngDoCheck(): void {
    this.reziseFiltersRow();
  }

  public reziseFiltersRow(): void {
    if (this.answersDom && this.answersDom.length) {
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
    this.initMap = this.filterElements.location.enable;

    if (this.filterElements.location.enable) {
       this.initMapAnswer = true;
       this.filterElements[componentName].answer = this.tempMapAnswer;
    }
    if (this.filterElements.date.enable) {
      this.initDateAnswer = true;
      this.filterElements[componentName].answer = this.tempDateAnswer;
    }
    //this.reziseFiltersRow();
  }

  public selectionReciver(componentName: string, event: any): void {
   let typeOfAnswer: string;
   if (event.name) {
     typeOfAnswer = 'image';
   } else if (!Array.isArray(event)) {
     typeOfAnswer = 'date';
     this.tempDateAnswer = event;
     event = this.initDateAnswer ? event : undefined;
   }
   // event = typeof event === 'object' ? JSON.parse(JSON.stringify(event)) : event
   this.filterElements[componentName].answer =  event;
   this.filterElements[componentName].typeOfAnswer = typeOfAnswer;
   this.resetDate = false;
   //this.reziseFiltersRow();
  }

  public locationReciver(event: any) {
    if (event.lat) {
      this.location.latLng = event;
    } else  {
      this.location.address = event
    }
    if (this.initMapAnswer) {
     this.filterElements.location.answer = this.location.latLng &&  this.location.address ? this.location : undefined;            
    } else  {
      this.tempMapAnswer = this.location.latLng &&  this.location.address ? this.location : undefined;
    }
   this.filterElements.location.typeOfAnswer = 'location';
   //this.reziseFiltersRow();
  }


  public imgBlockRemove(componentName: string): void {
    this.filterElements[componentName].answer = undefined;
    this.resetDate = !this.filterElements.date.answer;
    this.filterElements[componentName].asnwerExtraWidth = 0;
    this.filterElements[componentName].width = this.widthPerFilter + 'px';
  }

  public multipleBlockRemove(componentName: string, index: number) {
    let disabledAmount: number = 0;
    this.filterElements[componentName].answer.splice(index, 1);
    this.filterElements[componentName].answer = JSON.parse(JSON.stringify(this.filterElements[componentName].answer));
  }
};
