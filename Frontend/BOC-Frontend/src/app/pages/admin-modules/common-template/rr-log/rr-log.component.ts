import { Component, OnInit, Inject, ChangeDetectorRef } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { FormBuilder } from '@angular/forms';
import { CommonService } from 'src/app/core/services/common.service';

@Component({
  selector: 'app-rr-log',
  templateUrl: './rr-log.component.html',
  styleUrls: ['./rr-log.component.scss']
})
export class RrLogComponent implements OnInit {
  RRId;
  RRLogList:any=[];
  
  constructor(public modalRef: BsModalRef,
    private fb: FormBuilder,
    private cd_ref: ChangeDetectorRef,
    private commonService: CommonService,
    @Inject(BsModalRef) public data: any, ) { }
  ngOnInit() {
    this.RRId = this.data.RRId;
    //Get RR log content
    var postData = {
      "RRId": this.RRId,
    }
    this.commonService.postHttpService(postData, 'RRLog').subscribe(response => {
      this.RRLogList = response.responseData
      });

  }

}
