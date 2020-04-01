import {ChangeDetectionStrategy, Component, Inject, OnInit} from '@angular/core';
import {User} from '../../domain';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-invite',
  templateUrl: './invite.component.html',
  styleUrls: ['./invite.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InviteComponent implements OnInit {

  members: User[] = [];
  constructor(
    @Inject(MAT_DIALOG_DATA) private data,
    private dialogRef: MatDialogRef<InviteComponent>
   ) { }

  ngOnInit(): void {
    this.members = [...this.data.memebers];
  }

  onSubmit(ev: Event, {valide, value}) {
    ev.preventDefault();
    if (!valide) {
      return;
    }
    this.dialogRef.close(this.members);
  }
}
