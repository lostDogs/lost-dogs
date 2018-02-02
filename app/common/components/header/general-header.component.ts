import {ElementRef, Renderer, Component, OnInit, ViewChild} from '@angular/core';
import {GlobalFunctionService} from '../../services/global-function.service';
import {ActivatedRoute, Router} from '@angular/router';
import {UserService} from '../../services/user.service';
import {LostFoundService} from '../../services/lost-found.service';
import {CookieManagerService} from '../../services/cookie-manager.service';
import {DogCardService} from '../../services/dog-card.service';

@Component({
  selector: 'general-header',
  template: require('./general-header.template.html'),
  styles: [ require('./_general-header.scss')],
})

export class generalHeaderComponent implements OnInit  {
  public showLoginFrom : boolean;
  public offsetY: string;
  public newUser: boolean;
  public password: string;
  public displayNavOpts: boolean;
  @ViewChild('LoginDom')
  public loginDom: ElementRef;
  @ViewChild('UserDom')
  public userDom: ElementRef;
  public initHeader: boolean;
  public openedFirstMessage: boolean;
  public openSecondMessage:boolean;

  constructor (
    public renderer: Renderer,
    public elRef: ElementRef,
    public globalService: GlobalFunctionService,
    public activatedRoute: ActivatedRoute,
    public userService: UserService,
    public router: Router,
    public lostService: LostFoundService,
    public cookieService: CookieManagerService,
    public dogService: DogCardService
  ) {
    this.renderer.listenGlobal('document', 'click', (event: any) => {
      const loginDom: any = this.loginDom && this.loginDom.nativeElement;
      const userDom: any = this.userDom && this.userDom.nativeElement;
      if (this.showLoginFrom && !(this.elRef.nativeElement.lastChild.contains(event.target) || loginDom && loginDom.contains(event.target) || userDom && userDom.contains(event.target) )) {
        this.showLoginFrom = false;
      }
      if (this.openedFirstMessage && !this.openSecondMessage) {
        this.globalService.clearErroMessages();
        this.globalService.setErrorMEssage('Esta pagina puede que necesite de tu ubicación o camara');
        this.openSecondMessage = true;
        setTimeout(() => {
          this.globalService.openBlueModal();
        },1000);
      }
    });
  } 
  public toggleLoginFrom(event: any) {
    this.showLoginFrom = !this.showLoginFrom;
    this.password = undefined;
  }

    public openMessage() {
    this.globalService.clearErroMessages();
    this.globalService.setErrorMEssage('Esta pagina necesta de cookies para funcionar');
    this.globalService.openBlueModal();
    this.openedFirstMessage = true;
  }


  public ngOnInit(): void {
    // part 1: this code makes that the initial nav animation just appear once every day
/*    this.initHeader = this.cookieService.getCookie('initHeader');
    const tomorrow: any = new Date();*/
    const TimeNavOpts: number = this.initHeader || this.newUser ? 0 : 3500;
    setTimeout(()=>{this.displayNavOpts = true}, TimeNavOpts);
    $('.home-mobile').sideNav({
      menuWidth: 700,
      closeOnClick: true,
      draggable: true
    });
    this.activatedRoute.queryParams.subscribe(
      data => this.newUser = data.nU ? true : false
    );
    // part 2: this code makes that the initial nav animation just appear once every day
/*    if (typeof this.initHeader !== 'boolean') {
      tomorrow.setDate(tomorrow.getDate() + 1);
      this.cookieService.setCookie('initHeader','true',  tomorrow.toGMTString());
    }*/
  }

  public ngAfterViewInit(): void {
    if (!this.cookieService.getCookie('WarningMessage')) {
      setTimeout(() => {
        this.openMessage();
        this.cookieService.setCookie('WarningMessage', true);
      }, 3000);
    }
  }

  public AuthRedirect(): void {
    if (this.router.url.split('/')[1] === 'account') {
      this.router.navigate(['/profile']);
    }
  }

  public resetPage(): void {
    this.lostService.resetService();
    this.lostService.displayIntro = true;
    this.dogService.open = true;
    this.lostService.searchService.queryObj = {};
  }
};