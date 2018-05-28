import {Component, ViewChild, ElementRef, Renderer} from '@angular/core';
import {ActivatedRoute, Router,  Params} from '@angular/router';
import {UserService} from '../../common/services/user.service';
import {DogCardService} from '../../common/services/dog-card.service';
import {CookieManagerService} from '../../common/services/cookie-manager.service';
import {MailingRewardService} from '../../common/services/mailing-reward.service';
import {GlobalFunctionService} from '../../common/services/global-function.service';
import {LostFoundService} from '../../common/services/lost-found.service';

@Component({
  selector: 'dog-ads',
  template: require('./dog-ads.template.html'),
  styles: [ require('./dog-ads.scss')]
})

export class DogAdsComponent {
  // param from url
  public dogId: string;
  // dog converted values.
  public mappedData: any;
  public rewardtoShow: string;
  public mobile: boolean;
  // converting location array to location google's obj
  public location: {lat: number, lng: number};
  public foundMode: boolean;
  // fireworks animation.
  public congrats: boolean;
  // needed to scroll to the found mode block in the dom.
  private FOUND_QUERY: string ='.review-location';
  private ACCOUNT_QUERY: string = '.account-location';
  // asking for evidence
  public evidenceNext: boolean;
  //when fb login
  public missFieldObj: Object;
  public createUser: boolean;
  //email service
  public sendingEmail: boolean;
  public ShowSendEmail: boolean;
  public disableActions: boolean;
  public showActions: boolean;
  public dragPosition: any;
  public dogDataloading: boolean;

  constructor (
    public dogService: DogCardService,
    public userService: UserService,
    public activeRoute: ActivatedRoute,
    public router: Router,
    public cookieService: CookieManagerService,
    public mailingService: MailingRewardService,
    public globalService: GlobalFunctionService,
    public renderer: Renderer,
    public domRef: ElementRef,
    public lostService: LostFoundService
  ) {
    this.mobile = window.screen.width <= 767;
    this.activeRoute.queryParams.subscribe((params: Params) => {
      this.dogId = params.id;
      this.foundMode = params.found === 'true';
      if (!this.userService.token && this.userService.noAuthSubs) {
        this.userService.noAuthSubs.unsubscribe();
        this.userService.login(undefined, undefined, true).add(() => {
          this.initalCall();
        });
      } else  {
        this.initalCall();
      }
    });
  }

  public initalCall(): void {
    if (this.lostService.savedData && this.lostService.savedData._id === this.dogId) {
      console.log('saved data', this.lostService.savedData);
      this.dogService.dogData = this.lostService.savedData;
      this.afterDataCall();
    } else if (this.dogService.dogData === this.dogId) {
      console.log('aready saved');
      this.afterDataCall();
    } else {
      this.dogDataloading = true;
      this.dogService.getDog(this.dogId).add(()=> {
        this.afterDataCall();
        this.dogDataloading = false;
      });
    }
  }

  public afterDataCall(): void {
    this.mappedData = this.dogService.mapData(this.dogService.dogData);
    console.log('mapped data', this.mappedData);
    if (!this.dogService.dogData || !this.mappedData || !this.dogService.dogData.lost) {
      this.disableActions = true;
    } 
    if (this.dogService.dogData  && this.dogService.dogData.location && this.dogService.dogData.location.coordinates) {
      this.location = {lat: this.dogService.dogData.location.coordinates[1], lng: this.dogService.dogData.location.coordinates[0]};
    }
    if (this.dogService.dogData && this.dogService.dogData.reward) {
      this.rewardtoShow = (+this.dogService.dogData.reward * 0.8).toFixed(2) + '';
    }    
    setTimeout(() => {
      $('.tooltipped').tooltip({delay: 100});
      this.initInto();
      this.colorFigures();
    }, 450);    
  }

  public ngOnInit(): void {
    this.cookieService.deleteCookie('dog-page-url');
    this.userService.missingReqFilds();
    this.missFieldObj = this.userService.missingFieldsToObj(this.userService.missingFields);
  }

  public ngAfterViewInit(): void {
    this.dragInit();
  }

  public initInto(): void {
    if (!this.userService.missingFields.length && this.foundMode) {
      this.scrollTo(this.FOUND_QUERY);
    } else if (this.userService.missingFields.length && this.userService.isAuth) {
     this.scrollTo(this.ACCOUNT_QUERY);
    }
  }

  public ngOnDestroy(): void {
    this.dogService.dogData = undefined;
  }

  public Found(): void {
    this.congrats = true;
    setTimeout(()=>{ 
      this.congrats = false;
      this.sessionLogin('found');
      this.foundMode = true;
      this.scrollTo(this.FOUND_QUERY);
    }, 1000);
  }

  public seen(): void {
    this.showActions = false;
    setTimeout(()=>{ 
      this.scrollTo(this.FOUND_QUERY);
    }, 1000);
  }  

