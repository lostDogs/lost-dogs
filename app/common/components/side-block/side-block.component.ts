import {Component, Output, Input, EventEmitter, SimpleChanges, ViewChild, ElementRef} from '@angular/core';
require('../../plugins/nodoubletapzoom.js');

export interface Ielement {
 imgUrl: string;
 name: string;
 key?: string;
 disabled?: boolean;
 orginalIndex?: number;
 bgColor?: string;
 apiVal?: any;
}

@Component({
  selector: 'side-block',
  template: require('./side-block.template.html'),
  styles: [ require('./side-block.scss')]
})

export class SideBlockComponent {
  @Input()
  public elements: Ielement[];
  @Input()
  public numberOfRows: number;
  public arrayOfArrays: any[];
  public blockWidth: number;
  public rowWidth: string;
  public scrollleftSteeps: number;
  public maxScrollLeft: number;
  public pressedRight: boolean;
  public pressedLeft: boolean;
  public actualScroll: number = 0;
  public splittedArray: number = 0;
  public previousSelected: number = 0;
  public mobile: boolean;
  public showArrows: boolean;
  public repeatedIds: number;
  public inPatternType: number;
  @Input()
  public maxElments: number = 3;
  @Output()
  public selectedEmitter: EventEmitter<any> = new EventEmitter<any>();
  @Input()
  public removedElement: any;
  @Input()
  public multiple: boolean;
  public multipleElements: Ielement[];
  @Input()
  public patternType: boolean;
  @Input()
  public colors: string[];
  public colorOptions: any;
/*
* SplicedAnswer is a temp solution, because board splice elements from the array and in lost/ found not.
* when removing elements only lost/found went in the condition and spliced elements didnt, so splicedAnswer will tell 
* that elements will be removed so it can go inside the and change values.
* TODO: Refacto! -> lost/found should work as board. removing the elements from the array instead of change a disabled var.
*/
@Input()
public splicedAnswer: boolean;

  @ViewChild('ScollSection') public scrolling: ElementRef;
  constructor() {
    this.mobile = window.screen.width <= 767;
    this.arrayOfArrays = [];
    this.multipleElements = [];
    //TODO: blockWidth is the hardcoded with of the component. Try to get it trought the dom element 
    this.blockWidth = this.mobile ? 360 : 210;
    this.scrollleftSteeps = this.mobile ? 100 : 50;
     // For patternType only
    this.colorOptions = {};
  }

    public onScroll(ev: Event): void {
      if(this.actualScroll > this.scrolling.nativeElement.scrollLeft) {
        this.pressedLeft = true;
      } else if(this.actualScroll < this.scrolling.nativeElement.scrollLeft) {
        this.pressedRight = true;
      }
      this.actualScroll = this.scrolling.nativeElement.scrollLeft;
      setTimeout(() => {
        this.pressedRight = false;
        this.pressedLeft = false;
      }, 300);

    }

  public ngOnInit(): void {
    let j: number = this.elements.length;
    let splitArr: number = j / this.numberOfRows;
    splitArr = splitArr % 1 === 0 ? splitArr : splitArr + 1;
    this.splittedArray = Math.trunc(splitArr);
    //TODO: 25 is hardcodded margin, try to get it from DOM elment;
    this.rowWidth = splitArr * this.blockWidth + 25 + 'px';
    for (let i = 0; i < (j - 1); i += splitArr) {
        this.arrayOfArrays.push(this.elements.slice(i,i+splitArr));
    }
    this.repeatedIds =  $('[id^="data-"]').length;
    for ( let i = 0; i < this.elements.length; ++i) {
      this.elements[i]['key'] = 'data-' + i + this.repeatedIds;
    }
  }

  public ngDoCheck(): void {
    this.showArrows = this.scrolling.nativeElement.clientWidth < +this.rowWidth.split('px')[0];
    this.rowWidth = this.showArrows ? this.rowWidth : this.scrolling.nativeElement.clientWidth + 'px';
    const scrollLeft: any = this.scrolling.nativeElement;
    this.maxScrollLeft = scrollLeft.scrollWidth - scrollLeft.clientWidth;
  }

