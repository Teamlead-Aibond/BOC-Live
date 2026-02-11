/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ReaderSatus, ReaderZone, RfReader, ReaderId, ReaderAction } from './rfid-integration.metadata';
import { RfIdIntegrationService } from './rfid-integration.service';
@Component({
  selector: 'app-rfid-integration',
  templateUrl: './rfid-integration.component.html',
  styleUrls: ['./rfid-integration.component.scss']
})
export class RfIdIntegrationComponent implements OnInit, OnDestroy {
  rfIdReaderForm: FormGroup;
  rfIdReaderData: RfReader[] = [];
  readerState: string = '';
  searchStatus: string = '';
  subscription: Subscription;
  constructor(
    private rfIdIntegrationService: RfIdIntegrationService
  ) { }
  ngOnInit(): void {
    this.readerStatus();
    this.rfIdReaderData = this.rfIdIntegrationService.readerManager.reader[ReaderId.mainStore].zones[ReaderZone.autoStockOut].readerData;
    this.rfIdIntegrationService.readerManager.reader[ReaderId.mainStore].zones[ReaderZone.autoStockOut].readerActionStatus
      .subscribe(status => {
        if (status.action == ReaderAction.exit) {
          //console.log(status.actionTags);
        }
      })
  }
  // initForm() {
  //   this.rfIdReaderForm = new FormGroup({
  //     //Node Service Url to connect with reader API
  //     //'interfaceUrl': new FormControl('http://localhost:3000/'),
  //     //Reader REST API Host API Path
  //     'readerHostApiPath': new FormControl('http://impinj-14-04-4f/api/v1/'),
  //     //Reader Antenna congiguration preset name (default: configured to antenna 1)
  //     'presetName': new FormControl('inv-zone'),
  //   });
  // }
  readerStatus() {
    this.rfIdIntegrationService.readerStatus(ReaderId.mainStore).subscribe((data: ReaderSatus) => {
      this.readerState = data.status;
      this.readReader();
    });
  }
  startReader() {
    this.rfIdIntegrationService.readerStatus(ReaderId.mainStore).subscribe((data: ReaderSatus) => {
      this.readerState = data.status;
      if (this.readerState == 'idle') {
        this.rfIdIntegrationService.startReader(ReaderId.mainStore).subscribe(data => {
          this.readerState = (data == null ? 'running' : '')
        });
      }
    });
  }
  readReader() {
    this.rfIdIntegrationService.startReaderData(ReaderId.mainStore, ReaderZone.autoStockOut);
  }
  stopReader() {
    this.rfIdIntegrationService.stopReader(ReaderId.mainStore).subscribe(data => {
      this.readerState = (data == null ? 'idle' : '')
    });
  }
  resetReader() {
    this.rfIdIntegrationService.resetReaderData(ReaderId.mainStore, ReaderZone.autoStockOut);
  }
  // directConnect() {
  //   this.rfIdIntegrationService.readerStatusByDirectConnect(ReaderId.mainStore).subscribe((data: ReaderSatus) => {
  //     this.readerState = data.status;
  //   });
  // }
  decodeEpc() {
    //Decode base64 epc to byte (ASCII)
    var epcList = ['AAAAAAAAAAAAABMH', 'AAAAAAAAAAAAABMI', 'AAAAAAAAAAAAABMl', 'AAAAAAAAAAAAABMm']
    var str = epcList.join(',');
    console.log(str);
    var epcDecoded = []
    epcList.forEach((epc, idx) => {
      var epcByte = atob(epc);
      var epcHexa = '';
      //Convert ASCII to hexadecimal form decoded base64 epc
      for (var i = 0; i < epcByte.length; i++) {
        var code = epcByte.charCodeAt(i).toString(16);
        if (code.length == 1) code = '0' + code;
        epcHexa += code;
      }
      epcDecoded.push(`${epc} : ${epcHexa}`);
    });
    console.log(epcDecoded);
  }
  ngOnDestroy() {
    if (this.subscription) this.subscription.unsubscribe();
    this.rfIdIntegrationService.unSubscribeReader(ReaderId.mainStore, ReaderZone.autoStockOut);
  }
}