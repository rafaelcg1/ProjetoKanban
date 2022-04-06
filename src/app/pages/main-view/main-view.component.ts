import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { Board } from 'src/app/models/board.model';
import { Column } from 'src/app/models/column.model';
import { ModalService } from 'src/app/modals';
import { User } from 'src/app/models/user.model';
import { Task } from 'src/app/models/task.model';
import { ContextMenuModel } from 'src/app/interfaces/contextMenu.model';

@Component({
  selector: 'app-main-view',
  templateUrl: './main-view.component.html',
  styleUrls: ['./main-view.component.scss'],
})
export class MainViewComponent implements OnInit {
  constructor(public modalService: ModalService) { }

  block: boolean = false;

  tasksToDo: Task[] = [];
  tasksDoing: Task[] = [];
  tasksDone: Task[] = [];
  columns: Column[] = [];

  ngOnInit(): void {
    this.columns.push(new Column('A Fazer', this.tasksToDo));
    this.columns.push(new Column('Em Andamento', this.tasksDoing));
    this.columns.push(new Column('Concluido', this.tasksDone));
  }

  board: Board = new Board('Meus Eventos', this.columns);

  users: Array<User> = new Array<User>();
  newUser: User = new User('');
  idTask: number = 1;
  newTask: Task = new Task(this.idTask, '', '', '', '');

  addUser(name: string) {
    this.users.forEach((user) => {
      if (user.name == this.newUser.name) {
        this.newUser = new User('');
        alert('Usuário já adicionado, favor criar outro');
        this.block = true;
      }
    });
    if (this.block == false) {
      this.users.push(new User(name));
      this.newUser.name = '';
    }
    this.block = false;
  }

  addTask(newTask: Task) {
    if (
      newTask.title.length > 44 ||
      newTask.description.length > 44 ||
      newTask.user.length > 44 ||
      newTask.estimate.length > 44
    ) {
      alert('Todos os campos tem limitação de 44 caracteres');
      this.block = true;
    }
    if (
      newTask.title.length == 0 ||
      newTask.description.length == 0 ||
      newTask.user.length == 0 ||
      newTask.estimate.length == 0
      ) {
        alert('Favor preencher todos os campos');
        this.block = true;
      }
    if (this.block == false) {
      if (newTask.idTask != this.taskToEdit.idTask) {
        newTask.idTask = this.idTask;
        ++this.idTask;
      }
      if (this.taskToEdit.idTask != 0) {
        this.tasksToDo.forEach((taskRemove, id) => {
          if (taskRemove.idTask == this.taskToEdit.idTask) this.tasksToDo.splice(id, 1, newTask);
        });
        this.tasksDoing.forEach((taskRemove, id) => {
          if (taskRemove.idTask == this.taskToEdit.idTask) this.tasksDoing.splice(id, 1, newTask);
        });
        this.tasksDone.forEach((taskRemove, id) => {
          if (taskRemove.idTask == this.taskToEdit.idTask) this.tasksDone.splice(id, 1, newTask);
        });
      } else {
        this.tasksToDo.push(newTask);
      }
      this.newTask = new Task(this.idTask, '', '', '', '');
      this.taskToEdit = new Task(0, '', '', '', '');
    }
    this.block = false;
  }

  drop(event: CdkDragDrop<Task[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
  }

  isDisplayContextMenu: boolean;
  rightClickMenuItems: Array<ContextMenuModel> = [];
  rightClickMenuPositionX: number;
  rightClickMenuPositionY: number;

  displayContextMenu(event: any, taskMenu: Task) {
    this.isDisplayContextMenu = true;

    this.removeTaskId = taskMenu.idTask;
    this.taskToEdit = taskMenu;

    this.rightClickMenuItems = [
      {
        menuText: 'Remover cartão',
        menuEvent: 'removeTask',
      },
      {
        menuText: 'Editar cartão',
        menuEvent: 'editTask',
      },
      {
        menuText: 'Fechar menu',
        menuEvent: 'closeMenu',
      },
    ];

    this.rightClickMenuPositionX = event.clientX;
    this.rightClickMenuPositionY = event.clientY;
  }

  getRightClickMenuStyle() {
    return {
      position: 'fixed',
      left: `${this.rightClickMenuPositionX}px`,
      top: `${this.rightClickMenuPositionY}px`,
    };
  }

  handleMenuItemClick(event: any) {
    switch (event.data) {
      case this.rightClickMenuItems[0].menuEvent:
        this.removeTask();
        break;
      case this.rightClickMenuItems[1].menuEvent:
        this.isEditTask = true;
        this.editTask();
        this.modalService.open('newTaskModal');
        break;
      case this.rightClickMenuItems[2].menuEvent:
        break;
    }
  }

  @HostListener('document:click')
  documentClick(): void {
    this.isDisplayContextMenu = false;
  }

  removeTaskId: number;
  removeTask() {
    this.tasksToDo.forEach((taskRemove, id) => {
      if (taskRemove.idTask == this.removeTaskId) this.tasksToDo.splice(id, 1);
    });
    this.tasksDoing.forEach((taskRemove, id) => {
      if (taskRemove.idTask == this.removeTaskId) this.tasksDoing.splice(id, 1);
    });
    this.tasksDone.forEach((taskRemove, id) => {
      if (taskRemove.idTask == this.removeTaskId) this.tasksDone.splice(id, 1);
    });
    this.removeTaskId = 0;
  }

  isEditTask: boolean = false;
  taskToEdit: Task = new Task(0, '', '', '', '');;
  editTask() {
    this.newTask.idTask = this.taskToEdit.idTask;
    this.newTask.title = this.taskToEdit.title;
    this.newTask.description = this.taskToEdit.description;
    this.newTask.user = this.taskToEdit.user;
    this.newTask.estimate = this.taskToEdit.estimate;
  }

  closeEditModal() {
    this.modalService.close('newTaskModal');
    this.taskToEdit = new Task(0, '', '', '', '');
    this.newTask = new Task(this.idTask, '', '', '', '');
    this.isEditTask = false;
  }
}
