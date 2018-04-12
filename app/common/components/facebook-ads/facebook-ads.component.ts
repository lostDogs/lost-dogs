import {Component, EventEmitter, Output, Input} from '@angular/core';

@Component({
  selector: 'facebook-ads',
  template: require('./facebook-ads.template.html'),
  styles: [ require('./facebook-ads.scss')]
})

export class FacebookAdsComponent { 
  public budget: number;
  public budgetPercent: number;
  public minSelectBudget: number = 55;
  public maxSelectBudget: number = 200;

  constructor() {

  }

  public ngOnInit(): void {
  }
 public ngAfterViewInit(): void {
    $('.collapsible').collapsible();
    $('select').material_select();
 }
 public gettingChange(event: any): void {
   console.log('event', this.budget);
   this.budgetPercent = (this.budget - this.minSelectBudget + 1) / (this.maxSelectBudget - this.minSelectBudget) * 100;
   console.log('budget perncet', this.budgetPercent);
 }
};
