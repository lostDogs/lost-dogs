import {Component, EventEmitter, Output, Input} from '@angular/core';

@Component({
  selector: 'color-block',
  template: require('./color-block.template.html'),
  styles: [ require('./color-block.scss')]
})

export class ColorBlockComponent { 
  public elements: any[];
  @Output()
  public selectedEmitter: EventEmitter<any> = new EventEmitter<any>();  
  @Input()
  public removedElement: any;  
  constructor() {
    this.setElement();
  }
  
  public ngOnInit(): void {
  }


  public setElement() {
  this.elements = [
    {imgUrl:'http://cdn.lostdog.mx/assets/img/temp-color1.jpg', name: 'cafe claro con blanco'},
    {imgUrl:'http://cdn.lostdog.mx/assets/img/temp-color2.jpg', name: 'negro con blanco'},
    {imgUrl:'http://cdn.lostdog.mx/assets/img/temp-color3.jpg', name: 'blanco'},
    {imgUrl:'http://cdn.lostdog.mx/assets/img/temp-color1.jpg', name: 'cafe claro con blanco'},
    {imgUrl:'http://cdn.lostdog.mx/assets/img/temp-color2.jpg', name: 'negro con blanco'},
    {imgUrl:'http://cdn.lostdog.mx/assets/img/temp-color3.jpg', name: 'blanco'},
    {imgUrl:'http://cdn.lostdog.mx/assets/img/temp-color1.jpg', name: 'cafe claro con blanco'},
    {imgUrl:'http://cdn.lostdog.mx/assets/img/temp-color2.jpg', name: 'negro con blanco'},
    {imgUrl:'http://cdn.lostdog.mx/assets/img/temp-color3.jpg', name: 'blanco'},
    {imgUrl:'http://cdn.lostdog.mx/assets/img/temp-color1.jpg', name: 'cafe claro con blanco'},
    {imgUrl:'http://cdn.lostdog.mx/assets/img/temp-color2.jpg', name: 'negro con blanco'},
    {imgUrl:'http://cdn.lostdog.mx/assets/img/temp-color3.jpg', name: 'blanco'},
    {imgUrl:'http://cdn.lostdog.mx/assets/img/temp-color1.jpg', name: 'cafe claro con blanco'},
    {imgUrl:'http://cdn.lostdog.mx/assets/img/temp-color2.jpg', name: 'negro con blanco'},
    {imgUrl:'http://cdn.lostdog.mx/assets/img/temp-color3.jpg', name: 'blanco'},
    {imgUrl:'http://cdn.lostdog.mx/assets/img/temp-color1.jpg', name: 'cafe claro con blanco'},
    {imgUrl:'http://cdn.lostdog.mx/assets/img/temp-color2.jpg', name: 'negro con blanco'},
    {imgUrl:'http://cdn.lostdog.mx/assets/img/temp-color3.jpg', name: 'blanco'},
    {imgUrl:'http://cdn.lostdog.mx/assets/img/temp-color1.jpg', name: 'cafe claro con blanco'},
    {imgUrl:'http://cdn.lostdog.mx/assets/img/temp-color2.jpg', name: 'negro con blanco'},
    {imgUrl:'http://cdn.lostdog.mx/assets/img/temp-color3.jpg', name: 'blanco'}
  ];
  }


  public changeElement(event: any): void {
    this.selectedEmitter.emit(event);
  }
}
