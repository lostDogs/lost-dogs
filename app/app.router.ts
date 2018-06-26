import { NgModule } from '@angular/core';
import {ModuleWithProviders} from '@angular/core';
import {Routes, RouterModule, Router} from '@angular/router';
import {homeComponent} from './pages/home/home.component';
import {boardComponent} from './pages/board/board.component';
import {accountComponent} from './pages/create-account/account.component';
import {lostComponent} from './pages/lost/lost.component';
import {profileComponent} from './pages/profile/profile.component';
import {editAccountComponent} from './pages/profile/edit-account/edit-account.component';
import {mainProfileComponent} from './pages/profile/main-profile/main-profile.component';
import {selectionComponent} from './pages/selection/selection.component';
import {LoginComponent} from './pages/login/login.component';
import {InformationComponent} from './pages/information/information.component';
import {PaymentComponent} from './pages/payment/payment.component';
import {ReviewPaymentComponent} from './pages/payment/review-payment/review-payment.component';
import {FormPaymentComponent} from './pages/payment/form-payment/form-payment.component';
import {RefundComponent} from './pages/refund/refund.component';
import {DogAdsComponent} from './pages/dog-ads/dog-ads.component';


export const router: Routes = [
  { path:'home', component: homeComponent},
  {path: 'board', loadChildren: () => new Promise(resolve => {
      (require as any).ensure([], (require: any) => {
          resolve(require('./pages/board/board.module').BoardModule);
      })
    })
  },
  {path: 'account', component: accountComponent},
  {path: 'profile', component: profileComponent, 
    children: [
      { path:'edit', component: editAccountComponent},
      {path:'main', component: mainProfileComponent},
      { path: '', redirectTo: 'main' , pathMatch: 'full'},
      {path: '**', redirectTo: 'main'}
    ]
  },
{path: 'lost', loadChildren: () => new Promise(resolve => {
      (require as any).ensure([], (require: any) => {
          resolve(require('./pages/lost-found-common/lost-found.module').LostFoundModule);
      })
    })
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
      (require as any).ensure([], (require: any) => {
          resolve(require('./pages/reward-picker/reward-picker.module').rewardPickerModule);
      })
    })
  },
  {path: 'dog/:param', component: DogAdsComponent},
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
  editAccountComponent,
  mainProfileComponent,
  InformationComponent,
  PaymentComponent,
  ReviewPaymentComponent,
  FormPaymentComponent,
  RefundComponent,
  DogAdsComponent
];