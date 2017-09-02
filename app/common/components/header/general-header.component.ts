import {ElementRef, Renderer, Component, OnInit} from '@angular/core';
import {GlobalFunctionService} from '../../services/global-function.service';
import {ActivatedRoute, Router} from '@angular/router';
import {UserService} from '../../services/user.service';

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

  constructor (public renderer: Renderer, public elRef: ElementRef, public globalService: GlobalFunctionService, public activatedRoute: ActivatedRoute, public userService: UserService, public router: Router) {
    this.renderer.listenGlobal('document', 'click', (event: any) => {
      const loginDom: any = this.elRef.nativeElement.childNodes[0].childNodes[5].childNodes[1].childNodes[2];
      const UserDom: any = this.elRef.nativeElement.childNodes[0].childNodes[5].childNodes[1].childNodes[4];
      if (this.showLoginFrom && !(this.elRef.nativeElement.lastChild.contains(event.target) || loginDom.contains(event.target) || UserDom.contains(event.target) )) {
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