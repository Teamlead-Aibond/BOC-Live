import { Component, OnInit } from '@angular/core';

import { Inbox } from './rightsidebar.model';

import { quicklinks } from './data';

@Component({
  selector: 'app-rightsidebar',
  templateUrl: './rightsidebar.component.html',
  styleUrls: ['./rightsidebar.component.scss']
})
export class RightsidebarComponent implements OnInit {

  quicklinks: any;

  constructor() { }

  ngOnInit() {
    /**
     * fetches data
     */
    this._fetchData();
  }

  /**
   * Hide the sidebar
   */
  public hide() {
    document.body.classList.remove('right-bar-enabled');
  }

  /**
   * fetches the inbox value
   */
  private _fetchData() {
    this.quicklinks = quicklinks;
  }
}
