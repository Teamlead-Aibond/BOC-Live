import { Component, OnInit, ViewChild, OnDestroy } from "@angular/core";

//import { cardData } from './data';
import { DataTableDirective } from "angular-datatables";
import { Subject } from "rxjs";
import { HttpClient } from "@angular/common/http";

import pdfMake from "pdfmake/build/pdfmake.min.js";
import pdfFonts from "pdfmake/build/vfs_fonts";
import Swal from "sweetalert2";
import {
  NgbDateAdapter,
  NgbDateParserFormatter,
  NgbCalendar,
} from "@ng-bootstrap/ng-bootstrap";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { CommonService } from "src/app/core/services/common.service";
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: "app-part-tracking-new",
  templateUrl: "./part-tracking-new.component.html",
  styleUrls: ["./part-tracking-new.component.scss"],
})
export class PartTrackingNewComponent implements OnInit {
  form: FormGroup;

  // bread crumb items
  breadCrumbItems: Array<{}>;

  // Card Data
  cardData: any;
  tableData: any = [];
  part: any;
  warehouseSub3List: any;

  constructor(private fb: FormBuilder, private service: CommonService) {}

  ngOnInit() {
    this.breadCrumbItems = [
      { label: "Aibond", path: "/" },
      { label: "Inventory", path: "/" },
      { label: "List", path: "/", active: true },
    ];

    this.form = this.fb.group({
      PartNo: [""],
      SerialNo: [""],
      RFID: [""],
    });

    this.getWarehouseSub2ListByRoomId(1);
  }

  getWarehouseSub2ListByRoomId(roomId) {
    this.service
      .postHttpService(
        { WarehouseSub2Id: roomId },
        "getWarehouseSub2ListByRoomId"
      )
      .subscribe((response) => {
        this.warehouseSub3List = response.responseData.splice(0, 3).map((a) => {
          return {
            ...a,
            slots: this.generateSlots(a.RowsCount, a.ColumnCount),
          };
        });

        if (this.warehouseSub3List) {
        }
      });
  }
  generateSlots(RowsCount: any, ColumnCount: any): any {
    let numerics = [
      "one ",
      "two ",
      "three ",
      "four ",
      "five ",
      "six ",
      "seven ",
      "eight ",
      "nine ",
      "ten ",
      "eleven ",
      "twelve ",
      "thirteen ",
      "fourteen ",
      "fifteen ",
      "sixteen ",
      "seventeen ",
      "eighteen ",
      "nineteen ",
    ];
    let slots: any = [];
    for (let rowIdx = 1; rowIdx <= RowsCount; rowIdx++) {
      for (let colIdx = 1; colIdx <= ColumnCount; colIdx++) {
        let colSlot = {
          colClass:
            "cube" +
            (rowIdx > 1 ? rowIdx - 1 : "") +
            " " +
            (colIdx > 1 ? numerics[colIdx - 1] : ""),
          cols: [],
        };
        let char = String.fromCharCode(64 + colIdx);
        colSlot.cols.push(rowIdx + char);
        slots.push(colSlot);
      }
    }
    return slots;
  }

  ngOnDestroy(): void {}

  searchPart() {
    let body = this.form.value;
    let api = "trackPart";
    if (body) {
      this.service.postHttpService(body, api).subscribe(
        (response) => {
          console.log(response, "response");

          if (response.status == true) {
            this.part = response.responseData;
            this.getWarehouseSub2ListByRoomId(this.part.WarehouseSub2Id);
          } else {
            this.part = null;
            Swal.fire({
              title: "Error!",
              text: response.message,
              type: "warning",
              confirmButtonClass: "btn btn-confirm mt-2",
            });
          }
          // this.cd_ref.detectChanges();
        },
        (error) => console.log(error)
      );
    }
  }

  delete() {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      type: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel!",
      confirmButtonClass: "btn btn-success mt-2",
      cancelButtonClass: "btn btn-danger ml-2 mt-2",
      buttonsStyling: false,
    }).then((result) => {
      if (result.value) {
        Swal.fire({
          title: "Deleted!",
          text: "Inventory has been deleted.",
          type: "success",
        });
      } else if (
        // Read more about handling dismissals
        result.dismiss === Swal.DismissReason.cancel
      ) {
        Swal.fire({
          title: "Cancelled",
          text: "Inventory  is safe :)",
          type: "error",
        });
      }
    });
  }

  tabChange(event) {}
}
