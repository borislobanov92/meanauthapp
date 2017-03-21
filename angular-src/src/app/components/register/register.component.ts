import { Component, OnInit } from '@angular/core';
import { ValidateService } from '../../services/validate.service';
import { AuthService } from '../../services/auth.service';
import { FlashMessagesService } from 'angular2-flash-messages';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  name: String;
  email: String;
  username: String;
  password: String;

  constructor(
    private validateService: ValidateService,
    private flashMessagesService: FlashMessagesService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
  }

  onRegisterSubmit() {
    const user = {
      name: this.name,
      username: this.username,
      email: this.email,
      password: this.password
    };

    const alertDanger = {cssClass: 'alert-danger', timeout: 3000};
    const alertSuccess = {cssClass: 'alert-danger', timeout: 3000};

    // Required Fields
    if (!this.validateService.validateRegister(user)) {
      this.flashMessagesService.show('Please fill in all fields', alertDanger);
      return false;
    }

    // Validate email
    if (!this.validateService.validateEmail(user.email)) {
      this.flashMessagesService.show('Please use a valid email', alertDanger);
      return false;
    }

    // Register User
    this.authService.registerUser(user).subscribe(data => {
      if (data.success) {
        this.flashMessagesService.show('You have successfully registered!', alertSuccess);
        this.router.navigate(['/login']);
      }
      else {
        this.flashMessagesService.show('Something went wrong', alertDanger);
        this.router.navigate(['/register']);
      }
    });
  }

}
