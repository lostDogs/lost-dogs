import {ElementRef, Renderer, Component, OnInit, ViewChild} from '@angular/core';
import {GlobalFunctionService} from '../../services/global-function.service';
import {ActivatedRoute, Router} from '@angular/router';
import {UserService} from '../../services/user.service';
import {LostFoundService} from '../../services/lost-found.service';

@Component({
  selector: 'general-header',
  template: require('./general-header.template.html'),
  styles: [ require('./_general-header.scss')],
})

export class generalHeaderComponent implements OnInit  {
  public showLoginFrom : boolean;
  public offsetY: string;
  public newUser: boolean;
  public userName: string;
  public password: string;
  public displayNavOpts: boolean;
  @ViewChild('LoginDom')
  public loginDom: ElementRef;
  @ViewChild('UserDom')
  public UserDom: ElementRef;

  constructor (public renderer: Renderer, public elRef: ElementRef, public globalService: GlobalFunctionService, public activatedRoute: ActivatedRoute, public userService: UserService, public router: Router, public lostService: LostFoundService) {
    setTimeout(()=>{this.displayNavOpts = true}, 3500);
    this.renderer.listenGlobal('document', 'click', (event: any) => {
      const loginDom: any = this.loginDom && this.loginDom.nativeElement;
      const UserDom: any = this.UserDom && this.UserDom.nativeElement;
      if (this.showLoginFrom && !(this.elRef.nativeElement.lastChild.contains(event.target) || loginDom && loginDom.contains(event.target) || UserDom && UserDom.contains(event.target) )) {
        this.showLoginFrom = false;
      }
    });

  }
  public toggleLoginFrom(event: any) {
    this.showLoginFrom = !this.showLoginFrom;
    this.userName = undefined;
    this.password = undefined;
  }

  public ngOnInit(): void {
    $('.home-mobile').sideNav({
      menuWidth: 700,
      closeOnClick: true,
      draggable: true
    });
    this.activatedRoute.queryParams.subscribe(
      data => this.newUser = data.nU ? true : false
    );
  }
};