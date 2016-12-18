import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {AppRouterModule, routerComponents} from './app.router';
import {appComponent} from './app.component';

@NgModule({
  imports: [BrowserModule, AppRouterModule],
  declarations: [appComponent, routerComponents],
  bootstrap:    [appComponent]
})
export class AppModule {}