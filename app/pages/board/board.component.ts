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
    if (this.answersDom && this.answersDom.length) {
       //console.log('answerdom', this.answersDom[0]);
       let extraWidth: number = 0;
       let index: number = 0;
      this.answersDom.forEach((answerDom: ElementRef, answerIndex: number) => {
         index = this.activeIndex ? this.activeIndex : answerIndex;
         if (this.filterElements[this.filtersKey[index]].answer) {
           this.filterElements[this.filtersKey[index]].width = 'auto';
         }
        if (answerDom.nativeElement.clientWidth > this.widthPerFilter) {
          extraWidth = extraWidth + (answerDom.nativeElement.clientWidth - this.widthPerFilter);
        } else {
          this.filterElements[this.filtersKey[index]].width = this.widthPerFilter + 'px';
        }
        //console.log('answerDom.clientWidth', answerDom.nativeElement.clientWidth);
      });
      this.extraWidth = extraWidth;
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
  }


  public imgBlockRemove(componentName: string): void {
    this.filterElements[componentName].answer = undefined;
    this.resetDate = !this.filterElements.date.answer;
  }

  public multipleBlockRemove(componentName: string, index: number) {
    let disabledAmount: number = 0;
    this.filterElements[componentName].answer.splice(index, 1);
    this.filterElements[componentName].answer = JSON.parse(JSON.stringify(this.filterElements[componentName].answer));
  }
};
