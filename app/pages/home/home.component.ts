import { Component, HostListener, Inject} from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser';
import {GlobalFunctionService} from '../../common/services/global-function.service';
import {ActivatedRoute} from '@angular/router';
import { Location} from '@angular/common';
import {UserService} from '../../common/services/user.service';

@Component({
  selector: 'home',
  template: require('./home.template.html'),
  styles: [ require('./_home-style.scss')]
})

export class homeComponent {
  public scrollnormalize: number;
  public newUser: boolean;

  constructor (@Inject(DOCUMENT) private document:  Document, public globalService : GlobalFunctionService, public activatedRoute: ActivatedRoute, public location: Location, public userService: UserService) {}
  @HostListener('window:scroll', ['$event'])
  onWindowScroll() {
      const scrollMax: number = (window.innerHeight - (window.innerHeight / 8)) / 2;
      const scrollTop = this.document.body.scrollTop;
      this.scrollnormalize = (scrollMax - scrollTop) / scrollMax;
      this.globalService.scrollOpacity = 1.2 - this.scrollnormalize;
  }

  public ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(
      data => this.newUser = data.nU ? true : false
    );
    if (this.newUser) {
      setTimeout(() => {
        this.newUser = false;
        this.location.replaceState('/home');
      }, 6000);
    }
  }
  public getWindowHeight(): string {
    return window.innerHeight +'px';
  }
};
