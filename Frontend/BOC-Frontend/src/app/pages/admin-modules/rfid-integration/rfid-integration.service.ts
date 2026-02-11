/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
import { Injectable } from '@angular/core';
import { HttpClient, HttpEventType, HttpHeaders } from '@angular/common/http';
import { catchError, filter, map } from 'rxjs/operators';
import { interval, Observable, Subject, Subscription } from 'rxjs';
import { ReaderOption, ReaderAction, ReaderManager, ReaderId, ReaderSatus, ReaderActionStatus, ReaderZone, RfReader } from './rfid-integration.metadata';
import { CommonService } from 'src/app/core/services/common.service';
@Injectable(
    // { providedIn: 'root' }
)
export class RfIdIntegrationService {
    readerManager: ReaderManager = {
        readerInterfaceServiceHost: 'http://localhost:3000/', //Node express service
        reader: [{
            readerHostApiPath: 'http://impinj-14-04-4f/api/v1/', //'http://impinj-14-0c-d2/api/v1/', 
            presetName: 'inv-zone',
            readerId: ReaderId.mainStore,
            zones: [
                {
                    zone: ReaderZone.stockIn,
                    antennaPort: 1,
                    readyAntennaPort: 1,
                    readyDeductionCount: 1,
                    acceptAntennaPort: 2,
                    acceptDeductionCount: 1,
                    readyReaderData: [],
                    readerData: [],
                    readerActionStatus: new Subject<ReaderActionStatus>()
                },
                {
                    zone: ReaderZone.autoStockOut,
                    antennaPort: 2,
                    readyAntennaPort: 2,
                    readyDeductionCount: 1,
                    acceptAntennaPort: 1,
                    acceptDeductionCount: 1,
                    readyReaderData: [],
                    readerData: [],
                    readerActionStatus: new Subject<ReaderActionStatus>()
                }

                /* {
                    zone: ReaderZone.lossPrevention,
                    antennaPort: 1,
                    readyReaderData:[],
                    readerData: [],
                    readerActionStatus: new Subject<ReaderActionStatus>()
                },
                {
                    zone: ReaderZone.stockOut,
                    antennaPort: 1,
                    readyReaderData:[],
                    readerData: [],
                    readerActionStatus: new Subject<ReaderActionStatus>()
                } */
            ]
        }]
    };
    subscriptionReader: Subscription;
    subscriptionInventory: Subscription;
    subscriptionTimer: Subscription;    

    employeeList: any[] = [];

    jsonDataCheckInReady;
    jsonDataCheckInConfirm;
    tagInventoryStatus: boolean = false;

