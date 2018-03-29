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
    console.log('missingFieldsObj', this.missingFieldsObj);
  }

  public promiseCatcher(postUser: any): void {
      if (postUser) {
        console.log('getting postUser', postUser);
        postUser().add(() => {
          if (this.LostService.userService.user.phoneNumber) {
            this.LostService.goTo(this.LostService.pagePosition + 1);
          } else {
            this.LostService.globalService.clearErroMessages();
            this.LostService.globalService.setErrorMEssage('No se creo bien la cuenta');
            this.LostService.globalService.openErrorModal();
          }
          //setTimeout(() => {this.userService.postUser}, 500);
        });
      } else {
        this.LostService.globalService.clearErroMessages();
        this.LostService.globalService.setErrorMEssage('Hubo un error al completar tus datos');
        this.LostService.globalService.openErrorModal();
      }    

  }
}
