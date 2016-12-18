import { NgModule } from '@angular/core';
import {ModuleWithProviders} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {homeComponent} from './pages/home/home.component';
import {boardComponent} from './pages/board/board.component';

export const router: Routes = [
{ path: '', redirectTo: 'home' , pathMatch: 'full'},
{ path:'home', component: homeComponent},
{path: 'board', component: boardComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(router)],
  exports: [RouterModule]
})
export class AppRouterModule{}

export const routerComponents = [homeComponent, boardComponent];