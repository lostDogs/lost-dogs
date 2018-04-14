import { Component, Input} from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'actions-block',
  template: require('./actions-block.template.html'),
  styles: [ require('./actions-block.scss')]
})

export class ActionsBlockComponent {
  @Input()
  public bluring: boolean;

  constructor(public router: Router) {
  }

  public goTo(url: any, params?: any) {
    params =  params ? {queryParams: params} : undefined;
    this.router.navigate([url], params);
  }
}
