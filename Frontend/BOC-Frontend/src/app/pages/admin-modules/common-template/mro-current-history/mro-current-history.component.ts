import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { CommonService } from 'src/app/core/services/common.service';

@Component({
  selector: 'app-mro-current-history',
  templateUrl: './mro-current-history.component.html',
  styleUrls: ['./mro-current-history.component.scss']
})
export class MroCurrentHistoryComponent implements OnInit {

    currentHistory
    constructor(public modalRef: BsModalRef,
      private fb: FormBuilder,private CommonmodalService: BsModalService,
      private cd_ref: ChangeDetectorRef,
      private commonService: CommonService,
      @Inject(BsModalRef) public data: any, ) { }
  
    ngOnInit(): void {
      this.currentHistory = this.data.currentHistory;
    }
  
  
   
  

}
