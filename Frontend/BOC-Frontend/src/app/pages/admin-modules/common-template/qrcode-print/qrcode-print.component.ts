import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import html2canvas from 'html2canvas';
import jspdf from 'jspdf';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { CommonService } from 'src/app/core/services/common.service';
import { CustomerRefQrCodeComponent } from '../customer-ref-qr-code/customer-ref-qr-code.component';
import { QrCodeComponent } from '../qr-code/qr-code.component';

@Component({
  selector: 'app-qrcode-print',
  templateUrl: './qrcode-print.component.html',
  styleUrls: ['./qrcode-print.component.scss']
})
export class QrcodePrintComponent implements OnInit {

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
  RushWarrantyMessage
  constructor(
    public modalRef: BsModalRef,
    private fb: FormBuilder,
    private cd_ref: ChangeDetectorRef,
    private commonService: CommonService, private CommonmodalService: BsModalService,
    @Inject(BsModalRef) public data: any,
  ) { }

  ngOnInit(): void {
    this.RRId = this.data.RRId;
    this.RepairRequestNo = this.data.RepairRequestNo
    this.SerialNo = this.data.SerialNo
    this.PartNo = this.data.PartNo
    this.CompanyName = this.data.CompanyName;
    this.CustomerRefList = this.data.CustomerRefList
    this.IsDisplayPOInQR = this.data.IsDisplayPOInQR
    this.CustomerPONo = this.data.CustomerPONo
    var repairMessage = ''
    if (this.data.IsRushRepair == 1) {
      var repairMessage = "Rush Repair"
    }
    if (this.data.IsWarrantyRecovery == 1) {
      var repairMessage = "Warranty Repair"
    }
    if (this.data.IsWarrantyRecovery == 2) {
      var repairMessage = "Warranty New"
    }
    if ((this.data.IsRushRepair == 1) && (this.data.IsWarrantyRecovery == 1)) {
      var repairMessage = "Rush Repair,Warranty Repair"
    }
    this.RushWarrantyMessage = repairMessage

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
    var RRId = this.RRId;
    var RepairRequestNo = this.RepairRequestNo
    var PartNo = this.PartNo
    var SerialNo = this.SerialNo;
    var CompanyName = this.CompanyName;
    var CustomerRefList = this.CustomerRefList
    var IsDisplayPOInQR = this.IsDisplayPOInQR
    var CustomerPONo = this.CustomerPONo
    this.modalRef = this.CommonmodalService.show(CustomerRefQrCodeComponent,
      {
        backdrop: 'static',
        ignoreBackdropClick: false,
        initialState: {
          data: { RRId, RepairRequestNo, SerialNo, PartNo, CustomerRefList, CompanyName, IsDisplayPOInQR, CustomerPONo },
          class: 'modal-lg'
        }, class: 'gray modal-lg'
      });

    this.modalRef.content.closeBtnName = 'Close';

    this.modalRef.content.event.subscribe(res => {
    });
  }


  //QR Code
  viewQrCode() {
    this.modalRef.hide();
    //var RRId= this.viewResult.RRId
    var RRId = this.RRId;
    var RepairRequestNo = this.RepairRequestNo
    var PartNo = this.PartNo
    var SerialNo = this.SerialNo;
    var CompanyName = this.CompanyName;
    var CustomerRefList = this.CustomerRefList
    var IsDisplayPOInQR = this.IsDisplayPOInQR
    var CustomerPONo = this.CustomerPONo
    this.modalRef = this.CommonmodalService.show(QrCodeComponent,
      {
        backdrop: 'static',
        ignoreBackdropClick: false,
        initialState: {
          data: { RRId, RepairRequestNo, SerialNo, PartNo, CustomerRefList, CompanyName, IsDisplayPOInQR, CustomerPONo },
          class: 'modal-lg qrpdf'
        }, class: 'gray modal-lg'
      });

    this.modalRef.content.closeBtnName = 'Close';

    this.modalRef.content.event.subscribe(res => {
    });
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
