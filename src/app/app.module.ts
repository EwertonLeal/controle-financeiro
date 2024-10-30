import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { FooterComponentComponent } from './shared/footer-component/footer-component.component';
import { AppRoutingModule } from './app.routing';
import { environment } from 'src/environments/environment';

import { AngularFireModule } from '@angular/fire/compat';
import { AngularFirestoreModule, SETTINGS } from '@angular/fire/compat/firestore';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
import { MaterialModule } from './shared/material/material.module';
import { StoreModule } from '@ngrx/store';
import { monthYearReducer } from './state/month-year/month-year.reducer';

@NgModule({
  declarations: [
    AppComponent,
    FooterComponentComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    RouterModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule,
    AngularFireAuthModule,
    AngularFireDatabaseModule,
    MaterialModule,
    StoreModule.forRoot({ monthYear: monthYearReducer }),
  ],
  providers: [
    { provide: SETTINGS, useValue: { persistence: false } }
  ],
  bootstrap: [
    AppComponent]
})
export class AppModule { }
