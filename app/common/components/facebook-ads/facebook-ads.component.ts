import {Component, EventEmitter, Output, Input, ViewChild, ElementRef, SimpleChanges} from '@angular/core';
import * as adConfig from '../../content/fb-ad-config.json';
import {FacebookService} from '../../services/facebook.service';

@Component({
  selector: 'facebook-ads',
  template: require('./facebook-ads.template.html'),
  styles: [ require('./facebook-ads.scss')]
})

export class FacebookAdsComponent { 
  public budget: number = 60;
  public duration: number = 3;
  public checked: boolean = false;
@Output()
  public added: EventEmitter<boolean> = new EventEmitter<boolean>();
  public adOpts: any;
  @Input()
  public replaceVals: {img?: string, reward?: string, nameObreed?: string, breed?:any, address?: string, latLong?: any, gender?: string, lostDate?: string, comments?: string, name?: string, [label: string]: any} = {};
  public previewValues: any = {};
  public mainCollapse: JQuery;
  public adCreative: JQuery;
  public finalReach: string;
  public mobile: boolean;

  @ViewChild('MainCollapse')
  public mainCollapsDom: ElementRef;

  constructor(public fbService: FacebookService) {
    this.mobile = window.screen.width <= 767;
    this.adOpts = JSON.parse(JSON.stringify(adConfig));
  }

  public ngOnInit(): void {
    this.rereplaceHolders();
    this.setInitVals();
  }

 public ngAfterViewInit(): void {
   this.adCreative = $('#ad-creative');
   this.mainCollapse = $('.collapsible-header.main');
    $('.collapsible').collapsible();
    $('select').material_select();
    this.mainCollapse.click(() => {
      if (this.checked && this.mainCollapse.hasClass('addedSet')) {
        this.mainCollapse.removeClass('addedSet');
        this.checked = false;
        this.added.emit(this.checked);
        this.fbService.mapAd(undefined, undefined, Object.assign(this.previewValues, {img: this.replaceVals.img}), this.replaceVals.latLong);
        this.mainCollapse.click();
      }
    })
    $('select').change((event) => {
      if (event.target.id == 'preview' && !this.adCreative.hasClass('active')) {
        this.adCreative.click();
      }
      this.previewValues[event.target.id] = $('#' + event.target.id).val();
    });
    this.fbService.getAdReach(this.budget, this.replaceVals.latLong).add(() => {
      this.fbService.usersReach = this.fbService.calculateReach(this.budget);
      this.setFinalReach();
      this.fbService.mapAd(undefined, undefined, Object.assign(this.previewValues, {img: this.replaceVals.img}), this.replaceVals.latLong);
    });
    setTimeout(() => {
      this.mainCollapse.click();
      this.adCreative.click();
    }, 600);
  }

  public rereplaceHolders(): void {
    const adOptsKeys = Object.keys(this.adOpts);
    Object.values(this.adOpts).forEach((vals: any[], valsIndex: number) => {
      Array.isArray(vals) && vals.forEach((val: any, valIndex: number) => {
        typeof val === 'string' && /{(.*?)}/g.test(val) && val.match(/{(.*?)}/g).map(placeholder => placeholder.replace(/{+|}+/g, '')).forEach((placeholder) => {
          const replacedVal = this.adOpts[adOptsKeys[valsIndex]][valIndex].replace(`{${placeholder}}`, this.replaceVals[placeholder] || '');
          this.adOpts[adOptsKeys[valsIndex]][valIndex] = replacedVal;
        });
      });
    });
  }

  public setInitVals(): void {
    this.previewValues.title = this.adOpts.titles[0];
    this.previewValues.body = this.adOpts.bodies[0];
    this.previewValues.description = this.adOpts.descriptions[0];
  }

  public addSet(): void {
    const extraInfo = $('#extra-info .row.collapsible-header');
    this.mainCollapse.click();
    setTimeout(() => {
      if (extraInfo.hasClass('active')) {
        extraInfo.click();
      }
    }, 600);
    this.mainCollapse.addClass('addedSet');
    this.checked = true;
    this.added.emit(this.checked);
    window.scroll({
      top: 0, 
      left: 0, 
      behavior: 'smooth' 
    });
    this.fbService.mapAd(this.duration, this.budget, Object.assign(this.previewValues, {img: this.replaceVals.img}), this.replaceVals.latLong);
  }

   public filePicChange(ev: any): void {
    const defaultImg = this.replaceVals.img;
    let file: File = ev.target.files[0];
    if (ev.target && ev.target.files && file && file.type.match('image.*')) {
      try {
        const reader = new FileReader();
        reader.onload = (event: any) => {
          this.replaceVals.img = event.target.result;
          };
        reader.readAsDataURL(file);
      } catch (error) {
        this.replaceVals.img = defaultImg;
      }
    } else {
      this.replaceVals.img = defaultImg;
      console.error('not an image');
    }
  } 

  public getBudget(event: any): void {
    this.fbService.usersReach = this.fbService.calculateReach(this.budget);

    this.setFinalReach();
  }

  public setFinalReach(): void {
    if ( !/argando/g.test(this.fbService.usersReach) && this.fbService.usersReach !== -1) {
      const preFinal: number = +this.fbService.usersReach.replace(',', '') * this.duration * 0.90;
      this.finalReach = (preFinal.toFixed(0)).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,');
    } else {
      this.finalReach = 'No Disp';
    }
  }

  public ngOnDestroy(): void {}

 public ngOnChanges(changes: SimpleChanges): void {}
 
};
