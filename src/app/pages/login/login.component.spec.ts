import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';

import { LoginComponent } from './login.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthService } from 'src/app/core/services/auth/auth.service';

import { MaterialModule } from 'src/app/shared/material/material.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { CommonModule } from '@angular/common';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';
import { MatError } from '@angular/material/form-field';
import { Router } from '@angular/router';
import { HomeComponent } from '../home/home.component';
import { SignUpComponent } from '../sign-up/sign-up.component';


describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let mockAuthSvc: jasmine.SpyObj<AuthService>;
  let router: Router;


  beforeEach(() => {
    mockAuthSvc = jasmine.createSpyObj(['signIn']);

    TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [
        RouterTestingModule.withRoutes([
          {path: 'home', component: HomeComponent},
          {path: 'cadastro', component: SignUpComponent},
        ]),
        CommonModule,
        MaterialModule,
        SharedModule,
        ReactiveFormsModule,
        NoopAnimationsModule
      ],
      providers: [
        FormBuilder,
        { provide: AuthService, useValue: mockAuthSvc },
      ]
    });

    fixture = TestBed.createComponent(LoginComponent);
    router = TestBed.inject(Router);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should calls authService.signIn when loginForm is valid', () => {
    mockAuthSvc.signIn.and.returnValue(Promise.resolve());
    const email ='email@teste.com';
    const password = '123456'

    component.loginForm.controls['emailFormControl'].setValue(email);
    component.loginForm.controls['passwordFormControl'].setValue(password);

    component.login();

    expect(mockAuthSvc.signIn).toHaveBeenCalledWith(email, password);
  });

  it('should navigate to /home when authService.signIn has been resolved', fakeAsync(() => {
    mockAuthSvc.signIn.and.returnValue(Promise.resolve());
    const navigateSpy = spyOn(router, 'navigate');


    component.loginForm.controls['emailFormControl'].setValue('email@teste.com');
    component.loginForm.controls['passwordFormControl'].setValue('123456');

    component.login();

    tick();

    expect(navigateSpy).toHaveBeenCalledWith(['/home']);
  }));
  
  it('Should render the email input', () => {
    const emailInput = fixture.debugElement.query(By.css('input[formControlName="emailFormControl"]')).nativeElement;
    expect(emailInput).toBeTruthy();
  });

  it('Should show error "Digite um e-mail válido" when the email has been invalid', async () => {
    const emailCtrl = component.loginForm.get("emailFormControl");
    emailCtrl?.setValue("email inválido!");
    emailCtrl?.markAsTouched();
    fixture.detectChanges();

    const errorElement = fixture.debugElement.query(By.directive(MatError));
    expect(errorElement.nativeElement.textContent).toContain('Digite um e-mail válido');
  });

  it('Should show error "Email é obrigatorio" when the email field has been touched and not filled', async () => {
    const emailCtrl = component.loginForm.get("emailFormControl");
    emailCtrl?.markAsTouched();
    fixture.detectChanges();

    const errorElement = fixture.debugElement.query(By.directive(MatError));
    expect(errorElement.nativeElement.textContent).toContain('Email é obrigatorio');
  });

  it('Should not show error message when the email input is valid', () => {
    const emailControl = component.loginForm.get('emailFormControl');
    emailControl?.setValue('teste@example.com');
    emailControl?.markAsTouched();
    fixture.detectChanges();

    const errorElement = fixture.debugElement.query(By.css('mat-error'));
    expect(errorElement).toBeNull();
  });

  it('Should render the password input', () => {
    const passwordInput = fixture.debugElement.query(By.css('input[formControlName="passwordFormControl"]')).nativeElement;
    expect(passwordInput).toBeTruthy();
  });

  it('Should not show error message when the password input is valid', () => {
    const emailControl = component.loginForm.get('passwordFormControl');
    emailControl?.setValue('123456');
    emailControl?.markAsTouched();
    fixture.detectChanges();

    const errorElement = fixture.debugElement.query(By.css('mat-error'));
    expect(errorElement).toBeNull();
  });

  it('Should show error "Senha é obrigatorio" when the password field has been touched and not filled', async () => {
    const emailCtrl = component.loginForm.get("passwordFormControl");
    emailCtrl?.markAsTouched();
    fixture.detectChanges();

    const errorElement = fixture.debugElement.query(By.directive(MatError));
    expect(errorElement.nativeElement.textContent).toContain('Senha é obrigatorio');
  });

  it("Should render de login button", () => {
    const button = fixture.debugElement.query(By.css('button'))
    expect(button).toBeTruthy();
  });

  it("Should disable button when login and password is invalid", () => {
    const button = fixture.debugElement.query(By.css('button'));
    expect(button.nativeElement.disabled).toBeTrue();
  });

  it("Should enable button when login and password is valid", () => {
    const emailInput = component.loginForm.get('emailFormControl');
    const passwordInput = component.loginForm.get('passwordFormControl');
    const button = fixture.debugElement.query(By.css('button'));

    emailInput?.setValue("teste@teste.com");
    emailInput?.markAsTouched();

    passwordInput?.setValue("123456");
    passwordInput?.markAsTouched();
    fixture.detectChanges();

    expect(button.nativeElement.disabled).toBeFalse();
  });

  it("Should call the login method when button is valid and clicked", () => {
    const emailInput = component.loginForm.get('emailFormControl');
    const passwordInput = component.loginForm.get('passwordFormControl');
    const button = fixture.debugElement.query(By.css('button'));
    spyOn(component, 'login');  // Espiona o método `enviar`


    emailInput?.setValue("teste@teste.com");
    emailInput?.markAsTouched();

    passwordInput?.setValue("123456");
    passwordInput?.markAsTouched();
    fixture.detectChanges();

    button.nativeElement.click();
    expect(component.login).toHaveBeenCalled();
  });

  it('Should render the anchor point whith text "Cadastre-se"', () => {
    const anchorPoint = fixture.debugElement.query(By.css('a[routerLink="/cadastro"]'));
    expect(anchorPoint).toBeTruthy();
    expect(anchorPoint.nativeElement.textContent).toEqual("Cadastre-se");
  })

  it('Should navigate to /cadastro when the anchor point "Cadastre-se" is clicked', fakeAsync(() => {
    const anchorPoint = fixture.debugElement.query(By.css('a[routerLink="/cadastro"]'));

    anchorPoint.nativeElement.click();
    tick();

    expect(router.url).toBe('/cadastro');
  }));
});
