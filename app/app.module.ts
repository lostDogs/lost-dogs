import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {HttpModule} from '@angular/http';
import {FormsModule} from '@angular/forms';
import {appComponent} from './app.component';
import {AppRouterModule, routerComponents} from './app.router';
import {AppCommonModule} from './common/modules/app-common.module';
import  {generalHeaderComponent} from './common/components/header/general-header.component';
import {generalFooterComponent} from './common/components/footer/general-footer.component';
import {ValidationService} from './common/services/validation.service';
import {LostFoundService} from './common/services/lost-found.service';
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
import {MatchMakerService} from './common/services/match-maker.service';
import {GlobalError} from './common/components/gobal-error/global-error.component';
/*
 * BrowserModule boostrap the whole angular app. you just imported it once!
 * for other modules that have  component declarations you need to use CommonModule
 * which I like to think is a subset of BrowserModule
*/

@NgModule({
  imports: [BrowserModule, HttpModule, FormsModule, AppCommonModule.forRoot(), AppRouterModule],
  declarations: [
  appComponent,
  routerComponents,
  generalHeaderComponent,
  generalFooterComponent,
   DogCardComponent,
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
  PatternBlockComponent,
  GlobalError
  ],
  providers: [
    {provide: ValidationService, useClass: ValidationService},
    {provide: LostFoundService, useClass: LostFoundService},
    {provide: CookieManagerService, useClass: CookieManagerService},
    {provide: SearchService, useClass: SearchService},
    {provide: MatchMakerService, useClass: MatchMakerService}
  ],
  bootstrap: [appComponent]
})
export class AppModule {}