  public ngAfterViewInit(): void {
    if (this.elements.length && this.elements[0].name) {
      for ( let i = 0; i < this.elements.length; ++i) {
        $('#data-' + i + this.repeatedIds).attr('data-tooltip', this.elements[i].name);
      } 
      if (!this.mobile) {
        $('.tooltipped').tooltip({delay: 50});
      }
    }
    $('.sideblock').nodoubletapzoom();
  }


  public goLeft():void {
    if ( this.scrolling.nativeElement.scrollLeft - this.scrollleftSteeps >= 0) {
      this.pressedLeft = true;
      this.scrolling.nativeElement.scrollLeft = this.scrolling.nativeElement.scrollLeft - this.scrollleftSteeps;
      setTimeout(() => {this.pressedLeft = false;}, 300);
    }

  }

  public initDog(): void {
    // default presseed option
    if (this.patternType && this.elements[0].name === 'back-color' && this.colors && this.colors.length > 1) {
      this.blockSelected(null, null, 0);
      setTimeout(() => {this.colorSelected(0, 0, 0);}, 20);
    }    
  }

  public goRight(): void {
    if ( this.scrolling.nativeElement.scrollLeft + this.scrollleftSteeps <= this.maxScrollLeft) {
      this.pressedRight = true;
      this.scrolling.nativeElement.scrollLeft = this.scrolling.nativeElement.scrollLeft + this.scrollleftSteeps;
      setTimeout(() => {this.pressedRight = false;}, 300);
    }    
  }

  public blockSelected(row: number, column: number, indexed?: number) {
    if(indexed === undefined || indexed === null) {
      indexed = row *this.splittedArray  + column;
    }
    // saving the original index into the object so we can emit it and latter deleted if selected.
    this.elements[indexed].orginalIndex = indexed;
    if (!this.multiple) {
      // removing previous elemet, index saved in a varaible 'previousSelected' to avoid using a loop. 
      this.elements[ this.previousSelected].disabled = false;
    }
    //getting all disable elements, if there are more than the limit at maxElments then the will not be set to true
    const disabled = this.elements.filter((value: any, index: number) => {return value.disabled});
    // this variable adds the class of disable in an img.
    this.elements[indexed].disabled = disabled.length < this.maxElments ? !this.elements[indexed].disabled : false;
    if (!this.multiple) {
    this.selectedEmitter.emit(this.elements[indexed]);
    this.previousSelected = indexed;
    } else {
      let removeIndex: number;
      //this.multipleElements = this.removedElement && this.removedElement.length ? this.removedElement : this.multipleElements;
      // search for uniqueness
      let some: boolean = this.multipleElements.some((el: Ielement, index: number) => {
        if (el.name === this.elements[indexed].name) {
          removeIndex = index;
          return true;
        }
      });
      if (removeIndex !== undefined && ~removeIndex) {
        this.multipleElements.splice(removeIndex, 1);
      }
      if(disabled.length < this.maxElments) {
        this.multipleElements.push(this.elements[indexed]);
      }
      this.selectedEmitter.emit(this.multipleElements);
    }
  }

