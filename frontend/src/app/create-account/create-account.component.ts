import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-create-account',
  templateUrl: './create-account.component.html',
  styleUrls: ['./create-account.component.scss']
})
export class CreateAccountComponent {
  createUserForm: FormGroup;
  errorMessage!: string; // Add definite assignment assertion (!)

  constructor(
    private authService: AuthService,
    private router: Router,
    private formBuilder: FormBuilder
  ) {
    this.createUserForm = this.formBuilder.group({
      name: ['', Validators.required],
      surname: ['', Validators.required],
      profilePhoto: ['', Validators.required],
      emailAddress: ['', [Validators.required, Validators.email]],
      roles: ['', Validators.required],
      groups: ['', Validators.required]
    });
  }

  async onSubmit() {
    console.log('Form submitted!');
    console.log('Form value:', this.createUserForm.value);

    if (!this.createUserForm.valid) {
      console.log('Form is not valid');
      return;
    }

    const formData = this.createUserForm.value;

    try {
      console.log('Creating user:', formData);
      const response: any = await this.authService.createUser(formData).toPromise();
      console.log('User created successfully');

      if (response && response.message === 'User created successfully') {
        // User creation was successful
        this.router.navigate(['/success-page']);
      } else {
        // Handle other response scenarios, such as conflicts or server errors
        console.error('Error creating user:', response);
        this.errorMessage = 'Error creating user. Please try again.';
      }
    } catch (error) {
      console.error('Error creating user:', error);
      this.errorMessage = 'Error creating user. Please try again.';
    }
  }

  navigateToCreateAccount() {
    this.router.navigate(['/create-account']);
  }
}
