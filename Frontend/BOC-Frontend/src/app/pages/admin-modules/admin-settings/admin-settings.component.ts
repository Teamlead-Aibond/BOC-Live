/* ===================================================
 * @copyright Copyright  2020 - 2023 Aibond Corp.
 *
 * All Rights Reserved.
 *
 * ========================================================== */
import {
  Component,
  OnInit,
  ViewChild,
  AfterViewInit,
  TemplateRef,
  Input,
  ChangeDetectorRef,
} from "@angular/core";
import { CommonService } from "src/app/core/services/common.service";
import Swal from "sweetalert2";
import { Router } from "@angular/router";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { AddressComponent } from "../common-template/address/address.component";
import { EditAddressComponent } from "../common-template/edit-address/edit-address.component";
import {
  CONST_CREATE_ACCESS,
  CONST_DELETE_ACCESS,
  CONST_MODIFY_ACCESS,
  CONST_VIEW_ACCESS,
} from "src/assets/data/dropdown";

@Component({
  selector: "app-admin-settings",
  templateUrl: "./admin-settings.component.html",
  styleUrls: ["./admin-settings.component.scss"],
})
export class AdminSettingsComponent implements OnInit {
  //, AfterViewInit
  // bread crumb items
  breadCrumbItems: Array<{}>;
  vendorList: any = [];
  countryList: any = [];
  StateList: any = [];
  AddressList: any = [];
  CountryId;
  clsactive = "general";
  result;
  fileData;
  previewUrl;
  url;
  mimeType;
  @Input() templateSettings: TemplateRef<HTMLElement>;
  @ViewChild("generalSettings", null) generalSettings: TemplateRef<HTMLElement>;
  @ViewChild("Quote", null) Quote: TemplateRef<HTMLElement>;
  @ViewChild("SO", null) SO: TemplateRef<HTMLElement>;
  @ViewChild("PO", null) PO: TemplateRef<HTMLElement>;
  @ViewChild("Invoice", null) Invoice: TemplateRef<HTMLElement>;
  @ViewChild("VendorBill", null) VendorBill: TemplateRef<HTMLElement>;
  @ViewChild("address", null) address: TemplateRef<HTMLElement>;
  //access rights variable
  IsViewEnabled;
  IsAddEnabled;
  IsEditEnabled;
  IsDeleteEnabled;

  constructor(
    private commonService: CommonService,
    private modalService: BsModalService,
    public modalRef: BsModalRef,
    private cd_ref: ChangeDetectorRef,
    private router: Router
  ) {}

  ngOnInit(): void {
    document.title = "Settings";

    this.breadCrumbItems = [
      { label: "Aibond", path: "/" },
      { label: "Settings", path: "/", active: true },
    ];

    this.result = "";
    this.loadTemplate("general");
    this.getVendorList();
    this.getCountryList();
    this.getViewContent();
    this.getAHaddress();

    this.IsViewEnabled = this.commonService.permissionCheck(
      "Settings",
      CONST_VIEW_ACCESS
    );
    this.IsEditEnabled = this.commonService.permissionCheck(
      "Settings",
      CONST_MODIFY_ACCESS
    );
  }

