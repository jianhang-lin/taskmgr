import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TaskListModel, TaskModel } from '../domain';
import { mapTo, mergeMap, reduce } from 'rxjs/operators';
import { from, Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class TaskService {

  private readonly domain = 'tasks';
  private headers = new HttpHeaders({
    'Content-Type': 'application/json'
  });
  constructor(private http: HttpClient, @Inject('BASE_CONFIG') private config) { }

  add(task: TaskModel): Observable<TaskModel> {
    task.id = null;
    const uri = `${this.config.uri}/${this.domain}`;
    return this.http.post<TaskModel>(uri, JSON.stringify(task), {headers: this.headers});
  }

  update(task: TaskModel): Observable<TaskModel> {
    const uri = `${this.config.uri}/${this.domain}/${task.id}`;
    const toUpdate = {
      desc: task.desc,
      priority: task.priority,
      dueDate: task.dueDate,
      reminder: task.reminder,
      ownerId: task.ownerId,
      participantIds: task.participantIds,
      remark: task.remark
    };
    return this.http.patch<TaskModel>(uri, JSON.stringify(toUpdate), {headers: this.headers});
  }

  del(task: TaskModel): Observable<TaskModel> {
    const uri = `${this.config.uri}/taskLists/${task.id}`;
    return this.http.delete(uri).pipe(mapTo(task));
  }

  get(taskListId: string): Observable<TaskModel[]> {
    const uri = `${this.config.uri}/${this.domain}`;
    return this.http.get<TaskModel[]>(uri, {params: {taskListId}});
  }

  getByLists(lists: TaskListModel[]): Observable<TaskModel[]> {
    return from(lists).pipe(
      mergeMap(list => this.get(list.id)),
      reduce((tasks: TaskModel[], t: TaskModel[]) => [...tasks, ...t], []));
  }

  complete(task: TaskModel): Observable<TaskModel> {
    const uri = `${this.config.uri}/${this.domain}/${task.id}`;
    return this.http.patch<TaskModel>(uri, JSON.stringify({completed: !task.completed}), {headers: this.headers});
  }

  move(taskId: string, taskListId: string): Observable<TaskModel> {
    const uri = `${this.config.uri}/${this.domain}/${taskId}`;
    return this.http.patch<TaskModel>(uri, JSON.stringify({taskListId}), {headers: this.headers});
  }

  moveAll(srcListId: string, targetListId: string): Observable<TaskModel[]> {
    // @ts-ignore
    return this.http.get<TaskModel>(srcListId).pipe(mergeMap(tasks => from(tasks)), mergeMap(task => this.move(task.id, targetListId)),
      reduce((arr, x) => [...arr, x], []));
  }
}
