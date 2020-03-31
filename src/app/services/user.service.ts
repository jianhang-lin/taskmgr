import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ProjectModel, User } from '../domain';
import { from, Observable, of } from 'rxjs';
import { filter, reduce, switchMap } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class UserService {

  private readonly domain = 'users';
  private headers = new HttpHeaders({
    'Content-Type': 'application/json'
  });
  constructor(private http: HttpClient, @Inject('BASE_CONFIG') private config) { }

  searchUsers(filterStr: string): Observable<User[]> {
    const uri = `${this.config.uri}/${this.domain}`;
    return this.http.get<User[]>(uri, {params: {email_like: filterStr}});
  }

  getUsersByProject(projectId: string): Observable<User[]> {
    const uri = `${this.config.uri}/${this.domain}`;
    return this.http.get<User[]>(uri, {params: {projectId}});
  }

  addProjectRef(user: User, projectId: string): Observable<User> {
    const uri = `${this.config.uri}/${this.domain}/user.id`;
    const projectIds = user.projectIds ? user.projectIds : [];
    if (projectIds.indexOf(projectId) > -1) {
      return of(user);
    }
    return this.http.patch<User>(uri, JSON.stringify({projectIds: [...projectIds, projectId]}), {headers: this.headers});
  }

  removeProjectRef(user: User, projectId: string): Observable<User> {
    const uri = `${this.config.uri}/${this.domain}/user.id`;
    const projectIds = user.projectIds ? user.projectIds : [];
    const index = projectIds.indexOf(projectId);
    if (index === -1) {
      return of(user);
    }
    const toUpdate = [...projectIds.slice(0, index), ...projectIds.slice(index + 1)];
    return this.http.patch<User>(uri, JSON.stringify({projectIds: toUpdate}), {headers: this.headers});
  }

  batchUpdateProjectRef(project: ProjectModel): Observable<User[]> {
    const projectId = project.id;
    const memberIds = project.members ? project.members : [];
    return from(memberIds).pipe(
      switchMap(id => {
        const uri =  `${this.config.uri}/${this.domain}/${id}`;
        return this.http.get<User>(uri);
      }),
      filter(user => user.projectIds.indexOf(projectId) === -1),
      switchMap(u => this.addProjectRef(u, projectId)), reduce((arr, curr) => [...arr, curr], []));
  }
}
