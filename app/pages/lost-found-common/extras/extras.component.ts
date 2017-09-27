import {Component} from '@angular/core';
import {LostFoundService} from '../../../common/services/lost-found.service';
@Component({
  selector: 'extras',
  template: require('./extras.template.html'),
  styles: [ require('./extras.scss')]
})

export class ExtrasComponent { 
  public elements: any[];
  constructor(public LostService: LostFoundService) {
    this.LostService.multipleImgAnswers = [];
    this.LostService.question2 = undefined;
    this.LostService.question3 = undefined;
    this.LostService.optional = true;
    this.setElement();
  }
  
  public ngOnInit(): void {
    this.LostService.question = 'Que acessorios Tenia?';
    this.LostService.imgAnswer = undefined;
    this.LostService.inputField = {type: 'multiple', label: 'Extras'};
   this.LostService.retrieveData = this.fillData;
  }

  public fillData(pageAnswer: any, lostService: any): void {
    if (pageAnswer) {
      lostService.multipleImgAnswers = pageAnswer;
    }
  }  

  public setElement() {
  this.elements = [
  {imgUrl:'http://cdn.lostdog.mx/assets/img/acess-collar.png', name: 'collar'},
  {imgUrl:'http://cdn.lostdog.mx/assets/img/acess-sueter.png', name: 'suter'},
  {imgUrl:'http://cdn.lostdog.mx/assets/img/acess-tag.png', name: 'Placa Id'}
  ];
  }


  public changeElement(event: any): void {
    this.LostService.multipleImgAnswers = event;
    const lastIndex: number = this.LostService.multipleImgAnswers.length - 1;
    this.LostService.openNameInput = this.LostService.multipleImgAnswers.length && this.LostService.multipleImgAnswers[lastIndex].name === 'Placa Id';
  }
}
