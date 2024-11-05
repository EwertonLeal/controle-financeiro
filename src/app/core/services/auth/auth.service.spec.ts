import { fakeAsync, TestBed, tick } from '@angular/core/testing';

import { AuthService } from './auth.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { MaterialModule } from 'src/app/shared/material/material.module';
import { RouterTestingModule } from '@angular/router/testing';
import { LoginComponent } from 'src/app/pages/login/login.component';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

class MockAngularFireAuth {
  signInWithEmailAndPassword(email: string, password: string) {
    return Promise.resolve({
      user: {
        uid: '12345',
        providerData: [{
          displayName: 'Test User',
          email: email,
          phoneNumber: null,
          photoURL: null
        }]
      }
    });
  }

  createUserWithEmailAndPassword(email: string, password: string) {
    return Promise.resolve({
      user: {
        uid: '12345',
        updateProfile: jasmine.createSpy('updateProfile'),
      }
    });
  }

  signOut = jasmine.createSpy('signOut').and.returnValue(Promise.resolve());
}

describe('AuthService', () => {
  let service: AuthService;
  let mockAngularFireAuth: MockAngularFireAuth;
  let mockOpenSnackBar: jasmine.SpyObj<MatSnackBar>;
  let router: Router;

  beforeEach(() => {
    mockAngularFireAuth = new MockAngularFireAuth();
    mockOpenSnackBar = jasmine.createSpyObj('MatSnackBar', ['open']);

    TestBed.configureTestingModule({
      imports: [
        MaterialModule,
        RouterTestingModule.withRoutes([
          { path: 'login', component: LoginComponent }
        ]),
        NoopAnimationsModule
      ],
      providers: [
        AuthService,
        { provide: AngularFireAuth, useValue: mockAngularFireAuth },
        { provide: MatSnackBar, useValue: mockOpenSnackBar }
      ]
    });
    service = TestBed.inject(AuthService);
    router = TestBed.inject(Router);

    spyOn(sessionStorage, 'setItem');
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('Should sign in and save user data', fakeAsync(() => {
    const email = "teste@teste.com";
    const password = "123456";
    const expectedUser = {
      id: '12345',
      displayName: 'Test User',
      email: email,
      phoneNumber: null,
      photoUrl: null,
    };

    service.signIn(email, password);
    tick();

    expect(sessionStorage.setItem).toHaveBeenCalledWith('user', JSON.stringify(expectedUser));
  }));

  it('should sign up a user and navigate to login', fakeAsync(() => {
    const nome = "Test User";
    const email = "teste@teste.com";
    const password = "123456";
    const navigateSpy = spyOn(router, 'navigate');

    service.signUp(nome, email, password);
    tick(2000);

    expect(mockOpenSnackBar.open).toHaveBeenCalledWith('usuário cadastrado com sucesso!', 'fechar', { 
      duration: 2000, 
      verticalPosition: 'top',
      panelClass: ['success-snackbar']
    });
    expect(navigateSpy).toHaveBeenCalledWith(['/login']);
  }));

  it('should handle sign up error', fakeAsync(() => {
    const nome = "Test User";
    const email = "teste@teste.com";
    const password = "123456";
    const errorResponse = { message: 'Error message' };

    spyOn(mockAngularFireAuth, 'createUserWithEmailAndPassword').and.returnValue(Promise.reject(errorResponse));

    service.signUp(nome, email, password);
    tick();

    expect(mockOpenSnackBar.open).toHaveBeenCalledWith('Ocorreu um erro. Tente novamente mais tarde.', 'fechar', { 
      duration: 3000, 
      verticalPosition: 'top',
      panelClass: ['danger-snackbar']
    });

  }));

  it(`Should remove user from session storage when signOut method is called`, fakeAsync(() => {
    spyOn(sessionStorage, 'removeItem');
    
    service.signOut();
    tick();

    expect(sessionStorage.removeItem).toHaveBeenCalledWith('user');
  }));

  it(`Should set the value of user behaviorSubject to null when signOut method is called`, fakeAsync(() => {
    service.signOut();

    tick();

    expect(service.user.value).toBeNull();
  }));

  it(`Should call the auth.signOut methon when signOut method is called in AuthService`, fakeAsync(() => {
    service.signOut();

    tick();

    expect(mockAngularFireAuth.signOut).toHaveBeenCalled();
  }));

});
