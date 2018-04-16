import {Component, Input} from '@angular/core';

export interface IConfigAd {
  preview?: string;
  title?: string;
  body?: string;
  description?: string;
}

@Component({
  selector: 'preview-fb-ads',
  template: require('./preview-fb-ads.template.html'),
  styles: [ require('./preview-fb-ads.scss')]
})

export class previewFbAdsComponent {
@Input()
  public previewValues: IConfigAd = {};
  @Input()
  public img: string;
  constructor() {
  }
  
  public ngOnInit(): void {
  }
}
