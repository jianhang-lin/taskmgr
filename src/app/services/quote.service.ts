import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { QuoteModel } from '../domain/quote.model';
import { debug } from '../utils/debug.util';

@Injectable({
  providedIn: 'root'
})
export class QuoteService {

  constructor(private http: HttpClient, @Inject('BASE_CONFIG') private config) { }

  getQuote(): Observable<QuoteModel> {
    const uri = `${this.config.uri}/quotes/${Math.floor(Math.random() * 10)}`;
    return this.http.get<QuoteModel>(uri).pipe(debug('getQuote:'));
  }
}
