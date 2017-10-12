import { Component} from '@angular/core';
import {UserService} from '../../common/services/user.service';

@Component({
  selector: 'profile',
  template: require('./profile.template.html'),
  styles: [ require('./profile.scss')]
})
export class profileComponent {
  constructor (public userService: UserService) {
  }
  public ngOnInit(): void {
  }
  public ngAfterViewInit(): void {
  }
};
