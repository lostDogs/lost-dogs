import {Component, Input, Renderer, ElementRef} from '@angular/core';
import {Router} from '@angular/router';
import {DogCardService, ImappedData} from '../../services/dog-card.service';
import {IdogData} from '../../services/search.service';

@Component({
  selector: 'dog-card',
  template: require('./dog-card.template.html'),
  styles: [ require('./dog-card.scss')]
})
export class DogCardComponent {
  public viewMore: boolean;
  public mobile: boolean;
  @Input()
  public cardIndex: number;
  @Input()
  public userAt: number;
  @Input()
  public atReviewPage: boolean;
  @Input()
  public data: IdogData;
  public mappedData: ImappedData;
  @Input()
  public maxCards: number = 3;
  @Input()
  public deleteBtn: boolean;
  public rewardtoShow: string;
  public dogPicture: string;

  constructor(public dogCardService: DogCardService, public renderer: Renderer, public elRef: ElementRef, public router: Router)  {
    this.mobile = window.screen.width <= 767;
    this.renderer.listenGlobal('document', 'click', (event: any) => {
      if (this.viewMore && !this.atReviewPage && !this.elRef.nativeElement.contains(event.target)) {
        this.viewMore = false;
        this.dogCardService.open = false;
      }
    });
  }

  public ngOnInit(): void {
    this.mappedData = this.dogCardService.mapData(this.data);
    if (this.data && this.data.reward) {
      this.rewardtoShow = (+this.data.reward * 0.8).toFixed(2) + '';
    }
  }

  public toogleViewMore (): void {
    setTimeout(() => {
      this.viewMore = !this.viewMore;
      this.dogCardService.open = this.viewMore;
    }, 20);
  }

  public toogleviewMoreMobile(): void {
    if (!this.viewMore && this.mobile) {
      this.toogleViewMore();
    }
  }

  public ngAfterViewInit(): void {
    this.dogCardService.width = this.elRef.nativeElement.clientWidth;
    this.viewMore = this.atReviewPage;
    const cardElments: number = $('article.hoverable.dog-card').length;
    this.colorFigures();
    if (cardElments === this.maxCards) {
      $('.tooltipped').tooltip({delay: 100});
    }
  }
  
  public colorFigures() {
    if(this.data.color.length > 1 && this.data.patternColors) {
      const elNames: string[] = Object.keys(this.data.patternColors);
      const colors: string[] = Object.values(this.data.patternColors);
      elNames.forEach((elName: string, elIndex: number) => {
        colors[elIndex] && this.fillColor(elName, colors[elIndex]);
      });
    } else if (this.data.color.length === 1) {
      this.fillColor('back-color', this.data.color[0].trim());
    }
  }

  public fillColor(elName: string, color: string): void {
    const NotMobileQuery: string = '.dog-properties dog-figure #' + elName + ' g';
    const mobileDogQuery: string = '.dog-properties-mobile dog-figure #' + elName + ' g';
    let queryString: string = mobileDogQuery + ', ' + NotMobileQuery;
    // the query string will bring the double number of elements in the results array.
    // the reason it is double it is because we are having the mobile view and normal view in the template.
    // therefore to target both and color them with jquery. we are multipling by 2 the index. to get next.
    // I'll the following repeated code to be undertanding.
    // 0,1 => 0
    // 2,3 => 1
    // 4,5 => 2
    const index: number = 2 * this.cardIndex;
    const thisCardDom: HTMLElement = $(queryString)[index];
    const cardDomMobile: HTMLElement = $(queryString)[index + 1];
    $(thisCardDom).attr('style', 'fill:' + color);
    $(cardDomMobile).attr('style', 'fill:' + color);
  }

  public myDog(): void {
    this.router.navigate(['/payment/review'], {queryParams: {Lt: !this.data.lost, iD: this.cardIndex, cID: this.data._id}});
  }

  public openMaps(): void {
    const route: string = 'https://www.google.com/maps/?q=' + this.data.location.coordinates[1] + ',' + this.data.location.coordinates[0];
    window.open(route);
  }

  public del() {
    this.dogCardService.deleteDog(this.data._id).add(() => {
      this.viewMore = false;
      this.dogCardService.setFoundDogs();
      this.dogCardService.setLostDogs();
    });
  }

  public showEditImg(): boolean {
    return this.deleteBtn && this.viewMore;
  }


  public filePicChange(ev: any): void {
    let file: File = ev.target.files[0];
    if (ev.target && ev.target.files && file && file.type.match('image.*')) {
      try {
        const reader = new FileReader();
        reader.onload = (event: any) => {
          this.dogCardService.editImg(this.data.images[0].uploadImageUrl, this.data._id, file).add(() => {
            if (this.dogCardService.editImgSucess) {
              this.dogPicture = event.target.result;
              this.viewMore = false;
            }
          });
        };
        reader.readAsDataURL(file);
      }catch (error) {
        file = this.dogPicture = undefined;
      }
    } else {
      file = this.dogPicture = undefined;
      console.error('not an image');
    }    
  }  
}