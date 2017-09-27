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
    this.LostService.question2 = undefined;
    this.LostService.question3 = undefined;
    this.LostService.optional = false;
  }
  
  public ngOnInit(): void {
    this.LostService.imgAnswer = undefined;
    this.LostService.question = 'Cual es su color?';
    this.LostService.inputField = {type: 'image', label: 'Color'};
    this.LostService.retrieveData = this.fillData;
  }

  public fillData(pageAnswer: any, lostService: any): void {
    if (pageAnswer) {
      lostService.imgAnswer = pageAnswer;
    }
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
  }
}
