import { Component, ElementRef, ViewChild} from '@angular/core';
import {DogCardService} from '../../common/services/dog-card.service';
import {LostFoundService} from '../../common/services/lost-found.service';
import {Router, NavigationEnd} from '@angular/router';
import {UserService} from  '../../common/services/user.service';

require('../../common/plugins/masks.js');
require('../../common/plugins/nodoubletapzoom.js');

@Component({
  selector: 'lost',
  template: require('./lost.template.html'),
  styles: [ require('./lost.scss')]
})
export class lostComponent {
  public dogCards: number[];
  public generalAnswer: any;
  public goBack: boolean;

  constructor (public dogCardService: DogCardService, public lostService: LostFoundService, public router: Router, public userService: UserService, public domEl: ElementRef) {
    this.dogCards = [];
    for (let i = 0; i < 13; ++i) {
      this.dogCards.push(i);
    }
    // route change detection
    this.router.events.subscribe(data => {
      if (data instanceof NavigationEnd) {
        const urlChildLoction = data.url.split('/')[2];
        this.lostService.parentPage = data.url.split('/')[1];
        const Indexlocation = this.lostService.sequence.indexOf(urlChildLoction);
        this.lostService.pagePosition = Indexlocation !== -1 ? Indexlocation : 0;

        if (this.lostService.retrieveData) {
          this.lostService.retrieveData(this.lostService.pageAnswers[this.lostService.pagePosition], this.lostService);
          this.lostService.retrieveData = undefined;
        }

        setTimeout(() => {
          this.lostService.maskInit();
        }, 20)

        const previousIndex = this.lostService.pagePosition === 0 ? this.lostService.pagePosition : this.lostService.pagePosition -1;
        if (this.lostService.optional && this.lostService.pageAnswers[previousIndex]) {
          this.lostService.pageAnswers[this.lostService.pagePosition] = [];
        }
        this.goBack = this.lostService.pagePosition !== 0 && !this.lostService.pageAnswers[previousIndex];
      }
    });
  }
  public ngOnInit(): void {
/*    if (!this.userService.isAuth) {
      this.router.navigate(['/home']);
    }*/

    this.lostService.sequence = ['date', 'location', 'breed', 'gender', 'size', 'color', 'extras', 'details','review'];
    //not details and review in array.
    this.lostService.displayedSequence = ['Fecha', 'Ubicacion', 'Raza', 'Genero', 'Tamaño', 'Color', 'Accessorios'];
    this.lostService.sequence.forEach((value: any, index: number) => {
      this.lostService.pageAnswers.push(undefined);
    });
  }

  public ngAfterViewInit(): void {
  }  

  public ngDoCheck(): void {
    if (this.goBack) {
      this.lostService.back();
      this.goBack = false;
    }
  }

  public onFocusAddres() {
    this.lostService.location = undefined;
    this.lostService.address = undefined;
  }

  public imgBlockRemove(): void {
    //$('.tooltipped').tooltip('remove');
    this.lostService.imgAnswer.disabled = false;
  }

   public multipleBlockRemove(index: number): void {
    //$('.tooltipped').tooltip('remove');
    this.lostService.multipleImgAnswers[index].disabled = false;
    if (this.lostService.multipleImgAnswers[index].name === 'Placa Id') {
      this.lostService.openNameInput = false; 
    }
    this.lostService.multipleImgAnswers.splice(index, 1);
  } 
  
}
