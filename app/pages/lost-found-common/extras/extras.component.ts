import {Component} from '@angular/core';
import {LostFoundService} from '../../../common/services/lost-found.service';
@Component({
  selector: 'extras',
  template: require('./extras.template.html'),
  styles: [ require('./extras.scss')]
})

export class ExtrasComponent { 

  constructor(public LostService: LostFoundService) {
    this.LostService.multipleImgAnswers = [];
    this.LostService.question2 = undefined;
    this.LostService.question3 = undefined;
    this.LostService.optional = true;
  }
  
  public ngOnInit(): void {
    this.LostService.imgAnswer = undefined;
    this.LostService.inputField = {type: 'multiple', label: 'Extras'};
   this.LostService.retrieveData = this.fillData;
    if (this.LostService.parentPage === 'lost') { 
      this.LostService.question = 'Que acessorios tenia?';
    } else if(this.LostService.parentPage === 'found') {
      this.LostService.question = 'Que acessorios tiene?';
    }    
  }

  public fillData(pageAnswer: any, lostService: any): void {
    if (pageAnswer) {
      if (pageAnswer[0].names) {
        const tempAns: any[] = [];
        pageAnswer[0].names.forEach((value: any, index: number) => {
          const obj = {name: value,  imgUrl: pageAnswer[0].imgUrls[index], orginalIndex: pageAnswer[0].Indexs[index]};
          tempAns.push(obj);
        });
        lostService.multipleImgAnswers = tempAns;
      } else {
        lostService.multipleImgAnswers = pageAnswer;
      }

    }
  }  

  public changeElement(event: any): void {
    this.LostService.multipleImgAnswers = event;
    const lastIndex: number = this.LostService.multipleImgAnswers.length - 1;
    this.LostService.openNameInput = this.LostService.multipleImgAnswers.length && this.LostService.multipleImgAnswers[lastIndex].name === 'Placa Id';
  }
}
