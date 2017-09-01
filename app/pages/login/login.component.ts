import { Component} from '@angular/core';
import {UserService} from '../../common/services/user.service';

@Component({
  selector: 'login',
  template: require('./login.template.html'),
  styles: [ require('./login-style.scss')]
})

export class LoginComponent {
constructor (public userService: UserService) {
}
}