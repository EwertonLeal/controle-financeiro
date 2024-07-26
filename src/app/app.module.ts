import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { FooterComponentComponent } from './shared/footer-component/footer-component.component';
import { AppRoutingModule } from './app.routing';
import { NavBarComponent } from './shared/nav-bar/nav-bar.component';
import { AngularFireModule  } from '@angular/fire/compat'
import { AngularFireAuthModule  } from '@angular/fire/compat/auth'
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';

@NgModule({
  declarations: [
    AppComponent,
    FooterComponentComponent,
    NavBarComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    RouterModule,
    AppRoutingModule,
    AngularFireModule.initializeApp({
      apiKey: "AIzaSyD7I09SlmoMR41qvrQy6gBeXsJluxx4dxE",
      authDomain: "controle-financeiro-bb9e8.firebaseapp.com",
      projectId: "controle-financeiro-bb9e8",
      storageBucket: "controle-financeiro-bb9e8.appspot.com",
      messagingSenderId: "669706487449",
      appId: "1:669706487449:web:f7a5c654f495415717da08",
      measurementId: "G-DJ0Y8CKQKM"
    }),
    AngularFireAuthModule,
    AngularFireDatabaseModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
