import {NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import {AppCommonModule} from '../../common/modules/app-common.module';
import {LostFoundService} from '../../common/services/lost-found.service';
import {MatchMakerService} from '../../common/services/match-maker.service';
import {SearchService} from '../../common/services/search.service';
import {payComponents, routing} from './payment.router';

@NgModule({
  imports: [AppCommonModule, CommonModule, routing],
  declarations: [
  payComponents
  ],
  providers: [
     LostFoundService,
    SearchService,
    MatchMakerService,
  ]
})
export class PaymentModule {}