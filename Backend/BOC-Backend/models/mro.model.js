/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
const con = require("../helper/db.js");
const Constants = require("../config/constants.js");
var async = require('async');
var cDateTime = require("../utils/generic.js");
// const { request } = require("../app.js");
const RRNotes = require("../models/repair.request.notes.model.js");
const FollowUp = require("../models/repair.request.followup.model.js");
const AttachmentModel = require("../models/repair.request.attachment.model.js");

const QuotesModel = require("../models/quotes.model.js");
const QuotesItemModel = require("../models/quote.item.model.js");
const PurchaseOrderModel = require("./purchase.order.model.js");
const SalesOrderModel = require("./sales.order.model.js");
const MROVendor = require("./mro.vendor.js");
const RRVendorsModel = require("../models/repair.request.vendors.model.js");
const RRVendorPartsModel = require("../models/repair.request.vendor.parts.model.js");
const RRNotesModel = require("../models/repair.request.notes.model.js");
const VendorInvoiceModel = require("../models/vendor.invoice.model.js");
const MROVendorPart = require("./mro.vendor.parts.model.js");
const AddressModel = require("./customeraddress.model.js");
const SalesOrder = require("./sales.order.model.js");
const SalesOrderItem = require("./sales.order.item.model.js");
const PurchaseOrder = require("./purchase.order.model.js");
const PurchaseOrderItem = require("./purchase.order.item.model.js");
const MROStatusHistory = require("../models/mro.status.history.model.js");
const MROShippingHistoryModel = require("../models/mro.shipping.history.model.js");
const RR = require("./repair.request.model.js");
const Parts = require("./shop.parts.model.js");
const { getLogInUserId, getLogInIdentityId, getLogInIdentityType, getLogInIsRestrictedCustomerAccess, getLogInMultipleCustomerIds } = require("../helper/common.function.js");
const MROModel = function (obj) {
    this.MROId = obj.MROId;
    this.MRONo = obj.MRONo ? obj.MRONo : '';
    this.RRId = obj.RRId ? obj.RRId : 0;
    this.Description = obj.Description ? obj.Description : '';
    this.Notes = obj.Notes ? obj.Notes : '';
    this.VendorId = obj.VendorId ? obj.VendorId : 0;
    this.EcommerceOrderId = obj.EcommerceOrderId ? obj.EcommerceOrderId : 0;
    this.RRVendorId = obj.RRVendorId ? obj.RRVendorId : 0;
    this.CustomerId = obj.CustomerId ? obj.CustomerId : 0;
    this.CustomerBillToId = obj.CustomerBillToId ? obj.CustomerBillToId : 0;
    this.CustomerShipToId = obj.CustomerShipToId ? obj.CustomerShipToId : 0;
    this.CustomerPONo = obj.CustomerPONo ? obj.CustomerPONo : '';
    this.CustomerSOId = obj.CustomerSOId ? obj.CustomerSOId : 0;
    this.CustomerSONo = obj.CustomerSONo ? obj.CustomerSONo : '';
    this.CustomerSODueDate = obj.CustomerSODueDate ? obj.CustomerSODueDate : null;
    this.CustomerInvoiceId = obj.CustomerInvoiceId ? obj.CustomerInvoiceId : 0;
    this.CustomerInvoiceNo = obj.CustomerInvoiceNo ? obj.CustomerInvoiceNo : '';
    this.CustomerInvoiceDueDate = obj.CustomerInvoiceDueDate ? obj.CustomerInvoiceDueDate : null;
    this.ShippingStatus = obj.ShippingStatus ? obj.ShippingStatus : 0;
    this.ShippingIdentityType = obj.ShippingIdentityType ? obj.ShippingIdentityType : 0;
    this.ShippingIdentityId = obj.ShippingIdentityId ? obj.ShippingIdentityId : 0;
    this.ShippingAddressId = obj.ShippingAddressId ? obj.ShippingAddressId : 0;
    this.ShippingIdentityName = obj.ShippingIdentityName ? obj.ShippingIdentityName : 0;
    this.Status = obj.Status ? obj.Status : 0;
    this.RejectedStatusType = obj.RejectedStatusType ? obj.RejectedStatusType : 0;
    this.CustomerBlanketPOId = obj.CustomerBlanketPOId ? obj.CustomerBlanketPOId : 0;
    this.CustomerPONo = obj.CustomerPONo ? obj.CustomerPONo : '';
    
    

    this.VendorPOId = obj.VendorPOId ? obj.VendorPOId : 0;
    this.VendorPONo = obj.VendorPONo ? obj.VendorPONo : '';
    this.VendorPODueDate = obj.VendorPODueDate ? obj.VendorPODueDate : '0000-00-00';


    this.IsActive = obj.IsActive ? obj.IsActive : 0;

    this.VendorInvoiceId = obj.VendorInvoiceId ? obj.VendorInvoiceId : 0;
    this.VendorInvoiceNo = obj.VendorInvoiceNo ? obj.VendorInvoiceNo : '';
    this.VendorInvoiceDueDate = obj.VendorInvoiceDueDate ? obj.VendorInvoiceDueDate : '0000-00-00';


    this.Created = cDateTime.getDateTime();
    this.Modified = cDateTime.getDateTime();
    const TokenUserId = global.authuser.UserId ? global.authuser.UserId : 0;
    this.CreatedBy = (obj.authuser && obj.authuser.UserId) ? obj.authuser.UserId : TokenUserId;
    this.ModifiedBy = (obj.authuser && obj.authuser.UserId) ? obj.authuser.UserId : TokenUserId;

    const TokenGlobalIdentityId = global.authuser.IdentityId ? global.authuser.IdentityId : 0;
    this.IdentityId = (obj.authuser && obj.authuser.IdentityId) ? obj.authuser.IdentityId : TokenGlobalIdentityId;

    const TokenGlobalIdentityType = global.authuser.IdentityType ? global.authuser.IdentityType : 0;
    this.IdentityType = (obj.authuser && obj.authuser.IdentityType) ? obj.authuser.IdentityType : TokenGlobalIdentityType;

    const TokenIsRestrictedCustomerAccess = global.authuser.IsRestrictedCustomerAccess ? global.authuser.IsRestrictedCustomerAccess : 0;
    this.IsRestrictedCustomerAccess = (obj.authuser && obj.authuser.IsRestrictedCustomerAccess) ? obj.authuser.IsRestrictedCustomerAccess : TokenIsRestrictedCustomerAccess;

    const TokenMultipleCustomerIds = global.authuser.MultipleCustomerIds ? global.authuser.MultipleCustomerIds : 0;
    this.MultipleCustomerIds = (obj.authuser && obj.authuser.MultipleCustomerIds) ? obj.authuser.MultipleCustomerIds : TokenMultipleCustomerIds;

    const TokenMultipleAccessIdentityIds = global.authuser.MultipleAccessIdentityIds ? global.authuser.MultipleAccessIdentityIds : 0;
    this.MultipleAccessIdentityIds = (obj.authuser && obj.authuser.MultipleAccessIdentityIds) ? obj.authuser.MultipleAccessIdentityIds : TokenMultipleAccessIdentityIds;

    const TokenCreatedByLocation = global.authuser.Location ? global.authuser.Location : '';
    this.CreatedByLocation = (obj.authuser && obj.authuser.Location) ? obj.authuser.Location : TokenCreatedByLocation;

    // For Server Side Search 
    this.start = obj.start;
    this.length = obj.length;
    this.search = obj.search;
    this.sortCol = obj.sortCol;
    this.sortDir = obj.sortDir;
    this.sortColName = obj.sortColName;
    this.order = obj.order;
    this.columns = obj.columns;
    this.draw = obj.draw;
};

