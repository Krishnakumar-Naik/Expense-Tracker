import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  private apiUrl = 'http://localhost:5000/api/transactions';

  constructor(private http: HttpClient) { }

  getTransactions(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  addTransaction(transaction: any): Observable<any> {
    return this.http.post(this.apiUrl, transaction);
  }

  deleteTransaction(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  updateTransaction(id: string, transaction: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, transaction);
  }
}
