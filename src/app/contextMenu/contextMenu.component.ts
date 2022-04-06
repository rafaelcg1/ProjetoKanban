import { Component, Input, Output, EventEmitter } from "@angular/core";
import { ContextMenuModel } from "../interfaces/contextMenu.model";

@Component({
  selector: "app-context-menu",
  templateUrl: "./contextMenu.component.html",
  styleUrls: ["./contextMenu.component.scss"],
})
export class ContextMenuComponent {
  @Input()
  contextMenuItems: Array<ContextMenuModel>;

  @Output()
  onContextMenuItemClick: EventEmitter<any> = new EventEmitter<any>();

  onContextMenuClick(event: any, data: any): any {
    this.onContextMenuItemClick.emit({
      event,
      data,
    });
  }
}