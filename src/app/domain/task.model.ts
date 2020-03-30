export interface TaskModel {
  id?: string;
  desc: string;
  completed: boolean;
  priority: number;
  dueDate?: Date;
  reminder?: Date;
  createDate: Date;
  remark?: string;
  ownerId?: string;
  participantId: string[];
  taskListId: string;
}
