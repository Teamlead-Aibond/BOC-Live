import {
  Component,
  OnInit,
  ChangeDetectorRef,
  EventEmitter,
} from "@angular/core";
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormArray,
  ValidationErrors,
} from "@angular/forms";
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
  selector: "app-repair-request-patch",
  templateUrl: "./repair-request-patch.component.html",
  styleUrls: ["./repair-request-patch.component.scss"],
})
export class RepairRequestPatchComponent implements OnInit {
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
  CustomerReferenceListCheck: any = [];
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
  PON: any = [];
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
  partLoop: any = ["1"];
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
    document.title = "WO Add";

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
      // DepartmentId: [''],
      // AssetId: [''],
      // PartNo: [''],
      // Price: [''],
      // PartId: ['', Validators.required],
      // SerialNo: ['', [Validators.required, Validators.pattern('[a-zA-Z0-9]*')]],
      // IsRushRepair: [false],
      // IsWarrantyRecovery: [''],
      // IsRepairTag: [false],
      // IsWarrantyDenied:[false],
      // RRDescription: ['', Validators.required],
      // RRDescription: [''],
      // StatedIssue: ['',Validators.required],

      UserId: [""],
      ContactPhone: [""],
      ContactEmail: ["", Validators.email],
      CustomerReferenceListTemp: this.fb.array([]),
      // ManufacturerPartNo: [''],
      // Quantity: ['', Validators.required],
      // LeadTime: [''],
      // CustomerPartNo1: [''],
      // CustomerPartNo2: [''],
      // Description: [''],
      // Manufactuer: [''],
      // CustomerReferenceList: this.fb.array([
      //   // this.fb.group({
      //   //   CReferenceId: ['', [Validators.required, RxwebValidators.unique()]],
      //   //   ReferenceValue: ['', Validators.required],
      //   //   ReferenceLabelName: ['']
      //   // })
      // ]),
      // Attachment: ['', [
      //   RxwebValidators.extension({ extensions: ["png", "jpeg", "jpg", "gif"] })
      // ]
      // ],
      RepairPartsList: this.fb.array([
        this.fb.group({
          PartNo: ["", Validators.required],
          Price: [""],
          PartId: ["", Validators.required],
          SerialNo: [
            "",
            [Validators.required, Validators.pattern("[a-zA-Z0-9]*")],
          ],
          Description: [""],
          ManufactuerName: [""],
          Manufactuer: [""],
          ManufacturerPartNo: [""],
          LeadTime: [""],
          Quantity: ["", Validators.required],
          CustomerPartNo1: [""],
          CustomerPartNo2: [""],
          RRDescription: [""],
          StatedIssue: ["", Validators.required],
          IsRushRepair: [false],
          IsWarrantyRecovery: [""],
          IsRepairTag: [false],
          DepartmentId: [""],
          AssetId: [""],
          LPP: [""],
          PON: [""],
          RRImagesList: [""],
          Attachment: [
            "",
            [
              RxwebValidators.extension({
                extensions: ["png", "jpeg", "jpg", "gif"],
              }),
            ],
          ],
          RRParts: [""],
          CRList: [""],
          CustomerReferenceList: [""],
          // RRParts: this.fb.array([]),
          // CustomerReferenceList: this.fb.array([]),
          ReferenceLabelName0: [""],
          CReferenceId0: [""],
          ReferenceValue0: [""],

          ReferenceLabelName1: [""],
          CReferenceId1: [""],
          ReferenceValue1: [""],

          ReferenceLabelName2: [""],
          CReferenceId2: [""],
          ReferenceValue2: [""],

          ReferenceLabelName3: [""],
          CReferenceId3: [""],
          ReferenceValue3: [""],

          ReferenceLabelName4: [""],
          CReferenceId4: [""],
          ReferenceValue4: [""],

          ReferenceLabelName5: [""],
          CReferenceId5: [""],
          ReferenceValue5: [""],
        }),
      ]),
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
    // console.log($event);
    // console.log(this.CustomerReferenceList)
    this.CustomerCountryId = $event.CustomerLocation;
    this.CustomerCountry = this.countryList.find(
      (a) => a.CountryId == this.CustomerCountryId
    ).CountryName;

