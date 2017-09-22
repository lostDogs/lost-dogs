import {Component} from '@angular/core';
import {LostFoundService} from '../../../common/services/lost-found.service';
@Component({
  selector: 'color',
  template: require('./color.template.html'),
  styles: [ require('./color.scss')]
})

export class ColorComponent { 
  public elements: any[];
  constructor(public LostService: LostFoundService) {
    this.setElement();
  }
  
  public ngOnInit(): void {
    this.LostService.imgAnswer = undefined;
    this.LostService.question = 'Cual es su color?';
    this.LostService.inputField = {type: 'image', label: 'Color'};
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
    this.LostService.imgAnswer = event;
    console.log('event', event);
    setTimeout(()=>{this.LostService.tooltipInit();}, 20)
  }
}
