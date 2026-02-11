import { Component, OnInit, ChangeDetectorRef, Inject, EventEmitter } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonService } from 'src/app/core/services/common.service';
import { CustomvalidationService } from 'src/app/core/services/customvalidation.service';
import Swal from 'sweetalert2';
import { ConfirmedValidator } from 'src/app/core/services/confirmed.validator';
import { Const_Alert_pop_title, Const_Alert_pop_message } from 'src/assets/data/dropdown';
import { UserChangePasswordComponent } from '../user-change-password/user-change-password.component';
import { concat, Observable, of, Subject } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, map, switchMap } from 'rxjs/operators';
@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss']
})
export class EditUserComponent implements OnInit {
  IdentityType;
  IdentityId;
  countryList;
  UserForm: FormGroup;
  submitted = false;
  StateList;
  uploadedpath;
  DepartmentList;
  public event: EventEmitter<any> = new EventEmitter();
  result;
  index;
  CountryId;
  StateId;
  Status;
  fileData;
  ProfilePhoto;
  RoleId;
  oldRoleId;
  roleList;
  postData;
  newAccessRights;
  warehouseList: any[] = [];

  isSelectCustomer: boolean = false;
  ShowMultipleCustomerIds: boolean = false

  customers$: Observable<any> = of([]);
  customersInput$ = new Subject<string>();
  loadingCustomers: boolean = false;
  CustomersList: any[] = [];
  CurrencyList:any=[]
  IsDisplayBaseCurrencyValue
  CurrencyCode
  DefaultCountryList:any[] = [];
  LocationName
  IsUserUPSEnable
  IsRestrictExportReports
  UserNamedisplay
  constructor(public modalRef: BsModalRef,
    private fb: FormBuilder,
    private modalService: BsModalService,
    private cd_ref: ChangeDetectorRef,
    private commonService: CommonService,
    private customValidator: CustomvalidationService,
    @Inject(BsModalRef) public data: any,) { }

