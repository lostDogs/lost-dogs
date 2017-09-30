import {Component, Output, Input, EventEmitter, SimpleChanges, ViewChild, ElementRef} from '@angular/core';
require('../../plugins/nodoubletapzoom.js');

export interface Ielement {
 imgUrl: string;
 name: string;
 key?: string;
 disabled?: boolean;
 orginalIndex?: number;
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
  public splittedArray: number;
  public previousSelected: number = 0;
  public mobile: boolean;
  public showArrows: boolean;
@Output()
public selectedEmitter: EventEmitter<any> = new EventEmitter<any>();
@Input()
public removedElement: any;
@Input()
public multiple: boolean;
public multipleElements: Ielement[];

  @ViewChild('ScollSection') public scrolling: ElementRef;
  constructor() {
    this.mobile = window.screen.width <= 767;
    this.arrayOfArrays = [];
    this.multipleElements = [];
    //TODO: blockWidth is the hardcoded with of the component. Try to get it trought the dom element 
    this.blockWidth = this.mobile ? 355 : 200;
    this.scrollleftSteeps = this.mobile ? 80 : 20;
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
    this.showArrows = this.scrolling.nativeElement.clientWidth < +this.rowWidth.split('px')[0];
    this.rowWidth = this.showArrows ? this.rowWidth : this.scrolling.nativeElement.clientWidth;
    for (let i = 0; i < (j - 1); i += splitArr) {
        this.arrayOfArrays.push(this.elements.slice(i,i+splitArr));
    }   
    for ( let i = 0; i < this.elements.length; ++i) {
      this.elements[i]['key'] = 'data-' + i;
    }
  }

  public ngAfterViewInit(): void {
    for ( let i = 0; i < this.elements.length; ++i) {
      $('#data-' + i).attr('data-tooltip', this.elements[i].name);
    } 
    $('.tooltipped').tooltip({delay: 50});
    $('.sideblock').nodoubletapzoom();
    const scrollLeft: any = this.scrolling.nativeElement;
    this.maxScrollLeft = scrollLeft.scrollWidth - scrollLeft.clientWidth;
    //TODO: revomove if doesnt work on mobile.
    if (this.mobile) {
      $('.element').click(() => {
         $('.element').dblclick();
      });
    }
  }

  public goLeft():void {
    if ( this.scrolling.nativeElement.scrollLeft - this.scrollleftSteeps >= 0) {
      this.pressedLeft = true;
      this.scrolling.nativeElement.scrollLeft = this.scrolling.nativeElement.scrollLeft - this.scrollleftSteeps;
      setTimeout(() => {this.pressedLeft = false;}, 300);
    }

  }

  public goRight(): void {
    if ( this.scrolling.nativeElement.scrollLeft + this.scrollleftSteeps <= this.maxScrollLeft) {
      this.pressedRight = true;
      this.scrolling.nativeElement.scrollLeft = this.scrolling.nativeElement.scrollLeft + this.scrollleftSteeps;
      setTimeout(() => {this.pressedRight = false;}, 300);
    }    
  }
  public blockSelected (row: number, column: number) {
    const indexed: number = row *this.splittedArray  + column;
    // saving the original index into the object so we can emit it and latter deleted if selected.
    this.elements[indexed].orginalIndex = indexed;
    if (!this.multiple) {
      // removing previous elemet, index saved in a varaible 'previousSelected' to avoid using a loop. 
      this.elements[ this.previousSelected].disabled = false;
    }
    // this variable adds the class of disable in an img.
    this.elements[indexed].disabled = !this.elements[indexed].disabled;
    if (!this.multiple) {
    this.selectedEmitter.emit(this.elements[indexed]);
    this.previousSelected = indexed;
    } else {
      let removeIndex: number;
      this.multipleElements = this.removedElement && this.removedElement.length ? this.removedElement : this.multipleElements;
      const some: boolean = this.multipleElements.some((el: Ielement, index: number) => {
        if (el.key === this.elements[indexed].key) {
          removeIndex = index;
          return true;
        }
      });
      if (this.elements[indexed].disabled && !some) {
        this.multipleElements.push(this.elements[indexed]);
      } else if (removeIndex !== undefined && ~removeIndex && !this.elements[indexed].disabled) {
        this.multipleElements.splice(removeIndex, 1)
      }
      this.selectedEmitter.emit(this.multipleElements);
    }
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes.removedElement && changes.removedElement.currentValue) {
      const elements: Ielement = changes.removedElement.currentValue;
      if (Array.isArray(elements) && elements.length) {
          elements.forEach((value: any, index: number) => {
            this.elements[value.orginalIndex].disabled = value.disabled;
          });
      }else if(!Array.isArray(elements)) {
          this.elements[elements.orginalIndex].disabled = elements.disabled;
          this.previousSelected = elements.orginalIndex;
      }
    }
  }
  
}
