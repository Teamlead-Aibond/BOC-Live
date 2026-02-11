import { Component, OnInit, ChangeDetectorRef, Inject, EventEmitter } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { CommonService } from 'src/app/core/services/common.service';
import { CustomvalidationService } from 'src/app/core/services/customvalidation.service';
import { CONST_VIEW_ACCESS, CONST_CREATE_ACCESS, CONST_MODIFY_ACCESS, CONST_DELETE_ACCESS, CONST_APPROVE_ACCESS, CONST_VIEW_COST_ACCESS, CONST_ACCESS_LIMIT } from 'src/assets/data/dropdown';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-access-rights',
  templateUrl: './access-rights.component.html',
  styleUrls: ['./access-rights.component.scss']
})

export class AccessRightsComponent implements OnInit {
  index;
  result;
  type;
  title;
  UserId = 0;
  masterList: boolean;
  checklist: any;

  UserForm: FormGroup;

  PermissionList = [];
  PermissionGroups = [];
  accessRightsName
  public event: EventEmitter<any> = new EventEmitter();
  show: boolean = true;
  IsEditEnabled;
  constructor(public modalRef: BsModalRef,
    private fb: FormBuilder,
    private cd_ref: ChangeDetectorRef,
    public router: Router,
    private commonService: CommonService,
    private customValidator: CustomvalidationService,
    @Inject(BsModalRef) public data: any,) { }

  ngOnInit(): void {
    this.result = this.data.result;
    this.index = this.data.index;
    this.type = this.data.type;
    this.UserId = this.result.UserId;

    if (this.result.CustomizedPermission > 0) {
      this.accessRightsName = "Modify Customized Access Rights"
    }
    else {
      this.accessRightsName = "Create Customized Access Rights"
    }
    switch (this.type) {
      case 1:
        this.getRoleData();
        this.IsEditEnabled = this.commonService.permissionCheck("ManageRolePermission", CONST_MODIFY_ACCESS);
        break;
      case 2:
        this.getUserData();
        this.IsEditEnabled = this.commonService.permissionCheck("ManageCustomizedRole", CONST_MODIFY_ACCESS);
        break;
    }
  }

  getRoleData() {
    this.title = this.result.RoleName;
    var postData = {
      RoleId: this.result.RoleId
    };
    this.commonService.postHttpService(postData, 'GetRolePermissionByRole').subscribe(response => {
      if (response.status == true) {
        if (response.responseData.length > 0) {
          this.addFormControls(response.responseData);
        }
      }
    }, error => console.log(error));
  }

  getUserData() {
    this.title = this.result.Name + " [" + this.result.RoleName + "]";
    var postData = {
      UserId: this.UserId
    };
    this.commonService.postHttpService(postData, 'GetRolePermissionByUser').subscribe(response => {
      if (response.status == true) {
        if (response.responseData.length > 0) {
          this.addFormControls(response.responseData);
        }
      }
    }, error => console.log(error));
  }

  private getPermissionArray(permissions) {
    let fields = [];
    for (let i = 0; i < CONST_ACCESS_LIMIT; i++) {
      if (permissions[i] == undefined || permissions[i] == 0) {
        fields.push(0);
      } else {
        fields.push(1);
      }
    }
    return fields;
  }

  addFormControls(data) {
    this.PermissionGroups.splice(0);
    this.PermissionList.splice(0);
    let access, mode;

    for (let val of data) {
      access = ''; mode = "";
      if (val.Permission != null) { access = val.Permission; }
      if (val.PermissionCheckbox != null) { mode = val.PermissionCheckbox; }
      val["Permission"] = this.getPermissionArray(access.split(','));
      val["PermissionMode"] = this.getPermissionArray(mode.split(','));
      this.PermissionList.push(val);
    }

    //Push group based on PermissionIdentityType. Do not push if PermissionIdentityType lenth < 0
    if (this.PermissionList.filter(a => a.PermissionIdentityType == 1).length > 0) {
      this.PermissionGroups.push({
        PermissionIdentityType: 1,
        Name: "Customer",
      })
    }
    if (this.PermissionList.filter(a => a.PermissionIdentityType == 2).length > 0) {
      this.PermissionGroups.push({
        PermissionIdentityType: 2,
        Name: "Vendor",
      })
    }
    if (this.PermissionList.filter(a => a.PermissionIdentityType == 3).length > 0) {
      this.PermissionGroups.push({
        PermissionIdentityType: 3,
        Name: "Repair Request",
      })
    }
    if (this.PermissionList.filter(a => a.PermissionIdentityType == 4).length > 0) {
      this.PermissionGroups.push({
        PermissionIdentityType: 4,
        Name: "Sales Quote",
      })
    }
    if (this.PermissionList.filter(a => a.PermissionIdentityType == 5).length > 0) {
      this.PermissionGroups.push({
        PermissionIdentityType: 5,
        Name: "SO",
      })
    }
    if (this.PermissionList.filter(a => a.PermissionIdentityType == 6).length > 0) {
      this.PermissionGroups.push({
        PermissionIdentityType: 6,
        Name: "PO",
      })
    }
    if (this.PermissionList.filter(a => a.PermissionIdentityType == 7).length > 0) {
      this.PermissionGroups.push({
        PermissionIdentityType: 7,
        Name: "Invoice",
      })
    }
    if (this.PermissionList.filter(a => a.PermissionIdentityType == 8).length > 0) {
      this.PermissionGroups.push({
        PermissionIdentityType: 8,
        Name: "Vendor Bills",
      })
    }
    if (this.PermissionList.filter(a => a.PermissionIdentityType == 11).length > 0) {
      this.PermissionGroups.push({
        PermissionIdentityType: 11,
        Name: "Master",
      })
    }

    if (this.PermissionList.filter(a => a.PermissionIdentityType == 12).length > 0) {
      this.PermissionGroups.push({
        PermissionIdentityType: 12,
        Name: "Reports",
      })
    }
    if (this.PermissionList.filter(a => a.PermissionIdentityType == 13).length > 0) {
      this.PermissionGroups.push({
        PermissionIdentityType: 13,
        Name: "Admin",
      })
    }
    if (this.PermissionList.filter(a => a.PermissionIdentityType == 14).length > 0) {
      this.PermissionGroups.push({
        PermissionIdentityType: 14,
        Name: "Shop",
      })
    }
  }

