import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth/auth.service';

@Component({
  selector: 'nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  signOut() {
    this.authService.signOut().then(() => {
      this.router.navigate(['/login']);
    });
  }

}
