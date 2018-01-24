import { Component} from '@angular/core';
import {GlobalFunctionService} from '../../services/global-function.service';

@Component({
  selector: 'global-error',
  template: require('./global-error.template.html'),
  styles: [ require('./global-error.scss')]
})

export class GlobalError {

  constructor(public globalService: GlobalFunctionService) {}


  public open(): boolean {
      $('.btn.btn-floating.tap-target-origin').removeClass('blue');
      $('div.tap-target-wrapper .tap-target').removeClass('blue');
      $('.tap-target').tapTarget('open');
      return true;
  }

  public close(): boolean {
    $('.tap-target').tapTarget('close');
    return false;
  }

  public openBlue(): void {
    $('.tap-target').tapTarget('open');
    const taptargetButton: JQuery = $('.btn.btn-floating.tap-target-origin');
    const  taptarget: JQuery = $('div.tap-target-wrapper .tap-target');
    taptargetButton.addClass('blue');
    taptarget.addClass('blue');
  }

  public ngOnInit(): void {
    this.globalService.openErrorModal = this.open;
    this.globalService.closeErrorModal = this.close;
    this.globalService.openBlueModal = this.openBlue;
  }

}
