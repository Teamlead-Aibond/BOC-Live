import { Component, OnInit, ChangeDetectorRef, Inject, EventEmitter } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonService } from 'src/app/core/services/common.service';
import { CustomvalidationService } from 'src/app/core/services/customvalidation.service';
import Swal from 'sweetalert2';
import { ConfirmedValidator } from 'src/app/core/services/confirmed.validator';
import { Const_Alert_pop_title, Const_Alert_pop_message } from 'src/assets/data/dropdown';
import { concat, Observable, of, Subject } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, map, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss']
})
export class AddUserComponent implements OnInit {
  IdentityType;
  IdentityId;
  roleList;
  countryList;
  UserForm: FormGroup;
  submitted = false;
  StateList;
  fileData;
  uploadedpath
  ProfilePhoto;
  DepartmentList;
  Status;
  RoleId;
  CountryId;
  StateId;
  public event: EventEmitter<any> = new EventEmitter();
  postData
  warehouseList: any[] = [];
  isSelectCustomer: boolean = false
  ShowMultipleCustomerIds: boolean = false
  CurrencyCode

  customers$: Observable<any> = of([]);
  customersInput$ = new Subject<string>();
  loadingCustomers: boolean = false;
  CustomersList: any[] = [];
  DefaultCountryList:any[] = [];
  IsUserUPSEnable
  UserNamedisplay
  constructor(public modalRef: BsModalRef,
    private fb: FormBuilder,
    private cd_ref: ChangeDetectorRef,
    private commonService: CommonService,
    private customValidator: CustomvalidationService,
    @Inject(BsModalRef) public data: any,) { }

  ngOnInit(): void {
    this.IdentityType = this.data.IdentityType;
    this.IdentityId = this.data.IdentityId;
    this.UserNamedisplay=this.data.UserName



    if (this.IdentityType == 0) {
      this.UserForm = this.fb.group({
        IdentityType: this.IdentityType,
        Title: ['', Validators.required],
        FirstName: ['', Validators.required],
        LastName: [''],
        RoleId: ['', Validators.required],
        Address1: [''],
        Address2: [''],
        CountryId: [''],
        StateId: [''],
        City: [''],
        Zip: [''],
        ProfilePhoto: [''],
        Email: ['', [Validators.required, Validators.email]],
        PhoneNo: ['', Validators.required],
        DepartmentId: [''],
        Status: [true],
        Fax: [''],
        Password: ['', Validators.compose([Validators.required, this.customValidator.patternValidator()])],
        ConfirmPassword: ['', [Validators.required]],
        Username: ['', [Validators.required]],
        WarehouseIds: [''],
        IsRestrictedCustomerAccess: ['', [Validators.required]],
        MultipleCustomerIds: [''],
        IsDisplayBaseCurrencyValue:[false],
        IsUserUPSEnable:[false],
        DefaultLocation:['',[Validators.required]],
        DefaultCurrencyCode:[''],
        AllowLocations:['',[Validators.required]],
      }, {
        validator: ConfirmedValidator('Password', 'ConfirmPassword')
      })
    } else {
      this.UserForm = this.fb.group({
        IdentityType: this.IdentityType,
        Title: ['', Validators.required],
        FirstName: ['', Validators.required],
        LastName: [''],
        //RoleId: ['', Validators.required],
        Address1: [''],
        Address2: [''],
        CountryId: [''],
        StateId: [''],
        City: [''],
        Zip: [''],
        ProfilePhoto: [''],
        Email: ['', [Validators.required, Validators.email]],
        PhoneNo: ['', Validators.required],
        //DepartmentId: [''],
        Status: [true],
        Fax: [''],
        Password: ['', Validators.compose([Validators.required, this.customValidator.patternValidator()])],
        ConfirmPassword: ['', [Validators.required]],
        Username: ['', [Validators.required]],
        WarehouseIds: ['', [Validators.required]],
        MultipleAccessIdentityIds: [''],
        IsRestrictExportReports:['']
      }, {
        validator: ConfirmedValidator('Password', 'ConfirmPassword')
      })
    }


    if (this.IdentityType == 1) {
      this.isSelectCustomer = true;
      this.UserForm.patchValue({
        "MultipleAccessIdentityIds": [this.IdentityId],
        "WarehouseIds": [1]
      })
    }
    else if (this.IdentityType == 2) {
      this.isSelectCustomer = false
      this.UserForm.patchValue({
        "MultipleAccessIdentityIds": [this.IdentityId],
        // "WarehouseIds": [1]
      })
    }
    this.getUserRoleList();
    this.getCountryList();
    this.getDepartmentList();
    this.getWarehouseList();
    this.loadCustomers();

  }
  onAllowLocationsChange(e){
    this.DefaultCountryList = []
    for (var x in e) {

      for (var y in this.countryList) {
          if (e[x].CountryId == this.countryList[y].CountryId) {
            this.DefaultCountryList.push(this.countryList[y])
          }
      }
    } 
  }
  getCurrencyCode(e){
    var postData={
      CountryId:e.target.value
    }
    this.commonService.postHttpService(postData,"getCurrencyCode").subscribe(response => {
      if (response.status == true) {
        this.CurrencyCode = response.responseData.CurrencyCode
        this.UserForm.patchValue({
          DefaultCurrencyCode:this.CurrencyCode
        })
      }
      else {

      }
      this.cd_ref.detectChanges();
    }, error => console.log(error));
  }
  
