import {Component} from '@angular/core';
import {DomSanitizer, SafeHtml} from '@angular/platform-browser';
import {Router} from '@angular/router';

@Component({
  selector: 'information',
  template: require('./information.template.html'),
  styles: [ require('./information.scss')]
})

export class InformationComponent {
  public infohtml: SafeHtml;
  public data: string;
  public urlOn: string;
  public urlsConst: any;
  public title: string;
  constructor (public domSan: DomSanitizer, public router: Router) {
    this.urlsConst = {legal: 'legal', cookies: 'cookies' , privacy : 'privacy', aboutUs: 'about'};
    this.data = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut justo enim, fringilla sed malesuada id, rhoncus ut arcu. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Cras <a>tristique</a> convallis augue vel lacinia. Maecenas viverra congue aliquam. Cras sit amet ante magna. Vivamus sed euismod diam. Quisque efficitur tempor vulputate. Sed eget neque at arcu eleifend faucibus. Donec posuere purus placerat porta malesuada. Nulla mollis maximus viverra. Morbi lobortis nulla et interdum eleifend. <br><br> \
      Nullam massa lectus, hendrerit vitae aliquet sed, <b>placerat quis</b> libero. Aliquam suscipit elit dolor. Duis vitae dui augue. Duis vehicula erat eu bibendum bibendum. Nunc vestibulum, lectus ut interdum efficitur, leo ex auctor magna, at maximus mi odio sit amet nulla. Mauris ullamcorper consectetur erat. Sed dapibus nisi metus, cursus luctus magna lacinia et. Fusce fringilla rhoncus pulvinar. Sed vitae fermentum dolor, non cursus arcu. Donec sed magna rutrum, sodales felis in, pulvinar dui. Donec interdum eleifend consectetur. Proin pretium est non magna luctus faucibus. Praesent ac massa velit. Phasellus porttitor vulputate est eget porttitor. <br><br>\
      Phasellus <b>malesuada</b> ex vel lorem pretium, ut facilisis leo maximus. Donec eget dictum neque. Vestibulum vitae dignissim purus. Suspendisse vitae nibh velit. Ut et mi tempor libero blandit rhoncus. Quisque pharetra urna sed sollicitudin sollicitudin. Vestibulum non nunc quis enim ultricies aliquet. Donec sed mauris vestibulum, lobortis neque vestibulum, pharetra nunc. Cras ullamcorper egestas commodo. Suspendisse vulputate <b>dignissim odio</b>, pharetra ultricies ante mattis sit amet. In at aliquet neque, at facilisis leo. Praesent a augue erat. Suspendisse tincidunt in ipsum quis efficitur. In sodales leo ac convallis iaculis. Aliquam ac erat ut elit luctus volutpat. Sed mauris mi, tempus non hendrerit at, aliquam <a>vitae</a> ex.<br><br> \
      Vestibulum condimentum bibendum mauris ut egestas. Ut augue lectus, auctor et finibus nec, ullamcorper eleifend enim. Nunc molestie lectus non tortor aliquam tristique. Sed posuere turpis metus. Interdum et malesuada fames ac ante ipsum primis in faucibus. Donec in finibus lorem, ac sodales lacus. Nulla tincidunt justo et lectus efficitur, a auctor nisl interdum. Fusce quis quam ut massa consectetur blandit quis id neque. Quisque metus magna, commodo nec vestibulum at, ullamcorper a dui. Duis aliquam maximus neque, id pretium ex hendrerit nec. Cras et porttitor sapien. Praesent neque lorem, interdum id ante sit amet, faucibus congue orci.<br><br>'
  }
  public ngOnInit(): void {
    this.infohtml = this.domSan.bypassSecurityTrustHtml(this.data);
    this.urlOn = this.router.url.split('/')[2];
  }

  public ngDoCheck(): void {
   this.urlOn = this.router.url.split('/')[2];
   this.changeContent();
  }

  public changeContent(): void {
    if (this.urlsConst.legal === this.urlOn) {
      this.title = 'Informacion legal';
    } else if (this.urlsConst.cookies === this.urlOn) {
      this.title = 'Sobre las cookies';
    } else if (this.urlsConst.privacy === this.urlOn) {
      this.title = 'Politicas de privacidad';
    } else if (this.urlsConst.aboutUs === this.urlOn) {
      this.title = 'Sobre nosotros';
    }
  }

}