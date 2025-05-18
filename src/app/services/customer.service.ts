import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Customer } from '../model/customer.model';

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
}
