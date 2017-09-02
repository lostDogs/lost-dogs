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
      $('.tap-target').tapTarget('open');
      return true;
  }

  public close(): boolean {
    $('.tap-target').tapTarget('close');
    return false;
  } 

  public ngOnInit(): void {
    this.globalService.openErrorModal = this.open;
    this.globalService.closeErrorModal = this.close;
  }

}
