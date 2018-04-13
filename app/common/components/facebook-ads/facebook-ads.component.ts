import {Component, EventEmitter, Output, Input, ViewChild, ElementRef} from '@angular/core';
import * as adConfig from '../../content/fb-ad-config.json';

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
  public replaceVals: any = {};
  public previewValues: any = {};
  public mainCollapse: JQuery;
  public adCreative: JQuery;

  @ViewChild('MainCollapse')
  public mainCollapsDom: ElementRef;

  constructor() {
    this.replaceVals = {
      breed: 'galgo',
      locationName: 'mirado del sol',
      reward: '$ 50.00 MXN'
    };
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
        this.mainCollapse.click();
      }
      this.checked = !this.checked;
    })
    $('select').change((event) => {
      if (event.target.id == 'preview' && !this.adCreative.hasClass('active')) {
        this.adCreative.click();
      }
      this.previewValues[event.target.id] = $('#' + event.target.id).val();
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
  }

  public getTotalFee(): void {}
};