  ngOnInit(): void {
    this.result = this.data.users;
    this.getCountryList();
    this.index = this.data.i
    this.IdentityType = this.data.IdentityType;
    this.IdentityId = this.data.IdentityId;
    this.UserNamedisplay=this.data.UserName
    if (this.IdentityType == 0) {
      this.UserForm = this.fb.group({
        UserId: ['', Validators.required],
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
        Username: ['', [Validators.required]],
        WarehouseIds: [[]],
        IsRestrictedCustomerAccess: ['', [Validators.required]],
        MultipleCustomerIds: [''],
        IsDisplayBaseCurrencyValue:[false],
        IsUserUPSEnable:[false],
        DefaultLocation:['',[Validators.required]],
        DefaultCurrencyCode:[''],
        AllowLocations:['',[Validators.required]],
      },
      )
    } else {
      this.UserForm = this.fb.group({
        UserId: ['', Validators.required],
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
        Username: ['', [Validators.required]],
        WarehouseIds: [[], [Validators.required]],
        MultipleAccessIdentityIds: [''],
        IsRestrictExportReports:['']
      },
      )
    }

    if (this.IdentityType == 1) {
      this.isSelectCustomer = true
    }
    else if (this.IdentityType == 2) {
      this.isSelectCustomer = false
      this.UserForm.patchValue({
        "MultipleAccessIdentityIds": [this.IdentityId]
      })
    }
    this.getUserRoleList();
    this.getDepartmentList();
    this.loadCustomers();

    // this.getWarehouseList();

    this.RoleId = this.result.RoleId;
    this.oldRoleId = this.result.RoleId;
    this.CountryId = this.result.CountryId;
    this.getStateList(this.CountryId);
    this.StateId = Number(this.result.StateId);
    if (this.result.ProfilePhoto === "" || this.result.ProfilePhoto === null) {
      this.ProfilePhoto = "";
    } else {

      this.ProfilePhoto = this.result.ProfilePhoto;
    }
    if (this.result.Status == "1") {
      this.Status = true
    } else {
      this.Status = false
    }
    if (this.result.IsRestrictedCustomerAccess == 1) {
      this.ShowMultipleCustomerIds = true
    }
    else {
      this.ShowMultipleCustomerIds = false;
      this.UserForm.patchValue({
        "MultipleCustomerIds": ''
      })
    }
    this.commonService.getHttpService('getWarehouseList').subscribe(response => {
      this.warehouseList = response.responseData.map(function (value) {
        return { name: value.WarehouseName, "id": value.WarehouseId }
      });


      if (this.result.IsDisplayBaseCurrencyValue == "1") {
        this.IsDisplayBaseCurrencyValue = true
      } else {
        this.IsDisplayBaseCurrencyValue = false
      }
      if (this.result.IsUserUPSEnable == "1") {
        this.IsUserUPSEnable = true
      } else {
        this.IsUserUPSEnable = false
      }
      if (this.result.IsRestrictExportReports == "1") {
        this.IsRestrictExportReports = true
      } else {
        this.IsRestrictExportReports = false
      }
      if (this.IdentityType == 0) {
        this.UserForm.patchValue({
          UserId: this.result.UserId,
          IdentityType: this.IdentityType,
          Title: this.result.Title,
          StateId: this.result.StateId,
          FirstName: this.result.FirstName,
          LastName: this.result.LastName,
          RoleId: this.RoleId,
          Address1: this.result.Address1,
          Address2: this.result.Address2,
          CountryId: this.CountryId,
          City: this.result.City,
          ProfilePhoto: this.result.ProfilePhoto,
          Zip: this.result.Zip,
          Email: this.result.Email,
          PhoneNo: this.result.PhoneNo,
          DepartmentId: this.result.DepartmentId,
          Status: this.Status,
          Fax: this.result.Fax,
          Username: this.result.Username,
          IsRestrictedCustomerAccess: (this.result.IsRestrictedCustomerAccess).toString(),
          MultipleCustomerIds: this.result.MultipleCustomerIds ? this.result.MultipleCustomerIds.split(",").map(a => Number(a)) : [],
          WarehouseIds: this.result.WarehouseIds ? this.result.WarehouseIds.split(",").map(a => Number(a)) : [1],
          DefaultLocation:this.result.DefaultLocation,
          IsDisplayBaseCurrencyValue:this.IsDisplayBaseCurrencyValue,
          IsUserUPSEnable:this.IsUserUPSEnable,
          DefaultCurrencyCode:this.result.DefaultCurrencyCode,
          AllowLocations:this.result.AllowLocations ? this.result.AllowLocations.split(",").map(a => Number(a)) : [],

        })
        this.CurrencyCode=this.result.DefaultCurrencyCode
        this.LocationName = this.countryList.find(a=>a.CountryId==this.result.Location).CountryName

      }
      else {
        this.UserForm.patchValue({
          UserId: this.result.UserId,
          IdentityType: this.IdentityType,
          Title: this.result.Title,
          StateId: this.result.StateId,
          FirstName: this.result.FirstName,
          LastName: this.result.LastName,
          //RoleId: this.RoleId,
          Address1: this.result.Address1,
          Address2: this.result.Address2,
          CountryId: this.CountryId,
          City: this.result.City,
          ProfilePhoto: this.result.ProfilePhoto,
          Zip: this.result.Zip,
          Email: this.result.Email,
          PhoneNo: this.result.PhoneNo,
          //DepartmentId: this.result.DepartmentId,
          Status: this.Status,
          Fax: this.result.Fax,
          Username: this.result.Username,
          WarehouseIds: this.result.WarehouseIds ? this.result.WarehouseIds.split(",").map(a => Number(a)) : [1],
          MultipleAccessIdentityIds: this.result.MultipleAccessIdentityIds ? this.result.MultipleAccessIdentityIds.split(",").map(a => Number(a)) : [],
          IsRestrictExportReports:this.IsRestrictExportReports
        })
      }
    });

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
    this.commonService.postHttpService({ UserId: localStorage.getItem("UserId") }, 'getWarehouseListByUserId').subscribe(response => {
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
        
        //DefaultCountryList
        var AllowLocationsdata=this.result.AllowLocations ? this.result.AllowLocations.split(",").map(a => Number(a)) : []
        for (var x in AllowLocationsdata) {

          for (var y in this.countryList) {
              if (AllowLocationsdata[x] == this.countryList[y].CountryId) {
                this.DefaultCountryList.push(this.countryList[y])
              }
          }
        } 
        this.LocationName = this.countryList.find(a=>a.CountryId==this.result.Location).CountryName
      }
      else {

      }
      this.cd_ref.detectChanges();
    }, error => console.log(error));
  }

  getStateList(CountryId) {
    var postData = {
      CountryId: this.CountryId
    }
    this.commonService.getHttpServiceStateId(postData, "getStateListDropdown").subscribe(response => {
      if (response.status == true) {
        this.StateList = response.responseData
      }
      else {

      }
      this.cd_ref.detectChanges();
    }, error => console.log(error));
  }
  getDepartmentList() {
    this.commonService.getHttpService("getDepartmentList").subscribe(response => {
      if (response.status == true) {
        this.DepartmentList = response.responseData;

      }
      else {

      }
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
      }
      else {

      }
      this.cd_ref.detectChanges();
    }, error => console.log(error));


  }

  onFileChange($event) {
    let file = $event.target.files[0]; // <--- File Object for future use.
    this.UserForm.controls['ProfilePhoto'].setValue(file ? file.name : ''); // <-- Set Value for Validation
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
    this.newAccessRights = 0;
    if (this.UserForm.valid) {
      if (this.UserForm.value.Status == true) {
        this.Status = 1
      } else {
        this.Status = 0
      }

      if (this.IdentityType == 0 && this.UserForm.value.MultipleCustomerIds != '') {
        var MultipleCustomerIds = this.UserForm.value.MultipleCustomerIds.join(",")
      } else {
        MultipleCustomerIds = ''
      }

      if (this.UserForm.value.IsDisplayBaseCurrencyValue == true) {
        this.IsDisplayBaseCurrencyValue = 1
        }
        else {
          this.IsDisplayBaseCurrencyValue = 0
        }
        if (this.UserForm.value.IsUserUPSEnable == true) {
          this.IsUserUPSEnable = 1
          }
          else {
            this.IsUserUPSEnable = 0
          }
          if (this.UserForm.value.IsRestrictExportReports == true) {
            this.IsRestrictExportReports = 1
            }
            else {
              this.IsRestrictExportReports = 0
            }
      if (this.IdentityType == 0) {
        if (this.UserForm.value.RoleId != this.oldRoleId) {
          Swal.fire({
            title: 'Do you want to change the Access Rights?',
            //text: 'If not proceed with the existing rights',
            type: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, change it!',
            cancelButtonText: 'No!',
            confirmButtonClass: 'btn btn-success mt-2',
            cancelButtonClass: 'btn btn-danger ml-2 mt-2',
            buttonsStyling: false
          }).then((result) => {
            if (result.value) {
              this.newAccessRights = 1;
            } else if (result.dismiss === Swal.DismissReason.cancel) {
              this.newAccessRights = 0;
            }
            this.postData = {
              IdentityId: this.IdentityId,
              UserList: [{
                UserId: this.UserForm.value.UserId,
                IdentityType: this.IdentityType,
                Title: this.UserForm.value.Title,
                FirstName: this.UserForm.value.FirstName,
                LastName: this.UserForm.value.LastName,
                RoleId: this.UserForm.value.RoleId,
                Address1: this.UserForm.value.Address1,
                Address2: this.UserForm.value.Address2,
                CountryId: this.CountryId,
                StateId: this.StateId,
                City: this.UserForm.value.City,
                Zip: this.UserForm.value.Zip,
                PhoneNo: this.UserForm.value.PhoneNo,
                Email: this.UserForm.value.Email,
                Fax: this.UserForm.value.Fax,
                // Password: this.UserForm.value.Password,
                // ConfirmPassword: this.UserForm.value.ConfirmPassword,
                DepartmentId: this.UserForm.value.DepartmentId,
                Status: this.Status,
                Username: this.UserForm.value.Username,
                ProfilePhoto: this.uploadedpath || this.ProfilePhoto,
                IsNewAccessRights: this.newAccessRights,
                WarehouseIds: this.UserForm.value.WarehouseIds ?this.UserForm.value.WarehouseIds.join(","):'',
                IsRestrictedCustomerAccess: this.UserForm.value.IsRestrictedCustomerAccess,
                MultipleCustomerIds: MultipleCustomerIds,
                IsDisplayBaseCurrencyValue:this.IsDisplayBaseCurrencyValue,
                IsUserUPSEnable:this.IsUserUPSEnable,  
                DefaultLocation:this.UserForm.value.DefaultLocation,
                DefaultCurrencyCode:this.UserForm.value.DefaultCurrencyCode,
                AllowLocations:this.UserForm.value.AllowLocations.join(","),
              }]
            }
            this.commonService.putHttpService(this.postData, "getUserUpdate").subscribe(response => {
              if (response.status == true) {
                this.triggerEvent(response.responseData.UserList[0]);
                this.modalRef.hide();
                Swal.fire({
                  title: 'Success!',
                  text: 'User Updated Successfully!',
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
          });
        }
        else {
          this.postData = {
            IdentityId: this.IdentityId,
            UserList: [{
              UserId: this.UserForm.value.UserId,
              IdentityType: this.IdentityType,
              Title: this.UserForm.value.Title,
              FirstName: this.UserForm.value.FirstName,
              LastName: this.UserForm.value.LastName,
              RoleId: this.UserForm.value.RoleId,
              Address1: this.UserForm.value.Address1,
              Address2: this.UserForm.value.Address2,
              CountryId: this.CountryId,
              StateId: this.StateId,
              City: this.UserForm.value.City,
              Zip: this.UserForm.value.Zip,
              PhoneNo: this.UserForm.value.PhoneNo,
              Email: this.UserForm.value.Email,
              Fax: this.UserForm.value.Fax,
              // Password: this.UserForm.value.Password,
              // ConfirmPassword: this.UserForm.value.ConfirmPassword,
              DepartmentId: this.UserForm.value.DepartmentId,
              Status: this.Status,
              Username: this.UserForm.value.Username,
              ProfilePhoto: this.uploadedpath || this.ProfilePhoto,
              IsNewAccessRights: this.newAccessRights,
              WarehouseIds:  this.UserForm.value.WarehouseIds ?this.UserForm.value.WarehouseIds.join(","):'',
              IsRestrictedCustomerAccess: this.UserForm.value.IsRestrictedCustomerAccess,
              MultipleCustomerIds: MultipleCustomerIds,
              IsDisplayBaseCurrencyValue:this.IsDisplayBaseCurrencyValue,
              IsUserUPSEnable:this.IsUserUPSEnable,  
              DefaultLocation:this.UserForm.value.DefaultLocation,
              DefaultCurrencyCode:this.UserForm.value.DefaultCurrencyCode,
              AllowLocations:this.UserForm.value.AllowLocations.join(","),
            }]
          }
          this.commonService.putHttpService(this.postData, "getUserUpdate").subscribe(response => {
            if (response.status == true) {
              this.triggerEvent(response.responseData.UserList[0]);
              this.modalRef.hide();
              Swal.fire({
                title: 'Success!',
                text: 'User Updated Successfully!',
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



      } else {
        if (this.UserForm.value.MultipleAccessIdentityIds != '') {
          var MultipleAccessIdentityIds = this.UserForm.value.MultipleAccessIdentityIds.join(",")
        } else {
          MultipleAccessIdentityIds = this.IdentityId
        }
        this.postData = {
          IdentityId: this.IdentityId,
          UserList: [{
            UserId: this.UserForm.value.UserId,
            IdentityType: this.IdentityType,
            Title: this.UserForm.value.Title,
            FirstName: this.UserForm.value.FirstName,
            LastName: this.UserForm.value.LastName,
            // RoleId: this.UserForm.value.RoleId,
            Address1: this.UserForm.value.Address1,
            Address2: this.UserForm.value.Address2,
            CountryId: this.CountryId,
            StateId: this.StateId,
            City: this.UserForm.value.City,
            Zip: this.UserForm.value.Zip,
            PhoneNo: this.UserForm.value.PhoneNo,
            Email: this.UserForm.value.Email,
            Fax: this.UserForm.value.Fax,
            // Password: this.UserForm.value.Password,
            // ConfirmPassword: this.UserForm.value.ConfirmPassword,
            // DepartmentId: this.UserForm.value.DepartmentId,
            Status: this.Status,
            Username: this.UserForm.value.Username,
            ProfilePhoto: this.uploadedpath || this.ProfilePhoto,
            IsNewAccessRights: this.newAccessRights,
            WarehouseIds: this.UserForm.value.WarehouseIds.join(","),
            MultipleAccessIdentityIds: MultipleAccessIdentityIds,
            IsRestrictExportReports:this.IsRestrictExportReports
          }]
        }
        this.commonService.putHttpService(this.postData, "getUserUpdate").subscribe(response => {
          if (response.status == true) {
            this.triggerEvent(response.responseData.UserList[0]);
            this.modalRef.hide();
            Swal.fire({
              title: 'Success!',
              text: 'User Updated Successfully!',
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
    }
    else {
      this.ShowMultipleCustomerIds = false;
      this.UserForm.patchValue({
        "MultipleCustomerIds": ''
      })
    }

  }
}