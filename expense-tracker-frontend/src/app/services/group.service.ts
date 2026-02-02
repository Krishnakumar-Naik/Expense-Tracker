import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GroupService {
  private apiUrl = 'http://localhost:5000/api/groups';

  constructor(private http: HttpClient) { }

  private getHeaders() {
    const token = localStorage.getItem('token');
    return new HttpHeaders().set('x-auth-token', token || '');
  }

  createGroup(groupData: { name: string, memberEmails: string[] }): Observable<any> {
    return this.http.post(this.apiUrl, groupData, { headers: this.getHeaders() });
  }

  getGroups(): Observable<any> {
    return this.http.get(this.apiUrl, { headers: this.getHeaders() });
  }

  addGroupExpense(groupId: string, expenseData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/${groupId}/expenses`, expenseData, { headers: this.getHeaders() });
  }

  getGroupExpenses(groupId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${groupId}/expenses`, { headers: this.getHeaders() });
  }

  searchUser(email: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/search-user?email=${email}`, { headers: this.getHeaders() });
  }
}
