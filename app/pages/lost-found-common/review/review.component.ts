import {Component,ElementRef, ViewChild} from '@angular/core';
import {LostFoundService} from '../../../common/services/lost-found.service';
import {Router} from '@angular/router';
import {DogCardService} from '../../../common/services/dog-card.service';
import {GlobalFunctionService} from '../../../common/services/global-function.service';
import {SearchService} from '../../../common/services/search.service';

@Component({
  selector: 'review',
  template: require('./review.template.html'),
  styles: [ require('./review.scss')]
})

export class ReviewComponent { 
  public imgwidth: number = 80 / 2;
  public window: Window;
  public pageAnswersCopy: any[];
  public openPayment: boolean;
  @ViewChild('Description')
  public descriptionDom: ElementRef;

  public paymentDesc: string;

  constructor(public LostService: LostFoundService, public router: Router, public dogCardService: DogCardService, public searchService: SearchService, public globalService: GlobalFunctionService) {
    this.window = window;
    this.LostService.question2 = undefined;
    this.LostService.question3 = undefined;
    this.LostService.question = 'Revisa los datos!';
    this.LostService.imgAnswer = undefined;
    this.LostService.answer = undefined;
    this.LostService.inputField = undefined;
    this.LostService.inReviewPage = true;
  }


  public ngOnInit(): void {
    this.setReviewToLocalStorage();
    this.LostService.getReviewFromLocalStorage();
    this.dogCardService.open = false;
    if (this.LostService.reward) {
      const newVal: string = ('' + this.LostService.reward).replace('.','').replace(',', '');
      let rewardNewDecimal: string = newVal.substr(0, newVal.length - 2) + '.' + newVal.substr(newVal.length - 2);
      if (rewardNewDecimal.length > 6) {
        rewardNewDecimal = rewardNewDecimal.substr(0, rewardNewDecimal.length - 6) + ',' + rewardNewDecimal.substr(rewardNewDecimal.length - 6);
      }
      this.LostService.reward = rewardNewDecimal;
    }
    this.pageAnswersCopy =  JSON.parse(JSON.stringify(this.LostService.pageAnswers));
    this.pageAnswersCopy.forEach((answer: any, index: number) => {
      let names: string[] = [];
      let imgUrls: string[] = [];
      let originalIndexs: number[] = [];
      let labels: string[] = [];
      if(Array.isArray(answer)) {
        answer.forEach((innerAns: any, innerIndex: number) => {
          if (innerAns.disabled) {
            names.push(innerAns.name);
            imgUrls.push(innerAns.imgUrl);
            originalIndexs.push(innerAns.orginalIndex);
            if (innerAns.label) {
              labels.push(innerAns.label);
            }
          }
        });
        this.pageAnswersCopy[index] = [{names: names, imgUrls: imgUrls, Indexs: originalIndexs, labels: labels.length ? labels.join(', ') : names.join(', ')}];
      }
    });
    this.setFinalToLocalStorage();
  }

  public ngAfterViewInit(): void {
    const breed: string = this.getName('breed');
    this.paymentDesc = this.LostService.dogName ? 'Reportar a ' + this.LostService.dogName :   'Reportar un ' + (breed + '').replace(':,', ',').split(',')[0];
    this.paymentDesc += ': ';
    this.parsePatternAndFill();
    if (+this.LostService.reward < 10) {
      this.LostService.reward = '00.00';
      this.globalService.clearErroMessages();
      this.globalService.setErrorMEssage('Una recompensa válida es mayor a $10.00 MX');
      this.globalService.setSubErrorMessage('de lo contrario sera $0.00 MX');
      this.globalService.openBlueModal();
    }    
  }

  public toPaymentForm(): void {
    this.LostService.openPayment = true;
    setTimeout(() => {
      const scrollTo: number = this.descriptionDom.nativeElement.offsetTop + 120;
        $('html, body').animate({ scrollTop: scrollTo }, 600);
    }, 5);
  }

  public setFinalToLocalStorage(): void {

    if (Array.isArray(this.LostService.pageAnswers) && this.LostService.pageAnswers[0]) {
      const dog: any = this.LostService.objDogBuilder();
      localStorage.setItem('reported-dog-data', JSON.stringify(dog));
    }
  }

  public setReviewToLocalStorage(): void {
    if (Array.isArray(this.LostService.pageAnswers) && this.LostService.pageAnswers[0]) {
     localStorage.setItem('temp-anwers', JSON.stringify(this.LostService.pageAnswers));
    }
    if (this.LostService.reward && this.LostService.reward !== this.LostService.defaultReward) {
     localStorage.setItem('temp-reward', JSON.stringify(this.LostService.reward)); 
    }
    if (this.LostService.dogName) {
      localStorage.setItem('temp-name', JSON.stringify(this.LostService.dogName)); 
    }
    if (this.LostService.comments) {
      localStorage.setItem('temp-comments', JSON.stringify(this.LostService.comments)); 
    }
    if (this.LostService.dogPicture && this.LostService.dogPicture !== this.LostService.defaultDogPic) {
      localStorage.setItem('reported-dog-img-0', this.LostService.dogPicture);
    }    
  }

  public getName(valueName: string): string {
    const index: number = this.LostService.defualtSequence.indexOf(valueName);
    return ~index && this.pageAnswersCopy[index][0].names;
  }

  private parsePatternAndFill(): void {
    const patIndex: number = this.LostService.defualtSequence.indexOf('pattern');
    const patterns: any[] = ~patIndex && this.pageAnswersCopy[patIndex];
    if (patterns && patterns[0] && patterns[0].names) {
      const pattObj = this.searchService.patternConvertion({'pattern_id': patterns[0].names + ''});
      this.colorFigure(Object.values(pattObj), Object.keys(pattObj));
    }
  }
  
  private colorFigure(colors: string[], patterns: string[]): void {
    if (patterns.length) {
      patterns.forEach((pat: string, patIndex: number) => {
        colors[patIndex] && this.fillColor(colors[patIndex], pat);
      });
    }
  }

  private fillColor(color: string, pattern: string): void {
    const query: string = '.review-page .circle dog-figure #' + pattern + ' g';
    $(query).attr('style', 'fill:' + color);
  }
}
