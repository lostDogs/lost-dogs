import {Component} from '@angular/core';
import {LostFoundService} from '../../../common/services/lost-found.service';

@Component({
  selector: 'complete-user',
  template: require('./complete-user.template.html'),
  styles: [ require('./complete-user.scss')]
})

export class CompleteUserComponent { 
  public missingFieldsObj: any;

  constructor(public LostService: LostFoundService) {
    this.LostService.multipleImgAnswers = [];
    this.LostService.question2 = undefined;
    this.LostService.question3 = undefined;
    this.LostService.question = 'Completa tu información';
    this.LostService.optional = false;
    this.LostService.imgAnswer = undefined;
  }
  
  public ngOnInit(): void {
    this.missingFieldsObj = this.LostService.userService.missingFieldsToObj(this.LostService.userService.missingReqFilds());
  }

  public promiseCatcher(postUser: any): void {
    if (postUser) {
      postUser().add(() => {
        this.LostService.userService.createAccount = false;
        if (this.LostService.userService.user.phoneNumber && this.LostService.userService.user.phoneNumber.number ) {
          this.LostService.removeUserDataPage();
          this.LostService.goTo(this.LostService.defualtSequence.length - 1);
        } else {
          this.LostService.globalService.clearErroMessages();
          this.LostService.globalService.setErrorMEssage('No se creo bien la cuenta');
          this.LostService.globalService.openErrorModal();
        }
        setTimeout(() => {this.LostService.userService.postUser = undefined}, 500);
      });
    } else {
      this.LostService.userService.createAccount = false;
      this.LostService.globalService.clearErroMessages();
      this.LostService.globalService.setErrorMEssage('Hubo un error al completar tus datos');
      this.LostService.globalService.openErrorModal();
    }
  }
}
