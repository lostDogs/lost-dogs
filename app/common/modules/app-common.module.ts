import {NgModule} from '@angular/core';
import {HttpModule} from '@angular/http';
import {FormsModule} from '@angular/forms';

@NgModule({
  exports: [HttpModule, FormsModule]
})
export class AppCommonModule {}