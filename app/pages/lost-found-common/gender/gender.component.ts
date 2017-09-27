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
    this.LostService.question2 = undefined;
    this.LostService.question3 = undefined;
    this.LostService.optional = false;
    this.setElement();
  }
  
  public ngOnInit(): void {
    this.LostService.question = 'Cual es su genero?';
    this.LostService.imgAnswer = undefined;
    this.LostService.inputField = {type: 'image', label: 'Gender'};
    this.LostService.retrieveData = this.fillData;
  }

   public fillData(pageAnswer: any, lostService: any): void {
    if (pageAnswer) {
      lostService.imgAnswer = pageAnswer;
    }
  }  

  public setElement() {
  this.elements = [
  {imgUrl:'http://cdn.lostdog.mx/assets/img/male-icon1.png', name: 'macho'},
  {imgUrl:'http://cdn.lostdog.mx/assets/img/female-icon1.png', name: 'hembra'}
  ];
  }


  public changeElement(event: any): void {
    this.LostService.imgAnswer = event;
  }
}
