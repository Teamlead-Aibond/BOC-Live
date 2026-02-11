import { Injectable } from '@angular/core';
import {saveAs}  from 'file-saver';
 import * as XLSX from 'xlsx';
import { Workbook } from 'exceljs';
import { DatePipe } from '@angular/common';
import * as fs from 'file-saver';
 const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
 const EXCEL_EXTENSION = '.xlsx';

 
@Injectable()
export class ExcelService {

  constructor(private datePipe: DatePipe) { }

  public exportAsExcelFile(json: any[], excelFileName: string,header?: string[]): void {
    
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
    // console.log('worksheet',worksheet,header);
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    // console.log('workbook',workbook);

    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

    var range = XLSX.utils.decode_range(worksheet['!ref'])
    for (var C = range.s.r; C <= range.e.c; ++C) {
      var address = XLSX.utils.encode_col(C) + '1'; // <-- first row, column number C
      if (!worksheet[address]) continue;
      worksheet[address].v = worksheet[address].v.toUpperCase();
    }


    //const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' });
    this.saveAsExcelFile(excelBuffer, excelFileName);
  }

  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], {
      type: EXCEL_TYPE
   
    }
   );

   saveAs.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
  }




  // generateExcel(Exceldata,fileName) {
  //   //Excel Title, Header, Data
  //   const title = 'AH-Group';
  //   const data = [Exceldata]
  //   const header = ["Part No", "Description", "RR No", "Customer Name", "Cost Of New", "Repair Rate","Difference","Percentage"]
  //   //Create workbook and worksheet
  //   let workbook = new Workbook();
  //   let worksheet = workbook.addWorksheet('Data');

  //   //Add Row and formatting
  //   let titleRow = worksheet.addRow([title]);
  //   titleRow.font = { name: 'Comic Sans MS', family: 4, size: 16, underline: 'double', bold: true }
  //   worksheet.addRow([]);
  //   let subTitleRow = worksheet.addRow(['Date : ' + this.datePipe.transform(new Date(), 'medium')])
  //   //Add Image
  //   // let logo = workbook.addImage({
  //   //   base64: "assets/images/ah_logo.png",
  //   //   extension: 'png',
  //   // });
  //   // worksheet.addImage(logo, 'E1:F3');
  //   worksheet.mergeCells('A1:D2');
  //   //Blank Row 
  //   worksheet.addRow([]);
  //   //Add Header Row
  //   let headerRow = worksheet.addRow(header);
    
  //   // Cell Style : Fill and Border
  //   headerRow.eachCell((cell, number) => {
  //     cell.fill = {
  //       type: 'pattern',
  //       pattern: 'solid',
  //       fgColor: { argb: 'FFFFFF00' },
  //       bgColor: { argb: 'FF0000FF' }
  //     }
  //     cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
  //   })
  //   // worksheet.addRows(data);
  //   // Add Data and Conditional Formatting
  //    data.forEach(d => {
  //    let row = worksheet.addRow(d);
  //   //   // let qty = row.getCell(5);
  //   //   // let color = 'FF99FF99';
  //   //   // if (+qty.value < 500) {
  //   //   //   color = 'FF9999'
  //   //   // }
  //   //   // qty.fill = {
  //   //   //   type: 'pattern',
  //   //   //   pattern: 'solid',
  //   //   //   fgColor: { argb: color }
  //   // }
  //   }
  //  );
  //   worksheet.getColumn(3).width = 30;
  //   worksheet.getColumn(4).width = 30;
  //   worksheet.getColumn(2).width = 30;
  //   worksheet.getColumn(5).width = 30;
  //   worksheet.addRow([]);
  //   //Footer Row
  //   let footerRow = worksheet.addRow(['This is system generated excel sheet.']);
  //   footerRow.getCell(1).fill = {
  //     type: 'pattern',
  //     pattern: 'solid',
  //     fgColor: { argb: 'FFCCFFE5' }
  //   };
  //   footerRow.getCell(1).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
  //   //Merge Cells
  //   worksheet.mergeCells(`A${footerRow.number}:F${footerRow.number}`);
  //   //Generate Excel File with given name
  //   workbook.xlsx.writeBuffer().then((data) => {
  //     let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  //     fs.saveAs(blob,fileName );
  //   })
  // }

}