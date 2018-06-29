import {NgModule} from '@angular/core';
import {HttpModule} from '@angular/http';
import {FormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import { CommonModule } from '@angular/common';
import {DogFigureComponent} from '../components/dog-figure/dog-figure.component';
import {DogCardComponent} from '../components/dog-card/dog-card.component';
import {TextScrollComponent} from '../components/text-scroll/text-scroll.component';
import {DatePickerComponent} from '../components/date-picker/date-picker.component';
import {MapComponent} from '../components/map/map.component';
import {SideBlockDogComponent} from '../components/side-block-dog/side-block-dog.component'
import {accountComponent} from '../../pages/create-account/account.component';
import {FormPaymentComponent} from '../../pages/payment/form-payment/form-payment.component';
import {GlobalError} from '../components/gobal-error/global-error.component';

import { SideBlockComponent } from '../components/side-block/side-block.component';
import {BreedBlockComponent} from '../components/breed-block/breed-block.component';
import {SizeBlockComponent} from '../components/size-block/size-block.component';
import {ColorBlockComponent} from '../components/color-block/color-block.component';
import {GenderBlockComponent} from '../components/gender-block/gender-block.component';
import {ExtrasBlockComponent} from '../components/extras-block/extras-block.component';
import {PatternBlockComponent} from '../components/pattern-block/pattern-block.component';


import {FacebookAdsComponent} from '../components/facebook-ads/facebook-ads.component';
import {previewFbAdsComponent} from '../components/preview-fb-ads/preview-fb-ads.component';
import {ActionsBlockComponent} from '../components/actions-block/actions-block.component';

@NgModule({
  imports: [CommonModule, HttpModule, FormsModule, RouterModule],
  exports: [
    HttpModule,
    FormsModule,
    DogFigureComponent,
    DogCardComponent,
    TextScrollComponent,
    DatePickerComponent,
    MapComponent,
    SideBlockDogComponent,
    FacebookAdsComponent,
    previewFbAdsComponent,
    ActionsBlockComponent,
    GlobalError,
    FormPaymentComponent,
    accountComponent,
    SideBlockComponent,
    BreedBlockComponent,
    SizeBlockComponent,
    ColorBlockComponent,
    GenderBlockComponent,
    ExtrasBlockComponent,
    PatternBlockComponent,
  ], 
  declarations: [
    DogFigureComponent,
    DogCardComponent,
    TextScrollComponent,
    DatePickerComponent,
    MapComponent,
    SideBlockDogComponent,
    FacebookAdsComponent,
    previewFbAdsComponent,
    ActionsBlockComponent,
    GlobalError,
    FormPaymentComponent,
    accountComponent,
    SideBlockComponent,
    BreedBlockComponent,
    SizeBlockComponent,
    ColorBlockComponent,
    GenderBlockComponent,
    ExtrasBlockComponent,
    PatternBlockComponent,
  ]
})
export class AppCommonModule {}