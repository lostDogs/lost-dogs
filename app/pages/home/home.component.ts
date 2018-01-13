import { Component, HostListener, Inject, ElementRef, ViewChild} from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser';
import {GlobalFunctionService} from '../../common/services/global-function.service';
import {ActivatedRoute, Router} from '@angular/router';
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
  public scrolldownDisplay: boolean = true;
  public scrollMax: number;
  @ViewChild('Description')
  public descriptionDom: ElementRef;

  constructor (@Inject(DOCUMENT) private document:  Document, public globalService : GlobalFunctionService, public activatedRoute: ActivatedRoute, public location: Location, public userService: UserService, public router: Router) {
    this.scrollMax = (window.innerHeight - (window.innerHeight / 8)) / 2;
  }
  @HostListener('window:scroll', ['$event'])
  onWindowScroll(event: any) {
      const scrollMax: number = (window.innerHeight - (window.innerHeight / 8)) / 2;
      this.scrollMax = scrollMax;
      const scrollTop = this.document.documentElement.scrollTop;
      this.scrollnormalize = (scrollMax - scrollTop) / scrollMax;
      this.globalService.scrollOpacity = 1.2 - this.scrollnormalize;
      if(this.scrollnormalize <= 0) {
        this.scrolldownDisplay = false;
      }
  }

  public ngOnInit(): void {
    window.scroll(0,0);
    localStorage.clear();
    this.userService.timesTrying = 0;
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

  public ngAfterViewInit(): void {
    const scrollTo: number = this.descriptionDom.nativeElement.offsetTop - 100;
    $('.scroll-botttom').click(function(){
        $('html, body').animate({ scrollTop: scrollTo }, 600);
    });
  }

  public goTo(url: string): void {
    this.router.navigateByUrl(url)
  }

  public getWindowHeight(): string {
    return window.innerHeight +'px';
  }
};
