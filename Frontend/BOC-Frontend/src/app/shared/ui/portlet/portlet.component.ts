import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-portlet',
  templateUrl: './portlet.component.html',
  styleUrls: ['./portlet.component.scss']
})
export class PortletComponent implements OnInit {

  public isCollapsed: boolean;
  @Input() title: string;
  @Input() color: string;
  @Input() text: string;
  @Input() headerClass: string;

  // tslint:disable-next-line: no-output-on-prefix
  @Output() onContentRefresh: EventEmitter<any> = new EventEmitter();

  isLoading: boolean;
  isVisible: boolean;

  constructor() { }

  ngOnInit() {
    this.isCollapsed = false;
    this.isLoading = false;
    this.isVisible = true;
  }

  /**
   * Refreshes the content
   */
  refreshContent() {
    this.isLoading = true;

    // event emit to let parent know about data refresh
    this.onContentRefresh.emit();

    setTimeout(() => {
      this.isLoading = false;
    }, 2000);
  }

  /**
   * Removes self from dom
   */
  remove() {
    this.isVisible = false;
  }

}