  // check for session and if not ask the user to login or create account.
  public sessionLogin(param: string): void {
    if (!this.userService.isAuth) {
      const url = `${this.router.url}&${param}=true`;
      this.userService.previousUrl = url;
      this.cookieService.setCookie('dog-page-url', url);
      this.router.navigateByUrl('/login');
      return;
    }
  }
  // for evidence block
  public continueEvidence(): void {
    this.evidenceNext = true;
    if (this.mailingService.evidence.text) {
      localStorage.setItem('evidence-text-0', this.mailingService.evidence.text);
    }
    if (this.mailingService.evidence.picture) {
      localStorage.setItem('evidence-picture-0', this.mailingService.evidence.picture);
    }
  }
  // for evidence block
  public resize(): void {
    const evidenceText = $('#evidence-text')
    evidenceText.trigger('autoresize');
    this.mailingService.evidence.text = evidenceText.val();
  }
  //for evidence block
  public filePicChange(ev: any): void {
    let file: File = ev.target.files[0];
    if (ev.target && ev.target.files && file && file.type.match('image.*')) {
      try {
        const reader = new FileReader();
        reader.onload = (event: any) => {
          this.mailingService.evidence.picture = event.target.result;
        };
        reader.readAsDataURL(file);
      }catch (error) {
      //do nothing        
      }
    } else {
      this.globalService.clearErroMessages();
      this.globalService.setErrorMEssage('No es una imagen');
      this.globalService.openErrorModal();
      console.error('not an image');
    }    
  }
 //when FB login
  public userCreatePromise(postUser: any): void {
    if (postUser) {
      console.log('getting postUser >', postUser);
      postUser().add(() => {
        if (this.userService.user.phoneNumber && this.userService.user.phoneNumber.number) {
          console.log('user created! ');
          this.createUser = false;
          this.userService.missingFields = [];
        } else {
          this.createUser = false;
          this.globalService.clearErroMessages();
          this.globalService.setErrorMEssage('No se creo bien la cuenta');
          this.globalService.openErrorModal();
        }
        setTimeout(() => {this.userService.postUser = undefined}, 500);
      });
    } else {
      this.createUser = false;
      this.globalService.clearErroMessages();
      this.globalService.setErrorMEssage('Hubo un error al completar tus datos');
      this.globalService.openErrorModal();
    }    
  }

   public scrollTo(Query: string): void {
     setTimeout(()=> {
       const JqObj = $(Query);
       if (JqObj && JqObj.offset()) {
         const offset =  JqObj.offset().top - 120;
         window.scrollBy({ 
           top: offset,
           left: 0, 
           behavior: 'smooth' 
         });
       }
     }, 200);
  }

  public sendEmail(): void {
    this.sendingEmail = true;
    if (this.dogService.dogData.reporter_id === this.userService.user.id) {
      this.globalService.clearErroMessages();
      this.globalService.setErrorMEssage('No puedes reclamar una mascota que tu reportaste');
      this.globalService.openErrorModal();
      return;
    }
    this.mailingService.sendEmailsToUsers(true, this.userService.token, this.dogId).add(() => {
      this.sendingEmail = false;
      this.ShowSendEmail = true;
    }) 
  }

  public dragInit(): void {
      this.dragPosition = {lastPosY: 0, isDragging: false};
      const actions = document.getElementById('dog-page-actions');
      const  actionsHam = new Hammer(actions);
      actionsHam.add( new Hammer.Pan({ direction: Hammer.DIRECTION_VERTICAL, threshold: 0 }) );
      actionsHam.on('pan', this.handleDrag.bind(this));
  }

  public handleDrag(ev: any): void {
    const elem = ev.target;
    if ( !this.dragPosition.isDragging) {
      this.dragPosition.isDragging = true;
      this.dragPosition.lastPosY = elem.offsetTop;
    }
    this.showActions = ev.deltaY > 20 ? false : ev.deltaY < -20 ? true : this.showActions;
    this.dragPosition.isDragging = !ev.isFinal;
  }

    public colorFigures() {
    if(this.dogService.dogData.color.length > 1 && this.dogService.dogData.patternColors) {
      const elNames: string[] = Object.keys(this.dogService.dogData.patternColors);
      const colors: string[] = Object.values(this.dogService.dogData.patternColors);
      elNames.forEach((elName: string, elIndex: number) => {
        colors[elIndex] && this.fillColor(elName, colors[elIndex]);
      });
    } else if (this.dogService.dogData.color.length === 1) {
      this.fillColor('back-color', this.dogService.dogData.color[0].trim());
    }
  }

   public fillColor(elName: string, color: string): void {
    const NotMobileQuery: string = '.dog-properties.desktop-dogpage dog-figure #' + elName + ' g';
    const mobileDogQuery: string = '.dog-properties.mobile-dogpage dog-figure #' + elName + ' g';
    let queryString: string = mobileDogQuery + ', ' + NotMobileQuery;
    const thisCardDom: HTMLElement = $(queryString)[0];
    const cardDomMobile: HTMLElement = $(queryString)[1];
    $(thisCardDom).attr('style', 'fill:' + color);
    $(cardDomMobile).attr('style', 'fill:' + color);
  } 

}