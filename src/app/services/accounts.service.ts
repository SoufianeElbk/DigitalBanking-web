import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {AccountDetails} from '../model/account.model';
import {Observable} from 'rxjs';
import { DebitRequest, CreditRequest, TransferRequest, OperationResponse } from '../model/operation.model';

@Injectable({
  providedIn: 'root'
})
export class AccountsService {

  constructor(private http:HttpClient) { }

    public getAccount(accountId : string, page : number, size : number) : Observable<AccountDetails> {
      return this.http.get<AccountDetails>('http://localhost:8080/accounts/' + accountId+"/operations?page=" + page + "&size=" + size);
    }

    public debit(debitRequest: DebitRequest): Observable<OperationResponse> {
      return this.http.post<OperationResponse>('http://localhost:8080/accounts/debit', debitRequest);
    }

    public credit(creditRequest: CreditRequest): Observable<OperationResponse> {
      return this.http.post<OperationResponse>('http://localhost:8080/accounts/credit', creditRequest);
    }

    public transfer(transferRequest: TransferRequest): Observable<OperationResponse> {
      return this.http.post<OperationResponse>('http://localhost:8080/accounts/transfer', transferRequest);
    }
}
