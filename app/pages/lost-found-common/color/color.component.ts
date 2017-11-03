import {Component} from '@angular/core';
import {LostFoundService} from '../../../common/services/lost-found.service';
@Component({
  selector: 'color',
  template: require('./color.template.html'),
  styles: [ require('./color.scss')]
})

export class ColorComponent { 
  constructor(public LostService: LostFoundService) {
    this.LostService.question2 = undefined;
    this.LostService.question3 = undefined;
    this.LostService.optional = false;
    this.LostService.multipleImgAnswers = [];
  }
  
  public ngOnInit(): void {
    this.LostService.imgAnswer = undefined;
    this.LostService.inputField = {type: 'multiple', label: 'Color'};
    this.LostService.retrieveData = this.fillData;
    this.LostService.question = 'Cual es su color?';
  }

  public fillData(pageAnswer: any, lostService: any): void {
    if (pageAnswer) {
      pageAnswer.push('retrieve');
      lostService.multipleImgAnswers = pageAnswer;
    }
  }

  public changeElement(event: any): void {
    this.LostService.multipleImgAnswers = event;
    const patternString: string = 'pattern';
    const patternName: string = 'Patron';
    const notDisabled: any[] = this.LostService.multipleImgAnswers.filter((value: any, index: number)=>{return value.disabled});
    const patternIndex: number = this.LostService.defualtSequence.indexOf(patternString);
    if (notDisabled.length > 1 && !(~patternIndex)) {
      this.LostService.defualtSequence.splice( this.LostService.pagePosition + 1, 0, patternString);
      this.LostService.defaultDisplayedSequence.splice(this.LostService.pagePosition + 1, 0, patternName);
      this.LostService.defaulApikeys.splice(this.LostService.pagePosition + 1, 0, patternString);
    }
    if (notDisabled.length && notDisabled.length <= 1 && ~patternIndex) {
      this.LostService.defualtSequence.splice(patternIndex, 1);
      this.LostService.defaultDisplayedSequence.splice(patternIndex, 1);
      this.LostService.defaulApikeys.splice(patternIndex, 1);
    }
  }
}