    private invUrl = 'http://65.1.73.181:3000/api/v1.0/SettingsGeneral/GetRFIDConfig';
    private invTagUrl = 'http://65.1.73.181:3000/api/v1.0/parts/PartstrackingByRFIdTagNo';
    private invToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZGVudGl0eVR5cGUiOjAsIklkZW50aXR5SWQiOjAsIlVzZXJJZCI6MSwiRmlyc3ROYW1lIjoiRGV2IDE4MSBBZG1uIiwiTGFzdE5hbWUiOiJVc2VyIiwiRnVsbE5hbWUiOiJEZXYgMTgxIEFkbW4gVXNlciIsImlhdCI6MTYxOTYwNTg0NiwiZXhwIjoxNjE5ODAwMjQ2fQ.iQAJw5fXNhsEnKVeP8YDr2flZw1uhYsBR1Pwy5qO-1Q';
    constructor(
        private http: HttpClient,
        private commonService: CommonService
    ) { }
    // ---------------- api methods --------------------
    readerStatus(readerId: ReaderId): Observable<any> {
        const url = `${this.readerManager.readerInterfaceServiceHost}reader/status`
        return this.http.post(url, this.readerReqBody(readerId))
            .pipe();
    }
    //"proxyConfig": "src/proxy.conf.json"
    // readerStatusByDirectConnect(readerId: ReaderId): Observable<any> {
    //     const url = `${this.readerManager.reader[readerId].readerHostApiPath}status`
    //     return this.http.post(url, this.readerReqBody(readerId))
    //         .pipe();
    // }
    startReader(readerId: ReaderId): Observable<any> {
        const url = `${this.readerManager.readerInterfaceServiceHost}reader/start`
        return this.http.post(url, this.readerReqBody(readerId))
            .pipe();
    }
    stopReader(readerId: ReaderId): Observable<any> {
        const url = `${this.readerManager.readerInterfaceServiceHost}reader/stop`
        return this.http.post(url, this.readerReqBody(readerId))
            .pipe();
    }
    searchReaderTag(readerOption: ReaderOption): Observable<any> {
        const url = `${this.readerManager.readerInterfaceServiceHost}reader/search`
        return this.http.post(url, readerOption)
            .pipe();
    }
    getPreset(readerId: ReaderId): Observable<any> {
        const url = `${this.readerManager.readerInterfaceServiceHost}reader/preset/get`
        return this.http.post(url, this.readerReqBody(readerId))
            .pipe();
    }
    setPreset(body: any): Observable<any> {
        const url = `${this.readerManager.readerInterfaceServiceHost}reader/preset/set`
        return this.http.post(url, body)
            .pipe();
    }
    private readTag(readerOption: ReaderOption): Observable<any> {
        const url = `${this.readerManager.readerInterfaceServiceHost}reader/read`;
        return this.http.post(url, readerOption,
            { observe: 'events', responseType: 'text', reportProgress: true })
            .pipe(
                //e.type === 3
                filter((e: any) => e.type === HttpEventType.DownloadProgress && e.partialText),
                map(e => {
                    const partials = e.partialText.trim().split('\r\n');
                    return this.parseJson(partials.pop());
                })
            );
    }

    getInventoryByRFID(epc): Observable<any> {
        var reqBody = { "RFIDTagNo": epc };
        return this.commonService.postHttpService(reqBody, "getPartstrackingByRFIdTagNo").pipe();
    }
    getReaderConfig(): Observable<any> {
        return this.commonService.postHttpService({}, "GetRFIDConfig").pipe();
    }
    // ---------------- internal logics --------------------
    startReaderData(readerId: ReaderId, readerZone: ReaderZone) {
        this.getReaderConfig().subscribe(configData => {
            //console.log('configData', configData)
            if (configData.status == true) {
                const readerConfig: ReaderManager = configData.responseData.readerConfig;
                this.readerManager.readerInterfaceServiceHost = readerConfig.readerInterfaceServiceHost;
                readerConfig.reader.forEach((config, idx) => {
                    this.readerManager.reader[idx].readerId = config.readerId;
                    this.readerManager.reader[idx].readerHostApiPath = config.readerHostApiPath;
                    this.readerManager.reader[idx].presetName = config.presetName;
                    config.zones.forEach((zoneConfig, zidx) => {
                        this.readerManager.reader[idx].zones[zidx].zone = zoneConfig.zone;
                        this.readerManager.reader[idx].zones[zidx].antennaPort = zoneConfig.antennaPort;

                        this.readerManager.reader[idx].zones[zidx].readyAntennaPort = zoneConfig.readyAntennaPort;
                        this.readerManager.reader[idx].zones[zidx].acceptAntennaPort = zoneConfig.acceptAntennaPort;
                        this.readerManager.reader[idx].zones[zidx].readyDeductionCount = zoneConfig.readyDeductionCount;
                        this.readerManager.reader[idx].zones[zidx].acceptDeductionCount = zoneConfig.acceptDeductionCount;
                    });
                });
                this.readerStatus(readerId).subscribe((data: ReaderSatus) => {
                    if (data.status == 'idle') {
                        this.startReader(readerId).subscribe(status => {
                            if (status == null) this.readReaderData(readerId, readerZone);
                        });
                    } else if (data.status == 'running') {
                        this.readReaderData(readerId, readerZone);
                    };

                    this.readerManager.reader[readerId].zones[readerZone].readerActionStatus.subscribe(actionStatus => {
                        this.addInventoryItem(readerId, readerZone, actionStatus);
                    });
                });
            }
        });
        /* this.subscriptionTimer = interval(2000).subscribe(val => {
            this.removeLocationExitTag(readerId, readerZone);
        }); */
    }

