import {NgModule} from '@angular/core';
import {AppCommonModule} from '../../common/modules/app-common.module';
import { CommonModule } from '@angular/common';
import {LostFoundService} from '../../common/services/lost-found.service';
import {MatchMakerService} from '../../common/services/match-maker.service';
import {SearchService} from '../../common/services/search.service';
import {routerComps, routing} from './lost-found.router';


@NgModule({
  exports: [],
  imports: [AppCommonModule, routing, CommonModule],
  declarations: [
  routerComps,
  ],
  providers: [
  LostFoundService,
  MatchMakerService,
  SearchService
  ]
})
export class LostFoundModule {}