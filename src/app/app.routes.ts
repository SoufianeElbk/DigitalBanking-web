import {RouterModule, Routes} from '@angular/router';
import {CustomersComponent} from './customers/customers.component';
import {AccountsComponent} from './accounts/accounts.component';
import {NgModule} from '@angular/core';
import {NewCustomerComponent} from './new-customer/new-customer.component';
import {EditCustomerComponent} from './edit-customer/edit-customer.component';
import {CustomerAccountsComponent} from './customer-accounts/customer-accounts.component';

export const routes: Routes = [
  { path : "customers", component : CustomersComponent },
  { path : "accounts", component : AccountsComponent },
  { path : "new-customer", component : NewCustomerComponent },
  { path : "edit-customer/:id", component : EditCustomerComponent },
  { path: 'accounts/:accountId', component: AccountsComponent },
  { path : "customer-accounts/:id", component : CustomerAccountsComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
