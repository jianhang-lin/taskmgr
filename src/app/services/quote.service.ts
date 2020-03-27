import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Quote } from '@angular/compiler';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class QuoteService {

  constructor(private http: HttpClient, @Inject('BASE_CONFIG') private config) { }

  getQuote(): Observable<Quote> {
    const uri = `${this.config.uri}/quotes/${Math.floor(Math.random() * 10)}`;
    return this.http.get<Quote>(uri);
  }
}
