import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Customer } from '../model/customer.model';
import { environment } from '../../environments/environment';
import {BankAccount} from '../model/account.model';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  constructor(private http:HttpClient) { }

  public getCustomers() : Observable<Array<Customer>> {
    return this.http.get<Array<Customer>>('http://localhost:8080/customers');
  }

  public searchCustomers(keyword : string) : Observable<Array<Customer>> {
    return this.http.get<Array<Customer>>('http://localhost:8080/customers/search?keyword=' + keyword);
  }

  public saveCustomers(customer : Customer) : Observable<Customer> {
    return this.http.post<Customer>('http://localhost:8080/customers', customer);
  }

  deleteCustomer(id: number) {
    return this.http.delete<Customer>('http://localhost:8080/customers/' + id);
  }

  public getCustomer(id: number): Observable<Customer> {
    return this.http.get<Customer>('http://localhost:8080/customers/' + id);
  }

  public updateCustomer(customer: Customer): Observable<Customer> {
    return this.http.put<Customer>('http://localhost:8080/customers/' + customer.id, customer);
  }

  getCustomerAccounts(customerId: number): Observable<Array<BankAccount>> {
    return this.http.get<Array<BankAccount>>('http://localhost:8080/customers/' + customerId + '/accounts');
  }
}
