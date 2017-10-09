import {Component, EventEmitter, Output, Input} from '@angular/core';
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
  this.elements = [
  {imgUrl:'http://cdn.lostdog.mx/assets/img/male-icon1.png', name: 'macho'},
  {imgUrl:'http://cdn.lostdog.mx/assets/img/female-icon1.png', name: 'hembra'}
  ];
  }


  public changeElement(event: any): void {
    this.selectedEmitter.emit(event);
  }
}
