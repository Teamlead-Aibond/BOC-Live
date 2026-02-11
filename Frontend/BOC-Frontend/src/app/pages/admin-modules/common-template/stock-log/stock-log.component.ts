import { Component, OnInit, ChangeDetectorRef, Inject } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { FormBuilder } from '@angular/forms';
import { CommonService } from 'src/app/core/services/common.service';
import { RrLogComponent } from '../rr-log/rr-log.component';

@Component({
  selector: 'app-stock-log',
  templateUrl: './stock-log.component.html',
  styleUrls: ['./stock-log.component.scss']
})
export class StockLogComponent implements OnInit {
  Logs: any;
  constructor(public modalRef: BsModalRef,
    private fb: FormBuilder,private CommonmodalService: BsModalService,
    private cd_ref: ChangeDetectorRef,
    private commonService: CommonService,
    @Inject(BsModalRef) public data: any, ) { }

  ngOnInit(): void {
    this.Logs = this.data.logs;
  }
}
