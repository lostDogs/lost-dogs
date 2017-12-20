import {NgModule, Optional, SkipSelf } from '@angular/core';
import {GlobalFunctionService} from '../services/global-function.service';
import {ApiService} from '../services/api.service';
import {UserService} from '../services/user.service';
import {DogCardService} from '../services/dog-card.service';
import {MailingRewardService} from '../services/mailing-reward.service';


@NgModule()
export class AppCommonModule {
  constructor (@Optional() @SkipSelf() parentModule: AppCommonModule) {
    if (parentModule) {
      throw new Error('AppCommonModule is already loaded. Import it in the AppModule only');
    }

  }
  public static forRoot() {
    return {
        ngModule: AppCommonModule,
        providers: [
          {provide: GlobalFunctionService, useClass: GlobalFunctionService},
          {provide: ApiService, useClass: ApiService},
          {provide: UserService, useClass: UserService},
          {provide: DogCardService, useClass: DogCardService},
          {provide: MailingRewardService, useClass: MailingRewardService}
        ]
    };
  }
}