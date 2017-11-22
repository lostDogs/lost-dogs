import {Component} from '@angular/core';
import {LostFoundService} from '../../../common/services/lost-found.service';
@Component({
  selector: 'Pattern',
  template: require('./pattern.template.html'),
  styles: [ require('./pattern.scss')]
})

export class PatternComponent {
  public colorsSelected: string[];
  constructor(public LostService: LostFoundService) {
    this.LostService.question2 = undefined;
    this.LostService.question3 = undefined;
    this.LostService.optional = false;
  }
  
  public ngOnInit(): void {
    this.LostService.imgAnswer = undefined;
    this.LostService.inputField = {type: 'multiple', label: 'Patron'};
    this.LostService.retrieveData = undefined;
    this.LostService.question = 'Cual es su Patron?';
    const colorIndex: number = this.LostService.defualtSequence.indexOf('color');
    console.log('color index', colorIndex);
    console.log('answer of color ', this.LostService.pageAnswers[colorIndex]);
    if (~colorIndex && this.LostService.pageAnswers[colorIndex]) {
      let tempColor: string[] = [];
      const disabled: any[] = this.LostService.pageAnswers[colorIndex].filter((value: any, index: number)=>{return value.disabled});
      disabled.forEach((value: any, index: number) => {
        tempColor.push(value.name);
      });
      this.colorsSelected = tempColor;
      this.retrieveData();
    }
  }
  public ngAfterViewInit(): void {
  }

  public retrieveData(): void {
    const patternIndex: number = this.LostService.defualtSequence.indexOf('pattern');
    const answer: any[] = this.LostService.pageAnswers[patternIndex];
    if (answer && answer.length) {
      answer.push('retrieve')
      this.LostService.multipleImgAnswers =this.LostService.copyAnswer(answer);
    } else {
      this.LostService.multipleImgAnswers = [];
    }
  }

  public changeElement(event: any): void {
    this.LostService.multipleImgAnswers = event.filter((value: any, index: number)=>{return value.disabled});
  }
}
