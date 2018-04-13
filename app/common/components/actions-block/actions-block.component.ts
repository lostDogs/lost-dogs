import { Component, Input} from '@angular/core';

@Component({
  selector: 'actions-block',
  template: require('./actions-block.template.html'),
  styles: [ require('./actions-block.scss')]
})

export class ActionsBlockComponent {
  @Input()
  public bluring: boolean;
  constructor() {
  } 
}
