import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';

import { AppComponent } from './app.component';
import { Values } from 'projects/ngx-value/src';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: () => () => Values('assets/properties.json', 'assets/websites.json', 'assets/authors.json'),
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
