import { Component} from '@angular/core';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'general-footer',
  template: require('./general-footer.template.html'),
  styles: [ require('./_general-footer.scss')]
})
export class generalFooterComponent {
  public newUser: boolean;
  constructor (public activatedRoute: ActivatedRoute) {
  }
  public ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(
      data => this.newUser = data.nU ? true : false
    );
  }

  public toPage(url: string): void {
    window.open(url);
  }

}