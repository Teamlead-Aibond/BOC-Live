import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { AuthenticationService } from '../../core/services/auth.service';
import { CommonService } from 'src/app/core/services/common.service';
import { NgxNavigationWithDataComponent } from 'ngx-navigation-with-data';
import { AppConfig } from 'config';
import { concat, Observable, of, Subject } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, map, switchMap } from 'rxjs/operators';
import { CONST_CREATE_ACCESS } from 'src/assets/data/dropdown';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss'],
  providers: [
    NgxSpinnerService
  ],
})
export class TopbarComponent implements OnInit {
  globalSearch$: Observable<any> = of([]);
  globalSearchInput$ = new Subject<string>();
  loadingGlobalSearch: boolean = false;
  ResultData:any=[]
  logo;
  smLogo;
  isClosed: boolean = true;
  notificationItems: Array<any>;
  languages: Array<{
    id: number,
    flag?: string,
    name: string
  }>;
  selectedLanguage: {
    id: number,
    flag?: string,
    name: string
  };
  notification
  IsTopBulkShipping: boolean = false
  showFiller: boolean
  showSideNav: boolean = false;
  openMobileMenu: boolean;
  sideNavnotification: boolean = false;
  searchQuery: string = null;
  ProfilePhoto;
  UserName;
  showadminonly = false;
  identityType
  @Output() settingsButtonClicked = new EventEmitter();
  @Output() mobileMenuButtonClicked = new EventEmitter();
  LocationName
  AllowLocationsDropdown:any=[]
  DefaultCountryName
  workchainCount: any;
  workchainAlert: any = 0;
  loginType: any;
  CustomerId: any;
  cartCount: any = 0;
  constructor(private router: Router, private authService: AuthenticationService,
    private commonService: CommonService,private spinner: NgxSpinnerService,private route: ActivatedRoute

    ) {
      this.loginType = localStorage.getItem("IdentityType");
      this.CustomerId = localStorage.getItem("IdentityId");
     }
    currentRouter = this.router.url;

  ngOnInit() {
    this.commonService.getCount.subscribe(count => this.cartCount = count);
    this.logo = AppConfig.image_base_path + 'full_logo.png';
    this.smLogo = AppConfig.image_base_path + 'logo.png';
    this.ProfilePhoto = localStorage.getItem("ProfilePhoto");
    this.workchainAlert = localStorage.getItem("workchainAlert");
    this.UserName = localStorage.getItem("UserName")
    if (localStorage.getItem("IdentityType") == "0") {
      this.showadminonly = true;

    }
    if (localStorage.getItem("IdentityType") != "0") {
      this.showSideNav = true;

    }
    else {
      this.showSideNav = false

    }
    // get the notifications
    this._fetchNotifications();
    // get the workchainCount
    this._fetchWorkchainCount();
    // get the language
    this._fetchLanguages();

    this._fetchCartCount();
    this.IsTopBulkShipping = this.commonService.permissionCheck("BulkShipping", CONST_CREATE_ACCESS);
    this.selectedLanguage = this.languages[0];
    this.openMobileMenu = false;

    this.loadGlobalSearch()

    this.identityType = localStorage.getItem("IdentityType");

    this.LocationName = localStorage.getItem("LocationName");
    this.AllowLocationsDropdown = JSON.parse(localStorage.getItem("AllowLocationsDropdown"));
    this.DefaultCountryName = localStorage.getItem("DefaultCountryName");

  }


  /**
   * Change the language
   * @param language language
   */
  changeLanguage(language) {
    this.selectedLanguage = language;
  }

  /**
   * Toggles the right sidebar
   */
  toggleRightSidebar() {
    this.settingsButtonClicked.emit();
  }

  /**
   * Toggle the menu bar when having mobile screen
   */
  toggleMobileMenu(event: any) {
    event.preventDefault();
    //this.openMobileMenu = !this.openMobileMenu;
    this.mobileMenuButtonClicked.emit();
  }

  changePassword() {
    this.router.navigate(['/admin/change_password']);
  }

  viewMyWorkchain(){
    this.router.navigate(['/admin/repair-request/workchain-list']);
  }

  viewProfile() {
    if (localStorage.getItem("IdentityType") == "2") {

      this.router.navigate(['vendor/update-profile']);
    }
    if (localStorage.getItem("IdentityType") == "1") {

      this.router.navigate(['customer/Update-Profile']);
    }
    if (localStorage.getItem("IdentityType") == "0") {

      this.router.navigate(['/admin/profile-update']);
    }
  }

