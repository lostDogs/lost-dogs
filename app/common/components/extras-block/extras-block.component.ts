import {Component, EventEmitter, Output, Input} from '@angular/core';

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

  constructor() {
    this.setElement();
  }
  
  public ngOnInit(): void {}


  public setElement() {
    this.elements = [
      {imgUrl:'http://cdn.lostdog.mx/assets/img/acess-collar.png', name: 'collar', apiVal: 'collar'},
      {imgUrl:'http://cdn.lostdog.mx/assets/img/acess-sueter.png', name: 'suter', apiVal: 'coat'},
      {imgUrl:'http://cdn.lostdog.mx/assets/img/acess-tag.png', name: 'Placa Id', apiVal: 'dog_tag'}
    ];
  }


  public changeElement(event: any): void {
    this.selectedEmitter.emit(event);
  }
}
