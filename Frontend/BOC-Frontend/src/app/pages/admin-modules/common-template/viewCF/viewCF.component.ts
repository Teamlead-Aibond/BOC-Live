import { ChangeDetectorRef, Component, EventEmitter, Inject, OnInit } from '@angular/core';
import { FormBuilder, NgForm } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { CommonService } from 'src/app/core/services/common.service';
import { Const_Alert_pop_message, Const_Alert_pop_title } from 'src/assets/data/dropdown';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-viewCF',
  templateUrl: './viewCF.component.html',
  styleUrls: ['./viewCF.component.scss']
})
export class viewCFComponent implements OnInit {


  submitted = false;
  model: any = [];
  CustomerReference;
  RRNo
  title: any;
  public event: EventEmitter<any> = new EventEmitter();
  constructor(public modalRef: BsModalRef,
    private fb: FormBuilder,
    private cd_ref: ChangeDetectorRef,
    private commonService: CommonService,
    @Inject(BsModalRef) public data: any,) { }

  ngOnInit(): void {
    this.CustomerReference = this.data.CustomerReference;
    this.RRNo = this.data.RRNo;
    this.title = "View RR Customer Reference ( " + this.RRNo + " )";
  }

  triggerEvent(item: string) {
    this.event.emit({ data: item, res: 200 });
  }



}
