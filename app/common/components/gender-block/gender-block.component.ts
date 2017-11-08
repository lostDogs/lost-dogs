import {Component, EventEmitter, Output, Input} from '@angular/core';
import * as genderContent from '../../content/genders.json';

@Component({
  selector: 'gender-block',
  template: require('./gender-block.template.html'),
  styles: [ require('./gender-block.scss')]
})

export class GenderBlockComponent { 
  public elements: any[];
  @Output()
  public selectedEmitter: EventEmitter<any> = new EventEmitter<any>();
  @Input()
  public removedElement: any;

  constructor() {
    this.setElement();
  }
  
  public ngOnInit(): void {
  }

  public setElement() {
    const content: any = genderContent;
    this.elements = content;
    this.elements.forEach((gender: any, index: number) => {
      this.elements[index].apiVal =  gender.id;
    });    
  }


  public changeElement(event: any): void {
    this.selectedEmitter.emit(event);
  }
}
