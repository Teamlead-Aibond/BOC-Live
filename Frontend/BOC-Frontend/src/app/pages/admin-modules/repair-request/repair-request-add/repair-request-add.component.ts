import {
  Component,
  OnInit,
  ChangeDetectorRef,
  EventEmitter,
} from "@angular/core";
import { FormGroup, FormBuilder, Validators, FormArray } from "@angular/forms";
import Swal from "sweetalert2";
import { CommonService } from "src/app/core/services/common.service";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { Router } from "@angular/router";
import { RxwebValidators } from "@rxweb/reactive-form-validators";
import { AddRrPartsComponent } from "../../common-template/add-rr-parts/add-rr-parts.component";
import { NgxNavigationWithDataComponent } from "ngx-navigation-with-data";
import { DatePipe } from "@angular/common";
import { CustomerReferenceComponent } from "../../common-template/customer-reference/customer-reference.component";
import { AddDepartmentComponent } from "../../common-template/add-department/add-department.component";
import { AddAssetComponent } from "../../common-template/add-asset/add-asset.component";
import {
  CONST_VIEW_ACCESS,
  CONST_CREATE_ACCESS,
  CONST_MODIFY_ACCESS,
  CONST_DELETE_ACCESS,
  CONST_APPROVE_ACCESS,
  CONST_VIEW_COST_ACCESS,
  CONST_ACCESS_LIMIT,
  Const_Alert_pop_message,
  Const_Alert_pop_title,
  CONST_COST_HIDE_VALUE,
  warranty_type,
} from "src/assets/data/dropdown";
import { AddReferenceComponent } from "../../common-template/add-reference/add-reference.component";
import { NgSelectConfig } from "@ng-select/ng-select";

@Component({
  selector: "app-repair-request-add",
  templateUrl: "./repair-request-add.component.html",
  styleUrls: ["./repair-request-add.component.scss"],
})
export class RepairRequestAddComponent implements OnInit {
  btnDisabled: boolean = false;
  CustomerReference: any = [];
  customerRef;
  // Get the values for Access Rights
  VIEW_ACCESS = CONST_VIEW_ACCESS;
  CREATE_ACCESS = CONST_CREATE_ACCESS;
  MODIFY_ACCESS = CONST_MODIFY_ACCESS;
  DELETE_ACCESS = CONST_DELETE_ACCESS;
  APPROVE_ACCESS = CONST_APPROVE_ACCESS;
  VIEW_COST_ACCESS = CONST_VIEW_COST_ACCESS;

  ACCESS_LIMIT = CONST_ACCESS_LIMIT;

  [x: string]: any;
  selectValue: string[];
  // bread crumb items
  breadCrumbItems: Array<{}>;
  AddForm: FormGroup;
  submitted = false;

  customerList;
  departmentList;
  assetList;
  customerReferenceList: any = [];
  partList: any = [];
  customerPartList: any = [];
  partNewList: any = [];
  adminList;
  admin;
  PriorityNotes = "";

  RRParts: any = [];
  RRImagesList: any = [];
  showsave: boolean = true;
  spinner: boolean = false;

  data = [];
  Attachment;
  url: any = [];

  public event: EventEmitter<any> = new EventEmitter();
  ContactPhone: any;
  ContactEmail: any;

  ManufacturerPartNo: any;
  Description: any;
  Manufacturer: any;
  ManufactuerName: "";
  SerialNo: any;
  Quantity: any;
  PartNo: any;
  Price: any;
  CReferenceId: string;

  PartId;
  DepartmentId;
  AssetId;
  CustomerId;
  IsWarrantyRecovery;
  UserId;
  PON;
  LPP;
  Manufactuer;
  RRDescription;
  keyword = "CompanyName";
  isLoading: boolean = false;
  public placeholder: string = "Enter the Company Name";
  WarrantyList: any = [];
  Symbol;
  Location;
  LocationName;
  CustomerCountry;
  CustomerCountryId;
  countryList: any = [];
  constructor(
    private fb: FormBuilder,
    private cd_ref: ChangeDetectorRef,
    public router: Router,
    public navCtrl: NgxNavigationWithDataComponent,
    private CommonmodalService: BsModalService,
    private datePipe: DatePipe,
    public modalRef: BsModalRef,
    private service: CommonService,
    private config: NgSelectConfig
  ) {
    this.config.notFoundText = "Parts Not Available + Add New";
  }
  currentRouter = this.router.url;

  ngOnInit(): void {
    document.title = "RR Add";

    this.breadCrumbItems = [
      { label: "Aibond", path: "/" },
      { label: "Repair Request", path: "/admin/repair-request/list/" },
      { label: "Add", path: "/", active: true },
    ];
    //this.selectValue = ['Alaska', 'Hawaii', 'California', 'Nevada', 'Oregon', 'Washington', 'Arizona', 'Colorado', 'Idaho', 'Montana', 'Nebraska', 'New Mexico', 'North Dakota', 'Utah', 'Wyoming', 'Alabama', 'Arkansas', 'Illinois', 'Iowa'];

    // Access Rights
    this.accessRights = JSON.parse(localStorage.getItem("accessRights"));
    this.CustomerReference = this.accessRights["CustomerReference"].split(",");

    this.AddForm = this.fb.group({
      CustomerId: [""],
      CompanyName: ["", Validators.required],
      DepartmentId: [""],
      AssetId: [""],
      PartNo: [""],
      Price: [""],
      PartId: ["", Validators.required],
      SerialNo: ["", [Validators.required, Validators.pattern("[a-zA-Z0-9]*")]],
      IsRushRepair: [false],
      IsWarrantyRecovery: [""],
      IsRepairTag: [false],
      IsCriticalSpare: [false],
      IsWarrantyDenied: [false],
      RRDescription: ["", Validators.required],
      StatedIssue: ["", Validators.required],

      UserId: [""],
      ContactPhone: [""],
      ContactEmail: ["", Validators.email],
      ManufacturerPartNo: [""],
      Quantity: ["", Validators.required],
      LeadTime: [""],
      CustomerPartNo1: [""],
      CustomerPartNo2: [""],
      Description: [""],
      Manufactuer: [""],
      CustomerReferenceList: this.fb.array([
        // this.fb.group({
        //   CReferenceId: ['', [Validators.required, RxwebValidators.unique()]],
        //   ReferenceValue: ['', Validators.required],
        //   ReferenceLabelName: ['']
        // })
      ]),
      Attachment: [
        "",
        [
          RxwebValidators.extension({
            extensions: ["png", "jpeg", "jpg", "gif"],
          }),
        ],
      ],
    });

    // Access Rights
    this.accessRights = JSON.parse(localStorage.getItem("accessRights"));
    this.CustomerReference = this.accessRights["CustomerReference"].split(",");

    this.Quantity = 1;
    this.WarrantyList = warranty_type;

    //this.getDepartmentList();
    this.getAdminList();
    this.getCountryList();
    this.LocationName = localStorage.getItem("LocationName");
    this.Location = localStorage.getItem("Location");
  }

