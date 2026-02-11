/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
import { Component, OnInit, ElementRef ,ViewChild} from '@angular/core';
import jspdf from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-purchase-order-pdf',
  templateUrl: './purchase-order-pdf.component.html',
  styleUrls: ['./purchase-order-pdf.component.scss']
})
export class PurchaseOrderPdfComponent{

  generatePDF() {
    var data = document.getElementById('contentToConvert');
    html2canvas(data).then(canvas => {
      var imgWidth = 208;
      var imgHeight = canvas.height * imgWidth / canvas.width;
      const contentDataURL = canvas.toDataURL('image/png')
      let pdf = new jspdf('p', 'mm', 'a4');
  
      var position = 0;
      pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight)
      pdf.save('purchase-order.pdf');
    });
  }

 // generatePDF() {
//     var data = document.getElementById('contentToConvert');
//     html2canvas(data).then(canvas => {
//       var imgWidth = 206;
//       var imgHeight = canvas.height * imgWidth / canvas.width;
//       const contentDataURL = canvas.toDataURL('image/png')
//       let pdf = new jspdf('p', 'mm', 'a4');

//     // const context = canvas.getContext('2d');
//     const context = new jspdf({
//       orientation: "portrait",
//       unit: "mm",
//       format: [4, 2]
//     });
//     const opt = { margin: 1, image: { type: 'jpeg', quality: 0.98 }, html2canvas: { scale: 1, useCORS: true,}, jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' } };
// //context.scale(2, 2);
// context['dpi'] = 144;
// context['imageSmoothingEnabled'] = false;
// context['mozImageSmoothingEnabled'] = false;
// context['oImageSmoothingEnabled'] = false;
// context['webkitImageSmoothingEnabled'] = false;
// context['msImageSmoothingEnabled'] = false;

      //var position = 0;
      //pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight)
    //  pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, 206, 215);
    //  pdf.save('purchase-order.pdf');
  //  });
//  }

}


