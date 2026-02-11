import { Component, OnInit, ChangeDetectorRef } from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { CommonService } from "src/app/core/services/common.service";
import { BsModalService, BsModalRef } from "ngx-bootstrap/modal";
import Swal from "sweetalert2";
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
  array_rr_status,
} from "src/assets/data/dropdown";
import { UserChangePasswordComponent } from "../../common-template/user-change-password/user-change-password.component";
import { DomSanitizer } from "@angular/platform-browser";
import { RRAddVendorQuoteAttachmentComponent } from "../../common-template/rr-add-vendor-quote-attachment/rr-add-vendor-quote-attachment.component";
import { concat, Observable, of, Subject } from "rxjs";
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  map,
  switchMap,
} from "rxjs/operators";
import * as moment from "moment";
import { CopyLinkComponent } from "../../common-template/copy-link/copy-link.component";
import { NgxSpinnerService } from "ngx-spinner";
import { VQAttachmentAssignComponent } from "../../common-template/vq-attachment-assign/vq-attachment-assign.component";
import { VQAttachmentFeedbackComponent } from "../../common-template/vq-attachment-feedback/vq-attachment-feedback.component";
@Component({
  selector: "app-rr-vendor-quote-attachment-list",
  templateUrl: "./rr-vendor-quote-attachment-list.component.html",
  styleUrls: ["./rr-vendor-quote-attachment-list.component.scss"],
  providers: [NgxSpinnerService],
})
export class RrVendorQuoteAttachmentListComponent implements OnInit {
  // bread crumb items
  breadCrumbItems: Array<{}>;

  page = 1;
  pageSize = 10;
  totalRecords = 0;
  startIndex = 1;
  endIndex = 10;
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
  pdfSrc: any;
  keywordForRR = "RRNo";
  isLoading: boolean = false;
  keywordForCustomer = "CompanyName";
  customers$: Observable<any> = of([]);
  customersInput$ = new Subject<string>();
  loadingCustomers: boolean = false;
  CustomersList: any[] = [];
  CustomerId;
  isLoadingCustomer: boolean = false;
  CompanyName: any;
  customerGroupList: any;
  CustomerGroupId: any;
  RRId: any;
  isLoadingRR: boolean;
  RRNo: string;
  RRList: any;
  RRStatus: any = [];
  adminListddl: any;
  ModifiedBy: any;
  StatusChangeId: any;
  CreatedDate: any;
  Lists: any = [];
  RecomPrice: any;
  gridCheckAll: boolean = false;
  selectedList: any = [];
  keywordForVendor = "VendorName";
  isLoadingVendor: boolean = false;
  VendorName: any;
  VendorsList: any[];
  loader: boolean;
  constructor(
    private openmodalService: NgbModal,
    private commonService: CommonService,
    public router: Router,
    private cd_ref: ChangeDetectorRef,
    private modalService: BsModalService,
    public modalRef: BsModalRef,
    private customValidator: CustomvalidationService,
    private spinner: NgxSpinnerService,
    protected _sanitizer: DomSanitizer
  ) {}

  currentRouter = this.router.url;
  ngOnInit() {
    document.title = "Vendor Quote Attachment List";
    this.IsViewEnabled = this.commonService.permissionCheck(
      "RRVendorQuoteAttachment",
      CONST_VIEW_ACCESS
    );
    this.IsAddEnabled = this.commonService.permissionCheck(
      "RRVendorQuoteAttachment",
      CONST_CREATE_ACCESS
    );
    this.IsEditEnabled = this.commonService.permissionCheck(
      "RRVendorQuoteAttachment",
      CONST_MODIFY_ACCESS
    );
    this.IsDeleteEnabled = this.commonService.permissionCheck(
      "RRVendorQuoteAttachment",
      CONST_DELETE_ACCESS
    );
    this.breadCrumbItems = [
      { label: "Aibond", path: "/" },
      { label: "Admin", path: "/" },
      { label: "List", path: "/", active: true },
    ];
    if (this.IsViewEnabled) {
      this.getList();
    }
    this.getCustomerGroupList();
    this.loadCustomers();
    this.getVendorList();
    // this.getRoleList();
    // this.getDepartmentList();
    // this.getCountryList();
    this.getAdminList2();

    this.RRStatus = array_rr_status;
    // var objUrl = 'https://s3.us-east-2.amazonaws.com/ahgroup-omsbucket/vendor/attachment/1663576097913-Quote_7042.pdf';
    // this.pdfSrc = this._sanitizer.bypassSecurityTrustResourceUrl(objUrl);

    // console.log(this.pdfSrc)
  }

