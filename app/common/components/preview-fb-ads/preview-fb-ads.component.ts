import {Component, Input} from '@angular/core';

export interface IConfigAd {
  type: string;
  title: string;
  body: string;
  img: string;
  description: string;
}

@Component({
  selector: 'preview-fb-ads',
  template: require('./preview-fb-ads.template.html'),
  styles: [ require('./preview-fb-ads.scss')]
})

export class previewFbAdsComponent { 
@Input()
  public configAd: IConfigAd;
  constructor() {
  }
  
  public ngOnInit(): void {
  }
}