    private readReaderData(readerId: ReaderId, readerZone: ReaderZone) {
        const zoneAntennaPort = this.readerManager.reader[readerId].zones[readerZone].antennaPort;
        const zoneReadyPort = this.readerManager.reader[readerId].zones[readerZone].readyAntennaPort;
        const zoneAcceptPort = this.readerManager.reader[readerId].zones[readerZone].acceptAntennaPort;
        this.unSubscribeReader(readerId, readerZone);
        //if (this.readerManager.reader[readerId].zones[readerZone].readerData.length > 0) {
        //    this.readerManager.reader[readerId].zones[readerZone].readerData.splice(0);
        //}
        this.subscriptionReader = this.readTag(this.readerReqBody(readerId))
            .subscribe((readerData: RfReader) => {
                if (readerData && readerData.tagInventoryEvent && readerData.tagInventoryEvent.antennaPort) {
                    if ((readerData.tagInventoryEvent.antennaPort != zoneReadyPort) &&
                        (readerData.tagInventoryEvent.antennaPort != zoneAcceptPort)) return;
                        this.getEmployeeNo(readerData.tagInventoryEvent.epc).subscribe(responseEmp => {
                            if (responseEmp.status == true) {
                                if (!this.employeeList.includes(responseEmp.responseData.EmployeeNo)) {
                                    this.employeeList.push(responseEmp.responseData.EmployeeNo);
                                }
                                return;
                            }
                        });
                    if (!this.isValidTag(readerData)) return;
                    //if (this.isDeletedTag(readerId, readerZone, readerData)) return;
                }
                this.bindReaderData(readerData, readerZone, zoneReadyPort, zoneAcceptPort,
                    this.readerManager.reader[readerId].zones[readerZone].readerActionStatus,
                    this.readerManager.reader[readerId].zones[readerZone].readerData,
                    this.readerManager.reader[readerId].zones[readerZone].readyReaderData);
            });
    }

