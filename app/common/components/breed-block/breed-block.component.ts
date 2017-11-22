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
      // api val is adding the look alike,  and id value is the clean val.
    this.elements.push({name: value.name, imgUrl: this.dogImgUrl + value.id + '.jpg', apiVal: value.id, id: value.id});
    });
  }
  
  public ngOnInit(): void {}

  public changeElement(event: any): void {
    const alike: string = this.findAlike(event.id);
    if (alike) {
      event.apiVal = event.id;
      event.apiVal += ' ' + alike;
    }
    event.apiVal = event.apiVal.trim().replace(/\s/g, ',');
    this.selectedEmitter.emit(event);
  }

  public findAlike(id: string): string {
    const selectedBreed: any = this.breeds[+id - 1];
    return selectedBreed.looksLike;
  }
}
