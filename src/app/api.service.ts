import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  token: any;
  // url = 'http://127.0.0.1:8000/api/v1';
  url ='API_ENDPOINT_FROM_COVID19NG-LARAVEL_API_REPO';
  gApi = 'GOOGLE_API_KEY_HERE';

  constructor(public http: HttpClient) { }


  allStates() {
    const httpOptions = {
      headers: new HttpHeaders({
        // Accept: 'application/json',
        'Content-Type': 'application/json',
        // Authorization: `Bearer ${this.token}`
      })
    };
    return this.http.get(`${this.url}/states`, httpOptions);
  }

  postContribution(data) {
    const httpOptions = {
      headers: new HttpHeaders({
        // Accept: 'application/json',
        'Content-Type': 'application/json',
        // Authorization: `Bearer ${this.token}`
      })
    };
    return this.http.post(`${this.url}/contribute`, data, httpOptions);
  }

  getContributions() {
    const httpOptions = {
      headers: new HttpHeaders({
        // Accept: 'application/json',
        'Content-Type': 'application/json',
        // Authorization: `Bearer ${this.token}`
      })
    };
    return this.http.get(`${this.url}/contributions`, httpOptions);
  }

}
