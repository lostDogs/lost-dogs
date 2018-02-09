import {Component, ViewChild, ElementRef} from '@angular/core';
import {DomSanitizer, SafeHtml} from '@angular/platform-browser';
import {Router, NavigationEnd} from '@angular/router';
import * as info from  '../../common/content/information.json';

@Component({
  selector: 'information',
  template: require('./information.template.html'),
  styles: [ require('./information.scss')]
})

export class InformationComponent {
  public infohtml: SafeHtml;
  public data: any;
  public urlOn: string;
  public urlsConst: any;
  public title: string;
  @ViewChild('TermsOpenPay')
  public termsOpenPayDom: ElementRef;

  constructor (public domSan: DomSanitizer, public router: Router) {
    this.data = info;
    this.urlsConst = {legal: 'legal', cookies: 'cookies' , privacy : 'privacy', aboutUs: 'about', terms: 'terms', pricing: 'pricing', faqs: 'faqs'};
    this.router.events.subscribe(data => {
      if (data instanceof NavigationEnd) {
       this.urlOn = this.router.url.split('/')[2];
       this.changeContent();
      }
    })
  }
  public ngOnInit(): void {
  }

  public ngDoCheck(): void {
  }

  public changeContent(): void {
    if (this.urlsConst.legal === this.urlOn) {
      this.title = 'Informacion legal';
      // este apartado corresponde los terminos y condiciones y privacidad de lost dogs.
      //this.infohtml = this.domSan.bypassSecurityTrustHtml(this.data);
    } else if (this.urlsConst.cookies === this.urlOn) {
      this.title = 'Sobre las cookies';
      this.infohtml = this.domSan.bypassSecurityTrustHtml(this.data[this.urlsConst.cookies].join(''));
    } else if (this.urlsConst.privacy === this.urlOn) {
      this.title = 'Politicas de privacidad';
      this.infohtml = this.domSan.bypassSecurityTrustHtml(this.data[this.urlsConst.privacy].join(''));
    } else if (this.urlsConst.aboutUs === this.urlOn) {
      this.title = 'Sobre nosotros';
      this.infohtml = this.domSan.bypassSecurityTrustHtml(this.data[this.urlsConst.aboutUs].join(''));
    }else if (this.urlsConst.terms === this.urlOn) {
      this.title = 'Términos y condiciones';
      this.infohtml = this.domSan.bypassSecurityTrustHtml(this.data[this.urlsConst.terms].join(''));
    }else if (this.urlsConst.pricing === this.urlOn) {
      this.title = 'Costos y recompensas';
      this.infohtml = this.domSan.bypassSecurityTrustHtml(this.data[this.urlsConst.pricing].join(''));
    }else if (this.urlsConst.faqs === this.urlOn) {
      this.title = 'Preguntas frecuentes';
      this.infohtml = this.domSan.bypassSecurityTrustHtml(this.data[this.urlsConst.faqs].join(''));
    }
  }

}