/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
import { Subject } from "rxjs";
export interface ReaderSatus {
    //idle, running
    status: string;
    time: string;
    serialNumber: string;
    //disconnected
    mqttBrokerConnectionStatus: string;
    //none
    mqttTlsAuthentication: string;
    //disconnected
    kafkaClusterConnectionStatus: string;
    activePreset: {
        //default
        id: string;
        //"inventory"
        profile: string
    }
}
export interface ReaderManager {
    readerInterfaceServiceHost: string;
    reader: [{
        readerHostApiPath: string;
        presetName: string;
        readerId: ReaderId;
        zones: {
            zone?: ReaderZone;
            antennaPort: number;
            readyAntennaPort: number;
            readyDeductionCount: number;
            acceptAntennaPort: number;
            acceptDeductionCount: number;
            readyReaderData: RfReader[];
            readerData: RfReader[];
            lastReaderTagDeleted?: ReaderTagDeleted;
            readerActionStatus: Subject<ReaderActionStatus>;
        }[]
    }]
}
export interface ReaderActionStatus {
    action?: ReaderAction;
    actionTags?: RfReader[];
    //actionEpcs?: string[];
}
export interface ReaderOption {
    readerHostApiPath: string;
    presetName?: string;
    epc?: string;
    antennaPort?: number;
}
export interface ReaderTagDeleted {
    epc: string;
    lastSeenTime: string;
}
export interface RfReader {
    count: number; // local property
    timestamp: string;
    activeTime: Date; //local property
    inventory: any; //{}; // local property
    stockedInStatus: boolean;
    locationStatus: boolean;
    stockedIn: boolean;
    stockedOut: boolean;
    readyAntennaTime: Date;    
    acceptAntennaTime: Date;
    RFIDEmployeeNo:string;
    tagInventoryEvent: {
        epc: string;
        epcHex: string;
        epcHexShort: string;
        antennaPort: number;
        peakRssiCdbm: number;
        frequency: number;
        transmitPowerCdbm: number;
        lastSeenTime: string;
    },
    inventoryStatusEvent: {
        status: string
    },
    tagLocationExitEvent: {
        epc: string,
        lastSeenTime: string,
        xCm: number,
        yCm: number,
        confidenceMetric: number,
        confidenceData: number[]
    }
}
export interface TagPreference {
    isPresent: boolean;
}
export enum ReaderId {
    mainStore = 0
}
export enum ReaderZone {
    stockIn = 0,
    autoStockOut = 1
    //lossPrevention = 2,
    //stockOut = 3
}
export enum ReaderAction {
    default = 0,
    entry = 1,
    retain = 2,
    exit = 3
}