import {Component, EventEmitter, Output, Input} from '@angular/core';
import * as accessories from '../../content/accessories.json';

@Component({
  selector: 'extras-block',
  template: require('./extras-block.template.html'),
  styles: [ require('./extras-block.scss')]
})

export class ExtrasBlockComponent { 
  public elements: any[];
  @Output()
  public selectedEmitter: EventEmitter<any> = new EventEmitter<any>();
  @Input()
  public removedElement: any;
  @Input()
  public splicedAnswer: boolean;

  constructor() {
    this.setElement();
  }
  
  public ngOnInit(): void {}


  public setElement() {
    const content: any = JSON.parse(JSON.stringify(accessories));
    this.elements = content;
    this.elements.forEach((access: any, index: number) => {
      this.elements[index].apiVal =  access.id;
    });    
  }


  public changeElement(event: any): void {
    this.selectedEmitter.emit(event);
  }
}