  // toggleMobileMenu(event: any) {
  //   event.preventDefault();
  //   this.mobileMenuButtonClicked.emit();
  // }
  /**
   * Logout the user
   */
  logout() {
    this.authService.logout();
    this.router.navigate(['/account/login']);
   // this.router.navigate(['/account/junologin']);
  }

  /**
   * Fetches the supported languages
   */
  _fetchLanguages() {
    this.languages = [{
      id: 1,
      name: 'English',
      flag: 'assets/images/flags/us.jpg',
    },
    {
      id: 2,
      name: 'German',
      flag: 'assets/images/flags/germany.jpg',
    },
    {
      id: 3,
      name: 'Italian',
      flag: 'assets/images/flags/italy.jpg',
    },
    {
      id: 4,
      name: 'Spanish',
      flag: 'assets/images/flags/spain.jpg',
    },
    {
      id: 5,
      name: 'Russian',
      flag: 'assets/images/flags/russia.jpg',
    }];

    this.selectedLanguage = this.languages[0];
  }

  /**
   * Fetches the notification
   * Note: For now returns the hard coded notifications
   */
  _fetchNotifications() {
    if (localStorage.getItem("IdentityType") == "0") {
      this.commonService.getHttpService('getLatestNotification').subscribe(response => {
        this.notificationItems = response.responseData
      });
      this.notification = true;
      this.sideNavnotification = false
    }
    else {
      this.notification = false;
      this.sideNavnotification = true;

      this.notificationItems = [{
        text: 'RR0045878 - New RR has been created by SuperUser',
        subText: '1 min ago',
        icon: 'mdi mdi-comment-account-outline',
        bgColor: 'primary',
        redirectTo: '/notification/1'
      },
      {
        text: 'RR0045878 - Quote approved by customer (Amazon TEB6)',
        subText: '5 mins ago',
        icon: 'mdi mdi-account-plus',
        bgColor: 'info',
        redirectTo: '/notification/2'
      },
      {
        text: 'RR0045848 - Submitted to Vendor (2V INDUSTRIES)',
        subText: '15 mins agao',
        icon: 'mdi mdi-comment-account-outline',
        bgColor: 'success',
        redirectTo: '/notification/3'
      },
      {
        text: 'PO033040 - Generated by Super User',
        subText: '2 hours ago',
        icon: 'mdi mdi-comment-account-outline',
        bgColor: 'danger',
        redirectTo: '/notification/4'
      },
      {
        text: 'New customer UTC-Mikro added by Super User',
        subText: '3 hours ago',
        icon: 'mdi mdi-comment-account-outline',
        bgColor: 'primary',
        redirectTo: '/notification/5'
      },
      {
        text: 'RR0045342 - Quote rejected by customer.',
        subText: '1 day ago',
        icon: 'mdi mdi-account-plus',
        bgColor: 'info',
        redirectTo: '/notification/6'
      },
      {
        text: 'RR0044572 - Needs Sourcing',
        subText: '2 days ago',
        icon: 'mdi mdi-comment-account-outline',
        bgColor: 'success',
        redirectTo: '/notification/7'
      },
      {
        text: 'RR0045348 - Awaiting Vendor Estimate(2V INDUSTRIES)',
        subText: '3 days ago',
        icon: 'mdi mdi-comment-account-outline',
        bgColor: 'danger',
        redirectTo: '/notification/8'
      }];
    }
  }

  _fetchWorkchainCount(){
    this.commonService.getHttpService('getWorkchainCount').subscribe(response => {
      this.workchainCount = response.responseData;
    });
  }
  _fetchCartCount(){
    this.commonService.getCartCount();
    // var postData = {
    //   CustomerId: localStorage.getItem("IdentityId")
    // }
    // this.commonService.postHttpService(postData, 'getCartCount').subscribe(response => {
    //   if(response.status == true){
    //     this.cartCount = response.responseData.count;
    //   }
    // });
  }
  

  //On search enter or search button click
  onEnter(e) {
    var searchQuery =e.target.value
    if (searchQuery) {
      let identityType = localStorage.getItem("IdentityType");

      if (identityType == "1") {
        this.router.navigate(["/customer/search-result"], { queryParams: { query: searchQuery } })
      } else if (identityType == "2") {
        this.router.navigate(["/vendor/search-result"], { queryParams: { query: searchQuery } })
      } else {
        this.router.navigate(["/admin/search-result"], { queryParams: { query: searchQuery } })
      }
    }
  }


