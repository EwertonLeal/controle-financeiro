import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth/auth.service';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {
  matcher = new MyErrorStateMatcher();
  signUpForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService
  ) {  }

  ngOnInit(): void {
    this.signUpForm = this.fb.group({
      nameFormControl: ['', [Validators.required]],
      emailFormControl: ['', [Validators.required, Validators.email]],
      passwordFormControl: ['', [Validators.required]],
      confirmPasswordFormControl: ['', [Validators.required, this.matchPasswordValidator.bind(this)]]
    });
  }

  signUp() {
    if (this.signUpForm.valid) {
      const name: string = this.signUpForm.get('nameFormControl')?.value;
      const email: string = this.signUpForm.get('emailFormControl')?.value;
      const password: string = this.signUpForm.get('passwordFormControl')?.value;

      this.auth.signUp(name, email, password);
    }
  }

  private matchPasswordValidator(control: AbstractControl) {
    if (!this.signUpForm) {
      return null;
    }
    const password = this.signUpForm.get('passwordFormControl')?.value;
    const confirmPassword = control.value;
    return password === confirmPassword ? null : { mismatch: true };
  };
}