MROModel.UpdateMROStatusHistory = (Object, result) => {

    var MROCreated = Object.Created; var MROId = Object.MROId;
    async.parallel([
        function (result) { SalesOrderModel.IsExistSOForMRO(MROId, result); },
        function (result) { PurchaseOrderModel.IsExistPOForMRO(MROId, result); },
        function (result) { PurchaseOrderItem.StatusCondition(Object.SOId, MROId, result); },
        function (result) { con.query(MROStatusHistory.ViewMROStatusHistory(MROId), result); },
    ],
        function (err, results) {
            if (err)
                return result(err, null);
            else {
                var SOId = 0; var SOCreated = null; var POId = 0; var HistoryDate = null;
                var PartiallyReceived = false; var OrderFulfilled = false; var Completed = false;

                if (results[0].length > 0) {
                    SOId = results[0][0].SOId > 0 ? results[0][0].SOId : 0;
                    SOCreated = results[0][0].Created;
                }
                if (results[1].length > 0) {
                    POId = results[1][0].POId > 0 ? results[1][0].POId : 0;
                }

                if (results[2].length > 0 && results[2][0].AllSOQuantity == results[2][0].AllShipped && POId > 0) {
                    PartiallyReceived = true;
                    OrderFulfilled = true;
                    Completed = true;
                    HistoryDate = results[2][0].ShippedDate;
                }
                else if (results[2].length > 0 && results[2][0].AllPOQuantity == results[2][0].AllReceived && results[2][0].AllPOQuantity == results[2][0].AllSOQuantity && POId > 0) {
                    PartiallyReceived = true;
                    OrderFulfilled = true;
                    HistoryDate = results[2][0].ReceivedDate;
                }
                else if (results[2].length > 0 && results[2][0].AllReceived <= results[2][0].AllPOQuantity && results[2][0].AllReceived > 0 && POId > 0) {
                    PartiallyReceived = true;
                    HistoryDate = results[2][0].ReceivedDate;
                }

                var MROCreatedObj = new MROStatusHistory({
                    MROId: MROId,
                    HistoryStatus: Constants.CONST_MROS_GENERATED
                });
                MROCreated.Created = MROCreated;

                var MROCustomerQuoteReady = new MROStatusHistory({
                    MROId: MROId,
                    HistoryStatus: Constants.CONST_MROS_AWAIT_VQUOTE
                });
                MROCustomerQuoteReady.Created = MROCreated;

                var MROQuotedAwaitingCustomerPO = new MROStatusHistory({
                    MROId: MROId,
                    HistoryStatus: Constants.CONST_MROS_QUOTED_AWAITING_CUSTOMER_PO
                });
                MROQuotedAwaitingCustomerPO.Created = SOCreated;

                var MROApproved = new MROStatusHistory({
                    MROId: MROId,
                    HistoryStatus: Constants.CONST_MROS_APPROVED
                });
                MROApproved.Created = SOCreated;

                var MROPartiallyReceived = new MROStatusHistory({
                    MROId: MROId,
                    HistoryStatus: Constants.CONST_MROS_PARTIALLY_RECEIVED
                });
                MROPartiallyReceived.Created = HistoryDate;

                var MROOrderFulfilledbyvendor = new MROStatusHistory({
                    MROId: MROId,
                    HistoryStatus: Constants.CONST_MROS_FULFILLED_BY_VENDOR
                });
                MROOrderFulfilledbyvendor.Created = HistoryDate;

                var MROCompleted = new MROStatusHistory({
                    MROId: MROId,
                    HistoryStatus: Constants.CONST_MROS_COMPLETED
                });
                MROCompleted.Created = HistoryDate;

                var j = 0; var Status0 = false; var Status1 = false; var Status2 = false; var Status3 = false;
                var Status4 = false; var Status5 = false; var Status7 = false;
                for (j = 0; j < results[3][0].length; j++) {
                    if (results[3][0][j].HistoryStatus == 0) {
                        Status0 = true;
                    }
                    else if (results[3][0][j].HistoryStatus == 1) {
                        Status1 = true;
                    }
                    else if (results[3][0][j].HistoryStatus == 2) {
                        Status2 = true;
                    }
                    else if (results[3][0][j].HistoryStatus == 3) {
                        Status3 = true;
                    }
                    else if (results[3][0][j].HistoryStatus == 4) {
                        Status4 = true;
                    }
                    else if (results[3][0][j].HistoryStatus == 5) {
                        Status5 = true;
                    }
                    else if (results[3][0][j].HistoryStatus == 7) {
                        Status7 = true;
                    }
                }

                async.series([
                    function (result) {
                        if (!Status0) { MROStatusHistory.Create(MROCreatedObj, result); }
                        else { RR.emptyFunction(Object, result) }
                    },
                    function (result) {
                        if (!Status1) { MROStatusHistory.Create(MROCustomerQuoteReady, result); }
                        else { RR.emptyFunction(Object, result) }
                    },
                    function (result) {
                        if (SOId > 0 && !Status2) { MROStatusHistory.Create(MROQuotedAwaitingCustomerPO, result); }
                        else { RR.emptyFunction(Object, result) }
                    },
                    function (result) {
                        if (SOId > 0 && !Status3) { MROStatusHistory.Create(MROApproved, result); }
                        else { RR.emptyFunction(Object, result) }
                    },
                    function (result) {
                        if (PartiallyReceived && !Status4) { MROStatusHistory.Create(MROPartiallyReceived, result); }
                        else { RR.emptyFunction(Object, result) }
                    },
                    function (result) {
                        if (PartiallyReceived && OrderFulfilled && !Status5) { MROStatusHistory.Create(MROOrderFulfilledbyvendor, result); }
                        else { RR.emptyFunction(Object, result) }
                    },
                    function (result) {
                        if (PartiallyReceived && OrderFulfilled && Completed && !Status7) { MROStatusHistory.Create(MROCompleted, result); }
                        else { RR.emptyFunction(Object, result) }
                    },
                ],
                    function (err, results) {
                        if (err)
                            return result(err, null);
                        else {
                            return result(null, null);
                        }
                    });
            }
        });
};

MROModel.CreateMRO = (reqbody, result) => {
    var Obj = new MROModel(reqbody);

    var sql = `insert into tbl_mro(RRId,EcommerceOrderId,Notes,CustomerId,CustomerBillToId,CustomerShipToId,CustomerBlanketPOId,CustomerPONo,Status,Created,CreatedBy
        ) values(?,?,?,?,?,?,?,?,?,?,?)`;
    var values = [
        Obj.RRId, Obj.EcommerceOrderId, Obj.Notes, Obj.CustomerId, Obj.CustomerBillToId, Obj.CustomerShipToId,Obj.CustomerBlanketPOId,Obj.CustomerPONo, Obj.Status,
        Obj.Created, Obj.CreatedBy
    ];
    //console.log(sql, values)
    con.query(sql, values, (err, res) => {
        if (err) {
            console.log(err)
            return result(err, null);
        }
        return result(null, { id: res.insertId });
    });
};
MROModel.UpdateMRONo = (MROId, result) => {
    var sql = `UPDATE tbl_mro SET MRONo = CONCAT('MRO',?)  WHERE MROId = ?`;
    var values = [MROId, MROId];
    con.query(sql, values, (err, res) => {
        if (err) {
            result(null, err);
            return;
        }
        if (res.affectedRows == 0) {
            result({ kind: "not_found" }, null);
            return;
        }
        result(null, { id: MROId });
        return;
    }
    );
};

