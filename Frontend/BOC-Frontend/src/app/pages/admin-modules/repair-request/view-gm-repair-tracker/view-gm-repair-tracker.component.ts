import { Component, OnInit, ChangeDetectorRef, Inject, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonService } from 'src/app/core/services/common.service';
import { CustomvalidationService } from 'src/app/core/services/customvalidation.service';
import Swal from 'sweetalert2';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { booleanValues, Const_Alert_pop_title, months } from 'src/assets/data/dropdown';

@Component({
  selector: 'app-view-gm-repair-tracker',
  templateUrl: './view-gm-repair-tracker.component.html',
  styleUrls: ['./view-gm-repair-tracker.component.scss']
})
export class ViewGmRepairTrackerComponent implements OnInit {

  constructor(public modalRef: BsModalRef,
    private fb: FormBuilder,
    private cd_ref: ChangeDetectorRef,
    private commonService: CommonService,
    private customValidator: CustomvalidationService,
    @Inject(BsModalRef) public data: any) { }
  public event: EventEmitter<any> = new EventEmitter();

  RRGMTrackerId
  GMTrackerDetails: any = {}
  ngOnInit(): void {
    this.RRGMTrackerId = this.data.RRGMTrackerId
    if (this.RRGMTrackerId != '' && this.RRGMTrackerId != null && this.RRGMTrackerId != undefined) {
      this.findGMTrackerDetails()
    }
  }

  findGMTrackerDetails() {
    let postData = { RRGMTrackerId: this.RRGMTrackerId }

    this.commonService.postHttpService(postData, "viewGMRepairTrackerInfo").subscribe(response => {
      if (response.status == true) {
        this.GMTrackerDetails = response.responseData
      }

      this.cd_ref.detectChanges();
    }, error => console.log(error));
  }

  toMonthName(monthNumber) {
    if (monthNumber) {
      const date = new Date();
      date.setMonth(monthNumber - 1);

      // 👇️ using visitor's default locale
      return date.toLocaleString([], {
        month: 'long',
      });
    } else {
      return '-'
    }
  }

  triggerEvent(item: string) {
    this.event.emit({ data: item, res: 200 });
  }
}
