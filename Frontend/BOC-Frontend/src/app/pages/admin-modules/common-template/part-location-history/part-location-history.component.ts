import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { CommonService } from 'src/app/core/services/common.service';

@Component({
  selector: 'app-part-location-history',
  templateUrl: './part-location-history.component.html',
  styleUrls: ['./part-location-history.component.scss']
})
export class PartLocationHistoryComponent implements OnInit {
  History:any=[]
  constructor(public modalRef: BsModalRef,
    private fb: FormBuilder,private CommonmodalService: BsModalService,
    private cd_ref: ChangeDetectorRef,
    private commonService: CommonService,
    @Inject(BsModalRef) public data: any, ) { }

  ngOnInit(): void {
    this.History = this.data.History;
  }

}
