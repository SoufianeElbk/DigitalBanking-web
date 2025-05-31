export interface OperationRequest {
  accountId: string;
  amount: number;
  description: string;
  accountDestination?: string; // Pour les virements
}

export interface DebitRequest extends OperationRequest {}

export interface CreditRequest extends OperationRequest {}

export interface TransferRequest extends OperationRequest {
  accountDestination: string;
}

export interface OperationResponse {
  id: number;
  operationDate: Date;
  amount: number;
  type: string;
  description: string;
  accountId: string;
}