MROModel.UpdateMROByMROIdStep2 = (obj, result) => {
    var sql = ``;
    sql = `UPDATE tbl_mro SET Notes='${obj.Notes}',CustomerId='${obj.CustomerId}',CustomerBillToId='${obj.CustomerBillToId}',CustomerShipToId='${obj.CustomerShipToId}',
    Modified='${obj.Modified}',ModifiedBy='${obj.ModifiedBy}', CustomerPONo='${obj.CustomerPONo}' WHERE MROId = '${obj.MROId}' `;
    // console.log(sql + "================");
    con.query(sql, (err, res) => {
        if (err) {
            result(null, err);
            return;
        }
        if (res.affectedRows == 0) {
            result({ kind: "not_found" }, null);
            return;
        }
        result(null, { id: obj.MROId, ...obj });
        return;
    });
};
MROModel.viewquery = (MROId, reqBody) => {
    var IdentityType = getLogInIdentityType(reqBody);
    var IsRestrictedCustomerAccess = getLogInIsRestrictedCustomerAccess(reqBody);
    var MultipleCustomerIds = getLogInMultipleCustomerIds(reqBody);

    var sql = `Select rr.RRNo,mro.*,c.CompanyName,c.PriorityNotes, V.VendorName,V.VendorCode,V.IsAllowQuoteBeforeShip,
CASE mro.Status 
WHEN 0 THEN '${Constants.array_mro_status[0]}'
WHEN 1 THEN '${Constants.array_mro_status[1]}'
WHEN 2 THEN '${Constants.array_mro_status[2]}'
WHEN 3 THEN '${Constants.array_mro_status[3]}'
WHEN 4 THEN '${Constants.array_mro_status[4]}'
WHEN 5 THEN '${Constants.array_mro_status[5]}'
WHEN 6 THEN '${Constants.array_mro_status[6]}'
WHEN 7 THEN '${Constants.array_mro_status[7]}'
ELSE '-' end StatusName,mro.IsActive,
ab1.StreetAddress as ShipToStreetAddress,
ab1.SuiteOrApt as ShipToSuiteOrApt,ab1.City as ShipToCity,
s1.StateName as ShipToState,c1.CountryName as ShipToCountry,
ab1.Zip as ShipToZip,ab1.Email as ShipToEmail,
ab1.PhoneNoPrimary as ShipToPhoneNoPrimary,mro.CreatedByLocation,mroc.CountryName as CreatedByLocationName,

ab2.StreetAddress as BillToStreetAddress,
ab2.SuiteOrApt as BillToSuiteOrApt,ab2.City as BillToCity,
s2.StateName as BillToState,c2.CountryName as BillToCountry,
ab2.Zip as BillToZip,ab2.Email as BillToEmail,SO.CustomerPONo,SO.CustomerBlanketPOId,vi.VendorInvNo,vi.ReferenceNo,
ab2.PhoneNoPrimary as BillToPhoneNoPrimary,
CASE PO.Status WHEN '${Constants.CONST_PO_STATUS_APPROVED}' THEN 1 Else 0 END IsPoApproved,PO.GrandTotal POAmount,
CASE SO.Status WHEN '${Constants.CONST_SO_STATUS_APPROVED}' THEN 1 Else 0 END IsSOApproved ,
CASE i.Status WHEN '${Constants.CONST_INV_STATUS_APPROVED}' THEN 1 Else 0  END IsInvoiceApproved,
CASE vi.Status WHEN '${Constants.CONST_VENDOR_INV_STATUS_APPROVED}' THEN 1 Else 0 END IsVendorBillApproved

from tbl_mro as mro
LEFT JOIN tbl_po as PO ON PO.POId = mro.VendorPOId AND  PO.IsDeleted = 0 
LEFT JOIN tbl_sales_order as SO ON SO.SOId = mro.CustomerSOId AND  SO.IsDeleted = 0 
LEFT JOIN tbl_invoice as i ON i.InvoiceId = mro.CustomerInvoiceId and i.IsDeleted = 0 
LEFT JOIN tbl_vendor_invoice as vi ON vi.VendorInvoiceId = mro.VendorInvoiceId AND  vi.IsDeleted = 0 


LEFT JOIN tbl_vendors as V ON V.VendorId = mro.VendorId
LEFT JOIN tbl_customers as c ON c.CustomerId = mro.CustomerId
LEFT JOIN tbl_address_book ab1 on ab1.AddressId=mro.CustomerShipToId
LEFT JOIN tbl_countries c1 on c1.CountryId=ab1.CountryId
LEFT JOIN tbl_states s1 on s1.StateId=ab1.StateId
LEFT JOIN tbl_address_book ab2 on ab2.AddressId=mro.CustomerBillToId
LEFT JOIN tbl_countries c2 on c2.CountryId=ab2.CountryId
LEFT JOIN tbl_states s2 on s2.StateId=ab2.StateId
LEFT JOIN tbl_repair_request as rr ON rr.RRId = mro.RRId
LEFT JOIN tbl_countries mroc on mroc.CountryId=mro.CreatedByLocation
where mro.IsDeleted=0 and mro.MROId=${MROId} `;
    if (IdentityType == 0 && IsRestrictedCustomerAccess == 1 && MultipleCustomerIds != "") {
        sql += ` and mro.CustomerId in(${MultipleCustomerIds}) `;
    }
    // console.log("sql=" + sql)
    return sql;
};
MROModel.findById = (MROId, reqBody, result) => {

    var sqlMRO = MROModel.viewquery(MROId, reqBody);
    con.query(sqlMRO, (err, res) => {
        if (err)
            return result(err, null);

        if (res.length > 0) {

            let CustomerId = res[0].CustomerId;
            var sqlMRO = MROModel.viewquery(MROId, reqBody);
            var sqlQuotes = QuotesModel.viewQuoteByMRO(MROId, reqBody);
            var sqlQuotesItem = QuotesItemModel.viewQuoteItemByMRO(MROId);
            var sqlMRONotes = RRNotes.ViewNotes(Constants.CONST_IDENTITY_TYPE_MRO, MROId);
            var sqlMROAttachment = AttachmentModel.ListAttachmentQuery(Constants.CONST_IDENTITY_TYPE_MRO, MROId);
            var sqlMROVendor = MROVendor.ViewMROVendors(MROId);
            var sqlApprovedQuote = QuotesModel.GetMROApprovedQuoteQuery(MROId);
            var sqlApprovedQuotesItem = QuotesItemModel.GetMROApprovedQuoteItemQuery(MROId);
            //  const RRShippingHistoryModel = require("../models/repair.request.shipping.history.model.js");
            var MROShippingHistorylistquery = MROShippingHistoryModel.MROShippingHistorylistquery(MROId);
            var MROReceivingHistorylistquery = MROShippingHistoryModel.MROReceivingHistorylistquery(MROId);
            var sqlMROFollowUp = FollowUp.ViewMROFollowUp(MROId);
            var sqlMROVendorPart = MROVendorPart.ViewVendorParts(MROId);
            var sqlCustomerAddressList = AddressModel.listquery(Constants.CONST_IDENTITY_TYPE_CUSTOMER, CustomerId, 0);
            // var sqlMROCustomerRef = RRCustomerRef.ViewMROCustomerReference(MROId);
            var sqlSOView = SalesOrder.view(res[0].CustomerSOId, 0, 0,reqBody);
            var sqlSOItem = SalesOrderItem.ViewByMROIdAndSOId(res[0].CustomerSOId, MROId);

            var sqlPOView = PurchaseOrder.ViewByMRO(MROId);
            var sqlPOItem = PurchaseOrderItem.ViewByMRO(MROId);

            var POShippingHistoryList = MROShippingHistoryModel.POShippingHistoryList(MROId);
            var SOShippingHistoryList = MROShippingHistoryModel.SOShippingHistoryList(res[0].CustomerSOId);
            var VendorBillDetails = PurchaseOrder.VendorBillDetails(MROId);
            var CustomerInvoiceDetails = SalesOrder.CustomerInvoiceDetails(MROId);
            var ViewMROStatusHistory = MROStatusHistory.ViewMROStatusHistory(MROId);
            // sqlSOItem = "SELECT * FROM tbl_mro WHERE MROId = 10040";

            async.parallel([
                function (result) { con.query(sqlMRO, result) },
                function (result) { con.query(sqlQuotes, result) },
                function (result) { con.query(sqlQuotesItem, result) },
                function (result) { con.query(sqlMRONotes, result) },
                function (result) { con.query(sqlMROAttachment, result) },
                function (result) { con.query(sqlMROVendor, result) },
                function (result) { con.query(sqlApprovedQuote, result) },
                function (result) { con.query(sqlApprovedQuotesItem, result) },
                function (result) { con.query(MROShippingHistorylistquery, result) },
                function (result) { con.query(sqlMROFollowUp, result) },
                function (result) { con.query(sqlMROVendorPart, result) },
                function (result) { con.query(sqlCustomerAddressList, result) },
                function (result) { con.query(sqlSOView, result) },
                function (result) { con.query(sqlSOItem, result) },
                function (result) { con.query(sqlPOView, result) },
                function (result) { con.query(sqlPOItem, result) },

                function (result) { con.query(POShippingHistoryList, result) },
                function (result) { con.query(SOShippingHistoryList, result) },
                function (result) { con.query(VendorBillDetails, result) },

                function (result) { con.query(MROReceivingHistorylistquery, result) },
                function (result) { con.query(CustomerInvoiceDetails, result) },
                function (result) { con.query(ViewMROStatusHistory, result) },
            ],
                function (err, results) {
                    if (err) return result(err, null);
                    return result(null, {
                        MROInfo: results[0][0],
                        Quote: results[1][0],
                        QuoteItem: results[2][0],
                        MRONote: results[3][0],
                        MROAttachment: results[4][0],
                        MROVendor: results[5][0],
                        MROApprovedQuote: results[6][0],
                        MROApprovedQuoteItem: results[7][0],
                        MROShippingHistorylist: results[8][0],
                        MROFollowUp: results[9][0],
                        MROVendorPart: results[10][0],
                        CustomerAddressList: results[11][0],
                        SalesOrder: results[12][0],
                        SalesOrderItem: results[13][0],
                        PurchaseOrder: results[14][0],
                        PurchaseOrderItem: results[15][0],
                        POShippingHistoryList: results[16][0],
                        SOShippingHistoryList: results[17][0],
                        VendorBillDetails: results[18][0],
                        MROReceivingHistorylist: results[19][0],
                        CustomerInvoiceDetails: results[20][0],
                        MROStatusHistory: results[21][0]
                    });
                });
        } else {
            result({ msg: "MRO not found" }, null);
            return;
        }
    })
};
//
MROModel.MROListByServerSide = (obj, result) => {

    var selectquery = `SELECT DISTINCT mro.MROId,s.SOId,s.SONo,s.CustomerPONo,
MRONo,mro.Description,rr.RRNo,mro.RRId,mro.EcommerceOrderId,
c.CompanyName,mro.CustomerId,mro.VendorId,v.VendorName ,DATE_FORMAT(mro.Created,'%m/%d/%Y') as Created,mro.CreatedByLocation,
CASE mro.Status 
WHEN 0 THEN '${Constants.array_mro_status[0]}'
WHEN 1 THEN '${Constants.array_mro_status[1]}'
WHEN 2 THEN '${Constants.array_mro_status[2]}'
WHEN 3 THEN '${Constants.array_mro_status[3]}'
WHEN 4 THEN '${Constants.array_mro_status[4]}'
ELSE '-'	end StatusName,mro.Status,s.CustomerBlanketPOId, '' as PartId, '' as PartNo, c.CustomerGroupId `;
    var recordfilterquery = `Select count(mro.MROId) as recordsFiltered 
    FROM tbl_mro mro
LEFT JOIN tbl_sales_order s on s.SOId=mro.CustomerSOId 
LEFT JOIN tbl_customers c on c.CustomerId=mro.CustomerId
LEFT JOIN tbl_vendors v on v.VendorId=mro.VendorId
LEFT JOIN tbl_repair_request rr on rr.RRId=mro.RRId
where mro.IsDeleted=0`;
    var query = ` FROM tbl_mro mro
LEFT JOIN tbl_sales_order s on s.SOId=mro.CustomerSOId
Left Join tbl_quotes q on q.MROId=mro.MROId AND q.IsDeleted = 0 
Left Join tbl_quotes_item qi on qi.QuoteId=q.QuoteId AND qi.IsDeleted=0
LEFT JOIN tbl_customers c on c.CustomerId=mro.CustomerId
LEFT JOIN tbl_vendors v on v.VendorId=mro.VendorId
LEFT JOIN tbl_repair_request rr on rr.RRId=mro.RRId
where mro.IsDeleted=0 `;
    // Left Join tbl_sales_order_item si on si.SOId=s.SOId AND si.IsDeleted = 0 
    // Left Join tbl_parts p on p.partId=si.partId AND p.IsDeleted=0
    if (obj.IdentityType == 0 && obj.IsRestrictedCustomerAccess == 1 && obj.MultipleCustomerIds != "") {
        query += ` and mro.CustomerId in(${obj.MultipleCustomerIds}) `;
    }
    if (obj.search.value != '') {

        query = query + ` and (  mro.MRONo LIKE '%${obj.search.value}%'
        or mro.Description LIKE '%${obj.search.value}%'
        or c.CompanyName LIKE '%${obj.search.value}%' 
        or mro.Status LIKE '%${obj.search.value}%'
        or mro.Created LIKE '%${obj.search.value}%' 
        or v.VendorName LIKE '%${obj.search.value}%'
        or s.CustomerBlanketPOId LIKE '%${obj.search.value}%'
        or s.CustomerPONo LIKE '%${obj.search.value}%'
        or qi.PartNo LIKE '%${obj.search.value}%'
      ) `;
    }
    var cvalue = 0;
    for (cvalue = 0; cvalue < obj.columns.length; cvalue++) {
        if (obj.columns[cvalue].search.value != "") {
            switch (obj.columns[cvalue].name) {
                case "MRONo":
                    query += " and mro.MRONo = '" + obj.columns[cvalue].search.value + "' ";
                    break;
                case "RRId":
                    query += " and mro.RRId = '" + obj.columns[cvalue].search.value + "' ";
                    break;
                case "CustomerId":
                    query += " and  mro.CustomerId In(" + obj.columns[cvalue].search.value + ") ";
                    break;
                case "Status":
                    query += " and ( mro.Status = '" + obj.columns[cvalue].search.value + "' ) ";
                    break;
                case "VendorId":
                    query += " and ( mro.VendorId = '" + obj.columns[cvalue].search.value + "' ) ";
                    break;
                case "CreatedByLocation":
                    query += " and ( mro.CreatedByLocation = '" + obj.columns[cvalue].search.value + "' ) ";
                    break;
                case "CustomerPONo":
                    query += " and ( s.CustomerPONo = '" + obj.columns[cvalue].search.value + "' ) ";
                    break;
                case "CustomerBlanketPOId":
                    query += " and ( s.CustomerBlanketPOId = '" + obj.columns[cvalue].search.value + "' ) ";
                    break;
                case "PartId":
                    query += " and ( qi.PartId = '" + obj.columns[cvalue].search.value + "' ) ";
                    break;
                case "PartNo":
                    query += " and ( qi.PartNo LIKE '%" + obj.columns[cvalue].search.value + "%' ) ";
                    break;
                case "Created":
                    query += " and ( DATE(mro.Created) ='" + obj.columns[cvalue].search.value + "' ) ";
                    break;
                case "CustomerGroupId":
                    query += " and (mro.CustomerId IN(SELECT CustomerId FROM tbl_customers  WHERE " + obj.columns[cvalue].name + " IN (" + obj.columns[cvalue].search.value + "))) ";
                    break;
                default:
                    query += " and ( " + obj.columns[cvalue].name + " LIKE '%" + obj.columns[cvalue].search.value + "%' ) ";
            }
        }
    }
    var i = 0;
    if (obj.order.length > 0) {
        query += " ORDER BY ";
    }
    for (i = 0; i < obj.order.length; i++) {

        if (obj.order[i].column != "" || obj.order[i].column == "0")// 0 is equal to ""
        {
            switch (obj.columns[obj.order[i].column].name) {

                case "MRONo":
                    query += " mro.MRONo " + obj.order[i].dir + " ";
                    break;
                case "Description":
                    query += " mro.Description " + obj.order[i].dir + " ";
                    break;
                case "CustomerId":
                    query += " mro.CustomerId " + obj.order[i].dir + " ";
                    break;
                case "Status":
                    query += " mro.Status " + obj.order[i].dir + " ";
                    break;
                case "Created":
                    query += " mro.Created " + obj.order[i].dir + " ";
                    break;
                case "VendorId":
                    query += " mro.VendorId " + obj.order[i].dir + " ";
                    break;
                default:
                    query += " " + obj.columns[obj.order[i].column].name + " " + obj.order[i].dir + " ";
            }
        }
    }
    var Countquery = selectquery + query;
    if (obj.start != "-1" && obj.length != "-1") {
        query += " LIMIT " + obj.start + "," + (obj.length);
    }
    query = selectquery + query;
    var TotalCountQuery = `SELECT Count(mro.MROId) as TotalCount 
    FROM tbl_mro mro
    LEFT JOIN tbl_sales_order s on s.SOId=mro.CustomerSOId
    LEFT JOIN tbl_customers c on c.CustomerId=mro.CustomerId
    LEFT JOIN tbl_vendors v on v.VendorId=mro.VendorId
    LEFT JOIN tbl_repair_request rr on rr.RRId=mro.RRId
    where mro.IsDeleted=0 `;

    if (obj.IdentityType == 0 && obj.IsRestrictedCustomerAccess == 1 && obj.MultipleCustomerIds != "") {
        TotalCountQuery += ` and mro.CustomerId in(${obj.MultipleCustomerIds}) `;
    }
    //console.log("query = " + query);
    //console.log("Countquery = " + Countquery);
    // recordsFiltered: results[1][0][0].recordsFiltered
    async.parallel([
        function (result) { con.query(query, result) },
        function (result) { con.query(Countquery, result) },
        function (result) { con.query(TotalCountQuery, result) }
    ],
        function (err, results) {
            if (err)
                return result(err, null);

            result(null, {
                data: results[0][0], recordsFiltered: results[1][0].length,
                recordsTotal: results[2][0][0].TotalCount, draw: obj.draw
            });
            return;
        }
    );

};

