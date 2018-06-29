import {NgModule} from '@angular/core';
import {AppCommonModule} from '../../common/modules/app-common.module';
import { CommonModule } from '@angular/common';
import {LostFoundService} from '../../common/services/lost-found.service';
import {MatchMakerService} from '../../common/services/match-maker.service';
import {SearchService} from '../../common/services/search.service';
import {boardComponent} from './board.component';
import {routing} from './board.router';

@NgModule({
  imports: [AppCommonModule, routing, CommonModule],
  declarations: [
    boardComponent,
  ],
  providers: [
     LostFoundService,
     MatchMakerService,
    SearchService
  ]
})
export class BoardModule {}