  public colorSelected(row: number, column: number, colorNum: number, indexed?: number) {
    if(indexed === undefined || indexed === null) {
      indexed = row *this.splittedArray  + column;
    }
    if (this.elements[indexed].disabled) {
      const color: string = this.colors[colorNum];
      const elName: string = this.elements[indexed].name.split(':')[0];
      const queryString: string = '.sideblock ' + '#' + this.elements[indexed].key + ' dog-figure #' + elName + ' g';
      const queryAllBlocks: string = '.sideblock dog-figure #' + elName + ' g';
      let queryColorChange: JQuery;
      if (elName === 'back-color') {
        queryColorChange = $(queryAllBlocks);
      } else {
        queryColorChange = $(queryString);
      }
      this.colors.forEach((color: string, colorIndex: number) => {
        this.colorOptions[indexed][colorIndex].disabled = false;
      });
      this.colorOptions[indexed][colorNum].disabled = true;
      queryColorChange.attr('style', 'fill:' + color);
      this.colorEmit(indexed, colorNum, true);
    } else {
      this.colorEmit(indexed, colorNum, false);
    }
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes.colors && changes.colors.currentValue) {
        // For patternType only generating the disable block color for each pattern type.
        if (this.patternType && this.colors && this.colors.length) {
          let colorBlock: any = {};
          this.colors.length && this.colors.forEach((color: string, colorIndex: number) => {
            colorBlock[colorIndex] = {disabled: false};
          });
          this.elements.forEach((value: any, index: number) => {
            this.colorOptions[index] = JSON.parse(JSON.stringify(colorBlock));
          });
        }
    }
    if (changes.removedElement && changes.removedElement.currentValue) {
      const elements: Ielement = changes.removedElement.currentValue;
      if (Array.isArray(elements)) {
        const disabled: any[] = elements.filter((value: any, index: number) => {return value.disabled});
        const notDisabled: any[] = elements.filter((value: any, index: number) => {return !value.disabled});
        if (!changes.removedElement.isFirstChange() && (notDisabled.length || this.splicedAnswer) && elements[elements.length - 1] !== 'retrieve') {  
          // setting
          this.elements.forEach((value: Ielement, index: number) => {
            this.elements[index].disabled = false;
          });
          elements.forEach((value: any, index: number) => {
            this.elements[value.orginalIndex].disabled = value.disabled;
          });
          this.multipleElements = elements;
        } else if(disabled.length && elements[elements.length - 1] === 'retrieve') {
         elements.splice(elements.length - 1, 1);
         this.retrieveMultiple();
        } else if (this.colors && changes.removedElement.isFirstChange()) {
           this.initDog();
        }
      }else if(!Array.isArray(elements)) {
          this.elements[elements.orginalIndex].disabled = elements.disabled;
          this.previousSelected = elements.orginalIndex;
      }
    }else if (changes.removedElement && !changes.removedElement.currentValue && changes.removedElement.previousValue) {
      const prevElment: Ielement = changes.removedElement.previousValue;
      if(prevElment.key && !Array.isArray(prevElment)) {
      this.elements[prevElment.orginalIndex].disabled = false;
      this.previousSelected = prevElment.orginalIndex;
      }
    }
  }

  public retrieveMultiple(): void {
    if (this.removedElement && this.removedElement.length) {
      const disabled: Ielement[] = this.removedElement.filter((value: any, index: number) => {return value.disabled});
      disabled.forEach((value: Ielement, index: number) => {
        this.elements[value.orginalIndex].disabled = true;
        if (this.patternType && value.name.split(':')[1]) {
          const color: string = value.name.split(':')[1].trim();
          const colorIndex: number = this.colors.indexOf(color);
          ~colorIndex && setTimeout(() => {this.colorSelected(null, null, colorIndex, value.orginalIndex);}, 20);
        }        
      });
      this.multipleElements = this.removedElement;
    }
  }

  // Being executed first on dog-figure and then emits the action.
  // The blockSelected function was disable when it is  paterType.
  // PatternType = dog-figure.
  public dogClicked(indexed: any): void {
    if(indexed === 0) {
      // means it is back-color, that should always be selected.
      return;
    }
    this.blockSelected(null, null, indexed);
    this.inPatternType = indexed;
    // checking if color is selected
      this.colors.forEach((color: string, colorIndex: number) => {
        if (this.colorOptions[indexed][colorIndex].disabled) {
          this.colorSelected(null, null, colorIndex, indexed);
        }
      });
      const name: string = this.elements[indexed].name.split(':')[0];
    if (!this.elements[indexed].disabled && name === 'back-color') {
          const queryAllBlocks: string = '.sideblock dog-figure #' + name + ' g';
          $(queryAllBlocks).attr('style', 'fill: white');
        }    
  }

  public colorEmit(indexed: number, colorIndex: number, addColor: boolean): void {
    const name: string = this.elements[indexed].name.split(':')[0];
    const color: string = this.colors[colorIndex];
    this.multipleElements.some((el: any, elIndex: number) => {
      const elName: string = el.name.split(':')[0];
      if (elName === name) {
        if (addColor) {
          this.multipleElements[elIndex].name = name + ': ' + color;
        } else {
          this.multipleElements[elIndex].name = name;
        }
        return true;
      }
    });
    this.selectedEmitter.emit(this.multipleElements);
  }  
}