MROModel.SelectAllMRO = (obj) => {
    var sql = `Select MROId,CustomerSOId SOId,Date_Format(Created,'%Y-%m-%d') Created
from tbl_mro
 where IsDeleted=0 order by MROId desc  `;
    // console.log(sql)
    return sql;
};

MROModel.SelectMROStatusWithSettings = (MROId) => {
    var sql = `Select MROId,Status, G.AHGroupVendor,G.AHCommissionPercent,G.TaxPercent 
                from tbl_mro as M
                LEFT JOIN tbl_settings_general as G ON G.SettingsId = 1
                where M.IsDeleted=0 and MROId=${MROId}`;
    return sql;
};

MROModel.SelectSettingsInfo = () => {
    var sql = `Select AHGroupVendor,AHCommissionPercent,TaxPercent 
                from tbl_settings_general where IsDeleted=0 `;
    return sql;
};
MROModel.SelectMROStatus = (RRId) => {
    var sql = `Select Status from tbl_mro  where IsDeleted=0 and MROId=${RRId}`;
    return sql;
};


MROModel.UpdateMROStatusApproved = (MROId, result) => {
    var sql = `UPDATE tbl_mro SET Status=${Constants.CONST_MROS_APPROVED}  WHERE MROId = ${MROId}`;
    con.query(sql, (err, res) => {
        if (err) {
            result(err, null);
            return;
        }
        result(null, res);
    });
};

