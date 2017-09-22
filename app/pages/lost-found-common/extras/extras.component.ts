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
    this.setElement();
  }
  
  public ngOnInit(): void {
    this.LostService.question = 'Que acessorios Tenia?';
    this.LostService.imgAnswer = undefined;
    this.LostService.inputField = {type: 'multiple', label: 'Extras'};
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
    //tooltip initialization in the main page. (lost/found)
    setTimeout(()=>{this.LostService.tooltipInit();}, 20)
  }
}
