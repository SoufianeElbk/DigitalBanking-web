import { Component } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {AsyncPipe, DatePipe, DecimalPipe, NgForOf, NgIf} from '@angular/common';
import {AccountsService} from '../services/accounts.service';
import {Observable} from 'rxjs';
import {AccountDetails} from '../model/account.model';
import { DebitRequest, CreditRequest, TransferRequest } from '../model/operation.model';

class Account {
}

@Component({
  selector: 'app-accounts',
  imports: [
    ReactiveFormsModule,
    NgForOf,
    AsyncPipe,
    NgIf,
    DecimalPipe,
    DatePipe
  ],
  templateUrl: './accounts.component.html',
  styleUrl: './accounts.component.css'
})
export class AccountsComponent {

  accounts! : Observable<AccountDetails>;
  errorMessage! : string;
  searchFormGroup! : FormGroup;
  operationFormGroup! : FormGroup;
  currentPage : number = 0;
  pageSize : number = 100;
  currentAccountId! : string;
  showOperationForm : boolean = false;

  constructor(private fb: FormBuilder, private accountService: AccountsService) {
  }

  ngOnInit(): void {
    this.searchFormGroup = this.fb.group({
      accountId : this.fb.control('')
    });

    this.operationFormGroup = this.fb.group({
      operationType: this.fb.control('DEBIT', [Validators.required]),
      amount: this.fb.control('', [Validators.required, Validators.min(0.01)]),
      description: this.fb.control('', [Validators.required]),
      accountDestination: this.fb.control('')
    });
  }

  handleSearchAccounts() {
    let accountId : string = this.searchFormGroup?.value.accountId;
    this.currentAccountId = accountId;
    this.accounts =  this.accountService.getAccount(accountId, this.currentPage, this.pageSize);
    this.showOperationForm = true;
  }

  toggleOperationForm() {
    this.showOperationForm = !this.showOperationForm;
  }

  handleOperation() {
    if (this.operationFormGroup.valid && this.currentAccountId) {
      const operationType = this.operationFormGroup.value.operationType;
      const amount = this.operationFormGroup.value.amount;
      const description = this.operationFormGroup.value.description;
      const accountDestination = this.operationFormGroup.value.accountDestination;

      switch (operationType) {
        case 'DEBIT':
          this.performDebit(amount, description);
          break;
        case 'CREDIT':
          this.performCredit(amount, description);
          break;
        case 'TRANSFER':
          this.performTransfer(amount, description, accountDestination);
          break;
      }
    }
  }

  private performDebit(amount: number, description: string) {
    const debitRequest: DebitRequest = {
      accountId: this.currentAccountId,
      amount: amount,
      description: description
    };

    this.accountService.debit(debitRequest).subscribe({
      next: (response) => {
        alert('Debit operation successful');
        this.operationFormGroup.reset();
        this.operationFormGroup.patchValue({ operationType: 'DEBIT' });
        this.refreshAccount();
      },
      error: (error) => {
        alert('Error performing debit operation: ' + error.message);
        console.error('Debit error:', error);
      }
    });
  }

  private performCredit(amount: number, description: string) {
    const creditRequest: CreditRequest = {
      accountId: this.currentAccountId,
      amount: amount,
      description: description
    };

    this.accountService.credit(creditRequest).subscribe({
      next: (response) => {
        alert('Credit operation successful');
        this.operationFormGroup.reset();
        this.operationFormGroup.patchValue({ operationType: 'DEBIT' });
        this.refreshAccount();
      },
      error: (error) => {
        alert('Error performing credit operation: ' + error.message);
        console.error('Credit error:', error);
      }
    });
  }

  private performTransfer(amount: number, description: string, accountDestination: string) {
    console.log('performTransfer called with:', { amount, description, accountDestination });
    console.log('currentAccountId:', this.currentAccountId);

    if (!accountDestination) {
      alert('Destination account is required for transfer');
      return;
    }

    if (!this.currentAccountId) {
      alert('Source account ID is missing. Please search for an account first.');
      return;
    }

    if (this.currentAccountId === accountDestination) {
      alert('Source and destination accounts cannot be the same');
      return;
    }

    const transferRequest: TransferRequest = {
      accountId: this.currentAccountId,
      amount: amount,
      description: description,
      accountDestination: accountDestination,
    };

    console.log('Transfer request being sent:', transferRequest);

    this.accountService.transfer(transferRequest).subscribe({
      next: (response) => {
        console.log('Transfer response:', response);
        alert('Transfer operation successful');
        this.operationFormGroup.reset();
        this.operationFormGroup.patchValue({ operationType: 'DEBIT' });
        this.refreshAccount();
      },
      error: (error) => {
        console.error('Transfer error details:', error);
        let errorMessage = 'Error performing transfer operation';

        if (error.error && error.error.error) {
          errorMessage = error.error.error;
        } else if (error.message) {
          errorMessage = error.message;
        }

        alert(errorMessage);
      }
    });
  }

  private refreshAccount() {
    if (this.currentAccountId) {
      this.accounts = this.accountService.getAccount(this.currentAccountId, this.currentPage, this.pageSize);
    }
  }

  isTransferOperation(): boolean {
    return this.operationFormGroup?.value.operationType === 'TRANSFER';
  }
}
