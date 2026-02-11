import { ChangeDetectorRef, Component, EventEmitter, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap';
import { CommonService } from 'src/app/core/services/common.service';
import { CustomvalidationService } from 'src/app/core/services/customvalidation.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-barcode-print',
  templateUrl: './barcode-print.component.html',
  styleUrls: ['./barcode-print.component.scss']
})

export class BarcodePrintComponent implements OnInit {

  public event: EventEmitter<any> = new EventEmitter();

  constructor(public modalRef: BsModalRef,
    private fb: FormBuilder,
    private cd_ref: ChangeDetectorRef,
    private commonService: CommonService,
    private customValidator: CustomvalidationService,
    @Inject(BsModalRef) public data: any,) { }

  ngOnInit(): void {

    

  }




  onSubmit() {
    const printContent = $(".print-content");
    const WindowPrt = window.open('', '', 'left=0,top=0,width=900,height=900,toolbar=0,scrollbars=0,status=0');
    WindowPrt.document.write(printContent.html());
    WindowPrt.document.close();
    WindowPrt.focus();
    WindowPrt.print();
    WindowPrt.close();
  }

}