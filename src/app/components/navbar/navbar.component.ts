import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { JwtService } from 'src/app/services/jwt/jwt.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  constructor(private router: Router, private jwtService: JwtService) { }

  get isLogged(): boolean {
    return this.jwtService.loggedIn;
  }

  get loginLogoutLabel(): string {
    return this.isLogged ? 'Wyloguj' : 'Zaloguj';
  }

  ngOnInit(): void {
  }

  handleLogin() {
    if (this.isLogged) {
      this.logout();
      return;
    }
    this.router.navigateByUrl('/login');
  }

  private logout() {
    this.jwtService.logout();
    this.router.navigateByUrl('/login');
  }
}