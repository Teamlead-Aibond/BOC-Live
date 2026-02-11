import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit, AfterViewInit {
  showNav: boolean = false;
  showMobileMenu = false;
  showSideNav: boolean = false;
  isCondensed = false;
  constructor(private router: Router) { }

  ngOnInit() {
    if (localStorage.getItem("IdentityType") == "0") {
      this.showNav = true;

    }
    else {
      this.showNav = false

    }
    if (localStorage.getItem("IdentityType") == "2" || localStorage.getItem("IdentityType") == "1") {
      this.showSideNav = true;

    }
    else {
      this.showSideNav = false

    }
  }

  ngAfterViewInit() {
    document.body.classList.remove('authentication-bg');
  }

  /**
   * on settings button clicked from topbar
   */
  onSettingsButtonClicked() {
    document.body.classList.toggle('right-bar-enabled');
  }

  /**
   * On mobile toggle button clicked
   */
  // onToggleMobileMenu() {
  //   alert(1)
  //   this.showMobileMenu = !this.showMobileMenu;
  //   document.body.classList.toggle('sidebar-enable');
  //   document.body.classList.toggle('enlarged');
  //   this.isCondensed = !this.isCondensed;

  // }
  // onToggleMobileMenu() {
  //   document.body.classList.toggle('sidebar-enable');
  //   document.body.classList.toggle('enlarged');
  //   this.isCondensed = !this.isCondensed;
  // }

  onToggleMobileMenu() {
    this.showMobileMenu = !this.showMobileMenu;
    document.body.classList.toggle('sidebar-enable');
    document.body.classList.toggle('enlarged');
     this.isCondensed = !this.isCondensed;
  }
}
