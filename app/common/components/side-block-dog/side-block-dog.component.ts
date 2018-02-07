import {Component, Output, Input, EventEmitter, SimpleChanges, ViewChild, ElementRef} from '@angular/core';
import {DogCardService} from '../../services/dog-card.service';

require('../../plugins/nodoubletapzoom.js');

@Component({
  selector: 'side-block-dog',
  template: require('./side-block-dog.template.html'),
  styles: [ require('./side-block-dog.scss')]
})

export class SideBlockDogComponent {
  public blockWidth: number;
  public rowWidth: string;
  public scrollleftSteeps: number;
  public maxScrollLeft: number;
  public pressedRight: boolean;
  public pressedLeft: boolean;
  public actualScroll: number = 0;
  public mobile: boolean;
  public showArrows: boolean;
  @Input()
  public dogData: any[];
  @Input()
  public totalResults: number;
  @Input()
  public prevTotal: number = 0;
  @ViewChild('ScollSection')
  public scrolling: ElementRef;

  constructor(public dogCard: DogCardService ) {
    this.dogData = [];
    this.mobile = window.screen.width <= 767;
    //TODO: blockWidth is the hardcoded with of the component. Try to get it trought the dom element 
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
  }

  public ngDoCheck(): void {
    if (this.dogCard.width && this.dogData) {
      this.rowWidth = this.dogData.length * this.blockWidth + 25 + 'px';
      this.showArrows = this.scrolling.nativeElement.clientWidth < +this.rowWidth.split('px')[0];
      this.rowWidth = this.showArrows ? this.rowWidth : this.scrolling.nativeElement.clientWidth + 'px';
      const scrollLeft: any = this.scrolling.nativeElement;
      this.maxScrollLeft = scrollLeft.scrollWidth - scrollLeft.clientWidth;
    }
  }

  public ngAfterViewInit(): void {
    $('.sideblock').nodoubletapzoom();
    this.blockWidth = this.dogCard.width;
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

  public ngOnChanges(changes: SimpleChanges): void {
    if(changes.dogData && changes.dogData.currentValue) {
      this.rowWidth = this.dogData.length * this.blockWidth + 25 + 'px';
    }
  }
  
}
