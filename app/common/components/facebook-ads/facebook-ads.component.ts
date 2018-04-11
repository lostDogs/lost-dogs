import {Component, EventEmitter, Output, Input} from '@angular/core';

@Component({
  selector: 'facebook-ads',
  template: require('./facebook-ads.template.html'),
  styles: [ require('./facebook-ads.scss')]
})

export class FacebookAdsComponent { 

  constructor() {
  }

  public ngOnInit(): void {
  }
};
