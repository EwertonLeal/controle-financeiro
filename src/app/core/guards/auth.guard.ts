import { inject } from "@angular/core";
import { AuthService } from "../services/auth/auth.service";
import { Router } from "@angular/router";

export const authGuard = () => {
    const authService = inject(AuthService);
    const router = inject(Router);

    if(authService.user.value){
        return true;
    }

    router.navigate(['/login']);
    return false;

};