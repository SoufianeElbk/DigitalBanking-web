import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CustomerService } from '../services/customer.service';
import { Customer } from '../model/customer.model';
import { Observable, catchError, throwError } from 'rxjs';
import {BankAccount} from '../model/account.model';

@Component({
  selector: 'app-customer-accounts',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './customer-accounts.component.html',
  styleUrl: './customer-accounts.component.css'
})
export class CustomerAccountsComponent implements OnInit {
  customer!: Customer;
  customerAccounts!: Observable<Array<BankAccount>>;
  customerId!: number;
  errorMessage!: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private customerService: CustomerService
  ) {}

  ngOnInit(): void {
    // Récupérer l'ID du client depuis l'URL
    this.customerId = +this.route.snapshot.params['id'];

    // Récupérer le client depuis l'état de navigation (si disponible)
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state && navigation.extras.state['customer']) {
      this.customer = navigation.extras.state['customer'];
    } else {
      // Si pas d'état, récupérer le client par son ID
      this.loadCustomer();
    }

    // Charger les comptes du client
    this.loadCustomerAccounts();
  }

  loadCustomer(): void {
    this.customerService.getCustomer(this.customerId).subscribe({
      next: (customer) => {
        this.customer = customer;
      },
      error: (error) => {
        this.errorMessage = "Error loading customer: " + error.message;
        console.error('Error loading customer:', error);
      }
    });
  }

  loadCustomerAccounts(): void {
    this.customerAccounts = this.customerService.getCustomerAccounts(this.customerId).pipe(
      catchError((error) => {
        this.errorMessage = "Error loading customer accounts: " + error.message;
        console.error('Error loading customer accounts:', error);
        return throwError(() => error);
      })
    );
  }

  goBack(): void {
    this.router.navigateByUrl('/customers');
  }

  viewAccountOperations(accountId: string): void {
    this.router.navigateByUrl('/accounts/' + accountId);
  }

  getAccountTypeLabel(type: string): string {
    switch (type) {
      case 'CURRENT_ACCOUNT':
        return 'Current Account';
      case 'SAVING_ACCOUNT':
        return 'Savings Account';
      default:
        return type;
    }
  }

  getAccountTypeBadgeClass(type: string): string {
    switch (type) {
      case 'CURRENT_ACCOUNT':
        return 'bg-primary';
      case 'SAVING_ACCOUNT':
        return 'bg-success';
      default:
        return 'bg-secondary';
    }
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'ACTIVATED':
        return 'bg-success';
      case 'SUSPENDED':
        return 'bg-warning';
      case 'CLOSED':
        return 'bg-danger';
      default:
        return 'bg-secondary';
    }
  }

  getBalanceClass(balance: number): string {
    return balance >= 0 ? 'text-success' : 'text-danger';
  }

  getTotalBalance(accounts: BankAccount[]): number {
    return accounts.reduce((total, account) => total + account.balance, 0);
  }

  getActiveAccountsCount(accounts: BankAccount[]): number {
    return accounts.filter(account => account.status === 'ACTIVATED').length;
  }
}
