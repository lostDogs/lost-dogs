import {Component, ElementRef, ViewChild} from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router';
import {UserService} from '../../common/services/user.service';

@Component({
  selector: 'login',
  template: require('./login.template.html'),
  styles: [ require('./login-style.scss')]
})

export class LoginComponent {
  public forgot: boolean;
  @ViewChild('Forgot')
  public forgotDom: ElementRef;
  @ViewChild('ForgotSucess')
  public forgotSucessDom: ElementRef;

  constructor (public userService: UserService, public activeRoute: ActivatedRoute) {
    this.activeRoute.queryParams.subscribe((params: Params) => {
      this.forgot = params.fG === 'true';
    });    
  }

  public scrollTo(domEl: ElementRef): void {
    if (domEl.nativeElement) {
      const forgotOffset = domEl.nativeElement.offsetTop + 120;
      setTimeout(() => {
        $('html, body').animate({ scrollTop: forgotOffset}, 700);
      }, 600);
    }
  }

  public callForgot(): void {
    this.userService.forgot(this.userService.tempUserName).add(() => {
      if (this.userService.forgotSucess) {
        this.scrollTo(this.forgotSucessDom);
      }
    });
  }

  public ngOnInit(): void {
    if (this.forgot) {
      this.scrollTo(this.forgotDom);
    }
  }
}