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
  public repeatedIds: number;
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
    this.blockWidth = this.mobile ? 355 : 210;
    this.scrollleftSteeps = this.mobile ? 100 : 50;
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
    console.log('this.elements.length: ', this.elements.length)
    let splitArr: number = j / this.numberOfRows;
    splitArr = splitArr % 1 === 0 ? splitArr : splitArr + 1;
    this.splittedArray = Math.trunc(splitArr);
    //TODO: 25 is hardcodded margin, try to get it from DOM elment;
    this.rowWidth = splitArr * this.blockWidth + 25 + 'px';
    console.log('split arr', splitArr);
    console.log('blockWidth', this.blockWidth);
    console.log('row width', this.rowWidth);

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
    for ( let i = 0; i < this.elements.length; ++i) {
      $('#data-' + i + this.repeatedIds).attr('data-tooltip', this.elements[i].name);
    } 
    if (!this.mobile) {
      $('.tooltipped').tooltip({delay: 50});
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
      // search for uniqueness
      let some: boolean = this.multipleElements.some((el: Ielement, index: number) => {
        if (el.key === this.elements[indexed].key) {
          removeIndex = index;
          return true;
        }
      });
      if (removeIndex !== undefined && ~removeIndex) {
        this.multipleElements.splice(removeIndex, 1);
      }
      this.multipleElements.push(this.elements[indexed]);
      this.selectedEmitter.emit(this.multipleElements);
    }
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes.removedElement && changes.removedElement.currentValue) {
      const elements: Ielement = changes.removedElement.currentValue;
      if (Array.isArray(elements)) {
        this.elements.forEach((value: Ielement, index: number) => {
          this.elements[index].disabled = false;
        });
        elements.forEach((value: any, index: number) => {
          this.elements[value.orginalIndex].disabled = value.disabled;
        });
        this.multipleElements = elements;
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
  
}
