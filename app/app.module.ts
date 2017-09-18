import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {AppRouterModule, routerComponents} from './app.router';
import {appComponent} from './app.component';
import {HttpModule} from '@angular/http';
import  {generalHeaderComponent} from './common/components/header/general-header.component';
import {generalFooterComponent} from './common/components/footer/general-footer.component';
import {GlobalFunctionService} from './common/services/global-function.service';
import {ValidationService} from './common/services/validation.service';
import { FormsModule }  from '@angular/forms';
import {ApiService} from './common/services/api.service';
import {UserService} from './common/services/user.service';
import {DogCardService} from './common/services/dog-card.service';
import {GlobalError} from './common/components/gobal-error/global-error.component';
import {DogCardComponent} from './common/components/dog-card/dog-card.component';
import {TextScrollComponent} from './common/components/text-scroll/text-scroll.component';
import {DatePickerComponent} from './common/components/date-picker/date-picker.component';
import {MapComponent} from './common/components/map/map.component';
import {SideBlockComponent} from './common/components/side-block/side-block.component';

@NgModule({
  imports: [BrowserModule, AppRouterModule, FormsModule, HttpModule],
  declarations: [
  appComponent,
  routerComponents,
  generalHeaderComponent,
  generalFooterComponent,
  GlobalError, DogCardComponent,
  TextScrollComponent,
  DatePickerComponent,
  MapComponent,
  SideBlockComponent
  ],
  providers: [
    {provide: GlobalFunctionService, useClass: GlobalFunctionService},
    {provide: ValidationService, useClass: ValidationService},
    {provide: ApiService, useClass: ApiService},
    {provide: UserService, useClass: UserService},
    {provide: DogCardService, useClass: DogCardService}
  ],
  bootstrap: [appComponent]
})
export class AppModule {}