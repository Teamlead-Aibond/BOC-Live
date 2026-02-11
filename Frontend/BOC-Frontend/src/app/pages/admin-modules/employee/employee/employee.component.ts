import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Inject,
  OnInit,
} from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { BsModalRef } from "ngx-bootstrap/modal";
import { CommonService } from "src/app/core/services/common.service";
import {
  Const_Alert_pop_title,
  Const_Alert_pop_message,
  EmployeeJobRole,
  EmployeeResponsibilites,
} from "src/assets/data/dropdown";
import Swal from "sweetalert2";

@Component({
  selector: "app-employee",
  templateUrl: "./employee.component.html",
  styleUrls: ["./employee.component.scss"],
})
export class EmployeeComponent implements OnInit {
  breadCrumbItems: Array<{}>;
  Form: FormGroup;
  submitted: boolean = false;
  EmployeeId;
  EmployeeResponsibilitesList: any = [];
  EmployeeJobRoleList: any = [];

  public event: EventEmitter<any> = new EventEmitter();
  constructor(
    private fb: FormBuilder,
    public router: Router,
    private cd_ref: ChangeDetectorRef,
    public modalRef: BsModalRef,
    private commonService: CommonService,
    @Inject(BsModalRef) public data: any
  ) {}

  ngOnInit(): void {
    this.getEmployeeResponsibilites();
    //this.EmployeeResponsibilitesList = EmployeeResponsibilites
    this.EmployeeJobRoleList = EmployeeJobRole;
    this.EmployeeId = this.data.EmployeeId;
    this.breadCrumbItems = [
      { label: "Aibond", path: "/" },
      { label: "Empolyee", path: "/admin/Employee-List" },
      { label: "Add", path: "/", active: true },
    ];
    this.Form = this.fb.group({
      EmployeeId: this.EmployeeId,
      EmployeeNo: ["", Validators.required],
      EmployeeEmail: ["", [Validators.email]],
      EmployeeName: ["", Validators.required],
      EmployeeGender: ["", Validators.required],
      EmployeeAddress: [""],
      EmployeePhoneNo: [""],
      EmployeeResponsibilites: ["", Validators.required],
      EmployeeJobRole: ["", Validators.required],
      EmployeeRFIDTagNo: ["", Validators.required],
    });

    if (this.EmployeeId) {
      var postData = {
        EmployeeId: this.EmployeeId,
      };
      this.commonService
        .postHttpService(postData, "ViewEmployee")
        .subscribe((res: any) => {
          if (res.status == true) {
            var result = res.responseData;

            this.Form.patchValue({
              EmployeeId: result.EmployeeId,
              EmployeeNo: result.EmployeeNo,
              EmployeeEmail: result.EmployeeEmail,
              EmployeeName: result.EmployeeName,
              EmployeeGender: result.EmployeeGender,
              EmployeeAddress: result.EmployeeAddress,
              EmployeePhoneNo: result.EmployeePhoneNo,
              EmployeeResponsibilites: result.EmployeeResponsibilites
                ? result.EmployeeResponsibilites.split(",").map((a) =>
                    Number(a)
                  )
                : [],
              EmployeeJobRole: result.EmployeeJobRole,
              EmployeeRFIDTagNo: result.EmployeeRFIDTagNo,
            });
          }
        });
    }
  }

  getEmployeeResponsibilites() {
    this.commonService.getHttpService("ResponsibilityDDL").subscribe(
      (response) => {
        if (response.status == true) {
          this.EmployeeResponsibilitesList = response.responseData;
        } else {
        }
        this.cd_ref.detectChanges();
      },
      (error) => console.log(error)
    );
  }
  onSubmit() {
    this.submitted = true;
    if (this.Form.valid) {
      let body = { ...this.Form.value };
      body.EmployeeResponsibilites = body.EmployeeResponsibilites.toString();
      if (body.EmployeeId == "") {
        this.commonService.postHttpService(body, "CreateEmployee").subscribe(
          (res: any) => {
            if (res.status == true) {
              this.triggerEvent(res.responseData);
              this.modalRef.hide();
              Swal.fire({
                title: "Success!",
                text: "Record saved Successfully!",
                type: "success",
                confirmButtonClass: "btn btn-confirm mt-2",
              });
            } else {
              Swal.fire({
                title: "Error!",
                text: res.message,
                type: "warning",
                confirmButtonClass: "btn btn-confirm mt-2",
              });
            }
            this.cd_ref.detectChanges();
          },
          (error) => console.log(error)
        );
      } else if (body.EmployeeId != "") {
        this.commonService.postHttpService(body, "UpdateEmployee").subscribe(
          (res: any) => {
            if (res.status == true) {
              this.triggerEvent(res.responseData);
              this.modalRef.hide();
              Swal.fire({
                title: "Success!",
                text: "Record updated Successfully!",
                type: "success",
                confirmButtonClass: "btn btn-confirm mt-2",
              });
            } else {
              Swal.fire({
                title: "Error!",
                text: res.message,
                type: "warning",
                confirmButtonClass: "btn btn-confirm mt-2",
              });
            }
            this.cd_ref.detectChanges();
          },
          (error) => console.log(error)
        );
      }
    } else {
      Swal.fire({
        type: "error",
        title: Const_Alert_pop_title,
        text: Const_Alert_pop_message,
        confirmButtonClass: "btn btn-confirm mt-2",
      });
    }
  }
  triggerEvent(item: string) {
    this.event.emit({ data: item, res: 200 });
  }

  get FormControl() {
    return this.Form.controls;
  }
}
