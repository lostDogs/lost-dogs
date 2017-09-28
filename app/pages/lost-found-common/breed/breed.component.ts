import {Component} from '@angular/core';
import {LostFoundService} from '../../../common/services/lost-found.service';
@Component({
  selector: 'breed',
  template: require('./breed.template.html'),
  styles: [ require('./breed.scss')]
})

export class BreedComponent { 
  public elements: any[];
  public neverAgain: boolean = true;
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
    this.LostService.optional = false;
    this.LostService.question2 = undefined;
    this.LostService.question3 = undefined;
  }
  
  public ngOnInit(): void {
    this.LostService.inputField = {type: 'image', label: 'raza'};
    this.LostService.imgAnswer = undefined;
    this.LostService.retrieveData = this.fillData;
    
    if (this.LostService.parentPage === 'lost') { 
      this.LostService.question = 'Que raza es?';
    } else if(this.LostService.parentPage === 'found') {
      this.LostService.question = 'A cual se parece?';
    }
  }

  public changeElement(event: any): void {
    this.LostService.imgAnswer = event;
  }

  public fillData(pageAnswer: any, lostService: any): void {
    if (pageAnswer) {
      lostService.imgAnswer = pageAnswer;
    }
  }
}
