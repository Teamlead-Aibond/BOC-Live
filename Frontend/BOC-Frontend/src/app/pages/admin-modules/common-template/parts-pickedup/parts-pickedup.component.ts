import { DatePipe } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, EventEmitter, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { CommonService } from 'src/app/core/services/common.service';
import { Const_Alert_pop_message, Const_Alert_pop_title } from 'src/assets/data/dropdown';
import Swal from 'sweetalert2';
import SignaturePad from 'signature_pad';

@Component({
  selector: 'app-parts-pickedup',
  templateUrl: './parts-pickedup.component.html',
  styleUrls: ['./parts-pickedup.component.scss']
})
export class PartsPickedupComponent implements OnInit, AfterViewInit {
  AddForm: FormGroup;
  submitted = false;
  PickupItem
  public event: EventEmitter<any> = new EventEmitter();
  Currentdate = new Date();


  signaturePad: SignaturePad;
  @ViewChild('canvas', { static: true }) canvasEl: ElementRef;
  signatureImg: string;
  constructor(public modalRef: BsModalRef,
    private fb: FormBuilder,
    private cd_ref: ChangeDetectorRef,
    private commonService: CommonService, private datePipe: DatePipe,
    @Inject(BsModalRef) public data: any,) { }

  ngOnInit(): void {
    this.PickupItem = this.data.PickupItem;

    this.AddForm = this.fb.group({
      PickupName: ['', Validators.required],
      PickupDate: ['', Validators.required],
      Signature: ['']
    })
    const years = Number(this.datePipe.transform(this.Currentdate, 'yyyy'));
    const Month = Number(this.datePipe.transform(this.Currentdate, 'MM'));
    const Day = Number(this.datePipe.transform(this.Currentdate, 'dd'));
    this.AddForm.patchValue({
      "PickupName": '',
      "PickupDate": {
        year: years,
        month: Month,
        day: Day
      }
    })

  }


  onSubmit() {
    this.savePad();
    this.submitted = true;
    if (this.AddForm.valid) {
      //DateRequested
      const reqYears = this.AddForm.value.PickupDate.year
      const reqDates = this.AddForm.value.PickupDate.day;
      const reqmonths = this.AddForm.value.PickupDate.month;
      let requestDates = new Date(reqYears, reqmonths - 1, reqDates);
      let CreatedDate = moment(requestDates).format('YYYY-MM-DD');

      var postData = {
        "PickUpItem": this.PickupItem,
        "PickedUpBy": this.AddForm.value.PickupName,
        "PickUPSignature": this.AddForm.value.Signature,
        "PickedUpDate": CreatedDate
      }
      this.commonService.postHttpService(postData, 'UpdateReadyForPickUpToPickUp').subscribe(response => {
        if (response.status == true) {
          Swal.fire({
            title: 'Parts Picked Up',
            text: 'Parts Picked Up Sucessfully',
            type: 'success'
          });
          this.triggerEvent(response.responseData);
          this.modalRef.hide();
        }
      });
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


  //get AddressForm validation control
  get AddFormControl() {
    return this.AddForm.controls;
  }

  triggerEvent(item: string) {
    this.event.emit({ data: item, res: 200 });
  }



  ngAfterViewInit() {
    this.signaturePad = new SignaturePad(this.canvasEl.nativeElement);
  }

  startDrawing(event: Event) {
    console.log(event);
    // works in device not in browser

  }

  moved(event: Event) {
    // works in device not in browser
  }

  clearPad() {
    this.signaturePad.clear();
  }

  savePad() {
    const base64Data = this.signaturePad.toDataURL();
    this.signatureImg = base64Data;
    console.log("Savepad = " + this.signatureImg);
    this.AddForm.patchValue({
      Signature: base64Data
    })
  }

}
