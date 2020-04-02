import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User} from '../domain';
import { map, mapTo, switchMap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Auth } from './auth.model';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly domain = 'users';
  private headers = new HttpHeaders({
    'Content-Type': 'application/json'
  });
  private token = 'AAABBBB';
  private auth: any;
  constructor(private http: HttpClient, @Inject('BASE_CONFIG') private config) { }

  register(user: User): Observable<Auth> {
    const uri = `${this.config.uri}/${this.domain}`;
    return this.http.get<Auth>(uri, {params: {email: user.email}}).pipe(switchMap(res => {
      if (JSON.stringify(res) !== '[]') {
        throw new Error('user existed');
      }
      return this.http.post<Auth>(uri, JSON.stringify(user), {headers: this.headers}).pipe(
        map(r => ({token: this.token, user: JSON.stringify(r)})));
    }), mapTo(this.auth as Auth));
  }

  login(username: string, password: string): Observable<Auth> {
    const uri = `${this.config.uri}/${this.domain}`;
    return this.http.get<Auth>(uri, {params: {email: username, password}}).pipe(map(res => {
      if (res === '') {
        throw new Error('username or password not match');
      }
      return {
        token: this.token,
        user: res[0]
      };
    }));
  }
}
