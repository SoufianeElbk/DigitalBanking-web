import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomerService } from '../services/customer.service';
import { catchError, Observable, throwError } from 'rxjs';
import { Customer } from '../model/customer.model';
import {FormBuilder, FormGroup, ReactiveFormsModule} from '@angular/forms';

@Component({
  selector: 'app-customers',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './customers.component.html',
  styleUrl: './customers.component.css'
})
export class CustomersComponent implements OnInit{

  customers! : Observable<Array<Customer>>;
  errorMessage! : string;
  searchFormGroup! : FormGroup;

  constructor(private customerService: CustomerService, private fb : FormBuilder) {
  }

  ngOnInit(): void {
    this.searchFormGroup = this.fb.group({
      keyword : this.fb.control('')
    })
    this.handleSearchCystomers();
  }

  handleSearchCystomers() {
    let keyword = this.searchFormGroup?.value.keyword;
    this.customers = this.customerService.searchCustomers(keyword).pipe(
      catchError((error) => {
        this.errorMessage = error.message;
        console.error('Error searching customers:', error);
        return throwError(() => error);
      })
    );

  }

  handleDeleteCustomer(customer: Customer) {
    let conf = confirm("Are you   sure you want to delete this customer?");
    if (conf) {
      this.customerService.deleteCustomer(customer.id).subscribe({
        next: (data) => {
          this.handleSearchCystomers();
        },
        error: (error) => {
          alert("Error while deleting customer");
          console.error('Error deleting customer:', error);
        }
      });
    }

  }
}
