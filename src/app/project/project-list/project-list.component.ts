import { ChangeDetectionStrategy, ChangeDetectorRef, Component, HostBinding, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NewProjectComponent } from '../new-project/new-project.component';
import { InviteComponent } from '../invite/invite.component';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog.component';
import { slideToRight } from '../../anim/router.anim';
import { listAnimation } from '../../anim/list.anim';
import { ProjectService } from '../../services/project.service';
import * as _ from 'lodash';
import { filter, map, switchMap, take } from 'rxjs/operators';
import { ProjectModel } from '../../domain';

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
export class ProjectListComponent implements OnInit {

  @HostBinding('@routeAnim') state;
  projects;
  constructor(private dialog: MatDialog, private cd: ChangeDetectorRef, private service$: ProjectService) { }

  ngOnInit(): void {
    this.service$.get('1').subscribe(projects => {
      this.projects = projects;
      this.cd.markForCheck();
    });
  }

  openNewProjectDialog() {
    const selectedImg = `/assets/img/covers/${Math.floor(Math.random() * 40)}_tn.jpg`;
    const dialogRef = this.dialog.open(NewProjectComponent, {data: {thumbnails: this.getThumbnails(), img: selectedImg}});
    dialogRef.afterClosed().pipe(
      take(1),
      filter(n => n),
      map(val => ({...val, coverImg: this.buildImgSrc(val.coverImg)})),
      switchMap(v => this.service$.add(v))).
    subscribe(project => {
      this.projects = [...this.projects, project];
      this.cd.markForCheck();
    });
  }

  launchInviteDialog() {
    const dialogRef = this.dialog.open(InviteComponent);
  }

  launchUpdateDialog(project: ProjectModel) {
    const dialogRef = this.dialog.open(NewProjectComponent, {data: {thumbnails: this.getThumbnails(), project}});
    dialogRef.afterClosed().pipe(
      take(1),
      filter(n => n),
      map(val => ({...val, id: project.id, coverImg: this.buildImgSrc(val.coverImg)})),
      switchMap(v => this.service$.update(v))).
    subscribe(pp => {
      const index = this.projects.map(p => p.id).indexOf(pp.id);
      this.projects = [...this.projects.slice(0, index), pp, ...this.projects.slice(index + 1)];
      this.cd.markForCheck();
    });
  }

  launchConfirmDailog(project) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {data: {title: '删除项目：', content: '您确认删除该项目吗?'}});
    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      this.projects = this.projects.filter(p => p.id !== project.id);
      this.cd.markForCheck();
    });
  }

  private getThumbnails() {
    return _.range(0, 40).map(i => `/assets/img/covers/${i}_tn.jpg`);
  }

  private buildImgSrc(img: string): string {
    return img.indexOf('_') > -1 ? img.split('_')[0] + '.jpg' : img;
  }
}
