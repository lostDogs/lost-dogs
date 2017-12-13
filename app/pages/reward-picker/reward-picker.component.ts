import {Component} from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'reward-picker',
  template: require('./reward-picker.template.html'),
  styles: [ require('./reward-picker.scss')]
})

export class RewardPickerComponent {
  public scanner: any;
  constructor() {
    //console.log('instascan', instascan);
  }
  public ngOnInit(): void {
  }

  public ngAfterViewInit(): void {}

}