    private bindReaderData(readerData: RfReader, readerZone: ReaderZone, zoneReadyPort, zoneAcceptPort, readerActionStatus: Subject<ReaderActionStatus>, postedReaderData: RfReader[], postedReadyReaderData: RfReader[]) {
        var actionStatus: ReaderActionStatus = { action: ReaderAction.default, actionTags: [] };

        if (readerData && readerData.tagInventoryEvent && readerData.tagInventoryEvent.epc) {

            // Check for the Ready Port
            if (readerData.tagInventoryEvent.antennaPort == zoneReadyPort) {
                var readyReaderData = postedReadyReaderData.find(tag => tag.tagInventoryEvent.epc == readerData.tagInventoryEvent.epc);
                if (!(readyReaderData)) {
                    //readerData.readyAntennaTime = new Date();
                    postedReadyReaderData.push(readerData);
                }
                //console.log('postedReadyReaderData', postedReadyReaderData);
            } else if (readerData.tagInventoryEvent.antennaPort == zoneAcceptPort) {
                if (postedReadyReaderData.find(tag => tag.tagInventoryEvent.epc == readerData.tagInventoryEvent.epc)) {
                    var postedDataItem = postedReaderData.find(tag => tag &&
                        tag.tagInventoryEvent.epc == readerData.tagInventoryEvent.epc);

                    readerData.stockedInStatus = false;

                    if (!postedDataItem) {
                        /* postedDataItem.timestamp = readerData.timestamp;
                        if(!postedDataItem.stockedIn) {
                            postedDataItem.stockedInStatus = false;
                            //postedDataItem.locationStatus = false;
                        }
                        postedDataItem.tagInventoryEvent.antennaPort = readerData.tagInventoryEvent.antennaPort;
                        postedDataItem.tagInventoryEvent.peakRssiCdbm = readerData.tagInventoryEvent.peakRssiCdbm;
                        postedDataItem.tagInventoryEvent.frequency = readerData.tagInventoryEvent.frequency;
                        postedDataItem.tagInventoryEvent.transmitPowerCdbm = readerData.tagInventoryEvent.transmitPowerCdbm;
                        postedDataItem.tagInventoryEvent.lastSeenTime = readerData.tagInventoryEvent.lastSeenTime;
                        postedDataItem.activeTime = new Date();
                        postedDataItem.count++;
                        //retain 
                        actionStatus.action = ReaderAction.retain;
                        actionStatus.actionTags.push(postedDataItem);
                        readerActionStatus.next(actionStatus);
                    } else { */
                        //Add new data
                        readerData.count = postedReaderData.length + 1;

                        if (Number.isInteger(+readerData.tagInventoryEvent.epcHex)) {
                            readerData.tagInventoryEvent.epcHexShort = Number(readerData.tagInventoryEvent.epcHex).toString();
                        } else {
                            readerData.tagInventoryEvent.epcHexShort = readerData.tagInventoryEvent.epcHex;
                        }

                        readerData.activeTime = new Date();
                        readerData.RFIDEmployeeNo = this.employeeList.join(',');
                        readerData.acceptAntennaTime = new Date();
                        postedReaderData.push(readerData);
                        actionStatus.action = ReaderAction.entry;
                        actionStatus.actionTags.push(readerData);
                        readerActionStatus.next(actionStatus);
                    }
                }
            }

            // });

        } else if (readerData && readerData.tagLocationExitEvent && readerData.tagLocationExitEvent.epc) {
            //Remove exit location data
            const exitEpc = readerData.tagLocationExitEvent.epc;
            const exitIdx = postedReaderData.findIndex(tag => tag.tagInventoryEvent.epc == exitEpc);
            if (exitIdx >= 0) {
                actionStatus.action = ReaderAction.exit;
                actionStatus.actionTags.push(postedReaderData[exitIdx]);
                postedReaderData.splice(exitIdx, 1);
                readerActionStatus.next(actionStatus);
            }
            //console.log('Tag Location Exit Event');
            //console.log(readerData.tagLocationExitEvent);
        } else if (readerData && !readerData.inventoryStatusEvent) {
            //console.log('Other Event');
            //console.log(readerData);
        }
    }

