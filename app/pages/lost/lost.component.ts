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

  constructor (public dogCardService: DogCardService, public lostService: LostFoundService, public router: Router, public userService: UserService, public domEl: ElementRef) {
    this.dogCards = [];
    for (let i = 0; i < 13; ++i) {
      this.dogCards.push(i);
    }
    // route change detection
    this.router.events.subscribe(data => {
      if (data instanceof NavigationEnd) {
        const urlChildLoction = data.url.split('/')[2];
        const Indexlocation = this.lostService.sequence.indexOf(urlChildLoction);
        this.lostService.pagePosition = Indexlocation !== -1 ? Indexlocation : 0;
        console.log('page position', this.lostService.pagePosition);

        setTimeout(() => {
          this.lostService.maskInit();
        }, 20)

      }
    });
  }
  public ngOnInit(): void {
/*    if (!this.userService.isAuth) {
      this.router.navigate(['/home']);
    }*/
    this.lostService.sequence = ['date', 'location', 'breed', 'gender', 'size', 'color', 'extras'];
    this.lostService.sequence.forEach((value: any, index: number) => {
      this.lostService.pageAnswers.push(undefined);
    });
  }

  public ngAfterViewInit(): void {
  }  

  public onFocusAddres() {
    this.lostService.location = undefined;
    this.lostService.address = undefined;
  }

  public imgBlockRemove(): void {
    $('.tooltipped').tooltip('remove');
    this.lostService.imgAnswer.disabled = false;
  }

   public multipleBlockRemove(index: number): void {
    $('.tooltipped').tooltip('remove');
    this.lostService.multipleImgAnswers[index].disabled = false;
    this.lostService.multipleImgAnswers.splice(index, 1);
  } 
  
}