  getWarehouseList() {
    this.commonService.getHttpService('getWarehouseList').subscribe(response => {
      this.warehouseList = response.responseData.map(function (value) {
        return { name: value.WarehouseName, "id": value.WarehouseId }
      });
    });
  }

  getUserRoleList() {
    this.commonService.getUserRoleList().subscribe(response => {
      if (response.status == true) {
        this.roleList = response.responseData;
      } else { }
      this.cd_ref.detectChanges();
    }, error => console.log(error));
  }

  getCountryList() {
    this.commonService.getconutryList().subscribe(response => {
      if (response.status == true) {
        this.countryList = response.responseData;
      } else { }
      this.cd_ref.detectChanges();
    }, error => console.log(error));
  }
  
  getDepartmentList() {
    this.commonService.getHttpService("getDepartmentList").subscribe(response => {
      if (response.status == true) {
        this.DepartmentList = response.responseData;
      } else { }
      this.cd_ref.detectChanges();
    }, error => console.log(error));
  }

  getState(event, CountryId) {
    var postData = {
      CountryId: CountryId
    }
    this.commonService.getHttpServiceStateId(postData, "getStateListDropdown").subscribe(response => {
      if (response.status == true) {
        this.StateList = response.responseData
      } else { }
      this.cd_ref.detectChanges();
    }, error => console.log(error));
  }

  //get UserForm validation control
  get UserFormControl() {
    return this.UserForm.controls;
  }

  triggerEvent(item: string) {
    this.event.emit({ data: item, res: 200 });
  }


  // image process
  fileProgress(fileInput: any) {
    this.fileData = <File>fileInput.target.files[0];
    const formData = new FormData();
    formData.append('file', this.fileData);
    this.preview();
    this.commonService.postHttpImageService(formData, "getUserimageupload").subscribe(response => {
      this.uploadedpath = response.responseData.location;
      this.cd_ref.detectChanges();
    }, error => console.log(error));
  }

