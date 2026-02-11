import { Component, Inject, OnInit } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-revert-history',
  templateUrl: './revert-history.component.html',
  styleUrls: ['./revert-history.component.scss']
})
export class RevertHistoryComponent implements OnInit {

  RRRevertHistory
  constructor(public modalRef: BsModalRef,
    private CommonmodalService: BsModalService,
    @Inject(BsModalRef) public data: any,) { }

  ngOnInit(): void {
    this.RRRevertHistory = this.data.RRRevertHistory;
    console.log(this.RRRevertHistory)
  }
}
