import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { JwtService } from '../../services/jwt/jwt.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss'],
})
export class LoginPageComponent implements OnInit, OnDestroy {
  public loginValid = true;
  public username = '';
  public password = '';

  constructor(private jwtService: JwtService, private router: Router, private httpClient: HttpClient) {}

  public ngOnInit(): void {
    if (this.jwtService.loggedIn) {
      this.router.navigateByUrl('/products');
      console.log('Logged in');
    }
  }

  public ngOnDestroy(): void { }

  public onSubmit(): void {
    this.jwtService.login(this.username, this.password);
  }
}