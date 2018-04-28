import {Component, ElementRef, ViewChild} from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router';
import {UserService} from '../../common/services/user.service';
import {FacebookService} from '../../common/services/facebook.service';
import {GlobalFunctionService} from '../../common/services/global-function.service';

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

  constructor (public userService: UserService, public activeRoute: ActivatedRoute, public route: Router, public globalService: GlobalFunctionService, public fbService: FacebookService) {
    this.userService.forgotSucess = false;
    this.activeRoute.queryParams.subscribe((params: Params) => {
      this.forgot = params.fG === 'true';
    });
    //Catptcha code incliding the ngOnDestroy.
    window['captchaSubmit'] = this.userService.captchaSubmit.bind(this.userService);
    window['expiredCaptcha'] = this.userService.expiredCaptcha.bind(this.userService);
    window['onloadCallback'] = this.userService.onloadCallback;
    this.userService.loadCaptchaScript();
  }

  public loginRedirect(user: string, password: string): void {
    this.userService.login(user, password).add(() => {
     if (this.userService.isAuth && !this.userService.previousUrl) {
       this.route.navigate(['/home']);
     }
    });
  }

  public scrollTo(domEl: ElementRef): void {
    if (domEl.nativeElement) {
      const forgotOffset = domEl.nativeElement.offsetTop - 120;
      setTimeout(() => {
        $('html, body').animate({ scrollTop: forgotOffset}, 700);
      }, 600);
    }
  }

  public callForgot(): void {
    if (!this.userService.validCaptcha) {
      this.globalService.clearErroMessages();
      this.globalService.setErrorMEssage('Parece que eres un robot');
      this.globalService.setSubErrorMessage('error en re-captcha');
      this.globalService.openErrorModal();
      return;
    }
    this.userService.forgot(this.userService.tempUserName).add(() => {
      if (this.userService.forgotSucess) {
        this.scrollTo(this.forgotSucessDom);
        setTimeout(() => {
          this.forgot = undefined;
          window.scrollBy({ 
          top: 0,
          left: 0,
          behavior: 'smooth'
          });          
        }, 5000);
      }
    });
  }

  public ngOnInit(): void {
    if (this.forgot) {
      this.scrollTo(this.forgotDom);
    }
    if (this.userService.isAuth) {
      this.route.navigate(['/home']);
    }
  }

  public ngOnDestroy(): void {
    this.userService.validCaptcha = undefined;
    $('script#captcha-script').detach();
  }  
}