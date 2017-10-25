import {Component, Output, Input, EventEmitter, SimpleChanges} from '@angular/core';

@Component({
  selector: 'dog-figure',
  template: require('./dog-figure.template.html'),
  styles: [ require('./dog-figure.scss')]
})

export class DogFigureComponent {
 
  constructor()  {
  }

  public ngOnInit(): void {
  }

  public ngOnChanges(changes: SimpleChanges): void {
  }

}