    if (this.CustomerCountryId != this.Location) {
      Swal.fire({
        title: "Country Mismatch",
        html:
          '<b style=" font-size: 14px !important;">' +
          `Customer Country : <span class="badge badge-primary btn-xs">${this.CustomerCountry}</span> , Aibond Country : <span class="badge badge-pink btn-xs">${this.LocationName}</span> . Are you Sure to Process this!` +
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
          // this.AddForm.value.CustomerReferenceList = [];
          this.RepairPartsList.value.CustomerReferenceList = [];
          this.AddForm.get("RepairPartsList").value.CustomerReferenceList = [];
          // this.CustomerReferenceList.clear();

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
      // this.AddForm.value.CustomerReferenceList = [];
      this.RepairPartsList.value.CustomerReferenceList = [];
      this.AddForm.get("RepairPartsList").value.CustomerReferenceList = [];
      // this.CustomerReferenceList.clear();

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
    // this.AddForm.value.CustomerReferenceList = [];
    this.RepairPartsList.value.CustomerReferenceList = [];
    this.AddForm.get("RepairPartsList").value.CustomerReferenceList = [];
    // this.CustomerReferenceList.clear();
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
      // this.CustomerReferenceList.push(this.fb.group({
      //   "CReferenceId": res.data.CReferenceId,
      //   "ReferenceLabelName": res.data.CReferenceName,
      //   "ReferenceValue": ['', Validators.required],

      // }));
    });
  }

  // get Ref(): FormArray {
  //   return this.AddForm.get('CustomerReferenceList') as FormArray;
  //}
  //addReference

