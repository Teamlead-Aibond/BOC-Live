/* ===================================================
 * @copyright Copyright  2020 - 2023 Aibond Corp.
 *
 * All Rights Reserved.
 *
 * ========================================================== */

import { Component, OnInit, ChangeDetectorRef } from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { CommonService } from "src/app/core/services/common.service";
import { BsModalService, BsModalRef } from "ngx-bootstrap/modal";
import { AddUserComponent } from "../../common-template/add-user/add-user.component";
import Swal from "sweetalert2";
import { EditUserComponent } from "../../common-template/edit-user/edit-user.component";
import { AccessRightsComponent } from "../../common-template/access-rights/access-rights.component";
import { Router } from "@angular/router";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ConfirmedValidator } from "src/app/core/services/confirmed.validator";
import { CustomvalidationService } from "src/app/core/services/customvalidation.service";
import {
  Const_Alert_pop_title,
  Const_Alert_pop_message,
  CONST_VIEW_ACCESS,
  CONST_CREATE_ACCESS,
  CONST_MODIFY_ACCESS,
  CONST_DELETE_ACCESS,
} from "src/assets/data/dropdown";
import { UserChangePasswordComponent } from "../../common-template/user-change-password/user-change-password.component";

@Component({
  selector: "app-admin-list",
  templateUrl: "./admin-list.component.html",
  styleUrls: ["./admin-list.component.scss"],
})
export class AdminListComponent implements OnInit {
  // bread crumb items
  breadCrumbItems: Array<{}>;

  page = 1;
  pageSize = 60;
  totalRecords = 0;
  startIndex = 1;
  endIndex = 60;
  checkBox;
  UserList: any = [];
  ProfilePhoto;
  Viewuser;
  VendorId;
  vendorList;
  RoleList: any = [];
  DepartmentList: any = [];
  Username;
  Name;
  RoleId = "";
  DepartmentId = "";
  Email;
  countryList: any = [];
  Location = "";
  // Team data
  paginatedTeamData: Array<{}>;

  // all the team members

  //access rights variable
  IsViewEnabled;
  IsAddEnabled;
  IsEditEnabled;
  IsDeleteEnabled;
  IsViewCustomizedRoleEnabled;

  constructor(
    private openmodalService: NgbModal,
    private commonService: CommonService,
    public router: Router,
    private cd_ref: ChangeDetectorRef,
    private modalService: BsModalService,
    public modalRef: BsModalRef,
    private customValidator: CustomvalidationService
  ) {}

  currentRouter = this.router.url;
  ngOnInit() {
    document.title = "Admin List";
    this.breadCrumbItems = [
      { label: "Aibond", path: "/" },
      { label: "Admin", path: "/" },
      { label: "List", path: "/", active: true },
    ];
    this.getUserList();
    this.getVendorList();
    this.getRoleList();
    this.getDepartmentList();
    this.getCountryList();

    this.IsViewEnabled = this.commonService.permissionCheck(
      "ManageAdmin",
      CONST_VIEW_ACCESS
    );
    this.IsAddEnabled = this.commonService.permissionCheck(
      "ManageAdmin",
      CONST_CREATE_ACCESS
    );
    this.IsEditEnabled = this.commonService.permissionCheck(
      "ManageAdmin",
      CONST_MODIFY_ACCESS
    );
    this.IsDeleteEnabled = this.commonService.permissionCheck(
      "ManageAdmin",
      CONST_DELETE_ACCESS
    );
    this.IsViewCustomizedRoleEnabled = this.commonService.permissionCheck(
      "ManageCustomizedRole",
      CONST_VIEW_ACCESS
    );
  }

  getVendorList() {
    this.commonService
      .getHttpService("getVendorListDropdown")
      .subscribe((response) => {
        this.vendorList = response.responseData;
      });
  }

  getRoleList() {
    this.commonService.getHttpService("UserRoleList").subscribe((response) => {
      this.RoleList = response.responseData;
    });
  }

  getDepartmentList() {
    this.commonService
      .getHttpService("getDepartmentListDropdown")
      .subscribe((response) => {
        this.DepartmentList = response.responseData;
      });
  }

  addUser() {
    var IdentityType = 0;
    var IdentityId = 0;
    this.modalRef = this.modalService.show(AddUserComponent, {
      backdrop: "static",
      ignoreBackdropClick: false,
      initialState: {
        data: { IdentityType, IdentityId },
        class: "modal-lg",
      },
      class: "gray modal-lg",
    });

    this.modalRef.content.closeBtnName = "Close";

    this.modalRef.content.event.subscribe((res) => {
      //this.UserList.push(res.data);
      this.reLoad();
    });
  }

