import {ElementRef, Renderer, Component,Directive, OnInit} from '@angular/core';
import {ScrollService} from '../../services/scroll.service';

@Component({
  selector: 'general-header',
  template: require('./general-header.template.html'),
  styles: [ require('./_general-header.scss')],
})

export class generalHeaderComponent implements OnInit  {
  public showLoginFrom : boolean;
  public offsetY: string;
  constructor (public renderer: Renderer, public elRef: ElementRef, public ScrollService: ScrollService) {
    this.renderer.listenGlobal('document', 'click', (event: any) => {
      const loginDom: any = this.elRef.nativeElement.childNodes[0].childNodes[5].childNodes[1].childNodes[1];
      if (this.showLoginFrom && !(this.elRef.nativeElement.lastChild.contains(event.target) || loginDom.contains(event.target))) {
        this.showLoginFrom = false;
      }
    });

  }
  public toggleLoginFrom(event: any) {
    this.showLoginFrom = !this.showLoginFrom;    
  }

  ngOnInit() {
      $('.home-mobile').sideNav({
        menuWidth: 700,
        closeOnClick: true,
        draggable: true
      });
  }
};