import {Component, EventEmitter, Output, Input} from '@angular/core';
import * as colors from '../../content/colors.json';

@Component({
  selector: 'color-block',
  template: require('./color-block.template.html'),
  styles: [ require('./color-block.scss')]
})

export class ColorBlockComponent { 
  public bgColors: any[] = [];
  @Output()
  public selectedEmitter: EventEmitter<any> = new EventEmitter<any>();  
  @Input()
  public removedElement: any;
  @Input()
  public splicedAnswer: boolean;
  constructor() {
    const colorValues: string[] = Object.values(colors);
    const colorNames: string[] = Object.keys(colors);
    for (let i = 0; i < colorValues.length; ++i) {
      this.bgColors.push({bgColor: colorValues[i], name: colorValues[i], label: colorNames[i]});
    }
  }
  
  public ngOnInit(): void {
  }


  public setElement() {
  }


  public changeElement(event: any): void {
    this.selectedEmitter.emit(event);
  }
}
