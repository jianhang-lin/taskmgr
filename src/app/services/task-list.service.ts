import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TaskListModel } from '../domain';
import { concat, map, mapTo, reduce } from 'rxjs/operators';
import { Observable, of } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class TaskListService {

  private readonly domain = 'taskList';
  private headers = new HttpHeaders({
    'Content-Type': 'application/json'
  });
  constructor(private http: HttpClient, @Inject('BASE_CONFIG') private config) { }

  add(taskList: TaskListModel): Observable<void> {
    taskList.id = null;
    const uri = `${this.config.uri}/${this.domain}`;
    return this.http.post(uri, JSON.stringify(taskList), {headers: this.headers}).pipe(map(res => {
      console.log(JSON.stringify(res));
    }));
  }

  update(taskList: TaskListModel): Observable<void> {
    const uri = `${this.config.uri}/${this.domain}/${taskList.id}`;
    const toUpdate = {
      name: taskList.name
    };
    return this.http.patch(uri, JSON.stringify(toUpdate), {headers: this.headers}).pipe(map(res => {
      console.log(JSON.stringify(res));
    }));
  }

  del(taskList: TaskListModel): Observable<TaskListModel> {
    const uri = `${this.config.uri}/taskLists/${taskList.id}`;
    return this.http.delete(uri).pipe(mapTo(taskList));
  }

  get(projectId: string): Observable<TaskListModel[]> {
    const uri = `${this.config.uri}/${this.domain}`;
    return this.http.get<TaskListModel[]>(uri, {params: {projectId}});
  }

  swapOrder(src: TaskListModel, target: TaskListModel): Observable<TaskListModel[]> {
    const dragUri = `${this.config.uri}/${this.domain}/${src.id}`;
    const dropUri = `${this.config.uri}/${this.domain}/${target.id}`;
    const drag$ = this.http.patch(dragUri, JSON.stringify({order: target.order}), {headers: this.headers});
    const drop$ = this.http.patch(dropUri, JSON.stringify({order: src.order}), {headers: this.headers});
    return of(drag$, drop$).pipe(
      concat(drag$, drop$),
      reduce((arrs, list) => [...arrs, list], []));
  }
}
