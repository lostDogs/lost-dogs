import { Component, ViewChildren, QueryList, ElementRef, ViewChild} from '@angular/core';
import {DogCardService} from '../../common/services/dog-card.service';
import {LostFoundService} from '../../common/services/lost-found.service';
import { AsyncPipe } from '@angular/common';
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
  public dogCards: any[];
  public resetDate: any;
  public location:  {latLng?: any, address?: string} = {};
  public window: Window;
  public screenWidth: number;
  @ViewChild('Location')
  public LocationDom: ElementRef;
  @ViewChild('Components')
  public ComponentsDom: ElementRef;
  @ViewChildren('AnswerBlock')
  public answersDom: QueryList<any>;
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

  constructor(public dogCardService: DogCardService, public lostService: LostFoundService) {
    this.filtersKey = [];
    this.dogCards = [];
    this.window = window;
    this.mobile = window.screen.width <= 767;
    this.screenWidth = document.documentElement.clientWidth;
    this.mapWidth = this.screenWidth;
    if (this.mobile) {
       this.screenWidth *= 2;
    }
    for (let i = 0; i < 13; ++i) {
      this.dogCards.push(i);
    } 
    this.dogCardService.open = false;
    // TEMP block
    //TODO: integrate pattern well
    this.lostService.resetService();
    const disPat: number = this.lostService.defaultDisplayedSequence.indexOf('Patron');
    const seqPat: number = this.lostService.defualtSequence.indexOf('pattern');
    if (~disPat && ~seqPat) {
      const displayed = this.lostService.defaultDisplayedSequence.splice(disPat, 1);
      const sequence = this.lostService.defualtSequence.splice(seqPat,1)
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

  public ngDoCheck(): void {
    this.reziseFiltersRow();
  }

  public ngOnInit(): void {
    $('#date-input').mask('0000/00/00');
  }

  public ngAfterViewInit(): void {
    $('select').material_select();
    $('select').change(() => {
      const input = $('#sort-by');
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
    }
    if (this.filterElements.date.enable) {
      this.initDateAnswer = true;
      this.filterElements[componentName].answer = this.tempDateAnswer;
    }
    //this.reziseFiltersRow();
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
   this.resetDate = false;
   if (componentName =  'color') {
     this.colorsSelected = this.getOnlyNames(event);
   }
   this.searchForName(componentName);
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
    this.showMapInput = !!event;
    this.filterElements.location.typeOfAnswer = 'location';
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
    if (!this.filterElements[componentName].answer.length) {
      this.filterElements[componentName].asnwerExtraWidth = 0;
      this.filterElements[componentName].width = this.widthPerFilter + 'px';
      setTimeout(() => {
        this.filterElements[componentName].answer = undefined;
      }, 5);
    }
    this.searchForName(componentName);
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
};
