import {NgModule} from '@angular/core';
import {AppCommonModule} from '../../common/modules/app-common.module';
import { CommonModule } from '@angular/common';
import {LostFoundService} from '../../common/services/lost-found.service';
import {BreedBlockComponent} from '../../common/components/breed-block/breed-block.component';
import {SizeBlockComponent} from '../../common/components/size-block/size-block.component';
import {ColorBlockComponent} from '../../common/components/color-block/color-block.component';
import {GenderBlockComponent} from '../../common/components/gender-block/gender-block.component';
import {ExtrasBlockComponent} from '../../common/components/extras-block/extras-block.component';
import {PatternBlockComponent} from '../../common/components/pattern-block/pattern-block.component';
import {MatchMakerService} from '../../common/services/match-maker.service';
import {SearchService} from '../../common/services/search.service';
import {routerComps, routing} from './lost-found.router';
import { SideBlockComponent } from '../../common/components/side-block/side-block.component';
import {DogFigureComponent} from '../../common/components/dog-figure/dog-figure.component';

@NgModule({
  exports: [],
  imports: [AppCommonModule, routing, CommonModule],
  declarations: [
  BreedBlockComponent,
  SizeBlockComponent,
  ColorBlockComponent,
  GenderBlockComponent,
  ExtrasBlockComponent,
  PatternBlockComponent,
  SideBlockComponent,
  DogFigureComponent,
  routerComps,
  ],
  providers: [
  LostFoundService,
  MatchMakerService,
  SearchService
  ]
})
export class LostFoundModule {}