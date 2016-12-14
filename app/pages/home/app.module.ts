import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {HelloworldComponent} from './app.component';

@NgModule({
  imports:      [BrowserModule],
  declarations: [HelloworldComponent],
  bootstrap:    [HelloworldComponent]
})
export class AppModule { }