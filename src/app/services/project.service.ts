import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ProjectModel } from '../domain';
import { count, map, mapTo, mergeMap, switchMap } from 'rxjs/operators';
import { from, Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  private readonly domain = 'projects';
  private headers = new HttpHeaders({
    'Content-Type': 'application/json'
  });
  constructor(private http: HttpClient, @Inject('BASE_CONFIG') private config) { }

  add(project: ProjectModel): Observable<ProjectModel> {
    project.id = null;
    const uri = `${this.config.uri}/${this.domain}`;
    return this.http.post<ProjectModel>(uri, JSON.stringify(project), {headers: this.headers});
  }

  update(project: ProjectModel): Observable<ProjectModel> {
    const uri = `${this.config.uri}/${this.domain}/${project.id}`;
    const toUpdate = {
      name: project.name,
      desc: project.desc,
      coverImg: project.coverImg
    };
    return this.http.patch<ProjectModel>(uri, JSON.stringify(toUpdate), {headers: this.headers});
  }

  del(project: ProjectModel): Observable<ProjectModel> {
    const delTasks$ = from(project.taskLists ? project.taskLists : [])
      .pipe(mergeMap(listId => this.http.delete(`${this.config.uri}/taskLists/${listId}`)), count());
    return delTasks$.pipe(switchMap(_ => this.http.delete(`${this.config.uri}/${this.domain}/${project.id}`)), mapTo(project));
  }

  get(userId: string): Observable<ProjectModel[]> {
    const uri = `${this.config.uri}/${this.domain}`;
    return this.http.get<ProjectModel[]>(uri, {params: {members_like: userId}});
  }
}
