import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PaymentComponent } from './payment.component'
import {FormPaymentComponent} from './form-payment/form-payment.component';
import {ReviewPaymentComponent} from './review-payment/review-payment.component';

// path defined as '' because is already name in the general app.router
const routes: Routes = [
  { path: '', component: PaymentComponent, children: [
      {path: 'review', component: ReviewPaymentComponent},
      {path: 'form', component: FormPaymentComponent},
      { path: '', redirectTo: 'review' , pathMatch: 'full'},
      {path: '**', redirectTo: 'review'}
    ]},
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);

export const payComponents: any[] = [
  ReviewPaymentComponent,
  PaymentComponent
]