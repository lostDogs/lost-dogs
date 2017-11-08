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
import {LostFoundService} from './common/services/lost-found.service';
import {GlobalError} from './common/components/gobal-error/global-error.component';
import {CookieManagerService} from './common/services/cookie-manager.service';
import {DogCardComponent} from './common/components/dog-card/dog-card.component';
import {TextScrollComponent} from './common/components/text-scroll/text-scroll.component';
import {DatePickerComponent} from './common/components/date-picker/date-picker.component';
import {MapComponent} from './common/components/map/map.component';
import {SideBlockComponent} from './common/components/side-block/side-block.component';
import {SideBlockDogComponent} from './common/components/side-block-dog/side-block-dog.component'
import {GenderBlockComponent} from './common/components/gender-block/gender-block.component';
import {BreedBlockComponent} from './common/components/breed-block/breed-block.component';
import {SizeBlockComponent} from './common/components/size-block/size-block.component';
import {ColorBlockComponent} from './common/components/color-block/color-block.component';
import {ExtrasBlockComponent} from './common/components/extras-block/extras-block.component';
import {DogFigureComponent} from './common/components/dog-figure/dog-figure.component';
import {PatternBlockComponent} from './common/components/pattern-block/pattern-block.component';
import {SearchService} from './common/services/search.service';
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
  SideBlockComponent,
  GenderBlockComponent,
  BreedBlockComponent,
  SizeBlockComponent,
  ColorBlockComponent,
  ExtrasBlockComponent,
  SideBlockDogComponent,
  DogFigureComponent,
  PatternBlockComponent
  ],
  providers: [
    {provide: GlobalFunctionService, useClass: GlobalFunctionService},
    {provide: ValidationService, useClass: ValidationService},
    {provide: ApiService, useClass: ApiService},
    {provide: UserService, useClass: UserService},
    {provide: DogCardService, useClass: DogCardService},
    {provide: LostFoundService, useClass: LostFoundService},
    {provide: CookieManagerService, useClass: CookieManagerService},
    {provide: SearchService, useClass: SearchService}
  ],
  bootstrap: [appComponent]
})
export class AppModule {}