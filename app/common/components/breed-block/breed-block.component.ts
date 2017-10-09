import {Component, EventEmitter, Output, Input} from '@angular/core';
@Component({
  selector: 'breed-block',
  template: require('./breed-block.template.html'),
  styles: [ require('./breed-block.scss')]
})

export class BreedBlockComponent { 
  public elements: any[];
  public neverAgain: boolean = true;
  @Output()
  public selectedEmitter: EventEmitter<any> = new EventEmitter<any>();  
  @Input()
  public removedElement: any;
  constructor() {
    this.elements = [
      {imgUrl:'/static/temp-profile-dog.jpg', name: 'dog1'},
      {imgUrl:'/static/temp-profile-dog.jpg', name: 'dog2'},
      {imgUrl:'/static/temp-profile-dog.jpg', name: 'dog3'},
      {imgUrl:'/static/temp-profile-dog.jpg', name: 'dog4'},
      {imgUrl:'/static/temp-profile-dog.jpg', name: 'dog5'},
      {imgUrl:'/static/temp-profile-dog.jpg', name: 'dog6'},
      {imgUrl:'/static/temp-profile-dog.jpg', name: 'dog7'},
      {imgUrl:'/static/temp-profile-dog.jpg', name: 'dog8'},
      {imgUrl:'/static/temp-profile-dog.jpg', name: 'dog9'},
      {imgUrl:'/static/temp-profile-dog.jpg', name: 'dog10'},
      {imgUrl:'/static/temp-profile-dog.jpg', name: 'dog11'},
      {imgUrl:'/static/temp-profile-dog.jpg', name: 'dog12'},
      {imgUrl:'/static/temp-profile-dog.jpg', name: 'dog13'}
    ];
  }
  
  public ngOnInit(): void {}

  public changeElement(event: any): void {
    this.selectedEmitter.emit(event);
  }
}