MROModel.UpdateMROStatusById = (MROId, Status, result) => {
    var sql = `UPDATE tbl_mro SET Status=${Status}  WHERE MROId = ${MROId}`;
    con.query(sql, (err, res) => {
        if (err) {
            result(err, null);
            return;
        }
        result(null, res);
    });
};



MROModel.UpdateVendorOfRequestByMROId = (Obj, result) => {
    var sql = `UPDATE tbl_mro  SET VendorId=?, RRVendorId = ?  WHERE MROId = ?`;
    var values = [Obj.VendorId, Obj.RRVendorId, Obj.MROId];
    //  console.log("UpdateVendorOfRequestByMROId=" + values)
    con.query(sql, values, (err, res) => {
        if (err) {
            result(null, err);
            return;
        }
        result(null, { id: Obj.MROId, ...Obj });
        return;
    }
    );
};

MROModel.ChangeMROStatus = (Obj, result) => {
    var sql = `UPDATE tbl_mro SET Status=?,RejectedStatusType=?,Modified=?,ModifiedBy=?  WHERE MROId = ?`;
    var values = [Obj.Status, Obj.RejectedStatusType, Obj.Modified, Obj.ModifiedBy, Obj.MROId];
    //console.log("ChangeMROStatus=" + values)
    con.query(sql, values, (err, res) => {
        if (err) {
            result(null, err);
            return;
        }
        if (res.affectedRows == 0) {
            result({ msg: "Status Not updated" }, null);
            return;
        }
        result(null, { Status: Obj.Status });
        return;
    });
};
//
MROModel.UpdateMROCustomerBillShipQuery = (objModel) => {
    var Obj = new MROModel({
        MROId: objModel.MROId,
        CustomerShipToId: objModel.CustomerShipToId,
        CustomerBillToId: objModel.CustomerBillToId
    });
    var sql = `UPDATE tbl_mro SET CustomerShipToId=${Obj.CustomerShipToId},CustomerBillToId=${Obj.CustomerBillToId} ,Modified='${Obj.Modified}',ModifiedBy='${Obj.ModifiedBy}' WHERE MROId=${Obj.MROId}`;
    //console.log(sql);
    return sql;
};
MROModel.UpdateCustomerSONoByMROId = (Obj, LeadTime) => {
    var sql = `UPDATE tbl_mro SET CustomerSONo='${Obj.CustomerSONo}',CustomerSOId='${Obj.CustomerSOId}', CustomerSODueDate = DATE_ADD(CURDATE(), INTERVAL ${LeadTime} +
    (SELECT 
        COUNT(*) AS total
        FROM 
        (   SELECT ADDDATE(CURDATE(), INTERVAL @i:=@i+1 DAY) AS DAY
            FROM (
                SELECT a.a
                FROM (SELECT 0 AS a UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9) AS a
                CROSS JOIN (SELECT 0 AS a UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9) AS b
                CROSS JOIN (SELECT 0 AS a UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9) AS c
            ) a
            JOIN (SELECT @i := -1) r1
            WHERE 
            @i < DATEDIFF(DATE_ADD(CURDATE(), INTERVAL ${LeadTime} DAY), CURDATE())
        
        ) AS dateTable
        WHERE WEEKDAY(dateTable.Day) IN (5,6))
     DAY) ,Modified='${Obj.Modified}',ModifiedBy='${Obj.ModifiedBy}'   WHERE MROId=${Obj.MROId}`;
    // console.log(sql);
    return sql;
};
MROModel.UpdateSODueDateByMRO = (Obj, DueDate) => {
    var sql = `UPDATE tbl_mro SET CustomerSONo='${Obj.CustomerSONo}',CustomerSOId='${Obj.CustomerSOId}', CustomerSODueDate = '${DueDate}' ,Modified='${Obj.Modified}',ModifiedBy='${Obj.ModifiedBy}' WHERE MROId=${Obj.MROId}`;
    // console.log(sql);
    return sql;
};
MROModel.UpdateVendorPONoByMROId = (Obj, LeadTime) => {
    var sql = `UPDATE tbl_mro SET VendorPONo='${Obj.VendorPONo}',VendorPOId='${Obj.VendorPOId}', VendorPODueDate = DATE_ADD(CURDATE(), INTERVAL ${LeadTime} +
    (SELECT 
        COUNT(*) AS total
        FROM 
        (   SELECT ADDDATE(CURDATE(), INTERVAL @i:=@i+1 DAY) AS DAY
            FROM (
                SELECT a.a
                FROM (SELECT 0 AS a UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9) AS a
                CROSS JOIN (SELECT 0 AS a UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9) AS b
                CROSS JOIN (SELECT 0 AS a UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9) AS c
            ) a
            JOIN (SELECT @i := -1) r1
            WHERE 
            @i < DATEDIFF(DATE_ADD(CURDATE(), INTERVAL ${LeadTime} DAY), CURDATE())
        
        ) AS dateTable
        WHERE WEEKDAY(dateTable.Day) IN (5,6))
     DAY), Modified='${Obj.Modified}',ModifiedBy='${Obj.ModifiedBy}'    WHERE MROId=${Obj.MROId}`;
    // console.log(sql);
    return sql;
};

MROModel.UpdateCustomerInvoiceNoByMROId = (Obj, TermsDays) => {
    var sql = `UPDATE tbl_mro SET CustomerInvoiceNo='${Obj.CustomerInvoiceNo}',CustomerInvoiceId='${Obj.CustomerInvoiceId}', CustomerInvoiceDueDate = DATE_ADD(CURDATE(), INTERVAL ${TermsDays} DAY) ,Modified='${Obj.Modified}',ModifiedBy='${Obj.ModifiedBy}'   WHERE MROId=${Obj.MROId}`;
    // console.log(sql);
    return sql;
};

