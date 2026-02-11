import { Component, OnInit, ChangeDetectorRef, Inject } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { FormBuilder } from '@angular/forms';
import { CommonService } from 'src/app/core/services/common.service';
import { RrLogComponent } from '../rr-log/rr-log.component';

@Component({
  selector: 'app-rr-current-history',
  templateUrl: './rr-current-history.component.html',
  styleUrls: ['./rr-current-history.component.scss']
})
export class RrCurrentHistoryComponent implements OnInit {
  currentHistory
  constructor(public modalRef: BsModalRef,
    private fb: FormBuilder,private CommonmodalService: BsModalService,
    private cd_ref: ChangeDetectorRef,
    private commonService: CommonService,
    @Inject(BsModalRef) public data: any, ) { }

  ngOnInit(): void {
    this.currentHistory = this.data.currentHistory;
  }


  RRlog(){
    this.modalRef.hide();
    var RRId = this.currentHistory[0].RRId
    this.modalRef = this.CommonmodalService.show(RrLogComponent,
      {
        backdrop: 'static',
        ignoreBackdropClick:false,
        initialState: {
          data: { RRId },
        },
      });
    this.modalRef.content.closeBtnName = 'Close';

  }
}
