import {NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import {HttpModule} from '@angular/http';
import {FormsModule} from '@angular/forms';
import {AppCommonModule} from '../../common/modules/app-common.module';
import {RewardPickerComponent} from './reward-picker.component.ts';
import {routing} from './reward-picker.router';
import {QrScannerComponent} from '../../common/components/qr-scanner/qr-scanner.component.ts';

@NgModule({
    imports: [CommonModule, routing, HttpModule, FormsModule],
  declarations: [QrScannerComponent, RewardPickerComponent],
})
export class rewardPickerModule {}