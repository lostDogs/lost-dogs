import { Component, HostListener, Inject, ElementRef, ViewChild} from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser';
import {GlobalFunctionService} from '../../common/services/global-function.service';
import {ActivatedRoute, Router} from '@angular/router';
import { Location} from '@angular/common';
import {UserService} from '../../common/services/user.service';
import * as adConfig from '../../common/content/fb-ad-config.json';

@Component({
  selector: 'home',
  template: require('./home.template.html'),
  styles: [ require('./_home-style.scss')]
})

export class homeComponent {
  public scrollnormalize: number;
  public newUser: boolean;
  public scrolldownDisplay: boolean = true;
  public scrollMax: number;
  public basePrice: number = (+process.env.BASE_COST) + ((+process.env.BASE_ADS_DURATION) *  (+process.env.BASE_ADS_BUDGET));;

  @ViewChild('Description')
  public descriptionDom: ElementRef;
  public previewValues: any;
  public adOpts: any;
  public duration: number = 7;
  public reach: string;

  constructor (@Inject(DOCUMENT) private document:  Document, public globalService : GlobalFunctionService, public activatedRoute: ActivatedRoute, public location: Location, public userService: UserService, public router: Router) {
    this.scrollMax = (window.innerHeight - (window.innerHeight / 8)) / 2;
    this.adOpts = adConfig;
    this.previewValues = {
      title: '¡Estoy perdida!' ,
      body: 'Hola, soy Bodoca, una perrita de raza Afgano, y me perdí en Lopez Mateos #321, lomas del valle, guadalajara, Jalisco  el día ' + (new Date()).toLocaleString().split(',')[0] + '.',
      description: 'Por favor ayúdame a regresar a casa.'
    };
    this.changeEstim();
  }
  @HostListener('window:scroll', ['$event'])
  onWindowScroll(event: any) {
      const scrollMax: number = (window.innerHeight - (window.innerHeight / 8)) / 2;
      this.scrollMax = scrollMax;
      const scrollTop = this.document.documentElement.scrollTop;
      this.scrollnormalize = (scrollMax - scrollTop) / scrollMax;
      this.globalService.scrollOpacity = 1.2 - this.scrollnormalize;
      if(this.scrollnormalize <= 0) {
        this.scrolldownDisplay = false;
      }
  }

  public ngOnInit(): void {
    window.scroll(0,0);
    localStorage.clear();
    this.userService.timesTrying = 0;
    this.activatedRoute.queryParams.subscribe(
      data => this.newUser = data.nU ? true : false
    );
    if (this.newUser) {
      setTimeout(() => {
        this.newUser = false;
        this.location.replaceState('/home');
      }, 6000);
    }
  }

  public ngAfterViewInit(): void {
    const scrollTo: number = this.descriptionDom.nativeElement.offsetTop - 100;
    $('.scroll-botttom').click(function(){
        $('html, body').animate({ scrollTop: scrollTo }, 600);
    });
    $('select').material_select();
    $('select').change((event) => {
      this.previewValues[event.target.id] = $('#' + event.target.id).val();
    });
  }

  public goTo(url: string): void {
    this.router.navigateByUrl(url)
  }

  public getWindowHeight(): string {
    return window.innerHeight +'px';
  }

  public changeEstim(): void {
    const init = 1200;
    const base = 2400;
    let slope;
    if (this.duration > 0 && this.duration < 4) {
      slope = 1.2;
    }
    if (this.duration >= 4 && this.duration < 10) {
      slope = 0.8;
    }
    if (this.duration >= 10) {
      slope = 0.6;
    }
    this.reach = (init + this.duration * slope * base).toFixed(2);
  }

};
