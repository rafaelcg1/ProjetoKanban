import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TextFieldModule } from '@angular/cdk/text-field';

import { MainViewComponent } from './pages/main-view/main-view.component';

import { ModalModule } from './modals/modal.module';
import { MatMenuModule } from '@angular/material/menu';
import { ContextMenuComponent } from './contextMenu/contextMenu.component';

@NgModule({
  declarations: [
    AppComponent,
    MainViewComponent,
    ContextMenuComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    DragDropModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    TextFieldModule,
    CommonModule,
    ModalModule,
    MatMenuModule,
    BrowserAnimationsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }