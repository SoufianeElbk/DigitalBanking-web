import { Component } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {CustomerService} from '../services/customer.service';
import {NgIf} from '@angular/common';
import {Router} from '@angular/router';

@Component({
  selector: 'app-new-customer',
  imports: [
    ReactiveFormsModule,
    NgIf
  ],
  templateUrl: './new-customer.component.html',
  styleUrl: './new-customer.component.css'
})
export class NewCustomerComponent {
  newCustomerFormGroup! : FormGroup;

  constructor(private fb : FormBuilder, private customerService: CustomerService, private router: Router) {
  }

  ngOnInit(): void {
    this.newCustomerFormGroup = this.fb.group({
      name : this.fb.control('', [Validators.required, Validators.minLength(4)]),
      email : this.fb.control('', [Validators.required, Validators.email]),
    });
  }

  handleSaveCustomer() {
    let customer = this.newCustomerFormGroup.value;
    this.customerService.saveCustomers(customer).subscribe({
      next: (data) => {
        alert("Customer created successfully");
        this.newCustomerFormGroup.reset();
        this.router.navigateByUrl("/customers");
      },
      error: (error) => {
        alert("Error while creating customer");
        console.error('Error creating customer:', error);
      }
    });
  }
}
