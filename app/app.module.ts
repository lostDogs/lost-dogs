import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {AppRouterModule, routerComponents} from './app.router';
import {appComponent} from './app.component';
import {HttpModule} from '@angular/http';
import  {generalHeaderComponent} from './common/components/header/general-header.component';
import {generalFooterComponent} from './common/components/footer/general-footer.component';
import {ScrollService} from './common/services/scroll.service';
import {ValidationService} from './common/services/validation.service';
import { FormsModule }  from '@angular/forms';
import {ApiService} from './common/services/api.service';

@NgModule({
  imports: [BrowserModule, AppRouterModule, FormsModule, HttpModule],
  declarations: [appComponent, routerComponents, generalHeaderComponent, generalFooterComponent],
  providers: [{ provide: ScrollService, useClass: ScrollService }, { provide: ValidationService, useClass: ValidationService }, {provide: ApiService,useClass: ApiService}],
  bootstrap: [appComponent, ]
})
export class AppModule {}