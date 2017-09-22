import {Component} from '@angular/core';
import {LostFoundService} from '../../../common/services/lost-found.service';
@Component({
  selector: 'gender',
  template: require('./gender.template.html'),
  styles: [ require('./gender.scss')]
})

export class GenderComponent { 
  public elements: any[];
  constructor(public LostService: LostFoundService) {
    this.setElement();
  }
  
  public ngOnInit(): void {
    this.LostService.question = 'Cual es su genero?';
    this.LostService.imgAnswer = undefined;
    this.LostService.inputField = {type: 'image', label: 'Gender'};
  }

  public setElement() {
  this.elements = [
  {imgUrl:'http://cdn.lostdog.mx/assets/img/male-icon1.png', name: 'macho'},
  {imgUrl:'http://cdn.lostdog.mx/assets/img/female-icon1.png', name: 'hembra'}
  ];
  }


  public changeElement(event: any): void {
    this.LostService.imgAnswer = event;
    setTimeout(()=>{this.LostService.tooltipInit();}, 20)
  }
}
