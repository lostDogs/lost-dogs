import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { boardComponent } from './board.component';

// path defined as '' because is already name in the general app.router
const routes: Routes = [
  { path: '', component: boardComponent },
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
