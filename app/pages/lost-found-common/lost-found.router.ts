import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {lostComponent} from '../lost/lost.component';
import {DateComponent} from './date/date.component';
import {LocationComponent} from './location/location.component';
import {BreedComponent} from './breed/breed.component';
import {GenderComponent} from './gender/gender.component';
import {SizeComponent} from './size/size.component';
import {ColorComponent} from './color/color.component';
import {ExtrasComponent} from './extras/extras.component';
import {DetailsComponent} from './pic-details/pic-details.component';
import {ReviewComponent} from './review/review.component';
import {PatternComponent} from './pattern/pattern.component';
import {CompleteUserComponent} from './complete-user/complete-user.component';

const children = [
      { path:'date', component: DateComponent},
      {path: 'location', component: LocationComponent},
      {path: 'breed', component: BreedComponent},
      {path: 'gender', component: GenderComponent},
      {path: 'size', component: SizeComponent},
      {path: 'color', component: ColorComponent},
      {path: 'pattern', component: PatternComponent},
      {path: 'extras', component: ExtrasComponent},
      {path: 'details', component: DetailsComponent},
      {path: 'complete', component: CompleteUserComponent},
      {path: 'review', component: ReviewComponent},
      { path: '', redirectTo: 'date' , pathMatch: 'full'},
      {path: '**', redirectTo: 'date'}
    ];

// path defined as '' because is already name in the general app.router
const routes: Routes = [
  { path: '', component: lostComponent, children: children },
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);

export const routerComps = [
  lostComponent,
  DateComponent,
  LocationComponent,
  BreedComponent,
  GenderComponent,
  SizeComponent,
  ColorComponent,
  ExtrasComponent,
  DetailsComponent,
  ReviewComponent,
  CompleteUserComponent,
  PatternComponent
];
