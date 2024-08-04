import { inject } from "@angular/core";
import { AuthService } from "../services/auth/auth.service";
import { Router } from "@angular/router";

export const signUpSignInGuard = () => {
    const authService = inject(AuthService);
    const router = inject(Router);    

    if(authService.user.value){
        router.navigate(['/home']);
        return false;
    }
    
    return true;

};