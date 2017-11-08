import {Component, Input, Output, EventEmitter} from '@angular/core';
import * as sizesContent from '../../content/sizes.json';

@Component({
  selector: 'size-block',
  template: require('./size-block.template.html'),
  styles: [ require('./size-block.scss')]
})

export class SizeBlockComponent { 
  public elements: any[];
  @Output()
  public selectedEmitter: EventEmitter<any> = new EventEmitter<any>();
  @Input()
  public removedElement: any

  constructor() {
    const content: any = sizesContent;
    this.elements = content;
    this.setElement();
  }
  
  public ngOnInit(): void {}


  public setElement() {
    this.elements.forEach((size: any, index: number) => {
      this.elements[index].apiVal =  size.id;
    });
  }


  public changeElement(event: any): void {
    this.selectedEmitter.emit(event);
  }
}