  loadGlobalSearch() {
    this.globalSearch$ = concat(
      // this.searchGlobalAutoSuggest().pipe( // default items
      //   catchError(() => of([])), // empty list on error
      // ),
      this.globalSearchInput$.pipe(
        distinctUntilChanged(),
        debounceTime(800),
        switchMap(term => {
          if (term != null && term != undefined)
            return this.searchGlobalAutoSuggest(term).pipe(
              catchError(() => of([])), // empty list on error
            )
          else
            return of([])
        })
      )
    );
  }

  searchGlobalAutoSuggest(term: string = ""): Observable<any> {
    this.loadingGlobalSearch = true;
    var postData = {
      "SearchText": term
    }
    return this.commonService.postHttpService(postData, "GlobalAutoSuggest")
      .pipe(
        map(response => {
           this.ResultData = response.responseData.data;
          // this.ResultData = response.responseData.data.map(function (value) {
          //   return { title: value.IdentityNo, "IdentityId": value.IdentityId, "IdentityType": value.IdentityType }
          // });
          this.loadingGlobalSearch = false;
          return response.responseData.data;
        })
      );
  }


  changeLocation(item){
    this.LocationName = item.CountryName
    this.spinner.show();
    var postData = {
      Location: item.CountryId
    }
    this.commonService.postHttpService(postData, "changeDefaultLocation").subscribe(data => {
        if (data.status === true) {
          localStorage.setItem("Access-Token", data.responseData.login.accessToken);
          localStorage.setItem("UserId", data.responseData.login.UserId);
          localStorage.setItem("UserName", data.responseData.login.FirstName + " " + data.responseData.login.LastName);
          localStorage.setItem("IdentityType", data.responseData.login.IdentityType)
          localStorage.setItem("IdentityId", data.responseData.login.IdentityId)
          localStorage.setItem("ProfilePhoto", data.responseData.login.ProfilePhoto)
          localStorage.setItem("IsPrimay", data.responseData.login.IsPrimay)
          localStorage.setItem("IsDisplayBaseCurrencyValue", data.responseData.login.IsDisplayBaseCurrencyValue)
          localStorage.setItem("Location", data.responseData.login.Location)
          localStorage.setItem("BaseCurrencyCode", data.responseData.login.DefaultCurrency)
          localStorage.setItem("BaseCurrencySymbol", data.responseData.login.CurrencySymbol)
          localStorage.setItem("IsSuperAdmin", data.responseData.login.IsSuperAdmin)
  
          localStorage.setItem("LocationName", data.responseData.login.LocationCountryName)
          localStorage.setItem("DefaultCountryName", data.responseData.login.DefaultCountryName)
          localStorage.setItem("DefaultCountryCode", data.responseData.login.DefaultCountryCode)
          localStorage.setItem("DefaultCurrencySymbol", data.responseData.login.DefaultCurrencySymbol)
          localStorage.setItem("DefaultCurrencyCode", data.responseData.login.DefaultCurrencyCode)
          localStorage.setItem("DefaultLocation", data.responseData.login.DefaultLocation)
          localStorage.setItem("AllowLocationsDropdown", JSON.stringify(data.responseData.login.AllowLocationsDropdown))
  
          if (data.responseData.login.IdentityType == "1") {
            localStorage.setItem("CustomerLogo", data.responseData.login.CustomerLogo)
          }
          if (data.responseData.login.IdentityType == "2") {
            localStorage.setItem("VendorLogo", data.responseData.login.VendorLogo)
          }
  
          // Access Rights
          if (data.responseData.permission.length > 0) {
            let rights: any = {};
            // Store all the rights in a single item
            // localStorage.setItem("accessRights", JSON.stringify(data.responseData.permission));     
  
            for (let val of data.responseData.permission) {
              rights[val.PermissionCode] = val.Permission;
            }
            // console.log("accessRights", rights);  
            localStorage.setItem("accessRights", JSON.stringify(rights));
          }
          this.reLoad()
        }
       
      
      else {

      }
    }, error => console.log(error));
  }

  reLoad() {
    this.route.queryParams.subscribe(
      params => {
        if(params){
          this.router.navigate([this.currentRouter.split('?')[0]], { queryParams: params })
        }else{
        this.router.navigate([this.router.url])
        }
      }
    )
    this.spinner.hide()
  }

  closeWorkchainAlert(){
    this.isClosed=false;
    localStorage.setItem('workchainAlert', '1'); 
  }

  viewMyCart(){
    
  }
}