    private bindReaderDataOld(readerData: RfReader, readerActionStatus: Subject<ReaderActionStatus>, postedReaderData: RfReader[]) {
        var actionStatus: ReaderActionStatus = { action: ReaderAction.default, actionTags: [] };
        if (readerData && readerData.tagInventoryEvent && readerData.tagInventoryEvent.epc) {
            //console.log(readerData);
            var postedDataItem = postedReaderData.find(tag => tag && tag.tagInventoryEvent.epc == readerData.tagInventoryEvent.epc);
            //Update existing data
            if (postedDataItem) {
                postedDataItem.timestamp = readerData.timestamp;
                postedDataItem.tagInventoryEvent.antennaPort = readerData.tagInventoryEvent.antennaPort;
                postedDataItem.tagInventoryEvent.peakRssiCdbm = readerData.tagInventoryEvent.peakRssiCdbm;
                postedDataItem.tagInventoryEvent.frequency = readerData.tagInventoryEvent.frequency;
                postedDataItem.tagInventoryEvent.transmitPowerCdbm = readerData.tagInventoryEvent.transmitPowerCdbm;
                postedDataItem.tagInventoryEvent.lastSeenTime = readerData.tagInventoryEvent.lastSeenTime;
                postedDataItem.activeTime = new Date();
                postedDataItem.count++;
                //retain 
                actionStatus.action = ReaderAction.retain;
                actionStatus.actionTags.push(postedDataItem);
                readerActionStatus.next(actionStatus);
            } else {
                //console.log(readerData);
                //Add new data
                readerData.count = postedReaderData.length + 1;
                if (Number.isInteger(+readerData.tagInventoryEvent.epcHex)) {
                    readerData.tagInventoryEvent.epcHexShort = Number(readerData.tagInventoryEvent.epcHex).toString();
                } else {
                    readerData.tagInventoryEvent.epcHexShort = readerData.tagInventoryEvent.epcHex;
                }
                //var a = isNumber('a123');
                readerData.activeTime = new Date();
                postedReaderData.push(readerData);
                actionStatus.action = ReaderAction.entry;
                actionStatus.actionTags.push(readerData);
                readerActionStatus.next(actionStatus);
            }
        } else if (readerData && readerData.tagLocationExitEvent && readerData.tagLocationExitEvent.epc) {
            //Remove exit location data
            const exitEpc = readerData.tagLocationExitEvent.epc;
            const exitIdx = postedReaderData.findIndex(tag => tag.tagInventoryEvent.epc == exitEpc);
            if (exitIdx >= 0) {
                actionStatus.action = ReaderAction.exit;
                actionStatus.actionTags.push(postedReaderData[exitIdx]);
                postedReaderData.splice(exitIdx, 1);
                readerActionStatus.next(actionStatus);
            }
            //console.log('Tag Location Exit Event', `index = ${exitIdx}` );
            //console.log(readerData.tagLocationExitEvent);
        } else if (readerData && !readerData.inventoryStatusEvent) {
            //console.log('Other Event');
            //console.log(readerData);
        }
    }

    addInventoryItem(readerId: ReaderId, readerZone: ReaderZone, actionStatus: ReaderActionStatus) {
        if (actionStatus.action == ReaderAction.entry || actionStatus.action == ReaderAction.retain) {
            var readerData = this.readerManager.reader[readerId].zones[readerZone].readerData;
            actionStatus.actionTags.forEach((tag, idx) => {
                var readerDataItem = readerData.find(data => data.tagInventoryEvent.epc == tag.tagInventoryEvent.epc);
                if (readerDataItem && !readerDataItem.inventory) {
                    this.getInventoryByRFID(tag.tagInventoryEvent.epc).subscribe(invData => {
                        if (invData && invData.status == true) {
                            readerDataItem.inventory = { ...invData.responseData.Parts, checked: true };
                        }
                        //console.log('invData : ', invData);
                    });
                }
            });
        }
    }

    private isValidTag(readerData: RfReader): boolean {
        var isValid = false;
        if (readerData.tagInventoryEvent && readerData.tagInventoryEvent.epc) {
            isValid = Number.isInteger(+readerData.tagInventoryEvent.epcHex);
        }
        return isValid;
    }