  get CustomerReferenceList(): FormArray {
    // console.log(this.AddForm.get('RepairPartsList').value.get('CustomerReferenceList'));
    // return this.AddForm.get('RepairPartsList').value.CustomerReferenceList as FormArray;
    // return this.AddForm.get('RepairPartsList').get('CustomerReferenceList') as FormArray;
    // return this.AddForm.get('CustomerReferenceList') as FormArray;
    // return this.RepairPartsList().at(1).get("CustomerReferenceList") as FormArray
    return this.AddForm.get("CustomerReferenceListTemp") as FormArray;
  }
  async onSubmit(AddForm) {
    this.submitted = true;
    if (this.customerReferenceList.length == 0) {
      this.customerRef = "Error";
    }
    // this.getFormValidationErrors();
    // this.findInvalidControlsRecursive(this.AddForm);
    // console.log(this.AddForm.valid);
    if (this.AddForm.valid && this.customerReferenceList.length != 0) {
      await this.insertRRParts();
      this.btnDisabled = true;
      let obj = this;

      var postData = this.AddForm.value;
      // console.log(postData);
      this.service.postHttpService(postData, "RepairRequestBatchAdd").subscribe(
        (response) => {
          // console.log(response);
          if (response.status == true) {
            Swal.fire({
              title: "Success!",
              text: "Record saved Successfully!",
              type: "success",
              confirmButtonClass: "btn btn-confirm mt-2",
            });
            // this.router.navigate(['/admin/repair-request/edit'], { state: { RRId: response.responseData.data } });
            var stateData = {
              RRId:
                response.responseData && response.responseData.data
                  ? response.responseData.data
                  : "",
            };
            this.router.navigate(["/admin/repair-request/batch-list"], {
              state: { RRIds: stateData },
            });
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
  async insertRRParts() {
    // console.log(this.AddForm.value);
    // console.log(this.AddForm.value.RepairPartsList);
    // this.CustomerReferenceList.clear();
    // Object.entries($
    this.AddForm.value.RepairPartsList.forEach((repairPart, index) => {
      // console.log(repairPart);
      // console.log(index);
      this.RRParts = [];
      const formGroup = this.RepairPartsList.controls[index] as FormGroup;
      // const parts = this.AddForm.get('RepairPartsList') as FormArray;

      this.CustomerReferenceListCheck = [];
      var k = 0;
      for (let val of this.customerReferenceList) {
        // this.customerReferenceList.forEach((val, index) => {
        // this.CustomerReferenceList.push(this.fb.group({
        //   "CReferenceId": val.CReferenceId,
        //   "ReferenceLabelName": val.CReferenceName,
        //   "ReferenceValue": formGroup.controls['ReferenceValue'+k].value
        // }));

        this.CustomerReferenceListCheck.push({
          CReferenceId: val.CReferenceId,
          ReferenceLabelName: val.CReferenceName,
          ReferenceValue: formGroup.controls["ReferenceValue" + k].value,
        });
        // });
        k++;
      }
      this.RRParts.push({
        PartId: repairPart.PartId,
        PartNo: repairPart.PartNo,
        Price: repairPart.Price,
        CustomerPartNo1: repairPart.CustomerPartNo1,
        CustomerPartNo2: repairPart.CustomerPartNo2,
        Description: this.getReplace(repairPart.Description),
        Manufacturer: repairPart.ManufacturerId,
        ManufacturerPartNo: repairPart.ManufacturerPartNo,
        SerialNo: repairPart.SerialNo,
        LeadTime: repairPart.LeadTime,
        Quantity: repairPart.Quantity,
        // "cRef": this.CustomerReferenceList
      });
      // console.log(this.CustomerReferenceListCheck);
      // console.log(this.CustomerReferenceList);
      formGroup.controls["RRParts"].patchValue(this.RRParts);
      formGroup.controls["CRList"].patchValue(this.CustomerReferenceListCheck);
      formGroup.controls["CustomerReferenceList"].patchValue(
        this.CustomerReferenceListCheck
      );
    });
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
    this.modalRef.content.event.subscribe((res) => { });
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

  checkWarranty(event, i) {
    const formGroup = this.RepairPartsList.controls[i] as FormGroup;
    var PartNo =
      this.RepairPartsList.controls[i]["controls"]["PartNo"]["value"];
    var SerialNo = event.target.value;
    const result = this.RepairPartsList.controls.filter(
      (part) => part.value.SerialNo === SerialNo && part.value.PartNo === PartNo
    );

    console.log(result);

    if (result.length > 1) {
      event.target.value = "";
      Swal.fire({
        title: "Error!",
        text:
          "The SerialNo # " +
          SerialNo +
          " is already entred for the same Part# " +
          PartNo +
          " !",
        type: "warning",
        confirmButtonClass: "btn btn-confirm mt-2",
      });
    } else {
      $(document).on("click", ".SwalBtn1", function () {
        Swal.close();
      });
      var postData = { PartNo: PartNo, SerialNo: SerialNo };
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
                  `<div class="col-6"><h5 class="font-weight-normal text-muted">Cusotmer Name</h5><h5 class="m-b-30">' + ${ApprovedQuoteInfo.length > 0
                    ? response.responseData.ApprovedQuoteInfo[0].CompanyName
                    : ""
                  } + '</h5></div>` +
                  '<div class="col-6"><h5 class="font-weight-normal text-muted">Current Status</h5><h5 class="m-b-30">' +
                  response.responseData.RRInfo[0].StatusName +
                  "</h5></div>" +
                  "</div>" +
                  '<div class="row mt-1">' +
                  `<div class="col-6"><h5 class="font-weight-normal text-muted">Invoice Amount ($)</h5><h5 class="m-b-30">' + ${ApprovedQuoteInfo.length > 0
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
                  "</p></div>",
                showCloseButton: true,
                showCancelButton: true,
                focusConfirm: false,
                showConfirmButton: false,
                cancelButtonClass: "btn btn-info ml-2 mt-2",
                buttonsStyling: false,
              }).then((result) => {
                if (result.value) {
                  // Allow the user to Proceed with a New RR
                  this.showsave = true;
                } else if (result.dismiss === Swal.DismissReason.cancel) {
                  this.clearSingleRecord(i);
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
                    '<div class="text-center"><a class="btn btn-warning SwalBtn1">Create New Repair Request!</a></div>',
                  showCloseButton: true,
                  showCancelButton: true,
                  focusConfirm: false,
                  confirmButtonText: "Cancel",
                  cancelButtonText: "Claim for Warranty Recovery!",
                  confirmButtonClass: "btn btn-success mt-2",
                  cancelButtonClass: "btn btn-info ml-2 mt-2",
                  buttonsStyling: false,
                  allowOutsideClick: false,
                }).then((result) => {
                  if (result.value) {
                    // Allow the user to Proceed with a New RR
                    this.clearSingleRecord(i);
                    this.showsave = true;
                  } else if (result.dismiss === Swal.DismissReason.cancel) {
                    formGroup.controls["IsWarrantyRecovery"].patchValue(1);
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
                    response.responseData.RejectedQuoteInfo[0].RouteCause !=
                      null
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
                    "</p></div>",
                  showCloseButton: true,
                  showCancelButton: true,
                  focusConfirm: false,
                  confirmButtonText: "Create New Repair Request!",
                  // cancelButtonText: 'Claim for Warranty Recovery!',
                  confirmButtonClass: "btn btn-success mt-2",
                  // cancelButtonClass: 'btn btn-info ml-2 mt-2',
                  buttonsStyling: false,
                  allowOutsideClick: false,
                }).then((result) => {
                  if (result.value) {
                    this.showsave = true;
                  } else if (result.dismiss === Swal.DismissReason.cancel) {
                    this.clearSingleRecord(i);
                  }
                });
              }
            }
          } else {
            this.showsave = true;
          }
        });
    }
  }

  clearSingleRecord(index: any) {
    // console.log(index);
    const formGroup = this.RepairPartsList.controls[index] as FormGroup;
    formGroup.controls["PartId"].patchValue("");
    formGroup.controls["PartNo"].patchValue("");
    formGroup.controls["RRDescription"].patchValue("");
    formGroup.controls["Description"].patchValue("");
    // formGroup.controls['ManufactuerName'].patchValue(response.responseData[0].Manufacturer);
    formGroup.controls["Manufactuer"].patchValue("");
    formGroup.controls["PartNo"].patchValue("");
    formGroup.controls["ManufacturerPartNo"].patchValue("");
    formGroup.controls["SerialNo"].patchValue("");
    formGroup.controls["Quantity"].patchValue("");
    formGroup.controls["CustomerPartNo1"].patchValue("");
    formGroup.controls["CustomerPartNo2"].patchValue("");
    formGroup.controls["PON"].patchValue("");
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

  async openPopup1(content) {
    if (this.CustomerId) {
      await this.callRef();
      this.modalRef = this.CommonmodalService.show(content, {
        backdrop: "static",
        ignoreBackdropClick: false,
        initialState: {
          class: "modal-lg",
        },
        class: "gray modal-lg",
      });
      // this.modalRef.content.closeBtnName = 'Close';
    } else {
      Swal.fire({
        title: "Error!",
        text: "Customer not be found!",
        type: "warning",
        confirmButtonClass: "btn btn-confirm mt-2",
      });
    }
  }
  async callRef() {
    // console.log(this.customerReferenceList);
    this.customerReferenceList = [];
    if (this.CustomerId) {
      var postData = { CustomerId: this.CustomerId };
      this.service
        .postHttpService(postData, "getCustomerReferenceListDropdown")
        .subscribe((response) => {
          // console.log(response.responseData);
          this.customerReferenceList = response.responseData;
          if (this.customerReferenceList.length > 0) {
            for (let val of this.customerReferenceList) {
              // this.CustomerReferenceList.push(this.fb.group({
              //   "CReferenceId": val.CReferenceId,
              //   "ReferenceLabelName": val.CReferenceName,
              //   "ReferenceValue": ['', Validators.required],
              // }));
            }
          }
          // console.log(this.CustomerReferenceList);
          this.Edit;
        });
    } else {
      Swal.fire({
        title: "Error!",
        text: "Customer not be found!",
        type: "warning",
        confirmButtonClass: "btn btn-confirm mt-2",
      });
    }
  }

  openPopup(PartId, e, i) {
    var CustomerId = this.CustomerId;
    // console.log(this.CustomerId);
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
        this.PON[i] = modelResponse.data.NewPrice;
        // this.PON.push({i: modelResponse.data.NewPrice});
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
          this.PON[i] = modelResponse.data.NewPrice;
          // this.PON[i].push(modelResponse.data.NewPrice);
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

  getPartDetails(PartId, item, i) {
    var error = false;
    var CustomerId = this.CustomerId;
    const formGroup = this.RepairPartsList.controls[i] as FormGroup;
    //get form array reference
    const parts = this.AddForm.get("RepairPartsList") as FormArray;
    // console.log(parts.value);
    const result = this.RepairPartsList.controls.filter(
      (part) => part.value.PartNo === item.PartNo
    );
    // console.log(result.length);
    // Initially reset the values
    formGroup.controls["Description"].setValue("");
    formGroup.controls["Manufactuer"].setValue("");
    formGroup.controls["PartNo"].setValue("");
    // formGroup.controls['PON'].setValue('');
    // formGroup.controls['LPP'].setValue('');
    formGroup.controls["SerialNo"].setValue("");
    formGroup.controls["ManufacturerPartNo"].setValue("");

    // Quote for Add New
    // Already handled in click event
    if (PartId == 0) {
      //
    } else {
      var postData = { PartId: item.PartId, CustomerId: CustomerId };
      this.service
        .postHttpService(postData, "getPartDetails")
        .subscribe((response) => {
          formGroup.controls["PartId"].patchValue(item.PartId);
          formGroup.controls["PartNo"].patchValue(item.PartNo);
          formGroup.controls["RRDescription"].patchValue(
            this.getReplace(response.responseData[0].Description)
          );
          formGroup.controls["Description"].patchValue(
            this.getReplace(response.responseData[0].Description)
          );
          // formGroup.controls['ManufactuerName'].patchValue(response.responseData[0].Manufacturer);
          formGroup.controls["Manufactuer"].patchValue(
            response.responseData[0].ManufacturerId
          );
          formGroup.controls["PartNo"].patchValue(
            response.responseData[0].PartNo
          );
          formGroup.controls["ManufacturerPartNo"].patchValue(
            response.responseData[0].ManufacturerPartNo
          );
          formGroup.controls["SerialNo"].patchValue(
            response.responseData[0].SerialNo
          );
          formGroup.controls["Quantity"].patchValue(
            response.responseData[0].Quantity
          );
          formGroup.controls["CustomerPartNo1"].patchValue(
            response.responseData[0].CustomerPartNo1
          );
          formGroup.controls["CustomerPartNo2"].patchValue(
            response.responseData[0].CustomerPartNo2
          );
        });
      this.getPartPrice(PartId, i, item);
      // if (result.length > 0) {
      // Swal.fire({
      //   title: 'Error!',
      //   text: 'The Part # ' + item.PartNo + ' is already selected!',
      //   type: 'warning',
      //   confirmButtonClass: 'btn btn-confirm mt-2'
      // });
      // formGroup.controls['PartId'].patchValue('');
      // formGroup.controls['PartNo'].patchValue('');
      // formGroup.controls['RRDescription'].patchValue('');
      // formGroup.controls['Description'].patchValue('');
      // // formGroup.controls['ManufactuerName'].patchValue(response.responseData[0].Manufacturer);
      // formGroup.controls['Manufactuer'].patchValue('');
      // formGroup.controls['PartNo'].patchValue('');
      // formGroup.controls['ManufacturerPartNo'].patchValue('');
      // formGroup.controls['SerialNo'].patchValue('');
      // formGroup.controls['Quantity'].patchValue('');
      // formGroup.controls['CustomerPartNo1'].patchValue('');
      // formGroup.controls['CustomerPartNo2'].patchValue('');
      //   }else{
      //   var postData = { PartId: item.PartId,CustomerId:CustomerId };
      //   this.service.postHttpService(postData, 'getPartDetails').subscribe(response => {
      //     formGroup.controls['PartId'].patchValue(item.PartId);
      //     formGroup.controls['PartNo'].patchValue(item.PartNo);
      //     formGroup.controls['RRDescription'].patchValue(this.getReplace(response.responseData[0].Description));
      //     formGroup.controls['Description'].patchValue(this.getReplace(response.responseData[0].Description));
      //     // formGroup.controls['ManufactuerName'].patchValue(response.responseData[0].Manufacturer);
      //     formGroup.controls['Manufactuer'].patchValue(response.responseData[0].ManufacturerId);
      //     formGroup.controls['PartNo'].patchValue(response.responseData[0].PartNo);
      //     formGroup.controls['ManufacturerPartNo'].patchValue(response.responseData[0].ManufacturerPartNo);
      //     formGroup.controls['SerialNo'].patchValue(response.responseData[0].SerialNo);
      //     formGroup.controls['Quantity'].patchValue(response.responseData[0].Quantity);
      //     formGroup.controls['CustomerPartNo1'].patchValue(response.responseData[0].CustomerPartNo1);
      //     formGroup.controls['CustomerPartNo2'].patchValue(response.responseData[0].CustomerPartNo2);
      //   });
      //   this.getPartPrice(PartId, i, item);
      // }
    }
  }

  getPartPrice(PartId, i, item) {
    const formGroup = this.RepairPartsList.controls[i] as FormGroup;
    //get form array reference
    const parts = this.AddForm.get("RepairPartsList") as FormArray;
    this.LPPList = [];
    var postData = { PartId: item.PartId, CustomerId: this.CustomerId };
    this.service
      .postHttpService(postData, "RRGetPartPrice")
      .subscribe((response) => {
        for (var i in response.responseData.LPPInfo) {
          this.LPPList.push(response.responseData.LPPInfo[i].LPP);
        }
        this.LPP = this.LPPList.join(", ");
        this.PON[i] = response.responseData.PartInfo.PON;
        // this.PON[i].push(response.responseData.PartInfo.PON);
        console.log(this.PON);
        formGroup.controls["PON"].patchValue(
          response.responseData.PartInfo.PON
        );
        formGroup.controls["LPP"].patchValue(this.LPP);
      });
  }

  getCustomerProperties(CustomerId, event) {
    // this.AddForm.value.CustomerReferenceList = [];
    this.RepairPartsList.value.CustomerReferenceList = [];
    this.AddForm.get("RepairPartsList").value.CustomerReferenceList = [];
    // this.CustomerReferenceList.clear();
    this.customerRef = 0;

    this.PriorityNotes = event.PriorityNotes || "";
    if (!CustomerId) {
      this.assetList = [];
      this.customerReferenceList = [];
      // this.AddForm.value.CustomerReferenceList = [];
      this.RepairPartsList.value.CustomerReferenceList = [];
      this.AddForm.get("RepairPartsList").value.CustomerReferenceList = [];

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
        // console.log(response.responseData);
        this.customerReferenceList = response.responseData;
        if (this.customerReferenceList.length > 0) {
          for (let val of this.customerReferenceList) {
            // this.CustomerReferenceList.push(this.fb.group({
            //   "CReferenceId": val.CReferenceId,
            //   "ReferenceLabelName": val.CReferenceName,
            //   "ReferenceValue": ['', Validators.required],
            // }));
          }
        }
        // console.log(this.CustomerReferenceList);
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

  fileProgressMultiple(event: any, j) {
    const formGroup = this.RepairPartsList.controls[j] as FormGroup;
    //get form array reference
    const parts = this.AddForm.get("RepairPartsList") as FormArray;
    this.RRImagesList[j] = [];
    this.fileData = event.target.files[0];
    const formData = new FormData();
    //var fileData = event.target.files;
    var filesarray = event.target.files;
    for (var i = 0; i < filesarray.length; i++) {
      formData.append("files", filesarray[i]);
    }
    this.spinner = true;
    //console.log(this.AddFormControl.Attachment.valid)
    if (formGroup.controls.Attachment.valid == true) {
      this.service.postHttpImageService(formData, "RRImageupload").subscribe(
        (response) => {
          this.imageresult = response.responseData;

          for (var x in this.imageresult) {
            this.RRImagesList[j].push({
              IdentityType: "0", // For RR
              path: this.imageresult[x].location,
              originalname: this.imageresult[x].originalname,
              mimetype: this.imageresult[x].mimetype,
              size: this.imageresult[x].size,
            });
          }
          formGroup.controls["RRImagesList"].patchValue(this.RRImagesList[j]);
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
      // console.log(data)
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
      // console.log("data", data)
      return data;
    } else {
      return val;
    }
  }

  public addRepairPart(): void {
    // this.partLoop.push(1)
    const control = <FormArray>this.AddFormControl.RepairPartsList;
    control.push(this.initPart());
    // console.log(control);
  }
  get RepairPartsList(): FormArray {
    return this.AddForm.get("RepairPartsList") as FormArray;
  }

  public initPart(): FormGroup {
    return this.fb.group({
      PartNo: ["", Validators.required],
      Price: [""],
      PartId: ["", Validators.required],
      SerialNo: ["", [Validators.required, Validators.pattern("[a-zA-Z0-9]*")]],
      Description: [""],
      Manufactuer: [""],
      ManufacturerPartNo: [""],
      LeadTime: [""],
      Quantity: ["", Validators.required],
      CustomerPartNo1: [""],
      CustomerPartNo2: [""],
      RRDescription: [""],
      StatedIssue: ["", Validators.required],
      IsRushRepair: [false],
      IsWarrantyRecovery: [""],
      IsRepairTag: [false],
      DepartmentId: [""],
      AssetId: [""],
      LPP: [""],
      PON: [""],
      RRImagesList: [""],
      Attachment: [
        "",
        [
          RxwebValidators.extension({
            extensions: ["png", "jpeg", "jpg", "gif"],
          }),
        ],
      ],
      RRParts: [""],
      CRList: [""],
      CustomerReferenceList: [""],
      // RRParts: this.fb.array([]),
      // CustomerReferenceList: this.fb.array([]),
      ReferenceLabelName0: [""],
      CReferenceId0: [""],
      ReferenceValue0: ["", Validators.required],

      ReferenceLabelName1: [""],
      CReferenceId1: [""],
      ReferenceValue1: ["", Validators.required],

      ReferenceLabelName2: [""],
      CReferenceId2: [""],
      ReferenceValue2: ["", Validators.required],

      ReferenceLabelName3: [""],
      CReferenceId3: [""],
      ReferenceValue3: ["", Validators.required],

      ReferenceLabelName4: [""],
      CReferenceId4: [""],
      ReferenceValue4: ["", Validators.required],

      ReferenceLabelName5: [""],
      CReferenceId5: [""],
      ReferenceValue5: ["", Validators.required],
    });
  }
  getFormValidationErrors() {
    console.log(this.AddForm.getError);
    Object.keys(this.AddForm.controls).forEach((key) => {
      const controlErrors: ValidationErrors = this.AddForm.get(key).errors;
      if (controlErrors != null) {
        Object.keys(controlErrors).forEach((keyError) => {
          console.log(
            "Key control: " + key + ", keyError: " + keyError + ", err value: ",
            controlErrors[keyError]
          );
        });
      }
    });

    const invalid = [];
    const controls = this.AddForm.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        invalid.push(name);
      }
    }
    // console.log(invalid);
    // return invalid;
  }
  findInvalidControlsRecursive(AddFormControl: FormGroup | FormArray) {
    var invalidControls: string[] = [];
    let recursiveFunc = (form: FormGroup | FormArray) => {
      Object.keys(form.controls).forEach((field) => {
        const control = form.get(field);
        if (control.invalid) invalidControls.push(field);
        if (control instanceof FormGroup) {
          recursiveFunc(control);
        } else if (control instanceof FormArray) {
          recursiveFunc(control);
        }
      });
    };
    recursiveFunc(AddFormControl);
    console.log(invalidControls);
  }

  removePart(i: number) {
    var partId = this.RepairPartsList.controls[i].get("PartId").value;
    if (partId > 0) {
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
          this.RepairPartsList.removeAt(i);
        } else if (
          // Read more about handling dismissals
          result.dismiss === Swal.DismissReason.cancel
        ) {
          Swal.fire({
            title: "Cancelled",
            text: "Part is safe:)",
            type: "error",
          });
        }
      });
    } else {
      this.RepairPartsList.removeAt(i);
    }
  }
}
