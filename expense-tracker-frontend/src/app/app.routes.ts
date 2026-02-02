import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AddTransactionComponent } from './components/add-transaction/add-transaction.component';
import { ReportsComponent } from './components/reports/reports.component';
import { TransactionsListComponent } from './components/transactions-list/transactions-list.component';
import { CategoriesComponent } from './components/categories/categories.component';
import { SettingsComponent } from './components/settings/settings.component';
import { GroupSplitComponent } from './components/group-split/group-split.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
    { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },
    { path: 'transactions', component: TransactionsListComponent, canActivate: [authGuard] },
    { path: 'add-transaction', component: AddTransactionComponent, canActivate: [authGuard] },
    { path: 'reports', component: ReportsComponent, canActivate: [authGuard] },
    { path: 'categories', component: CategoriesComponent, canActivate: [authGuard] },
    { path: 'settings', component: SettingsComponent, canActivate: [authGuard] },
    { path: 'group-split', component: GroupSplitComponent, canActivate: [authGuard] }
];
