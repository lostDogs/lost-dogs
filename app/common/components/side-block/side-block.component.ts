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
  public numberOfRows: number = 2;
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
@Output()
public selectedEmitter: EventEmitter<any> = new EventEmitter<any>();
@Input()
public removedElement: Ielement;

  @ViewChild('scollSection') public scrolling: ElementRef;
  constructor() {
    this.mobile = window.screen.width <= 767;
    this.arrayOfArrays = [];
    this.blockWidth = this.mobile ? 350 : 200;
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
    this.rowWidth = splitArr*this.blockWidth + 'px';
    for (let i = 0; i < j; i += splitArr) {
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
    $('.clickable').nodoubletapzoom();
    const scrollLeft: any = this.scrolling.nativeElement;
    this.maxScrollLeft = scrollLeft.scrollWidth - scrollLeft.clientWidth;
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
    // removing previous elemet, index saved in a varaible 'previousSelected' to avoid using a loop. 
    this.elements[ this.previousSelected].disabled = false;
    // saving the original index into the object so we can emit it and latter deleted if selected.
    this.elements[indexed].orginalIndex = indexed;
    // this variable adds the class of disable in an img.
    this.elements[indexed].disabled = !this.elements[indexed].disabled;
    this.previousSelected = indexed;
    this.selectedEmitter.emit(this.elements[indexed]);
  }

  public ngOnChanges(changes: SimpleChanges): void {
  }
  
}
