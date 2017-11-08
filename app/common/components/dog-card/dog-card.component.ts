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
  public lost: boolean;
  @Input()
  public data: IdogData;
  public mappedData: ImappedData;

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
   $('.tooltipped').tooltip({delay: 100});
  }

  public myDog(): void {
    this.router.navigate(['/payment/review'], {queryParams: {Lt: this.lost, iD: 123455}});
  }
}