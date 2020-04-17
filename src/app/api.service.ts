import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  token: any;
  // url = 'http://127.0.0.1:8000/api/v1';
  url ='https://covid19ng.aitechma.com/api/v1';
  gApi = 'AIzaSyBOyaMNln_heJZUm7vyXJEUS4qA0r-qAnc';

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

  // getDistance(mLat, mLong, dLat, dLong) {
  //   const httpOptions = {
  //     headers: new HttpHeaders({
  //       // Accept: 'application/json',
  //       'Content-Type': 'application/json',
  //       // Authorization: `Bearer ${this.token}`
  //     })
  //   };

  //   return this.http.get(`https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=${mLat},${mLong}&destinations=${dLat},${dLong}&key=${this.gApi}`);
  // }
}