  preview() {
    // Show preview
    var mimeType = this.fileData.type;
    if (mimeType.match(/image\/*/) == null) {
      return;
    }

    var reader = new FileReader();
    reader.readAsDataURL(this.fileData);
    reader.onload = (_event) => {
      this.UserForm.value.ProfilePhoto = reader.result;
      this.ProfilePhoto = reader.result;

    }
  }

  onSubmit() {
    this.submitted = true;
    if (this.UserForm.valid) {
      if (this.UserForm.value.Status == true) {
        this.Status = 1
      }
      else {
        this.Status = 0
      }
      if (this.IdentityType == 0 && this.UserForm.value.MultipleCustomerIds != '') {
        var MultipleCustomerIds = this.UserForm.value.MultipleCustomerIds.join(",")
      } else {
        MultipleCustomerIds = ''
      }
      if (this.UserForm.value.IsUserUPSEnable == true) {
      var IsUserUPSEnable = 1
      }
      else {
        IsUserUPSEnable = 0
      }
      if (this.UserForm.value.IsDisplayBaseCurrencyValue == true) {
        var IsDisplayBaseCurrencyValue = 1
        }
        else {
          IsDisplayBaseCurrencyValue = 0
        }
        if (this.UserForm.value.IsRestrictExportReports == true) {
          var IsRestrictExportReports = 1
          }
          else {
            IsRestrictExportReports = 0
          }
      if (this.IdentityType == 0) {

        this.postData = {
          IdentityId: this.IdentityId,
          UserList: [{
            IdentityType: this.IdentityType,
            Title: this.UserForm.value.Title,
            FirstName: this.UserForm.value.FirstName,
            LastName: this.UserForm.value.LastName,
            RoleId: this.UserForm.value.RoleId,
            Address1: this.UserForm.value.Address1,
            Address2: this.UserForm.value.Address2,
            CountryId: this.UserForm.value.CountryId,
            StateId: this.UserForm.value.StateId,
            City: this.UserForm.value.City,
            Zip: this.UserForm.value.Zip,
            PhoneNo: this.UserForm.value.PhoneNo,
            Email: this.UserForm.value.Email,
            Fax: this.UserForm.value.Fax,
            Password: this.UserForm.value.Password,
            ConfirmPassword: this.UserForm.value.ConfirmPassword,
            DepartmentId: this.UserForm.value.DepartmentId,
            Status: this.Status,
            Username: this.UserForm.value.Username,
            ProfilePhoto: this.uploadedpath,
            WarehouseIds: this.UserForm.value.WarehouseIds ?this.UserForm.value.WarehouseIds.join(","):'',
            IsRestrictedCustomerAccess: this.UserForm.value.IsRestrictedCustomerAccess,
            MultipleCustomerIds: MultipleCustomerIds,
            IsDisplayBaseCurrencyValue:IsDisplayBaseCurrencyValue,
            IsUserUPSEnable:IsUserUPSEnable,
            DefaultLocation:this.UserForm.value.DefaultLocation,
            DefaultCurrencyCode:this.UserForm.value.DefaultCurrencyCode,
            AllowLocations:this.UserForm.value.AllowLocations.join(","),
          }]
        }
      } else {
        if (this.UserForm.value.MultipleAccessIdentityIds != '') {
          var MultipleAccessIdentityIds = this.UserForm.value.MultipleAccessIdentityIds.join(",")
        } else {
          MultipleAccessIdentityIds = this.IdentityId
        }
        this.postData = {
          IdentityId: this.IdentityId,
          UserList: [{
            IdentityType: this.IdentityType,
            Title: this.UserForm.value.Title,
            FirstName: this.UserForm.value.FirstName,
            LastName: this.UserForm.value.LastName,
            //RoleId: this.UserForm.value.RoleId,
            Address1: this.UserForm.value.Address1,
            Address2: this.UserForm.value.Address2,
            CountryId: this.UserForm.value.CountryId,
            StateId: this.UserForm.value.StateId,
            City: this.UserForm.value.City,
            Zip: this.UserForm.value.Zip,
            PhoneNo: this.UserForm.value.PhoneNo,
            Email: this.UserForm.value.Email,
            Fax: this.UserForm.value.Fax,
            Password: this.UserForm.value.Password,
            ConfirmPassword: this.UserForm.value.ConfirmPassword,
            // DepartmentId: this.UserForm.value.DepartmentId,
            Status: this.Status,
            Username: this.UserForm.value.Username,
            ProfilePhoto: this.uploadedpath,
            WarehouseIds: this.UserForm.value.WarehouseIds.join(","),
            MultipleAccessIdentityIds: MultipleAccessIdentityIds,
            IsRestrictExportReports:IsRestrictExportReports
          }]
        }
      }
      this.commonService.postHttpService(this.postData, "getUserCreate").subscribe(response => {
        if (response.status == true) {
          this.triggerEvent(response.responseData.UserList[0]);
          this.modalRef.hide();
          Swal.fire({
            title: 'Success!',
            text: 'User saved Successfully!',
            type: 'success',
            confirmButtonClass: 'btn btn-confirm mt-2'
          });
        }
        else {
          Swal.fire({
            title: 'Error!',
            text: response.message,
            type: 'warning',
            confirmButtonClass: 'btn btn-confirm mt-2'
          });
        }
        this.cd_ref.detectChanges();
      }, error => console.log(error));
    }
    else {
      Swal.fire({
        type: 'error',
        title: Const_Alert_pop_title,
        text: Const_Alert_pop_message,
        confirmButtonClass: 'btn btn-confirm mt-2',
      });

    }
  }




  loadCustomers() {
    this.customers$ = concat(
      this.searchCustomers().pipe( // default items
        catchError(() => of([])), // empty list on error
      ),
      this.customersInput$.pipe(
        distinctUntilChanged(),
        debounceTime(800),
        switchMap(term => {
          if (term != null && term != undefined)
            return this.searchCustomers(term).pipe(
              catchError(() => of([])), // empty list on error
            )
          else
            return of([])
        })
      )
    );
  }

  searchCustomers(term: string = ""): Observable<any> {
    this.loadingCustomers = true;
    var postData = {
      "Customer": term
    }
    return this.commonService.postHttpService(postData, "getAllAutoComplete")
      .pipe(
        map(response => {
          this.CustomersList = response.responseData;
          this.loadingCustomers = false;
          return response.responseData;
        })
      );
  }

  selectAll() {
    let customerIds = this.CustomersList.map(a => a.CustomerId);
    let cMerge = [...new Set([...customerIds, ...this.UserForm.value.MultipleAccessIdentityIds])];
    this.UserForm.patchValue({ "MultipleAccessIdentityIds": cMerge })

  }

  selectAllMultipleCustomerIds() {
    let customerIds = this.CustomersList.map(a => a.CustomerId);
    let cMerge = [...new Set([...customerIds, ...this.UserForm.value.MultipleCustomerIds])];
    this.UserForm.patchValue({ "MultipleCustomerIds": cMerge })
  }


  onRestrictedCustomerAccess(e) {
    if (e.target.value == 1) {
      this.ShowMultipleCustomerIds = true
    } else {
      this.ShowMultipleCustomerIds = false;
      this.UserForm.patchValue({
        "MultipleCustomerIds": ''
      })
    }

  }
}
