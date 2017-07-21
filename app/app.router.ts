import { NgModule } from '@angular/core';
import {ModuleWithProviders} from '@angular/core';
import {Routes, RouterModule,} from '@angular/router';
import {homeComponent} from './pages/home/home.component';
import {boardComponent} from './pages/board/board.component';
import {accountComponent} from './pages/create-account/account.component';
import {lostformComponent} from './pages/lostfoundform/lostfound.component';
import {profileComponent} from './pages/profile/profile.component';
import {selectionComponent} from './pages/selection/selection.component';

export const router: Routes = [
{ path: '', redirectTo: 'home' , pathMatch: 'full'},
{ path:'home', component: homeComponent},
{path: 'board', component: boardComponent},
{path: 'account', component: accountComponent},
{path: 'lostfound', component: lostformComponent},
{path: 'profile', component: profileComponent },
{path: 'selection', component: selectionComponent}
];
// TODO: check why routing is not working without the hash.
// TODO: read full file https://angular.io/docs/ts/latest/guide/router.html.
@NgModule({
  imports: [RouterModule.forRoot(router, { useHash: true })],
  exports: [RouterModule]
})
export class AppRouterModule{}

export const routerComponents = [
  homeComponent,
  boardComponent,
  accountComponent,
  lostformComponent,
  profileComponent,
  selectionComponent
];