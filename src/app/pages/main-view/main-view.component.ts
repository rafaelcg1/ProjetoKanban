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
import { isEmpty } from 'rxjs';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-main-view',
  templateUrl: './main-view.component.html',
  styleUrls: ['./main-view.component.scss'],
})
export class MainViewComponent implements OnInit {
  constructor(public modalService: ModalService, private fb: FormBuilder) { }

  block: boolean = false;

  tasksToDo: Task[] = [];
  tasksDoing: Task[] = [];
  tasksDone: Task[] = [];
  columns: Column[] = [];

  ngOnInit(): void {
    if(!localStorage.getItem('firstTimeRunning')){
      localStorage.clear();
      localStorage.setItem('firstTimeRunning', JSON.stringify('true'));
    }

    if (localStorage.getItem('users')) {
      this.users = JSON.parse(localStorage.getItem('users')!);
    }
    if (localStorage.getItem('tasksToDo')) {
      this.tasksToDo = JSON.parse(localStorage.getItem('tasksToDo')!);
    }
    if (localStorage.getItem('tasksDoing')) {
      this.tasksDoing = JSON.parse(localStorage.getItem('tasksDoing')!);
    }
    if (localStorage.getItem('tasksDone')) {
      this.tasksDone = JSON.parse(localStorage.getItem('tasksDone')!);
    }

    this.columns.push(new Column('A FAZER', this.tasksToDo, '0.0'));
    this.columns.push(new Column('EM ANDAMENTO', this.tasksDoing, '0.0'));
    this.columns.push(new Column('CONCLUIDO', this.tasksDone, '0.0'));

    this.calculateColumnStoryPercent();
    this.calculateUserStoryPercent();
  }

  board: Board = new Board('Meus Eventos', this.columns);

  users: Array<User> = new Array<User>();
  newUser: User = new User('', '0.0');
  idTask: number = 1;
  newTask: Task = new Task(this.idTask, '', '', '', Number.NaN);

  addUser(name: string) {
    if (this.newUser.name === "") {
      this.newUser = new User('', '0.0');
      alert('Favor preencher o nome do usuário');
      this.block = true;
    } else {
      if (name.length > 30) {
        this.newUser = new User('', '0.0');
        alert('Este campo tem limitação de 30 caracteres');
        this.block = true;
      }
      this.users.forEach((user) => {
        if (user.name == this.newUser.name) {
          this.newUser = new User('', '0.0');
          alert('Usuário já adicionado, favor criar outro');
          this.block = true;
        }
      });
    }
    if (this.block == false) {
      this.users.push(new User(name, '0.0'));

      this.newUser.name = '';
    }
    this.block = false;
    this.calculateColumnStoryPercent();
    this.calculateUserStoryPercent();
  }

  addTask(newTask: Task) {
    if (
      newTask.title.length > 44 ||
      newTask.description.length > 44 ||
      newTask.user.length > 44
    ) {
      alert('Todos os campos tem limitação de 44 caracteres');
      this.block = true;
    }
    if (
      newTask.title.length == 0 ||
      newTask.description.length == 0 ||
      newTask.user.length == 0 ||
      newTask.estimate == null ||
      isNaN(newTask.estimate)
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
      this.newTask = new Task(this.idTask, '', '', '', Number.NaN);
      this.taskToEdit = new Task(0, '', '', '', Number.NaN);
    }
    this.block = false;
    this.calculateColumnStoryPercent();
    this.calculateUserStoryPercent();
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
    this.calculateColumnStoryPercent();
    this.calculateUserStoryPercent();
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
    this.calculateColumnStoryPercent();
    this.calculateUserStoryPercent();
    this.taskToEdit = new Task(0, '', '', '', Number.NaN);
  }

  isEditTask: boolean = false;
  taskToEdit: Task = new Task(0, '', '', '', Number.NaN);
  editTask() {
    this.newTask.idTask = this.taskToEdit.idTask;
    this.newTask.title = this.taskToEdit.title;
    this.newTask.description = this.taskToEdit.description;
    this.newTask.user = this.taskToEdit.user;
    this.newTask.estimate = this.taskToEdit.estimate;
    this.calculateColumnStoryPercent();
    this.calculateUserStoryPercent();
  }

  closeEditModal() {
    this.modalService.close('newTaskModal');
    this.taskToEdit = new Task(0, '', '', '', Number.NaN);
    this.newTask = new Task(this.idTask, '', '', '', Number.NaN);
    this.isEditTask = false;
    this.calculateColumnStoryPercent();
    this.calculateUserStoryPercent();
  }

  calculateColumnStoryPercent() {
    let storySum: number = 0;
    let storyToDo: number = 0;
    let storyDoing: number = 0;
    let storyDone: number = 0;

    let toDoPercent: string = '0.0';
    let doingPercent: string = '0.0';
    let donePercent: string = '0.0';

    for (let column of this.board.columns) {
      column.tasks.forEach((task) => {
        storySum += task.estimate;
        switch (column.name) {
          case "A FAZER":
            storyToDo += task.estimate;
            break;
          case "EM ANDAMENTO":
            storyDoing += task.estimate;
            break;
          case "CONCLUIDO":
            storyDone += task.estimate;
            break;
        }
      });
    }
    toDoPercent = ((storyToDo / storySum) * 100).toFixed(1);
    doingPercent = ((storyDoing / storySum) * 100).toFixed(1);
    donePercent = ((storyDone / storySum) * 100).toFixed(1);

    if (isNaN(parseInt(toDoPercent)) || isNaN(parseInt(doingPercent)) || isNaN(parseInt(donePercent))) {
      toDoPercent = '0.0';
      doingPercent = '0.0';
      donePercent = '0.0';
    }

    this.board.columns[0].storyPercent = toDoPercent;
    this.board.columns[1].storyPercent = doingPercent;
    this.board.columns[2].storyPercent = donePercent;

    localStorage.setItem('tasksToDo', JSON.stringify(this.tasksToDo));
    localStorage.setItem('tasksDoing', JSON.stringify(this.tasksDoing));
    localStorage.setItem('tasksDone', JSON.stringify(this.tasksDone));
  }

  calculateUserStoryPercent() {
    for (let user of this.users) {
      let userStorySum: number = 0;
      let userStoryDone: number = 0;
      for (let column of this.board.columns) {
        column.tasks.forEach((task) => {
          if (task.user == user.name) {
            userStorySum += task.estimate;
            if (column.name == "CONCLUIDO") {
              userStoryDone += task.estimate;
            }
          }
        });
      }
      user.storyPercent = ((userStoryDone / userStorySum) * 100).toFixed(1);
      if (isNaN(parseInt(user.storyPercent))) {
        user.storyPercent = '0.0';
      }
    }
    localStorage.setItem('users', JSON.stringify(this.users));
  }
}
