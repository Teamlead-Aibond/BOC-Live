import { Component, OnInit, AfterViewInit, Input } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { AppConfig } from "config";


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit, AfterViewInit {

  @Input() showMobileMenu: boolean;
  menu: any;
  menulist: any;
  pathname;

  constructor(router: Router) {
    router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.activateMenu();
      }
    });

  }

  ngOnInit() {
    const CONFIG = require('src/' + AppConfig.image_base_path + 'config.ts');
    this.showMobileMenu = false;
    this.menulist = CONFIG.CONFIG.menuList;
  }



  ngAfterViewInit() {
    this.activateMenu();
  }

  /**
   * On menu click
   */
  onMenuClick(event: any) {
    const nextEl = event.target.nextSibling;
    if (nextEl && !nextEl.classList.contains('open')) {
      const parentEl = event.target.parentNode;
      if (parentEl) { parentEl.classList.remove('open'); }

      nextEl.classList.add('open');
    } else if (nextEl) { nextEl.classList.remove('open'); }
    return false;
  }

  /**
   * Dark Menubar
   */
  darkMenubar() {
    document.body.classList.add('menubar-dark');
    document.body.classList.remove('topbar-light');
    document.body.classList.remove('unsticky-header');
    document.body.classList.remove('boxed-layout');
  }

  /**
   * Light Topbar
   */
  lightTopbar() {
    document.body.classList.add('menubar-dark');
    document.body.classList.add('topbar-light');
    document.body.classList.remove('boxed-layout');
    document.body.classList.remove('center-menu');
  }

  /**
   * Show menu in center
   */
  centerMenu() {
    document.body.classList.add('center-menu');
    document.body.classList.remove('menubar-dark');
    document.body.classList.remove('topbar-light');
    document.body.classList.remove('boxed-layout');
  }

  /**
   * Unsticky Header
   */
  unstickyHeader() {
    document.body.classList.add('unsticky-header');
    document.body.classList.remove('boxed-layout');
  }

  /**
   * Boxed Layout
   */
  boxedLayout() {
    document.body.classList.add('boxed-layout');
    document.body.classList.remove('menubar-dark');
    document.body.classList.remove('topbar-light');
  }

  /**
   * Activates the menu
   */
  private activateMenu() {

    const resetParent = (el: any) => {
      const parent = el.parentElement;
      // if (parent) {
      //   // parent.classList.remove('active');

      //   const parent2 = parent.parentElement;
      //   if (parent2) {
      //     const parent3 = parent2.parentElement;
      //     if (parent3) {
      //       parent3.classList.remove('active');
      //       const parent4 = parent3.parentElement;
      //       if (parent4) {
      //         const parent5 = parent4.parentElement;
      //         if (parent5) {
      //           parent5.classList.remove('active');
      //         }
      //       }
      //     }
      //   }
      // }
    };

    // activate menu item based on location
    const links = document.getElementsByClassName('side-nav-link-ref');
    let matchingMenuItem = null;
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < links.length; i++) {
      // reset menu
      resetParent(links[i]);
    }
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < links.length; i++) {
      // tslint:disable-next-line: no-string-literal
      if (location.pathname === links[i]['pathname']) {
        matchingMenuItem = links[i];
        break;
      }
    }

    if (matchingMenuItem) {
      const parent = matchingMenuItem.parentElement;

      /**
       * TODO: This is hard coded way of expading/activating parent menu dropdown and working till level 3.
       * We should come up with non hard coded approach
       */
      // if (parent) {
      //   parent.classList.add('active');
      //   const parent2 = parent.parentElement;
      //   if (parent2) {
      //     const parent3 = parent2.parentElement;
      //     if (parent3) {
      //       parent3.classList.add('active');
      //       const parent4 = parent3.parentElement;
      //       if (parent4) {
      //         const parent5 = parent4.parentElement;
      //         if (parent5) {
      //           parent5.classList.add('active');
      //         }
      //       }
      //     }
      //   }
      // }
    }
  }
}
