import {Component, EventEmitter, Output} from '@angular/core';
import {LostFoundService} from '../../../common/services/lost-found.service';
@Component({
  selector: 'breed',
  template: require('./breed.template.html'),
  styles: [ require('./breed.scss')]
})

export class BreedComponent {  
 
  constructor(public LostService: LostFoundService) {
    this.LostService.optional = false;
    this.LostService.question2 = undefined;
    this.LostService.question3 = undefined;
  }
  
  public ngOnInit(): void {
    this.LostService.inputField = {type: 'multiple', label: 'raza'};
    this.LostService.imgAnswer = undefined;
    this.LostService.multipleImgAnswers = undefined;
    this.LostService.retrieveData = this.fillData;
    
    if (this.LostService.parentPage === 'lost') { 
      this.LostService.question = 'Que raza es?';
    } else if(this.LostService.parentPage === 'found') {
      this.LostService.question = 'A cual se parece?';
    }
  }

  public changeElement(event: any[]): void {
    if (event.length) {
      this.LostService.multipleImgAnswers = event.filter((value: any, index: number)=>{return value.disabled});
    } else {
      this.LostService.multipleImgAnswers = [];
    }
    this.LostService.setAnwer();
  }

  public fillData(pageAnswer: any, lostService: any): void {
    if (pageAnswer) {
      pageAnswer.push('retrieve');
      lostService.multipleImgAnswers = lostService.copyAnswer(pageAnswer);
    }
  }

  public changeTitle(event: any) {
    if (event) {
      this.LostService.question = 'A cual se parece?';
    }else  {
      this.LostService.question = 'Que raza es?';
    }
  }
}
