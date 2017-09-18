import {Component, Output, Input, EventEmitter, SimpleChanges, ViewChild, ElementRef} from '@angular/core';
interface Ielement {
 imgUrl: string;
 name: string;
 key?: string;
}

@Component({
  selector: 'side-block',
  template: require('./side-block.template.html'),
  styles: [ require('./side-block.scss')]
})

export class SideBlockComponent {

  public elements: Ielement[];
  public numberOfRows: number = 2;
  public arrayOfArrays: any[];
  public blockWidth: number;
  public rowWidth: string;
  public scrollleftSteeps: number = 20;
  public maxScrollLeft: number;
  public pressedRight: boolean;
  public pressedLeft: boolean;
  public actualScroll: number = 0;

  @ViewChild('scollSection') public scrolling: ElementRef;
  constructor() {
    this.arrayOfArrays = [];
    this.blockWidth = 200;
    this.elements = [
    {imgUrl:'/static/temp-profile-dog.jpg', name: 'dog1'},
    {imgUrl:'/static/temp-profile-dog.jpg', name: 'dog2'},
    {imgUrl:'/static/temp-profile-dog.jpg', name: 'dog3'},
    {imgUrl:'/static/temp-profile-dog.jpg', name: 'dog4'},
    {imgUrl:'/static/temp-profile-dog.jpg', name: 'dog5'},
    {imgUrl:'/static/temp-profile-dog.jpg', name: 'dog6'},
    {imgUrl:'/static/temp-profile-dog.jpg', name: 'dog7'},
    {imgUrl:'/static/temp-profile-dog.jpg', name: 'dog8'},
    {imgUrl:'/static/temp-profile-dog.jpg', name: 'dog9'},
    {imgUrl:'/static/temp-profile-dog.jpg', name: 'dog10'},
    {imgUrl:'/static/temp-profile-dog.jpg', name: 'dog11'},
    {imgUrl:'/static/temp-profile-dog.jpg', name: 'dog12'},
    {imgUrl:'/static/temp-profile-dog.jpg', name: 'dog13'}
    ];
  }

    public onScroll(ev: Event): void {
      console.log(this.scrolling.nativeElement.scrollLeft);
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
  public ngOnChanges(changes: SimpleChanges): void {

  }
  
}
