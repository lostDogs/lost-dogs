import {Component,ElementRef, ViewChild} from '@angular/core';
import {LostFoundService} from '../../../common/services/lost-found.service';
import {Router} from '@angular/router';
import {DogCardService} from '../../../common/services/dog-card.service';
import {GlobalFunctionService} from '../../../common/services/global-function.service';
import {SearchService} from '../../../common/services/search.service';
import {FacebookService} from '../../../common/services/facebook.service';

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
  public mobile: boolean;

  public paymentDesc: string;
  public buildedDog: any;
  public exportAds: {img?: string, reward?: string, nameObreed?: string, breed?:any, address?: string, latLong?: any, gender?: string, lostDate?: string, comments?: string, name?: string, femaleA?: string, maleO?: string};
  public baseCost: number = (+process.env.BASE_COST) + ((+process.env.BASE_ADS_DURATION) *  (+process.env.BASE_ADS_BUDGET));

  constructor(
    public LostService: LostFoundService,
    public router: Router,
    public dogCardService: DogCardService,
    public searchService: SearchService,
    public globalService: GlobalFunctionService,
    public fbService: FacebookService
  ) {
    this.mobile = window.screen.width <= 767;
    this.window = window;
    this.LostService.question2 = undefined;
    this.LostService.question3 = undefined;
    this.LostService.question = 'Revisa los datos!';
    this.LostService.imgAnswer = undefined;
    this.LostService.answer = undefined;
    this.LostService.inputField = undefined;
    this.LostService.inReviewPage = true;
    this.exportAds = {};
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
    this.fillExportAds();
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
      this.buildedDog = this.LostService.objDogBuilder();
      localStorage.setItem('reported-dog-data', JSON.stringify(this.buildedDog));
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

  private fillExportAds(): void {
    const location = this.LostService.pageAnswers[this.LostService.defualtSequence.indexOf('location')] || {};
    const breed = this.pageAnswersCopy[this.LostService.defualtSequence.indexOf('breed')] || [{}];
    const gender = this.LostService.pageAnswers[this.LostService.defualtSequence.indexOf('gender')].name || '';
    const lostDate = this.LostService.pageAnswers[this.LostService.defualtSequence.indexOf('date')];
    this.exportAds = {
      img: this.LostService.dogPicture,
      reward: this.LostService.reward,
      name: this.LostService.dogName || '',
      nameObreed: this.LostService.dogName ?  `Me llamo ${this.LostService.dogName}` :  `Soy un ${breed[0].labels}`,
      gender: gender,
      femaleA: gender === 'hembra'  ? 'a' : '', 
      maleO: gender !== 'hembra' ? 'o': 'a',
      lostDate: lostDate,
      comments: this.LostService.comments || '<no comentarios>',
      breed: breed[0].labels,
      address: location.address,
      latLong: location.latLng
    };
  }

}
