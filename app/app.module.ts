import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {appComponent} from './app.component';
import {AppRouterModule, routerComponents} from './app.router';
import {AppCommonModule} from './common/modules/app-common.module';
import  {generalHeaderComponent} from './common/components/header/general-header.component';
import {generalFooterComponent} from './common/components/footer/general-footer.component';
import {ValidationService} from './common/services/validation.service';
import {CookieManagerService} from './common/services/cookie-manager.service';
import {DogCardComponent} from './common/components/dog-card/dog-card.component';
import {TextScrollComponent} from './common/components/text-scroll/text-scroll.component';
import {DatePickerComponent} from './common/components/date-picker/date-picker.component';
import {MapComponent} from './common/components/map/map.component';
import {SideBlockDogComponent} from './common/components/side-block-dog/side-block-dog.component'
import {GlobalError} from './common/components/gobal-error/global-error.component';
import {GlobalFunctionService} from './common/services/global-function.service';
import {ApiService} from './common/services/api.service';
import {UserService} from './common/services/user.service';
import {DogCardService} from './common/services/dog-card.service';
import {MailingRewardService} from './common/services/mailing-reward.service';
import {OpenSpayService} from './common/services/openspay.service';
import {FacebookService} from './common/services/facebook.service';
import {FacebookAdsComponent} from './common/components/facebook-ads/facebook-ads.component';
import {previewFbAdsComponent} from './common/components/preview-fb-ads/preview-fb-ads.component';
import {ActionsBlockComponent} from './common/components/actions-block/actions-block.component';
import {LostFoundService} from './common/services/lost-found.service';
import {MatchMakerService} from './common/services/match-maker.service';
import {SearchService} from './common/services/search.service';
/*
 * BrowserModule boostrap the whole angular app. you just imported it once!
 * for other modules that have  component declarations you need to use CommonModule
 * which I like to think is a subset of BrowserModule
*/

/*
 * If you add service/providers in an common module and then import them on modules you want to use,
 * the services will be instanciated on per module used
 * so if you want all your service to contains common values through all the app then you should add them 
 * in the main app module 
*/

@NgModule({
  imports: [BrowserModule, AppCommonModule, AppRouterModule],
  declarations: [
  appComponent,
  routerComponents,
  generalHeaderComponent,
  generalFooterComponent,
  DogCardComponent,
  TextScrollComponent,
  DatePickerComponent,
  MapComponent,
  SideBlockDogComponent,
  GlobalError,
  FacebookAdsComponent,
  previewFbAdsComponent,
  ActionsBlockComponent
  ],
  providers: [
    SearchService,
    {provide: ValidationService, useClass: ValidationService},
    {provide: CookieManagerService, useClass: CookieManagerService},
    {provide: GlobalFunctionService, useClass: GlobalFunctionService},
    {provide: ApiService, useClass: ApiService},
    {provide: UserService, useClass: UserService},
    {provide: DogCardService, useClass: DogCardService},
    {provide: MailingRewardService, useClass: MailingRewardService},
    {provide: OpenSpayService, useClass: OpenSpayService},
    {provide: FacebookService, useClass: FacebookService}
  ],
  bootstrap: [appComponent]
})
export class AppModule {}