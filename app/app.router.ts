import { NgModule } from '@angular/core';
import {ModuleWithProviders} from '@angular/core';
import {Routes, RouterModule,} from '@angular/router';
import {homeComponent} from './pages/home/home.component';
import {boardComponent} from './pages/board/board.component';
import {accountComponent} from './pages/create-account/account.component';
import {lostComponent} from './pages/lost/lost.component';
import {profileComponent} from './pages/profile/profile.component';
import {editAccountComponent} from './pages/profile/edit-account/edit-account.component';
import {mainProfileComponent} from './pages/profile/main-profile/main-profile.component';
import {selectionComponent} from './pages/selection/selection.component';
import {LoginComponent} from './pages/login/login.component';
import {DateComponent} from './pages/lost-found-common/date/date.component';
import {LocationComponent} from './pages/lost-found-common/location/location.component';
import {BreedComponent} from './pages/lost-found-common/breed/breed.component';
import {GenderComponent} from './pages/lost-found-common/gender/gender.component';
import {SizeComponent} from './pages/lost-found-common/size/size.component';
import {ColorComponent} from './pages/lost-found-common/color/color.component';
import {ExtrasComponent} from './pages/lost-found-common/extras/extras.component';
import {DetailsComponent} from './pages/lost-found-common/pic-details/pic-details.component';
import {ReviewComponent} from './pages/lost-found-common/review/review.component';
import {InformationComponent} from './pages/information/information.component';
import {PaymentComponent} from './pages/payment/payment.component';
import {ReviewPaymentComponent} from './pages/payment/review-payment/review-payment.component';
import {FormPaymentComponent} from './pages/payment/form-payment/form-payment.component';
import {PatternComponent} from './pages/lost-found-common/pattern/pattern.component';
import {RefundComponent} from './pages/refund/refund.component';
// import {RewardPickerComponent} from './pages/reward-picker/reward-picker.component';

const self = this;
self.pathBuild = (pathName: string): any => {
  const pathObj = {path: pathName, component: lostComponent,
    children: [
      { path:'date', component: DateComponent},
      {path: 'location', component: LocationComponent},
      {path: 'breed', component: BreedComponent},
      {path: 'gender', component: GenderComponent},
      {path: 'size', component: SizeComponent},
      {path: 'color', component: ColorComponent},
      {path: 'pattern', component: PatternComponent},
      {path: 'extras', component: ExtrasComponent},
      {path: 'details', component: DetailsComponent},
      {path: 'review', component: ReviewComponent},
      { path: '', redirectTo: 'date' , pathMatch: 'full'},
      {path: '**', redirectTo: 'date'}
    ]};
    return pathObj;
};

export const router: Routes = [
  { path:'home', component: homeComponent},
  {path: 'board', component: boardComponent},
  {path: 'account', component: accountComponent},
  self.pathBuild('lost'),
  self.pathBuild('found'),
  {path: 'profile', component: profileComponent, 
    children: [
      { path:'edit', component: editAccountComponent},
      {path:'main', component: mainProfileComponent},
      { path: '', redirectTo: 'main' , pathMatch: 'full'},
      {path: '**', redirectTo: 'main'}
    ]
  },
  {path: 'selection', component: selectionComponent},
  {path: 'login', component: LoginComponent},
  {path: 'payment', component: PaymentComponent,
    children: [
      {path: 'review', component: ReviewPaymentComponent},
      {path: 'form', component: FormPaymentComponent},
      { path: '', redirectTo: 'review' , pathMatch: 'full'},
      {path: '**', redirectTo: 'review'}
    ]
  },
  {path: 'reward', loadChildren: () => new Promise(resolve => {
      (require as any).ensure([], require => {
          resolve(require('./pages/reward-picker/reward-picker.module').rewardPickerModule);
      })
    })
  },
  {path: 'info/:param', component: InformationComponent},
  {path: 'refund/:param', component: RefundComponent},
  { path: '', redirectTo: 'home' , pathMatch: 'full'},
  {path: '**', redirectTo: 'home'}
];

// TODO: check why routing is not working without the hash.
// TODO: read full file https://angular.io/docs/ts/latest/guide/router.html.
@NgModule({
  imports: [RouterModule.forRoot(router, { useHash: true})],
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
  BreedComponent,
  GenderComponent,
  SizeComponent,
  ColorComponent,
  ExtrasComponent,
  DetailsComponent,
  ReviewComponent,
  editAccountComponent,
  mainProfileComponent,
  InformationComponent,
  PaymentComponent,
  ReviewPaymentComponent,
  FormPaymentComponent,
  PatternComponent, 
  RefundComponent
];