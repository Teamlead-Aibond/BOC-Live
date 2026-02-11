import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import html2canvas from 'html2canvas';
import jspdf from 'jspdf';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { CommonService } from 'src/app/core/services/common.service';

@Component({
  selector: 'app-mro-qr-code',
  templateUrl: './mro-qr-code.component.html',
  styleUrls: ['./mro-qr-code.component.scss']
})
export class MroQrCodeComponent implements OnInit {

  MROId;
  MRONo;
   
    containerClass: string;
    constructor(
      public modalRef: BsModalRef,
      private fb: FormBuilder,
      private cd_ref: ChangeDetectorRef,
      private commonService: CommonService,
      @Inject(BsModalRef) public data: any,
    ) { }
  
    ngOnInit(): void {
      this.MROId = this.data.MROId;
      this.MRONo = this.data.MRONo
     
  
    }
    onSubmit() {
      this.containerClass = "print-container";
      const printContent = document.getElementById("print-content");
  
      html2canvas(printContent).then(canvas => {
        //var imgWidth = 80;
        //var imgHeight = canvas.height * imgWidth / canvas.width;
        //const contentDataURL = canvas.toDataURL('image/png')
        //let pdf = new jspdf('l', 'mm', [26, 80]);
        const contentDataURL = canvas.toDataURL('image/png', 0.98)
        let pdf = new jspdf('l', 'pt', [80, 240]);
        var width = pdf.internal.pageSize.getWidth();
        var height = pdf.internal.pageSize.getHeight();
        var position = 0;
        //pdf.addImage(contentDataURL, 'PNG', 0, position, width, imgHeight); //imgHeight
        pdf.addImage(contentDataURL, 'PNG', 0, position, width, height);
        pdf.autoPrint();  // <<--------------------- !!
        pdf.output('dataurlnewwindow');
        this.containerClass = "";
      });
      // const WindowPrt = window.open('', '', 'left=0,top=0,width=600,height=200,toolbar=0,scrollbars=0,status=0');
      // WindowPrt.document.write(printContent.html());
      // WindowPrt.document.close();
      // WindowPrt.focus();
      // WindowPrt.print();
      // WindowPrt.close();
  
  
    }
  
  
  
}
