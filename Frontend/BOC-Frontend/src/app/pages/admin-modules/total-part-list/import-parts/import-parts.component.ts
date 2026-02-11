/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonService } from 'src/app/core/services/common.service';
import { parts_import } from 'src/assets/data/dropdown';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-import-parts',
  templateUrl: './import-parts.component.html',
  styleUrls: ['./import-parts.component.scss']
})
export class ImportPartsComponent implements OnInit {

    importColumnList: any = [];
    selectedFile: FormGroup;
    filterForm: FormGroup;
    date = new Date();
    show = false;
    exceltoJson: any;
    showTable = false;
    columnDefs = parts_import;
    
    tableList: any;
    tableHeader: any[];
    responsePayload: any;
    fileData: File;
    showResponse = false;
    loading = false
    constructor(private formBuilder: FormBuilder,public service: CommonService) { }
  
  
    ngOnInit(): void {
      this.intialForm();
    }
     //FORM INITALIZATION
     intialForm() {
      this.selectedFile = this.formBuilder.group({
        fileupload: ['', [Validators.required]]
  
      });
  
      this.filterForm = this.formBuilder.group({
        PartNo :['', [Validators.required]],
        Description: ['', [Validators.required]],
        Manufacturer: ['', [Validators.required]],
        ManufacturerPartNo: ['', Validators.required],
        Price: ['', Validators.required],
      });
  
    }
  
   
  
    //CHECK HEADER DUPLICATIONS
    checkTheFilter() {
      let filterKeys = [];
      for (var key in this.filterForm.value) {
        filterKeys.push(this.filterForm.value[key])
      }
  
      let dupChars = filterKeys.filter((c, index) => {
        return filterKeys.indexOf(c) !== index;
      });
  
      return dupChars;
    }
  
    //PREVIEW TABLE
    previewTable() {
      let checkFilter = this.checkTheFilter();
      let formvalue = this.filterForm.value;
      if(this.filterForm.valid){
  
        if (!checkFilter.length) {
          this.showTable = true;
    
          //Table header 
    
          let headerChanges = [];
          if (headerChanges.length == 0) {
            for (var key in formvalue) {
              this.columnDefs.map(data => {
                if (key == data['key']) {
                  headerChanges.push(data)
                }
              })
            }
            this.tableHeader = headerChanges;
          }
    
          //Deep Copying the Excel Json
          this.tableList = this.exceltoJson.sheet1.map(a => ({ ...a }));
    
          this.tableList.map(data => {
            for (var key in formvalue) {
              data[key] = data[formvalue[key]];
            }
            return
    
          })
    
        } else {
          this.showMessage("Can't map colunm more than once", 'error');
          this.showTable = false;
        }
  
      }else {
          this.showMessage("Select all the fields", 'error');
          this.showTable = false;
        }
  
     
  
    }
  
    //FILE SUBMIT
    fileUploadSubmit() {
      if(this.selectedFile.valid){
        this.show = !this.show;
      }
    }
  
    onFileChange(event: any) {
      this.fileData = <File>event.target.files[0];
      // this.show = true;
      this.exceltoJson = {};
      let headerJson = {};
      /* wire up file reader */
      const target: DataTransfer = <DataTransfer>(event.target);
      // if (target.files.length !== 1) {
      //   throw new Error('Cannot use multiple files');
      // }
      const reader: FileReader = new FileReader();
      reader.readAsBinaryString(target.files[0]);
      this.exceltoJson['filename'] = target.files[0].name;
      reader.onload = (e: any) => {
        /* create workbook */
        const binarystr: string = e.target.result;
        const wb: XLSX.WorkBook = XLSX.read(binarystr, { type: 'binary' });
        for (var i = 0; i < wb.SheetNames.length; ++i) {
          const wsname: string = wb.SheetNames[i];
          const ws: XLSX.WorkSheet = wb.Sheets[wsname];
          const data = XLSX.utils.sheet_to_json(ws); // to get 2d array pass 2nd parameter as object {header: 1}
          this.exceltoJson[`sheet${i + 1}`] = data;
          const headers = this.get_header_row(ws);
          headerJson[`header${i + 1}`] = headers;
        }
  
        this.importColumnList = headerJson['header1'] ? headerJson["header1"] : [];
        this.exceltoJson['headers'] = headerJson;
  
        console.log(this.exceltoJson);
      };
    }
  
    //RESET FILTER
    refreshFileUpload(){
      this.intialForm();
      this.show = !this.show;
      this.showTable = false
      this.showResponse=false;
    }
  
    get_header_row(sheet) {
      var headers = [];
      var range = XLSX.utils.decode_range(sheet['!ref']);
      var C, R = range.s.r; /* start in the first row */
      /* walk every column in the range */
      for (C = range.s.c; C <= range.e.c; ++C) {
        var cell = sheet[XLSX.utils.encode_cell({ c: C, r: R })] /* find the cell in the first row */
        // console.log("cell",cell)
        var hdr = "UNKNOWN " + C; // <-- replace with your desired default 
        if (cell && cell.t) {
          hdr = XLSX.utils.format_cell(cell);
          headers.push(hdr);
        }
      }
      return headers;
    }
  
    // FILE UPLOAD
    submit() {
      let checkFilter = this.checkTheFilter();
      if(!checkFilter.length){
        this.loading = true;
        let selectedValue = this.selectedFile.value;
        const formData = new FormData();
        formData.append('file', this.fileData);
        formData.append('mapping', JSON.stringify(this.filterForm.value));
    
        this.service.postHttpService("ImportParts",formData)
        .subscribe((res: any) => {
          if (res.status == true) {
            this.responsePayload = res.responseData;
            this.loading = false;
            this.showResponse=true;
          }
        },
          (error) => {                            
            console.log(error);
            this.showMessage("Contact Admin", 'error');
            this.loading = false;
          })
      }else {
        this.showMessage("Can't map colunm more than once", 'error');
      }
    }
  
    //SWAL MSG
    showMessage(message: string, type: 'success' | 'error' | 'warning') {
      Swal.fire({
        title:type,
        text: message,
        type: type
      });
      
    }
  
  
  

}
