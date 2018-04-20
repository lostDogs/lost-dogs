import {Component, EventEmitter, Output, Input, ViewChild, ElementRef} from '@angular/core';
import * as adConfig from '../../content/fb-ad-config.json';
import {FacebookService} from '../../services/facebook.service';

@Component({
  selector: 'facebook-ads',
  template: require('./facebook-ads.template.html'),
  styles: [ require('./facebook-ads.scss')]
})

export class FacebookAdsComponent { 
  public budget: number = 55;
  public duration: number = 2;
  public checked: boolean = false;
  public adOpts: any = adConfig;
  @Input()
  public replaceVals: {img?: string, reward?: string, nameObreed?: string, breed?:any, address?: string, latLong?: any} = {};
  public previewValues: any = {};
  public mainCollapse: JQuery;
  public adCreative: JQuery;

  @ViewChild('MainCollapse')
  public mainCollapsDom: ElementRef;

  constructor(public fbService: FacebookService) {}

 public ngAfterViewInit(): void {
   this.adCreative = $('#ad-creative');
   this.mainCollapse = $('.collapsible-header.main');
    $('.collapsible').collapsible();
    $('select').material_select();
    this.mainCollapse.click(() => {
      if (this.checked && this.mainCollapse.hasClass('addedSet')) {
        this.mainCollapse.removeClass('addedSet');
        this.checked = false;
        this.fbService.total = undefined;
        console.log('setting UNDEF of map add');
        this.fbService.mapAd(undefined, undefined, undefined);     
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
      this.fbService.calculateReach(this.budget);
    });
  }

  public ngOnInit(): void {
    this.rereplaceHolders();
    this.setInitVals();
  }

  public rereplaceHolders(): void {
    Object.values(this.adOpts).forEach((vals: any[], valsIndex: number) => {
      Array.isArray(vals) && vals.forEach((val: any, valIndex: number) => {
        typeof val === 'string' && /{(.*?)}/g.test(val) &&  val.match(/{(.*?)}/g).map(placeholder => placeholder.replace(/{+|}+/g, '')).forEach((placeholder) => {
          vals[valIndex] = val.replace(`{${placeholder}}`, this.replaceVals[placeholder] || '');
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
    this.mainCollapse.click();
    this.mainCollapse.addClass('addedSet');
    this.checked = true;
    window.scroll({
      top: 0, 
      left: 0, 
      behavior: 'smooth' 
    });
    this.getTotal();
    console.log('setting full values of map add');
    this.fbService.mapAd(this.duration, this.budget, Object.assign(this.previewValues, {img: this.replaceVals.img}));
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
    this.fbService.calculateReach(this.budget);
  }

  public getTotal(): void {
    this.fbService.total = this.checked ? this.budget * this.duration : undefined;
  }

};