  getVendorList() {
    this.commonService
      .getHttpService("getVendorListDropdown")
      .subscribe((response) => {
        this.vendorList = response.responseData;
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

  getState(event, CountryId) {
    var postData = {
      CountryId: CountryId,
    };
    this.commonService
      .getHttpServiceStateId(postData, "getStateListDropdown")
      .subscribe(
        (response) => {
          if (response.status == true) {
            this.StateList = response.responseData;
          } else {
          }
          this.cd_ref.detectChanges();
        },
        (error) => console.log(error)
      );
  }
  loadTemplate(type) {
    this.clsactive = type;

    switch (type) {
      case "general":
        this.templateSettings = this.generalSettings;
        break;
      case "quote":
        this.templateSettings = this.Quote;
        break;
      case "so":
        this.templateSettings = this.SO;
        break;
      case "po":
        this.templateSettings = this.PO;
        break;
      case "invoice":
        this.templateSettings = this.Invoice;
        break;
      case "vendorBill":
        this.templateSettings = this.VendorBill;
        break;
      case "address":
        this.templateSettings = this.address;
        break;
      default:
        this.templateSettings = this.generalSettings;
        this.clsactive = "general";
        break;
    }
  }

  getViewContent() {
    var postData = {};
    this.commonService
      .postHttpService(postData, "getSettingsGeneralView")
      .subscribe(
        (response) => {
          if (response.status == true) {
            this.result = response.responseData;
            if (response.responseData.IsUPSEnable == "1") {
              this.result.IsUPSEnable = true;
            } else {
              this.result.IsUPSEnable = false;
            }
            console.log(this.result);
            this.url = this.result.AppLogo;
          } else {
          }
          this.cd_ref.detectChanges();
        },
        (error) => console.log(error)
      );
  }

  getAHaddress() {
    this.commonService.getHttpService("getAHGroupVendorAddress").subscribe(
      (response) => {
        if (response.status == true) {
          this.AddressList = response.responseData.AHGroupVendorAddress;
        } else {
        }
        this.cd_ref.detectChanges();
      },
      (error) => console.log(error)
    );
  }
  //Multiple Address
  addAddress() {
    var IdentityType = "2";
    var IdentityId = this.AddressList[0].IdentityId;
    this.modalRef = this.modalService.show(AddressComponent, {
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
      this.AddressList.push(res.data);
    });
  }

  editAddress(Addressdata, i) {
    var IdentityType = 2;
    var IdentityId = this.AddressList[0].IdentityId;
    this.modalRef = this.modalService.show(EditAddressComponent, {
      backdrop: "static",
      ignoreBackdropClick: false,
      initialState: {
        data: { Addressdata, i, IdentityType, IdentityId },
        class: "modal-lg",
      },
      class: "gray modal-lg",
    });

    this.modalRef.content.closeBtnName = "Close";

    this.modalRef.content.event.subscribe((res) => {
      this.AddressList[i] = res.data;
    });
  }

  deleteAddress(AddressId, i) {
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
          AddressId: AddressId,
        };
        this.commonService
          .postHttpService(postData, "getAddressDelete")
          .subscribe((response) => {
            if (response.status == true) {
              this.AddressList.splice(i, 1);

              Swal.fire({
                title: "Deleted!",
                text: "Address has been deleted.",
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
          text: "Address is safe:)",
          type: "error",
        });
      }
    });
  }

  setDefaultAddress(e, AddressId, type) {
    Swal.fire({
      title: "Are you sure?",
      text: "To make this address as a default",
      type: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes!",
      cancelButtonText: "No!",
      confirmButtonClass: "btn btn-success mt-2",
      cancelButtonClass: "btn btn-danger ml-2 mt-2",
      buttonsStyling: false,
    }).then((result) => {
      if (result.value) {
        var postData = {
          IdentityType: "2",
          IdentityId: this.AddressList[0].IdentityId,
          AddressId: AddressId,
          AddressType: type,
        };
        this.commonService
          .putHttpService(postData, "getSetprimaryaddress")
          .subscribe((response) => {
            if (response.status == true) {
              Swal.fire({
                title: "Saved!",
                text: "Address has been updated!",
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
          text: "Address is not updated!",
          type: "error",
        });
      }
    });
  }
  // image process
  fileProgres(fileInput: any) {
    this.fileData = <File>fileInput.target.files[0];
    const formData = new FormData();
    formData.append("file", this.fileData);
    this.preview();
    this.commonService
      .postHttpImageService(formData, "getUserimageupload")
      .subscribe(
        (response) => {
          this.result.AppLogo = response.responseData.location;

          this.cd_ref.detectChanges();
        },
        (error) => console.log(error)
      );
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
      this.previewUrl = reader.result;
      this.result.AppLogo = reader.result;
    };
  }
  onUpsEnable(e) {
    if (e.target.checked == true) {
      this.result.IsUPSEnable = "1";
    } else {
      this.result.IsUPSEnable = "0";
    }
  }
  onSubmit() {
    var postData = this.result;
    this.commonService.putHttpService(postData, "UpdateSettings").subscribe(
      (response) => {
        if (response.status == true) {
          Swal.fire({
            title: "Success!",
            text: "Settings Updated Successfully!",
            type: "success",
            confirmButtonClass: "btn btn-confirm mt-2",
          });
        } else {
          Swal.fire({
            title: "Error!",
            text: "Settings could not be Updated!",
            type: "warning",
            confirmButtonClass: "btn btn-confirm mt-2",
          });
        }
        this.cd_ref.detectChanges();
      },
      (error) => console.log(error)
    );
  }

  onCancel() {
    this.router.navigate(["/admin/dashboard/ah-dashboard"]);
  }
}