  getCountryList() {
    this.service.getconutryList().subscribe(
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
  //AutoSuggestuiion for customer
  selectEvent($event) {
    this.CustomerCountryId = $event.CustomerLocation;
    this.CustomerCountry = this.countryList.find(
      (a) => a.CountryId == this.CustomerCountryId
    ).CountryName;

    if (this.CustomerCountryId != this.Location) {
      Swal.fire({
        title: "Country Mismatch",
        html:
          '<b style=" font-size: 14px !important;">' +
          `Customer Country : <span class="badge badge-primary btn-xs">${this.CustomerCountry}</span> , AH Country : <span class="badge badge-pink btn-xs">${this.LocationName}</span> . Are you Sure to Process this!` +
          "</b>",
        type: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, Process it!",
        cancelButtonText: "No, cancel!",
        confirmButtonClass: "btn btn-success mt-2",
        cancelButtonClass: "btn btn-danger ml-2 mt-2",
        buttonsStyling: false,
      }).then((result) => {
        if (result.value) {
          this.customerRef = 0;
          this.customerReferenceList = [];
          this.AddForm.value.CustomerReferenceList = [];
          this.CustomerReferenceList.clear();

          this.getCustomerProperties($event.CustomerId, $event.PriorityNotes);
          this.AddForm.patchValue({
            CustomerId: $event.CustomerId,
            CompanyName: $event.CompanyName,
          });
          this.CustomerId = $event.CustomerId;
          this.Symbol = $event.CurrencySymbol;
          this.LocalCurrencyCode = $event.CustomerCurrencyCode;
        } else if (
          // Read more about handling dismissals
          result.dismiss === Swal.DismissReason.cancel
        ) {
          this.reLoad();
        }
      });
    } else {
      this.customerRef = 0;
      this.customerReferenceList = [];
      this.AddForm.value.CustomerReferenceList = [];
      this.CustomerReferenceList.clear();

      this.getCustomerProperties($event.CustomerId, $event.PriorityNotes);
      this.AddForm.patchValue({
        CustomerId: $event.CustomerId,
        CompanyName: $event.CompanyName,
      });
      this.CustomerId = $event.CustomerId;
      this.Symbol = $event.CurrencySymbol;
      this.LocalCurrencyCode = $event.CustomerCurrencyCode;
    }
  }

  onChangeSearch(val: string) {
    if (val) {
      this.isLoading = true;
      var postData = {
        Customer: val,
      };
      this.service.postHttpService(postData, "getAllAutoComplete").subscribe(
        (response) => {
          if (response.status == true) {
            var data = [];
            data = response.responseData;
            this.customerList = data.filter((a) =>
              a.CompanyName.toLowerCase().includes(val.toLowerCase())
            );
          } else {
          }
          this.isLoading = false;
          this.cd_ref.detectChanges();
        },
        (error) => {
          console.log(error);
          this.isLoading = false;
        }
      );
    }
  }
  clearEvent($event) {
    this.AddForm.patchValue({
      CustomerId: "",
      CompanyName: "",
    });
    this.customerReferenceList = [];
    this.AddForm.value.CustomerReferenceList = [];
    this.CustomerReferenceList.clear();
    this.partList = [];
  }
  onFocused(e) {
    // do something when input is focused
  }

  // public initReference(): FormGroup {
  //   return this.fb.group({
  //     CReferenceId: ['', [Validators.required, RxwebValidators.unique()]],
  //     ReferenceValue: ['', Validators.required],
  //     ReferenceLabelName: ['']

  //   });
  // }

  // public addReference(): void {
  //   const refArray = <FormArray>this.AddForm.controls.CustomerReferenceList;
  //   refArray.push(this.initReference());
  // }

  // removeRef(i: number) {
  //   this.Ref.removeAt(i);
  // }

  public addReferenceType() {
    var IdentityId = this.CustomerId;
    this.modalRef = this.CommonmodalService.show(CustomerReferenceComponent, {
      backdrop: "static",
      ignoreBackdropClick: false,
      initialState: {
        data: { IdentityId },
        class: "modal-lg",
      },
      class: "gray modal-lg",
    });

    this.modalRef.content.closeBtnName = "Close";

    this.modalRef.content.event.subscribe((res) => {
      this.customerReferenceList.push(res.data);
      this.CustomerReferenceList.push(
        this.fb.group({
          CReferenceId: res.data.CReferenceId,
          ReferenceLabelName: res.data.CReferenceName,
          ReferenceValue: ["", Validators.required],
        })
      );
    });
  }

  // get Ref(): FormArray {
  //   return this.AddForm.get('CustomerReferenceList') as FormArray;
  //}
  //addReference

  get CustomerReferenceList(): FormArray {
    return this.AddForm.get("CustomerReferenceList") as FormArray;
  }
  onSubmit(AddForm) {
    this.submitted = true;
    if (this.customerReferenceList.length == 0) {
      this.customerRef = "Error";
    }
    if (this.AddForm.valid && this.customerReferenceList.length != 0) {
      this.btnDisabled = true;
      let obj = this;
      // let Reference = this.AddForm.value.CustomerReferenceList.map(function (value) {
      //   let filterdValue = obj.customerReferenceList.filter(function (label) {
      //     return value.CReferenceId == label.CReferenceId;
      //   }, value);
      //   value.ReferenceLabelName = filterdValue[0].CReferenceName;
      //   return value;
      // })

      // Set up the parts
      this.RRParts.push({
        PartId: this.AddForm.value.PartId,
        PartNo: this.AddForm.value.PartNo,
        Price: this.AddForm.value.Price,
        CustomerPartNo1: this.AddForm.value.CustomerPartNo1,
        CustomerPartNo2: this.AddForm.value.CustomerPartNo2,
        Description: this.setReplace(this.AddForm.value.Description),
        Manufacturer: this.Manufacturer,
        ManufacturerPartNo: this.AddForm.value.ManufacturerPartNo,
        SerialNo: this.AddForm.value.SerialNo,
        LeadTime: this.AddForm.value.LeadTime,
        Quantity: this.AddForm.value.Quantity,
        //"Rate" : this.AddForm.value.CustomerId,
        //"RootCause" : this.AddForm.value.CustomerId,
      });

      var postData = {
        CustomerId: this.AddForm.value.CustomerId,
        DepartmentId: this.AddForm.value.DepartmentId,
        PartId: this.AddForm.value.PartId,
        PartNo: this.AddForm.value.PartNo,
        Price: this.AddForm.value.Price,
        SerialNo: this.AddForm.value.SerialNo,
        AssetId: this.AddForm.value.AssetId,
        IsRushRepair: this.AddForm.value.IsRushRepair == true ? 1 : 0,
        IsWarrantyRecovery: this.AddForm.value.IsWarrantyRecovery,
        IsRepairTag: this.AddForm.value.IsRepairTag == true ? 1 : 0,
        IsCriticalSpare: this.AddForm.value.IsCriticalSpare == true ? 1 : 0,
        IsWarrantyDenied: this.AddForm.value.IsWarrantyDenied == true ? 1 : 0,
        RRDescription: this.setReplace(this.AddForm.value.RRDescription),
        StatedIssue: this.AddForm.value.StatedIssue,
        UserId: this.AddForm.value.UserId,
        ContactPhone: this.AddForm.value.ContactPhone,
        ContactEmail: this.AddForm.value.ContactEmail,
        //"VendorId": this.AddForm.value.VendorId,
        CustomerReferenceList: this.AddForm.value.CustomerReferenceList,
        RRParts: this.RRParts,
        RRImagesList: this.RRImagesList,
      };

      this.service.postHttpService(postData, "RepairRequestAdd").subscribe(
        (response) => {
          if (response.status == true) {
            Swal.fire({
              title: "Success!",
              text: "Record saved Successfully!",
              type: "success",
              confirmButtonClass: "btn btn-confirm mt-2",
            });
            this.router.navigate(["/admin/repair-request/edit"], {
              state: { RRId: response.responseData.data },
            });

            // this.router.navigate(['/admin/repair-request/edit']);
          } else {
            Swal.fire({
              title: "Error!",
              text: "Record could not be saved!",
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
        type: "error",
        title: Const_Alert_pop_title,
        text: Const_Alert_pop_message,
        confirmButtonClass: "btn btn-confirm mt-2",
      });
    }
  }

  //RRPartsSession
  addRepairParts() {
    var CustomerId = this.CustomerId;
    this.modalRef = this.CommonmodalService.show(AddRrPartsComponent, {
      backdrop: "static",
      ignoreBackdropClick: false,
      initialState: {
        data: { CustomerId },
        class: "modal-lg",
      },
      class: "gray modal-lg",
    });

    this.modalRef.content.closeBtnName = "Close";
    this.modalRef.content.event.subscribe((res) => {});
  }
  arrayOne(n: number): any[] {
    return Array(n);
  }

  getCustomerList() {
    this.service
      .getHttpService("getCustomerListDropdown")
      .subscribe((response) => {
        this.customerList = response.responseData.map(function (value) {
          return {
            title: value.CompanyName,
            CustomerId: value.CustomerId,
            PriorityNotes: value.PriorityNotes,
          };
        });
      });
  }

  getDepartmentList() {
    this.service
      .getHttpService("getDepartmentListDropdown")
      .subscribe((response) => {
        this.departmentList = response.responseData;
      });
  }

  getAdminList() {
    this.service.getHttpService("getUserList").subscribe((response) => {
      //getAdminListDropdown
      this.adminList = response.responseData.map(function (value) {
        return {
          title: value.FirstName + " - " + value.LastName,
          UserId: value.UserId,
        };
      });
    });
  }

  viewRR(RRId) {
    this.router.navigate(["/admin/repair-request/edit"], {
      state: { RRId: RRId },
    });
  }

  checkWarranty(SerialNo) {
    var postData = { PartNo: this.PartNo, SerialNo: SerialNo };
    this.service
      .postHttpService(postData, "RRFindWarranty")
      .subscribe((response) => {
        if (response.status == true) {
          this.showsave = false;

          var showalertMessage =
            "Duplicate entry. RR already exists with same part and serial no. You cannot add RR unless it is Completed / Rejected";

          var imagePath =
            response.responseData.RRImages.length > 0
              ? response.responseData.RRImages[0].ImagePath
              : "assets/images/No Image Available.png";
          var ApprovedQuoteInfo = [];
          ApprovedQuoteInfo = response.responseData.ApprovedQuoteInfo;
          if (
            response.responseData.RRInfo[0].Status != 7 &&
            response.responseData.RRInfo[0].Status != 6 &&
            response.responseData.RRInfo[0].Status != 8
          ) {
            Swal.fire({
              title: "<strong>Duplicate Entry?!</strong>",
              type: "warning",
              html:
                '<div class="text-center"><img src="' +
                imagePath +
                '" alt="Part Image" class="avatar-xl rounded-circle mb-3"><h4 class="mb-1"> Matching Record </h4></div>' +
                '<div class="row mt-2">' +
                '<div class="col-6"><h5 class="font-weight-normal text-muted">Part #</h5><h5 class="m-b-30">' +
                response.responseData.RRInfo[0].PartNo +
                "</h5></div>" +
                '<div class="col-6"><h5 class="font-weight-normal text-muted">Repair Request #</h5><h5 class="m-b-30">' +
                response.responseData.RRInfo[0].RRNo +
                "</h5></div></div>" +
                '<div class="row mt-1">' +
                `<div class="col-6"><h5 class="font-weight-normal text-muted">Cusotmer Name</h5><h5 class="m-b-30">' + ${
                  ApprovedQuoteInfo.length > 0
                    ? response.responseData.ApprovedQuoteInfo[0].CompanyName
                    : ""
                } + '</h5></div>` +
                '<div class="col-6"><h5 class="font-weight-normal text-muted">Current Status</h5><h5 class="m-b-30">' +
                response.responseData.RRInfo[0].StatusName +
                "</h5></div>" +
                "</div>" +
                '<div class="row mt-1">' +
                `<div class="col-6"><h5 class="font-weight-normal text-muted">Invoice Amount ($)</h5><h5 class="m-b-30">' + ${
                  ApprovedQuoteInfo.length > 0
                    ? response.responseData.ApprovedQuoteInfo[0].GrandTotal
                    : "-"
                } + '</h5></div>` +
                '<div class="col-6"><h5 class="font-weight-normal text-muted">Quote Date</h5><h5 class="m-b-30">' +
                quoteDate +
                "</h5></div>" +
                "</div>" +
                '<div class="mt-1"><p class="text-muted  font-14"> <b>Stated Issue: </b>' +
                response.responseData.RRInfo[0].StatedIssue +
                "</p>" +
                '<p class="font-14 text-center text-muted"> ' +
                rootCause +
                "</p></div>" +
                '<p class="text-center pad10 badge-danger ml-1" style="font-size:16px"> ' +
                showalertMessage +
                "</p></div>" +
                '<div class="text-center"><a href="javascript:location.reload()" class="btn btn-warning">Cancel</a></div>',
              showCloseButton: true,
              showCancelButton: false,
              focusConfirm: false,
              showConfirmButton: false,
              // confirmButtonText: 'Create New Repair Request!',
              // cancelButtonText: 'Claim for Warranty Recovery!',
              // confirmButtonClass: 'btn btn-success mt-2',
              // cancelButtonClass: 'btn btn-info ml-2 mt-2',
              buttonsStyling: false,
            }).then((result) => {
              if (result.value) {
                // Allow the user to Proceed with a New RR
                this.showsave = true;
              } else if (result.dismiss === Swal.DismissReason.cancel) {
                this.AddForm.patchValue({
                  IsWarrantyRecovery: "1",
                });
                this.IsWarrantyRecovery = "1";
                this.showsave = true;
                // The user will not be allowed to add this RR
                /*  Swal.fire({
                 title: 'Cancelled',
                 text: 'Cancelled the Repair Request!',
                 type: 'error'
               });
               this.reLoad(); */
              }
            });
          } else {
            if (response.responseData.RRInfo[0].Status == 7) {
              if (
                response.responseData.ApprovedQuoteInfo[0].CompletedDate != ""
              ) {
                var showCompletedRecord = true;
              } else {
                showCompletedRecord = false;
              }

              var completedDate = response.responseData.ApprovedQuoteInfo[0]
                .CompletedDate
                ? this.datePipe.transform(
                    response.responseData.ApprovedQuoteInfo[0].CompletedDate,
                    "MM/dd/yyyy"
                  )
                : "-";
              var quoteDate = response.responseData.ApprovedQuoteInfo[0]
                .QuoteDate
                ? this.datePipe.transform(
                    response.responseData.ApprovedQuoteInfo[0].QuoteDate,
                    "MM/dd/yyyy"
                  )
                : "";
              var rootCause =
                response.responseData.ApprovedQuoteInfo[0].RouteCause != null
                  ? "<b>Root Cause: </b>" +
                    response.responseData.ApprovedQuoteInfo[0].RouteCause
                  : "";
              Swal.fire({
                title: "<strong>Duplicate Entry?!</strong>",
                type: "warning",
                html:
                  '<div class="text-center"><img src="' +
                  imagePath +
                  '" alt="Part Image" class="avatar-xl rounded-circle mb-3"><h4 class="mb-1"> Matching Record </h4></div>' +
                  '<div class="row mt-2">' +
                  '<div class="col-6"><h5 class="font-weight-normal text-muted">Part #</h5><h5 class="m-b-30">' +
                  response.responseData.RRInfo[0].PartNo +
                  "</h5></div>" +
                  '<div class="col-6"><h5 class="font-weight-normal text-muted">Repair Request #</h5><h5 class="m-b-30">' +
                  response.responseData.RRInfo[0].RRNo +
                  "</h5></div></div>" +
                  '<div class="row mt-1">' +
                  '<div class="col-6"><h5 class="font-weight-normal text-muted">Cusotmer Name</h5><h5 class="m-b-30">' +
                  response.responseData.ApprovedQuoteInfo[0].CompanyName +
                  "</h5></div>" +
                  '<div class="col-6"><h5 class="font-weight-normal text-muted">Current Status</h5><h5 class="m-b-30">' +
                  response.responseData.RRInfo[0].StatusName +
                  "</h5></div>" +
                  "</div>" +
                  '<div class="row mt-1">' +
                  '<div class="col-6"><h5 class="font-weight-normal text-muted">Invoice Amount ($)</h5><h5 class="m-b-30">' +
                  response.responseData.ApprovedQuoteInfo[0].GrandTotal +
                  "</h5></div>" +
                  '<div class="col-6"><h5 class="font-weight-normal text-muted">Quote Date</h5><h5 class="m-b-30">' +
                  quoteDate +
                  "</h5></div>" +
                  "</div>" +
                  '<div class="row mt-1" *ngIf="showCompletedRecord">' +
                  '<div class="col-6"><h5 class="font-weight-normal text-muted">Completed Date</h5><h5 class="m-b-30">' +
                  completedDate +
                  "</h5></div>" +
                  "</div>" +
                  '<div class="mt-1"><p class="text-muted  font-14"> <b>Stated Issue: </b>' +
                  response.responseData.RRInfo[0].StatedIssue +
                  "</p>" +
                  '<p class="font-14 text-center text-muted"> ' +
                  rootCause +
                  "</p></div>" +
                  '<div class="text-center"><a href="javascript:location.reload()" class="btn btn-warning">Cancel</a></div>',
                showCloseButton: true,
                showCancelButton: true,
                focusConfirm: false,
                confirmButtonText: "Create New Repair Request!",
                cancelButtonText: "Claim for Warranty Recovery!",
                confirmButtonClass: "btn btn-success mt-2",
                cancelButtonClass: "btn btn-info ml-2 mt-2",
                buttonsStyling: false,
                allowOutsideClick: false,
              }).then((result) => {
                if (result.value) {
                  // Allow the user to Proceed with a New RR
                  this.showsave = true;
                } else if (result.dismiss === Swal.DismissReason.cancel) {
                  this.AddForm.patchValue({
                    IsWarrantyRecovery: "1",
                  });
                  this.IsWarrantyRecovery = "1";
                  this.showsave = true;
                  // The user will not be allowed to add this RR
                  /*  Swal.fire({
                   title: 'Cancelled',
                   text: 'Cancelled the Repair Request!',
                   type: 'error'
                 });
                 this.reLoad(); */
                }
              });
            } else if (
              response.responseData.RRInfo[0].Status == 6 ||
              response.responseData.RRInfo[0].Status == 8
            ) {
              var RejectedQuoteInfo = [];

              RejectedQuoteInfo = response.responseData.RejectedQuoteInfo;
              if (RejectedQuoteInfo.length > 0) {
                var quoteDate = response.responseData.RejectedQuoteInfo[0]
                  .QuoteDate
                  ? this.datePipe.transform(
                      response.responseData.RejectedQuoteInfo[0].QuoteDate,
                      "MM/dd/yyyy"
                    )
                  : "";
                var rootCause =
                  response.responseData.RejectedQuoteInfo[0].RouteCause != null
                    ? "<b>Root Cause: </b>" +
                      response.responseData.RejectedQuoteInfo[0].RouteCause
                    : "";
                var GrandTotal =
                  response.responseData.RejectedQuoteInfo[0].GrandTotal;
              } else {
                quoteDate = "-";
                rootCause = "-";
                GrandTotal = "-";
              }

              Swal.fire({
                title: "<strong>Duplicate Entry?!</strong>",
                type: "warning",
                html:
                  '<div class="text-center"><img src="' +
                  imagePath +
                  '" alt="Part Image" class="avatar-xl rounded-circle mb-3"><h4 class="mb-1"> Matching Record </h4></div>' +
                  '<div class="row mt-2">' +
                  '<div class="col-6"><h5 class="font-weight-normal text-muted">Part #</h5><h5 class="m-b-30">' +
                  response.responseData.RRInfo[0].PartNo +
                  "</h5></div>" +
                  '<div class="col-6"><h5 class="font-weight-normal text-muted">Repair Request #</h5><h5 class="m-b-30">' +
                  response.responseData.RRInfo[0].RRNo +
                  "</h5></div></div>" +
                  '<div class="row mt-1">' +
                  '<div class="col-6"><h5 class="font-weight-normal text-muted">Cusotmer Name</h5><h5 class="m-b-30">' +
                  response.responseData.RRInfo[0].CompanyName +
                  "</h5></div>" +
                  '<div class="col-6"><h5 class="font-weight-normal text-muted">Current Status</h5><h5 class="m-b-30">' +
                  response.responseData.RRInfo[0].StatusName +
                  "</h5></div>" +
                  "</div>" +
                  '<div class="row mt-1">' +
                  '<div class="col-6"><h5 class="font-weight-normal text-muted">Quote Amount ($)</h5><h5 class="m-b-30">' +
                  GrandTotal +
                  "</h5></div>" +
                  '<div class="col-6"><h5 class="font-weight-normal text-muted">Quote Date</h5><h5 class="m-b-30">' +
                  quoteDate +
                  "</h5></div>" +
                  "</div>" +
                  '<div class="mt-1"><p class="text-muted  font-14"> <b>Stated Issue: </b>' +
                  response.responseData.RRInfo[0].StatedIssue +
                  "</p>" +
                  '<p class="font-14 text-center text-muted"> ' +
                  rootCause +
                  "</p></div>" +
                  '<div class="text-center"><a href="javascript:location.reload()" class="btn btn-warning">Cancel</a></div>',
                showCloseButton: true,
                showCancelButton: false,
                focusConfirm: false,
                confirmButtonText: "Create New Repair Request!",
                // cancelButtonText: 'Claim for Warranty Recovery!',
                confirmButtonClass: "btn btn-success mt-2",
                // cancelButtonClass: 'btn btn-info ml-2 mt-2',
                buttonsStyling: false,
                allowOutsideClick: false,
              }).then((result) => {
                if (result.value) {
                  // Allow the user to Proceed with a New RR
                  this.showsave = true;
                } else if (result.dismiss === Swal.DismissReason.cancel) {
                  this.AddForm.patchValue({
                    IsWarrantyRecovery: "1",
                  });
                  this.IsWarrantyRecovery = "1";
                  this.showsave = true;
                  // The user will not be allowed to add this RR
                  /*  Swal.fire({
                   title: 'Cancelled',
                   text: 'Cancelled the Repair Request!',
                   type: 'error'
                 });
                 this.reLoad(); */
                }
              });
            }
          }
        } else {
          this.showsave = true;
        }
      });
  }

  reLoad() {
    this.router.navigate([this.currentRouter]);
  }

  getDepartmentDetails(DepartmentId) {
    var IdentityId = this.CustomerId;

    // Quote for Add New
    if (DepartmentId == 0) {
      this.modalRef = this.CommonmodalService.show(AddDepartmentComponent, {
        backdrop: "static",
        ignoreBackdropClick: false,

        initialState: {
          data: { IdentityId },
          class: "modal-lg",
        },
        class: "gray modal-lg",
      });

      this.modalRef.content.closeBtnName = "Close";
      this.modalRef.content.event.subscribe((modelResponse) => {
        // Update the Customer Department List
        this.departmentNewList = [];
        this.departmentList = [];
        var postData = { CustomerId: IdentityId };
        this.service
          .postHttpService(postData, "getCustomerDepartmentListDropdown")
          .subscribe((response) => {
            this.departmentNewList.push({
              DepartmentId: 0,
              DepartmentName: "+ Add New",
            });
            for (var i in response.responseData) {
              this.departmentNewList.push({
                DepartmentId: response.responseData[i].CustomerDepartmentId,
                DepartmentName: response.responseData[i].CustomerDepartmentName,
              });
            }
            this.departmentList = this.departmentNewList;
          });
        this.DepartmentId = modelResponse.data.CustomerDepartmentId;
      });
    }
  }

  getAssetDetails(AssetId) {
    var IdentityId = this.CustomerId;

    // Quote for Add New
    if (AssetId == 0) {
      this.modalRef = this.CommonmodalService.show(AddAssetComponent, {
        backdrop: "static",
        ignoreBackdropClick: false,
        initialState: {
          data: { IdentityId },
          class: "modal-lg",
        },
        class: "gray modal-lg",
      });

      this.modalRef.content.closeBtnName = "Close";
      this.modalRef.content.event.subscribe((modelResponse) => {
        // Update the Customer Asset List
        this.assetNewList = [];
        this.assetList = [];
        var postData = { CustomerId: IdentityId };
        this.service
          .postHttpService(postData, "getAssetListDropdown")
          .subscribe((response) => {
            this.assetNewList.push({ AssetId: 0, AssetName: "+ Add New" });
            for (var i in response.responseData) {
              this.assetNewList.push({
                AssetId: response.responseData[i].CustomerAssetId,
                AssetName: response.responseData[i].CustomerAssetName,
              });
            }
            this.assetList = this.assetNewList;
          });
        this.AssetId = modelResponse.data.CustomerAssetId;
      });
    }
  }

  keydownInDropdown(event) {
    if (event.keyCode == 13) {
      // set highlighted value as selected value. (default)
    }

    if (event.keyCode == 37 || event.keyCode == 39) {
      // set highlighted value as selected value.
    }
  }

  openPopup1(content) {
    this.modalRef = this.CommonmodalService.show(content, {
      backdrop: "static",
      ignoreBackdropClick: false,
      initialState: {
        class: "modal-lg",
      },
      class: "gray modal-lg",
    });
    this.modalRef.content.closeBtnName = "Close";
  }

  openPopup(PartId, e) {
    var CustomerId = this.CustomerId;
    var Symbol = this.Symbol;
    var LocalCurrencyCode = this.LocalCurrencyCode;
    if (e.target.outerText == "+ Add New") {
      this.modalRef = this.CommonmodalService.show(AddRrPartsComponent, {
        backdrop: "static",
        ignoreBackdropClick: false,
        initialState: {
          data: { CustomerId, Symbol, LocalCurrencyCode },
          class: "modal-lg",
        },
        class: "gray modal-lg",
      });

      this.modalRef.content.closeBtnName = "Close";
      this.modalRef.content.event.subscribe((modelResponse) => {
        // Display the details
        this.RRDescription = modelResponse.data.Description
          ? this.getReplace(modelResponse.data.Description)
          : "";
        this.Description = modelResponse.data.Description
          ? this.getReplace(modelResponse.data.Description)
          : "";
        this.Manufacturer = modelResponse.data.ManufacturerId;
        this.ManufactuerName = modelResponse.data.ManufacturerName;
        this.PartId = modelResponse.data.PartId;
        this.PartNo = modelResponse.data.PartNo;
        this.PON = modelResponse.data.NewPrice;
        // this.LPP = modelResponse.data.LastPricePaid;
        this.ManufacturerPartNo = modelResponse.data.ManufacturerPartNo || "";
        //this.SerialNo = response.data.SerialNo;
        this.Quantity = modelResponse.data.Quantity;

        this.AddForm.patchValue({
          CustomerPartNo1: modelResponse.data.CustomerPartNo1,
          CustomerPartNo2: modelResponse.data.CustomerPartNo2,
        });

        // Update the Customer Parts List
        this.partNewList = [];
        this.partList = [];
        var postData = { CustomerId: CustomerId };
        this.service
          .postHttpService(postData, "getPartListDropdown")
          .subscribe((response) => {
            this.partNewList.push({ PartId: 0, PartNo: "+ Add New" });
            for (var i in response.responseData) {
              this.partNewList.push({
                PartId: response.responseData[i].PartId,
                PartNo: response.responseData[i].PartNo,
              });
            }
            this.partList = this.partNewList;
          });
      });
    } else if (e.target.outerText == "Parts Not Available + Add New") {
      if (this.CustomerId) {
        this.modalRef = this.CommonmodalService.show(AddRrPartsComponent, {
          backdrop: "static",
          ignoreBackdropClick: false,
          initialState: {
            data: { CustomerId, Symbol, LocalCurrencyCode },
            class: "modal-lg",
          },
          class: "gray modal-lg",
        });

        this.modalRef.content.closeBtnName = "Close";
        this.modalRef.content.event.subscribe((modelResponse) => {
          // Display the details
          this.RRDescription = modelResponse.data.Description
            ? this.getReplace(modelResponse.data.Description)
            : "";
          this.Description = modelResponse.data.Description
            ? this.getReplace(modelResponse.data.Description)
            : "";
          this.Manufacturer = modelResponse.data.ManufacturerId;
          this.ManufactuerName = modelResponse.data.ManufacturerName;
          this.PartId = modelResponse.data.PartId;
          this.PartNo = modelResponse.data.PartNo;
          this.PON = modelResponse.data.NewPrice;
          // this.LPP = modelResponse.data.LastPricePaid;
          this.ManufacturerPartNo = modelResponse.data.ManufacturerPartNo || "";
          //this.SerialNo = response.data.SerialNo;
          this.Quantity = modelResponse.data.Quantity;
          this.AddForm.patchValue({
            CustomerPartNo1: modelResponse.data.CustomerPartNo1,
            CustomerPartNo2: modelResponse.data.CustomerPartNo2,
          });
          // Update the Customer Parts List
          this.partNewList = [];
          this.partList = [];
          var postData = { CustomerId: CustomerId };
          this.service
            .postHttpService(postData, "getPartListDropdown")
            .subscribe((response) => {
              this.partNewList.push({ PartId: 0, PartNo: "+ Add New" });
              for (var i in response.responseData) {
                this.partNewList.push({
                  PartId: response.responseData[i].PartId,
                  PartNo: response.responseData[i].PartNo,
                });
              }
              this.partList = this.partNewList;
            });
        });
      } else {
        Swal.fire({
          title: "Message",
          text: "Please Choose the Customer",
          type: "info",
          confirmButtonClass: "btn btn-confirm mt-2",
        });
      }
    }
  }

  searchFunction(term, item) {
    // this.partNewList.push({ "PartId": 0, "PartNo": '+ Add New' });
    // return  this.partList = this.partNewList;
  }

  getPartDetails(PartId) {
    var CustomerId = this.CustomerId;

    // Initially reset the values
    this.Description = "";
    this.Manufacturer = "";
    this.PartNo = "";
    this.PON = "";
    this.LPP = "";
    this.SerialNo = "";
    this.ManufacturerPartNo = "";

    // Quote for Add New
    // Already handled in click event
    if (PartId == 0) {
      // this.modalRef = this.CommonmodalService.show(AddRrPartsComponent,
      //   {
      //     initialState: {
      //       data: { CustomerId },
      //       class: 'modal-lg'
      //     }, class: 'gray modal-lg'
      //   });
      // this.modalRef.content.closeBtnName = 'Close';
      // this.modalRef.content.event.subscribe(modelResponse => {
      //   console.log(modelResponse)
      //   // Display the details
      //   this.RRDescription = modelResponse.data.Description || '';
      //   this.Description = modelResponse.data.Description || '';
      //   this.Manufacturer = modelResponse.data.ManufacturerId;
      //   this.PartId = modelResponse.data.PartId;
      //   this.PartNo = modelResponse.data.PartNo;
      //   this.PON = modelResponse.data.NewPrice;
      //   this.LPP = modelResponse.data.LastPricePaid;
      //   this.ManufacturerPartNo = modelResponse.data.ManufacturerPartNo || '';
      //   //this.SerialNo = response.data.SerialNo;
      //   this.Quantity = modelResponse.data.Quantity;
      //   // Update the Customer Parts List
      //   this.partNewList = [];
      //   this.partList = [];
      //   var postData = { "CustomerId": CustomerId };
      //   this.service.postHttpService(postData, 'getPartListDropdown').subscribe(response => {
      //     console.log(response, 'getPartListDropdown')
      //     this.partNewList.push({ "PartId": 0, "PartNo": '+ Add New' });
      //     for (var i in response.responseData) {
      //       this.partNewList.push({ "PartId": response.responseData[i].PartId, "PartNo": response.responseData[i].PartNo });
      //     }
      //     this.partList = this.partNewList;
      //   });
      // });
    } else {
      var postData = { PartId: PartId, CustomerId: CustomerId };
      this.service
        .postHttpService(postData, "getPartDetails")
        .subscribe((response) => {
          this.RRDescription = this.getReplace(
            response.responseData[0].Description
          );
          this.Description = this.getReplace(
            response.responseData[0].Description
          );
          this.ManufactuerName = response.responseData[0].Manufacturer;
          this.Manufacturer = response.responseData[0].ManufacturerId;
          this.PartNo = response.responseData[0].PartNo;
          //this.PON = response.responseData[0].Price;
          //this.LPP = response.responseData[0].LastPricePaid;
          this.ManufacturerPartNo = response.responseData[0].ManufacturerPartNo;
          this.SerialNo = response.responseData[0].SerialNo;
          this.Quantity = response.responseData[0].Quantity;
          this.AddForm.patchValue({
            CustomerPartNo1: response.responseData[0].CustomerPartNo1,
            CustomerPartNo2: response.responseData[0].CustomerPartNo2,
          });
        });
      this.getPartPrice(PartId);
    }
  }

  getPartPrice(PartId) {
    this.LPPList = [];
    var postData = { PartId: PartId, CustomerId: this.CustomerId };
    this.service
      .postHttpService(postData, "RRGetPartPrice")
      .subscribe((response) => {
        for (var i in response.responseData.LPPInfo) {
          this.LPPList.push(response.responseData.LPPInfo[i].LPP);
        }
        this.LPP = this.LPPList.join(", ");
        this.PON = response.responseData.PartInfo.PON;
      });
  }

  getCustomerProperties(CustomerId, event) {
    this.AddForm.value.CustomerReferenceList = [];
    this.CustomerReferenceList.clear();
    this.customerRef = 0;

    this.PriorityNotes = event.PriorityNotes || "";
    if (!CustomerId) {
      this.assetList = [];
      this.customerReferenceList = [];
      this.AddForm.value.CustomerReferenceList = [];

      return false;
    }
    var postData = { CustomerId: CustomerId };

    //departmentList dropdown
    this.departmentNewList = [];
    this.departmentList = [];
    this.service
      .postHttpService(postData, "getCustomerDepartmentListDropdown")
      .subscribe((response) => {
        this.departmentNewList.push({
          DepartmentId: 0,
          DepartmentName: "+ Add New",
        });
        for (var i in response.responseData) {
          this.departmentNewList.push({
            DepartmentId: response.responseData[i].CustomerDepartmentId,
            DepartmentName: response.responseData[i].CustomerDepartmentName,
          });
        }
        this.departmentList = this.departmentNewList;
      });

    //assetList dropdown
    this.assetNewList = [];
    this.assetList = [];
    this.service
      .postHttpService(postData, "getAssetListDropdown")
      .subscribe((response) => {
        this.assetNewList.push({ AssetId: 0, AssetName: "+ Add New" });
        for (var i in response.responseData) {
          this.assetNewList.push({
            AssetId: response.responseData[i].CustomerAssetId,
            AssetName: response.responseData[i].CustomerAssetName,
          });
        }
        this.assetList = this.assetNewList;
      });

    //referenceList dropdown
    this.service
      .postHttpService(postData, "getCustomerReferenceListDropdown")
      .subscribe((response) => {
        this.customerReferenceList = response.responseData;
        if (this.customerReferenceList.length > 0) {
          for (let val of this.customerReferenceList) {
            this.CustomerReferenceList.push(
              this.fb.group({
                CReferenceId: val.CReferenceId,
                ReferenceLabelName: val.CReferenceName,
                ReferenceValue: ["", Validators.required],
              })
            );
          }
        }
        this.Edit;
      });

    // Customer Parts List
    this.partNewList = [];
    this.partList = [];
    this.service
      .postHttpService(postData, "getPartListDropdown")
      .subscribe((response) => {
        this.partNewList.push({ PartId: 0, PartNo: "+ Add New" });
        for (var i in response.responseData) {
          this.partNewList.push({
            PartId: response.responseData[i].PartId,
            PartNo: response.responseData[i].PartNo,
          });
        }
        this.partList = this.partNewList;
      });
  }

  getAdminView(event, UserId) {
    var postData = { UserId: UserId };
    this.service
      .postHttpService(postData, "getUserView")
      .subscribe((response) => {
        this.ContactPhone = response.responseData.PhoneNo;
        this.ContactEmail = response.responseData.Email;
      });
  }

  fileProgressMultiple(event: any) {
    this.fileData = event.target.files[0];
    const formData = new FormData();
    //var fileData = event.target.files;
    var filesarray = event.target.files;
    for (var i = 0; i < filesarray.length; i++) {
      formData.append("files", filesarray[i]);
    }
    this.spinner = true;
    //console.log(this.AddFormControl.Attachment.valid)
    if (this.AddFormControl.Attachment.valid == true) {
      this.service.postHttpImageService(formData, "RRImageupload").subscribe(
        (response) => {
          this.imageresult = response.responseData;

          for (var x in this.imageresult) {
            this.RRImagesList.push({
              IdentityType: "0", // For RR
              path: this.imageresult[x].location,
              originalname: this.imageresult[x].originalname,
              mimetype: this.imageresult[x].mimetype,
              size: this.imageresult[x].size,
            });
          }
          this.spinner = false;

          this.cd_ref.detectChanges();
        },
        (error) => console.log(error)
      );
    } else {
      this.spinner = false;
    }
  }

  //get form validation control
  get AddFormControl() {
    return this.AddForm.controls;
  }

  getReplace(val) {
    // var firstdata = val.replace(/\'/g, "'");
    // console.log(firstdata)
    // var data = firstdata.replace(/\\/g, "");
    // console.log(data)
    // return data;
    if (val) {
      var firstdata = val.replace("\\", "");
      var data = firstdata.replace(/\'/g, "'");
      console.log(data);
      return data;
    } else {
      return val;
    }
  }
  setReplace(val) {
    if (val) {
      // var data = val.replace(/'/g, "\'");
      var firstdata = val.replace("\\", "");
      var data = firstdata.replace("'", "\\'");
      console.log("data", data);
      return data;
    } else {
      return val;
    }
  }
}
