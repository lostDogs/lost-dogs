import {NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import {AppCommonModule} from '../../common/modules/app-common.module';
import {RewardPickerComponent} from './reward-picker.component.ts';
import {routing} from './reward-picker.router';
import {QrScannerComponent} from '../../common/components/qr-scanner/qr-scanner.component.ts';

@NgModule({
    imports: [CommonModule, routing, AppCommonModule],
  declarations: [QrScannerComponent, RewardPickerComponent],
})
export class rewardPickerModule {}