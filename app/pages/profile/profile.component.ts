import { Component} from '@angular/core';
import {UserService} from '../../common/services/user.service';
import {Router} from '@angular/router';
@Component({
  selector: 'profile',
  template: require('./profile.template.html'),
  styles: [ require('./profile.scss')]
})
export class profileComponent {
  constructor (public userService: UserService, public router: Router) {
  }
  public ngOnInit(): void {
    if (!this.userService.isAuth) {
      this.router.navigate(['/login']);
    }    
  }
  public ngAfterViewInit(): void {
  }
};