MROModel.UpdatePriceQuery = (obj) => {
    var sql = `Update tbl_mro SET Price = '${obj.GrandTotal}' WHERE IsDeleted=0 and MROId='${obj.MROId}' `;
    //console.log(sql);
    return sql;
};


MROModel.complete = (reqBody, result) => {
    if (reqBody.hasOwnProperty('MROId')) {

        const Obj = new MROModel({
            MROId: reqBody.MROId,
            Status: Constants.CONST_MROS_COMPLETED
        });
        // var RRStatusHistoryObj = new RRStatusHistory({
        //     RRId: reqBody.RRId,
        //     HistoryStatus: Constants.CONST_RRS_COMPLETED
        // });
        //To add a RR status to notification table
        // var NotificationObj = new NotificationModel({
        //     RRId: reqBody.RRId,
        //     NotificationIdentityType: Constants.CONST_IDENTITY_TYPE_RR,
        //     NotificationIdentityId: reqBody.RRId,
        //     NotificationIdentityNo: 'RR' + reqBody.RRId,
        //     ShortDesc: 'RR Completed',
        //     Description: 'RR Completed  by Admin (' + global.authuser.FullName + ') on ' + cDateTime.getDateTime()
        // });


        async.parallel([
            function (result) { MROModel.ChangeMROStatus(Obj, result); },
            // function (result) { RRStatusHistory.Create(RRStatusHistoryObj, result); },
            //  function (result) { NotificationModel.Create(NotificationObj, result); }
        ],
            function (err, results) {
                if (err) { result(err, null); }
                result(null, { dataP: results[0][0], ...reqBody });
                return;
            }
        );
    } else {
        result({ msg: "MRO not found" }, null);
        return;
    }
};
MROModel.InfoForinvoiceDataquery = (MROId) => {
    var sql = `Select
  mro.MROId,V.VendorName, mro.CustomerId, C.CompanyName,
  S.GrandTotal as CustomerInvoiceAmount,i.InvoiceId,i.InvoiceNo
 from tbl_mro as mro
 LEFT JOIN tbl_vendors as V ON V.VendorId = mro.VendorId
 LEFT JOIN tbl_customers as C ON C.CustomerId = mro.CustomerId
 LEFT JOIN tbl_sales_order as S ON S.SOId = mro.CustomerSOId
 LEFT JOIN tbl_invoice as i ON i.MROId = mro.MROId
 where mro.IsDeleted=0 and mro.MROId=${MROId}`;
    return sql;
};
MROModel.UpdateVendorInvoiceNoByMROId = (Obj, TermsDays) => {
    var sql = `UPDATE tbl_mro SET VendorInvoiceId='${Obj.VendorInvoiceId}',VendorInvoiceNo='${Obj.VendorInvoiceNo}', VendorInvoiceDueDate = DATE_ADD(CURDATE(), INTERVAL ${TermsDays} DAY), Modified='${Obj.Modified}',ModifiedBy='${Obj.ModifiedBy}' WHERE MROId=${Obj.MROId} `;
    // console.log(sql);
    return sql;
};

MROModel.ActiveInActiveMRO = (reqbody, result) => {
    var Obj = new MROModel(reqbody);
    var sql = `Update tbl_mro set IsActive=${Obj.IsActive},Modified='${Obj.Modified}',ModifiedBy='${Obj.ModifiedBy}'    where IsDeleted=0 and MROId=${Obj.MROId} `
    //console.log(sql);
    con.query(sql, (err, res) => {
        if (err) {
            return result(err, null);
        }
        result(null, res);
        return;
    });
}

MROModel.RejectMRO = (reqbody, result) => {
    var Obj = new MROModel(reqbody);
    var sql = `SELECT MRO.MROId,I.InvoiceId, VI.VendorInvoiceId 
    FROM tbl_mro as MRO
    LEFT JOIN tbl_invoice as I ON I.MROId = MRO.MROId AND I.IsDeleted = 0 AND  I.IsCSVProcessed = 1
    LEFT JOIN tbl_vendor_invoice as VI ON VI.MROId = MRO.MROId AND VI.IsDeleted = 0  AND  VI.IsCSVProcessed = 1
    WHERE MRO.ISDeleted = 0 AND MRO.MROId =${Obj.MROId} `;
    con.query(sql, (err, res) => {
        if (err) {
            result(null, err);
            return;
        }
        if (res.length > 0 && (res[0].InvoiceId > 0 || res[0].VendorInvoiceId > 0)) {
            return result({ msg: "Vendor Invoice / Customer Invocie is already approved. We cannot reject this MRO. Please contact admin." }, null);
        } else {
            const MROObj = new MROModel({
                MROId: Obj.MROId,
                Status: Constants.CONST_MROS_REJECTED,
                RejectedStatusType: Obj.RejectedStatus
            });

            var MROStatusHistoryObj = new MROStatusHistory({
                MROId: Obj.MROId,
                HistoryStatus: Constants.CONST_MROS_REJECTED
            });

            var so_sql = `UPDATE tbl_sales_order SET Status='${Constants.CONST_SO_STATUS_CANCELLED}', Modified='${Obj.Modified}', ModifiedBy='${Obj.ModifiedBy}' WHERE  isDeleted = 0 AND  MROId =  ${Obj.MROId} `;
            var po_sql = `UPDATE tbl_po SET Status='${Constants.CONST_PO_STATUS_CANCELLED}', Modified='${Obj.Modified}', ModifiedBy='${Obj.ModifiedBy}' WHERE  isDeleted = 0 AND MROId =  ${Obj.MROId} `;
            var invoice_sql = `UPDATE tbl_invoice SET Status='${Constants.CONST_INV_STATUS_CANCELLED}', Modified='${Obj.Modified}', ModifiedBy='${Obj.ModifiedBy}' WHERE isDeleted = 0 AND  MROId =  ${Obj.MROId}  `;
            var vinvoice_sql = `UPDATE tbl_vendor_invoice SET Status='${Constants.CONST_VENDOR_INV_STATUS_CANCELLED}', Modified='${Obj.Modified}', ModifiedBy='${Obj.ModifiedBy}' WHERE isDeleted = 0 AND  MROId =  ${Obj.MROId}  `;

            // console.log(so_sql);
            // console.log(po_sql);
            // console.log(invoice_sql);
            async.parallel([
                function (result) { MROModel.ChangeMROStatus(MROObj, result); },
                function (result) { con.query(so_sql, result) },
                function (result) { con.query(po_sql, result) },
                function (result) { con.query(invoice_sql, result) },
                function (result) { con.query(vinvoice_sql, result) },
                function (result) { MROStatusHistory.Create(MROStatusHistoryObj, result); },
                function (result) { MROModel.onRejectAddQuantityInShopParts(Obj.MROId, result); },
            ],
                function (err, results) {
                    // console.log(results);
                    if (err)
                        return result(err, null);
                    if (results[0][0]) {
                        result(null, results[0][0]);
                    } else {
                        return result(null, null);
                    }
                }
            );
        }
    }
    );
};

MROModel.onRejectAddQuantityInShopParts = (MROId, result) => {
    var Query = `SELECT mro.MROId,eoi.PartId,eoi.ShopPartItemId,eoi.Quantity,so.SOId,soi.SOItemId FROM tbl_mro as mro
    LEFT JOIN tbl_sales_order as so ON so.MROId=mro.MROId AND so.IsDeleted = 0
    INNER JOIN tbl_sales_order_item as soi ON soi.SOId=so.SOId AND soi.IsDeleted = 0
    LEFT JOIN tbl_ecommerce_order_item as eoi ON eoi.EcommerceOrderItemId=soi.EcommerceOrderItemId AND eoi.IsDeleted = 0
    WHERE mro.MROId=${MROId} AND mro.IsDeleted=0`;
    con.query(Query, (err, res) => {
        res.forEach(element => {
            Parts.updateQuantity(element, (err1, data) => {
                
            });
        });
    return result(null, res);
    });
}

