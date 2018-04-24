import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {RewardPickerComponent} from './reward-picker.component';

// path defined as '' because is already name in the general app.router
const routes: Routes = [
  { path: '', component: RewardPickerComponent }
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