    private isDeletedTag(readerId: ReaderId, readerZone: ReaderZone, readerData: RfReader): boolean {
        var isDeleted = false;
        if (this.readerManager.reader[readerId].zones[readerZone].readerData.length == 0) {
            var lastReaderTagDeleted = this.readerManager.reader[readerId].zones[readerZone].lastReaderTagDeleted;
            if (lastReaderTagDeleted && lastReaderTagDeleted.epc) {
                if (readerData.tagInventoryEvent.epc == lastReaderTagDeleted.epc
                    && readerData.timestamp == lastReaderTagDeleted.lastSeenTime) {
                    isDeleted = true;
                } else {
                    lastReaderTagDeleted.epc = readerData.tagInventoryEvent.epc;
                    lastReaderTagDeleted.lastSeenTime = readerData.timestamp;
                }
            } else {
                this.readerManager.reader[readerId].zones[readerZone].lastReaderTagDeleted = {
                    epc: readerData.tagInventoryEvent.epc,
                    lastSeenTime: readerData.timestamp
                }
                isDeleted = true;
            }
        } else {
            var lastReaderTagDeleted = this.readerManager.reader[readerId].zones[readerZone].lastReaderTagDeleted;
            if (lastReaderTagDeleted && lastReaderTagDeleted.epc) {
                lastReaderTagDeleted.epc = '';
                lastReaderTagDeleted.lastSeenTime = ''
                //console.log(this.readerManager.reader[readerId].zones[readerZone].lastReaderTagDeleted);
            }
        }
        return isDeleted;
    }

    private removeLocationExitTag(readerId: ReaderId, readerZone: ReaderZone) {
        var postedReaderData = this.readerManager.reader[readerId].zones[readerZone].readerData;
        if (postedReaderData.length <= 0) return;
        var readerActionStatus = this.readerManager.reader[readerId].zones[readerZone].readerActionStatus;
        var actionStatus: ReaderActionStatus = { action: ReaderAction.exit, actionTags: [] };
        var exitTags: RfReader[] = [];
        postedReaderData.forEach((tag, idx) => {
            var now = new Date();
            var tagTime = new Date(tag.activeTime);
            var diff = Math.floor((now.getTime() - tagTime.getTime()) / 1000);
            //let days = Math.floor((currentDate.getTime() - date.getTime()) / 1000 / 60 / 60 / 24);
            //console.log('time diff', diff, now.getTime(), tagTime.getTime());
            if (diff > 10) {
                //console.log('Tag Location Exit by Time', diff);
                //console.log(now, tagTime, diff);
                exitTags.push(tag);
                postedReaderData.splice(idx, 1);
            }
        });
        if (exitTags.length > 0) {
            actionStatus.actionTags = exitTags;
            readerActionStatus.next(actionStatus);
        }
        //console.log('exit tag event interval', postedReaderData)
    }

    private readerReqBody(readerId: ReaderId): ReaderOption {
        const readerOption: ReaderOption = {
            readerHostApiPath: this.readerManager.reader[readerId].readerHostApiPath,
            presetName: this.readerManager.reader[readerId].presetName
        }
        return readerOption;
    }

    resetAllReaderData(readerId: ReaderId) {
        // this.resetReaderData(readerId, ReaderZone.lossPrevention);
        this.resetReaderData(readerId, ReaderZone.autoStockOut);
        this.resetReaderData(readerId, ReaderZone.stockIn);
        //this.resetReaderData(readerId, ReaderZone.stockOut);
    }

    resetReaderData(readerId: ReaderId, readerZone: ReaderZone) {
        var postedReaderData = this.readerManager.reader[readerId].zones[readerZone].readerData;
        postedReaderData.splice(0);
        this.readerManager.reader[readerId].zones[readerZone].readerData.splice(0);
    }

    unSubscribeReader(readerId: ReaderId, readerZone: ReaderZone) {
        if (this.subscriptionReader && this.subscriptionReader.closed == false) this.subscriptionReader.unsubscribe();
        //if (this.subscriptionTimer && this.subscriptionTimer.closed == false) this.subscriptionTimer.unsubscribe();
        this.resetReaderData(readerId, readerZone);
    }

    //----------- helper -----------
    private parseJson(strValue): any {
        var json: any;
        try {
            json = JSON.parse(strValue);
            //console.log(strValue);
            return json;
        } catch (e) {
            //console.log('Invalid json string', strValue);
            return '';
        }
    }

    getEmployeeNo(epc): Observable<any> {
        var reqBody = { "EmployeeRFIDTagNo": epc };
        return this.commonService.postHttpService(reqBody, "getEmployeeNo").pipe();
    }
}