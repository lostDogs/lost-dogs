import { Component} from '@angular/core';
import {UserService} from '../../../common/services/user.service';
import {Router} from '@angular/router';
import {DogCardService} from '../../../common/services/dog-card.service';

@Component({
  selector: 'main-profile',
  template: require('./main-profile.template.html'),
  styles: [ require('./main-profile.scss')]
})
export class mainProfileComponent {
  constructor (public userService: UserService, public router: Router, public dogCardService: DogCardService) {
    this.dogCardService.open = false;
  }
  public ngOnInit(): void {
  }
  public ngAfterViewInit(): void {
  }
};
