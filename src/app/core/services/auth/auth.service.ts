import { Injectable } from '@angular/core';
import {  AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { IUser } from 'src/app/shared/models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public user: BehaviorSubject<IUser | null> = new BehaviorSubject<IUser | null>(null);

  constructor(
    private auth: AngularFireAuth, 
    private db: AngularFireDatabase,
    private router: Router,
    private _snackBar: MatSnackBar
  ) {
    const user = sessionStorage.getItem('user');

     if(user) {
      this.user.next(JSON.parse(user));
     }
  }

  signIn(email: string, password: string) {
    return this.auth.signInWithEmailAndPassword(email, password).then(credential => {
      const user: IUser = {
        id: String(credential.user?.uid),
        displayName: String(credential.user?.providerData[0]?.displayName),
        email: String(credential.user?.providerData[0]?.email),
        phoneNumber: String(credential.user?.providerData[0]?.phoneNumber),
        photoUrl: String(credential.user?.providerData[0]?.photoURL),
      };
    
      sessionStorage.setItem('user', JSON.stringify(user));
      this.user.next(user);
    }, error => {
      this.openSnackBar(this.getErrorMessage(error), 'fechar', 3000, 'danger-snackbar')
    });

  }
  
  signUp(nome: string, email: string, password: string) {
    return this.auth.createUserWithEmailAndPassword(email, password).then(res => {

      res.user?.updateProfile({
        displayName: nome
      });
      
      const durantion = 2000;
      this.openSnackBar('usuário cadastrado com sucesso!', 'fechar', durantion, 'success-snackbar')
      setTimeout(() => {
        this.router.navigate(['/login']);
      }, durantion);

    }, error => {
      this.openSnackBar(this.getErrorMessage(error), 'fechar', 3000, 'danger-snackbar')
    });
  }

  signOut() {
    sessionStorage.removeItem('user');
    this.user.next(null);
    return this.auth.signOut();
  }

  private getErrorMessage(error: any): string {
    switch (error.code) {
      case 'auth/email-already-in-use':
        return 'O endereço de email já está em uso por outra conta.';
      case 'auth/invalid-email':
        return 'O endereço de email não é válido.';
      case 'auth/operation-not-allowed':
        return 'Operação não permitida. Entre em contato com o suporte.';
      case 'auth/weak-password':
        return 'A senha é muito fraca. Ela deve conter no minimo 6 caracteres';
      case 'auth/invalid-login-credentials':
          return 'login ou senha invalidos';
      default:
        return 'Ocorreu um erro. Tente novamente mais tarde.';
    }
  }

  openSnackBar(message: string, action: string, duration: number, panelType: string) {
    this._snackBar.open(message, action, {
      duration: duration,
      verticalPosition: 'top',
      panelClass: [panelType]
    });
  }

}
