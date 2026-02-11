import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import html2canvas from 'html2canvas';
import jspdf from 'jspdf';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { CommonService } from 'src/app/core/services/common.service';
import { CustomerRefMultiQrCodeComponent } from '../customer-ref-multi-qr-code/customer-ref-multi-qr-code.component';
import { QrCodeLoopComponent } from '../qr-code-loop/qr-code-loop.component';

@Component({
  selector: 'app-multi-qrcode-print',
  templateUrl: './multi-qrcode-print.component.html',
  styleUrls: ['./multi-qrcode-print.component.scss']
})
export class MultiQrcodePrintComponent implements OnInit {

  RRDetails;
  RRId;
  RepairRequestNo;
  SerialNo;
  PartNo;
  containerClass: string;
  CustomerRefList: any = [];
  CompanyName;
  hidden: boolean = false;
  show: boolean = true;
  IsDisplayPOInQR
  CustomerPONo
  RushWarrantyMessage: any = [];
  constructor(
    public modalRef: BsModalRef,
    private fb: FormBuilder,
    private cd_ref: ChangeDetectorRef,
    private commonService: CommonService, private CommonmodalService: BsModalService,
    @Inject(BsModalRef) public data: any,
  ) { }

  ngOnInit(): void {
    this.RRDetails = this.data.RRDetails;
    console.log(this.data.RRDetails);
    this.RRDetails.forEach((ele) => {
      console.log(ele);
      var repairMessage = ''
      if (ele.RRInfo[0].IsRushRepair == 1) {
        var repairMessage = "Rush Repair"
      }
      if (ele.RRInfo[0].IsWarrantyRecovery == 1) {
        var repairMessage = "Warranty Repair"
      }
      if (ele.RRInfo[0].IsWarrantyRecovery == 2) {
        var repairMessage = "Warranty New"
      }
      if ((ele.RRInfo[0].IsRushRepair == 1) && (ele.RRInfo[0].IsWarrantyRecovery == 1)) {
        var repairMessage = "Rush Repair,Warranty Repair"
      }
      if(repairMessage != ''){
        this.RushWarrantyMessage.push(repairMessage);
      }
    })
    console.log(this.RushWarrantyMessage)

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
      let pdf = new jspdf('l', 'pt', [160, 480]);
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

  onSubmit1() {
    this.hidden = false;
    this.show = true
    this.containerClass = "print-container";
    const printContent = document.getElementById("print-content")
    var imgWidth = 80;
    let pdf = new jspdf('l', 'pt', [260, 800], true);
    pdf.setFont("Courier-Bold");
    //pdf.setFontSize(10);
    //$("#id1").css("font-size", "100px");
    pdf.html(printContent, {
      callback: (doc) => {

        doc.autoPrint();
        doc.output("dataurlnewwindow");
      }
    });

    // pdf.output("dataurlnewwindow");

    // html2canvas(printContent).then(canvas => {
    //   //var imgWidth = 80;
    //   //var imgHeight = canvas.height * imgWidth / canvas.width;
    //   //const contentDataURL = canvas.toDataURL('image/png')
    //   //let pdf = new jspdf('l', 'mm', [26, 80]);
    //   const contentDataURL = canvas.toDataURL('image/png', 0.98)
    //   let pdf = new jspdf('l', 'pt', [160, 480]);
    //   var width = pdf.internal.pageSize.getWidth();
    //   var height = pdf.internal.pageSize.getHeight();
    //   var position = 0;
    //   //pdf.addImage(contentDataURL, 'PNG', 0, position, width, imgHeight); //imgHeight
    //   pdf.addImage(contentDataURL, 'PNG', 0, position, width, height);
    //   pdf.autoPrint();  // <<--------------------- !!
    //   pdf.output('dataurlnewwindow');
    //   this.containerClass = "";
    // });
    // const WindowPrt = window.open('', '', 'left=0,top=0,width=600,height=200,toolbar=0,scrollbars=0,status=0');
    // WindowPrt.document.write(printContent.html());
    // WindowPrt.document.close();
    // WindowPrt.focus();
    // WindowPrt.print();
    // WindowPrt.close();


  }

  onSubmitRef() {
    this.hidden = true;
    this.show = false;
    this.containerClass = "print-container";
    const printContent = document.getElementById("print-content");
    var imgWidth = 80;
    let pdf = new jspdf('l', 'pt', [260, 800], true);
    pdf.setFont("Courier-Bold")
    pdf.html(printContent, {
      callback: (doc) => {

        doc.autoPrint();
        doc.output("dataurlnewwindow");
      }
    });

  }
  //QR Code Customer Ref
  viewQrCodeofCustomerRef() {
    this.modalRef.hide();
    //var RRId= this.viewResult.RRId
    var RRDetails = this.RRDetails;
    this.modalRef = this.CommonmodalService.show(CustomerRefMultiQrCodeComponent,
      {
        backdrop: 'static',
        ignoreBackdropClick: false,
        initialState: {
          data: { RRDetails },
          class: 'modal-lg'
        }, class: 'gray modal-lg'
      });

    this.modalRef.content.closeBtnName = 'Close';

    // this.modalRef.content.event.subscribe(res => {
    // });
  }


  //QR Code
  viewQrCode() {
    this.modalRef.hide();
    //var RRId= this.viewResult.RRId
    var RRDetails = this.RRDetails;
    this.modalRef = this.CommonmodalService.show(QrCodeLoopComponent,
      {
        backdrop: 'static',
        ignoreBackdropClick: false,
        initialState: {
          data: { RRDetails },
          class: 'modal-lg qrpdf'
        }, class: 'gray modal-lg'
      });

    this.modalRef.content.closeBtnName = 'Close';

    // this.modalRef.content.event.subscribe(res => {
    // });
  }
  //Print 4x2
  onPrint() {
    this.hidden = false;
    this.show = true
    this.containerClass = "print-container";
    const printContent = document.getElementById("print-content")
    var imgWidth = 80;
    let pdf = new jspdf('l', 'pt', [285, 800], true);
    pdf.setFont("Courier-Bold");
    //pdf.setFontSize(10);
    //$("#id1").css("font-size", "100px");
    pdf.html(printContent, {
      callback: (doc) => {

        doc.autoPrint();
        doc.output("dataurlnewwindow");
      }
    });

  }


}
