import { Component, OnInit, EventEmitter, ChangeDetectorRef, Inject } from '@angular/core';
import html2canvas from 'html2canvas';
import jspdf from 'jspdf';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { CommonService } from 'src/app/core/services/common.service';

@Component({
  selector: 'app-inventory-packing-slip',
  templateUrl: './inventory-packing-slip.component.html',
  styleUrls: ['./inventory-packing-slip.component.scss']
})
export class InventoryPackingSlipComponent implements OnInit {

  public event: EventEmitter<any> = new EventEmitter();
  constructor(public modalRef: BsModalRef, private cd_ref: ChangeDetectorRef,
    private CommonmodalService: BsModalService,
    private commonService: CommonService,
    @Inject(BsModalRef) public data: any, ) { }

  ngOnInit(): void {
  }


  hideAddress: boolean = true
  generatePDF() {
    var data = document.getElementById('contentToConvert');
    this.hideAddress = false;
    setTimeout(() => {
      html2canvas(data).then(canvas => {
        var imgWidth = 208;
        var imgHeight = canvas.height * imgWidth / canvas.width;
        const contentDataURL = canvas.toDataURL('image/png')
        let pdf = new jspdf('p', 'mm', 'a4');

        var position = 3;
        pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight, undefined, 'FAST')
        pdf.save('packing_slip.pdf');
        this.hideAddress = true
      });
    }, 500);
  }

}
