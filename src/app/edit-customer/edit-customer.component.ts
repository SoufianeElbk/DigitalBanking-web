import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CustomerService } from '../services/customer.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Customer } from '../model/customer.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-edit-customer',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './edit-customer.component.html',
  styleUrl: './edit-customer.component.css'
})
export class EditCustomerComponent implements OnInit {
  editCustomerFormGroup!: FormGroup;
  customerId!: number;
  customer!: Customer;
  errorMessage!: string;

  constructor(
    private fb: FormBuilder, 
    private customerService: CustomerService, 
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.customerId = this.route.snapshot.params['id'];
    this.editCustomerFormGroup = this.fb.group({
      name: this.fb.control('', [Validators.required, Validators.minLength(4)]),
      email: this.fb.control('', [Validators.required, Validators.email]),
    });
    
    this.loadCustomer();
  }

  loadCustomer(): void {
    this.customerService.getCustomer(this.customerId).subscribe({
      next: (customer) => {
        this.customer = customer;
        this.editCustomerFormGroup.patchValue({
          name: customer.name,
          email: customer.email
        });
      },
      error: (error) => {
        this.errorMessage = "Error loading customer: " + error.message;
        console.error('Error loading customer:', error);
      }
    });
  }

  handleUpdateCustomer(): void {
    if (this.editCustomerFormGroup.valid) {
      const updatedCustomer: Customer = {
        id: this.customerId,
        name: this.editCustomerFormGroup.value.name,
        email: this.editCustomerFormGroup.value.email
      };

      this.customerService.updateCustomer(updatedCustomer).subscribe({
        next: (data) => {
          alert("Customer updated successfully");
          this.router.navigateByUrl("/customers");
        },
        error: (error) => {
          alert("Error while updating customer");
          console.error('Error updating customer:', error);
        }
      });
    }
  }

  handleCancel(): void {
    this.router.navigateByUrl("/customers");
  }
}
