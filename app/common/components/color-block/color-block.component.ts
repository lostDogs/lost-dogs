import {Component, EventEmitter, Output, Input} from '@angular/core';
import * as colors from '../../content/colors.json';

@Component({
  selector: 'color-block',
  template: require('./color-block.template.html'),
  styles: [ require('./color-block.scss')]
})

export class ColorBlockComponent { 
  public elements: any[];
  public bgColors: any[] = [];
  @Output()
  public selectedEmitter: EventEmitter<any> = new EventEmitter<any>();  
  @Input()
  public removedElement: any;  
  constructor() {
    const colorValues: string[] = Object.values(colors)
    this.setElement();
    for (let i = 0; i < colorValues.length; ++i) {
      this.bgColors.push({bgColor: colorValues[i], name: colorValues[i]});
    }
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