MROModel.ResetApprovedQuoteSOPOInvoice = (Body, result) => {
    var Obj = new MROModel(Body);
    var quote_sql = `UPDATE tbl_quotes SET Status='${Constants.CONST_QUOTE_STATUS_CANCELLED}',QuoteCustomerStatus='${Constants.CONST_CUSTOMER_QUOTE_CANCELLED}', Modified='${Obj.Modified}', ModifiedBy='${Obj.ModifiedBy}' WHERE isDeleted = 0 AND  Status = ${Constants.CONST_CUSTOMER_QUOTE_ACCEPTED}  AND MROId =  ${Obj.MROId} AND  RRVendorId = ${Obj.RRVendorId}`;
    var so_sql = `UPDATE tbl_sales_order SET Status='${Constants.CONST_SO_STATUS_CANCELLED}', Modified='${Obj.Modified}', ModifiedBy='${Obj.ModifiedBy}' WHERE  isDeleted = 0 AND  MROId =  ${Obj.MROId} `;
    var po_sql = `UPDATE tbl_po SET Status='${Constants.CONST_PO_STATUS_CANCELLED}', Modified='${Obj.Modified}', ModifiedBy='${Obj.ModifiedBy}' WHERE  isDeleted = 0 AND MROId =  ${Obj.MROId} `;
    var invoice_sql = `UPDATE tbl_invoice SET Status='${Constants.CONST_INV_STATUS_CANCELLED}', Modified='${Obj.Modified}', ModifiedBy='${Obj.ModifiedBy}' WHERE isDeleted = 0 AND  MROId =  ${Obj.MROId}  `;
    // console.log(quote_sql);
    //console.log(so_sql);
    //console.log(po_sql);
    // console.log(invoice_sql);
    async.parallel([
        function (result) { con.query(quote_sql, result) },
        function (result) { con.query(so_sql, result) },
        function (result) { con.query(po_sql, result) },
        function (result) { con.query(invoice_sql, result) }
    ],
        function (err, results) {
            if (err)
                return result(err, null);
            if (results[0][0]) {
                result(null, results[0][0]);
                return;
            } else {
                return result(null, null);
            }
        }
    );

};

MROModel.ResetMROVendor = (MROId, result) => {
    var Obj = new MROModel({
        MROId: MROId
    });
    var sql = ` UPDATE tbl_mro  SET RRVendorId=0, VendorId=0,CustomerSOId=0,CustomerSONo='',CustomerSODueDate=null,CustomerPONo='',
  VendorPOId=0,VendorPONo='',VendorPODueDate=null,VendorInvoiceId=0,VendorInvoiceNo='',VendorInvoiceDueDate=null,
  CustomerInvoiceId=0,CustomerInvoiceNo='',CustomerInvoiceDueDate=null,Modified='${Obj.Modified}',ModifiedBy=${Obj.ModifiedBy}
  WHERE MROId =${Obj.MROId} `;
    //  console.log("ResetMROVendor=" + sql);
    con.query(sql, (err, res) => {
        if (err) {
            result(null, err);
            return;
        }
        result(null, { Status: Obj.Status });
        return;
    }
    );
};
//UpdatePartCurrentLocation
MROModel.UpdatePartCurrentLocation = (obj, result) => {
    var sql = ` UPDATE tbl_mro SET ShippingStatus = ?, ShippingIdentityType = ?,
  ShippingIdentityId=?,ShippingIdentityName =?,ShippingAddressId =? WHERE MROId = ? `;
    var values = [obj.ShippingStatus, obj.ShippingIdentityType, obj.ShippingIdentityId,
    obj.ShippingIdentityName, obj.ShippingAddressId, obj.MROId]
    //console.log("values=" + values)
    con.query(sql, values, (err, res) => {
        if (err) {
            return result(null, err);
        }
        if (res.affectedRows == 0) {
            return result({ kind: "MROId_not_found" }, null);
        }
        result(null, { id: obj.RRId, ...obj });
    });
};
MROModel.UpdateCustomerSONoandCustomerSODueDatebyMROId = (obj, result) => {
    var val = new MROModel(obj);
    var sql = `UPDATE tbl_mro  SET CustomerSONo='${val.CustomerSONo}',CustomerSODueDate='${val.CustomerSODueDate}'  WHERE MROId ='${val.MROId}'`;
    // console.log(sql);
    con.query(sql, (err, res) => {
        if (err) {
            result(null, err);
            return;
        }
        result(null, { CustomerSONo: obj.CustomerSONo });
        return;
    }
    );
};

MROModel.UpdateCustomerPONoandVendorPODueDatebyMROId = (MRO, result) => {
    var Obj = new MROModel(MRO);
    var sql = `UPDATE tbl_mro  SET CustomerPONo='${Obj.CustomerPONo}',VendorPODueDate='${Obj.VendorPODueDate}'  WHERE MROId ='${Obj.MROId}'`;
    // console.log(sql);
    con.query(sql, (err, res) => {
        if (err) {
            result(null, err);
            return;
        }
        result(null, { CustomerPONo: Obj.CustomerPONo });
        return;
    }
    );
};


MROModel.UpdateCustomerInvoiceNoandCustomerInvoiceDueDatebyMROId = (MRO, result) => {
    var Obj = new MROModel(MRO);
    var sql = `UPDATE tbl_mro  SET CustomerInvoiceNo='${Obj.CustomerInvoiceNo}',CustomerInvoiceDueDate='${Obj.CustomerInvoiceDueDate}'  WHERE MROId ='${Obj.MROId}'`;
    // console.log(sql);
    con.query(sql, (err, res) => {
        if (err) {
            result(null, err);
            return;
        }
        result(null, { CustomerInvoiceNo: Obj.CustomerInvoiceNo });
        return;
    }
    );
};
// To Get Packing Slip
MROModel.PackingSlip = (MROId, MROShippingHistoryId, SOId, SOItemId, result) => {
    var sqlMROInfo = MROModel.viewquery(MROId);
    var ShippedItem = MROShippingHistoryModel.ShippedItem(MROShippingHistoryId, SOId, SOItemId,);
    //const RRShippingHistoryModel = require("../models/repair.request.shipping.history.model.js");
    var MROShippingHistoryQuery = MROShippingHistoryModel.listquerybyMROIdAndMROShippingHistoryId(MROId, MROShippingHistoryId);
    var ViewMROCustomerNotes = RRNotes.ViewRRNotesByNoteType(Constants.CONST_NOTES_TYPE_CUSTOMER, MROId);
    var ViewMROVendorNotes = RRNotes.ViewRRNotesByNoteType(Constants.CONST_NOTES_TYPE_VENDOR, MROId);
    //  var ViewCustomerReference = CReferenceLabel.ViewCustomerReference(MROId);
    //var sqlApprovedQuoteItems = QuotesItemModel.GetMROApprovedQuoteItemQuery(MROId);
    async.parallel([
        function (result) { con.query(sqlMROInfo, result) },
        //   function (result) { con.query(sqlRRParts, result) },
        function (result) { con.query(MROShippingHistoryQuery, result) },
        function (result) { con.query(ViewMROCustomerNotes, result) },
        function (result) { con.query(ViewMROVendorNotes, result) },
        //  function (result) { con.query(ViewCustomerReference, result) },
        function (result) { con.query(ShippedItem, result) },
    ],
        function (err, results) {
            if (err) { return result(err, null); }

            if (results[0][0].length > 0) {
                return result(null, {
                    MROInfo: results[0][0], MROShippingHistory: results[1][0],
                    CustomerNote: results[2][0], VendorNote: results[3][0], ShippedItem: results[4][0]
                });
            } else {
                return result({ msg: "Record Not Found" }, null);
            }
        });
    // });
};


MROModel.changeStatusToQuoted = (Reqbody, result) => {
    var sql = ` SELECT  MROId, Status FROM tbl_mro    WHERE  IsDeleted = 0  AND MROId = ${Reqbody.MROId} `;
    con.query(sql, (err, res) => {
        if (err) {
            result(err, null);
            return;
        }
        if (res.length > 0) {
            //  console.log("Status " + res[0].Status);
            if (res[0].Status == Constants.CONST_MROS_AWAIT_VQUOTE) {

                var MROStatusHistoryVendorObj = new MROStatusHistory({
                    authuser: Reqbody.authuser,
                    MROId: Reqbody.MROId,
                    HistoryStatus: Constants.CONST_MROS_QUOTED_AWAITING_CUSTOMER_PO
                });
                var sql_update = `UPDATE tbl_mro  SET Status=?  WHERE MROId = ?`;
                var values = [Constants.CONST_MROS_QUOTED_AWAITING_CUSTOMER_PO, Reqbody.MROId];
                //  console.log(sql_update, values);
                async.parallel([
                    function (result) { con.query(sql_update, values, result) },
                    function (result) { con.query(MROStatusHistory.CreateQuery(MROStatusHistoryVendorObj), result) }
                ],
                    function (err, results) {
                        console.log(err);
                        return result(err, results[0]);
                    }
                );
            } else {
                result(null, res);
            }
        } else {
            result(null, res);
        }
    });
};


