import {Component} from '@angular/core';
import {LostFoundService} from '../../../common/services/lost-found.service';
@Component({
  selector: 'size',
  template: require('./size.template.html'),
  styles: [ require('./size.scss')]
})

export class SizeComponent { 
  public elements: any[];
  constructor(public LostService: LostFoundService) {
    this.setElement();
  }
  
  public ngOnInit(): void {
    this.LostService.question = 'Cual es su tamaño?';
    this.LostService.imgAnswer = undefined;
    this.LostService.inputField = {type: 'image', label: 'Tamaño'};
  }

  public setElement() {
  this.elements = [
    {imgUrl:'http://cdn.lostdog.mx/assets/img/size-tiny.png', name: 'Dimimuto'},
    {imgUrl:'http://cdn.lostdog.mx/assets/img/size-small.png', name: 'Pequeño'},
    {imgUrl:'http://cdn.lostdog.mx/assets/img/size-medium.png', name: 'mediano'},
    {imgUrl:'http://cdn.lostdog.mx/assets/img/size-big.png', name: 'grande'}
    ];
  }


  public changeElement(event: any): void {
    this.LostService.imgAnswer = event;
  }
}
