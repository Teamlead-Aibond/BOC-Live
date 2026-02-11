import { Component, OnInit, EventEmitter, ChangeDetectorRef, Inject } from '@angular/core';
import { CommonService } from 'src/app/core/services/common.service';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { FormBuilder } from '@angular/forms';
import { trim } from 'jquery';

@Component({
  selector: 'app-warranty-view',
  templateUrl: './warranty-view.component.html',
  styleUrls: ['./warranty-view.component.scss']
})
export class WarrantyViewComponent implements OnInit {
  WarrantyId;
  viewResult;
  public event: EventEmitter<any> = new EventEmitter();
  constructor(public modalRef: BsModalRef,
    private fb: FormBuilder,
    private cd_ref: ChangeDetectorRef,
    private commonService: CommonService,
    @Inject(BsModalRef) public data: any, ) { }


  ngOnInit() {
    this.viewResult=""
    this.WarrantyId = this.data.WarrantyId;
    this.viewContent();
  }


 viewContent() {
    var postData = {
      "WarrantyId":this.WarrantyId
    }
    this.commonService.postHttpService(postData, "viewWarranty").subscribe(response => {
      if (response.status == true) {
        this.viewResult = response.responseData;
      }else { }
      this.cd_ref.detectChanges();
    }, error => console.log(error));
  }

}
