import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';

import { SignUpComponent } from './sign-up.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/shared/material/material.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { RouterTestingModule } from '@angular/router/testing';
import { LoginComponent } from '../login/login.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';
import { MatError } from '@angular/material/form-field';
import { Router } from '@angular/router';

describe('#SignUpComponent Testing methods', () => {
  let component: SignUpComponent;
  let fixture: ComponentFixture<SignUpComponent>;
  let mockAuthSvc: jasmine.SpyObj<AuthService>;
  let router: Router;

  beforeEach(() => {
    mockAuthSvc = jasmine.createSpyObj(['signUp']);

    TestBed.configureTestingModule({
      declarations: [SignUpComponent],
      imports: [
        RouterTestingModule.withRoutes([
          { path: 'login', component: LoginComponent  }
        ]),
        MaterialModule,
        SharedModule,
        ReactiveFormsModule,
        NoopAnimationsModule
      ],
      providers: [
        FormBuilder,
        { provide: AuthService, useValue: mockAuthSvc }
      ]
    });
    fixture = TestBed.createComponent(SignUpComponent);
    router = TestBed.inject(Router)
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('Should call a signUp method when the form is valid', () => {
    mockAuthSvc.signUp.and.returnValue(Promise.resolve());

    const name = "teste";
    const email = "teste@teste.com";
    const password = "123456";

    component.signUpForm.get('nameFormControl')?.setValue(name);
    component.signUpForm.get('emailFormControl')?.setValue(email);
    component.signUpForm.get('passwordFormControl')?.setValue(password);
    component.signUpForm.get('confirmPasswordFormControl')?.setValue(password);

    component.signUp();

    expect(mockAuthSvc.signUp).toHaveBeenCalledWith(name, email, password);
  });

  it('should return null when passwords match', () => {
    component.signUpForm.controls['nameFormControl'].setValue('teste');
    component.signUpForm.controls['emailFormControl'].setValue('teste@teste.com');
    component.signUpForm.controls['passwordFormControl'].setValue('123456');
    component.signUpForm.controls['confirmPasswordFormControl'].setValue('123456');

    expect(component.signUpForm.valid).toBeTrue();
    expect(component.signUpForm.controls['confirmPasswordFormControl'].errors).toBeNull();
  });

  it('should return an error object when passwords do not match', () => {
    component.signUpForm.controls['nameFormControl'].setValue('teste');
    component.signUpForm.controls['emailFormControl'].setValue('teste@teste.com');
    component.signUpForm.controls['passwordFormControl'].setValue('123456');
    component.signUpForm.controls['confirmPasswordFormControl'].setValue('abcdef');

    expect(component.signUpForm.valid).toBeFalse();
    expect(component.signUpForm.controls['confirmPasswordFormControl'].errors).toEqual({ mismatch: true });
  });

  describe('#SignUpComponent Testing rendered elements', () => {
    it('should create a component', () => {
      expect(component).toBeTruthy();
    });

    it('Should render the name input', () => {
      const nameInput = fixture.debugElement.query(By.css('input[formControlName="nameFormControl"]'));

      expect(nameInput).toBeTruthy();
    });

    it('Should show "Campo obrigatório" error when name input is visited and blank', () => {
      const nameInput = component.signUpForm.get('nameFormControl');
      nameInput?.markAsTouched();
      fixture.detectChanges();

      const errorElement = fixture.debugElement.query(By.directive(MatError));
      expect(errorElement.nativeElement.textContent).toContain('Campo obrigatório');
    });

    it('Should render the email input', () => {
      const emailInput = fixture.debugElement.query(By.css('input[formControlName="emailFormControl"]'));

      expect(emailInput).toBeTruthy();
    });

    it('should show "Campo obrigatório" error when email input is visited and blank', () => {
      const emailInput = component.signUpForm.get('emailFormControl');
      emailInput?.markAsTouched();
      fixture.detectChanges();
  
      const errorElement = fixture.debugElement.query(By.directive(MatError));
      expect(errorElement.nativeElement.textContent).toContain('Email é obrigatorio');
    });

    it('Should show error "Digite um e-mail válido" when the email has been invalid', () => {
      const emailCtrl = component.signUpForm.get("emailFormControl");
      emailCtrl?.setValue("email inválido!");
      emailCtrl?.markAsTouched();
      fixture.detectChanges();
  
      const errorElement = fixture.debugElement.query(By.directive(MatError));
      expect(errorElement.nativeElement.textContent).toContain('Digite um e-mail válido');
    });

    it('Should render the password input', () => {
      const passwordInput = fixture.debugElement.query(By.css('input[formControlName="passwordFormControl"]'));

      expect(passwordInput).toBeTruthy();
    });

    it('should show "Campo obrigatório" error when password input is visited and blank', () => {
      const passwordInput = component.signUpForm.get('passwordFormControl');
      passwordInput?.markAsTouched();
      fixture.detectChanges();
  
      const errorElement = fixture.debugElement.query(By.directive(MatError));
      expect(errorElement.nativeElement.textContent).toContain('Campo obrigatório');
    });

    it('Should render the confirmPassword input', () => {
      const confirmPasswordInput = fixture.debugElement.query(By.css('input[formControlName="confirmPasswordFormControl"]'));

      expect(confirmPasswordInput).toBeTruthy();
    });
  
    it('should show "Campo obrigatório" error when confirmPassword input is visited and blank', () => {
      const confirmPasswordInput = component.signUpForm.get('confirmPasswordFormControl');
      confirmPasswordInput?.markAsTouched();
      fixture.detectChanges();
  
      const errorElement = fixture.debugElement.query(By.directive(MatError));
      expect(errorElement.nativeElement.textContent).toContain('Campo obrigatório');
    });

    it('should show "As senhas não conferem" error when confirmPassword value and Password value is not equal', () => {
      const passwordInput = component.signUpForm.get('passwordFormControl');
      const confirmPasswordInput = component.signUpForm.get('confirmPasswordFormControl');

      passwordInput?.setValue('123456');
      passwordInput?.markAsTouched();

      confirmPasswordInput?.setValue('1234567');
      confirmPasswordInput?.markAsTouched();

      fixture.detectChanges();
  
      const errorElement = fixture.debugElement.query(By.directive(MatError));
      expect(errorElement.nativeElement.textContent).toContain('As senhas não conferem');
    });

    it("Should render de login button", () => {
      const button = fixture.debugElement.query(By.css('button'))
      expect(button).toBeTruthy();
    });
  
    it("Should disable button when signUpForm is invalid", () => {
      const button = fixture.debugElement.query(By.css('button'));
      expect(button.nativeElement.disabled).toBeTrue();
    });
  
    it("Should enable button when signUpForm is valid", () => {
      component.signUpForm.get('nameFormControl')?.setValue('teste');
      component.signUpForm.get('emailFormControl')?.setValue('teste@teste.com');
      component.signUpForm.get('passwordFormControl')?.setValue('123456');
      component.signUpForm.get('confirmPasswordFormControl')?.setValue('123456');
      const button = fixture.debugElement.query(By.css('button'));

      fixture.detectChanges();
  
      expect(button.nativeElement.disabled).toBeFalse();
    });

    it("Should call's signUpForm methon when signUpForm is valid and the button is clicked", () => {
      component.signUpForm.get('nameFormControl')?.setValue('teste');
      component.signUpForm.get('emailFormControl')?.setValue('teste@teste.com');
      component.signUpForm.get('passwordFormControl')?.setValue('123456');
      component.signUpForm.get('confirmPasswordFormControl')?.setValue('123456');
      const button = fixture.debugElement.query(By.css('button'));
      spyOn(component, 'signUp');

      fixture.detectChanges();

      button.nativeElement.click();
  
      expect(component.signUp).toHaveBeenCalled();
    });

    it('Should render the anchor point whith text "Faça login"', () => {
      const anchorPoint = fixture.debugElement.query(By.css('a[routerLink="/login"]'));
      expect(anchorPoint).toBeTruthy();
      expect(anchorPoint.nativeElement.textContent).toEqual("Faça login");
    });

    it('Should navigate to /login when the anchor point "Faça login" is clicked', fakeAsync(() => {
      const anchorPoint = fixture.debugElement.query(By.css('a[routerLink="/login"]'));
  
      anchorPoint.nativeElement.click();
      tick();
  
      expect(router.url).toBe('/login');
    }));

  });
});