  // Column Check All OnClick
  checkListVertical(e, pit, idx) {
    this.PermissionList.filter(a => a.PermissionIdentityType == pit).forEach((perm) => {
      if (perm.PermissionMode[idx] == 1)
        perm.Permission[idx] = e.target.checked ? 1 : 0;
    })
  }

  // Row Check All OnClick
  checkListHorizontal(e, idx) {
    this.PermissionList[idx].Permission.forEach((perm, i) => {
      if (this.PermissionList[idx].PermissionMode[i] == 1)
        this.PermissionList[idx].Permission[i] = e.target.checked ? 1 : 0;
    })
  }

  onCheckboxChange(type, permissionRowIndex, permissionIndex, e) {
    this.PermissionList[permissionRowIndex].Permission[permissionIndex] = e.target.checked ? 1 : 0;
  }

  // Check All Check For Columns
  isAllVerticalChecked(pit, idx) {
    let perms = [];
    this.PermissionList.filter(a => a.PermissionIdentityType == pit).forEach((perm) => {
      if (perm.PermissionMode[idx] == 1)
        perms.push(perm.Permission[idx]);
    })
    if (perms.length <= 0)
      return false
    return perms.every(_ => _);
  }

  // Check All Check For Rows
  isAllHorizontalChecked(idx) {
    let perms = [];
    this.PermissionList[idx].Permission.forEach((perm, i) => {
      if (this.PermissionList[idx].PermissionMode[i] == 1)
        perms.push(perm);
    })
    if (perms.length <= 0)
      return false
    return perms.every(_ => _);
  }


  trackByIdx(index: number, obj: any): any {
    return index;
  }

  onSubmit() {
    var postData;
    var updateURL;
    if (this.PermissionList) {
      let requestBody = this.PermissionList.map(a => {
        // a.Permission = a.Permission.join(",");
        return Object.assign({}, a, { Permission: a.Permission.join(",") });
      })

      if (requestBody) {
        if (this.type == 1) { // User Role
          postData = {
            RoleId: this.result.RoleId,
            PermissionList: requestBody
          };
          this.commonService.postHttpService(postData, "UpdateRolePermission").subscribe(response => {
            if (response.status == true) {
              this.triggerEvent(response.responseData);
              // this.modalRef.hide();
              Swal.fire({
                title: 'Success!',
                text: 'Access Rights updated Successfully!',
                type: 'success',
                confirmButtonClass: 'btn btn-confirm mt-2'
              });
            }
            else {
              Swal.fire({
                title: 'Error!',
                text: 'Access Rights could not be updated!',
                type: 'warning',
                confirmButtonClass: 'btn btn-confirm mt-2'
              });
            }
            this.cd_ref.detectChanges();
          }, error => console.log(error));
        } else if (this.type == 2) { // User
          postData = {
            UserId: this.UserId,
            PermissionList: requestBody
          };
          this.commonService.postHttpService(postData, "UpdateUserPermission").subscribe(response => {
            if (response.status == true) {
              this.triggerEvent(response.responseData);
              // this.modalRef.hide();
              Swal.fire({
                title: 'Success!',
                text: 'Access Rights updated Successfully!',
                type: 'success',
                confirmButtonClass: 'btn btn-confirm mt-2'
              });
            }
            else {
              Swal.fire({
                title: 'Error!',
                text: 'Access Rights could not be updated!',
                type: 'warning',
                confirmButtonClass: 'btn btn-confirm mt-2'
              });
            }
            this.cd_ref.detectChanges();
          }, error => console.log(error));
        }

      }
    }
  }




  triggerEvent(item: string) {
    this.event.emit({ data: item, res: 200 });
  }

  checkUncheckAll() {
    for (var i = 0; i < this.checklist.length; i++) {
      this.checklist[i].isSelected = this.masterList;
    }
  }
  isAllSelected() {
    this.masterList = this.checklist.every(function (item: any) {
      return item.isSelected == true;
    })
  }

}
