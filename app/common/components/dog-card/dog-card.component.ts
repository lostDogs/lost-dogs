import {Component, Input, Renderer, ElementRef} from '@angular/core';
import {DogCardService} from '../../services/dog-card.service';
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

  constructor(public dogCardService: DogCardService, public renderer: Renderer, public elRef: ElementRef)  {
   
    this.mobile = window.screen.width <= 767;
    this.renderer.listenGlobal('document', 'click', (event: any) => {
      if (this.viewMore && !this.atReviewPage && !this.elRef.nativeElement.contains(event.target)) {
        this.viewMore = false;
        this.dogCardService.open = false;
      }
    });
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
}