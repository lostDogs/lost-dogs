import {Component} from '@angular/core';
import {LostFoundService} from '../../../common/services/lost-found.service';
@Component({
  selector: 'size',
  template: require('./size.template.html'),
  styles: [ require('./size.scss')]
})

export class SizeComponent { 
  constructor(public LostService: LostFoundService) {
    this.LostService.question2 = undefined;
    this.LostService.question3 = undefined;    
  }
  
  public ngOnInit(): void {
    this.LostService.question = 'Cual es su tamaño?';
    this.LostService.imgAnswer = undefined;
    this.LostService.inputField = {type: 'image', label: 'Tamaño'};
    this.LostService.retrieveData = this.fillData;
  }

   public fillData(pageAnswer: any, lostService: any): void {
    if (pageAnswer) {
      lostService.imgAnswer = pageAnswer;
    }
  } 

  public changeElement(event: any): void {
    this.LostService.imgAnswer = event;
    this.LostService.setAnwer();
  }
}
