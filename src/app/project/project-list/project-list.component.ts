import { ChangeDetectionStrategy, ChangeDetectorRef, Component, HostBinding, OnInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NewProjectComponent } from '../new-project/new-project.component';
import { InviteComponent } from '../invite/invite.component';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog.component';
import { slideToRight } from '../../anim/router.anim';
import { listAnimation } from '../../anim/list.anim';
import * as _ from 'lodash';
import * as fromRoot from '../../reducers';
import * as actions from '../../actions/project.action';
import { filter, map, take } from 'rxjs/operators';
import { ProjectModel } from '../../domain';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.scss'],
  animations: [
    slideToRight,
    listAnimation
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectListComponent implements OnInit, OnDestroy {

  @HostBinding('@routeAnim') state;
  projects$: Observable<ProjectModel[]>;
  listAnim$: Observable<number>;
  constructor(
    private dialog: MatDialog,
    private cd: ChangeDetectorRef,
    private store$: Store) {
    this.store$.dispatch(new actions.LoadAction(null));
    this.projects$ = this.store$.select(fromRoot.getProjects);
    this.listAnim$ = this.projects$.pipe(map(p => p.length));
  }

  ngOnInit(): void {

  }

  ngOnDestroy(): void {
  }

  openNewProjectDialog() {
    const selectedImg = `/assets/img/covers/${Math.floor(Math.random() * 40)}_tn.jpg`;
    const dialogRef = this.dialog.open(NewProjectComponent, {data: {thumbnails: this.getThumbnails(), img: selectedImg}});
    dialogRef.afterClosed().pipe(
      take(1),
      filter(n => n),
      map(val => ({...val, coverImg: this.buildImgSrc(val.coverImg)}))).
    subscribe(project => {
      this.store$.dispatch(new actions.AddAction(project));
    });
  }

  launchInviteDialog(project: ProjectModel) {
    const dialogRef = this.dialog.open(InviteComponent, {data: {members: []}});
  }

  launchUpdateDialog(project: ProjectModel) {
    const dialogRef = this.dialog.open(NewProjectComponent, {data: {thumbnails: this.getThumbnails(), project}});
    dialogRef.afterClosed().pipe(
      take(1),
      filter(n => n),
      map(val => ({...val, id: project.id, coverImg: this.buildImgSrc(val.coverImg)}))).
    subscribe(pp => {
      this.store$.dispatch(new actions.UpdateAction(pp));
    });
  }

  launchConfirmDailog(project) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {data: {title: '删除项目：', content: '您确认删除该项目吗?'}});
    dialogRef.afterClosed().pipe(take(1), filter(n => n)).subscribe(p => {
      this.store$.dispatch(new actions.DeleteAction(project));
    });
  }

  private getThumbnails() {
    return _.range(0, 40).map(i => `/assets/img/covers/${i}_tn.jpg`);
  }

  private buildImgSrc(img: string): string {
    return img.indexOf('_') > -1 ? img.split('_')[0] + '.jpg' : img;
  }

  selectProject(project: ProjectModel) {
    this.store$.dispatch(new actions.SelectAction(project));
  }
}
