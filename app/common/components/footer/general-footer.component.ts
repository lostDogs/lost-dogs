import { Component} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'general-footer',
  template: require('./general-footer.template.html'),
  styles: [ require('./_general-footer.scss')]
})
export class generalFooterComponent {
  public newUser: boolean;
  constructor (public activatedRoute: ActivatedRoute, public router: Router) {

  }
  public ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(
      data => this.newUser = data.nU ? true : false
    );
  }

  public toPage(url: string, appName: string): void {
    setTimeout(() => { window.location.href = url}, 25);
    window.location.href = appName;
    // window.open(appName);
  }

}