MROModel.DeleteMRO = (Reqbody, result) => {
    var Obj = new MROModel({ MROId: Reqbody.MROId, authuser: Reqbody.authuser });
    var MROId = Reqbody.MROId;
    var sql = `UPDATE tbl_mro  SET IsDeleted=?,Modified=?,ModifiedBy=?   WHERE MROId = ?`;
    var values = [1, Obj.Modified, Obj.ModifiedBy, Obj.MROId];
    //var rrparts_delete = RRPartsModel.DeleteRRPartsQuery(RRId);
    //var cref_delete = RRCustomerRef.DeleteRRCusRefQuery(RRId);
    //var DeleteRRImgQuery = RRImages.DeleteRRImgQuery(RRId);
    var DeleteMROVendorQuery = RRVendorsModel.DeleteMROVendorQuery(MROId);
    var DeleteMROVEndorPartsQuery = RRVendorPartsModel.DeleteMROVendorPartsQuery(MROId);
    var DeleteMRONotesQuery = RRNotesModel.DeleteRRNotesQuery(Constants.CONST_IDENTITY_TYPE_MRO, MROId);
    var DeleteQuotesQuery = QuotesModel.DeleteMROQuotesQuery(MROId);
    var DeletePurchaseOrderQuery = PurchaseOrderModel.DeleteMROPurchaseOrderQuery(MROId);
    // var DeleteSalesOrderQuery = SalesOrderModel.DeleteMROSalesOrderQuery(MROId);
    //  const InvoiceOrderModel = require("./invoice.model.js");
    // var DeleteInvoiceQuery = InvoiceOrderModel.DeleteMROInvoiceQuery(MROId);
    var DeleteVendorInvoiceQuery = VendorInvoiceModel.DeleteMROVendorInvoiceQuery(MROId);
    async.parallel([
        function (result) { con.query(sql, values, result) },
        //  function (result) { con.query(rrparts_delete, result) },
        // function (result) { con.query(cref_delete, result) },
        // function (result) { con.query(DeleteRRImgQuery, result) },
        function (result) { con.query(DeleteMROVendorQuery, result) },
        function (result) { con.query(DeleteMROVEndorPartsQuery, result) },
        function (result) { con.query(DeleteMRONotesQuery, result) },
        function (result) { con.query(DeleteQuotesQuery, result) },
        function (result) { con.query(DeletePurchaseOrderQuery, result) },
        // function (result) { con.query(DeleteSalesOrderQuery, result) },
        // function (result) { con.query(DeleteInvoiceQuery, result) },
        function (result) { SalesOrder.DeleteSalesOrderByMROQuery(MROId, result) },
        function (result) { con.query(DeleteVendorInvoiceQuery, result) }
    ],
        function (err, results) {
            if (err)
                return result(err, null);
            if (results[0][0]) {
                result(null, results[0][0]);
                return;
            } else {
                result({ msg: "MRO not found" }, null);
                return;
            }
        }
    );
};
//
MROModel.GetMROStatistics = (Reqbody, result) => {

    var TokenIdentityType = getLogInIdentityType(Reqbody);
    var IsRestrictedCustomerAccess = getLogInIsRestrictedCustomerAccess(Reqbody);
    var MultipleCustomerIds = getLogInMultipleCustomerIds(Reqbody);

    var sql = ` SELECT  Status, COUNT(Status) as Count,   
  CASE Status  
  WHEN ${Constants.CONST_MROS_GENERATED} THEN '${Constants.array_mro_status[Constants.CONST_MROS_GENERATED]}'
  WHEN ${Constants.CONST_MROS_AWAIT_VQUOTE} THEN '${Constants.array_mro_status[Constants.CONST_MROS_AWAIT_VQUOTE]}'
   WHEN ${Constants.CONST_MROS_QUOTED_AWAITING_CUSTOMER_PO} THEN '${Constants.array_mro_status[Constants.CONST_MROS_QUOTED_AWAITING_CUSTOMER_PO]}'
  WHEN ${Constants.CONST_MROS_APPROVED} THEN '${Constants.array_mro_status[Constants.CONST_MROS_APPROVED]}'
  WHEN ${Constants.CONST_MROS_PARTIALLY_RECEIVED} THEN '${Constants.array_mro_status[Constants.CONST_MROS_PARTIALLY_RECEIVED]}' 
  WHEN ${Constants.CONST_MROS_FULFILLED_BY_VENDOR} THEN '${Constants.array_mro_status[Constants.CONST_MROS_FULFILLED_BY_VENDOR]}'
  WHEN ${Constants.CONST_MROS_REJECTED} THEN '${Constants.array_mro_status[Constants.CONST_MROS_REJECTED]}'
  WHEN ${Constants.CONST_MROS_COMPLETED} THEN '${Constants.array_mro_status[Constants.CONST_MROS_COMPLETED]}'
  ELSE '-' end StatusName   
  FROM tbl_mro  
  WHERE  IsDeleted = 0  `;
    if (Reqbody.hasOwnProperty('startDate') && Reqbody.hasOwnProperty('endDate')) {
        // const Fromdatearray = Reqbody.startDate.split('T');
        // const Todatearray = Reqbody.endDate.split('T');
        // var fromDate = Fromdatearray[0];
        // var toDate = Todatearray[0];
        sql += ` AND (DATE(Created) BETWEEN  '${Reqbody.startDate}' AND '${Reqbody.endDate}') `;
    }
    if (TokenIdentityType == 0 && IsRestrictedCustomerAccess == 1 && MultipleCustomerIds != "") {
        sql += ` and CustomerId in(${MultipleCustomerIds}) `;
    }
    sql += ` GROUP BY Status `;

    // console.log("sql :" + sql);

    con.query(sql, (err, res) => {
        if (err) {
            result(err, null);
            return;
        }
        result(null, res);
    });
};



MROModel.findInColumns = (searchQuery, result) => {

    const { from, size, query, active } = searchQuery;

    let { IdentityType, MultipleAccessIdentityIds, IsRestrictedCustomerAccess, MultipleCustomerIds } = global.authuser;

    var sql = ` SELECT 'ahoms-mro' as _index,
  MROId as mroid, MRONo as mrono FROM tbl_mro as MRO 
  where 
  (
    MRO.MRONo like '%${query.multi_match.query}%' or 
    MRO.Description like '%${query.multi_match.query}%') and MRO.IsDeleted=0 ${IdentityType == "1" ? ` AND MRO.CustomerId IN (${MultipleAccessIdentityIds}) ` : ""}
    ${IdentityType == "0" && IsRestrictedCustomerAccess == 1 ? ` AND MRO.CustomerId IN (${MultipleCustomerIds}) ` : ""}
  #LIMIT ${from}, ${size}`;

    var countSql = `SELECT count(*) AS totalCount FROM tbl_mro as MRO
  where (
    MRONo like '%${query.multi_match.query}%' or 
    Description like '%${query.multi_match.query}%' 
    
    ) and    
    MRO.IsDeleted=0 ${IdentityType == "1" ? `AND MRO.CustomerId IN (${MultipleAccessIdentityIds}) ` : ""}
    ${IdentityType == "0" && IsRestrictedCustomerAccess == 1 ? ` AND MRO.CustomerId IN (${MultipleCustomerIds}) ` : ""}
    `

    con.query(countSql, (err, res) => {
        if (err) {
            return result(err, null);
        } else if (res[0].totalCount > 0) {
            let totalCount = res[0].totalCount;
            con.query(sql, (err, res) => {
                if (err) {
                    return result(err, null);
                }
                return result(null, { totalCount: { "_index": "ahoms-mro", val: totalCount }, data: res });
            });
        } else {
            return result(null, []);
        }

    });
}
module.exports = MROModel;





