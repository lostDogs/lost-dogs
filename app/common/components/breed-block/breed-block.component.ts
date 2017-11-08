import {Component, EventEmitter, Output, Input} from '@angular/core';
import * as breedContent from '../../content/breeds.json';

@Component({
  selector: 'breed-block',
  template: require('./breed-block.template.html'),
  styles: [ require('./breed-block.scss')]
})

export class BreedBlockComponent { 
  public elements: any[];
  public neverAgain: boolean = true;
  public breeds: any = breedContent;
  public dogImgUrl: string = 'http://cdn.lostdog.mx/assets/img/dogs/';
  @Output()
  public selectedEmitter: EventEmitter<any> = new EventEmitter<any>();  
  @Input()
  public removedElement: any;
  constructor() {
    this.elements = [];
    this.breeds.forEach((value: any, valueIndex: number) => {
    this.elements.push({name: value.name, imgUrl: this.dogImgUrl + value.id + '.jpg', apiVal: value.id});
    });
  }
  
  public ngOnInit(): void {}

  public changeElement(event: any): void {
    this.selectedEmitter.emit(event);
  }
}