  getAdminList2() {
    this.commonService
      .getHttpService("getAllActiveAdmin")
      .subscribe((response) => {
        //getAdminListDropdown
        this.adminListddl = response.responseData.map(function (value) {
          return {
            title: value.FirstName + " " + value.LastName,
            UserId: value.UserId,
          };
        });
      });
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

  reLoad() {
    this.router.navigate([this.currentRouter]);
  }

  onSearch() {
    if (this.IsViewEnabled) {
      // this.startIndex = 1;
      var CD = "";
      console.log(this.CreatedDate);
      if (this.CreatedDate != null && this.CreatedDate != "Invalid date") {
        const year = this.CreatedDate.year;
        const day = this.CreatedDate.day;
        const month = this.CreatedDate.month;
        let FirstTaxMonthDate = new Date(year, month - 1, day);
        let firstTaxMonthDate = moment(FirstTaxMonthDate).format("YYYY-MM-DD");
        var CD = firstTaxMonthDate;
      }
      var postData = {
        CustomerGroupId: this.CustomerGroupId,
        CustomerId: this.CompanyName,
        RRId: this.RRId,
        Status: this.StatusChangeId,
        Modified: "",
        ModifiedBy: this.ModifiedBy,
        VendorId: this.VendorId,
        Created: CD,
        pagination: {
          start: this.startIndex - 1,
          length: this.endIndex,
        },
      };
      this.commonService
        .postHttpService(postData, "VendorQuoteAttachmentList")
        .subscribe(
          (response) => {
            if (response.status == true) {
              this.Lists = response.responseData.data;
              // this.totalRecords = response.responseData.recordsTotal;
              // this.endIndex = response.responseData.recordsFiltered;
              this.totalRecords = response.responseData.recordsFiltered;
              this.setEndIndex();
              this.Lists.forEach((ele) => {
                ele.pdfSrc = this._sanitizer.bypassSecurityTrustResourceUrl(
                  ele.VendorAttachment
                );
              });
            } else {
              this.Lists = [];
            }
            this.cd_ref.detectChanges();
          },
          (error) => console.log(error)
        );
    }
  }

  getList() {
    this.spinner.show();
    this.loader = true;
    this.resetEndIndex();
    var postData = {
      CustomerGroupId: "",
      CustomerId: "",
      RRId: "",
      Status: "",
      Modified: "",
      ModifiedBy: "",
      VendorId: "",
      Created: "",
      pagination: {
        start: this.startIndex - 1,
        length: this.endIndex,
      },
    };
    this.commonService
      .postHttpService(postData, "VendorQuoteAttachmentList")
      .subscribe(
        (response) => {
          if (response.status == true) {
            this.Lists = response.responseData.data;
            this.Lists.forEach((ele) => {
              // console.log(ele.VendorAttachment);
              ele.pdfSrc = this._sanitizer.bypassSecurityTrustResourceUrl(
                ele.VendorAttachment
              );
              ele.checked = false;
            });
            // this.totalRecords = response.responseData.recordsTotal;
            // this.endIndex = response.responseData.recordsFiltered;
            this.totalRecords = response.responseData.recordsFiltered;
            this.setEndIndex();
            this.spinner.hide();
            this.loader = false;
            // console.log(this.Lists)
          } else {
            this.spinner.hide();
            this.loader = false;
            this.Lists = [];
          }
          this.cd_ref.detectChanges();
        },
        (error) => console.log(error)
      );
  }

  onClear() {
    this.resetEndIndex();
    this.CustomerGroupId = "";
    this.CompanyName = "";
    this.RRId = "";
    this.RRNo = "";
    this.StatusChangeId = "";
    this.ModifiedBy = "";
    this.VendorId = "";
    this.VendorName = "";
    this.CreatedDate = null;
    this.getList();
  }

  onPageChange(page): void {
    console.log(page);
    this.startIndex = (page - 1) * this.pageSize + 1;
    this.endIndex = (page - 1) * this.pageSize + this.pageSize;
    if (this.endIndex > this.totalRecords) {
      this.endIndex = this.totalRecords;
    }
    this.onSearch();
  }

  resetEndIndex() {
    this.endIndex = this.pageSize;
  }

  setEndIndex() {
    if (this.endIndex > this.totalRecords) {
      this.endIndex = this.totalRecords;
    }
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

  onAddVendorQuoteAttachment() {
    if (this.IsAddEnabled) {
      var VQAttachmentId = 0;
      this.modalRef = this.modalService.show(
        RRAddVendorQuoteAttachmentComponent,
        {
          backdrop: "static",
          ignoreBackdropClick: false,
          initialState: {
            data: { VQAttachmentId },
            class: "modal-lg",
          },
          class: "gray modal-lg",
        }
      );

      this.modalRef.content.closeBtnName = "Close";

      this.modalRef.content.event.subscribe((res) => {
        this.reLoad();
      });
    }
  }

  onEditVendorQuoteAttachment(Id) {
    if (this.IsEditEnabled) {
      var VQAttachmentId = Id;
      this.modalRef = this.modalService.show(
        RRAddVendorQuoteAttachmentComponent,
        {
          backdrop: "static",
          ignoreBackdropClick: false,
          initialState: {
            data: { VQAttachmentId },
            class: "modal-lg",
          },
          class: "gray modal-lg",
        }
      );

      this.modalRef.content.closeBtnName = "Close";

      this.modalRef.content.event.subscribe((res) => {
        this.reLoad();
      });
    }
  }
  onDeleteVendorQuoteAttachment(Id) {
    if (this.IsDeleteEnabled) {
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
            VQAttachmentId: Id,
          };

          this.commonService
            .postHttpService(postData, "VendorQuoteAttachmentDelete")
            .subscribe((response) => {
              if (response.status == true) {
                this.reLoad();
                //this.getUserList();
                Swal.fire({
                  title: "Deleted!",
                  text: "Vendor Quote Attachment has been deleted.",
                  type: "success",
                });
              }
            });
        } else if (
          // Read more about handling dismissals
          result.dismiss === Swal.DismissReason.cancel
        ) {
          // Swal.fire({
          //   title: 'Cancelled',
          //   text: 'Vendor Quote Attachment is safe:)',
          //   type: 'error'
          // });
        }
      });
    }
  }

  changeCustomerGroup(event) {
    // console.log(event);
    if (event && event.CustomerGroupId > 0) {
      this.customers$ = concat(
        this.searchCustomersWithGroup().pipe(
          // default items
          catchError(() => of([])) // empty list on error
        ),
        this.customersInput$.pipe(
          distinctUntilChanged(),
          debounceTime(800),
          switchMap((term) => {
            if (term != null && term != undefined)
              return this.searchCustomersWithGroup(term).pipe(
                catchError(() => of([])) // empty list on error
              );
            else return of([]);
          })
        )
      );
    } else {
      this.loadCustomers();
    }
  }
  searchCustomersWithGroup(term: string = ""): Observable<any> {
    this.loadingCustomers = true;
    var postData = {
      Customer: term,
      CustomerGroupId: this.CustomerGroupId,
    };
    return this.commonService
      .postHttpService(postData, "getAllAutoComplete")
      .pipe(
        map((response) => {
          this.CustomersList = response.responseData;
          this.loadingCustomers = false;
          return response.responseData;
        })
      );
  }

  loadCustomers() {
    this.customers$ = concat(
      this.searchCustomers().pipe(
        // default items
        catchError(() => of([])) // empty list on error
      ),
      this.customersInput$.pipe(
        distinctUntilChanged(),
        debounceTime(800),
        switchMap((term) => {
          if (term != null && term != undefined)
            return this.searchCustomers(term).pipe(
              catchError(() => of([])) // empty list on error
            );
          else return of([]);
        })
      )
    );
  }

  getCustomerGroupList() {
    this.commonService
      .getHttpService("ddCustomerGroup")
      .subscribe((response) => {
        if (response.status) {
          this.customerGroupList = response.responseData;
        }
      });
  }

  searchCustomers(term: string = ""): Observable<any> {
    this.loadingCustomers = true;
    var postData = {
      Customer: term,
    };
    return this.commonService
      .postHttpService(postData, "getAllAutoComplete")
      .pipe(
        map((response) => {
          this.CustomersList = response.responseData;
          this.loadingCustomers = false;
          return response.responseData;
        })
      );
  }

  selectAll() {
    let customerIds = this.CustomersList.map((a) => a.CustomerId);
    let cMerge = [...new Set([...customerIds, ...this.CompanyName])];
    this.CompanyName = cMerge;
  }

  selectRREvent($event) {
    this.RRId = $event.RRId;
  }
  clearRREvent($event) {
    this.RRId = "";
    this.RRNo = "";
  }
  onChangeRRSearch(val: string) {
    if (val) {
      this.isLoadingRR = true;
      var postData = {
        RRNo: val,
      };
      this.commonService.postHttpService(postData, "RRNoAotoSuggest").subscribe(
        (response) => {
          if (response.status == true) {
            var data = response.responseData;
            this.RRList = data.filter((a) =>
              a.RRNo.toLowerCase().includes(val.toLowerCase())
            );
          } else {
          }
          this.isLoadingRR = false;
          this.cd_ref.detectChanges();
        },
        (error) => {
          console.log(error);
          this.isLoadingRR = false;
        }
      );
    }
  }

  updatePrice(value: any, Id) {
    var inputValue = (<HTMLInputElement>document.getElementById(value)).value;
    if (inputValue != "0" && inputValue != "" && inputValue != null) {
      var postData = {
        VQAttachmentId: Id,
        RecomPrice: inputValue,
      };
      this.commonService
        .putHttpService(postData, "VendorQuoteAttachmentUpdate")
        .subscribe(
          (response) => {
            if (response.status == true) {
              Swal.fire({
                title: "Success!",
                text: "Recommended Price updated Successfully!",
                type: "success",
                confirmButtonClass: "btn btn-confirm mt-2",
              });
            } else {
              Swal.fire({
                title: "Error!",
                text: "Recommended price could not be updated!",
                type: "warning",
                confirmButtonClass: "btn btn-confirm mt-2",
              });
            }
            this.cd_ref.detectChanges();
          },
          (error) => console.log(error)
        );
    } else {
      Swal.fire({
        title: "Info!",
        text: "Please enter a valid Recommended Price",
        type: "warning",
        confirmButtonClass: "btn btn-confirm mt-2",
      });
    }
  }
  gridAllRowsCheckBoxChecked(e) {
    // console.log(e);
    this.gridCheckAll = !this.gridCheckAll;
    if (e.target.checked) {
      this.Lists.map((a) => (a.checked = true));
      this.selectedList = this.Lists.map((a) => {
        return { VQAttachmentId: a.VQAttachmentId };
      });
    } else {
      this.Lists.map((a) => (a.checked = false));
      this.selectedList = [];
    }
    console.log(this.selectedList);
  }

  rowCheckBoxChecked(e, Id) {
    if (e.target.checked) {
      this.selectedList.push({ VQAttachmentId: Id });
    } else {
      this.gridCheckAll = false;
      this.selectedList = this.Lists.filter((a) => a.VQAttachmentId != Id);
      // this.selectedList = this.selectedList.map(a => { return { VQAttachmentId: a.VQAttachmentId } });
    }
    console.log(this.selectedList);
  }

  generateLink() {
    let VQAttachmentIds = this.selectedList
      .map((a) => a.VQAttachmentId)
      .join(",");
    if (VQAttachmentIds) {
      var linkKey = btoa(VQAttachmentIds);
      this.modalRef = this.modalService.show(CopyLinkComponent, {
        backdrop: "static",
        ignoreBackdropClick: false,
        initialState: {
          data: { linkKey },
          class: "modal-lg",
        },
        class: "gray modal-lg",
      });

      this.modalRef.content.closeBtnName = "Close";

      this.modalRef.content.event.subscribe((res) => {
        // this.reLoad();
      });
      // console.log(e);
      // var d = atob(e);
      // console.log(d);
    } else {
      Swal.fire({
        title: "Info!",
        text: "Please select any VQ Attachment to Generate Link!",
        type: "warning",
        confirmButtonClass: "btn btn-confirm mt-2",
      });
    }
  }
  onFocused($event) {}

  selectVendorEvent($event) {
    // console.log($event);
    this.VendorId = $event.VendorId;
  }
  clearVendorEvent($event) {
    this.VendorId = "";
    this.VendorName = "";
  }

  onChangeVendorSearch(val: string) {
    if (val) {
      this.isLoadingVendor = true;
      var postData = {
        Vendor: val,
      };
      this.commonService
        .postHttpService(postData, "getAllAutoCompleteofVendor")
        .subscribe(
          (response) => {
            if (response.status == true) {
              var data = response.responseData;
              this.VendorsList = data.filter((a) =>
                a.VendorName.toLowerCase().includes(val.toLowerCase())
              );
            } else {
            }
            this.isLoadingVendor = false;
            this.cd_ref.detectChanges();
          },
          (error) => {
            console.log(error);
            this.isLoadingVendor = false;
          }
        );
    }
  }

  changeAssignee(Id, RRId) {
    // console.log(Id, RRId);
    this.modalRef = this.modalService.show(VQAttachmentAssignComponent, {
      backdrop: "static",
      ignoreBackdropClick: false,
      initialState: {
        data: { RRId },
        class: "modal-lg",
      },
      class: "gray modal-lg",
    });

    this.modalRef.content.closeBtnName = "Close";

    this.modalRef.content.event.subscribe((res) => {
      // this.reLoad();
      this.getList();
    });
  }
  changeApproverFeedback(Id, RRId, ApproverFeedback) {
    // console.log(Id, RRId);
    this.modalRef = this.modalService.show(VQAttachmentFeedbackComponent, {
      backdrop: "static",
      ignoreBackdropClick: false,
      initialState: {
        data: { RRId, Id, ApproverFeedback },
        class: "modal-lg",
      },
      class: "gray modal-lg",
    });

    this.modalRef.content.closeBtnName = "Close";

    this.modalRef.content.event.subscribe((res) => {
      // this.reLoad();
      this.getList();
    });
  }
  changeLength(e) {
    this.pageSize = e.target.value;
    this.endIndex = e.target.value;
    this.onSearch();
  }

  onAllSave() {
    // var inputValue = (<HTMLInputElement>document.getElementById(value)).value;
    console.log(this.Lists);
    var postdata: any = [];
    this.Lists.forEach((ele) => {
      if (ele.VQAttachmentId > 0) {
        var htmlId = "id_" + ele.VQAttachmentId;
        var inputValue = (<HTMLInputElement>document.getElementById(htmlId))
          .value;
        postdata.push({
          VQAttachmentId: ele.VQAttachmentId,
          RecomPrice: inputValue ? inputValue : "0",
        });
      }
    });
    // console.log(postdata);
    this.commonService
      .putHttpService(postdata, "VendorQuoteAttachmentPriceBulkUpdate")
      .subscribe(
        (response) => {
          if (response.status == true) {
            Swal.fire({
              title: "Success!",
              text: "Recommended Price updated Successfully!",
              type: "success",
              confirmButtonClass: "btn btn-confirm mt-2",
            });
          } else {
            Swal.fire({
              title: "Error!",
              text: "Recommended price could not be updated!",
              type: "warning",
              confirmButtonClass: "btn btn-confirm mt-2",
            });
          }
          this.cd_ref.detectChanges();
        },
        (error) => console.log(error)
      );
  }

  updateApproverFeedback(value: any, Id) {
    var inputValue = (<HTMLInputElement>document.getElementById(value)).value;
    if (inputValue != "" && inputValue != null) {
      var postData = {
        VQAttachmentId: Id,
        ApproverFeedback: inputValue,
      };
      this.commonService
        .postHttpService(
          postData,
          "VendorQuoteAttachmentApproverFeedbackUpdate"
        )
        .subscribe(
          (response) => {
            if (response.status == true) {
              Swal.fire({
                title: "Success!",
                text: "Approver Feedback updated Successfully!",
                type: "success",
                confirmButtonClass: "btn btn-confirm mt-2",
              });
            } else {
              Swal.fire({
                title: "Error!",
                text: "Approver Feedback could not be updated!",
                type: "warning",
                confirmButtonClass: "btn btn-confirm mt-2",
              });
            }
            this.cd_ref.detectChanges();
          },
          (error) => console.log(error)
        );
    } else {
      Swal.fire({
        title: "Info!",
        text: "Please enter a valid Approver Feedback",
        type: "warning",
        confirmButtonClass: "btn btn-confirm mt-2",
      });
    }
  }

  updateInternalNotes(value: any, Id) {
    var inputValue = (<HTMLInputElement>document.getElementById(value)).value;
    if (inputValue != "" && inputValue != null) {
      var postData = {
        VQAttachmentId: Id,
        InternalNotes: inputValue,
      };
      this.commonService
        .postHttpService(postData, "VendorQuoteAttachmentInternalNotesUpdate")
        .subscribe(
          (response) => {
            if (response.status == true) {
              Swal.fire({
                title: "Success!",
                text: "Internal Notes updated Successfully!",
                type: "success",
                confirmButtonClass: "btn btn-confirm mt-2",
              });
            } else {
              Swal.fire({
                title: "Error!",
                text: "Internal Notes could not be updated!",
                type: "warning",
                confirmButtonClass: "btn btn-confirm mt-2",
              });
            }
            this.cd_ref.detectChanges();
          },
          (error) => console.log(error)
        );
    } else {
      Swal.fire({
        title: "Info!",
        text: "Please enter a valid Internal Notes",
        type: "warning",
        confirmButtonClass: "btn btn-confirm mt-2",
      });
    }
  }
}
