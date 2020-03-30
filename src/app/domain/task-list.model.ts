export interface TaskListModel {
  id?: string;
  name: string;
  order: number;
  taskIds: string[];
  projectId: string;
}
