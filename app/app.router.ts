import { NgModule } from '@angular/core';
import {ModuleWithProviders} from '@angular/core';
import {Routes, RouterModule,} from '@angular/router';
import {homeComponent} from './pages/home/home.component';
import {boardComponent} from './pages/board/board.component';
import {accountComponent} from './pages/create-account/account.component';
import {lostComponent} from './pages/lost/lost.component';
import {profileComponent} from './pages/profile/profile.component';
import {selectionComponent} from './pages/selection/selection.component';
import {LoginComponent} from './pages/login/login.component';
import {DateComponent} from './pages/lost-found-common/date/date.component';
import {LocationComponent} from './pages/lost-found-common/location/location.component';
import {BreedComponent} from './pages/lost-found-common/breed/breed.component';

export const router: Routes = [
{ path:'home', component: homeComponent},
{path: 'board', component: boardComponent},
{path: 'account', component: accountComponent},
{path: 'lost', component: lostComponent, 
  children: [
   { path:'date', component: DateComponent},
   {path: 'location', component: LocationComponent},
   {path: 'breed', component: BreedComponent},
   { path: '', redirectTo: 'date' , pathMatch: 'full'},
   {path: '**', redirectTo: 'date'}
]},
{path: 'profile', component: profileComponent},
{path: 'selection', component: selectionComponent},
{path: 'login', component: LoginComponent},
{ path: '', redirectTo: 'home' , pathMatch: 'full'},
{path: '**', redirectTo: 'home'}
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
  lostComponent,
  profileComponent,
  selectionComponent,
  LoginComponent,
  DateComponent,
  LocationComponent,
  BreedComponent
];