  deleteUser(UserId) {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      type: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel!",
      confirmButtonClass: "btn btn-success mt-2",
      cancelButtonClass: "btn btn-danger ml-2 mt-2",
      buttonsStyling: false,
    }).then((result) => {
      if (result.value) {
        var postData = {
          UserId: UserId,
        };

        this.commonService
          .postHttpService(postData, "getUserDelete")
          .subscribe((response) => {
            if (response.status == true) {
              this.reLoad();
              //this.getUserList();
              Swal.fire({
                title: "Deleted!",
                text: "User has been deleted.",
                type: "success",
              });
            }
          });
      } else if (
        // Read more about handling dismissals
        result.dismiss === Swal.DismissReason.cancel
      ) {
        Swal.fire({
          title: "Cancelled",
          text: "User is safe:)",
          type: "error",
        });
      }
    });
  }

  editUser(UserId, i) {
    var postData = {
      UserId: UserId,
    };
    this.commonService.postHttpService(postData, "getUserView").subscribe(
      (response) => {
        if (response.status == true) {
          this.Viewuser = response.responseData;
          var IdentityType = this.Viewuser.IdentityType;
          var IdentityId = this.Viewuser.IdentityId;
          var users = this.Viewuser;
          this.modalRef = this.modalService.show(EditUserComponent, {
            backdrop: "static",
            ignoreBackdropClick: false,
            initialState: {
              data: { users, i, IdentityType, IdentityId },
              class: "modal-lg",
            },
            class: "gray modal-lg",
          });
          this.modalRef.content.closeBtnName = "Close";

          this.modalRef.content.event.subscribe((res) => {
            //this.UserList[i] = res.data
            this.reLoad();
          });
        } else {
          Swal.fire({
            title: "Error!",
            text: "User could not be updated!",
            type: "warning",
            confirmButtonClass: "btn btn-confirm mt-2",
          });
        }
        this.cd_ref.detectChanges();
      },
      (error) => console.log(error)
    );
  }

  openModal(content: string) {
    this.openmodalService.open(content, { centered: true });
  }

  openCustomerAssigned(Customercontent: string) {
    this.openmodalService.open(Customercontent, { centered: true, size: "lg" });
  }
  openUserRightOld(UserRightscontent: string) {
    this.openmodalService.open(UserRightscontent, {
      centered: true,
      size: "xl",
    });
  }
  onChangePassword(item, i) {
    var result = item;
    var index = i;
    this.modalRef = this.modalService.show(UserChangePasswordComponent, {
      backdrop: "static",
      ignoreBackdropClick: false,
      initialState: {
        data: { index, result },
        class: "modal-xl",
      },
      class: "gray modal-xl",
    });

    this.modalRef.content.closeBtnName = "Close";

    this.modalRef.content.event.subscribe((res) => {
      this.reLoad();
    });
  }

  openUserRight(item, i) {
    var result = item;
    var index = i;
    var type = 2; // for User ID
    this.modalRef = this.modalService.show(AccessRightsComponent, {
      backdrop: "static",
      ignoreBackdropClick: false,
      initialState: {
        data: { index, result, type },
        class: "modal-xl",
      },
      class: "gray modal-xl",
    });

    this.modalRef.content.closeBtnName = "Close";

    this.modalRef.content.event.subscribe((res) => {
      this.reLoad();
      //this.UserList.push(res.data);
    });
  }

  reLoad() {
    this.router.navigate([this.currentRouter]);
  }

  onDeletePermission(UserId) {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      type: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel!",
      confirmButtonClass: "btn btn-success mt-2",
      cancelButtonClass: "btn btn-danger ml-2 mt-2",
      buttonsStyling: false,
    }).then((result) => {
      if (result.value) {
        var postData = {
          UserId: UserId,
        };
        this.commonService
          .postHttpService(postData, "UserDeletePermission")
          .subscribe((response) => {
            if (response.status == true) {
              Swal.fire({
                title: "Deleted!",
                text: "User Permission has been deleted.",
                type: "success",
              });
              this.reLoad();
            }
          });
      } else if (
        // Read more about handling dismissals
        result.dismiss === Swal.DismissReason.cancel
      ) {
        Swal.fire({
          title: "Cancelled",
          text: "User Permission is safe :)",
          type: "error",
        });
      }
    });
  }
  onSearch() {
    this.startIndex = 1;
    var postData = {
      VendorId: this.VendorId,
      Name: this.Name,
      Username: this.Username,
      RoleId: this.RoleId,
      DepartmentId: this.DepartmentId,
      Email: this.Email,
      Location: this.Location,
      pagination: {
        start: this.startIndex - 1,
        length: this.pageSize,
      },
    };
    this.commonService
      .postHttpService(postData, "getUserListWithFilter")
      .subscribe(
        (response) => {
          if (response.status == true) {
            this.UserList = response.responseData.data;
            this.totalRecords = response.responseData.recordsTotal;
          } else {
          }
          this.cd_ref.detectChanges();
        },
        (error) => console.log(error)
      );
  }

  getUserList() {
    var postData = {
      Name: "",
      Username: "",
      RoleId: "",
      DepartmentId: "",
      Email: "",
      VendorId: "",
      Location: "",
      pagination: {
        start: this.startIndex - 1,
        length: this.pageSize,
      },
    };
    this.commonService
      .postHttpService(postData, "getUserListWithFilter")
      .subscribe(
        (response) => {
          if (response.status == true) {
            this.UserList = response.responseData.data;
            this.totalRecords = response.responseData.recordsTotal;
          } else {
          }
          this.cd_ref.detectChanges();
        },
        (error) => console.log(error)
      );
  }

  onClear() {
    (this.Name = ""),
      (this.Username = ""),
      (this.RoleId = ""),
      (this.DepartmentId = ""),
      (this.Email = ""),
      (this.VendorId = ""),
      (this.Location = "");
    this.getUserList();
  }

  onPageChange(page): void {
    this.startIndex = (page - 1) * this.pageSize + 1;
    this.endIndex = (page - 1) * this.pageSize + this.pageSize;
    if (this.endIndex > this.totalRecords) {
      this.endIndex = this.totalRecords;
    }
    this.getUserList();
  }

  checkSelected(label: string) {
    this.checkBox.forEach((x) => {
      if (x.label !== label) {
        x.checked = !x.checked;
      }
    });
  }
  getCountryList() {
    this.commonService.getHttpService("getCountryList").subscribe(
      (response) => {
        if (response.status == true) {
          this.countryList = response.responseData;
        } else {
        }
        this.cd_ref.detectChanges();
      },
      (error) => console.log(error)
    );
  }
}
