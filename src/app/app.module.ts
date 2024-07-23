import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { FooterComponentComponent } from './shared/footer-component/footer-component.component';

@NgModule({
  declarations: [
    AppComponent,
    FooterComponentComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    RouterModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
