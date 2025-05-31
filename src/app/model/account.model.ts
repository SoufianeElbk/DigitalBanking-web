export interface AccountDetails {
    accountId : number;
    balance : string;
    currentPage : string;
    totalPages : string;
    pageSize : string;
    accountOperationDTOS : AccountOperations[];
}

export interface AccountOperations {
  id : number;
  operationDate : Date;
  amount : number;
  type : string;
  description : string;
}

export interface BankAccount {
  id: string;
  type: string;
  balance: number;
  creationDate: Date;
  status: string;
  customer: {
    id: number;
    name: string;
    email: string;
  };
}
