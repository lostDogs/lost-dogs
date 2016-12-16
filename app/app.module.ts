import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {appComponent} from './app.component';

@NgModule({
  imports:      [BrowserModule],
  declarations: [appComponent],
  bootstrap:    [appComponent]
})
export class AppModule { }