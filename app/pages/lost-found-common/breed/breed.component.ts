import {Component} from '@angular/core';
import {LostFoundService} from '../../../common/services/lost-found.service';
@Component({
  selector: 'breed',
  template: require('./breed.template.html'),
  styles: [ require('./breed.scss')]
})

export class BreedComponent { 
  public elements: any[];
  constructor(public LostService: LostFoundService) {
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
  
  public ngOnInit(): void {
    this.LostService.question = 'Que raza es?';
    this.LostService.inputField = {type: 'image', label: 'raza'};
    this.LostService.imgAnswer = undefined;
  }

  public changeElement(event: any): void {
    this.LostService.imgAnswer = event;
    setTimeout(()=>{this.LostService.tooltipInit();}, 20)
  }
}
