import { Component, OnInit, ChangeDetectorRef, Inject, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonService } from 'src/app/core/services/common.service';
import { CustomvalidationService } from 'src/app/core/services/customvalidation.service';
import Swal from 'sweetalert2';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { boolean, booleanValues, Const_Alert_pop_title, months } from 'src/assets/data/dropdown';

@Component({
  selector: 'app-gm-repair-tracker',
  templateUrl: './gm-repair-tracker.component.html',
  styleUrls: ['./gm-repair-tracker.component.scss']
})
export class GmRepairTrackerComponent implements OnInit {
  submitted: boolean;

  constructor(public modalRef: BsModalRef,
    private fb: FormBuilder,
    private cd_ref: ChangeDetectorRef,
    private commonService: CommonService,
    private customValidator: CustomvalidationService,
    @Inject(BsModalRef) public data: any) { }
  public event: EventEmitter<any> = new EventEmitter();

  Form: FormGroup;

  RRGMTrackerId
  RRId

  booleanValues = boolean
  months = months
  boolean = booleanValues
  currentYear = new Date().getFullYear();
  title = 'Add GM Repair Tracker Info'

  ngOnInit(): void {
    this.RRGMTrackerId = this.data.RRGMTrackerId
    this.RRId = this.data.RRId
    this.formGroup();
    if (this.RRGMTrackerId != '' && this.RRGMTrackerId != null && this.RRGMTrackerId != undefined) {
      this.findGMTrackerDetails();
      this.title = 'Edit GM Repair Tracker Info'
    }
  }

  formGroup() {
    this.Form = this.fb.group({
      RRId: this.RRId,
      RRGMTrackerId: [''],
      IsBroken: [''],
      ApprovedFor: [''],
      ReasonForFailure: [''],
      FailedOnInstall: [''],
      FailedOnInstallNotes: [''],
      Requestor: [''],
      GCCLItem: [''],
      RepairWarrantyExpiration: [''],
      OpenOrderStatus: [''],
      AccountValuationClass: [''],
      ReceiptMonth: [''],
      ReceiptYear: [''],
      CoreReturnMonth: [''],
      CoreReturnYear: [''],
      IsScrap: ['']
    })
  }
  //get StateAddForm validation control
  get FormControl() {
    return this.Form.controls;
  }

  findGMTrackerDetails() {
    let postData = { RRGMTrackerId: this.RRGMTrackerId }

    this.commonService.postHttpService(postData, "viewGMRepairTrackerInfo").subscribe(response => {
      if (response.status == true) {
        let result = response.responseData
        this.Form.patchValue({
          RRId: this.RRId,
          RRGMTrackerId: result.RRGMTrackerId,
          IsBroken: result.IsBroken,
          ApprovedFor: result.ApprovedFor,
          ReasonForFailure: result.ReasonForFailure,
          FailedOnInstall: result.FailedOnInstall,
          FailedOnInstallNotes: result.FailedOnInstallNotes,
          Requestor: result.Requestor,
          GCCLItem: result.GCCLItem,
          RepairWarrantyExpiration: result.RepairWarrantyExpiration,
          OpenOrderStatus: result.OpenOrderStatus,
          AccountValuationClass: result.AccountValuationClass,
          ReceiptMonth: result.ReceiptMonth,
          ReceiptYear: result.ReceiptYear,
          CoreReturnMonth: result.CoreReturnMonth,
          CoreReturnYear: result.CoreReturnYear,
          IsScrap: result.IsScrap
        })
      }

      this.cd_ref.detectChanges();
    }, error => console.log(error));
  }

  onSubmit() {
    this.submitted = true;
    if (this.Form.valid) {

      let body = { ... this.Form.value }
      if (body.RRGMTrackerId != '' && body.RRGMTrackerId != null &&
        body.RRGMTrackerId != undefined) {
        this.commonService.putHttpService(body, "updateGMRepairTrackerInfo").subscribe(response => {
          if (response.status == true) {
            this.triggerEvent(response.responseData);
            this.modalRef.hide();
            Swal.fire({
              title: 'Success!',
              text: 'Record saved Successfully!',
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
      } else {
        this.commonService.postHttpService(body, "createGMRepairTrackerInfo").subscribe(response => {
          if (response.status == true) {
            this.triggerEvent(response.responseData);
            this.modalRef.hide();
            Swal.fire({
              title: 'Success!',
              text: 'Record saved Successfully!',
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
  }

  triggerEvent(item: string) {
    this.event.emit({ data: item, res: 200 });
  }
}
