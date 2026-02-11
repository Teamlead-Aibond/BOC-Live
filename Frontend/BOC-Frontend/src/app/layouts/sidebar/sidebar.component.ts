import { Component, OnInit, AfterViewInit, ElementRef, ViewChild, Input, OnChanges } from '@angular/core';
import MetisMenu from 'metismenujs/dist/metismenujs';
import {AppConfig} from "config";

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit, AfterViewInit, OnChanges {

  @Input() isCondensed = false;
  menu: any;
  menulist: any;
  ProfilePhoto;
  UserName;
  logo;
  customerNavigation=false;
  vendorNavigation=false;
  isPrimary;
  @ViewChild('sideMenu', { static: false }) sideMenu: ElementRef;
 
  constructor() { }

  ngOnInit() {
   this.UserName= localStorage.getItem("UserName")
   this.ProfilePhoto=localStorage.getItem("ProfilePhoto");
   this.isPrimary = localStorage.getItem("IsPrimay");


   if (localStorage.getItem("IdentityType") == '1') {
     this.logo=localStorage.getItem("CustomerLogo")
     this.customerNavigation =true;
     this.vendorNavigation=false;
   }
   if (localStorage.getItem("IdentityType") == '2') {
   this.logo=localStorage.getItem("VendorLogo")
    this.customerNavigation =false;
    this.vendorNavigation=true;
  }
   // this.logo = AppConfig.image_base_path + 'full_logo.png';

  }

  getMenuList() {
    if (localStorage.getItem("IdentityType") == '2') {
      //if (window.location.pathname.includes("vendor")) {

      this.menulist = [
        {
          name: 'Dashboard', link: '#', icon: 'remixicon-dashboard-line', slug_name: 'dashboard', children: [
           
          ]
        },
        {
          name: 'Repair Request',
          link: '#',
          slug_name: 'show-to-all',
          icon: 'fas fa-tools',
          children: [
            {
              name: 'Repair Request List',
              link: 'rr-list',
              icon: 'fa fa-star float-right text-primary'

            }
          ]
        },
        
        {
          name: 'Quotes',
          link: '#',
          slug_name: 'show-to-all',
          icon: 'fas fa-file-alt',
          children: [
           
          ]
        },
        {
          name: 'Purchase Order',
          link: '#',
          slug_name: 'show-to-all',
          icon: 'fas fa-clipboard-list',
          children: [
            {
              name: 'Purchase Order List',
              link: 'po-list',
              icon: 'fa fa-star float-right text-primary'

            }
          ]
        },
        {
          name: 'Invoice',
          link: '#',
          slug_name: 'show-to-all',
          icon: 'fa fa-files-o',
          children: [
            {
              name: 'Invoice List',
              link: 'vendor-bill',
              icon: 'fa fa-star float-right text-primary'

            }
          ]
        },
       
        {
          name: 'Shipping Tracking',
          link: '#',
          slug_name: 'show-to-all',
          icon: 'fas fa-shipping-fast',
          children: [
           
          ]
        },
        {
          name: 'Change Password',
          link: '#',
          slug_name: 'show-to-all',
          icon: 'remixicon-lock-2-line',
          children: [
            {
              name: 'Change Password',
              link: 'change-password',
              icon: 'fa fa-star float-right text-primary'

            },
          ]
        },
        {
          name: 'View / Update profile',
          link: '#',
          slug_name: 'show-to-all',
          icon: 'mdi mdi-update',
          children: [
            {
              name: 'My Profile',
              link: 'profile',
              icon: 'fa fa-star float-right text-primary'

            },
            {
              name: 'My Account',
              link: 'update-profile',
              icon: 'fa fa-star float-right text-primary'

            }
          ]
        },



      ];
      // let permissions = JSON.parse(localStorage.getItem("PermissionList"));
      // this.menulist = this.menulist.filter(function (value) {
      //   return permissions.includes(value.slug_name);
      // }, permissions);
      //}
    }

    if (localStorage.getItem("IdentityType") == '1') {
      //if (window.location.pathname.includes("vendor")) {

      this.menulist = [
        {
          name: 'Dashboard', link: '#', icon: 'remixicon-dashboard-line', slug_name: 'dashboard', children: [
            {
              name: 'My Dashboard',
              link: '#',
              icon: 'fa fa-star float-right text-primary'

            }
          ]
        },
        {
          name: 'Repair Request',
          link: '#',
          slug_name: 'show-to-all',
          icon: 'fas fa-tools',
          children: [
            {
              name: 'Repair Request List',
              link: 'rr-list',
              icon: 'fa fa-star float-right text-primary'

            }
          ]
        },

        {
          name: 'Quotes',
          link: '#',
          slug_name: 'show-to-all',
          icon: 'fas fa-file-alt',
          children: [
            {
              name: 'Sales Quotes List',
              link: 'quotes-list',
              icon: 'fa fa-star float-right text-primary'

            }
          ]
        },
        {
          name: 'Sales Order',
          link: '#',
          slug_name: 'show-to-all',
          icon: 'fas fa-shopping-cart',
          children: [
            {
              name: 'Sales Order List',
              link: 'so-list',
              icon: 'fa fa-star float-right text-primary'

            }
          ]
        },
        {
          name: 'Invoice',
          link: '#',
          slug_name: 'show-to-all',
          icon: 'fa fa-files-o',
          children: [
            {
              name: 'Invoice List',
              link: 'invoice-list',
              icon: 'fa fa-star float-right text-primary'

            }
          ]
        },
        {
          name: 'Warranty',
          link: '#',
          slug_name: 'show-to-all',
          icon: 'fas fa-certificate',
          children: [
           
          ]
        },
        {
          name: 'Shipping Tracking',
          link: '#',
          slug_name: 'show-to-all',
          icon: 'fas fa-shipping-fast',
          children: [
           
          ]
        },
        {
          name: 'Change Password',
          link: '#',
          slug_name: 'show-to-all',
          icon: 'remixicon-lock-2-line',
          children: [
            {
              name: 'Change Password',
              link: 'change-password',
              icon: 'fa fa-star float-right text-primary'

            },
          ]
        },
        {
          name: 'View / Update profile',
          link: '#',
          slug_name: 'show-to-all',
          icon: 'mdi mdi-update',
          children: [
            {
              name: 'My Profile',
              link: 'profile',
              icon: 'fa fa-star float-right text-primary'

            },
            {
              name: 'My Account',
              link: 'update-profile',
              icon: 'fa fa-star float-right text-primary'

            }
           
          ]
        },


      ];
      // let permissions = JSON.parse(localStorage.getItem("PermissionList"));
      // this.menulist = this.menulist.filter(function (value) {
      //   return permissions.includes(value.slug_name);
      // }, permissions);
      //}
    }
  }

  ngAfterViewInit() {
    this.menu = new MetisMenu(this.sideMenu.nativeElement);

    this._activateMenuDropdown();
  }

  ngOnChanges() {
    if (!this.isCondensed && this.sideMenu || this.isCondensed) {
      setTimeout(() => {
        this.menu = new MetisMenu(this.sideMenu.nativeElement);
      });
    } else if (this.menu) {
      this.menu.dispose();
    }
  }

  /**
   * small sidebar
   */
  smallSidebar() {
    document.body.classList.add('left-side-menu-sm');
    document.body.classList.remove('left-side-menu-dark');
    document.body.classList.remove('topbar-light');
  }

  /**
   * Dark sidebar
   */
  darkSidebar() {
    document.body.classList.remove('left-side-menu-sm');
    document.body.classList.toggle('left-side-menu-dark');
  }

  /**
   * Light Topbar
   */
  lightTopbar() {
    document.body.classList.add('left-side-menu-dark');
    document.body.classList.add('topbar-light');
    document.body.classList.remove('left-side-menu-sm');
    document.body.classList.remove('enlarged');

  }

  /**
   * Sidebar collapsed
   */
  sidebarCollapsed() {
    document.body.classList.add('enlarged');
    document.body.classList.remove('left-side-menu-dark');
    document.body.classList.remove('left-side-menu-sm');
    document.body.classList.remove('boxed-layout');

  }

  /**
   * Boxed Layout
   */
  boxedLayout() {
    document.body.classList.toggle('boxed-layout');
    document.body.classList.remove('left-side-menu-dark');
    document.body.classList.add('enlarged');
  }

  /**
   * Activates the menu dropdown
   */
  _activateMenuDropdown() {
    const links = document.getElementsByClassName('side-nav-link-ref');
    let menuItemEl = null;
    // tslint:disable-next-line: prefer-for-of
    // for (let i = 0; i < links.length; i++) {
    //   // tslint:disable-next-line: no-string-literal
    //   if (window.location.pathname === links[i]['pathname']) {
    //     menuItemEl = links[i];
    //     break;
    //   }
    // }

    // if (menuItemEl) {
    //   menuItemEl.classList.add('active');

    //   const parentEl = menuItemEl.parentElement;
    //   if (parentEl) {
    //     parentEl.classList.add('active');

    //     const parent2El = parentEl.parentElement;
    //     if (parent2El) {
    //       parent2El.classList.add('in');
    //     }

    //     const parent3El = parent2El.parentElement;
    //     if (parent3El) {
    //       parent3El.classList.add('active');
    //       parent3El.firstChild.classList.add('active');
    //     }
    //   }
    // }
  }

}
