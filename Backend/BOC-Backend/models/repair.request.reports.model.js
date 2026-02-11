/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
const con = require("../helper/db.js");
const Constants = require("../config/constants.js");
var async = require('async');

const RRReportsModel = function (obj) {

  this.RRId = obj.RRId ? obj.RRId : '';
  this.CustomerId = obj.CustomerId ? obj.CustomerId : '';
  this.CustomerGroupId = obj.CustomerGroupId ? obj.CustomerGroupId : '';

  this.VendorId = obj.VendorId ? obj.VendorId : '';
  this.FromDate = obj.FromDate ? obj.FromDate : '';
  this.ToDate = obj.ToDate ? obj.ToDate : '';
  this.PartNo = obj.PartNo ? obj.PartNo : '';
  this.RRNo = obj.RRNo ? obj.RRNo : '';

  this.CustomerDepartmentId = obj.CustomerDepartmentId ? obj.CustomerDepartmentId : '';
  this.Manufacturer = obj.Manufacturer ? obj.Manufacturer : '';
  this.ManufacturerPartNo = obj.ManufacturerPartNo ? obj.ManufacturerPartNo : '';
  this.SerialNo = obj.SerialNo ? obj.SerialNo : '';
  this.Description = obj.Description ? obj.Description : '';
  this.Status = obj.Status ? obj.Status : '';
  this.CustomerPONo = obj.CustomerPONo ? obj.CustomerPONo : '';
  this.CustomerAssetId = obj.CustomerAssetId ? obj.CustomerAssetId : '';
  this.UserName = obj.UserName ? obj.UserName : '';
  


  this.start = obj.start ? obj.start : 0;
  this.length = obj.length ? obj.length : 0;
  this.search = obj.search ? obj.search : '';
  this.sortCol = obj.sortCol ? obj.sortCol : '';
  this.sortDir = obj.sortDir ? obj.sortDir : '';
  this.sortColName = obj.sortColName ? obj.sortColName : '';
  this.order = obj.order ? obj.order : '';
  this.columns = obj.columns ? obj.columns : '';
  this.draw = obj.draw ? obj.draw : 0;
  this.RRReports = obj.RRReports ? obj.RRReports : '';


  this.PartId = obj.PartId ? obj.PartId : '';
  this.RRDescription = obj.RRDescription ? obj.RRDescription : '';
  this.CustomerSONo = obj.CustomerSONo ? obj.CustomerSONo : '';
  this.RRIdCustomerSO = obj.RRIdCustomerSO ? obj.RRIdCustomerSO : '';
  this.CompanyName = obj.CompanyName ? obj.CompanyName : '';
  this.CustomerPartNo1 = obj.CustomerPartNo1 ? obj.CustomerPartNo1 : '';
  this.RRIdCustomerPO = obj.RRIdCustomerPO ? obj.RRIdCustomerPO : '';
  this.ReferenceValue = obj.ReferenceValue ? obj.ReferenceValue : '';
  this.VendorName = obj.VendorName ? obj.VendorName : '';
  this.VendorPONo = obj.VendorPONo ? obj.VendorPONo : '';
  this.RRIdVendorPO = obj.RRIdVendorPO ? obj.RRIdVendorPO : '';
  this.VendorInvoiceId = obj.VendorInvoiceId ? obj.VendorInvoiceId : '';
  this.CustomerInvoiceId = obj.CustomerInvoiceId ? obj.CustomerInvoiceId : '';
  this.IsPartsDeliveredToCustomer = obj.IsPartsDeliveredToCustomer ? obj.IsPartsDeliveredToCustomer : '';
  this.StatusChangeTo = obj.StatusChangeTo ? obj.StatusChangeTo : '';
  this.StatusChangeFrom = obj.StatusChangeFrom ? obj.StatusChangeFrom : '';
  this.StatusChangeId = obj.StatusChangeId ? obj.StatusChangeId : '';
  this.ShippingStatus = obj.ShippingStatus ? obj.ShippingStatus : '';
  this.ShippingStatusCategory = obj.ShippingStatusCategory ? obj.ShippingStatusCategory : '';
  this.IsWarrantyRecovery = obj.IsWarrantyRecovery ? obj.IsWarrantyRecovery : '';
  this.IsRushRepair = obj.IsRushRepair ? obj.IsRushRepair : '';
  this.IsRepairTag = obj.IsRepairTag ? obj.IsRepairTag : '';
  this.PODueDate = obj.PODueDate ? obj.PODueDate : '';
  this.SubStatusId = obj.SubStatusId ? obj.SubStatusId : '';
  this.AssigneeUserId = obj.AssigneeUserId ? obj.AssigneeUserId : '';
  this.RRPartLocationId = obj.RRPartLocationId ? obj.RRPartLocationId : '';

  this.RejectedApprovedBy = obj.RejectedApprovedBy ? obj.RejectedApprovedBy : '';
  this.StatusName = obj.StatusName ? obj.StatusName : '';
  this.RejectionCode = obj.RejectionCode ? obj.RejectionCode : '';
  this.RejectedDate = obj.RejectedDate ? obj.RejectedDate : '';
  this.fromDate = obj.fromDate ? obj.fromDate : '';
  this.toDate = obj.toDate ? obj.toDate : '';

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



  this.ShipViaId = obj.ShipViaId ? obj.ShipViaId : '';
  this.CreatedBy = obj.CreatedBy ? obj.CreatedBy : '';
  this.ShipDate = obj.ShipDate ? obj.ShipDate : '';
  this.ShipFromIdentity = obj.ShipFromIdentity ? obj.ShipFromIdentity : '';
  this.ShipToIdentity = obj.ShipToIdentity ? obj.ShipToIdentity : '';

  this.ShippingIdentityType = obj.ShippingIdentityType ? obj.ShippingIdentityType : '';
  this.ShippingIdentityId = obj.ShippingIdentityId ? obj.ShippingIdentityId : '';
  this.ShippingAddressId = obj.ShippingAddressId ? obj.ShippingAddressId : '';

  this.IsPickedUp = obj.IsPickedUp ? obj.IsPickedUp : '';
  this.ReceiveDate = obj.ReceiveDate ? obj.ReceiveDate : '';
  this.PickedUpDate = obj.PickedUpDate ? obj.PickedUpDate : '';
  this.CreatedDate = obj.CreatedDate ? obj.CreatedDate : '';

};



RRReportsModel.GMCostSavingReport = (RRReportsModel, result) => {

  var query = "";
  var order = "";
  var selectquery = `Select ifnull(MONTHNAME(if(rr.Status=7,rr.RRCompletedDate,(Select Created from tbl_repair_request_status_history
where HistoryStatus=8 and RRId=rr.RRId order by HistoryId desc limit 1))),'') as 'Month Reporting',
rr.RRNo as 'Repair Request #',
IF(C.CustomerId>0,'Directed','-') as Directed,
IF(FIND_IN_SET(rr.VendorId,C.DirectedVendors)>0,'Directed','-') as Directed,
ifnull(cd.CustomerDepartmentName,'') as Department,
ifnull(v1.VendorName,'') as Manufacturer,rrp.ManufacturerPartNo as 'Manufacturers Part Number',rr.SerialNo as 'Serial #',
ifnull((select ReferenceValue from tbl_repair_request_customer_ref rrcr Left Join tbl_cutomer_reference_labels cl Using(CReferenceId)
where rrcr.IsDeleted = 0 AND RRId=rr.RRId order by 'Rank',RRReferenceId limit 1,1),'') as 'Common Code',
if(rr.IsWarrantyRecovery<>0,'Warranty',(select ReferenceValue from tbl_repair_request_customer_ref rrcr 
Left Join tbl_cutomer_reference_labels cl Using(CReferenceId)
where rrcr.IsDeleted = 0 AND RRId=rr.RRId order by 'Rank',RRReferenceId limit 0,1)) as 'GM PO',
ifnull(DATE_FORMAT(rr.RRCompletedDate,'%m/%d/%Y'),'') as 'Repair-Return Date',
FORMAT(ifnull(rr.PartPON,''),2) as 'New Cost',
FORMAT(ifnull(if(ifnull(rrp.CustomerPartNo2,'')='',ROUND((rr.PartPON*0.4),2),''),''),2) as 'Assumed Repair Cost as per GM guidelines',
FORMAT(ifnull(rrp.CustomerPartNo2,''),2) as 'Previous Repair Cost',
ifnull(CONCAT(CURL.CurrencySymbol,' ',FORMAT(ROUND(IF(i.GrandTotal>=0,i.GrandTotal,If(s.GrandTotal>=0,s.GrandTotal,if(q.GrandTotal>=0,q.GrandTotal,'TBD'))),2),2)),'')  as 'GM Repair Cost',
Case rr.IsWarrantyRecovery when 1 then ifnull(rr.PartPON,'') else '' end as 'Warranty New',
Case rr.IsWarrantyRecovery when 2 then ifnull(rrp.CustomerPartNo2,'') else '' end as 'Warranty Repair',
FORMAT(if(ifnull(rrp.CustomerPartNo2,'') !='',
(rrp.CustomerPartNo2)-(IF(i.GrandTotal>=0,i.GrandTotal,If(s.GrandTotal>=0,s.GrandTotal,if(q.GrandTotal>=0,q.GrandTotal,'TBD')))),'') ,2)
as 'Price to Price',
FORMAT(if(rr.IsWarrantyRecovery<>0,'',ifnull(ROUND((rr.PartPON-(IF(i.GrandTotal>=0,i.GrandTotal,If(s.GrandTotal>=0,s.GrandTotal,
if(q.GrandTotal>=0,q.GrandTotal,'TBD'))))),2),'')),2) as 'Repair vs New',
FORMAT(if(rr.IsWarrantyRecovery<>0,'',if(ifnull(rrp.CustomerPartNo2,'') ='',ifnull(ROUND((rr.PartPON*0.4)-
(IF(i.GrandTotal>=0,i.GrandTotal,If(s.GrandTotal>=0,s.GrandTotal,if(q.GrandTotal>=0,q.GrandTotal,'TBD')))),2),''),'')),2) as 'Savings',
'' as Other,if(rr.CustomerPONo='No Problem Found',ifnull(rrp.CustomerPartNo2,''),'') as 'No Problem Found','' as Notes,ifnull(ca.CustomerAssetName,'') as CustomerAssetName  `;
  var recordfilterquery = `Select count(*) as recordsFiltered `;
  query = query + ` FROM tbl_repair_request rr
LEFT JOIN tbl_customer_parts cp on cp.CustomerId=rr.CustomerId and cp.IsDeleted=0 and cp.PartId=rr.PartId
LEFT JOIN tbl_customer_departments cd on cd.CustomerDepartmentId=rr.DepartmentId
LEFT JOIN tbl_customer_assets ca on ca.CustomerAssetId=rr.AssetId
LEFT JOIN tbl_repair_request_parts rrp on rrp.RRId =rr.RRId
LEFT JOIN tbl_vendors v1 on v1.VendorId=rrp.Manufacturer
LEFT JOIN tbl_quotes q on q.RRId=rr.RRId  and q.RRId>0 and q.Status In(1,2,4) and q.QuoteCustomerStatus In(1,2,3) AND q.IsDeleted = 0
LEFT JOIN tbl_sales_order s on s.RRId=rr.RRId AND s.IsDeleted = 0 
LEFT JOIN  tbl_invoice as i ON i.SOId = s.SOId AND i.IsDeleted = 0 
LEFT JOIN tbl_currencies as CURL  ON CURL.CurrencyCode = i.LocalCurrencyCode AND CURL.IsDeleted = 0 
 LEFT JOIN  tbl_customers as C ON C.CustomerId = rr.CustomerId AND FIND_IN_SET(rr.VendorId,C.DirectedVendors)  
where rr.IsDeleted=0  and rr.Status=7 `;

  if (RRReportsModel.IdentityType == 0 && RRReportsModel.IsRestrictedCustomerAccess == 1 && RRReportsModel.MultipleCustomerIds != "") {
    query += ` and rr.CustomerId in(${RRReportsModel.MultipleCustomerIds}) `;
  }
  if (RRReportsModel.CustomerId != "") {
    query += " and  rr.CustomerId In (" + RRReportsModel.CustomerId + ") ";
  }
  if (RRReportsModel.CustomerGroupId != "") {
    query += " and  C.CustomerGroupId In (" + RRReportsModel.CustomerGroupId + ") ";
  }
  if (RRReportsModel.FromDate != "") {
    query += " and ( rr.RRCompletedDate >='" + RRReportsModel.FromDate + "' ) ";
  }
  if (RRReportsModel.ToDate != "") {
    query += " and  rr.RRCompletedDate <='" + RRReportsModel.ToDate + "'  ";
  }
  var i = 0;
  if (RRReportsModel.order.length > 0) {
    order += " ORDER BY ";
  }
  for (i = 0; i < RRReportsModel.order.length; i++) {
    if (RRReportsModel.order[i].column != "" || RRReportsModel.order[i].column == "0")// 0 is equal to ""
    {
      switch (RRReportsModel.columns[RRReportsModel.order[i].column].name) {
        case "Month Reporting":
          order += ` MONTHNAME(if(rr.Status=7,rr.RRCompletedDate,(Select Created from tbl_repair_request_status_history
        where HistoryStatus=8 and RRId=rr.RRId order by HistoryId desc limit 1))) ` + RRReportsModel.order[i].dir + "";
          break;
        case "Repair Request #":
          order += " rr.RRId " + RRReportsModel.order[i].dir + "";
          break;
        case "Serial #":
          order += " rr.SerialNo " + RRReportsModel.order[i].dir + "";
          break;
        default:
          order += " rr.RRId " + RRReportsModel.order[i].dir + "";
          break;
      }
    }
  }
  var Countquery = recordfilterquery + query;
  var limit = "";
  if (RRReportsModel.start != "-1" && RRReportsModel.length != "-1") {
    limit += " LIMIT " + RRReportsModel.start + "," + (RRReportsModel.length);
  }
  query = selectquery + query + order + limit;
  var TotalCountQuery = `SELECT Count(rr.RRId) as TotalCount 
  FROM tbl_repair_request rr
  LEFT JOIN tbl_customer_parts cp on cp.CustomerId=rr.CustomerId and cp.IsDeleted=0 and cp.PartId=rr.PartId
  LEFT JOIN tbl_customer_departments cd on cd.CustomerDepartmentId=rr.DepartmentId
  LEFT JOIN tbl_customer_assets ca on ca.CustomerAssetId=rr.AssetId
  LEFT JOIN tbl_repair_request_parts rrp on rrp.RRId =rr.RRId
  LEFT JOIN tbl_vendors v1 on v1.VendorId=rrp.Manufacturer
  LEFT JOIN tbl_quotes q on q.RRId=rr.RRId  and q.RRId>0 and q.Status In(1,2,4) and q.QuoteCustomerStatus In(1,2,3) AND q.IsDeleted = 0
  LEFT JOIN tbl_sales_order s on s.RRId=rr.RRId and s.RRId>0 AND s.IsDeleted = 0
  LEFT JOIN  tbl_invoice as i ON i.SOId = s.SOId AND i.IsDeleted = 0
  where rr.IsDeleted=0 and rr.Status =7 `;
  if (RRReportsModel.IdentityType == 0 && RRReportsModel.IsRestrictedCustomerAccess == 1 && RRReportsModel.MultipleCustomerIds != "") {
    TotalCountQuery += ` and rr.CustomerId in(${RRReportsModel.MultipleCustomerIds}) `;
  }
  //console.log("query = " + query);
  //console.log("Countquery = " + Countquery);
  // console.log("TotalCountQuery = " + TotalCountQuery);
  async.parallel([
    function (result) { con.query(query, result) },
    function (result) { con.query(Countquery, result) },
    function (result) { con.query(TotalCountQuery, result) }
  ],
    function (err, results) {
      if (err)
        return result(err, null);
      result(null, {
        data: results[0][0], recordsFiltered: results[1][0][0].recordsFiltered,
        recordsTotal: results[2][0][0].TotalCount, draw: RRReportsModel.draw
      });
      return;

    });
};


RRReportsModel.GMRepairTrackerReport = (RRReportsModel, result) => {

  var query = "";
  var order = "";
  var limit = "";
  var selectquery = `Select  

Case IsBroken when 1 then 'Y' when 2 then 'N'  else '' end as IsBroken,
ApprovedFor,
rr.RRNo,
DATE_FORMAT(rr.Created,'%m/%d/%Y') as CoreReturnDate,
ifnull((select ReferenceValue from tbl_repair_request_customer_ref rrcr Left Join tbl_cutomer_reference_labels cl Using(CReferenceId) where rrcr.IsDeleted = 0 AND RRId=rr.RRId order by 'Rank',RRReferenceId limit 1,1),'') as CommonCode,
rrp.ManufacturerPartNo,
rrp.Description,
v1.VendorName as Manufacturer,
rrp.SerialNo,
ReasonForFailure,
Case FailedOnInstall when 1 then 'Yes' when 2 then 'No'  else '' end as FailedOnInstall,
FailedOnInstallNotes,
Requestor,
cd.CustomerDepartmentName as CustomerDepartment,
ifnull(ca.CustomerAssetName,'') as CustomerAsset,
'AH Group' as RepairVendor,
GCCLItem,
1 as Qty,
FORMAT(ifnull(rr.PartPON,''),2) as 'CostOfNew',
FORMAT(ifnull(rr.PartPON,''),2) as 'TotalCostOfNew', 
IF(IsScrap=1, "Scrap", (Case rr.IsWarrantyRecovery when 1 then 'WAR-R' when 2 then 'WAR-R'  else '' end)) as WarrantyType,
StatedIssue as RepairNotes,
ifnull((select ReferenceValue from tbl_repair_request_customer_ref rrcr Left Join tbl_cutomer_reference_labels cl Using(CReferenceId) where rrcr.IsDeleted = 0 AND RRId=rr.RRId order by 'Rank',RRReferenceId limit 4,1),'') as RMANumber,
'' as ShipDateOld,
ifnull((select ShipDate from tbl_repair_request_shipping_history trrsh  where trrsh.IsDeleted = 0 AND trrsh.RRId=rr.RRId AND trrsh.ShipFromIdentity=2 AND trrsh.ShipToIdentity=1 order by trrsh.ShippingHistoryId DESC LIMIT 0,1),'') as ShipDate1,
ifnull((select ReferenceValue from tbl_repair_request_customer_ref rrcr Left Join tbl_cutomer_reference_labels cl Using(CReferenceId) where rrcr.IsDeleted = 0 AND RRId=rr.RRId order by 'Rank',RRReferenceId limit 3,1),'') as GMShipper,
ifnull((select ReferenceValue from tbl_repair_request_customer_ref rrcr Left Join tbl_cutomer_reference_labels cl Using(CReferenceId) where rrcr.IsDeleted = 0 AND RRId=rr.RRId order by 'Rank',RRReferenceId limit 5,1),'') as ShoppingCartNo,
ifnull((select ReferenceValue from tbl_repair_request_customer_ref rrcr Left Join tbl_cutomer_reference_labels cl Using(CReferenceId) where rrcr.IsDeleted = 0 AND RRId=rr.RRId order by 'Rank',RRReferenceId limit 0,1),'') as GMPO,
DATE_FORMAT(q.SubmittedDate,'%m/%d/%Y') QuoteReceivedDate,
rr.RRNo as QuoteNo,
ifnull(CONCAT(CURL.CurrencySymbol,' ',FORMAT(ROUND(IF(i.GrandTotal>=0,i.GrandTotal,If(s.GrandTotal>=0,s.GrandTotal,if(q.GrandTotal>=0,q.GrandTotal,'TBD'))),2),2)),'')  as QuotedPrice,
ifnull(CONCAT(CURL.CurrencySymbol,' ',FORMAT(ROUND(IF(i.GrandTotal>=0,i.GrandTotal,If(s.GrandTotal>=0,s.GrandTotal,if(q.GrandTotal>=0,q.GrandTotal,'TBD'))),2),2)),'')  as ExtPrice,
CONCAT(ROUND((ROUND(rr.PartPON-ROUND(IF(i.GrandTotal>=0,i.GrandTotal,If(s.GrandTotal>=0,s.GrandTotal,if(q.GrandTotal>=0,q.GrandTotal,'TBD'))),2),2) / ROUND(IF(i.GrandTotal>=0,i.GrandTotal,If(s.GrandTotal>=0,s.GrandTotal,if(q.GrandTotal>=0,q.GrandTotal,'TBD'))),2)),2),'%') as CostOfNewPercent,
DATE_FORMAT(q.ApprovedDate,'%m/%d/%Y') QuoteApprovedDate,
 CONCAT(CURL.CurrencySymbol,' ',ROUND(rr.PartPON-ROUND(IF(i.GrandTotal>=0,i.GrandTotal,If(s.GrandTotal>=0,s.GrandTotal,if(q.GrandTotal>=0,q.GrandTotal,'TBD'))),2),2)) as TotalSavings,
'' as ExpectedReturnDate,
DATE_FORMAT(rr.RRCompletedDate,'%m/%d/%Y') ReceiptDate,
RepairWarrantyExpiration,
OpenOrderStatus,
5000 as Account,
AccountValuationClass,
 MONTHNAME(STR_TO_DATE(ReceiptMonth, '%m')) as ReceiptMonth,
ReceiptYear,
 MONTHNAME(STR_TO_DATE(CoreReturnMonth, '%m')) as CoreReturnMonth,
CoreReturnYear,
DATE_FORMAT(rrsh.ShipDate,'%m/%d/%Y') as  ShipDate
`;
  var recordfilterquery = `Select count(*) as recordsFiltered `;
  query = query + ` FROM tbl_repair_request rr
LEFT JOIN tbl_repair_request_gm_tracker gmt on gmt.RRId=rr.RRId and gmt.IsDeleted=0  
LEFT JOIN tbl_customer_departments cd on cd.CustomerDepartmentId=rr.DepartmentId
LEFT JOIN tbl_customer_assets ca on ca.CustomerAssetId=rr.AssetId
LEFT JOIN tbl_repair_request_parts rrp on rrp.RRId =rr.RRId
LEFT JOIN tbl_vendors v1 on v1.VendorId=rrp.Manufacturer
LEFT JOIN tbl_quotes q on q.RRId=rr.RRId  and q.RRId>0 and q.Status In(1,2,4) and q.QuoteCustomerStatus In(1,2,3) AND q.IsDeleted = 0
LEFT JOIN tbl_sales_order s on s.RRId=rr.RRId AND s.IsDeleted = 0 
LEFT JOIN  tbl_invoice as i ON i.SOId = s.SOId AND i.IsDeleted = 0 
LEFT JOIN tbl_currencies as CURL  ON CURL.CurrencyCode = i.LocalCurrencyCode AND CURL.IsDeleted = 0 
LEFT JOIN  tbl_customers as C ON C.CustomerId = rr.CustomerId AND FIND_IN_SET(rr.VendorId,C.DirectedVendors)
LEFT JOIN (
  SELECT
 RRId,ShippingHistoryId,ShipFromIdentity,ShipFromId,ShipFromName,ShipFromAddressId,ShipComment,ShipDate,ShippedBy,TrackingNo,ShipViaId,
ShipToIdentity,ShipToId,ShipToName,ReceivedBy,ReceiveDate,ReceiveComment,PickedUpBy,PickedUpDate,ReadyForPickUpDate,Created,IsPickedUp,CreatedBy,IsDeleted,
    ROW_NUMBER() OVER(PARTITION BY RRId  ORDER BY  ShippingHistoryId ASC) AS RowNo
  FROM tbl_repair_request_shipping_history
  WHERE  IsDeleted=0  GROUP BY RRId,ShippingHistoryId
) rrsh ON rr.RRId = rrsh.RRId and rrsh.IsDeleted=0 AND rrsh.RowNo=1  
where rr.IsDeleted=0  AND rr.RRId>0  `;

  if (RRReportsModel.IdentityType == 0 && RRReportsModel.IsRestrictedCustomerAccess == 1 && RRReportsModel.MultipleCustomerIds != "") {
    query += ` and rr.CustomerId in(${RRReportsModel.MultipleCustomerIds}) `;
  }
  if (RRReportsModel.CustomerId != "") {
    query += " and  rr.CustomerId In (" + RRReportsModel.CustomerId + ") ";
  }
  if (RRReportsModel.CustomerGroupId != "") {
    query += " and  C.CustomerGroupId In (" + RRReportsModel.CustomerGroupId + ") ";
  }
  if (RRReportsModel.FromDate != "") {
    query += " and ( DATE(rr.Created) >='" + RRReportsModel.FromDate + "' ) ";
  }
  if (RRReportsModel.ToDate != "") {
    query += " and  DATE(rr.Created) <='" + RRReportsModel.ToDate + "'  ";
  }
  var i = 0;
  if (RRReportsModel.order.length > 0) {
    order += " ORDER BY ";
  }
  for (i = 0; i < RRReportsModel.order.length; i++) {
    if (RRReportsModel.order[i].column != "" || RRReportsModel.order[i].column == "0")// 0 is equal to ""
    {
      switch (RRReportsModel.columns[RRReportsModel.order[i].column].name) {
        case "Month Reporting":
          order += ` MONTHNAME(if(rr.Status=7,rr.RRCompletedDate,(Select Created from tbl_repair_request_status_history
        where HistoryStatus=8 and RRId=rr.RRId order by HistoryId desc limit 1))) ` + RRReportsModel.order[i].dir + "";
          break;
        case "Repair Request #":
          order += " rr.RRNo " + RRReportsModel.order[i].dir + "";
          break;
        case "Serial #":
          order += " rr.SerialNo " + RRReportsModel.order[i].dir + "";
          break;
        default:
          order += " rr.RRId " + RRReportsModel.order[i].dir + "";
          break;
      }
    }
  }
  var Countquery = recordfilterquery + query;
  if (RRReportsModel.start != "-1" && RRReportsModel.length != "-1") {
    limit += " LIMIT " + RRReportsModel.start + "," + (RRReportsModel.length);
  }
  query = selectquery + query + order + limit;

  var TotalCountQuery = `SELECT Count(rr.RRId) as TotalCount 
  FROM tbl_repair_request rr
  LEFT JOIN tbl_repair_request_gm_tracker gmt on gmt.RRId=rr.RRId and gmt.IsDeleted=0  
  LEFT JOIN tbl_customer_departments cd on cd.CustomerDepartmentId=rr.DepartmentId
  LEFT JOIN tbl_customer_assets ca on ca.CustomerAssetId=rr.AssetId
  LEFT JOIN tbl_repair_request_parts rrp on rrp.RRId =rr.RRId
  LEFT JOIN tbl_vendors v1 on v1.VendorId=rrp.Manufacturer
  LEFT JOIN tbl_quotes q on q.RRId=rr.RRId  and q.RRId>0 and q.Status In(1,2,4) and q.QuoteCustomerStatus In(1,2,3) AND q.IsDeleted = 0
  LEFT JOIN tbl_sales_order s on s.RRId=rr.RRId and s.RRId>0 AND s.IsDeleted = 0
  LEFT JOIN  tbl_invoice as i ON i.SOId = s.SOId AND i.IsDeleted = 0
  where rr.IsDeleted=0  AND rr.RRId>0  `;
  if (RRReportsModel.IdentityType == 0 && RRReportsModel.IsRestrictedCustomerAccess == 1 && RRReportsModel.MultipleCustomerIds != "") {
    TotalCountQuery += ` and rr.CustomerId in(${RRReportsModel.MultipleCustomerIds}) `;
  }

  async.parallel([
    function (result) { con.query(query, result) },
    function (result) { con.query(Countquery, result) },
    function (result) { con.query(TotalCountQuery, result) }
  ],
    function (err, results) {
      if (err)
        return result(err, null);
      result(null, {
        data: results[0][0], recordsFiltered: results[1][0][0].recordsFiltered,
        recordsTotal: results[2][0][0].TotalCount, draw: RRReportsModel.draw
      });
      return;

    });
};

RRReportsModel.GMRepairTrackerReportExcel = (RRReportsModel, result) => {

  var Ids = ``;
  for (let val of RRReportsModel.RRReports) {
    Ids += val.RRId + `,`;
  }
  var RRIds = Ids.slice(0, -1);
  var query = ``;
  query = ` Select  

Case IsBroken when 1 then 'Y' when 2 then 'N'  else '' end as 'Broken?',
ApprovedFor as 'Approved for',
rr.RRNo as 'Unique Identifier (Repair Tag#)',
DATE_FORMAT(rr.Created,'%m/%d/%Y') as 'Core Return Date',
ifnull((select ReferenceValue from tbl_repair_request_customer_ref rrcr Left Join tbl_cutomer_reference_labels cl Using(CReferenceId) where rrcr.IsDeleted = 0 AND RRId=rr.RRId order by 'Rank' limit 1,1),'') as 'Common Code',
rrp.ManufacturerPartNo as 'Manufacturer Part #',
rrp.Description,
v1.VendorName as Manufacturer,
rrp.SerialNo as 'Serial Number',
ReasonForFailure as 'Reason for Failure',
Case FailedOnInstall when 1 then 'Yes' when 2 then 'No'  else '' end as 'Failed on Install?',
FailedOnInstallNotes as 'Failed on Install Notes',
Requestor,
cd.CustomerDepartmentName as 'Area/Dept.',
ifnull(ca.CustomerAssetName,'') as 'Op/Asset#',
'AH Group' as 'Repair Vendor/Manufacturer',
GCCLItem as 'GCCL Item?',
1 as Qty,
FORMAT(ifnull(rr.PartPON,''),2) as 'Cost of New',
FORMAT(ifnull(rr.PartPON,''),2) as 'Total cost of new', 
IF(IsScrap=1, "Scrap", (Case rr.IsWarrantyRecovery when 1 then 'WAR-R' when 2 then 'WAR-R'  else '' end)) as 'TYPE Warranty/Repair/Hold/Scrap/STS',
StatedIssue as 'REPAIR NOTES:',
ifnull((select ReferenceValue from tbl_repair_request_customer_ref rrcr Left Join tbl_cutomer_reference_labels cl Using(CReferenceId) where rrcr.IsDeleted = 0 AND RRId=rr.RRId order by 'Rank' limit 4,1),'') as 'RMA Number',
ifnull((select ShipDate from tbl_repair_request_shipping_history trrsh  where trrsh.IsDeleted = 0 AND trrsh.RRId=rr.RRId AND trrsh.ShipFromIdentity=2 AND trrsh.ShipToIdentity=1 order by trrsh.ShippingHistoryId DESC LIMIT 0,1),'') as 'Ship Date1',
ifnull((select ReferenceValue from tbl_repair_request_customer_ref rrcr Left Join tbl_cutomer_reference_labels cl Using(CReferenceId) where rrcr.IsDeleted = 0 AND RRId=rr.RRId order by 'Rank' limit 3,1),'') as 'GM Shipper',
ifnull((select ReferenceValue from tbl_repair_request_customer_ref rrcr Left Join tbl_cutomer_reference_labels cl Using(CReferenceId) where rrcr.IsDeleted = 0 AND RRId=rr.RRId order by 'Rank' limit 5,1),'') as 'Shopping Cart Number',
ifnull((select ReferenceValue from tbl_repair_request_customer_ref rrcr Left Join tbl_cutomer_reference_labels cl Using(CReferenceId) where rrcr.IsDeleted = 0 AND RRId=rr.RRId order by 'Rank' limit 0,1),'') as 'GM PO #',
DATE_FORMAT(q.SubmittedDate,'%m/%d/%Y') 'Quote Received Date',
rr.RRNo as 'Quote Number',
ifnull(CONCAT(CURL.CurrencySymbol,' ',FORMAT(ROUND(IF(i.GrandTotal>=0,i.GrandTotal,If(s.GrandTotal>=0,s.GrandTotal,if(q.GrandTotal>=0,q.GrandTotal,'TBD'))),2),2)),'')  as 'Quoted Price',
ifnull(CONCAT(CURL.CurrencySymbol,' ',FORMAT(ROUND(IF(i.GrandTotal>=0,i.GrandTotal,If(s.GrandTotal>=0,s.GrandTotal,if(q.GrandTotal>=0,q.GrandTotal,'TBD'))),2),2)),'')  as 'Ext. Cost',
CONCAT(ROUND((ROUND(rr.PartPON-ROUND(IF(i.GrandTotal>=0,i.GrandTotal,If(s.GrandTotal>=0,s.GrandTotal,if(q.GrandTotal>=0,q.GrandTotal,'TBD'))),2),2) / ROUND(IF(i.GrandTotal>=0,i.GrandTotal,If(s.GrandTotal>=0,s.GrandTotal,if(q.GrandTotal>=0,q.GrandTotal,'TBD'))),2)),2),'%') as '% Cost of New',
DATE_FORMAT(q.ApprovedDate,'%m/%d/%Y') as 'Quote Approved Date',
 CONCAT(CURL.CurrencySymbol,' ',ROUND(rr.PartPON-ROUND(IF(i.GrandTotal>=0,i.GrandTotal,If(s.GrandTotal>=0,s.GrandTotal,if(q.GrandTotal>=0,q.GrandTotal,'TBD'))),2),2)) as 'Total Savings',
'' as 'Expected Return Date',
DATE_FORMAT(rr.RRCompletedDate,'%m/%d/%Y') as 'Receipt Date',
RepairWarrantyExpiration as 'Repair Warranty Expiration',
OpenOrderStatus as 'Open Order Status',
5000 as Account,
AccountValuationClass as 'Valuation Class',
MONTHNAME(STR_TO_DATE(ReceiptMonth, '%m')) as 'Receipt Month',
ReceiptYear as 'Receipt Year',
MONTHNAME(STR_TO_DATE(CoreReturnMonth, '%m')) as 'Core Return Month',
CoreReturnYear as 'Core Return Year',DATE_FORMAT(rrsh.ShipDate,'%m/%d/%Y') as  'Ship Date'

FROM tbl_repair_request rr
  LEFT JOIN tbl_repair_request_gm_tracker gmt on gmt.RRId=rr.RRId and gmt.IsDeleted=0  
LEFT JOIN tbl_customer_parts cp on cp.CustomerId=rr.CustomerId and cp.IsDeleted=0 and cp.PartId=rr.PartId
LEFT JOIN tbl_customer_departments cd on cd.CustomerDepartmentId=rr.DepartmentId
LEFT JOIN tbl_customer_assets ca on ca.CustomerAssetId=rr.AssetId
LEFT JOIN tbl_repair_request_parts rrp on rrp.RRId =rr.RRId
LEFT JOIN tbl_vendors v1 on v1.VendorId=rrp.Manufacturer
LEFT JOIN tbl_quotes q on q.RRId=rr.RRId  and q.RRId>0 and q.Status In(1,2,4) and q.QuoteCustomerStatus In(1,2,3) AND q.IsDeleted = 0
LEFT JOIN tbl_sales_order s on s.RRId=rr.RRId AND s.IsDeleted = 0 
LEFT JOIN  tbl_invoice as i ON i.SOId = s.SOId AND i.IsDeleted = 0 
LEFT JOIN tbl_currencies as CURL  ON CURL.CurrencyCode = i.LocalCurrencyCode AND CURL.IsDeleted = 0 
LEFT JOIN  tbl_customers as C ON C.CustomerId = rr.CustomerId AND FIND_IN_SET(rr.VendorId,C.DirectedVendors) 
LEFT JOIN (
  SELECT
 RRId,ShippingHistoryId,ShipFromIdentity,ShipFromId,ShipFromName,ShipFromAddressId,ShipComment,ShipDate,ShippedBy,TrackingNo,ShipViaId,
ShipToIdentity,ShipToId,ShipToName,ReceivedBy,ReceiveDate,ReceiveComment,PickedUpBy,PickedUpDate,ReadyForPickUpDate,Created,IsPickedUp,CreatedBy,IsDeleted,
    ROW_NUMBER() OVER(PARTITION BY RRId  ORDER BY  ShippingHistoryId ASC) AS RowNo
  FROM tbl_repair_request_shipping_history
  WHERE  IsDeleted=0  GROUP BY RRId,ShippingHistoryId
) rrsh ON rr.RRId = rrsh.RRId and rrsh.IsDeleted=0 AND rrsh.RowNo=1  
where rr.IsDeleted=0  AND rr.RRId>0 `;
  if (RRReportsModel.IdentityType == 0 && RRReportsModel.IsRestrictedCustomerAccess == 1 && RRReportsModel.MultipleCustomerIds != "") {
    query += ` and rr.CustomerId in(${RRReportsModel.MultipleCustomerIds}) `;
  }
  if (RRReportsModel.CustomerId != "") {
    query += " and  rr.CustomerId In (" + RRReportsModel.CustomerId + ") ";
  }
  if (RRReportsModel.CustomerGroupId != "") {
    query += " and  C.CustomerGroupId In (" + RRReportsModel.CustomerGroupId + ") ";
  }
  if (RRReportsModel.FromDate != "") {
    query += " and ( DATE(rr.Created) >='" + RRReportsModel.FromDate + "' ) ";
  }
  if (RRReportsModel.ToDate != "") {
    query += " and  DATE(rr.Created) <='" + RRReportsModel.ToDate + "'  ";
  }
  if (RRIds != '' && RRIds != null) {
    query += ` and rr.RRId in(` + RRIds + `)`;
  }
  con.query(query, (err, res) => {
    if (err) {
      return result(err, null);
    }
    return result(null, { ExcelData: res });
  });
};






RRReportsModel.GMCostSavingReportExcel = (RRReportsModel, result) => {

  var Ids = ``;
  for (let val of RRReportsModel.RRReports) {
    Ids += val.RRId + `,`;
  }
  var RRIds = Ids.slice(0, -1);
  var query = ``;
  query = ` Select ifnull(MONTHNAME(if(rr.Status=7,rr.RRCompletedDate,(Select Created from tbl_repair_request_status_history
where HistoryStatus=8 and RRId=rr.RRId order by HistoryId desc limit 1))),'') as 'Month Reporting',
rr.RRNo as 'Repair Request #',
IF(C.CustomerId>0,'Directed','-') as Directed,
ifnull(cd.CustomerDepartmentName,'') as Department,
ifnull(v1.VendorName,'') as Manufacturer,rrp.ManufacturerPartNo as 'Manufacturers Part Number',rr.SerialNo as 'Serial #',
ifnull((select ReferenceValue from tbl_repair_request_customer_ref rrcr Left Join tbl_cutomer_reference_labels cl Using(CReferenceId)
where rrcr.IsDeleted = 0 AND RRId=rr.RRId order by 'Rank' limit 2,1),'') as 'Common Code',
if(rr.IsWarrantyRecovery<>0,'Warranty',(select ReferenceValue from tbl_repair_request_customer_ref rrcr 
Left Join tbl_cutomer_reference_labels cl Using(CReferenceId)
where rrcr.IsDeleted = 0 AND RRId=rr.RRId order by 'Rank' limit 0,1)) as 'GM PO',
ifnull(DATE_FORMAT(rr.RRCompletedDate,'%m/%d/%Y'),'') as 'Repair-Return Date',
ifnull(rr.PartPON,'') as 'New Cost',
ifnull(if(ifnull(rrp.CustomerPartNo2,'')='',ROUND((rr.PartPON*0.4),2),''),'') as 'Assumed Repair Cost as per GM guidelines',
ifnull(rrp.CustomerPartNo2,'') as 'Previous Repair Cost',
i.LocalCurrencyCode as Currency,
ifnull(ROUND(IF(i.GrandTotal>=0,i.GrandTotal,If(s.GrandTotal>=0,s.GrandTotal,if(q.GrandTotal>=0,q.GrandTotal,'TBD'))),2),'')  as 'GM Repair Cost',
Case rr.IsWarrantyRecovery when 1 then ifnull(rr.PartPON,'') else '' end as 'Warranty New',
Case rr.IsWarrantyRecovery when 2 then ifnull(rrp.CustomerPartNo2,'') else '' end as 'Warranty Repair',
if(ifnull(rrp.CustomerPartNo2,'') !='',
(rrp.CustomerPartNo2)-(IF(i.GrandTotal>=0,i.GrandTotal,If(s.GrandTotal>=0,s.GrandTotal,if(q.GrandTotal>=0,q.GrandTotal,'TBD')))),'') 
as 'Price to Price',
if(rr.IsWarrantyRecovery<>0,'',ifnull(ROUND((rr.PartPON-(IF(i.GrandTotal>=0,i.GrandTotal,If(s.GrandTotal>=0,s.GrandTotal,
if(q.GrandTotal>=0,q.GrandTotal,'TBD'))))),2),'')) as 'Repair vs New',
if(rr.IsWarrantyRecovery<>0,'',if(ifnull(rrp.CustomerPartNo2,'') ='',ifnull(ROUND((rr.PartPON*0.4)-
(IF(i.GrandTotal>=0,i.GrandTotal,If(s.GrandTotal>=0,s.GrandTotal,if(q.GrandTotal>=0,q.GrandTotal,'TBD')))),2),''),'')) as 'Savings',
'' as Other,if(rr.CustomerPONo='No Problem Found',ifnull(rrp.CustomerPartNo2,''),'') as 'No Problem Found','' as Notes,ifnull(ca.CustomerAssetName,'') as CustomerAssetName

FROM tbl_repair_request rr
LEFT JOIN tbl_customer_parts cp on cp.CustomerId=rr.CustomerId and cp.IsDeleted=0 and cp.PartId=rr.PartId
LEFT JOIN tbl_customer_departments cd on cd.CustomerDepartmentId=rr.DepartmentId
LEFT JOIN tbl_customer_assets ca on ca.CustomerAssetId=rr.AssetId
LEFT JOIN tbl_repair_request_parts rrp on rrp.RRId =rr.RRId
LEFT JOIN tbl_vendors v1 on v1.VendorId=rrp.Manufacturer
LEFT JOIN tbl_quotes q on q.RRId=rr.RRId  and q.RRId>0 and q.Status In(1,2,4) and q.QuoteCustomerStatus In(1,2,3) AND q.IsDeleted = 0
LEFT JOIN tbl_sales_order s on s.RRId=rr.RRId and s.RRId>0 AND s.IsDeleted = 0
LEFT JOIN  tbl_invoice as i ON i.SOId = s.SOId AND i.IsDeleted = 0
LEFT JOIN tbl_currencies as CURL  ON CURL.CurrencyCode = i.LocalCurrencyCode AND CURL.IsDeleted = 0 
LEFT JOIN  tbl_customers as C ON C.CustomerId = rr.CustomerId AND FIND_IN_SET(rr.VendorId,C.DirectedVendors)
where rr.IsDeleted=0 and rr.Status =7 `;
  if (RRReportsModel.IdentityType == 0 && RRReportsModel.IsRestrictedCustomerAccess == 1 && RRReportsModel.MultipleCustomerIds != "") {
    query += ` and rr.CustomerId in(${RRReportsModel.MultipleCustomerIds}) `;
  }
  if (RRReportsModel.CustomerId != "") {
    query += " and  rr.CustomerId In (" + RRReportsModel.CustomerId + ") ";
  }
  if (RRReportsModel.CustomerGroupId != "") {
    query += " and  C.CustomerGroupId In (" + RRReportsModel.CustomerGroupId + ") ";
  }
  if (RRReportsModel.FromDate != "") {
    query += " and ( rr.RRCompletedDate >='" + RRReportsModel.FromDate + "' ) ";
  }
  if (RRReportsModel.ToDate != "") {
    query += " and  rr.RRCompletedDate <='" + RRReportsModel.ToDate + "'  ";
  }
  if (RRIds != '' && RRIds != null) {
    query += ` and rr.RRId in(` + RRIds + `)`;
  }
  // console.log("SQL=" + query);
  con.query(query, (err, res) => {
    if (err) {
      return result(err, null);
    }
    return result(null, { ExcelData: res });
  });
};


RRReportsModel.DanaCostSavingReport = (RRReportsModel, result) => {

  var query = "";
  var order = "";
  var selectquery = `Select ifnull(MONTHNAME(if(rr.Status=7,rr.RRCompletedDate,(Select Created from tbl_repair_request_status_history
where HistoryStatus=8 and RRId=rr.RRId order by HistoryId desc limit 1))),'') as 'Month Reporting',
rr.RRNo as 'Repair Request #',
ifnull(v1.VendorName,'') as Manufacturer,rrp.ManufacturerPartNo as 'Manufacturers Part Number',rr.SerialNo as 'Serial #',
ifnull(rrp.CustomerPartNo1,'') as 'Dana Prod Number',
ifnull(DATE_FORMAT(rr.RRCompletedDate,'%m/%d/%Y'),'') as 'Repair-Return Date',
ifnull(rr.PartPON,'') as 'New Cost',
ifnull(rrp.CustomerPartNo2,'') as 'LPP / MAP',
ifnull(CONCAT(CURL.CurrencySymbol,' ',FORMAT(ROUND(IF(i.GrandTotal>=0,i.GrandTotal,If(s.GrandTotal>=0,s.GrandTotal,if(q.GrandTotal>=0,q.GrandTotal,'TBD'))),2),2)),'')  as 'Dana Repair Cost',
Case rr.IsWarrantyRecovery when 1 then ifnull(rr.PartPON,'') else '' end as 'Warranty New',
Case rr.IsWarrantyRecovery when 2 then ifnull(rrp.CustomerPartNo2,'') else '' end as 'Warranty Repair',
if(ifnull(rrp.CustomerPartNo2,'') !='',
(rrp.CustomerPartNo2)-(IF(i.GrandTotal>=0,i.GrandTotal,If(s.GrandTotal>=0,s.GrandTotal,if(q.GrandTotal>=0,q.GrandTotal,'TBD')))),'') 
as 'Price to Price',
FORMAT(if(rr.IsWarrantyRecovery<>0,'',ifnull(ROUND((rr.PartPON-(IF(i.GrandTotal>=0,i.GrandTotal,If(s.GrandTotal>=0,s.GrandTotal,
if(q.GrandTotal>=0,q.GrandTotal,'TBD'))))),2),'')),2) as 'Cost Avoidance'  `;
  var recordfilterquery = `Select count(*) as recordsFiltered `;
  query = query + ` FROM tbl_repair_request rr
LEFT JOIN tbl_repair_request_parts rrp on rrp.RRId =rr.RRId
LEFT JOIN tbl_vendors v1 on v1.VendorId=rrp.Manufacturer
LEFT JOIN tbl_quotes q on q.RRId=rr.RRId  and q.RRId>0 and q.Status In(1,2,4) and q.QuoteCustomerStatus In(1,2,3) AND q.IsDeleted = 0
LEFT JOIN tbl_sales_order s on s.RRId=rr.RRId AND s.IsDeleted = 0
LEFT JOIN  tbl_invoice as i ON i.SOId = s.SOId AND i.IsDeleted = 0
LEFT JOIN tbl_currencies as CURL  ON CURL.CurrencyCode = i.LocalCurrencyCode AND CURL.IsDeleted = 0 
LEFT JOIN tbl_customers c on c.CustomerId=rr.CustomerId
where rr.IsDeleted=0  and rr.Status=7 `;

  if (RRReportsModel.IdentityType == 0 && RRReportsModel.IsRestrictedCustomerAccess == 1 && RRReportsModel.MultipleCustomerIds != "") {
    query += ` and rr.CustomerId in(${RRReportsModel.MultipleCustomerIds}) `;
  }
  if (RRReportsModel.CustomerId != "") {
    query += " and  rr.CustomerId In (" + RRReportsModel.CustomerId + ") ";
  }
  if (RRReportsModel.CustomerGroupId != "") {
    // query += " and (rr.CustomerId IN(SELECT CustomerId FROM tbl_customers  WHERE CustomerGroupId IN (" + RRReportsModel.CustomerGroupId + "))) ";
    query += ` and c.CustomerGroupId in(` + RRReportsModel.CustomerGroupId + `)`;
  }
  if (RRReportsModel.FromDate != "") {
    query += " and ( rr.RRCompletedDate >='" + RRReportsModel.FromDate + "' ) ";
  }
  if (RRReportsModel.ToDate != "") {
    query += " and  rr.RRCompletedDate <='" + RRReportsModel.ToDate + "'  ";
  }
  var i = 0;
  if (RRReportsModel.order.length > 0) {
    order += " ORDER BY ";
  }
  for (i = 0; i < RRReportsModel.order.length; i++) {
    if (RRReportsModel.order[i].column != "" || RRReportsModel.order[i].column == "0")// 0 is equal to ""
    {
      switch (RRReportsModel.columns[RRReportsModel.order[i].column].name) {
        case "Month Reporting":
          order += ` MONTHNAME(if(rr.Status=7,rr.RRCompletedDate,(Select Created from tbl_repair_request_status_history
        where HistoryStatus=8 and RRId=rr.RRId order by HistoryId desc limit 1))) ` + RRReportsModel.order[i].dir + "";
          break;
        case "Repair Request #":
          order += " rr.RRId " + RRReportsModel.order[i].dir + "";
          break;
        case "Serial #":
          order += " rr.SerialNo " + RRReportsModel.order[i].dir + "";
          break;
        default:
          order += " rr.RRId " + RRReportsModel.order[i].dir + "";
          break;
      }
    }
  }
  var Countquery = recordfilterquery + query;
  var limit = "";
  if (RRReportsModel.start != "-1" && RRReportsModel.length != "-1") {
    limit += " LIMIT " + RRReportsModel.start + "," + (RRReportsModel.length);
  }
  query = selectquery + query + order + limit;
  var TotalCountQuery = `SELECT Count(rr.RRId) as TotalCount 
  FROM tbl_repair_request rr 
  LEFT JOIN tbl_repair_request_parts rrp on rrp.RRId =rr.RRId
  LEFT JOIN tbl_vendors v1 on v1.VendorId=rrp.Manufacturer
  LEFT JOIN tbl_quotes q on q.RRId=rr.RRId  and q.RRId>0 and q.Status In(1,2,4) and q.QuoteCustomerStatus In(1,2,3) AND q.IsDeleted = 0
  LEFT JOIN tbl_sales_order s on s.RRId=rr.RRId and s.RRId>0 AND s.IsDeleted = 0
  LEFT JOIN  tbl_invoice as i ON i.SOId = s.SOId AND i.IsDeleted = 0
  where rr.IsDeleted=0 and rr.Status =7 `;
  if (RRReportsModel.IdentityType == 0 && RRReportsModel.IsRestrictedCustomerAccess == 1 && RRReportsModel.MultipleCustomerIds != "") {
    TotalCountQuery += ` and rr.CustomerId in(${RRReportsModel.MultipleCustomerIds}) `;
  }
  //console.log("query = " + query);
  // console.log("Countquery = " + Countquery);
  //console.log("TotalCountQuery = " + TotalCountQuery);
  async.parallel([
    function (result) { con.query(query, result) },
    function (result) { con.query(Countquery, result) },
    function (result) { con.query(TotalCountQuery, result) }
  ],
    function (err, results) {
      if (err)
        return result(err, null);
      result(null, {
        data: results[0][0], recordsFiltered: results[1][0][0].recordsFiltered,
        recordsTotal: results[2][0][0].TotalCount, draw: RRReportsModel.draw
      });
      return;

    });
};

RRReportsModel.DanaCostSavingReportExcel = (RRReportsModel, result) => {

  var Ids = ``;
  for (let val of RRReportsModel.RRReports) {
    Ids += val.RRId + `,`;
  }
  var RRIds = Ids.slice(0, -1);
  var query = ``;
  query = ` Select ifnull(MONTHNAME(if(rr.Status=7,rr.RRCompletedDate,(Select Created from tbl_repair_request_status_history
where HistoryStatus=8 and RRId=rr.RRId order by HistoryId desc limit 1))),'') as 'Month Reporting',
rr.RRNo as 'Repair Request #',
ifnull(v1.VendorName,'') as Manufacturer,rrp.ManufacturerPartNo as 'Manufacturers Part Number',rr.SerialNo as 'Serial #',
ifnull(rrp.CustomerPartNo1,'') as 'Dana Prod Number',
ifnull(DATE_FORMAT(rr.RRCompletedDate,'%m/%d/%Y'),'') as 'Repair-Return Date',
ifnull(rr.PartPON,'') as 'New Cost',
ifnull(rrp.CustomerPartNo2,'') as 'LPP / MAP',
i.LocalCurrencyCode as Currency,
FORMAT(ifnull(ROUND(IF(i.GrandTotal>=0,i.GrandTotal,If(s.GrandTotal>=0,s.GrandTotal,if(q.GrandTotal>=0,q.GrandTotal,'TBD'))),2),''),2)  as 'Dana Repair Cost',
Case rr.IsWarrantyRecovery when 1 then ifnull(rr.PartPON,'') else '' end as 'Warranty New',
Case rr.IsWarrantyRecovery when 2 then ifnull(rrp.CustomerPartNo2,'') else '' end as 'Warranty Repair',
FORMAT(if(ifnull(rrp.CustomerPartNo2,'') !='',
(rrp.CustomerPartNo2)-(IF(i.GrandTotal>=0,i.GrandTotal,If(s.GrandTotal>=0,s.GrandTotal,if(q.GrandTotal>=0,q.GrandTotal,'TBD')))),''),2) 
as 'Price to Price',
FORMAT(if(rr.IsWarrantyRecovery<>0,'',ifnull(ROUND((rr.PartPON-(IF(i.GrandTotal>=0,i.GrandTotal,If(s.GrandTotal>=0,s.GrandTotal,
if(q.GrandTotal>=0,q.GrandTotal,'TBD'))))),2),'')),2) as 'Cost Avoidance'

FROM tbl_repair_request rr
LEFT JOIN tbl_repair_request_parts rrp on rrp.RRId =rr.RRId
LEFT JOIN tbl_vendors v1 on v1.VendorId=rrp.Manufacturer
LEFT JOIN tbl_quotes q on q.RRId=rr.RRId  and q.RRId>0 and q.Status In(1,2,4) and q.QuoteCustomerStatus In(1,2,3) AND q.IsDeleted = 0
LEFT JOIN tbl_sales_order s on s.RRId=rr.RRId and s.RRId>0 AND s.IsDeleted = 0
LEFT JOIN  tbl_invoice as i ON i.SOId = s.SOId AND i.IsDeleted = 0
LEFT JOIN tbl_customers c on c.CustomerId=rr.CustomerId AND c.IsDeleted=0
where rr.IsDeleted=0 and rr.Status =7 `;
  if (RRReportsModel.IdentityType == 0 && RRReportsModel.IsRestrictedCustomerAccess == 1 && RRReportsModel.MultipleCustomerIds != "") {
    query += ` and rr.CustomerId in(${RRReportsModel.MultipleCustomerIds}) `;
  }
  if (RRReportsModel.CustomerId != "") {
    query += " and  rr.CustomerId In (" + RRReportsModel.CustomerId + ") ";
  }
  if (RRReportsModel.CustomerGroupId != "") {
    // query += " and (rr.CustomerId IN(SELECT CustomerId FROM tbl_customers  WHERE CustomerGroupId IN (" + RRReportsModel.CustomerGroupId + "))) ";
    query += ` and c.CustomerGroupId in(` + RRReportsModel.CustomerGroupId + `)`;
  }
  if (RRReportsModel.FromDate != "") {
    query += " and ( rr.RRCompletedDate >='" + RRReportsModel.FromDate + "' ) ";
  }
  if (RRReportsModel.ToDate != "") {
    query += " and  rr.RRCompletedDate <='" + RRReportsModel.ToDate + "'  ";
  }
  if (RRIds != '' && RRIds != null) {
    query += ` and rr.RRId in(` + RRIds + `)`;
  }
  // console.log("SQL=" + query);
  con.query(query, (err, res) => {
    if (err) {
      return result(err, null);
    }
    return result(null, { ExcelData: res });
  });
};




RRReportsModel.RRShipViaReport = (RepairRequest, result) => {
  var query = ``;
  var selectquery = `SELECT '' as CustomerId, '' as VendorId, rrsh.RRId,rr.RRNo,rrsh.ShipFromIdentity,rrsh.ShipFromId,rrsh.ShipFromName,rrsh.ShipToIdentity,
  rrsh.ShipToId,rrsh.ShipToName,rrsh.ShipComment,rrsh.ReceiveComment,  rrsh.ShipViaId,TrackingNo,ShippedBy,
  DATE_FORMAT(rrsh.ShipDate,'%m/%d/%Y') as  ShipDate, DATE_FORMAT(rrsh.Created,'%m/%d/%Y') as  CreatedDate ,  rrsh.CreatedBy,
  DATE_FORMAT(rrsh.ReceiveDate,'%m/%d/%Y') as  ReceiveDate, DATE_FORMAT(rrsh.PickedUpDate,'%m/%d/%Y') as  PickedUpDate ,
   DATE_FORMAT(rrsh.ReadyForPickUpDate,'%m/%d/%Y') as  ReadyForPickUpDate ,  rrsh.IsPickedUp, rrsh.PickedUpBy
   ,SV.ShipViaName , 
  case rrsh.IsPickedUp
  WHEN 1 THEN 'Yes'
  ELSE 'No'
  end IsPickedUpType, IF(ReceiveDate, "Received", "Not Yet Received") as ShipStatus
  `;
  recordfilterquery = `Select count(rr.RRId) as recordsFiltered `;

  query = query + ` FROM tbl_repair_request_shipping_history rrsh
           LEFT JOIN tbl_repair_request as  rr on rr.RRId=rrsh.RRId 
           LEFT JOIN tbl_ship_via as SV ON SV.ShipViaId = rrsh.ShipViaId
    WHERE rr.IsDeleted=0 and ifnull(rrsh.IsDeleted,0)=0  `;

  if (RepairRequest.IdentityType == 0 && RepairRequest.IsRestrictedCustomerAccess == 1 && RepairRequest.MultipleCustomerIds != "") {
    query += ` and  ( (rrsh.ShipFromId in(${RepairRequest.MultipleCustomerIds}) AND ShipFromIdentity=1 ) OR (rrsh.ShipToId in(${RepairRequest.MultipleCustomerIds}) AND ShipToIdentity=1) )`;
  }

  if (RepairRequest.search.value != '') {

    query = query + ` and ( rr.RRNo LIKE '%${RepairRequest.search.value}%'
     or rrsh.ShipFromName LIKE '%${RepairRequest.search.value}%' 
     or rrsh.ShipComment LIKE '%${RepairRequest.search.value}%' 
    or rrsh.ShipToName LIKE '%${RepairRequest.search.value}%' 
    or rrsh.TrackingNo LIKE '%${RepairRequest.search.value}%'  ) `;
  }

  // console.log(RepairRequest);

  if (RepairRequest.CustomerId && RepairRequest.CustomerId != "") {
    query += ` and  ( (rrsh.ShipFromId in(${RepairRequest.CustomerId}) AND rrsh.ShipFromIdentity=1 ) OR (rrsh.ShipToId in(${RepairRequest.CustomerId}) AND rrsh.ShipToIdentity=1) )`;
  }
  if (RepairRequest.CustomerGroupId && RepairRequest.CustomerGroupId != "") {
    query += ` and  ( (rrsh.ShipFromId in((SELECT CustomerId FROM tbl_customers  WHERE CustomerGroupId IN (${RepairRequest.CustomerGroupId}))) AND rrsh.ShipFromIdentity=1 ) OR (rrsh.ShipToId in((SELECT CustomerId FROM tbl_customers  WHERE CustomerGroupId IN (${RepairRequest.CustomerGroupId}))) AND rrsh.ShipToIdentity=1) )`;
  }
  if (RepairRequest.VendorId && RepairRequest.VendorId != "") {
    query += ` and  ( (rrsh.ShipFromId in(${RepairRequest.VendorId}) AND rrsh.ShipFromIdentity=2 ) OR (rrsh.ShipToId in(${RepairRequest.VendorId}) AND rrsh.ShipToIdentity=2) )`;
  }
  if (RepairRequest.ShipViaId && RepairRequest.ShipViaId != "") {
    query += " and ( rrsh.ShipViaId='" + RepairRequest.ShipViaId + "' ) ";
  }
  if (RepairRequest.CreatedBy && RepairRequest.CreatedBy != "") {
    query += " and ( rrsh.CreatedBy='" + RepairRequest.CreatedBy + "' ) ";
  }
  if (RepairRequest.ShipDate && RepairRequest.ShipDate != "") {
    query += " and ( rrsh.ShipDate='" + RepairRequest.ShipDate + "' ) ";
  }
  if (RepairRequest.ReceiveDate && RepairRequest.ReceiveDate != "") {
    query += " and ( rrsh.ReceiveDate='" + RepairRequest.ReceiveDate + "' ) ";
  }
  if (RepairRequest.PickedUpDate && RepairRequest.PickedUpDate != "") {
    query += " and ( rrsh.PickedUpDate='" + RepairRequest.PickedUpDate + "' ) ";
  }
  if (RepairRequest.CreatedDate && RepairRequest.CreatedDate != "") {
    query += " and ( rrsh.CreatedDate='" + RepairRequest.CreatedDate + "' ) ";
  }
  if (RepairRequest.IsPickedUp && RepairRequest.IsPickedUp != "") {
    query += " and ( rrsh.IsPickedUp='" + RepairRequest.IsPickedUp + "' ) ";
  }


  if (RepairRequest.ShipFromIdentity && RepairRequest.ShipFromIdentity != "") {
    switch (RepairRequest.ShipFromIdentity) {
      case 1:
        query += " and ( rrsh.ShipFromIdentity=1 ) ";
        break;
      case 2:
        query += " and ( rrsh.ShipFromIdentity=2 ) ";
        break;
      case 3:
        query += " and ( rrsh.ShipFromIdentity=2 AND rrsh.ShipFromId=5 ) ";
        break;
    }
  }
  if (RepairRequest.ShipToIdentity && RepairRequest.ShipToIdentity != "") {
    switch (RepairRequest.ShipToIdentity) {
      case 1:
        query += " and ( rrsh.ShipToIdentity=1 ) ";
        break;
      case 2:
        query += " and ( rrsh.ShipToIdentity=2 ) ";
        break;
      case 3:
        query += " and ( rrsh.ShipToIdentity=2 AND rrsh.ShipToId=5 ) ";
        break;
    }
  }
  var cvalue = 0;
  var obj = RepairRequest;
  for (cvalue = 0; cvalue < obj.columns.length; cvalue++) {
    if (obj.columns[cvalue].search.value != "") {
      switch (obj.columns[cvalue].name) {
        case "CustomerId":
          query += ` and  ( (rrsh.ShipFromId in(${obj.columns[cvalue].search.value}) AND rrsh.ShipFromIdentity=1 ) OR (rrsh.ShipToId in(${obj.columns[cvalue].search.value}) AND rrsh.ShipToIdentity=1) )`;
          break;
        case "CustomerGroupId":
          query += ` and  ( (rrsh.ShipFromId in((SELECT CustomerId FROM tbl_customers  WHERE CustomerGroupId IN (${obj.columns[cvalue].search.value}))) AND rrsh.ShipFromIdentity=1 ) OR (rrsh.ShipToId in((SELECT CustomerId FROM tbl_customers  WHERE CustomerGroupId IN (${obj.columns[cvalue].search.value}))) AND rrsh.ShipToIdentity=1) )`;
          break;
        case "VendorId":
          query += ` and  ( (rrsh.ShipFromId in(${obj.columns[cvalue].search.value}) AND rrsh.ShipFromIdentity=2 ) OR (rrsh.ShipToId in(${obj.columns[cvalue].search.value}) AND rrsh.ShipToIdentity=2) )`;
          break;
        case "ShipViaId":
          query += " and ( rrsh.ShipViaId='" + obj.columns[cvalue].search.value + "' ) ";
          break;
        case "CreatedBy":
          query += " and ( rrsh.CreatedBy='" + obj.columns[cvalue].search.value + "' ) ";
          break;
        case "ShipDate":
          query += " and ( rrsh.ShipDate LIKE '%" + obj.columns[cvalue].search.value + "%' ) ";
          break;
        case "ShipFromIdentity":
          switch (obj.columns[cvalue].search.value) {
            case 1:
              query += " and ( rrsh.ShipFromIdentity=1 ) ";
              break;
            case 2:
              query += " and ( rrsh.ShipFromIdentity=2 ) ";
              break;
            case 3:
              query += " and ( rrsh.ShipFromIdentity=2 AND rrsh.ShipFromId=5 ) ";
              break;
          }
          break;
        case "ShipToIdentity":
          switch (obj.columns[cvalue].search.value) {
            case 1:
              query += " and ( rrsh.ShipToIdentity=1 ) ";
              break;
            case 2:
              query += " and ( rrsh.ShipToIdentity=2 ) ";
              break;
            case 3:
              query += " and ( rrsh.ShipToIdentity=2 AND rrsh.ShipToId=5 ) ";
              break;
          }

          break;
        default:
          query += " and ( " + obj.columns[cvalue].name + " LIKE '%" + obj.columns[cvalue].search.value + "%' ) ";
      }
    }
  }

  var i = 0;
  var orderQuery = "";
  if (RepairRequest.order.length > 0) {
    orderQuery += " ORDER BY ";
  }
  for (i = 0; i < RepairRequest.order.length; i++) {
    if (RepairRequest.order[i].column != "" || RepairRequest.order[i].column == "0")// 0 is equal to ""
    {
      switch (RepairRequest.columns[RepairRequest.order[i].column].name) {
        case "RRNo":
          orderQuery += " rr.RRNo " + RepairRequest.order[i].dir + "";
          break;
        case "ShipFromName":
          orderQuery += " rrsh.ShipFromName " + RepairRequest.order[i].dir + "";
          break;
        case "ShipToName":
          orderQuery += " rrsh.ShipToName " + RepairRequest.order[i].dir + "";
          break;
        default:
          orderQuery += " " + RepairRequest.columns[RepairRequest.order[i].column].name + " " + RepairRequest.order[i].dir + " ";

      }
    }
  }
  var Countquery = recordfilterquery + query;
  var limitQuery = '';
  if (RepairRequest.start != "-1" && RepairRequest.length != "-1") {
    limitQuery += " LIMIT " + RepairRequest.start + "," + (RepairRequest.length);
  }
  var basequery = selectquery + query + orderQuery + limitQuery;
  var TotalCountQuery = `SELECT Count(rrsh.RRId) as TotalCount
        FROM tbl_repair_request_shipping_history rrsh
           LEFT JOIN tbl_repair_request as  rr on rr.RRId=rrsh.RRId 
        WHERE rr.IsDeleted=0 and ifnull(rrsh.IsDeleted,0)=0 `;

  if (RepairRequest.IdentityType == 0 && RepairRequest.IsRestrictedCustomerAccess == 1 && RepairRequest.MultipleCustomerIds != "") {
    TotalCountQuery += ` and  ( (rrsh.ShipFromId in(${RepairRequest.MultipleCustomerIds}) AND ShipFromIdentity=1 ) OR (rrsh.ShipToId in(${RepairRequest.MultipleCustomerIds}) AND ShipToIdentity=1) )`;
  }



  // console.log("query = " + basequery);
  // console.log("Countquery = " + Countquery);
  //  console.log("TotalCountQuery = " + TotalCountQuery);

  async.parallel([
    function (result) { con.query(basequery, result) },
    function (result) { con.query(Countquery, result) },
    function (result) { con.query(TotalCountQuery, result) }
  ],
    function (err, results) {
      if (err)
        return result(err, null);

      result(null, {
        data: results[0][0], recordsFiltered: results[1][0][0].recordsFiltered,
        recordsTotal: results[2][0][0].TotalCount, draw: RepairRequest.draw
      });
      return;
    });

};




RRReportsModel.RRShipViaReportExcel = (RepairRequest, result) => {
  var query = ``;
  var selectquery = `SELECT  rr.RRNo,rrsh.ShipFromName as 'Ship From',  rrsh.ShipToName as 'Ship To',
   SV.ShipViaName as 'Ship Via', IF(ReceiveDate, "Received", "Not Yet Received") as ShipStatus ,
    DATE_FORMAT(rrsh.ShipDate,'%m/%d/%Y') as  ShipDate,rrsh.ShipComment,  
   DATE_FORMAT(rrsh.ReceiveDate,'%m/%d/%Y') as  ReceiveDate,rrsh.ReceiveComment,  
 rrsh.TrackingNo,rrsh.ShippedBy, DATE_FORMAT(rrsh.Created,'%m/%d/%Y') as  CreatedDate,
 case rrsh.IsPickedUp
  WHEN 1 THEN 'Yes'
  ELSE 'No'
  end IsPickedUpType,   DATE_FORMAT(rrsh.ReadyForPickUpDate,'%m/%d/%Y') as  ReadyForPickUpDate ,
  DATE_FORMAT(rrsh.PickedUpDate,'%m/%d/%Y') as  PickedUpDate ,  
   rrsh.PickedUpBy  
  `;
  recordfilterquery = `Select count(rr.RRId) as recordsFiltered `;

  query = query + ` FROM tbl_repair_request_shipping_history rrsh
           LEFT JOIN tbl_repair_request as  rr on rr.RRId=rrsh.RRId 
           LEFT JOIN tbl_ship_via as SV ON SV.ShipViaId = rrsh.ShipViaId
    WHERE rr.IsDeleted=0 and ifnull(rrsh.IsDeleted,0)=0  `;

  if (RepairRequest.IdentityType == 0 && RepairRequest.IsRestrictedCustomerAccess == 1 && RepairRequest.MultipleCustomerIds != "") {
    query += ` and  ( (rr.ShipFromId in(${RepairRequest.MultipleCustomerIds}) AND ShipFromIdentity=1 ) OR (rr.ShipToId in(${RepairRequest.MultipleCustomerIds}) AND ShipToIdentity=1) )`;
  }


  var cvalue = 0;
  var obj = RepairRequest;
  if (RepairRequest.CustomerId && RepairRequest.CustomerId != "") {
    query += ` and  ( (rrsh.ShipFromId in(${RepairRequest.CustomerId}) AND rrsh.ShipFromIdentity=1 ) OR (rrsh.ShipToId in(${RepairRequest.CustomerId}) AND rrsh.ShipToIdentity=1) )`;
  }
  if (RepairRequest.CustomerGroupId && RepairRequest.CustomerGroupId != "") {
    query += ` and  ( (rrsh.ShipFromId in((SELECT CustomerId FROM tbl_customers  WHERE CustomerGroupId IN (${RepairRequest.CustomerGroupId}))) AND rrsh.ShipFromIdentity=1 ) OR (rrsh.ShipToId in((SELECT CustomerId FROM tbl_customers  WHERE CustomerGroupId IN (${RepairRequest.CustomerGroupId}))) AND rrsh.ShipToIdentity=1) )`;
  }
  if (RepairRequest.VendorId && RepairRequest.VendorId != "") {
    query += ` and  ( (rrsh.ShipFromId in(${RepairRequest.VendorId}) AND rrsh.ShipFromIdentity=2 ) OR (rrsh.ShipToId in(${RepairRequest.VendorId}) AND rrsh.ShipToIdentity=2) )`;
  }
  if (RepairRequest.ShipViaId && RepairRequest.ShipViaId != "") {
    query += " and ( rrsh.ShipViaId='" + RepairRequest.ShipViaId + "' ) ";
  }
  if (RepairRequest.CreatedBy && RepairRequest.CreatedBy != "") {
    query += " and ( rrsh.CreatedBy='" + RepairRequest.CreatedBy + "' ) ";
  }
  if (RepairRequest.ShipDate && RepairRequest.ShipDate != "") {
    query += " and ( rrsh.ShipDate='" + RepairRequest.ShipDate + "' ) ";
  }
  if (RepairRequest.ReceiveDate && RepairRequest.ReceiveDate != "") {
    query += " and ( rrsh.ReceiveDate='" + RepairRequest.ReceiveDate + "' ) ";
  }
  if (RepairRequest.PickedUpDate && RepairRequest.PickedUpDate != "") {
    query += " and ( rrsh.PickedUpDate='" + RepairRequest.PickedUpDate + "' ) ";
  }
  if (RepairRequest.CreatedDate && RepairRequest.CreatedDate != "") {
    query += " and ( rrsh.CreatedDate='" + RepairRequest.CreatedDate + "' ) ";
  }
  if (RepairRequest.IsPickedUp && RepairRequest.IsPickedUp != "") {
    query += " and ( rrsh.IsPickedUp='" + RepairRequest.IsPickedUp + "' ) ";
  }
  if (RepairRequest.ShipFromIdentity && RepairRequest.ShipFromIdentity != "") {
    switch (RepairRequest.ShipFromIdentity) {
      case 1:
        query += " and ( rrsh.ShipFromIdentity=1 ) ";
        break;
      case 2:
        query += " and ( rrsh.ShipFromIdentity=2 ) ";
        break;
      case 3:
        query += " and ( rrsh.ShipFromIdentity=2 AND rrsh.ShipFromId=5 ) ";
        break;
    }
  }
  if (RepairRequest.ShipToIdentity && RepairRequest.ShipToIdentity != "") {
    switch (RepairRequest.ShipToIdentity) {
      case 1:
        query += " and ( rrsh.ShipToIdentity=1 ) ";
        break;
      case 2:
        query += " and ( rrsh.ShipToIdentity=2 ) ";
        break;
      case 3:
        query += " and ( rrsh.ShipToIdentity=2 AND rrsh.ShipToId=5 ) ";
        break;
    }
  }
  var orderQuery = " ORDER BY  rrsh.RRId DESC ";

  var basequery = selectquery + query + orderQuery;

  //console.log(basequery);
  con.query(basequery, (err, res) => {
    if (err) {
      console.log(err);
      return result(err, null);
    }
    return result(null, { ExcelData: res });
  });

};





RRReportsModel.RepairRequestCustomReport = (RepairRequest, result) => {
  var query = ``;
  var order = "";
  var limit = "";
  var selectquery = `SELECT rr.RRNo,rr.PartNo,v.VendorName as Supplier,m.VendorName as Manufacturer,p.ManufacturerPartNo ManufacturerPart,rr.SerialNo,rr.RRDescription Description,rr.SubStatusId,rr.AssigneeUserId,rr.RRPartLocationId,DATE_FORMAT(po.DueDate,'%m/%d/%Y') as PODueDate,
    CASE rr.Status 
    WHEN 0 THEN '${Constants.array_rr_status[0]}'
    WHEN 1 THEN '${Constants.array_rr_status[1]}' 
    WHEN 2 THEN '${Constants.array_rr_status[2]}'
    WHEN 3 THEN '${Constants.array_rr_status[3]}'
    WHEN 4 THEN '${Constants.array_rr_status[4]}'
    WHEN 5 THEN '${Constants.array_rr_status[5]}'
    WHEN 6 THEN '${Constants.array_rr_status[6]}'
    WHEN 7 THEN '${Constants.array_rr_status[7]}'
    WHEN 8 THEN '${Constants.array_rr_status[8]}'
    ELSE '-'	end StatusName,
    c.CompanyName Customer,d.CustomerDepartmentName Department,rr.CustomerPONo CustomerPO,
    CONCAT(IFNULL(CURL.CurrencySymbol,CURLQ.CurrencySymbol),' ',FORMAT(IF(i.GrandTotal>=0,i.GrandTotal,If(q.GrandTotal>=0,q.GrandTotal,'TBD')),2)) RepairPrice,1 Quantity,
    FORMAT(Round(rr.PartPON),2) PriceOfNew,
    FORMAT(IF(vi.GrandTotal>=0,vi.GrandTotal,If(po.GrandTotal>=0,po.GrandTotal,'TBD')),2) Cost,vi.Shipping,
    DATE_FORMAT(rr.Created,'%m/%d/%Y') AHReceivedDate,
    DATE_FORMAT(q.SubmittedDate,'%m/%d/%Y') QuoteSubmittedDate,
    DATE_FORMAT(q.ApprovedDate,'%m/%d/%Y') ApprovedDate,rr.VendorPONo,i.SONo SalesOrderNo,
    IF(rr.Status=6,DATE_FORMAT(rr.Modified,'%m/%d/%Y'),'') RejectedDate,DATE_FORMAT(so.DueDate,'%m/%d/%Y') as  SalesOrderRequiredDate,
    DATE_FORMAT(rr.RRCompletedDate,'%m/%d/%Y')  as DateCompleted,i.InvoiceNo Invoice,
    Case IsRushRepair when 1 then 'Yes' when 0 then 'No' else '-' END RushNormal,
    Case IsWarrantyRecovery
    WHEN 1 THEN '${Constants.array_IsWarrantyRepair[1]}'
    WHEN 2 THEN '${Constants.array_IsWarrantyRepair[2]}'
    ELSE '-'	end WarrantyRecovery,
    (select CONCAT(ReferenceLabelName,": ",ReferenceValue) from tbl_repair_request_customer_ref rrcr
    Left Join tbl_cutomer_reference_labels cl Using(CReferenceId)
    where rrcr.IsDeleted = 0 AND RRId=rr.RRId order by 'Rank' limit 0,1) as CustomerReference1,
    (select CONCAT(ReferenceLabelName,": ",ReferenceValue) from tbl_repair_request_customer_ref rrcr Left Join tbl_cutomer_reference_labels cl Using(CReferenceId)
    where rrcr.IsDeleted = 0 AND RRId=rr.RRId order by 'Rank' limit 1,1) as CustomerReference2,
    (select CONCAT(ReferenceLabelName,": ",ReferenceValue) from tbl_repair_request_customer_ref rrcr Left Join tbl_cutomer_reference_labels cl Using(CReferenceId)
    where rrcr.IsDeleted = 0 AND RRId=rr.RRId order by 'Rank' limit 2,1) as CustomerReference3,
    (select CONCAT(ReferenceLabelName,": ",ReferenceValue) from tbl_repair_request_customer_ref rrcr Left Join tbl_cutomer_reference_labels cl Using(CReferenceId)
    where rrcr.IsDeleted = 0 AND RRId=rr.RRId order by 'Rank' limit 3,1) as CustomerReference4,
    (select CONCAT(ReferenceLabelName,": ",ReferenceValue) from tbl_repair_request_customer_ref rrcr Left Join tbl_cutomer_reference_labels cl Using(CReferenceId)
    where rrcr.IsDeleted = 0 AND RRId=rr.RRId order by 'Rank' limit 4,1) as CustomerReference5,
    (select CONCAT(ReferenceLabelName,": ",ReferenceValue) from tbl_repair_request_customer_ref rrcr Left Join tbl_cutomer_reference_labels cl Using(CReferenceId)
    where rrcr.IsDeleted = 0 AND RRId=rr.RRId order by 'Rank' limit 5,1) as CustomerReference6, 
    (Select GROUP_CONCAT(Notes ORDER BY Notes SEPARATOR ' // ')  from tbl_repair_request_followup_notes
where IsDeleted=0 and RRId=rr.RRId) as FollowUpStatus,rrp.CustomerPartNo1,
    rrp.CustomerPartNo2,
    rr.StatedIssue CustomerStatedIssue,q.RouteCause RootCause,vi.VendorInvNo VendorReferenceNo,'' RRDescription,rr.Status,'' IsRushRepair,'' IsRepairTag,'' ReferenceValue,'' CustomerSONo ,''  SODueDatePassed,
    ''  PODueDatePassed,''  InvDueDatePassed, ''  IsPartsDeliveredToCustomer,
    ''  SODueDateNears,'' as PODueDateNears,'' as InvDueDateNears,'' VendorInvoiceId,'' ManufacturerPartNo,
    '' as CustomerInvoiceId,rr.CustomerId,rr.VendorId,rr.PartId,'' RRIdCustomerPO,'' RRIdCustomerSO,'' StatusChangeFrom,'' StatusChangeTo,
    '' StatusChangeId,rr.RRId,'' ShippingStatus,'' ShippingStatusCategory,'' RRIdVendorPO,'' VendorName,IFNULL(ca.CustomerAssetName,'') as CustomerAssetName,
    (Select GROUP_CONCAT(Notes ORDER BY Notes SEPARATOR ' // ')  from tbl_repair_request_notes where IsDeleted=0 AND NotesType = 1  AND IdentityType = 3 and IdentityId=rr.RRId) as InternalNotes,  rrv.VendorRefNo
    `;

  recordfilterquery = `Select count(rr.RRId) as recordsFiltered `;

  query = query + ` FROM tbl_repair_request rr
    LEFT JOIN tbl_customers c on c.CustomerId=rr.CustomerId
    LEFT JOIN tbl_customer_departments d on d.CustomerDepartmentId=rr.DepartmentId
    LEFT JOIN tbl_customer_assets ca on ca.CustomerAssetId=rr.AssetId
    LEFT JOIN tbl_vendors v on v.VendorId=rr.VendorId
    LEFT JOIN tbl_repair_request_vendors rrv on rrv.VendorId=rr.VendorId AND rrv.Status!=3 AND rrv.RRId = rr.RRId   AND rrv.IsDeleted = 0
    LEFT JOIN tbl_repair_request_parts rrp on rr.RRId=rrp.RRId
    LEFT JOIN tbl_parts p on p.PartId=rr.PartId
    LEFT JOIN tbl_vendors m on m.VendorId=p.ManufacturerId    
    LEFT JOIN tbl_quotes q on q.RRId=rr.RRId  and q.RRId>0 and q.Status In(1,2,4) and q.QuoteCustomerStatus In(1,2,3) and q.IsDeleted = 0 
    LEFT JOIN tbl_sales_order so on so.RRId=rr.RRId and so.RRId>0 and so.IsDeleted = 0  AND so.Status!=${Constants.CONST_SO_STATUS_CANCELLED} 
    LEFT JOIN tbl_invoice i on i.RRId=rr.RRId and i.RRId>0 AND i.IsDeleted = 0  AND i.Status!=${Constants.CONST_INV_STATUS_CANCELLED}
    LEFT JOIN tbl_vendor_invoice vi on vi.RRId=rr.RRId and vi.RRId>0 and vi.IsDeleted = 0 
    LEFT JOIN tbl_currencies as CURL  ON CURL.CurrencyCode = i.LocalCurrencyCode AND CURL.IsDeleted = 0 
    LEFT JOIN tbl_currencies as CURLQ  ON CURLQ.CurrencyCode = q.LocalCurrencyCode AND CURLQ.IsDeleted = 0 
    LEFT JOIN tbl_po po on po.RRId=rr.RRId and po.RRId>0  AND po.Status!=${Constants.CONST_PO_STATUS_CANCELLED} 
    WHERE rr.IsDeleted=0 and ifnull(po.IsDeleted,0)=0  `;
  if (RepairRequest.IdentityType == 0 && RepairRequest.IsRestrictedCustomerAccess == 1 && RepairRequest.MultipleCustomerIds != "") {
    TotalCountQuery += ` and rr.CustomerId in(${RepairRequest.MultipleCustomerIds}) `;
    query += ` and rr.CustomerId in(${RepairRequest.MultipleCustomerIds}) `;
  }
  if (RepairRequest.search.value != '') {

    query = query + ` and ( rr.RRNo LIKE '%${RepairRequest.search.value}%'
     or rr.PartNo LIKE '%${RepairRequest.search.value}%' 
     or rr.SerialNo LIKE '%${RepairRequest.search.value}%' 
    or c.CompanyName LIKE '%${RepairRequest.search.value}%' 
    or v.VendorName LIKE '%${RepairRequest.search.value}%'

    or rr.CustomerPONo LIKE '%${RepairRequest.search.value}%'
    or rr.VendorPONo LIKE '%${RepairRequest.search.value}%'
    or vi.VendorInvoiceNo LIKE '%${RepairRequest.search.value}%'
    or rr.Status LIKE '%${RepairRequest.search.value}%' ) `;
  }
  var StatusChangeFrom = '';
  var StatusChangeTo = '';
  var StatusChangeId = '';

  if (RepairRequest.ShippingStatus != "") {
    var ShippingStatus = RepairRequest.ShippingStatus;
    if (ShippingStatus == 1 || ShippingStatus == 2 || ShippingStatus == 3) {
      var Val = ShippingStatus;
      query += ` and rr.ShippingStatus = 1 and rr.ShippingIdentityType =${Val == 2 ? 1 : 2} `;
      if (ShippingStatus == 1) {
        query += ` and rr.ShippingIdentityId =${Constants.AH_GROUP_VENDOR_ID} `;
      }
      if (ShippingStatus == 3) {
        query += ` and rr.ShippingIdentityId !=${Constants.AH_GROUP_VENDOR_ID} `;
      }
      query += ` and rr.RRId In (Select RRId from   tbl_repair_request_shipping_history where IsDeleted=0) `;
    } else if (ShippingStatus == 4 || ShippingStatus == 5 || ShippingStatus == 6) {
      var Val2 = ShippingStatus;
      query += ` and rr.ShippingStatus = 2 and rr.ShippingIdentityType =${Val2 == 5 ? 1 : 2} `;
      if (ShippingStatus == 4) {
        query += ` and rr.ShippingIdentityId =${Constants.AH_GROUP_VENDOR_ID} `;
      }
      if (ShippingStatus == 6) {
        query += ` and rr.ShippingIdentityId !=${Constants.AH_GROUP_VENDOR_ID} `;
      }
      query += ` and rr.RRId In (Select RRId from   tbl_repair_request_shipping_history where IsDeleted=0) `;
    } else if (ShippingStatus == 7) {
      query += ` and rr.RRId Not In (Select RRId from  tbl_repair_request_shipping_history where IsDeleted=0) `;
    }
  }
  if (RepairRequest.ShippingStatusCategory != "") {

    if (RepairRequest.ShippingStatusCategory == 1) {
      query += ` and rr.ShippingStatus = 2 and rr.ShippingIdentityType =1  and rr.RRId Not In (Select RRId from   tbl_repair_request_shipping_history where IsDeleted=0) `;
    } else if (RepairRequest.ShippingStatusCategory == 2) {
      query += ` and rr.ShippingStatus = 2 and rr.ShippingIdentityType =2  and rr.ShippingIdentityId !=${Constants.AH_GROUP_VENDOR_ID}  and rr.RRId Not In (Select RRId from  tbl_repair_request_shipping_history where IsDeleted=0) `;
    } else if (RepairRequest.ShippingStatusCategory == 3) {
      query += ` and rr.ShippingStatus = 2 and rr.ShippingIdentityType =2  and rr.ShippingIdentityId =${Constants.AH_GROUP_VENDOR_ID}  and rr.RRId Not In (Select RRId from  tbl_repair_request_shipping_history where IsDeleted=0) `;
    } else if (RepairRequest.ShippingStatusCategory == 4) {
      query += ` and rr.ShippingStatus = 0 `;
    }
  }
  if (RepairRequest.VendorInvoiceId != "") {
    if (RepairRequest.VendorInvoiceId == 1) {
      query += " and ( rr.VendorInvoiceId>0 ) ";
    } else if (RepairRequest.VendorInvoiceId == 0) {
      query += " and ( rr.VendorInvoiceId = 0 ) ";
    }
  }
  if (RepairRequest.CustomerInvoiceId != "") {
    if (RepairRequest.CustomerInvoiceId == 1) {
      query += " and ( rr.CustomerInvoiceId>0 ) ";
    } else if (RepairRequest.CustomerInvoiceId == 0) {
      query += " and ( rr.CustomerInvoiceId = 0 ) ";
    }
  }
  if (RepairRequest.RRId != "") {
    query += " and  rr.RRId = '" + RepairRequest.RRId + "'  ";
  }
  if (RepairRequest.RRNo != "") {
    query += " and rr.RRNo LIKE '%" + RepairRequest.RRNo + "%' ";
  }
  if (RepairRequest.RRDescription != "") {
    query += " and rr.RRDescription LIKE '%" + RepairRequest.RRDescription + "%' ";
  }
  if (RepairRequest.PartNo != "") {
    query += " and  rr.PartNo =  '" + RepairRequest.PartNo + "'  ";
  }
  if (RepairRequest.PartId != "") {
    query += " and  rr.PartId =  '" + RepairRequest.PartId + "'  ";
  }
  if (RepairRequest.SerialNo != "") {
    query += " and  rr.SerialNo LIKE '%" + RepairRequest.SerialNo + "%'  ";
  }
  if (RepairRequest.CustomerSONo != "") {
    query += " and  rr.CustomerSONo LIKE '%" + RepairRequest.CustomerSONo + "%' ";
  }
  if (RepairRequest.RRIdCustomerSO != "") {
    query += " and  rr.RRId =  '" + RepairRequest.RRIdCustomerSO + "'  ";
  }
  if (RepairRequest.Status != "") {
    query += " and  rr.Status =  '" + RepairRequest.Status + "'  ";
  }
  if (RepairRequest.CompanyName != "") {
    query += " and  c.CompanyName LIKE '%" + RepairRequest.CompanyName + "%'  ";
  }
  if (RepairRequest.CustomerId != "") {
    query += " and rr.CustomerId IN (" + RepairRequest.CustomerId + ") ";
  }
  if (RepairRequest.CustomerGroupId != "") {
    query += " and c.CustomerGroupId IN (" + RepairRequest.CustomerGroupId + ") ";
  }

  if (RepairRequest.CustomerPartNo1 != "") {
    query += " and rrp.CustomerPartNo1  = '" + RepairRequest.CustomerPartNo1 + "'  ";
  }
  if (RepairRequest.CustomerPONo != "") {
    query += " and  rr.CustomerPONo LIKE '%" + RepairRequest.CustomerPONo + "%'  ";
  }
  if (RepairRequest.RRIdCustomerPO != "") {
    query += " and  rr.RRId =  '" + RepairRequest.RRIdCustomerPO + "'  ";
  }
  if (RepairRequest.ReferenceValue != "") {
    query += " and rr.RRId IN(SELECT RRId FROM tbl_repair_request_customer_ref  WHERE " + RepairRequest.ReferenceValue + " LIKE '%" + RepairRequest.ReferenceValue + "%' ) ";
  }
  if (RepairRequest.VendorName != "") {
    query += " and  v.VendorName LIKE '%" + RepairRequest.VendorName + "%'  ";
  }
  if (RepairRequest.VendorId != "") {
    query += " and rr.VendorId  = '" + RepairRequest.VendorId + "'  ";
  }
  if (RepairRequest.SubStatusId != "") {
    query += " and rr.SubStatusId  = '" + RepairRequest.SubStatusId + "'  ";
  }
  if (RepairRequest.AssigneeUserId != "") {
    query += " and rr.AssigneeUserId  = '" + RepairRequest.AssigneeUserId + "'  ";
  }
  if (RepairRequest.RRPartLocationId != "") {
    query += " and rr.RRPartLocationId  = '" + RepairRequest.RRPartLocationId + "'  ";
  }
  if (RepairRequest.VendorPONo != "") {
    query += " and  rr.VendorPONo =  '" + RepairRequest.VendorPONo + "'  ";
  }
  if (RepairRequest.RRIdVendorPO != "") {
    query += " and  rr.RRIdVendorPO =  '" + RepairRequest.RRIdVendorPO + "'  ";
  }
  if (RepairRequest.IsPartsDeliveredToCustomer != "") {
    if (RepairRequest.IsPartsDeliveredToCustomer == 1) {
      query += ` and ( rr.ShippingStatus = 2 AND rr.ShippingIdentityType=${Constants.CONST_IDENTITY_TYPE_CUSTOMER} AND rr.CustomerId = rr.ShippingIdentityId )`;
    } else if (RepairRequest.IsPartsDeliveredToCustomer == 0) {
      query += ` and ( rr.ShippingStatus != 2 OR rr.ShippingIdentityType!=${Constants.CONST_IDENTITY_TYPE_CUSTOMER} OR rr.CustomerId != rr.ShippingIdentityId )`;
    }
  }
  if (RepairRequest.StatusChangeFrom != "") {
    StatusChangeFrom = RepairRequest.StatusChangeFrom;
  }
  if (RepairRequest.StatusChangeTo != "") {
    StatusChangeTo = RepairRequest.StatusChangeTo;
  }
  if (RepairRequest.StatusChangeId != "") {
    StatusChangeId = RepairRequest.StatusChangeId;
  }
  if (RepairRequest.IsWarrantyRecovery != "") {
    query += " and  rr.IsWarrantyRecovery = '" + RepairRequest.IsWarrantyRecovery + "'  ";
  }
  if (RepairRequest.IsRushRepair != "") {
    query += " and  rr.IsRushRepair = '" + RepairRequest.IsRushRepair + "'  ";
  }
  if (RepairRequest.IsRepairTag != "") {
    query += " and  rr.IsRepairTag = '" + RepairRequest.IsRepairTag + "'  ";
  }



  if (StatusChangeFrom != '' && StatusChangeTo != '') {
    query += " and rr.RRId IN(SELECT RRId FROM tbl_repair_request_status_history  WHERE (DATE(Created) >= '" + StatusChangeFrom + "' and DATE(Created) <= '" + StatusChangeTo + "') ";
    if (StatusChangeId) {
      query += " and HistoryStatus = '" + StatusChangeId + "'";
    }
    query += ")";
  }
  else {
    if (StatusChangeFrom != '' || StatusChangeTo != '') {
      if (StatusChangeFrom != '') {
        query += " and rr.RRId IN(SELECT RRId FROM tbl_repair_request_status_history  WHERE (DATE(Created) >= '" + StatusChangeFrom + "'  ) ";
      }
      if (StatusChangeTo != '') {
        query += " and rr.RRId IN(SELECT RRId FROM tbl_repair_request_status_history  WHERE (  DATE(Created) <= '" + StatusChangeTo + "') ";
      }
      if (StatusChangeId) {
        query += " and HistoryStatus = '" + StatusChangeId + "'";
      }
      query += ")";
    }
  }

  var i = 0;
  if (RepairRequest.order.length > 0) {
    order += " ORDER BY ";
  }
  for (i = 0; i < RepairRequest.order.length; i++) {
    if (RepairRequest.order[i].column != "" || RepairRequest.order[i].column == "0")// 0 is equal to ""
    {
      switch (RepairRequest.columns[RepairRequest.order[i].column].name) {
        case "PartNo":
          order += " rr.PartNo " + RepairRequest.order[i].dir + "";
          break;
        case "RRNo":
          order += " rr.RRId " + RepairRequest.order[i].dir + "";
          break;
        case "CompanyName":
          order += " c.CompanyName " + RepairRequest.order[i].dir + "";
          break;
        case "SerialNo":
          order += " rr.SerialNo " + RepairRequest.order[i].dir + "";
          break;
        case "Status":
          order += " rr.Status " + RepairRequest.order[i].dir + " ";
          break;
        default:
          order += " rr.RRId " + RepairRequest.order[i].dir + " ";

      }
    }
  }
  var Countquery = recordfilterquery + query;

  if (RepairRequest.start != "-1" && RepairRequest.length != "-1") {
    limit += " LIMIT " + RepairRequest.start + "," + (RepairRequest.length);
  }
  query = selectquery + query + order + limit;
  var TotalCountQuery = `SELECT Count(rr.RRId) as TotalCount
    FROM tbl_repair_request rr

    LEFT JOIN tbl_customers c on c.CustomerId=rr.CustomerId
    LEFT JOIN tbl_customer_departments d on d.CustomerDepartmentId=rr.DepartmentId
    LEFT JOIN tbl_customer_assets ca on ca.CustomerAssetId=rr.AssetId
    LEFT JOIN tbl_vendors v on v.VendorId=rr.VendorId
    LEFT JOIN tbl_repair_request_vendors rrv on rrv.VendorId=rr.VendorId AND rrv.Status!=3 AND rrv.RRId = rr.RRId   AND rrv.IsDeleted = 0
    LEFT JOIN tbl_repair_request_parts rrp on rr.RRId=rrp.RRId
    LEFT JOIN tbl_parts p on p.PartId=rr.PartId
    LEFT JOIN tbl_vendors m on m.VendorId=p.ManufacturerId    
    LEFT JOIN tbl_quotes q on q.RRId=rr.RRId  and q.RRId>0 and q.Status In(1,2,4) and q.QuoteCustomerStatus In(1,2,3) and q.IsDeleted = 0 
    LEFT JOIN tbl_sales_order so on so.RRId=rr.RRId and so.RRId>0 and so.IsDeleted = 0  AND so.Status!=${Constants.CONST_SO_STATUS_CANCELLED} 
    LEFT JOIN tbl_invoice i on i.RRId=rr.RRId and i.RRId>0 AND i.IsDeleted = 0  AND i.Status!=${Constants.CONST_INV_STATUS_CANCELLED}
    LEFT JOIN tbl_vendor_invoice vi on vi.RRId=rr.RRId and vi.RRId>0 and vi.IsDeleted = 0 
    LEFT JOIN tbl_currencies as CURL  ON CURL.CurrencyCode = i.LocalCurrencyCode AND CURL.IsDeleted = 0 
    LEFT JOIN tbl_po po on po.RRId=rr.RRId and po.RRId>0 AND po.Status!=${Constants.CONST_PO_STATUS_CANCELLED}
    WHERE rr.IsDeleted=0 and ifnull(po.IsDeleted,0)=0`;
  if (RepairRequest.IdentityType == 0 && RepairRequest.IsRestrictedCustomerAccess == 1 && RepairRequest.MultipleCustomerIds != "") {
    TotalCountQuery += ` and rr.CustomerId in(${RepairRequest.MultipleCustomerIds}) `;
  }

 // console.log("query = " + query);
  // console.log("Countquery = " + Countquery);
  //console.log("TotalCountQuery = " + TotalCountQuery);
  async.parallel([
    function (result) { con.query(query, result) },
    function (result) { con.query(Countquery, result) },
    function (result) { con.query(TotalCountQuery, result) }
  ],
    function (err, results) {
      if (err)
        return result(err, null);

      result(null, {
        data: results[0][0], recordsFiltered: results[1][0][0].recordsFiltered,
        recordsTotal: results[2][0][0].TotalCount, draw: RepairRequest.draw
      });
      return;
    });

};

RRReportsModel.RepairRequestCustomReportExcel = (RepairRequest, result) => {

  var Columns = ``;
  for (let val of RepairRequest.RRReports) {
    Columns += val.FieldValue + `,`;
  }
  var Columns = Columns.slice(0, -1);
  var query = ` Select ${Columns != '' ? Columns : ' * '} from (SELECT rr.RRNo,rr.PartNo,v.VendorName as Supplier,m.VendorName as Manufacturer,p.ManufacturerPartNo ManufacturerPart,rr.SerialNo,rr.RRDescription Description,
CASE rr.Status 
WHEN 0 THEN '${Constants.array_rr_status[0]}'
WHEN 1 THEN '${Constants.array_rr_status[1]}' 
WHEN 2 THEN '${Constants.array_rr_status[2]}'
WHEN 3 THEN '${Constants.array_rr_status[3]}'
WHEN 4 THEN '${Constants.array_rr_status[4]}'
WHEN 5 THEN '${Constants.array_rr_status[5]}'
WHEN 6 THEN '${Constants.array_rr_status[6]}'
WHEN 7 THEN '${Constants.array_rr_status[7]}'
WHEN 8 THEN '${Constants.array_rr_status[8]}'
ELSE '-'	end StatusName,
c.CompanyName Customer,d.CustomerDepartmentName as Department,rr.CustomerPONo CustomerPO,rr.SubStatusId,rr.AssigneeUserId,rr.RRPartLocationId,DATE_FORMAT(po.DueDate,'%m/%d/%Y') as PODueDate,
CONCAT(IFNULL(CURL.CurrencySymbol,CURLQ.CurrencySymbol),' ',FORMAT(IF(i.GrandTotal>=0,i.GrandTotal,If(q.GrandTotal>=0,q.GrandTotal,'TBD')),2)) RepairPrice,
FORMAT(Round(rr.PartPON),2) PriceOfNew,
FORMAT(IF(vi.GrandTotal>=0,vi.GrandTotal,If(po.GrandTotal>=0,po.GrandTotal,'TBD')),2) Cost,
vi.Shipping,
DATE_FORMAT(rr.Created,'%m/%d/%Y') AHReceivedDate,
DATE_FORMAT(q.SubmittedDate,'%m/%d/%Y') QuoteSubmittedDate,
DATE_FORMAT(q.ApprovedDate,'%m/%d/%Y') ApprovedDate,rr.VendorPONo,i.SONo SalesOrderNo,
IF(rr.Status=6,DATE_FORMAT(rr.Modified,'%m/%d/%Y'),'') RejectedDate,DATE_FORMAT(so.DueDate,'%m/%d/%Y') as SalesOrderRequiredDate,
IF(rr.Status=7,DATE_FORMAT(rr.RRCompletedDate,'%m/%d/%Y'),'') DateCompleted,i.InvoiceNo Invoice,
Case IsRushRepair when 1 then 'Yes' when 0 then 'No' else '-' END RushNormal,
Case IsWarrantyRecovery
WHEN 1 THEN '${Constants.array_IsWarrantyRepair[1]}'
WHEN 2 THEN '${Constants.array_IsWarrantyRepair[2]}'
ELSE '-'	end WarrantyRecovery,
(select CONCAT(ReferenceLabelName,": ",ReferenceValue) from tbl_repair_request_customer_ref rrcr
Left Join tbl_cutomer_reference_labels cl Using(CReferenceId)
where rrcr.IsDeleted = 0 AND RRId=rr.RRId order by 'Rank' limit 0,1) as CustomerReference1,
(select CONCAT(ReferenceLabelName,": ",ReferenceValue) from tbl_repair_request_customer_ref rrcr Left Join tbl_cutomer_reference_labels cl Using(CReferenceId)
where rrcr.IsDeleted = 0 AND RRId=rr.RRId order by 'Rank' limit 1,1) as CustomerReference2,
(select CONCAT(ReferenceLabelName,": ",ReferenceValue) from tbl_repair_request_customer_ref rrcr Left Join tbl_cutomer_reference_labels cl Using(CReferenceId)
where rrcr.IsDeleted = 0 AND RRId=rr.RRId order by 'Rank' limit 2,1) as CustomerReference3,
(select CONCAT(ReferenceLabelName,": ",ReferenceValue) from tbl_repair_request_customer_ref rrcr Left Join tbl_cutomer_reference_labels cl Using(CReferenceId)
where rrcr.IsDeleted = 0 AND RRId=rr.RRId order by 'Rank' limit 3,1) as CustomerReference4,
(select CONCAT(ReferenceLabelName,": ",ReferenceValue) from tbl_repair_request_customer_ref rrcr Left Join tbl_cutomer_reference_labels cl Using(CReferenceId)
where rrcr.IsDeleted = 0 AND RRId=rr.RRId order by 'Rank' limit 4,1) as CustomerReference5,
(select CONCAT(ReferenceLabelName,": ",ReferenceValue) from tbl_repair_request_customer_ref rrcr Left Join tbl_cutomer_reference_labels cl Using(CReferenceId)
where rrcr.IsDeleted = 0 AND RRId=rr.RRId order by 'Rank' limit 5,1) as CustomerReference6, 
(Select GROUP_CONCAT(Notes ORDER BY Notes SEPARATOR ' // ')  from tbl_repair_request_followup_notes
where IsDeleted=0 and RRId=rr.RRId) as FollowUpStatus,rrp.CustomerPartNo1,
rrp.CustomerPartNo2,
rr.StatedIssue CustomerStatedIssue,q.RouteCause RootCause,vi.VendorInvNo VendorReferenceNo,IFNULL(ca.CustomerAssetName,'') as CustomerAssetName,
(Select GROUP_CONCAT(Notes ORDER BY Notes SEPARATOR ' // ')  from tbl_repair_request_notes where IsDeleted=0 AND NotesType = 1 AND IdentityType = 3 and IdentityId=rr.RRId) as InternalNotes, rrv.VendorRefNo

FROM tbl_repair_request rr
LEFT JOIN tbl_customers c on c.CustomerId=rr.CustomerId
LEFT JOIN tbl_customer_departments d on d.CustomerDepartmentId=rr.DepartmentId
LEFT JOIN tbl_customer_assets ca on ca.CustomerAssetId=rr.AssetId
LEFT JOIN tbl_vendors v on v.VendorId=rr.VendorId
LEFT JOIN tbl_repair_request_vendors rrv on rrv.VendorId=rr.VendorId AND rrv.Status!=3 AND rrv.RRId = rr.RRId   AND rrv.IsDeleted = 0
LEFT JOIN tbl_repair_request_parts rrp on rr.RRId=rrp.RRId
LEFT JOIN tbl_parts p on p.PartId=rr.PartId
LEFT JOIN tbl_vendors m on m.VendorId=p.ManufacturerId
LEFT JOIN tbl_quotes q on q.RRId=rr.RRId  and q.RRId>0 and q.Status In(1,2,4) and q.QuoteCustomerStatus In(1,2,3) and q.IsDeleted = 0 
LEFT JOIN tbl_sales_order so on so.RRId=rr.RRId and so.RRId>0 and so.IsDeleted = 0  AND so.Status!=${Constants.CONST_SO_STATUS_CANCELLED} 
LEFT JOIN tbl_invoice i on i.RRId=rr.RRId and i.RRId>0 and i.IsDeleted = 0 AND i.Status!=${Constants.CONST_INV_STATUS_CANCELLED} 
LEFT JOIN tbl_vendor_invoice vi on vi.RRId=rr.RRId and vi.RRId>0 and vi.IsDeleted = 0 
LEFT JOIN tbl_po po on po.RRId=rr.RRId and po.RRId>0 AND po.Status!=${Constants.CONST_PO_STATUS_CANCELLED}
LEFT JOIN tbl_currencies as CURL  ON CURL.CurrencyCode = i.LocalCurrencyCode AND CURL.IsDeleted = 0 
LEFT JOIN tbl_currencies as CURLQ  ON CURLQ.CurrencyCode = q.LocalCurrencyCode AND CURLQ.IsDeleted = 0 
WHERE rr.IsDeleted=0 and ifnull(po.IsDeleted,0)=0    `;
  if (RepairRequest.IdentityType == 0 && RepairRequest.IsRestrictedCustomerAccess == 1 && RepairRequest.MultipleCustomerIds != "") {
    query += ` and rr.CustomerId in(${RepairRequest.MultipleCustomerIds}) `;
  }
  var StatusChangeFrom = '';
  var StatusChangeTo = '';
  var StatusChangeId = '';

  if (RepairRequest.ShippingStatus != "") {
    var ShippingStatus = RepairRequest.ShippingStatus;
    if (ShippingStatus == 1 || ShippingStatus == 2 || ShippingStatus == 3) {
      var Val = ShippingStatus;
      query += ` and rr.ShippingStatus = 1 and rr.ShippingIdentityType =${Val == 2 ? 1 : 2} `;
      if (ShippingStatus == 1) {
        query += ` and rr.ShippingIdentityId =${Constants.AH_GROUP_VENDOR_ID} `;
      }
      if (ShippingStatus == 3) {
        query += ` and rr.ShippingIdentityId !=${Constants.AH_GROUP_VENDOR_ID} `;
      }
      query += ` and rr.RRId In (Select RRId from   tbl_repair_request_shipping_history where IsDeleted=0) `;
    } else if (ShippingStatus == 4 || ShippingStatus == 5 || ShippingStatus == 6) {
      var Val2 = ShippingStatus;
      query += ` and rr.ShippingStatus = 2 and rr.ShippingIdentityType =${Val2 == 5 ? 1 : 2} `;
      if (ShippingStatus == 4) {
        query += ` and rr.ShippingIdentityId =${Constants.AH_GROUP_VENDOR_ID} `;
      }
      if (ShippingStatus == 6) {
        query += ` and rr.ShippingIdentityId !=${Constants.AH_GROUP_VENDOR_ID} `;
      }
      query += ` and rr.RRId In (Select RRId from   tbl_repair_request_shipping_history where IsDeleted=0) `;
    } else if (ShippingStatus == 7) {
      query += ` and rr.RRId Not In (Select RRId from  tbl_repair_request_shipping_history where IsDeleted=0) `;
    }
  }
  if (RepairRequest.ShippingStatusCategory != "") {

    if (RepairRequest.ShippingStatusCategory == 1) {
      query += ` and rr.ShippingStatus = 2 and rr.ShippingIdentityType =1  and rr.RRId Not In (Select RRId from   tbl_repair_request_shipping_history where IsDeleted=0) `;
    } else if (RepairRequest.ShippingStatusCategory == 2) {
      query += ` and rr.ShippingStatus = 2 and rr.ShippingIdentityType =2  and rr.ShippingIdentityId !=${Constants.AH_GROUP_VENDOR_ID}  and rr.RRId Not In (Select RRId from  tbl_repair_request_shipping_history where IsDeleted=0) `;
    } else if (RepairRequest.ShippingStatusCategory == 3) {
      query += ` and rr.ShippingStatus = 2 and rr.ShippingIdentityType =2  and rr.ShippingIdentityId =${Constants.AH_GROUP_VENDOR_ID}  and rr.RRId Not In (Select RRId from  tbl_repair_request_shipping_history where IsDeleted=0) `;
    } else if (RepairRequest.ShippingStatusCategory == 4) {
      query += ` and rr.ShippingStatus = 0 `;
    }
  }
  if (RepairRequest.VendorInvoiceId != "") {
    if (RepairRequest.VendorInvoiceId == 1) {
      query += " and ( rr.VendorInvoiceId>0 ) ";
    } else if (RepairRequest.VendorInvoiceId == 0) {
      query += " and ( rr.VendorInvoiceId = 0 ) ";
    }
  }
  if (RepairRequest.CustomerInvoiceId != "") {
    if (RepairRequest.CustomerInvoiceId == 1) {
      query += " and ( rr.CustomerInvoiceId>0 ) ";
    } else if (RepairRequest.CustomerInvoiceId == 0) {
      query += " and ( rr.CustomerInvoiceId = 0 ) ";
    }
  }
  if (RepairRequest.PODueDate != "") {
    query += " and  po.DueDate = '" + RepairRequest.PODueDate + "'  ";
  }
  if (RepairRequest.RRId != "") {
    query += " and  rr.RRId = '" + RepairRequest.RRId + "'  ";
  }
  if (RepairRequest.RRNo != "") {
    query += " and rr.RRNo LIKE '%" + RepairRequest.RRNo + "%' ";
  }
  if (RepairRequest.RRDescription != "") {
    query += " and rr.RRDescription LIKE '%" + RepairRequest.RRDescription + "%' ";
  }
  if (RepairRequest.PartNo != "") {
    query += " and  rr.PartNo =  '" + RepairRequest.PartNo + "'  ";
  }
  if (RepairRequest.PartId != "") {
    query += " and  rr.PartId =  '" + RepairRequest.PartId + "'  ";
  }
  if (RepairRequest.SerialNo != "") {
    query += " and  rr.SerialNo LIKE '%" + RepairRequest.SerialNo + "%'  ";
  }
  if (RepairRequest.CustomerSONo != "") {
    query += " and  rr.CustomerSONo LIKE '%" + RepairRequest.CustomerSONo + "%' ";
  }
  if (RepairRequest.RRIdCustomerSO != "") {
    query += " and  rr.RRId =  '" + RepairRequest.RRIdCustomerSO + "'  ";
  }
  if (RepairRequest.Status != "") {
    query += " and  rr.Status =  '" + RepairRequest.Status + "'  ";
  }
  if (RepairRequest.CompanyName != "") {
    query += " and  c.CompanyName LIKE '%" + RepairRequest.CompanyName + "%'  ";
  }
  if (RepairRequest.CustomerId != "") {
    query += " and rr.CustomerId IN (" + RepairRequest.CustomerId + ") ";
  }
  if (RepairRequest.CustomerGroupId != "") {
    query += " and c.CustomerGroupId IN (" + RepairRequest.CustomerGroupId + ") ";
  }
  if (RepairRequest.CustomerPartNo1 != "") {
    query += " and rrp.CustomerPartNo1  = '" + RepairRequest.CustomerPartNo1 + "'  ";
  }
  if (RepairRequest.CustomerPONo != "") {
    query += " and  rr.CustomerPONo LIKE '%" + RepairRequest.CustomerPONo + "%'  ";
  }

  if (RepairRequest.QuoteApprovedBy != "") {
    query += " ";
  }
  if (RepairRequest.IsSOCreated != "") {
    // query += " and rr.RRId IN(SELECT RRId FROM tbl_sales_order  WHERE IsDeleted=0 AND RRId = rr.RRId) ";
    query += " ";
  }

  if (RepairRequest.RRIdCustomerPO != "") {
    query += " and  rr.RRId =  '" + RepairRequest.RRIdCustomerPO + "'  ";
  }
  if (RepairRequest.ReferenceValue != "") {
    query += " and rr.RRId IN(SELECT RRId FROM tbl_repair_request_customer_ref  WHERE " + RepairRequest.ReferenceValue + " LIKE '%" + RepairRequest.ReferenceValue + "%' ) ";
  }
  if (RepairRequest.VendorName != "") {
    query += " and  v.VendorName LIKE '%" + RepairRequest.VendorName + "%'  ";
  }
  if (RepairRequest.VendorId != "") {
    query += " and rr.VendorId  = '" + RepairRequest.VendorId + "'  ";
  }
  if (RepairRequest.SubStatusId != "") {
    query += " and rr.SubStatusId  = '" + RepairRequest.SubStatusId + "'  ";
  }
  if (RepairRequest.AssigneeUserId != "") {
    query += " and rr.AssigneeUserId  = '" + RepairRequest.AssigneeUserId + "'  ";
  }
  if (RepairRequest.RRPartLocationId != "") {
    query += " and rr.RRPartLocationId  = '" + RepairRequest.RRPartLocationId + "'  ";
  }
  if (RepairRequest.VendorPONo != "") {
    query += " and  rr.VendorPONo =  '" + RepairRequest.VendorPONo + "'  ";
  }
  if (RepairRequest.RRIdVendorPO != "") {
    query += " and  rr.RRIdVendorPO =  '" + RepairRequest.RRIdVendorPO + "'  ";
  }
  if (RepairRequest.IsPartsDeliveredToCustomer != "") {
    if (RepairRequest.IsPartsDeliveredToCustomer == 1) {
      query += ` and ( rr.ShippingStatus = 2 AND rr.ShippingIdentityType=${Constants.CONST_IDENTITY_TYPE_CUSTOMER} AND rr.CustomerId = rr.ShippingIdentityId )`;
    } else if (RepairRequest.IsPartsDeliveredToCustomer == 0) {
      query += ` and ( rr.ShippingStatus != 2 OR rr.ShippingIdentityType!=${Constants.CONST_IDENTITY_TYPE_CUSTOMER} OR rr.CustomerId != rr.ShippingIdentityId )`;
    }
  }
  if (RepairRequest.StatusChangeFrom != "") {
    StatusChangeFrom = RepairRequest.StatusChangeFrom;
  }
  if (RepairRequest.StatusChangeTo != "") {
    StatusChangeTo = RepairRequest.StatusChangeTo;
  }
  if (RepairRequest.StatusChangeId != "") {
    StatusChangeId = RepairRequest.StatusChangeId;
  }
  if (RepairRequest.IsWarrantyRecovery != "") {
    query += " and  rr.IsWarrantyRecovery = '" + RepairRequest.IsWarrantyRecovery + "'  ";
  }
  if (RepairRequest.IsRushRepair != "") {
    query += " and  rr.IsRushRepair = '" + RepairRequest.IsRushRepair + "'  ";
  }
  if (RepairRequest.IsRepairTag != "") {
    query += " and  rr.IsRepairTag = '" + RepairRequest.IsRepairTag + "'  ";
  }



  if (StatusChangeFrom != '' && StatusChangeTo != '') {
    query += " and rr.RRId IN(SELECT RRId FROM tbl_repair_request_status_history  WHERE (DATE(Created) >= '" + StatusChangeFrom + "' and DATE(Created) <= '" + StatusChangeTo + "') ";
    if (StatusChangeId) {
      query += " and HistoryStatus = '" + StatusChangeId + "'";
    }
    query += ")";
  }
  else {
    if (StatusChangeFrom != '' || StatusChangeTo != '') {
      if (StatusChangeFrom != '') {
        query += " and rr.RRId IN(SELECT RRId FROM tbl_repair_request_status_history  WHERE (DATE(Created) >= '" + StatusChangeFrom + "'  ) ";
      }
      if (StatusChangeTo != '') {
        query += " and rr.RRId IN(SELECT RRId FROM tbl_repair_request_status_history  WHERE (  DATE(Created) <= '" + StatusChangeTo + "') ";
      }
      if (StatusChangeId) {
        query += " and HistoryStatus = '" + StatusChangeId + "'";
      }
      query += ")";
    }
  }
  query += " ) X  ";

  //console.log("SQL=" + query);
  con.query(query, (err, res) => {
    if (err) {
      return result(err, null);
    }
    return result(null, { ExcelData: res });
  });

};

//Get TotalCostSavings Vs CostofNewReport
RRReportsModel.TotalCostSavingsVsCostofNewReport = (RRReportsModel, result) => {

  var query = "";
  var order = "";
  var limit = "";
  var selectquery = ` SELECT  rr.PartNo,1 Quantity,
CASE rr.Status 
WHEN 0 THEN '${Constants.array_rr_status[0]}'
WHEN 1 THEN '${Constants.array_rr_status[1]}' 
WHEN 2 THEN '${Constants.array_rr_status[2]}'
WHEN 3 THEN '${Constants.array_rr_status[3]}'
WHEN 4 THEN '${Constants.array_rr_status[4]}'
WHEN 5 THEN '${Constants.array_rr_status[5]}'
WHEN 6 THEN '${Constants.array_rr_status[6]}'
WHEN 7 THEN '${Constants.array_rr_status[7]}'
WHEN 8 THEN '${Constants.array_rr_status[8]}'
ELSE '-'	end StatusName,rr.Status,rr.CustomerPONo,
rr.RRNo RepairRequestNo,c.CompanyName CustomerId,cd.CustomerDepartmentName as DepartmentName,v.VendorName Vendor,IFNULL(ca.CustomerAssetName,'') as CustomerAssetName ,
m.VendorName as Manufacturer,
p.ManufacturerPartNo,rrp.CustomerPartNo1,rrp.CustomerPartNo2,rrp.SerialNo,

CONCAT(CURL.CurrencySymbol,' ',FORMAT(IF(i.GrandTotal>=0,i.GrandTotal,If(q.GrandTotal>=0,q.GrandTotal,'TBD')),2)) CustomerRepairCost,
FORMAT(Round(rr.PartPON),2) PriceOfNew,
FORMAT(IF(i.GrandTotal>=0,i.GrandTotal,If(q.GrandTotal>=0,q.GrandTotal,'TBD'))-
IF(vi.GrandTotal>=0,vi.GrandTotal,If(po.GrandTotal>=0,po.GrandTotal,'TBD')),2) Difference,
FORMAT(IF(vi.GrandTotal>=0,vi.GrandTotal,If(po.GrandTotal>=0,po.GrandTotal,'TBD')),2) AHRepairCost,
DATE_FORMAT(rr.Created,'%m/%d/%Y') DateLogged,
DATE_FORMAT(q.SubmittedDate,'%m/%d/%Y') QuoteSubmittedToCustomer,
IF(rr.Status=7,DATE_FORMAT(rr.RRCompletedDate,'%m/%d/%Y'),'') as DateCompleted,
DATE_FORMAT(q.ApprovedDate,'%m/%d/%Y') QuoteApprovedDate,
Case IsWarrantyRecovery
WHEN 1 THEN '${Constants.array_IsWarrantyRepair[1]}'
WHEN 2 THEN '${Constants.array_IsWarrantyRepair[2]}'
ELSE '-'	end WarrantyRecovery,
Case IsRushRepair when 1 then 'Yes' when 0 then 'No' else '-' END RushNormal,
(select CONCAT(ReferenceLabelName,": ",ReferenceValue) from tbl_repair_request_customer_ref rrcr
Left Join tbl_cutomer_reference_labels cl Using(CReferenceId)
where rrcr.IsDeleted = 0 AND RRId=rr.RRId order by 'Rank' limit 0,1) as CustomerReference,
(select CONCAT(ReferenceLabelName,": ",ReferenceValue) from tbl_repair_request_customer_ref rrcr Left Join tbl_cutomer_reference_labels cl Using(CReferenceId)
where rrcr.IsDeleted = 0 AND RRId=rr.RRId order by 'Rank' limit 1,1) as CustomerReference2,
(select CONCAT(ReferenceLabelName,": ",ReferenceValue) from tbl_repair_request_customer_ref rrcr Left Join tbl_cutomer_reference_labels cl Using(CReferenceId)
where rrcr.IsDeleted = 0 AND RRId=rr.RRId order by 'Rank' limit 2,1) as CustomerReference3,
(select CONCAT(ReferenceLabelName,": ",ReferenceValue) from tbl_repair_request_customer_ref rrcr Left Join tbl_cutomer_reference_labels cl Using(CReferenceId)
where rrcr.IsDeleted = 0 AND RRId=rr.RRId order by 'Rank' limit 3,1) as CustomerReference4,
(select CONCAT(ReferenceLabelName,": ",ReferenceValue) from tbl_repair_request_customer_ref rrcr Left Join tbl_cutomer_reference_labels cl Using(CReferenceId)
where rrcr.IsDeleted = 0 AND RRId=rr.RRId order by 'Rank' limit 4,1) as CustomerReference5,
(select CONCAT(ReferenceLabelName,": ",ReferenceValue) from tbl_repair_request_customer_ref rrcr Left Join tbl_cutomer_reference_labels cl Using(CReferenceId)
where rrcr.IsDeleted = 0 AND RRId=rr.RRId order by 'Rank' limit 5,1) as CustomerReference6,
rr.StatedIssue CustomerStatedIssue,q.RouteCause RootCause,'' FromDate,''  ToDate `;
  recordfilterquery = `Select count(rr.RRId) as recordsFiltered `;
  query = query + ` FROM tbl_repair_request rr
LEFT JOIN tbl_customers c on c.CustomerId=rr.CustomerId
LEFT JOIN tbl_customer_departments cd on cd.CustomerDepartmentId=rr.DepartmentId
LEFT JOIN tbl_customer_assets ca on ca.CustomerAssetId=rr.AssetId
LEFT JOIN tbl_vendors v on v.VendorId=rr.VendorId  AND v.IsDeleted = 0
LEFT JOIN tbl_repair_request_parts rrp on rr.RRId=rrp.RRId
LEFT JOIN tbl_parts p on p.PartId=rrp.PartId
LEFT JOIN tbl_vendors m on m.VendorId=p.ManufacturerId
LEFT JOIN tbl_quotes q on q.RRId=rr.RRId  and q.RRId>0 and q.Status In(1,2,4) and q.QuoteCustomerStatus In(1,2,3) AND q.IsDeleted = 0
LEFT JOIN tbl_invoice i on i.RRId=rr.RRId and i.RRId>0 AND i.IsDeleted = 0 AND i.Status!=${Constants.CONST_INV_STATUS_CANCELLED}
LEFT JOIN tbl_vendor_invoice vi on vi.RRId=rr.RRId and vi.RRId>0 AND vi.IsDeleted = 0
LEFT JOIN tbl_po po on po.RRId=rr.RRId and po.RRId>0 AND po.IsDeleted = 0 AND po.Status!=${Constants.CONST_PO_STATUS_CANCELLED}
LEFT JOIN tbl_currencies as CURL  ON CURL.CurrencyCode = i.LocalCurrencyCode AND CURL.IsDeleted = 0 

 WHERE rr.IsDeleted=0 and rr.Status=${Constants.CONST_RRS_COMPLETED}   `;

  if (RRReportsModel.IdentityType == 0 && RRReportsModel.IsRestrictedCustomerAccess == 1 && RRReportsModel.MultipleCustomerIds != "") {
    query += ` and rr.CustomerId in(${RRReportsModel.MultipleCustomerIds}) `;
  }
  if (RRReportsModel.search.value != '') {
    query = query + ` and ( 
           rr.PartNo = '${RRReportsModel.search.value}' 
        or rr.RRNo LIKE '%${RRReportsModel.search.value}%' 
        or c.CompanyName LIKE '%${RRReportsModel.search.value}%' 
        or v.VendorName LIKE '%${RRReportsModel.search.value}%'
        or rr.Price = '${RRReportsModel.search.value}' 
        or rr.SerialNo LIKE '%${RRReportsModel.search.value}%'
        ) `;
  }

  if (RRReportsModel.CustomerId != "") {
    query += " and  rr.CustomerId In (" + RRReportsModel.CustomerId + ") ";
  }
  if (RRReportsModel.CustomerGroupId != "") {
    query += " and  c.CustomerGroupId In (" + RRReportsModel.CustomerGroupId + ") ";
  }
  if (RRReportsModel.PartNo != "") {
    query += " and  rr.PartNo ='" + RRReportsModel.PartNo + "' ";
  }
  if (RRReportsModel.FromDate != "") {
    query += " and ( rr.RRCompletedDate >='" + RRReportsModel.FromDate + "' ) ";
  }
  if (RRReportsModel.ToDate != "") {
    query += " and  rr.RRCompletedDate <='" + RRReportsModel.ToDate + "'  ";
  }
  var i = 0;
  if (RRReportsModel.order.length > 0) {
    order += " ORDER BY ";
  }
  for (i = 0; i < RRReportsModel.order.length; i++) {
    if (RRReportsModel.order[i].column != "" || RRReportsModel.order[i].column == "0")// 0 is equal to ""
    {
      switch (RRReportsModel.columns[RRReportsModel.order[i].column].name) {
        case "PartNo":
          order += " rr.PartNo " + RRReportsModel.order[i].dir + ",";
          break;
        case "RRNo":
          order += " rr.RRNo " + RRReportsModel.order[i].dir + ",";
          break;
        case "RepairRequestNo":
          order += " rr.RRNo " + RRReportsModel.order[i].dir + ",";
          break;
        case "CustomerId":
          order += " rr.CustomerId " + RRReportsModel.order[i].dir + ",";
          break;
        case "VendorId":
          order += " rr.VendorId " + RRReportsModel.order[i].dir + ",";
          break;
        default:
          order += " " + RRReportsModel.columns[RRReportsModel.order[i].column].name + " " + RRReportsModel.order[i].dir + ",";
      }
    }
  }
  order = order.slice(0, -1);
  // var tempquery = query.slice(0, -1);
  // var query = tempquery;
  var Countquery = recordfilterquery + query;
  if (RRReportsModel.start != "-1" && RRReportsModel.length != "-1") {
    limit += " LIMIT " + RRReportsModel.start + "," + (RRReportsModel.length);
  }
  query = selectquery + query + order + limit;

  var TotalCountQuery = `SELECT Count(rr.RRId) as TotalCount 
FROM tbl_repair_request rr
LEFT JOIN tbl_customers c on c.CustomerId=rr.CustomerId
LEFT JOIN tbl_customer_departments cd on cd.CustomerDepartmentId=rr.DepartmentId
LEFT JOIN tbl_vendors v on v.VendorId=rr.VendorId
LEFT JOIN tbl_repair_request_parts rrp on rr.RRId=rrp.RRId
LEFT JOIN tbl_parts p on p.PartId=rrp.PartId
LEFT JOIN tbl_vendors m on m.VendorId=p.ManufacturerId
LEFT JOIN tbl_quotes q on q.RRId=rr.RRId  and q.RRId>0 and q.Status In(1,2,4) and q.QuoteCustomerStatus In(1,2,3) AND q.IsDeleted = 0
LEFT JOIN tbl_invoice i on i.RRId=rr.RRId and i.RRId>0 AND i.IsDeleted = 0 AND i.Status!=${Constants.CONST_INV_STATUS_CANCELLED}
LEFT JOIN tbl_vendor_invoice vi on vi.RRId=rr.RRId and vi.RRId>0 AND vi.IsDeleted = 0
LEFT JOIN tbl_po po on po.RRId=rr.RRId and po.RRId>0 AND po.Status!=${Constants.CONST_PO_STATUS_CANCELLED} and po.IsDeleted = 0 
 WHERE rr.IsDeleted=0 and rr.Status=${Constants.CONST_RRS_COMPLETED}  `;
  if (RRReportsModel.IdentityType == 0 && RRReportsModel.IsRestrictedCustomerAccess == 1 && RRReportsModel.MultipleCustomerIds != "") {
    TotalCountQuery += ` and rr.CustomerId in(${RRReportsModel.MultipleCustomerIds}) `;
  }
  // console.log("query = " + query);
  //console.log("Countquery = " + Countquery);
  // console.log("TotalCountQuery = " + TotalCountQuery);
  async.parallel([
    function (result) { con.query(query, result) },
    function (result) { con.query(Countquery, result) },
    function (result) { con.query(TotalCountQuery, result) }
  ],
    function (err, results) {
      if (err)
        return result(err, null);
      result(null, {
        data: results[0][0], recordsFiltered: results[1][0][0].recordsFiltered,
        recordsTotal: results[2][0][0].TotalCount, draw: RRReportsModel.draw
      });
      return;

    });
};
//Get TotalCostSavingsVsCostofNewReport ExportToExcel
RRReportsModel.TotalCostSavingsVsCostofNewReportExportToExcel = (RRReportsModel, result) => {

  var Ids = ``;
  for (let val of RRReportsModel.RRReports) {
    Ids += val.RRId + `,`;
  }
  var RRIds = Ids.slice(0, -1);
  var query = ``;
  query = ` SELECT rr.PartNo,1 Quantity,
CASE rr.Status 
WHEN 0 THEN '${Constants.array_rr_status[0]}'
WHEN 1 THEN '${Constants.array_rr_status[1]}' 
WHEN 2 THEN '${Constants.array_rr_status[2]}'
WHEN 3 THEN '${Constants.array_rr_status[3]}'
WHEN 4 THEN '${Constants.array_rr_status[4]}'
WHEN 5 THEN '${Constants.array_rr_status[5]}'
WHEN 6 THEN '${Constants.array_rr_status[6]}'
WHEN 7 THEN '${Constants.array_rr_status[7]}'
WHEN 8 THEN '${Constants.array_rr_status[8]}'
ELSE '-'	end StatusName,rr.Status,rr.CustomerPONo,
rr.RRNo RepairRequestNo,c.CompanyName CustomerId,cd.CustomerDepartmentName as DepartmentName,v.VendorName Vendor,
m.VendorName as Manufacturer,
p.ManufacturerPartNo,rrp.CustomerPartNo1,rrp.CustomerPartNo2,rrp.SerialNo,i.LocalCurrencyCode as Currency,
IF(i.GrandTotal>=0,i.GrandTotal,If(q.GrandTotal>=0,q.GrandTotal,'TBD')) CustomerRepairCost,
Round(rr.PartPON) PriceOfNew,
IF(i.GrandTotal>=0,i.GrandTotal,If(q.GrandTotal>=0,q.GrandTotal,'TBD'))-
IF(vi.GrandTotal>=0,vi.GrandTotal,If(po.GrandTotal>=0,po.GrandTotal,'TBD')) Difference,
IF(vi.GrandTotal>=0,vi.GrandTotal,If(po.GrandTotal>=0,po.GrandTotal,'TBD')) AHRepairCost,
DATE_FORMAT(rr.Created,'%m/%d/%Y') DateLogged,
DATE_FORMAT(q.SubmittedDate,'%m/%d/%Y') QuoteSubmittedToCustomer,
DATE_FORMAT(q.ApprovedDate,'%m/%d/%Y') QuoteApprovedDate,
IF(rr.Status=7,DATE_FORMAT(rr.RRCompletedDate,'%m/%d/%Y'),'') DateCompleted,
Case IsWarrantyRecovery
WHEN 1 THEN '${Constants.array_IsWarrantyRepair[1]}'
WHEN 2 THEN '${Constants.array_IsWarrantyRepair[2]}'
ELSE '-'	end WarrantyRecovery,
Case IsRushRepair when 1 then 'Yes' when 0 then 'No' else '-' END RushNormal,
(select CONCAT(ReferenceLabelName,": ",ReferenceValue) from tbl_repair_request_customer_ref rrcr
Left Join tbl_cutomer_reference_labels cl Using(CReferenceId)
where rrcr.IsDeleted = 0 AND RRId=rr.RRId order by 'Rank' limit 0,1) as CustomerReference,
(select CONCAT(ReferenceLabelName,": ",ReferenceValue) from tbl_repair_request_customer_ref rrcr Left Join tbl_cutomer_reference_labels cl Using(CReferenceId)
where rrcr.IsDeleted = 0 AND RRId=rr.RRId order by 'Rank' limit 1,1) as CustomerReference2,
(select CONCAT(ReferenceLabelName,": ",ReferenceValue) from tbl_repair_request_customer_ref rrcr Left Join tbl_cutomer_reference_labels cl Using(CReferenceId)
where rrcr.IsDeleted = 0 AND RRId=rr.RRId order by 'Rank' limit 2,1) as CustomerReference3,
(select CONCAT(ReferenceLabelName,": ",ReferenceValue) from tbl_repair_request_customer_ref rrcr Left Join tbl_cutomer_reference_labels cl Using(CReferenceId)
where rrcr.IsDeleted = 0 AND RRId=rr.RRId order by 'Rank' limit 3,1) as CustomerReference4,
(select CONCAT(ReferenceLabelName,": ",ReferenceValue) from tbl_repair_request_customer_ref rrcr Left Join tbl_cutomer_reference_labels cl Using(CReferenceId)
where rrcr.IsDeleted = 0 AND RRId=rr.RRId order by 'Rank' limit 4,1) as CustomerReference5,
(select CONCAT(ReferenceLabelName,": ",ReferenceValue) from tbl_repair_request_customer_ref rrcr Left Join tbl_cutomer_reference_labels cl Using(CReferenceId)
where rrcr.IsDeleted = 0 AND RRId=rr.RRId order by 'Rank' limit 5,1) as CustomerReference6,
rr.StatedIssue CustomerStatedIssue,q.RouteCause RootCause,'' FromDate,''  ToDate,IFNULL(ca.CustomerAssetName,'') as CustomerAssetName 
FROM tbl_repair_request rr
LEFT JOIN tbl_customers c on c.CustomerId=rr.CustomerId
LEFT JOIN tbl_customer_departments cd on cd.CustomerDepartmentId=rr.DepartmentId
LEFT JOIN tbl_customer_assets ca on ca.CustomerAssetId=rr.AssetId
LEFT JOIN tbl_vendors v on v.VendorId=rr.VendorId
LEFT JOIN tbl_repair_request_parts rrp on rr.RRId=rrp.RRId
LEFT JOIN tbl_parts p on p.PartId=rrp.PartId
LEFT JOIN tbl_vendors m on m.VendorId=p.ManufacturerId
LEFT JOIN tbl_quotes q on q.RRId=rr.RRId  and q.RRId>0 and q.Status In(1,2,4) and q.QuoteCustomerStatus In(1,2,3) AND q.IsDeleted = 0
LEFT JOIN tbl_invoice i on i.RRId=rr.RRId and i.RRId>0  AND i.IsDeleted = 0 AND i.Status!=${Constants.CONST_INV_STATUS_CANCELLED}
LEFT JOIN tbl_vendor_invoice vi on vi.RRId=rr.RRId and vi.RRId>0 AND vi.IsDeleted = 0
LEFT JOIN tbl_po po on po.RRId=rr.RRId and po.RRId>0 AND po.Status!=${Constants.CONST_PO_STATUS_CANCELLED} and po.IsDeleted = 0 
 WHERE rr.IsDeleted=0 and rr.Status=${Constants.CONST_RRS_COMPLETED} `;
  if (RRReportsModel.IdentityType == 0 && RRReportsModel.IsRestrictedCustomerAccess == 1 && RRReportsModel.MultipleCustomerIds != "") {
    query += ` and rr.CustomerId in(${RRReportsModel.MultipleCustomerIds}) `;
  }
  if (RRReportsModel.CustomerId != "") {
    query += " and  rr.CustomerId In(" + RRReportsModel.CustomerId + " ) ";
  }
  if (RRReportsModel.CustomerGroupId != "") {
    query += " and  c.CustomerGroupId In(" + RRReportsModel.CustomerGroupId + " ) ";
  }
  if (RRReportsModel.PartNo != "") {
    query += " and  rr.PartNo ='" + RRReportsModel.PartNo + "'  ";
  }
  if (RRReportsModel.FromDate != "") {
    query += " and  rr.RRCompletedDate >='" + RRReportsModel.FromDate + "'  ";
  }
  if (RRReportsModel.ToDate != "") {
    query += " and  rr.RRCompletedDate <='" + RRReportsModel.ToDate + "'  ";
  }
  if (RRIds != '' && RRIds != null) {
    query += ` and rr.RRId in(` + RRIds + `)`;
  }
  //console.log("SQL=" + query);
  con.query(query, (err, res) => {
    if (err) {
      return result(err, null);
    }
    return result(null, { ExcelData: res });
  });
};
//Get TotalCostSavingsVsLastPricePaidReport
RRReportsModel.TotalCostSavingsVsLastPricePaidReport = (RRReportsModel, result) => {
  var query = "";
  var selectquery = ` SELECT X.*,CONCAT('$ ',FORMAT((PreviousRepairRate-NewRepairRate),2)) as Difference,CONCAT(((PreviousRepairRate-NewRepairRate)*100/PreviousRepairRate),' %') as Percentage
  from (SELECT rr.CustomerId,rr.RRId,rrp.PartId,rrp.PartNo,rrp.Description,rr.RRNo,c.CompanyName,
  FORMAT(IFNULL((SELECT IP.Price
  from tbl_invoice as I
  INNER JOIN tbl_repair_request rr1 Using(RRID)
  LEFT JOIN tbl_invoice_item IP Using(InvoiceId)
  where I.IsDeleted = 0 ANd IP.IsDeleted = 0 AND IP.PartId =rr.PartId AND rr.Created > rr1.Created
  And I.CustomerId=rr.CustomerId and I.Status=2 order by I.Created desc Limit 0, 1),0),2) as PreviousRepairRate,
  CONCAT('$ ',FORMAT(rr.Price,2)) as NewRepairRate,'' as FromDate,'' as ToDate,
  rr.Created
  FROM tbl_repair_request rr
  INNER JOIN tbl_invoice i Using(RRID)
  LEFT JOIN tbl_customers c on c.CustomerId=rr.CustomerId
  LEFT JOIN tbl_repair_request_parts rrp on rr.RRId=rrp.RRId
  WHERE rr.IsDeleted=0 and i.Status=2 AND i.IsDeleted=0 ) as X where 1=1  `;

  var recordfilterquery = `Select Count(RRId) as recordsFiltered from (SELECT rr.CustomerId,rr.RRId,rrp.PartId,
    rrp.PartNo,rr.Created
  FROM tbl_repair_request rr
  INNER JOIN tbl_invoice i Using(RRID)
  LEFT JOIN tbl_customers c on c.CustomerId=rr.CustomerId
  LEFT JOIN tbl_repair_request_parts rrp on rr.RRId=rrp.RRId
  WHERE rr.IsDeleted=0 and i.Status=2 )  as x where 1=1  `;

  if (RRReportsModel.CustomerId != "") {
    query += " and CustomerId In(" + RRReportsModel.CustomerId + ") ";
  }
  if (RRReportsModel.PartNo != "") {
    query += " and ( PartNo ='" + RRReportsModel.PartNo + "' ) ";
  }
  if (RRReportsModel.FromDate != "") {
    query += " and ( Created >='" + RRReportsModel.FromDate + "' ) ";
  }
  if (RRReportsModel.ToDate != "") {
    query += " and ( Created <='" + RRReportsModel.ToDate + "'  ) ";
  }
  var Countquery = recordfilterquery + query;
  var i = 0;
  if (RRReportsModel.order.length > 0) {
    query += " ORDER BY ";
  }
  for (i = 0; i < RRReportsModel.order.length; i++) {
    if (RRReportsModel.order[i].column != "" || RRReportsModel.order[i].column == "0")// 0 is equal to ""
    {
      switch (RRReportsModel.columns[RRReportsModel.order[i].column].name) {
        case "RRNo":
          query += " RRNo " + RRReportsModel.order[i].dir + ",";
          break;
        case "CustomerId":
          query += " CustomerId " + RRReportsModel.order[i].dir + ",";
          break;
        case "PartNo":
          query += " PartNo " + RRReportsModel.order[i].dir + ",";
          break;
        default:
          query += " " + RRReportsModel.columns[RRReportsModel.order[i].column].name + " " + RRReportsModel.order[i].dir + ",";
      }
    }
  }
  var tempquery = query.slice(0, -1);
  var query = tempquery;

  if (RRReportsModel.start != "-1" && RRReportsModel.length != "-1") {
    query += " LIMIT " + RRReportsModel.start + "," + (RRReportsModel.length);
  }
  query = selectquery + query;
  var TotalCountQuery = `SELECT Count(*) as TotalCount
  FROM tbl_repair_request rr
  INNER JOIN tbl_invoice i Using(RRID)
  LEFT JOIN tbl_customers c on c.CustomerId=rr.CustomerId
  LEFT JOIN tbl_repair_request_parts rrp on rr.RRId=rrp.RRId
  WHERE rr.IsDeleted=0 and i.Status=2 `;

  // console.log("query = " + query);
  //console.log("Countquery = " + Countquery);
  //console.log("TotalCountQuery = " + TotalCountQuery);
  async.parallel([
    function (result) { con.query(query, result) },
    function (result) { con.query(Countquery, result) },
    function (result) { con.query(TotalCountQuery, result) }
  ],
    function (err, results) {
      if (err)
        return result(err, null);

      //   if (results[0][0].length > 0) {
      result(null, {
        data: results[0][0], recordsFiltered: results[1][0][0].recordsFiltered,
        recordsTotal: results[2][0][0].TotalCount, draw: RRReportsModel.draw
      });
      return;
      // }
      // else {
      //   result(null, "No record");
      //   return;
      // }
    });
};
//Get TotalCostSavingsVsLastPricePaidReportExportToExcel
RRReportsModel.TotalCostSavingsVsLastPricePaidReportExportToExcel = (reqBody, result) => {

  var Ids = ``;
  for (let val of reqBody.RRReports) {
    Ids += val.RRId + `,`;
  }
  var RRIds = Ids.slice(0, -1);

  var query = ``;
  query = ` SELECT X.*,CONCAT('$ ',(PreviousRepairRate-NewRepairRate)) as Difference,CONCAT(((PreviousRepairRate-NewRepairRate)*100/PreviousRepairRate),' %') as Percentage
  from (
  SELECT rr.RRId,rr.CustomerId,rr.Created,rrp.PartNo,rrp.Description,rr.RRNo,c.CompanyName,
  IFNULL((SELECT IP.Price
  from tbl_invoice as I
  INNER JOIN tbl_repair_request rr1 Using(RRID)
  LEFT JOIN tbl_invoice_item IP Using(InvoiceId)
  where I.IsDeleted = 0 ANd IP.IsDeleted = 0 AND IP.PartId =rr.PartId AND rr.Created > rr1.Created
  And I.CustomerId=rr.CustomerId and I.Status=2 order by I.Created desc Limit 0, 1),0) as PreviousRepairRate,
  CONCAT('$ ',rr.Price) as NewRepairRate
  FROM tbl_repair_request rr
  INNER JOIN tbl_invoice i Using(RRID) 
  LEFT JOIN tbl_customers c on c.CustomerId=rr.CustomerId
  LEFT JOIN tbl_repair_request_parts rrp on rr.RRId=rrp.RRId
  WHERE rr.IsDeleted=0 and i.Status=2 AND i.IsDeleted=0 ) as X where 1=1 `;
  if (reqBody.CustomerId != "") {
    query += " and  CustomerId In(" + reqBody.CustomerId + ") ";
  }
  if (reqBody.PartNo != "") {
    query += " and ( PartNo ='" + reqBody.PartNo + "' ) ";
  }
  if (reqBody.FromDate != "") {
    query += " and ( Created >='" + reqBody.FromDate + "'  ) ";
  }
  if (reqBody.ToDate != "") {
    query += " and ( Created <='" + reqBody.ToDate + "'  ) ";
  }
  if (RRIds != '' && RRIds != null) {
    query += ` and RRId in(` + RRIds + `)`;
  }
  // console.log("SQL=" + query);
  con.query(query, (err, res) => {
    if (err) {
      return result(err, null);
    }
    return result(null, { ExcelData: res });
  });
};
// Get TotalCostSavings Vs LastPricePaidReport
// RRReportsModel.TotalCostSavingsVsLastPricePaidReport = (RRReportsModel, result) => {

//   var query = "";
//   selectquery = "";

//   selectquery = `SELECT rr.CustomerId,rr.RRId,rrp.PartNo,rrp.Description,rr.RRNo,c.CompanyName,
//     '0' as PreviousRepairRate,rr.Price as NewRepairRate,'0' as Difference ,'0.00 %' as Percentage,'' as FromDate,'' as ToDate,
//     DATE_FORMAT(rr.Created,'%m/%d/%Y') as Created `;
//   recordfilterquery = `Select count(rr.RRId) as recordsFiltered `;
//   query = query + ` FROM tbl_repair_request rr
//     LEFT JOIN tbl_customers c on c.CustomerId=rr.CustomerId
//     LEFT JOIN tbl_repair_request_parts rrp on rr.RRId=rrp.RRId 
//     WHERE rr.IsDeleted=0 `;

//   if (RRReportsModel.search.value != '') {
//     query = query + ` and ( 
//            rrp.PartNo LIKE '%${RRReportsModel.search.value}%' 
//         or rrp.Description LIKE '%${RRReportsModel.search.value}%' 
//         or rr.RRNo LIKE '%${RRReportsModel.search.value}%' 
//         or c.CompanyName LIKE '%${RRReportsModel.search.value}%' 
//         or rr.Price LIKE '%${RRReportsModel.search.value}%' 
//         ) `;
//   }
//   if (RRReportsModel.CustomerId != "") {
//     query += " and ( rr.CustomerId ='" + RRReportsModel.CustomerId + "' ) ";
//   }
//   if (RRReportsModel.PartNo != "") {
//     query += " and ( rr.PartNo ='" + RRReportsModel.PartNo + "' ) ";
//   }
//   if (RRReportsModel.FromDate != "") {
//     query += " and ( rr.Created >='" + RRReportsModel.FromDate + "' ) ";
//   }
//   if (RRReportsModel.ToDate != "") {
//     query += " and ( rr.Created <='" + RRReportsModel.ToDate + "' ) ";
//   }
//   var i = 0;
//   if (RRReportsModel.order.length > 0) {
//     query += " ORDER BY ";
//   }
//   for (i = 0; i < RRReportsModel.order.length; i++) {
//     if (RRReportsModel.order[i].column != "" || RRReportsModel.order[i].column == "0")// 0 is equal to ""
//     {
//       switch (RRReportsModel.columns[RRReportsModel.order[i].column].name) {
//         case "PartNo":
//           query += " rrp.PartNo " + RRReportsModel.order[i].dir + ",";
//           break;
//         case "RRNo":
//           query += " rr.RRNo " + RRReportsModel.order[i].dir + ",";
//           break;
//         case "CustomerId":
//           query += " rr.CustomerId " + RRReportsModel.order[i].dir + ",";
//           break;
//         default:
//           query += " " + RRReportsModel.columns[RRReportsModel.order[i].column].name + " " + RRReportsModel.order[i].dir + ",";

//       }
//     }
//   }
//   console.log("before query slice =" + query);
//   var tempquery = query.slice(0, -1);
//   var query = tempquery;
//   var Countquery = recordfilterquery + query;
//   if (RRReportsModel.start != "-1" && RRReportsModel.length != "-1") {
//     query += " LIMIT " + RRReportsModel.start + "," + (RRReportsModel.length);
//   }
//   query = selectquery + query;

//   var TotalCountQuery = `SELECT Count(rr.RRId) as TotalCount 
//     FROM tbl_repair_request rr
//     LEFT JOIN tbl_customers c on c.CustomerId=rr.CustomerId
//     LEFT JOIN tbl_repair_request_parts rrp on rr.RRId=rrp.RRId 
//     WHERE rr.IsDeleted=0 `;

//   console.log("query = " + query);
//   console.log("Countquery = " + Countquery);
//   console.log("TotalCountQuery = " + TotalCountQuery);
//   async.parallel([
//     function (result) { con.query(query, result) },
//     function (result) { con.query(Countquery, result) },
//     function (result) { con.query(TotalCountQuery, result) }
//   ],
//     function (err, results) {
//       if (err)
//         return result(err, null);

//       if (results[0][0].length > 0) {
//         result(null, {
//           data: results[0][0], recordsFiltered: results[1][0][0].recordsFiltered,
//           recordsTotal: results[2][0][0].TotalCount, draw: RRReportsModel.draw
//         });
//         return;
//       }
//       else {
//         result(null, "No record");
//         return;
//       }
//     });
// };
//Get TotalCostSavingsVsLastPricePaidReport ExportToExcel
// RRReportsModel.TotalCostSavingsVsLastPricePaidReportExportToExcel = (RRReportsModel, result) => {

//   var Ids = ``;
//   for (let val of RRReportsModel.RRReports) {
//     Ids += val.RRId + `,`;
//   }
//   var RRIds = Ids.slice(0, -1);
//   var query = ``;
//   query = ` SELECT rrp.PartNo,rrp.Description,rr.RRNo,c.CompanyName,
//   '0' as PreviousRepairRate,rr.Price as NewRepairRate,'0' as Difference ,'0.00 %' as Percentage
//   FROM tbl_repair_request rr
//   LEFT JOIN tbl_customers c on c.CustomerId=rr.CustomerId
//   LEFT JOIN tbl_repair_request_parts rrp on rr.RRId=rrp.RRId 
//   WHERE rr.IsDeleted=0 `;
//   if (RRReportsModel.CustomerId != "") {
//     query += " and ( rr.CustomerId ='" + RRReportsModel.CustomerId + "' ) ";
//   }
//   if (RRReportsModel.PartNo != "") {
//     query += " and ( rr.PartNo ='" + RRReportsModel.PartNo + "' ) ";
//   }
//   if (RRReportsModel.FromDate != "") {
//     query += " and ( rr.Created >='" + RRReportsModel.FromDate + "' ) ";
//   }
//   if (RRReportsModel.ToDate != "") {
//     query += " and ( rr.Created <='" + RRReportsModel.ToDate + "' ) ";
//   }
//   if (RRIds != '' && RRIds != null) {
//     query += ` and rr.RRId in(` + RRIds + `)`;
//   }
//   console.log("SQL=" + query);
//   con.query(query, (err, res) => {
//     if (err) {
//       return result(err, null);
//     }
//     return result(null, { ExcelData: res });
//   });
// };
//Get OnTimeDeliveryReport
RRReportsModel.OnTimeDeliveryReport = (RRReportsModel, result) => {

  var query = "";
  selectquery = "";

  selectquery = `SELECT c.CustomerId,rr.RRId,rrp.PartNo,rrp.Description,rr.RRNo,c.CompanyName,
  DATE_FORMAT(s.DueDate,'%m/%d/%Y') as DueDateAtTimeOfOrder,DATE_FORMAT(rrsh.ShipDate,'%m/%d/%Y') as ActualDateShipped ,
  DATEDIFF(rrsh.ShipDate,s.DueDate) as DifferenceInDays,'' as FromDate,'' as ToDate,
  DATE_FORMAT(rr.Created,'%m/%d/%Y') as Created
   `;
  recordfilterquery = `Select count(rr.RRId) as recordsFiltered `;
  query = query + ` FROM tbl_repair_request rr
  LEFT JOIN tbl_sales_order s on s.RRId=rr.RRId
  LEFT JOIN tbl_repair_request_shipping_history rrsh on rrsh.RRId=rr.RRId and rrsh.ShipToIdentity='${Constants.CONST_IDENTITY_TYPE_CUSTOMER}' and rrsh.ShipToId=rr.CustomerId
  LEFT JOIN tbl_customers c on c.CustomerId=rr.CustomerId
  LEFT JOIN tbl_repair_request_parts rrp on rr.RRId=rrp.RRId
  WHERE rr.IsDeleted=0 `;

  if (RRReportsModel.search.value != '') {
    query = query + ` and ( 
           rrp.Description LIKE '%${RRReportsModel.search.value}%' 
        or rr.RRNo LIKE '%${RRReportsModel.search.value}%' 
        or c.CompanyName LIKE '%${RRReportsModel.search.value}%'  
        ) `;
  }
  if (RRReportsModel.CustomerId != "") {
    query += " and  rr.CustomerId In(" + RRReportsModel.CustomerId + ") ";
  }
  if (RRReportsModel.FromDate != "") {
    query += " and ( rr.Created >='" + RRReportsModel.FromDate + "' ) ";
  }
  if (RRReportsModel.ToDate != "") {
    query += " and ( rr.Created <='" + RRReportsModel.ToDate + "' ) ";
  }
  var i = 0;
  if (RRReportsModel.order.length > 0) {
    query += " ORDER BY ";
  }
  for (i = 0; i < RRReportsModel.order.length; i++) {
    if (RRReportsModel.order[i].column != "" || RRReportsModel.order[i].column == "0")// 0 is equal to ""
    {
      switch (RRReportsModel.columns[RRReportsModel.order[i].column].name) {
        case "RRNo":
          query += " rr.RRNo " + RRReportsModel.order[i].dir + ",";
          break;
        case "CustomerId":
          query += " rr.CustomerId " + RRReportsModel.order[i].dir + ",";
          break;
        default:
          query += " " + RRReportsModel.columns[RRReportsModel.order[i].column].name + " " + RRReportsModel.order[i].dir + ",";

      }
    }
  }
  //console.log("before query slice =" + query);
  var tempquery = query.slice(0, -1);
  var query = tempquery;
  var Countquery = recordfilterquery + query;
  if (RRReportsModel.start != "-1" && RRReportsModel.length != "-1") {
    query += " LIMIT " + RRReportsModel.start + "," + (RRReportsModel.length);
  }
  query = selectquery + query;

  var TotalCountQuery = `SELECT Count(rr.RRId) as TotalCount 
  FROM tbl_repair_request rr
  LEFT JOIN tbl_sales_order s on s.RRId=rr.RRId
  LEFT JOIN tbl_repair_request_shipping_history rrsh on rrsh.RRId=rr.RRId and rrsh.ShipToIdentity='${Constants.CONST_IDENTITY_TYPE_CUSTOMER}' and rrsh.ShipToId=rr.CustomerId
  LEFT JOIN tbl_customers c on c.CustomerId=rr.CustomerId
  LEFT JOIN tbl_repair_request_parts rrp on rr.RRId=rrp.RRId
  WHERE rr.IsDeleted=0 `;

  // console.log("query = " + query);
  // console.log("Countquery = " + Countquery);
  // console.log("TotalCountQuery = " + TotalCountQuery);
  async.parallel([
    function (result) { con.query(query, result) },
    function (result) { con.query(Countquery, result) },
    function (result) { con.query(TotalCountQuery, result) }
  ],
    function (err, results) {
      if (err)
        return result(err, null);

      // if (results[0][0].length > 0) {
      result(null, {
        data: results[0][0], recordsFiltered: results[1][0][0].recordsFiltered,
        recordsTotal: results[2][0][0].TotalCount, draw: RRReportsModel.draw
      });
      return;
      // }
      // else {
      //   result(null, "No record");
      //   return;
      // }
    });
};
//Get OnTimeDeliveryReport ExportToExcel
RRReportsModel.OnTimeDeliveryReportExportToExcel = (RRReportsModel, result) => {

  var Ids = ``;
  for (let val of RRReportsModel.RRReports) {
    Ids += val.RRId + `,`;
  }
  var RRIds = Ids.slice(0, -1);
  var query = ``;
  query = ` SELECT rrp.PartNo,rrp.Description,rr.RRNo,c.CompanyName,
  DATE_FORMAT(s.DueDate,'%m/%d/%Y') as DueDateAtTimeOfOrder,DATE_FORMAT(rrsh.ShipDate,'%m/%d/%Y') as ActualDateShipped ,
  DATEDIFF(rrsh.ShipDate,s.DueDate) as DifferenceInDays,'' as FromDate,'' as ToDate,
  DATE_FORMAT(rr.Created,'%m/%d/%Y') as Created
  FROM tbl_repair_request rr
  LEFT JOIN tbl_sales_order s on s.RRId=rr.RRId
  LEFT JOIN tbl_repair_request_shipping_history rrsh on rrsh.RRId=rr.RRId and rrsh.ShipToIdentity=1 and rrsh.ShipToId=rr.CustomerId
  LEFT JOIN tbl_customers c on c.CustomerId=rr.CustomerId
  LEFT JOIN tbl_repair_request_parts rrp on rr.RRId=rrp.RRId
  WHERE rr.IsDeleted=0 `;
  if (RRReportsModel.CustomerId != "") {
    query += " and rr.CustomerId In(" + RRReportsModel.CustomerId + ") ";
  }
  if (RRReportsModel.FromDate != "") {
    query += " and ( rr.Created >='" + RRReportsModel.FromDate + "' ) ";
  }
  if (RRReportsModel.ToDate != "") {
    query += " and ( rr.Created <='" + RRReportsModel.ToDate + "' ) ";
  }
  if (RRIds != '' && RRIds != null) {
    query += ` and rr.RRId in(` + RRIds + `)`;
  }
  //console.log("SQL=" + query);
  con.query(query, (err, res) => {
    if (err) {
      return result(err, null);
    }
    return result(null, { ExcelData: res });
  });
};
//Get OpenOrderReport
RRReportsModel.OpenOrderReport = (RRReportsModel, result) => {

  var query = "";
  selectquery = "";

  selectquery = `SELECT rr.RRId,rr.RRNo,d.CustomerDepartmentName,ifnull(v.VendorName,'') Manufacturer,rrp.ManufacturerPartNo,
  rrp.SerialNo,rrp.Description,CASE rr.Status
  WHEN 0 THEN '${Constants.array_rr_status[0]}'
  WHEN 1 THEN '${Constants.array_rr_status[1]}' 
  WHEN 2 THEN '${Constants.array_rr_status[2]}' 
  WHEN 3 THEN '${Constants.array_rr_status[3]}' 
  WHEN 4 THEN '${Constants.array_rr_status[4]}' 
  WHEN 5 THEN '${Constants.array_rr_status[5]}' 
  WHEN 6 THEN '${Constants.array_rr_status[6]}' 
  WHEN 7 THEN '${Constants.array_rr_status[7]}' 
  WHEN 8 THEN '${Constants.array_rr_status[8]}'
  ELSE '-'	end StatusName,rr.Status,c.CompanyName,rr.CustomerPONo,rr.Price,d.CustomerDepartmentId,a.CustomerAssetId `;
  recordfilterquery = `Select count(rr.RRId) as recordsFiltered `;
  query = query + ` FROM tbl_repair_request rr
  LEFT JOIN tbl_customers c on c.CustomerId=rr.CustomerId
  LEFT JOIN tbl_customer_assets a on a.CustomerAssetId=rr.AssetId
  LEFT JOIN tbl_customer_departments d on d.CustomerDepartmentId=rr.DepartmentId
  LEFT JOIN tbl_repair_request_parts rrp on rr.RRId=rrp.RRId
 LEFT JOIN tbl_vendors v on v.VendorId=rrp.Manufacturer
  WHERE rr.IsDeleted=0 `;

  if (RRReportsModel.search.value != '') {
    var StatusNameSearch = RRReportsModel.search.value;
    switch (RRReportsModel.search.value) {
      case Constants.array_rr_status[0]:
        StatusNameSearch = 0;
        break;
      case Constants.array_rr_status[1]:
        StatusNameSearch = 1;
        break;
      case Constants.array_rr_status[2]:
        StatusNameSearch = 2;
        break;
      case Constants.array_rr_status[3]:
        StatusNameSearch = 3;
        break;
      case Constants.array_rr_status[4]:
        StatusNameSearch = 4;
        break;
      case Constants.array_rr_status[5]:
        StatusNameSearch = 5;
        break;
      case Constants.array_rr_status[6]:
        StatusNameSearch = 6;
        break;
      case Constants.array_rr_status[7]:
        StatusNameSearch = 7;
        break;
      case Constants.array_rr_status[8]:
        StatusNameSearch = 8;
        break;
    }
    RRReportsModel.search.value = StatusNameSearch;
    query = query + ` and ( 
         rr.RRNo = '${RRReportsModel.search.value}'
      or d.CustomerDepartmentName = '${RRReportsModel.search.value}' 
      or rrp.Manufacturer = '${RRReportsModel.search.value}' 
      or rrp.ManufacturerPartNo = '${RRReportsModel.search.value}' 
      or rrp.SerialNo = '${RRReportsModel.search.value}'  
      or rrp.Description = '${RRReportsModel.search.value}'
      or rr.Status = '${RRReportsModel.search.value}'  
      or c.CompanyName = '${RRReportsModel.search.value}'  
      or rr.CustomerPONo = '${RRReportsModel.search.value}' 
      or a.CustomerAssetName = '${RRReportsModel.search.value}' 
      or rr.Price = '${RRReportsModel.search.value}' 
      ) `;
  }
  if (RRReportsModel.Manufacturer != "") {
    query += " and ( rrp.Manufacturer ='" + RRReportsModel.Manufacturer + "' ) ";
  }
  if (RRReportsModel.ManufacturerPartNo != "") {
    query += " and ( rrp.ManufacturerPartNo ='" + RRReportsModel.ManufacturerPartNo + "' ) ";
  }
  if (RRReportsModel.SerialNo != "") {
    query += " and ( rr.SerialNo ='" + RRReportsModel.SerialNo + "' ) ";
  }
  if (RRReportsModel.Status != "") {
    query += " and ( rr.Status ='" + RRReportsModel.Status + "' ) ";
  }
  if (RRReportsModel.CustomerId != "") {
    query += " and rr.CustomerId In(" + RRReportsModel.CustomerId + ") ";
  }
  if (RRReportsModel.CustomerDepartmentId != "") {
    query += " and ( rr.DepartmentId ='" + RRReportsModel.CustomerDepartmentId + "' ) ";
  }
  if (RRReportsModel.CustomerPONo != "") {
    query += " and ( rr.CustomerPONo ='" + RRReportsModel.CustomerPONo + "' ) ";
  }
  if (RRReportsModel.CustomerAssetId != "") {
    query += " and ( rr.AssetId ='" + RRReportsModel.CustomerAssetId + "' ) ";
  }
  var i = 0;
  if (RRReportsModel.order.length > 0) {
    query += " ORDER BY ";
  }
  for (i = 0; i < RRReportsModel.order.length; i++) {
    if (RRReportsModel.order[i].column != "" || RRReportsModel.order[i].column == "0")// 0 is equal to ""
    {
      switch (RRReportsModel.columns[RRReportsModel.order[i].column].name) {
        case "SerialNo":
          query += " rrp.SerialNo " + RRReportsModel.order[i].dir + ",";
          break;
        case "CustomerId":
          query += " rr.CustomerId " + RRReportsModel.order[i].dir + ",";
          break;
        case "Status":
          query += " rr.Status " + RRReportsModel.order[i].dir + ",";
          break;
        default:
          query += " " + RRReportsModel.columns[RRReportsModel.order[i].column].name + " " + RRReportsModel.order[i].dir + ",";
      }
    }
  }
  var tempquery = query.slice(0, -1);
  var query = tempquery;
  var Countquery = recordfilterquery + query;
  if (RRReportsModel.start != "-1" && RRReportsModel.length != "-1") {
    query += " LIMIT " + RRReportsModel.start + "," + (RRReportsModel.length);
  }
  query = selectquery + query;

  var TotalCountQuery = `SELECT Count(rr.RRId) as TotalCount 
  FROM tbl_repair_request rr
  LEFT JOIN tbl_customers c on c.CustomerId=rr.CustomerId
  LEFT JOIN tbl_customer_assets a on a.CustomerAssetId=rr.AssetId
  LEFT JOIN tbl_customer_departments d on d.CustomerDepartmentId=rr.DepartmentId
  LEFT JOIN tbl_repair_request_parts rrp on rr.RRId=rrp.RRId 
  LEFT JOIN tbl_vendors v on v.VendorId=rrp.Manufacturer
  WHERE rr.IsDeleted=0 `;

  //console.log("query = " + query);
  // console.log("Countquery = " + Countquery);
  //console.log("TotalCountQuery = " + TotalCountQuery);
  async.parallel([
    function (result) { con.query(query, result) },
    function (result) { con.query(Countquery, result) },
    function (result) { con.query(TotalCountQuery, result) }
  ],
    function (err, results) {
      if (err)
        return result(err, null);

      //  if (results[0][0].length > 0) {
      result(null, {
        data: results[0][0], recordsFiltered: results[1][0][0].recordsFiltered,
        recordsTotal: results[2][0][0].TotalCount, draw: RRReportsModel.draw
      });
      return;
      // }
      // else {
      //   result(null, "No record");
      //   return;
      // }
    });
};
//Get OpenOrderReport ExportToExcel
RRReportsModel.OpenOrderReportExportToExcel = (RRReportsModel, result) => {

  var Ids = ``;
  for (let val of RRReportsModel.RRReports) {
    Ids += val.RRId + `,`;
  }
  var RRIds = Ids.slice(0, -1);

  var query = ``;
  query = ` SELECT rr.RRId,rr.RRNo,d.CustomerDepartmentName,ifnull(v.VendorName,'') Manufacturer,rrp.ManufacturerPartNo,
  rrp.SerialNo,rrp.Description,CASE rr.Status
  WHEN 0 THEN '${Constants.array_rr_status[0]}'
  WHEN 1 THEN '${Constants.array_rr_status[1]}' 
  WHEN 2 THEN '${Constants.array_rr_status[2]}' 
  WHEN 3 THEN '${Constants.array_rr_status[3]}' 
  WHEN 4 THEN '${Constants.array_rr_status[4]}' 
  WHEN 5 THEN '${Constants.array_rr_status[5]}' 
  WHEN 6 THEN '${Constants.array_rr_status[6]}' 
  WHEN 7 THEN '${Constants.array_rr_status[7]}' 
  WHEN 8 THEN '${Constants.array_rr_status[8]}' 
  ELSE '-'	end StatusName,c.CompanyName,rr.CustomerPONo,rr.Price
  FROM tbl_repair_request rr
  LEFT JOIN tbl_customers c on c.CustomerId=rr.CustomerId
  LEFT JOIN tbl_customer_assets a on a.CustomerAssetId=rr.AssetId
  LEFT JOIN tbl_customer_departments d on d.CustomerDepartmentId=rr.DepartmentId
  LEFT JOIN tbl_repair_request_parts rrp on rr.RRId=rrp.RRId 
  LEFT JOIN tbl_vendors v on v.VendorId=rrp.Manufacturer
  WHERE rr.IsDeleted=0 `;
  if (RRReportsModel.Manufacturer != "") {
    query += " and ( rrp.Manufacturer ='" + RRReportsModel.Manufacturer + "' ) ";
  }
  if (RRReportsModel.ManufacturerPartNo != "") {
    query += " and ( rrp.ManufacturerPartNo ='" + RRReportsModel.ManufacturerPartNo + "' ) ";
  }
  if (RRReportsModel.SerialNo != "") {
    query += " and ( rr.SerialNo ='" + RRReportsModel.SerialNo + "' ) ";
  }
  if (RRReportsModel.Status != "") {
    query += " and ( rr.Status ='" + RRReportsModel.Status + "' ) ";
  }
  if (RRReportsModel.CustomerId != "") {
    query += " and rr.CustomerId In(" + RRReportsModel.CustomerId + ") ";
  }
  if (RRReportsModel.CustomerDepartmentId != "") {
    query += " and ( rr.DepartmentId ='" + RRReportsModel.CustomerDepartmentId + "' ) ";
  }
  if (RRReportsModel.CustomerPONo != "") {
    query += " and ( rr.CustomerPONo ='" + RRReportsModel.CustomerPONo + "' ) ";
  }
  if (RRReportsModel.CustomerAssetId != "") {
    query += " and ( rr.AssetId ='" + RRReportsModel.CustomerAssetId + "' ) ";
  }
  if (RRIds != '' && RRIds != null) {
    query += ` and rr.RRId in(` + RRIds + `)`;
  }
  //console.log("SQL=" + query);
  con.query(query, (err, res) => {
    if (err) {
      return result(err, null);
    }
    return result(null, { ExcelData: res });
  });
};
//Get ProcessFitnessReport
RRReportsModel.ProcessFitnessReport = (RRReportsModel, result) => {

  var query = "";
  selectquery = "";

  selectquery = ` SELECT rr.RRNo,v.VendorName,rrp.PartNo,rrp.SerialNo,rr.Created, 
  (select CASE WHEN HistoryStatus = '0' THEN Created ELSE "-" END from tbl_repair_request_status_history where  IsDeleted = 0 AND RRId=rr.RRId limit 0,1) as RRGenerated,
  (select CASE WHEN HistoryStatus = '1' THEN Created ELSE "-" END from tbl_repair_request_status_history where  IsDeleted = 0 AND RRId=rr.RRId limit 1,1) as AwaitingVendorSelection,
  (select CASE WHEN HistoryStatus = '2' THEN Created ELSE "-" END from tbl_repair_request_status_history where  IsDeleted = 0 AND RRId=rr.RRId limit 2,1) as AwaitingVendorQuote,
  (select CASE WHEN HistoryStatus = '3' THEN Created ELSE "-" END from tbl_repair_request_status_history where  IsDeleted = 0 AND RRId=rr.RRId limit 3,1) as ResourceVendorChange,
  (select CASE WHEN HistoryStatus = '4' THEN Created ELSE "-" END from tbl_repair_request_status_history where  IsDeleted = 0 AND RRId=rr.RRId limit 4,1) as QuotedAwaitingCustomerPO,
  (select CASE WHEN HistoryStatus = '5' THEN Created ELSE "-" END from tbl_repair_request_status_history where  IsDeleted = 0 AND RRId=rr.RRId limit 5,1) as RepairInProcess,
  (select CASE WHEN HistoryStatus = '6' THEN Created ELSE "-" END from tbl_repair_request_status_history where  IsDeleted = 0 AND RRId=rr.RRId limit 6,1) as QuoteRejected,
  (select CASE WHEN HistoryStatus = '7' THEN Created ELSE "-" END from tbl_repair_request_status_history where  IsDeleted = 0 AND RRId=rr.RRId limit 7,1) as Completed `;
  recordfilterquery = `Select count(rr.RRId) as recordsFiltered `;
  query = query + ` from tbl_repair_request rr
  Left JOIN  tbl_vendors v on v.VendorId=rr.VendorId
  Left JOIN  tbl_repair_request_parts rrp on rrp.RRId=rr.RRId where rr.IsDeleted=0 `;

  if (RRReportsModel.CustomerId != "") {
    query += " and  rr.CustomerId In(" + RRReportsModel.CustomerId + ") ";
  }
  if (RRReportsModel.VendorId != "") {
    query += " and ( rr.VendorId ='" + RRReportsModel.VendorId + "' ) ";
  }
  if (RRReportsModel.RRNo != "") {
    query += " and ( rr.RRNo ='" + RRReportsModel.RRNo + "' ) ";
  }
  if (RRReportsModel.FromDate != "") {
    query += " and ( rr.Created >='" + RRReportsModel.FromDate + "' ) ";
  }
  if (RRReportsModel.ToDate != "") {
    query += " and ( rr.Created <='" + RRReportsModel.ToDate + "' ) ";
  }
  var i = 0;
  if (RRReportsModel.order.length > 0) {
    query += " ORDER BY ";
  }
  for (i = 0; i < RRReportsModel.order.length; i++) {
    if (RRReportsModel.order[i].column != "" || RRReportsModel.order[i].column == "0")// 0 is equal to ""
    {
      switch (RRReportsModel.columns[RRReportsModel.order[i].column].name) {
        case "RRNo":
          query += " rr.RRNo " + RRReportsModel.order[i].dir + ",";
          break;
        case "CustomerId":
          query += " rr.CustomerId " + RRReportsModel.order[i].dir + ",";
          break;
        case "VendorId":
          query += " rr.VendorId " + RRReportsModel.order[i].dir + ",";
          break;
        case "Created":
          query += " rr.Created " + RRReportsModel.order[i].dir + ",";
          break;
        default:
          query += " " + RRReportsModel.columns[RRReportsModel.order[i].column].name + " " + RRReportsModel.order[i].dir + ",";

      }
    }
  }
  var tempquery = query.slice(0, -1);
  var query = tempquery;
  var Countquery = recordfilterquery + query;
  if (RRReportsModel.start != "-1" && RRReportsModel.length != "-1") {
    query += " LIMIT " + RRReportsModel.start + "," + (RRReportsModel.length);
  }
  query = selectquery + query;

  var TotalCountQuery = `SELECT Count(rr.RRId) as TotalCount 
  from tbl_repair_request rr
  Left JOIN  tbl_vendors v on v.VendorId=rr.VendorId
  Left JOIN  tbl_repair_request_parts rrp on rrp.RRId=rr.RRId where rr.IsDeleted=0 `;

  // console.log("query = " + query);
  // console.log("Countquery = " + Countquery);
  //console.log("TotalCountQuery = " + TotalCountQuery);
  async.parallel([
    function (result) { con.query(query, result) },
    function (result) { con.query(Countquery, result) },
    function (result) { con.query(TotalCountQuery, result) }
  ],
    function (err, results) {
      if (err)
        return result(err, null);

      // if (results[0][0].length > 0) {
      result(null, {
        data: results[0][0], recordsFiltered: results[1][0][0].recordsFiltered,
        recordsTotal: results[2][0][0].TotalCount, draw: RRReportsModel.draw
      });
      return;
      // }
      // else {
      //   result(null, "No record");
      //   return;
      // }
    });
};
//Get ProcessFitnessReport ExportToExcel
RRReportsModel.ProcessFitnessReportExportToExcel = (RRReportsModel, result) => {

  var Ids = ``;
  for (let val of RRReportsModel.RRReports) {
    Ids += val.RRId + `,`;
  }
  var RRIds = Ids.slice(0, -1);

  var query = ``;
  query = ` SELECT rr.RRNo,v.VendorName,rrp.PartNo,rrp.SerialNo,rr.Created, 
  (select CASE WHEN HistoryStatus = '0' THEN Created ELSE "-" END from tbl_repair_request_status_history where  IsDeleted = 0 AND RRId=rr.RRId limit 0,1) as RRGenerated,
  (select CASE WHEN HistoryStatus = '1' THEN Created ELSE "-" END from tbl_repair_request_status_history where  IsDeleted = 0 AND RRId=rr.RRId limit 1,1) as AwaitingVendorSelection,
  (select CASE WHEN HistoryStatus = '2' THEN Created ELSE "-" END from tbl_repair_request_status_history where  IsDeleted = 0 AND RRId=rr.RRId limit 2,1) as AwaitingVendorQuote,
  (select CASE WHEN HistoryStatus = '3' THEN Created ELSE "-" END from tbl_repair_request_status_history where  IsDeleted = 0 AND RRId=rr.RRId limit 3,1) as ResourceVendorChange,
  (select CASE WHEN HistoryStatus = '4' THEN Created ELSE "-" END from tbl_repair_request_status_history where  IsDeleted = 0 AND RRId=rr.RRId limit 4,1) as QuotedAwaitingCustomerPO,
  (select CASE WHEN HistoryStatus = '5' THEN Created ELSE "-" END from tbl_repair_request_status_history where  IsDeleted = 0 AND RRId=rr.RRId limit 5,1) as RepairInProcess,
  (select CASE WHEN HistoryStatus = '6' THEN Created ELSE "-" END from tbl_repair_request_status_history where  IsDeleted = 0 AND RRId=rr.RRId limit 6,1) as QuoteRejected,
  (select CASE WHEN HistoryStatus = '7' THEN Created ELSE "-" END from tbl_repair_request_status_history where  IsDeleted = 0 AND RRId=rr.RRId limit 7,1) as Completed
  from tbl_repair_request rr
  Left JOIN  tbl_vendors v on v.VendorId=rr.VendorId
  Left JOIN  tbl_repair_request_parts rrp on rrp.RRId=rr.RRId where rr.IsDeleted=0 `;
  if (RRReportsModel.CustomerId != "") {
    query += " and rr.CustomerId In(" + RRReportsModel.CustomerId + ") ";
  }
  if (RRReportsModel.VendorId != "") {
    query += " and ( rr.VendorId ='" + RRReportsModel.VendorId + "' ) ";
  }
  if (RRReportsModel.RRNo != "") {
    query += " and ( rr.RRNo ='" + RRReportsModel.RRNo + "' ) ";
  }
  if (RRReportsModel.FromDate != "") {
    query += " and ( rr.Created >='" + RRReportsModel.FromDate + "' ) ";
  }
  if (RRReportsModel.ToDate != "") {
    query += " and ( rr.Created <='" + RRReportsModel.ToDate + "' ) ";
  }
  if (RRIds != '' && RRIds != null) {
    query += `and rr.RRId in(` + RRIds + `)`;
  }
  // console.log("SQL=" + query);
  con.query(query, (err, res) => {
    if (err) {
      return result(err, null);
    }
    return result(null, { ExcelData: res });
  });
};


//Get RMAReport
RRReportsModel.RMAReport = (RRReportsModel, result) => {

  var query = "";
  var order = "";
  var limit = ""; 
 
  var selectquery = ` SELECT rr.PartNo,(Select if(qi.Quantity>0,qi.Quantity,if(rrp.Quantity>0,rrp.Quantity,0)) as Quantity
from tbl_repair_request_parts rrp
Left join tbl_quotes q on q.RRId=rrp.RRId and q.IsDeleted=0 and q.Status In(1,2,4) and q.QuoteCustomerStatus In(1,2,3)
Left join tbl_quotes_item qi on qi.QuoteId=q.QuoteId  and qi.IsDeleted=0  and rrp.PartId=qi.PartId
where rrp.IsDeleted=0 and rrp.RRId=rr.RRId limit 0,1) Quantity,
ifnull(rr.CustomerSONo,'') SONo,ifnull(rr.VendorPONo,'') PONo,
ifnull(rr.VendorInvoiceNo,'') VendorInvoiceNo,ifnull(rr.CustomerInvoiceNo,'') InvoiceNo,
(Select DATE_FORMAT(Created,'%m/%d/%Y') from tbl_repair_request_status_history
where HistoryStatus=8 and RRId=rr.RRId order by HistoryId desc limit 0,1) as NotRepairableDate,
(Select DATE_FORMAT(Created,'%m/%d/%Y') from tbl_repair_request_status_history 
where HistoryStatus=${Constants.CONST_RRS_QUOTE_REJECTED} and RRId=rr.RRId order by HistoryId desc limit 0,1) as RejectedDate,
DATE_FORMAT(rr.RRCompletedDate,'%m/%d/%Y')  as CompletedDate,rr.RRId,
rr.RRNo,v.VendorName as Supplier,v1.VendorName as Manufacturer,rrp.ManufacturerPartNo,rrp.SerialNo,rrp.Description,DATE_FORMAT(po.DueDate,'%m/%d/%Y') as PODueDate,
CASE rr.Status 
WHEN 0 THEN '${Constants.array_rr_status[0]}'
WHEN 1 THEN '${Constants.array_rr_status[1]}' 
WHEN 2 THEN '${Constants.array_rr_status[2]}' 
WHEN 3 THEN '${Constants.array_rr_status[3]}' 
WHEN 4 THEN '${Constants.array_rr_status[4]}' 
WHEN 5 THEN '${Constants.array_rr_status[5]}' 
WHEN 6 THEN '${Constants.array_rr_status[6]}' 
WHEN 7 THEN '${Constants.array_rr_status[7]}' 
WHEN 8 THEN '${Constants.array_rr_status[8]}'
ELSE '-'	end StatusName, rr.Status,c.CompanyName,rr.CustomerPONo,rr.SubStatusId,rr.AssigneeUserId,rr.RRPartLocationId,

CONCAT(IFNULL(CURL.CurrencySymbol,CURLQ.CurrencySymbol),' ',FORMAT(IF(i.GrandTotal>=0,i.GrandTotal,If(q.GrandTotal>=0,q.GrandTotal,'TBD')),2)) RepairPrice,
ROUND(rr.PartPON,2) as PriceOfNew,
FORMAT(IF(vi.GrandTotal>=0,vi.GrandTotal,If(po.GrandTotal>=0,po.GrandTotal,'TBD')),2) Cost,

IF(i.Shipping,CONCAT('',i.Shipping),CONCAT('',q.ShippingFee)) as ShippingCost,
DATE_FORMAT(rr.Created,'%m/%d/%Y') as AHReceivedDate,DATE_FORMAT(s.DueDate,'%m/%d/%Y') as SalesOrderRequiredDate,
DATE_FORMAT(q.SubmittedDate,'%m/%d/%Y') as QuoteSubmittedDate,
DATE_FORMAT(q.ApprovedDate,'%m/%d/%Y') as ApprovedDate,
Case IsRushRepair
WHEN 0 THEN 'Normal'
WHEN 1 THEN 'Rush'
ELSE '-' end IsRushRepairName,
(select CONCAT(ReferenceLabelName,": ",ReferenceValue) from tbl_repair_request_customer_ref rrcr Left Join tbl_cutomer_reference_labels cl Using(CReferenceId)
where rrcr.IsDeleted = 0 AND RRId=rr.RRId order by 'Rank' limit 0,1) as CustomerReference1,
(select CONCAT(ReferenceLabelName,": ",ReferenceValue) from tbl_repair_request_customer_ref rrcr Left Join tbl_cutomer_reference_labels cl Using(CReferenceId)
where rrcr.IsDeleted = 0 AND RRId=rr.RRId order by 'Rank' limit 1,1) as CustomerReference2,
(select CONCAT(ReferenceLabelName,": ",ReferenceValue) from tbl_repair_request_customer_ref rrcr Left Join tbl_cutomer_reference_labels cl Using(CReferenceId)
where rrcr.IsDeleted = 0 AND RRId=rr.RRId order by 'Rank' limit 2,1) as CustomerReference3,
(select CONCAT(ReferenceLabelName,": ",ReferenceValue)
from tbl_repair_request_customer_ref rrcr
Left Join tbl_cutomer_reference_labels cl Using(CReferenceId) where rrcr.IsDeleted = 0
AND RRId=rr.RRId order by 'Rank' limit 3,1) as CustomerReference4,
(select CONCAT(ReferenceLabelName,": ",ReferenceValue) from tbl_repair_request_customer_ref rrcr Left Join tbl_cutomer_reference_labels cl Using(CReferenceId)
where rrcr.IsDeleted = 0 AND RRId=rr.RRId order by 'Rank' limit 4,1) as CustomerReference5,
(select CONCAT(ReferenceLabelName,": ",ReferenceValue) from tbl_repair_request_customer_ref rrcr Left Join tbl_cutomer_reference_labels cl Using(CReferenceId)
where rrcr.IsDeleted = 0 AND RRId=rr.RRId order by 'Rank' limit 5,1) as CustomerReference6,
rrp.CustomerPartNo1,rrp.CustomerPartNo2,
rr.StatedIssue as CustomerStatedIssue,rrv.RouteCause RootCause,IFNULL(cd.CustomerDepartmentName,'') as CustomerDepartmentName, IFNULL(ca.CustomerAssetName,'') as CustomerAssetName,
 
IF(FIND_IN_SET(v.VendorId,c.DirectedVendors)>0,'Yes','No') as DirectedSupplier,

if(rr.Status=6, CASE rr.RejectedStatusType 
WHEN 1 THEN '${Constants.array_customer_quote_reject_status[1]}' 
WHEN 2 THEN '${Constants.array_customer_quote_reject_status[2]}' 
WHEN 3 THEN '${Constants.array_customer_quote_reject_status[3]}' 
WHEN 4 THEN '${Constants.array_customer_quote_reject_status[4]}' 
WHEN 5 THEN '${Constants.array_customer_quote_reject_status[5]}' 
WHEN 6 THEN '${Constants.array_customer_quote_reject_status[6]}' 
WHEN 7 THEN '${Constants.array_customer_quote_reject_status[7]}' 
WHEN 8 THEN '${Constants.array_customer_quote_reject_status[8]}'
ELSE '' END  ,'') as QuoteRejectCode, rrv.VendorRefNo,
IsWarrantyDenied,Case IsWarrantyDenied
WHEN 0 THEN 'No'
WHEN 1 THEN 'Yes'
ELSE '-' end IsWarrantyDeniedName,
if(rrsh.ShipFromIdentity = 1, DATE_FORMAT(rrsh.ShipDate,'%m/%d/%Y'), '-') as ShipFromCustomer,
if(rrsh.ShipFromIdentity=1, CASE rrsh.ShipToId 
  WHEN 5 THEN 'AH Group' 
  ELSE 'Vendor' END, '-') as ShipToName,
  case v.IsRMARequired
  WHEN 1 THEN '${Constants.array_yes_no[1]}'
  WHEN 0 THEN '${Constants.array_yes_no[0]}'
  ELSE '-'
  end RMARequired,v.VendorEmail,
  (Select GROUP_CONCAT(Notes ORDER BY Notes SEPARATOR ' // ')  from tbl_repair_request_notes where IsDeleted=0 AND NotesType = 1  AND IdentityType = 3 and IdentityId=rr.RRId) as InternalNotes

`;

  recordfilterquery = `Select count(rr.RRId) as recordsFiltered `;
  query = query + `  FROM tbl_repair_request rr
LEFT JOIN tbl_customers c on c.CustomerId = rr.CustomerId
LEFT JOIN tbl_vendors v on v.VendorId=rr.VendorId
LEFT JOIN tbl_repair_request_vendors rrv on rrv.VendorId=rr.VendorId AND rrv.Status!=3 AND rrv.RRId = rr.RRId   AND rrv.IsDeleted = 0
LEFT JOIN tbl_repair_request_parts rrp on rrp.RRId =rr.RRId
LEFT JOIN tbl_vendors v1 on v1.VendorId=rrp.Manufacturer
LEFT JOIN tbl_customer_departments cd on cd.CustomerDepartmentId=rr.DepartmentId
LEFT JOIN tbl_customer_assets ca on ca.CustomerAssetId=rr.AssetId

LEFT JOIN tbl_quotes q on q.RRId=rr.RRId  and q.RRId>0 and q.Status In(1,2,4) and q.QuoteCustomerStatus In(1,2,3) and q.IsDeleted = 0 
LEFT JOIN tbl_invoice i on i.RRId=rr.RRId and i.RRId>0 AND i.IsDeleted = 0  AND i.Status!=${Constants.CONST_INV_STATUS_CANCELLED}
LEFT JOIN tbl_vendor_invoice vi on vi.RRId=rr.RRId and vi.RRId>0 and vi.IsDeleted = 0 
LEFT JOIN tbl_currencies as CURL  ON CURL.CurrencyCode = i.LocalCurrencyCode AND CURL.IsDeleted = 0 
LEFT JOIN tbl_currencies as CURLQ  ON CURLQ.CurrencyCode = q.LocalCurrencyCode AND CURLQ.IsDeleted = 0 
LEFT JOIN tbl_po po on po.RRId=rr.RRId and po.RRId>0  AND po.Status!=${Constants.CONST_PO_STATUS_CANCELLED} AND po.IsDeleted = 0 

LEFT JOIN tbl_sales_order s on s.RRId=rr.RRId   AND s.Status!=${Constants.CONST_SO_STATUS_CANCELLED}  AND s.IsDeleted = 0

LEFT JOIN tbl_repair_request_shipping_history rrsh ON rrsh.RRId=rr.RRId and rrsh.ShipFromIdentity=1 and 
rrsh.ShippingHistoryId = (SELECT ShippingHistoryId FROM tbl_repair_request_shipping_history
  WHERE RRId = rr.RRId and ShipFromIdentity=1 AND IsDeleted = 0 ORDER BY ShippingHistoryId DESC
  LIMIT 1) AND rrsh.IsDeleted = 0

where  rr.IsDeleted= 0 `;
  if (RRReportsModel.IdentityType == 0 && RRReportsModel.IsRestrictedCustomerAccess == 1 && RRReportsModel.MultipleCustomerIds != "") {
    query += ` and rr.CustomerId in(${RRReportsModel.MultipleCustomerIds}) `;
  }
  if (RRReportsModel.Manufacturer != "") {
    query += " and ( rrp.Manufacturer ='" + RRReportsModel.Manufacturer + "' ) ";
  }
  if (RRReportsModel.ManufacturerPartNo != "") {
    query += " and ( rrp.ManufacturerPartNo ='" + RRReportsModel.ManufacturerPartNo + "' ) ";
  }
  if (RRReportsModel.SerialNo != "") {
    query += " and ( rrp.SerialNo ='" + RRReportsModel.SerialNo + "' ) ";
  }
  if (RRReportsModel.Status != "") {
    query += " and ( rr.Status ='" + RRReportsModel.Status + "' ) ";
  }
  if (RRReportsModel.PODueDate != "") {
    query += " and  po.DueDate = '" + RRReportsModel.PODueDate + "'  ";
  }
  var Ids;
  if (RRReportsModel.CustomerId != "") {

    Ids = ``;
    for (let val of RRReportsModel.CustomerId) {
      Ids += val + `,`;
    }
    var CustomerIds = Ids.slice(0, -1);
    query += " and  rr.CustomerId IN (" + CustomerIds + " ) ";
  }
  if (RRReportsModel.CustomerPONo != "") {
    query += " and ( rr.CustomerPONo ='" + RRReportsModel.CustomerPONo + "' ) ";
  }
  if (RRReportsModel.SubStatusId != "") {
    query += " and rr.SubStatusId  = '" + RRReportsModel.SubStatusId + "'  ";
  }
  if (RRReportsModel.AssigneeUserId != "") {
    query += " and rr.AssigneeUserId  = '" + RRReportsModel.AssigneeUserId + "'  ";
  }
  if (RRReportsModel.RRPartLocationId != "") {
    query += " and rr.RRPartLocationId  = '" + RRReportsModel.RRPartLocationId + "'  ";
  }
  if (RRReportsModel.CustomerGroupId != "") {
    // query += " and (rr.CustomerId IN(SELECT CustomerId FROM tbl_customers  WHERE CustomerGroupId IN (" + RRReportsModel.CustomerGroupId + "))) ";
    query += ` and c.CustomerGroupId in(` + RRReportsModel.CustomerGroupId + `)`;
  }
  if (RRReportsModel.VendorId != "") {
    Ids = ``;
    for (let val of RRReportsModel.VendorId) {
      Ids += val + `,`;
    }
    var VendorIds = Ids.slice(0, -1);
    query += " and  rr.VendorId IN (" + VendorIds + " ) ";
  }
  var i = 0;
  if (RRReportsModel.order.length > 0) {
    order += " ORDER BY ";
  }
  for (i = 0; i < RRReportsModel.order.length; i++) {
    if (RRReportsModel.order[i].column != "" || RRReportsModel.order[i].column == "0")// 0 is equal to ""
    {
      switch (RRReportsModel.columns[RRReportsModel.order[i].column].name) {
        case "SONo":
          order += " ifnull(rr.CustomerSONo,'') " + RRReportsModel.order[i].dir + ",";
          break;
        case "PONo":
          order += " ifnull(rr.VendorPONo,'') " + RRReportsModel.order[i].dir + ",";
          break;
        case "VendorInvoiceNo":
          order += " ifnull(rr.VendorInvoiceNo,'') " + RRReportsModel.order[i].dir + ",";
          break;
        case "InvoiceNo":
          order += " ifnull(rr.CustomerInvoiceNo,'') " + RRReportsModel.order[i].dir + ",";
          break;
        case "RRNo":
          order += " rr.RRNo " + RRReportsModel.order[i].dir + ",";
          break;
        case "CustomerId":
          order += " rr.CustomerId " + RRReportsModel.order[i].dir + ",";
          break;
        case "SerialNo":
          order += " rrp.SerialNo " + RRReportsModel.order[i].dir + ",";
          break;
        default:
          order += " " + RRReportsModel.columns[RRReportsModel.order[i].column].name + " " + RRReportsModel.order[i].dir + ",";

      }
    }
  }
  order = order.slice(0, -1);
  // var tempquery = query.slice(0, -1);
  // var query = tempquery;
  var Countquery = recordfilterquery + query;
  if (RRReportsModel.start != "-1" && RRReportsModel.length != "-1") {
    limit += " LIMIT " + RRReportsModel.start + "," + (RRReportsModel.length);
  }
  query = selectquery + query + order + limit;
 
  var TotalCountQuery = `SELECT Count(rr.RRId) as TotalCount 
   FROM tbl_repair_request rr
LEFT JOIN tbl_customers c on c.CustomerId = rr.CustomerId
LEFT JOIN tbl_vendors v on v.VendorId=rr.VendorId
LEFT JOIN tbl_repair_request_vendors rrv on rrv.VendorId=rr.VendorId AND rrv.Status!=3 AND rrv.RRId = rr.RRId   AND rrv.IsDeleted = 0
LEFT JOIN tbl_repair_request_parts rrp on rrp.RRId =rr.RRId
LEFT JOIN tbl_vendors v1 on v1.VendorId=rrp.Manufacturer
LEFT JOIN tbl_customer_departments cd on cd.CustomerDepartmentId=rr.DepartmentId
LEFT JOIN tbl_customer_assets ca on ca.CustomerAssetId=rr.AssetId

LEFT JOIN tbl_quotes q on q.RRId=rr.RRId  and q.RRId>0 and q.Status In(1,2,4) and q.QuoteCustomerStatus In(1,2,3) and q.IsDeleted = 0 
LEFT JOIN tbl_invoice i on i.RRId=rr.RRId and i.RRId>0 AND i.IsDeleted = 0  AND i.Status!=${Constants.CONST_INV_STATUS_CANCELLED}
LEFT JOIN tbl_vendor_invoice vi on vi.RRId=rr.RRId and vi.RRId>0 and vi.IsDeleted = 0 
LEFT JOIN tbl_currencies as CURL  ON CURL.CurrencyCode = i.LocalCurrencyCode AND CURL.IsDeleted = 0 
LEFT JOIN tbl_currencies as CURLQ  ON CURLQ.CurrencyCode = q.LocalCurrencyCode AND CURLQ.IsDeleted = 0 
LEFT JOIN tbl_po po on po.RRId=rr.RRId and po.RRId>0  AND po.Status!=${Constants.CONST_PO_STATUS_CANCELLED} AND po.IsDeleted = 0 

LEFT JOIN tbl_sales_order s on s.RRId=rr.RRId  AND s.Status!=${Constants.CONST_SO_STATUS_CANCELLED}  AND s.IsDeleted = 0
where  rr.IsDeleted= 0 `;
  if (RRReportsModel.IdentityType == 0 && RRReportsModel.IsRestrictedCustomerAccess == 1 && RRReportsModel.MultipleCustomerIds != "") {
    TotalCountQuery += ` and rr.CustomerId in(${RRReportsModel.MultipleCustomerIds}) `;
  }
  console.log("query-OpenOrderBySupplierReport-1 = " + query);
  //console.log("Countquery = " + Countquery);
  //console.log("TotalCountQuery = " + TotalCountQuery);
  async.parallel([
    function (result) { con.query(query, result) },
    function (result) { con.query(Countquery, result) },
    function (result) { con.query(TotalCountQuery, result) }
  ],
    function (err, results) {
      if (err) {
        console.log("err" + err)
        return result(err, null);
      }

      result(null, {
        data: results[0][0], recordsFiltered: results[1][0][0].recordsFiltered,
        recordsTotal: results[2][0][0].TotalCount, draw: RRReportsModel.draw
      });
      return;
    });
};


RRReportsModel.RMAReportExcel = (reqBody, result) => {

  var Ids = ``;
  for (let val of reqBody.RRReports) {
    Ids += val.RRId + `,`;
  }
  var RRIds = Ids.slice(0, -1);

  var query = ``;
  query = ` SELECT rr.PartNo,rr.RRNo,v.VendorName as Supplier,case v.IsRMARequired
  WHEN 1 THEN '${Constants.array_yes_no[1]}'
  WHEN 0 THEN '${Constants.array_yes_no[0]}'
  ELSE '-'
  end RMARequired,
  (Select GROUP_CONCAT(Notes ORDER BY Notes SEPARATOR ' // ')  from tbl_repair_request_notes where IsDeleted=0 AND NotesType = 1  AND IdentityType = 3 and IdentityId=rr.RRId) as InternalNotes,
  v1.VendorName as Manufacturer,rrp.ManufacturerPartNo,rrp.SerialNo,rrp.Description,c.CompanyName,DATE_FORMAT(rr.Created,'%m/%d/%Y') as AHReceivedDate,
  (select CONCAT(ReferenceLabelName,": ",ReferenceValue) from tbl_repair_request_customer_ref rrcr Left Join tbl_cutomer_reference_labels cl Using(CReferenceId)
where rrcr.IsDeleted = 0 AND RRId=rr.RRId order by 'Rank' limit 0,1) as CustomerReference1,
(select CONCAT(ReferenceLabelName,": ",ReferenceValue) from tbl_repair_request_customer_ref rrcr Left Join tbl_cutomer_reference_labels cl Using(CReferenceId)
where rrcr.IsDeleted = 0 AND RRId=rr.RRId order by 'Rank' limit 1,1) as CustomerReference2,
(select CONCAT(ReferenceLabelName,": ",ReferenceValue) from tbl_repair_request_customer_ref rrcr Left Join tbl_cutomer_reference_labels cl Using(CReferenceId)
where rrcr.IsDeleted = 0 AND RRId=rr.RRId order by 'Rank' limit 2,1) as CustomerReference3,
(select CONCAT(ReferenceLabelName,": ",ReferenceValue)
from tbl_repair_request_customer_ref rrcr
Left Join tbl_cutomer_reference_labels cl Using(CReferenceId) where rrcr.IsDeleted = 0
AND RRId=rr.RRId order by 'Rank' limit 3,1) as CustomerReference4,
(select CONCAT(ReferenceLabelName,": ",ReferenceValue) from tbl_repair_request_customer_ref rrcr Left Join tbl_cutomer_reference_labels cl Using(CReferenceId)
where rrcr.IsDeleted = 0 AND RRId=rr.RRId order by 'Rank' limit 4,1) as CustomerReference5,
(select CONCAT(ReferenceLabelName,": ",ReferenceValue) from tbl_repair_request_customer_ref rrcr Left Join tbl_cutomer_reference_labels cl Using(CReferenceId)
where rrcr.IsDeleted = 0 AND RRId=rr.RRId order by 'Rank' limit 5,1) as CustomerReference6,
rr.StatedIssue as CustomerStatedIssue,IF(FIND_IN_SET(v.VendorId,c.DirectedVendors)>0,'Yes','No') as DirectedSupplier,rrv.VendorRefNo,
v.VendorEmail

FROM tbl_repair_request rr
LEFT JOIN tbl_customers c on c.CustomerId = rr.CustomerId
LEFT JOIN tbl_vendors v on v.VendorId=rr.VendorId
LEFT JOIN tbl_repair_request_vendors rrv on rrv.VendorId=rr.VendorId AND rrv.Status!=3 AND rrv.RRId = rr.RRId   AND rrv.IsDeleted = 0
LEFT JOIN tbl_repair_request_parts rrp on rrp.RRId =rr.RRId
LEFT JOIN tbl_vendors v1 on v1.VendorId=rrp.Manufacturer
LEFT JOIN tbl_customer_departments cd on cd.CustomerDepartmentId=rr.DepartmentId
LEFT JOIN tbl_customer_assets ca on ca.CustomerAssetId=rr.AssetId

LEFT JOIN tbl_quotes q on q.RRId=rr.RRId  and q.RRId>0 and q.Status In(1,2,4) and q.QuoteCustomerStatus In(1,2,3) and q.IsDeleted = 0 
LEFT JOIN tbl_invoice i on i.RRId=rr.RRId and i.RRId>0 AND i.IsDeleted = 0  AND i.Status!=${Constants.CONST_INV_STATUS_CANCELLED}
LEFT JOIN tbl_vendor_invoice vi on vi.RRId=rr.RRId and vi.RRId>0 and vi.IsDeleted = 0 
LEFT JOIN tbl_currencies as CURL  ON CURL.CurrencyCode = i.LocalCurrencyCode AND CURL.IsDeleted = 0 
LEFT JOIN tbl_currencies as CURLQ  ON CURLQ.CurrencyCode = q.LocalCurrencyCode AND CURLQ.IsDeleted = 0 
LEFT JOIN tbl_po po on po.RRId=rr.RRId and po.RRId>0  AND po.Status!=${Constants.CONST_PO_STATUS_CANCELLED} AND po.IsDeleted = 0 

LEFT JOIN tbl_sales_order s on s.RRId=rr.RRId AND s.Status != 3 AND s.IsDeleted = 0

LEFT JOIN tbl_repair_request_shipping_history rrsh ON rrsh.RRId=rr.RRId and rrsh.ShipFromIdentity=1 and 
rrsh.ShippingHistoryId = (SELECT ShippingHistoryId FROM tbl_repair_request_shipping_history
  WHERE RRId = rr.RRId and ShipFromIdentity=1 AND IsDeleted = 0 ORDER BY ShippingHistoryId DESC
  LIMIT 1) AND rrsh.IsDeleted = 0

where  rr.IsDeleted= 0 `;
  if (reqBody.IdentityType == 0 && reqBody.IsRestrictedCustomerAccess == 1 && reqBody.MultipleCustomerIds != "") {
    query += ` and rr.CustomerId in(${reqBody.MultipleCustomerIds}) `;
  }
  if (reqBody.Manufacturer != "") {
    query += " and ( rrp.Manufacturer ='" + reqBody.Manufacturer + "' ) ";
  }
  if (reqBody.ManufacturerPartNo != "") {
    query += " and ( rrp.ManufacturerPartNo ='" + reqBody.ManufacturerPartNo + "' ) ";
  }
  if (reqBody.SerialNo != "") {
    query += " and ( rr.SerialNo ='" + reqBody.SerialNo + "' ) ";
  }
  if (reqBody.Status != "") {
    query += " and ( rr.Status ='" + reqBody.Status + "' ) ";
  }
  if (reqBody.SubStatusId != "") {
    query += " and rr.SubStatusId  = '" + reqBody.SubStatusId + "'  ";
  }
  if (reqBody.AssigneeUserId != "") {
    query += " and rr.AssigneeUserId  = '" + reqBody.AssigneeUserId + "'  ";
  }
  if (reqBody.RRPartLocationId != "") {
    query += " and rr.RRPartLocationId  = '" + reqBody.RRPartLocationId + "'  ";
  }
  if (reqBody.PODueDate != "") {
    query += " and  po.DueDate = '" + reqBody.PODueDate + "'  ";
  }
  if (reqBody.CustomerGroupId != "") {
    // query += " and (rr.CustomerId IN(SELECT CustomerId FROM tbl_customers  WHERE CustomerGroupId IN (" + reqBody.CustomerGroupId + "))) ";
    query += ` and c.CustomerGroupId in(` + reqBody.CustomerGroupId + `)`;
  }
  var Ids;
  if (reqBody.CustomerId != "") {
    Ids = ``;
    for (let val of reqBody.CustomerId) {
      Ids += val + `,`;
    }
    var CustomerIds = Ids.slice(0, -1);
    query += " and  rr.CustomerId IN (" + CustomerIds + ") ";
  }
  if (reqBody.CustomerPONo != "") {
    query += " and ( rr.CustomerPONo ='" + reqBody.CustomerPONo + "' ) ";
  }
  if (reqBody.VendorId != "") {
    Ids = ``;
    for (let val of reqBody.VendorId) {
      Ids += val + `,`;
    }
    var VendorIds = Ids.slice(0, -1);
    query += " and  rr.VendorId IN (" + VendorIds + " ) ";
  }
  if (RRIds != '' && RRIds != null) {
    query += ` and rr.RRId in(` + RRIds + `)`;
  }
  // console.log("SQL=" + query);
  con.query(query, (err, res) => {
    if (err) {
      return result(err, null);
    }
    return result(null, { ExcelData: res });
  });
};



//Get OpenOrderBySupplierReport
RRReportsModel.OpenOrderBySupplierReport = (RRReportsModel, result) => {

  var query = "";
  var order = "";
  var limit = "";
  selectquery = "";

  //comment LEFT JOIN tbl_quotes q on q.RRId=rr.RRId and q.Status='${Constants.CONST_QUOTE_STATUS_APPROVED}' and q.QuoteCustomerStatus='${Constants.CONST_CUSTOMER_QUOTE_ACCEPTED}' AND q.IsDeleted = 0

  selectquery = ` SELECT rr.PartNo,(Select if(qi.Quantity>0,qi.Quantity,if(rrp.Quantity>0,rrp.Quantity,0)) as Quantity
from tbl_repair_request_parts rrp
Left join tbl_quotes q on q.RRId=rrp.RRId and q.IsDeleted=0 and q.Status In(1,2,4) and q.QuoteCustomerStatus In(1,2,3)
Left join tbl_quotes_item qi on qi.QuoteId=q.QuoteId  and qi.IsDeleted=0  and rrp.PartId=qi.PartId
where rrp.IsDeleted=0 and rrp.RRId=rr.RRId limit 0,1) Quantity,
ifnull(rr.CustomerSONo,'') SONo,ifnull(rr.VendorPONo,'') PONo,
ifnull(rr.VendorInvoiceNo,'') VendorInvoiceNo,ifnull(rr.CustomerInvoiceNo,'') InvoiceNo,
(Select DATE_FORMAT(Created,'%m/%d/%Y') from tbl_repair_request_status_history
where HistoryStatus=8 and RRId=rr.RRId order by HistoryId desc limit 0,1) as NotRepairableDate,
(Select DATE_FORMAT(Created,'%m/%d/%Y') from tbl_repair_request_status_history 
where HistoryStatus=${Constants.CONST_RRS_QUOTE_REJECTED} and RRId=rr.RRId order by HistoryId desc limit 0,1) as RejectedDate,
DATE_FORMAT(rr.RRCompletedDate,'%m/%d/%Y')  as CompletedDate,rr.RRId,
rr.RRNo,v.VendorName as Supplier,v1.VendorName as Manufacturer,rrp.ManufacturerPartNo,rrp.SerialNo,rrp.Description,DATE_FORMAT(po.DueDate,'%m/%d/%Y') as PODueDate,
CASE rr.Status 
WHEN 0 THEN '${Constants.array_rr_status[0]}'
WHEN 1 THEN '${Constants.array_rr_status[1]}' 
WHEN 2 THEN '${Constants.array_rr_status[2]}' 
WHEN 3 THEN '${Constants.array_rr_status[3]}' 
WHEN 4 THEN '${Constants.array_rr_status[4]}' 
WHEN 5 THEN '${Constants.array_rr_status[5]}' 
WHEN 6 THEN '${Constants.array_rr_status[6]}' 
WHEN 7 THEN '${Constants.array_rr_status[7]}' 
WHEN 8 THEN '${Constants.array_rr_status[8]}'
ELSE '-'	end StatusName, rr.Status,c.CompanyName,rr.CustomerPONo,rr.SubStatusId,rr.AssigneeUserId,rr.RRPartLocationId,

CONCAT(IFNULL(CURL.CurrencySymbol,CURLQ.CurrencySymbol),' ',FORMAT(IF(i.GrandTotal>=0,i.GrandTotal,If(q.GrandTotal>=0,q.GrandTotal,'TBD')),2)) RepairPrice,
ROUND(rr.PartPON,2) as PriceOfNew,
FORMAT(IF(po.GrandTotal>=0,po.GrandTotal,If(vq.GrandTotal>=0,vq.GrandTotal,'TBD')),2) Cost,
IF(i.Shipping,CONCAT('',i.Shipping),CONCAT('',q.ShippingFee)) as ShippingCost,
DATE_FORMAT(rr.Created,'%m/%d/%Y') as AHReceivedDate,DATE_FORMAT(s.DueDate,'%m/%d/%Y') as SalesOrderRequiredDate,
DATE_FORMAT(q.SubmittedDate,'%m/%d/%Y') as QuoteSubmittedDate,
DATE_FORMAT(q.ApprovedDate,'%m/%d/%Y') as ApprovedDate,
Case IsRushRepair
WHEN 0 THEN 'Normal'
WHEN 1 THEN 'Rush'
ELSE '-' end IsRushRepairName,
(select CONCAT(ReferenceLabelName,": ",ReferenceValue) from tbl_repair_request_customer_ref rrcr Left Join tbl_cutomer_reference_labels cl Using(CReferenceId)
where rrcr.IsDeleted = 0 AND RRId=rr.RRId order by 'Rank' limit 0,1) as CustomerReference1,
(select CONCAT(ReferenceLabelName,": ",ReferenceValue) from tbl_repair_request_customer_ref rrcr Left Join tbl_cutomer_reference_labels cl Using(CReferenceId)
where rrcr.IsDeleted = 0 AND RRId=rr.RRId order by 'Rank' limit 1,1) as CustomerReference2,
(select CONCAT(ReferenceLabelName,": ",ReferenceValue) from tbl_repair_request_customer_ref rrcr Left Join tbl_cutomer_reference_labels cl Using(CReferenceId)
where rrcr.IsDeleted = 0 AND RRId=rr.RRId order by 'Rank' limit 2,1) as CustomerReference3,
(select CONCAT(ReferenceLabelName,": ",ReferenceValue)
from tbl_repair_request_customer_ref rrcr
Left Join tbl_cutomer_reference_labels cl Using(CReferenceId) where rrcr.IsDeleted = 0
AND RRId=rr.RRId order by 'Rank' limit 3,1) as CustomerReference4,
(select CONCAT(ReferenceLabelName,": ",ReferenceValue) from tbl_repair_request_customer_ref rrcr Left Join tbl_cutomer_reference_labels cl Using(CReferenceId)
where rrcr.IsDeleted = 0 AND RRId=rr.RRId order by 'Rank' limit 4,1) as CustomerReference5,
(select CONCAT(ReferenceLabelName,": ",ReferenceValue) from tbl_repair_request_customer_ref rrcr Left Join tbl_cutomer_reference_labels cl Using(CReferenceId)
where rrcr.IsDeleted = 0 AND RRId=rr.RRId order by 'Rank' limit 5,1) as CustomerReference6,
rrp.CustomerPartNo1,rrp.CustomerPartNo2,
rr.StatedIssue as CustomerStatedIssue,rrv.RouteCause RootCause,IFNULL(cd.CustomerDepartmentName,'') as CustomerDepartmentName, IFNULL(ca.CustomerAssetName,'') as CustomerAssetName,
 
IF(FIND_IN_SET(v.VendorId,c.DirectedVendors)>0,'Yes','No') as DirectedSupplier,

if(rr.Status=6, CASE rr.RejectedStatusType 
WHEN 1 THEN '${Constants.array_customer_quote_reject_status[1]}' 
WHEN 2 THEN '${Constants.array_customer_quote_reject_status[2]}' 
WHEN 3 THEN '${Constants.array_customer_quote_reject_status[3]}' 
WHEN 4 THEN '${Constants.array_customer_quote_reject_status[4]}' 
WHEN 5 THEN '${Constants.array_customer_quote_reject_status[5]}' 
WHEN 6 THEN '${Constants.array_customer_quote_reject_status[6]}' 
WHEN 7 THEN '${Constants.array_customer_quote_reject_status[7]}' 
WHEN 8 THEN '${Constants.array_customer_quote_reject_status[8]}'
ELSE '' END  ,'') as QuoteRejectCode, rrv.VendorRefNo,
IsWarrantyDenied,Case IsWarrantyDenied
WHEN 0 THEN 'No'
WHEN 1 THEN 'Yes'
ELSE '-' end IsWarrantyDeniedName,
if(rrsh.ShipFromIdentity = 1, DATE_FORMAT(rrsh.ShipDate,'%m/%d/%Y'), '-') as ShipFromCustomer,
if(rrsh.ShipFromIdentity=1, CASE rrsh.ShipToId 
  WHEN 5 THEN 'AH Group' 
  ELSE 'Vendor' END, '-') as ShipToName,
Case IsCriticalSpare
WHEN 0 THEN 'No'
WHEN 1 THEN 'Yes'
ELSE '-' end CriticalSpare

`;

  recordfilterquery = `Select count(rr.RRId) as recordsFiltered `;
  query = query + `  FROM tbl_repair_request rr
LEFT JOIN tbl_customers c on c.CustomerId = rr.CustomerId
LEFT JOIN tbl_vendors v on v.VendorId=rr.VendorId
LEFT JOIN tbl_repair_request_vendors rrv on rrv.VendorId=rr.VendorId AND rrv.Status!=3 AND rrv.RRId = rr.RRId   AND rrv.IsDeleted = 0
LEFT JOIN tbl_repair_request_parts rrp on rrp.RRId =rr.RRId
LEFT JOIN tbl_vendors v1 on v1.VendorId=rrp.Manufacturer
LEFT JOIN tbl_customer_departments cd on cd.CustomerDepartmentId=rr.DepartmentId
LEFT JOIN tbl_customer_assets ca on ca.CustomerAssetId=rr.AssetId

LEFT JOIN tbl_quotes q on q.RRId=rr.RRId  and q.RRId>0 and q.Status In(1,2,4) and q.QuoteCustomerStatus In(1,2,3) and q.IsDeleted = 0 
LEFT JOIN tbl_vendor_quote as vq ON vq.QuoteId = q.QuoteId AND vq.IsDeleted =0 AND vq.RRId = q.RRId 

LEFT JOIN tbl_invoice i on i.RRId=rr.RRId and i.RRId>0 AND i.IsDeleted = 0  AND i.Status!=${Constants.CONST_INV_STATUS_CANCELLED}
LEFT JOIN tbl_vendor_invoice vi on vi.RRId=rr.RRId and vi.RRId>0 and vi.IsDeleted = 0 
LEFT JOIN tbl_currencies as CURL  ON CURL.CurrencyCode = i.LocalCurrencyCode AND CURL.IsDeleted = 0 
LEFT JOIN tbl_currencies as CURLQ  ON CURLQ.CurrencyCode = q.LocalCurrencyCode AND CURLQ.IsDeleted = 0 
LEFT JOIN tbl_po po on po.RRId=rr.RRId and po.RRId>0  AND po.Status!=${Constants.CONST_PO_STATUS_CANCELLED} AND po.IsDeleted = 0 

LEFT JOIN tbl_sales_order s on s.RRId=rr.RRId   AND s.Status!=${Constants.CONST_SO_STATUS_CANCELLED}  AND s.IsDeleted = 0

LEFT JOIN tbl_repair_request_shipping_history rrsh ON rrsh.RRId=rr.RRId and rrsh.ShipFromIdentity=1 and 
rrsh.ShippingHistoryId = (SELECT ShippingHistoryId FROM tbl_repair_request_shipping_history
  WHERE RRId = rr.RRId and ShipFromIdentity=1 AND IsDeleted = 0 ORDER BY ShippingHistoryId DESC
  LIMIT 1) AND rrsh.IsDeleted = 0

where  rr.IsDeleted= 0 `;
  if (RRReportsModel.IdentityType == 0 && RRReportsModel.IsRestrictedCustomerAccess == 1 && RRReportsModel.MultipleCustomerIds != "") {
    query += ` and rr.CustomerId in(${RRReportsModel.MultipleCustomerIds}) `;
  }
  if (RRReportsModel.Manufacturer != "") {
    query += " and ( rrp.Manufacturer ='" + RRReportsModel.Manufacturer + "' ) ";
  }
  if (RRReportsModel.ManufacturerPartNo != "") {
    query += " and ( rrp.ManufacturerPartNo ='" + RRReportsModel.ManufacturerPartNo + "' ) ";
  }
  if (RRReportsModel.SerialNo != "") {
    query += " and ( rrp.SerialNo ='" + RRReportsModel.SerialNo + "' ) ";
  }
  if (RRReportsModel.Status != "") {
    query += " and ( rr.Status ='" + RRReportsModel.Status + "' ) ";
  }
  if (RRReportsModel.PODueDate != "") {
    query += " and  po.DueDate = '" + RRReportsModel.PODueDate + "'  ";
  }
  var Ids;
  if (RRReportsModel.CustomerId != "") {

    Ids = ``;
    for (let val of RRReportsModel.CustomerId) {
      Ids += val + `,`;
    }
    var CustomerIds = Ids.slice(0, -1);
    query += " and  rr.CustomerId IN (" + CustomerIds + " ) ";
  }
  if (RRReportsModel.CustomerPONo != "") {
    query += " and ( rr.CustomerPONo ='" + RRReportsModel.CustomerPONo + "' ) ";
  }
  if (RRReportsModel.SubStatusId != "") {
    query += " and rr.SubStatusId  = '" + RRReportsModel.SubStatusId + "'  ";
  }
  if (RRReportsModel.AssigneeUserId != "") {
    query += " and rr.AssigneeUserId  = '" + RRReportsModel.AssigneeUserId + "'  ";
  }
  if (RRReportsModel.RRPartLocationId != "") {
    query += " and rr.RRPartLocationId  = '" + RRReportsModel.RRPartLocationId + "'  ";
  }
  if (RRReportsModel.CustomerGroupId != "") {
    // query += " and (rr.CustomerId IN(SELECT CustomerId FROM tbl_customers  WHERE CustomerGroupId IN (" + RRReportsModel.CustomerGroupId + "))) ";
    query += ` and c.CustomerGroupId in(` + RRReportsModel.CustomerGroupId + `)`;
  }
  if (RRReportsModel.VendorId != "") {
    Ids = ``;
    for (let val of RRReportsModel.VendorId) {
      Ids += val + `,`;
    }
    var VendorIds = Ids.slice(0, -1);
    query += " and  rr.VendorId IN (" + VendorIds + " ) ";
  }
  var i = 0;
  if (RRReportsModel.order.length > 0) {
    order += " ORDER BY ";
  }
  for (i = 0; i < RRReportsModel.order.length; i++) {
    if (RRReportsModel.order[i].column != "" || RRReportsModel.order[i].column == "0")// 0 is equal to ""
    {
      switch (RRReportsModel.columns[RRReportsModel.order[i].column].name) {
        case "SONo":
          order += " ifnull(rr.CustomerSONo,'') " + RRReportsModel.order[i].dir + ",";
          break;
        case "PONo":
          order += " ifnull(rr.VendorPONo,'') " + RRReportsModel.order[i].dir + ",";
          break;
        case "VendorInvoiceNo":
          order += " ifnull(rr.VendorInvoiceNo,'') " + RRReportsModel.order[i].dir + ",";
          break;
        case "InvoiceNo":
          order += " ifnull(rr.CustomerInvoiceNo,'') " + RRReportsModel.order[i].dir + ",";
          break;
        case "RRNo":
          order += " rr.RRNo " + RRReportsModel.order[i].dir + ",";
          break;
        case "CustomerId":
          order += " rr.CustomerId " + RRReportsModel.order[i].dir + ",";
          break;
        case "SerialNo":
          order += " rrp.SerialNo " + RRReportsModel.order[i].dir + ",";
          break;
        default:
          order += " " + RRReportsModel.columns[RRReportsModel.order[i].column].name + " " + RRReportsModel.order[i].dir + ",";

      }
    }
  }
  order = order.slice(0, -1);
  // var tempquery = query.slice(0, -1);
  // var query = tempquery;
  var Countquery = recordfilterquery + query;
  if (RRReportsModel.start != "-1" && RRReportsModel.length != "-1") {
    limit += " LIMIT " + RRReportsModel.start + "," + (RRReportsModel.length);
  }
  query = selectquery + query + order + limit;

  //   LEFT JOIN tbl_customers c on c.CustomerId = rr.CustomerId
  //   LEFT JOIN tbl_vendors v on v.VendorId=rr.VendorId
  //   LEFT JOIN tbl_repair_request_vendors rrv on rrv.VendorId=rr.VendorId AND rrv.Status!=3 AND rrv.RRId = rr.RRId   AND rrv.IsDeleted = 0
  //   LEFT JOIN tbl_repair_request_parts rrp on rrp.RRId =rr.RRId
  //   LEFT JOIN tbl_vendors v1 on v1.VendorId=rrp.Manufacturer
  //   LEFT JOIN tbl_customer_departments cd on cd.CustomerDepartmentId=rr.DepartmentId
  //   LEFT JOIN tbl_customer_assets ca on ca.CustomerAssetId=rr.AssetId

  //   LEFT JOIN tbl_invoice i on i.RRId =rr.RRId and i.IsDeleted = 0 
  //   LEFT JOIN LATERAL (SELECT *
  //                    FROM tbl_quotes
  //                    WHERE RRId = rr.RRId and Status='${Constants.CONST_QUOTE_STATUS_APPROVED}' AND IsDeleted = 0
  //                    LIMIT 1) as Appq
  //    ON Appq.RRId=rr.RRId and Appq.Status='${Constants.CONST_QUOTE_STATUS_APPROVED}' AND Appq.IsDeleted = 0

  //  LEFT JOIN tbl_vendor_quote Appvq on Appvq.QuoteId=Appq.QuoteId AND Appvq.RRId = rr.RRId  

  //   LEFT JOIN LATERAL (SELECT *
  //                    FROM tbl_quotes
  //                    WHERE RRId = rr.RRId and Status!='${Constants.CONST_QUOTE_STATUS_APPROVED}' and Status!='${Constants.CONST_QUOTE_STATUS_QUOTED}'  and Status!='${Constants.CONST_QUOTE_STATUS_CANCELLED}'   
  //                     AND IsDeleted = 0
  //                    ORDER BY Status DESC LIMIT 1) as Otherq
  //    ON Otherq.RRId=rr.RRId and Otherq.Status!='${Constants.CONST_QUOTE_STATUS_APPROVED}' and Otherq.Status!='${Constants.CONST_QUOTE_STATUS_QUOTED}' and Otherq.Status!='${Constants.CONST_QUOTE_STATUS_CANCELLED}' AND Otherq.IsDeleted = 0

  //  LEFT JOIN tbl_vendor_quote Othervq on Othervq.QuoteId=Otherq.QuoteId AND Othervq.RRId = rr.RRId

  //   LEFT JOIN tbl_sales_order s  on s.RRId=rr.RRId AND s.Status != 3 AND s.IsDeleted = 0
  //   where  rr.IsDeleted= 0 `;

  var TotalCountQuery = `SELECT Count(rr.RRId) as TotalCount 
   FROM tbl_repair_request rr
LEFT JOIN tbl_customers c on c.CustomerId = rr.CustomerId
LEFT JOIN tbl_vendors v on v.VendorId=rr.VendorId
LEFT JOIN tbl_repair_request_vendors rrv on rrv.VendorId=rr.VendorId AND rrv.Status!=3 AND rrv.RRId = rr.RRId   AND rrv.IsDeleted = 0
LEFT JOIN tbl_repair_request_parts rrp on rrp.RRId =rr.RRId
LEFT JOIN tbl_vendors v1 on v1.VendorId=rrp.Manufacturer
LEFT JOIN tbl_customer_departments cd on cd.CustomerDepartmentId=rr.DepartmentId
LEFT JOIN tbl_customer_assets ca on ca.CustomerAssetId=rr.AssetId

LEFT JOIN tbl_quotes q on q.RRId=rr.RRId  and q.RRId>0 and q.Status In(1,2,4) and q.QuoteCustomerStatus In(1,2,3) and q.IsDeleted = 0 
LEFT JOIN tbl_invoice i on i.RRId=rr.RRId and i.RRId>0 AND i.IsDeleted = 0  AND i.Status!=${Constants.CONST_INV_STATUS_CANCELLED}
LEFT JOIN tbl_vendor_invoice vi on vi.RRId=rr.RRId and vi.RRId>0 and vi.IsDeleted = 0 
LEFT JOIN tbl_currencies as CURL  ON CURL.CurrencyCode = i.LocalCurrencyCode AND CURL.IsDeleted = 0 
LEFT JOIN tbl_currencies as CURLQ  ON CURLQ.CurrencyCode = q.LocalCurrencyCode AND CURLQ.IsDeleted = 0 
LEFT JOIN tbl_po po on po.RRId=rr.RRId and po.RRId>0  AND po.Status!=${Constants.CONST_PO_STATUS_CANCELLED} AND po.IsDeleted = 0 

LEFT JOIN tbl_sales_order s on s.RRId=rr.RRId  AND s.Status!=${Constants.CONST_SO_STATUS_CANCELLED}  AND s.IsDeleted = 0
where  rr.IsDeleted= 0 `;
  if (RRReportsModel.IdentityType == 0 && RRReportsModel.IsRestrictedCustomerAccess == 1 && RRReportsModel.MultipleCustomerIds != "") {
    TotalCountQuery += ` and rr.CustomerId in(${RRReportsModel.MultipleCustomerIds}) `;
  }
 // console.log("query-OpenOrderBySupplierReport-1 = " + query);
  //console.log("Countquery = " + Countquery);
  //console.log("TotalCountQuery = " + TotalCountQuery);
  async.parallel([
    function (result) { con.query(query, result) },
    function (result) { con.query(Countquery, result) },
    function (result) { con.query(TotalCountQuery, result) }
  ],
    function (err, results) {
      if (err) {
        console.log("err" + err)
        return result(err, null);
      }

      result(null, {
        data: results[0][0], recordsFiltered: results[1][0][0].recordsFiltered,
        recordsTotal: results[2][0][0].TotalCount, draw: RRReportsModel.draw
      });
      return;
    });
};

// Get OpenOrderBySupplierReportCount
RRReportsModel.OpenOrderBySupplierReportCount = (RRReportsModel, result) => {
  var TotalCountQuery = `SELECT Count(rr.RRId) as TotalCount 
   FROM tbl_repair_request rr
LEFT JOIN tbl_customers c on c.CustomerId = rr.CustomerId
LEFT JOIN tbl_vendors v on v.VendorId=rr.VendorId
LEFT JOIN tbl_repair_request_vendors rrv on rrv.VendorId=rr.VendorId AND rrv.Status!=3 AND rrv.RRId = rr.RRId   AND rrv.IsDeleted = 0
LEFT JOIN tbl_repair_request_parts rrp on rrp.RRId =rr.RRId
LEFT JOIN tbl_vendors v1 on v1.VendorId=rrp.Manufacturer
LEFT JOIN tbl_customer_departments cd on cd.CustomerDepartmentId=rr.DepartmentId
LEFT JOIN tbl_customer_assets ca on ca.CustomerAssetId=rr.AssetId

LEFT JOIN tbl_quotes q on q.RRId=rr.RRId  and q.RRId>0 and q.Status In(1,2,4) and q.QuoteCustomerStatus In(1,2,3) and q.IsDeleted = 0 
LEFT JOIN tbl_invoice i on i.RRId=rr.RRId and i.RRId>0 AND i.IsDeleted = 0  AND i.Status!=${Constants.CONST_INV_STATUS_CANCELLED}
LEFT JOIN tbl_vendor_invoice vi on vi.RRId=rr.RRId and vi.RRId>0 and vi.IsDeleted = 0 
LEFT JOIN tbl_currencies as CURL  ON CURL.CurrencyCode = i.LocalCurrencyCode AND CURL.IsDeleted = 0 
LEFT JOIN tbl_currencies as CURLQ  ON CURLQ.CurrencyCode = q.LocalCurrencyCode AND CURLQ.IsDeleted = 0 
LEFT JOIN tbl_po po on po.RRId=rr.RRId and po.RRId>0  AND po.Status!=${Constants.CONST_PO_STATUS_CANCELLED} AND po.IsDeleted = 0 

LEFT JOIN tbl_sales_order s on s.RRId=rr.RRId  AND s.Status!=${Constants.CONST_SO_STATUS_CANCELLED}  AND s.IsDeleted = 0
where  rr.IsDeleted= 0 `;
  if (RRReportsModel.IdentityType == 0 && RRReportsModel.IsRestrictedCustomerAccess == 1 && RRReportsModel.MultipleCustomerIds != "") {
    TotalCountQuery += ` and rr.CustomerId in(${RRReportsModel.MultipleCustomerIds}) `;
  }
  async.parallel([
    function (result) { con.query(TotalCountQuery, result) }
  ],
    function (err, results) {
      if (err) {
        return result(err, null);
      }

      result(null, {
        recordsTotal: results[0][0][0].TotalCount
      });
      return;
    });
}
//Get OpenOrderBySupplierReport ExportToExcel
RRReportsModel.OpenOrderBySupplierReportExportToExcel = (reqBody, result) => {

  var Ids = ``;
  for (let val of reqBody.RRReports) {
    Ids += val.RRId + `,`;
  }
  var RRIds = Ids.slice(0, -1);

  var query = ``;
  query = ` SELECT rr.PartNo,(Select if(qi.Quantity>0,qi.Quantity,if(rrp.Quantity>0,rrp.Quantity,0)) as Quantity
from tbl_repair_request_parts rrp
Left join tbl_quotes q on q.RRId=rrp.RRId and q.IsDeleted=0 and q.Status In(1,2,4) and q.QuoteCustomerStatus In(1,2,3)  
Left join tbl_quotes_item qi on qi.QuoteId=q.QuoteId  and qi.IsDeleted=0 and rrp.PartId=qi.PartId
where rrp.IsDeleted=0  and rrp.RRId=rr.RRId limit 0,1) Quantity,
ifnull(rr.CustomerSONo,'') SONo,ifnull(rr.VendorPONo,'') PONo,
ifnull(rr.VendorInvoiceNo,'') VendorInvoiceNo,ifnull(rr.CustomerInvoiceNo,'') InvoiceNo,
(Select DATE_FORMAT(Created,'%m/%d/%Y') from tbl_repair_request_status_history
where HistoryStatus=8 and RRId=rr.RRId order by HistoryId desc limit 0,1) as NotRepairableDate,
(Select DATE_FORMAT(Created,'%m/%d/%Y') from tbl_repair_request_status_history 
where HistoryStatus=${Constants.CONST_RRS_QUOTE_REJECTED} and RRId=rr.RRId order by HistoryId desc limit 0,1) as RejectedDate,
DATE_FORMAT(rr.RRCompletedDate,'%m/%d/%Y')  as CompletedDate,rr.RRId,
rr.RRNo,v.VendorName as Supplier,v1.VendorName as Manufacturer,rrp.ManufacturerPartNo,rrp.SerialNo,rrp.Description,DATE_FORMAT(po.DueDate,'%m/%d/%Y') as PODueDate,
CASE rr.Status 
WHEN 0 THEN '${Constants.array_rr_status[0]}'
WHEN 1 THEN '${Constants.array_rr_status[1]}' 
WHEN 2 THEN '${Constants.array_rr_status[2]}' 
WHEN 3 THEN '${Constants.array_rr_status[3]}' 
WHEN 4 THEN '${Constants.array_rr_status[4]}' 
WHEN 5 THEN '${Constants.array_rr_status[5]}' 
WHEN 6 THEN '${Constants.array_rr_status[6]}' 
WHEN 7 THEN '${Constants.array_rr_status[7]}' 
WHEN 8 THEN '${Constants.array_rr_status[8]}'
ELSE '-'	end StatusName, rr.Status,c.CompanyName,rr.CustomerPONo,  



CONCAT(IFNULL(CURL.CurrencySymbol,CURLQ.CurrencySymbol),' ',FORMAT(IF(i.GrandTotal>=0,i.GrandTotal,If(q.GrandTotal>=0,q.GrandTotal,'TBD')),2)) RepairPrice,
ROUND(rr.PartPON,2) as PriceOfNew,
FORMAT(IF(po.GrandTotal>=0,po.GrandTotal,If(vq.GrandTotal>=0,vq.GrandTotal,'TBD')),2) Cost,
IF(i.Shipping,CONCAT('',i.Shipping),CONCAT('',q.ShippingFee)) as ShippingCost,



DATE_FORMAT(rr.Created,'%m/%d/%Y') as AHReceivedDate,DATE_FORMAT(s.DueDate,'%m/%d/%Y') as SalesOrderRequiredDate,
DATE_FORMAT(q.SubmittedDate,'%m/%d/%Y') as QuoteSubmittedDate,
DATE_FORMAT(q.ApprovedDate,'%m/%d/%Y') as ApprovedDate,
Case IsRushRepair
WHEN 0 THEN 'Normal'
WHEN 1 THEN 'Rush'
ELSE '-' end IsRushRepairName,
(select CONCAT(ReferenceLabelName,": ",ReferenceValue) from tbl_repair_request_customer_ref rrcr Left Join tbl_cutomer_reference_labels cl Using(CReferenceId)
where rrcr.IsDeleted = 0 AND RRId=rr.RRId order by 'Rank' limit 0,1) as CustomerReference1,
(select CONCAT(ReferenceLabelName,": ",ReferenceValue) from tbl_repair_request_customer_ref rrcr Left Join tbl_cutomer_reference_labels cl Using(CReferenceId)
where rrcr.IsDeleted = 0 AND RRId=rr.RRId order by 'Rank' limit 1,1) as CustomerReference2,
(select CONCAT(ReferenceLabelName,": ",ReferenceValue) from tbl_repair_request_customer_ref rrcr Left Join tbl_cutomer_reference_labels cl Using(CReferenceId)
where rrcr.IsDeleted = 0 AND RRId=rr.RRId order by 'Rank' limit 2,1) as CustomerReference3,
(select CONCAT(ReferenceLabelName,": ",ReferenceValue)
from tbl_repair_request_customer_ref rrcr
Left Join tbl_cutomer_reference_labels cl Using(CReferenceId) where rrcr.IsDeleted = 0
AND RRId=rr.RRId order by 'Rank' limit 3,1) as CustomerReference4,
(select CONCAT(ReferenceLabelName,": ",ReferenceValue) from tbl_repair_request_customer_ref rrcr Left Join tbl_cutomer_reference_labels cl Using(CReferenceId)
where rrcr.IsDeleted = 0 AND RRId=rr.RRId order by 'Rank' limit 4,1) as CustomerReference5,
(select CONCAT(ReferenceLabelName,": ",ReferenceValue) from tbl_repair_request_customer_ref rrcr Left Join tbl_cutomer_reference_labels cl Using(CReferenceId)
where rrcr.IsDeleted = 0 AND RRId=rr.RRId order by 'Rank' limit 5,1) as CustomerReference6,
rrp.CustomerPartNo1,rrp.CustomerPartNo2,
rr.StatedIssue as CustomerStatedIssue,rrv.RouteCause RootCause,IFNULL(cd.CustomerDepartmentName,'') as CustomerDepartmentName,
(Select GROUP_CONCAT(Notes ORDER BY Notes SEPARATOR ' // ')  from tbl_repair_request_followup_notes
where IsDeleted=0 and RRId=rr.RRId) as RRFollowUpNotes , IFNULL(ca.CustomerAssetName,'') as CustomerAssetName, 
IF(FIND_IN_SET(v.VendorId,c.DirectedVendors)>0,'Yes','No') as DirectedSupplier,
if(rr.Status=6, CASE rr.RejectedStatusType
WHEN 1 THEN '${Constants.array_customer_quote_reject_status[1]}' 
WHEN 2 THEN '${Constants.array_customer_quote_reject_status[2]}' 
WHEN 3 THEN '${Constants.array_customer_quote_reject_status[3]}' 
WHEN 4 THEN '${Constants.array_customer_quote_reject_status[4]}' 
WHEN 5 THEN '${Constants.array_customer_quote_reject_status[5]}' 
WHEN 6 THEN '${Constants.array_customer_quote_reject_status[6]}' 
WHEN 7 THEN '${Constants.array_customer_quote_reject_status[7]}' 
WHEN 8 THEN '${Constants.array_customer_quote_reject_status[8]}'
ELSE '' END  ,'') as QuoteRejectCode, rrv.VendorRefNo,
Case IsWarrantyDenied
WHEN 0 THEN 'No'
WHEN 1 THEN 'Yes'
ELSE '-' end IsWarrantyDeniedName,
if(rrsh.ShipFromIdentity = 1, DATE_FORMAT(rrsh.ShipDate,'%m/%d/%Y'), '-') as ShipFromCustomer,
if(rrsh.ShipFromIdentity=1, CASE rrsh.ShipToId 
  WHEN 5 THEN 'AH Group' 
  ELSE 'Vendor' END, '-') as ShipToName,
Case IsCriticalSpare
WHEN 0 THEN 'No'
WHEN 1 THEN 'Yes'
ELSE '-' end CriticalSpare

FROM tbl_repair_request rr
LEFT JOIN tbl_customers c on c.CustomerId = rr.CustomerId
LEFT JOIN tbl_vendors v on v.VendorId=rr.VendorId
LEFT JOIN tbl_repair_request_vendors rrv on rrv.VendorId=rr.VendorId AND rrv.Status!=3 AND rrv.RRId = rr.RRId   AND rrv.IsDeleted = 0
LEFT JOIN tbl_repair_request_parts rrp on rrp.RRId =rr.RRId
LEFT JOIN tbl_vendors v1 on v1.VendorId=rrp.Manufacturer
LEFT JOIN tbl_customer_departments cd on cd.CustomerDepartmentId=rr.DepartmentId
LEFT JOIN tbl_customer_assets ca on ca.CustomerAssetId=rr.AssetId

LEFT JOIN tbl_quotes q on q.RRId=rr.RRId  and q.RRId>0 and q.Status In(1,2,4) and q.QuoteCustomerStatus In(1,2,3) and q.IsDeleted = 0 
LEFT JOIN tbl_vendor_quote as vq ON vq.QuoteId = q.QuoteId AND vq.IsDeleted =0 AND vq.RRId = q.RRId 
LEFT JOIN tbl_invoice i on i.RRId=rr.RRId and i.RRId>0 AND i.IsDeleted = 0  AND i.Status!=${Constants.CONST_INV_STATUS_CANCELLED}
LEFT JOIN tbl_vendor_invoice vi on vi.RRId=rr.RRId and vi.RRId>0 and vi.IsDeleted = 0 
LEFT JOIN tbl_currencies as CURL  ON CURL.CurrencyCode = i.LocalCurrencyCode AND CURL.IsDeleted = 0 
LEFT JOIN tbl_currencies as CURLQ  ON CURLQ.CurrencyCode = q.LocalCurrencyCode AND CURLQ.IsDeleted = 0 
LEFT JOIN tbl_po po on po.RRId=rr.RRId and po.RRId>0  AND po.Status!=${Constants.CONST_PO_STATUS_CANCELLED} AND po.IsDeleted = 0 

LEFT JOIN tbl_sales_order s on s.RRId=rr.RRId AND s.Status != 3 AND s.IsDeleted = 0

LEFT JOIN tbl_repair_request_shipping_history rrsh ON rrsh.RRId=rr.RRId and rrsh.ShipFromIdentity=1 and 
rrsh.ShippingHistoryId = (SELECT ShippingHistoryId FROM tbl_repair_request_shipping_history
  WHERE RRId = rr.RRId and ShipFromIdentity=1 AND IsDeleted = 0 ORDER BY ShippingHistoryId DESC
  LIMIT 1) AND rrsh.IsDeleted = 0

where  rr.IsDeleted= 0 `;
  if (reqBody.IdentityType == 0 && reqBody.IsRestrictedCustomerAccess == 1 && reqBody.MultipleCustomerIds != "") {
    query += ` and rr.CustomerId in(${reqBody.MultipleCustomerIds}) `;
  }
  if (reqBody.Manufacturer != "") {
    query += " and ( rrp.Manufacturer ='" + reqBody.Manufacturer + "' ) ";
  }
  if (reqBody.ManufacturerPartNo != "") {
    query += " and ( rrp.ManufacturerPartNo ='" + reqBody.ManufacturerPartNo + "' ) ";
  }
  if (reqBody.SerialNo != "") {
    query += " and ( rr.SerialNo ='" + reqBody.SerialNo + "' ) ";
  }
  if (reqBody.Status != "") {
    query += " and ( rr.Status ='" + reqBody.Status + "' ) ";
  }
  if (reqBody.SubStatusId != "") {
    query += " and rr.SubStatusId  = '" + reqBody.SubStatusId + "'  ";
  }
  if (reqBody.AssigneeUserId != "") {
    query += " and rr.AssigneeUserId  = '" + reqBody.AssigneeUserId + "'  ";
  }
  if (reqBody.RRPartLocationId != "") {
    query += " and rr.RRPartLocationId  = '" + reqBody.RRPartLocationId + "'  ";
  }
  if (reqBody.PODueDate != "") {
    query += " and  po.DueDate = '" + reqBody.PODueDate + "'  ";
  }
  if (reqBody.CustomerGroupId != "") {
    // query += " and (rr.CustomerId IN(SELECT CustomerId FROM tbl_customers  WHERE CustomerGroupId IN (" + reqBody.CustomerGroupId + "))) ";
    query += ` and c.CustomerGroupId in(` + reqBody.CustomerGroupId + `)`;
  }
  var Ids;
  if (reqBody.CustomerId != "") {
    Ids = ``;
    for (let val of reqBody.CustomerId) {
      Ids += val + `,`;
    }
    var CustomerIds = Ids.slice(0, -1);
    query += " and  rr.CustomerId IN (" + CustomerIds + ") ";
  }
  if (reqBody.CustomerPONo != "") {
    query += " and ( rr.CustomerPONo ='" + reqBody.CustomerPONo + "' ) ";
  }
  if (reqBody.VendorId != "") {
    Ids = ``;
    for (let val of reqBody.VendorId) {
      Ids += val + `,`;
    }
    var VendorIds = Ids.slice(0, -1);
    query += " and  rr.VendorId IN (" + VendorIds + " ) ";
  }
  if (RRIds != '' && RRIds != null) {
    query += ` and rr.RRId in(` + RRIds + `)`;
  }
  // console.log("SQL=" + query);
  con.query(query, (err, res) => {
    if (err) {
      return result(err, null);
    }
    return result(null, { ExcelData: res });
  });
};
//Get FollowUpReport
RRReportsModel.FollowUpReport = (RRReportsModel, result) => {

  var query = "";
  selectquery = "";

  selectquery = ` Select * from (SELECT rr.CustomerId,rr.RRNo,c.CompanyName,v.VendorName as Supplier,
  rrp.PartNo,rrp.Description,
  (select MIN(Created)   from tbl_repair_request_followup where IsDeleted=0 and RRId=rr.RRId) as FollowUpDate,
  (select MAX(Created)  from tbl_repair_request_followup where IsDeleted=0 and RRId=rr.RRId) as MostRecentFollowUpDate
  FROM tbl_repair_request rr
  LEFT JOIN tbl_customers c on c.CustomerId = rr.CustomerId 
  LEFT JOIN tbl_vendors v on v.VendorId=rr.VendorId 
  LEFT JOIN tbl_repair_request_parts rrp on rrp.RRId =rr.RRId   
  where rr.IsDeleted= 0 )  as x where 1=1 `;

  recordfilterquery = `Select Count(RRNo) as recordsFiltered from (SELECT rr.CustomerId,rr.RRNo,
  (select MIN(Created)  from tbl_repair_request_followup where IsDeleted=0 and RRId=rr.RRId) as FollowUpDate,
  (select MAX(Created)  from tbl_repair_request_followup where IsDeleted=0 and RRId=rr.RRId) as MostRecentFollowUpDate
  FROM tbl_repair_request rr
  LEFT JOIN tbl_customers c on c.CustomerId = rr.CustomerId 
  LEFT JOIN tbl_vendors v on v.VendorId=rr.VendorId 
  LEFT JOIN tbl_repair_request_parts rrp on rrp.RRId =rr.RRId   
  where rr.IsDeleted= 0 )  as x where 1=1 `;

  if (RRReportsModel.CustomerId != "") {
    query += " and CustomerId In(" + RRReportsModel.CustomerId + ") ";
  }
  if (RRReportsModel.FromDate != "") {
    query += " and ( FollowUpdate >='" + RRReportsModel.FromDate + "' ) ";
  }
  if (RRReportsModel.ToDate != "") {
    query += " and ( FollowUpdate <='" + RRReportsModel.ToDate + "'  ) ";
  }

  var Countquery = recordfilterquery + query;

  var i = 0;
  if (RRReportsModel.order.length > 0) {
    query += " ORDER BY ";
  }
  for (i = 0; i < RRReportsModel.order.length; i++) {
    if (RRReportsModel.order[i].column != "" || RRReportsModel.order[i].column == "0")// 0 is equal to ""
    {
      switch (RRReportsModel.columns[RRReportsModel.order[i].column].name) {
        case "RRNo":
          query += " RRNo " + RRReportsModel.order[i].dir + ",";
          break;
        case "CustomerId":
          query += " CustomerId " + RRReportsModel.order[i].dir + ",";
          break;
        case "PartNo":
          query += " PartNo " + RRReportsModel.order[i].dir + ",";
          break;
        case "Supplier":
          query += " Supplier " + RRReportsModel.order[i].dir + ",";
          break;
        case "FollowUpDate":
          query += " FollowUpDate " + RRReportsModel.order[i].dir + ",";
          break;
        case "MostRecentFollowUpDate":
          query += " MostRecentFollowUpDate " + RRReportsModel.order[i].dir + ",";
          break;
        default:
          query += " " + RRReportsModel.columns[RRReportsModel.order[i].column].name + " " + RRReportsModel.order[i].dir + ",";
      }
    }
  }
  var tempquery = query.slice(0, -1);
  var query = tempquery;

  if (RRReportsModel.start != "-1" && RRReportsModel.length != "-1") {
    query += " LIMIT " + RRReportsModel.start + "," + (RRReportsModel.length);
  }
  query = selectquery + query;
  var TotalCountQuery = `SELECT Count(rr.RRId) as TotalCount 
  FROM tbl_repair_request rr
  LEFT JOIN tbl_customers c on c.CustomerId = rr.CustomerId 
  LEFT JOIN tbl_vendors v on v.VendorId=rr.VendorId 
  LEFT JOIN tbl_repair_request_parts rrp on rrp.RRId =rr.RRId   
  where  rr.IsDeleted= 0 `;

  // console.log("query = " + query);
  // console.log("Countquery = " + Countquery);
  // console.log("TotalCountQuery = " + TotalCountQuery);
  async.parallel([
    function (result) { con.query(query, result) },
    function (result) { con.query(Countquery, result) },
    function (result) { con.query(TotalCountQuery, result) }
  ],
    function (err, results) {
      if (err)
        return result(err, null);

      //   if (results[0][0].length > 0) {
      result(null, {
        data: results[0][0], recordsFiltered: results[1][0][0].recordsFiltered,
        recordsTotal: results[2][0][0].TotalCount, draw: RRReportsModel.draw
      });
      return;
      // }
      // else {
      //   result(null, "No record");
      //   return;
      // }
    });
};
//Get FollowUpReport ExportToExcel
RRReportsModel.FollowUpReportExportToExcel = (reqBody, result) => {

  var Ids = ``;
  for (let val of reqBody.RRReports) {
    Ids += val.RRId + `,`;
  }
  var RRIds = Ids.slice(0, -1);

  var query = ``;
  query = ` Select * from (SELECT rr.RRId,rr.CustomerId,rr.RRNo,c.CompanyName,v.VendorName as Supplier,
  rrp.PartNo,rrp.Description,
  (select MIN(Created)   from tbl_repair_request_followup where IsDeleted=0 and RRId=rr.RRId) as FollowUpDate,
  (select MAX(Created)  from tbl_repair_request_followup where IsDeleted=0 and RRId=rr.RRId) as MostRecentFollowUpDate
  FROM tbl_repair_request rr
  LEFT JOIN tbl_customers c on c.CustomerId = rr.CustomerId 
  LEFT JOIN tbl_vendors v on v.VendorId=rr.VendorId 
  LEFT JOIN tbl_repair_request_parts rrp on rrp.RRId =rr.RRId   
  where rr.IsDeleted= 0 )  as x where 1=1 `;
  if (reqBody.CustomerId != "") {
    query += " and CustomerId In(" + reqBody.CustomerId + ") ";
  }
  if (reqBody.FromDate != "") {
    query += " and ( FollowUpdate >='" + reqBody.FromDate + "' ) ";
  }
  if (reqBody.ToDate != "") {
    query += " and ( FollowUpdate <='" + reqBody.ToDate + "'  ) ";
  }
  if (RRIds != '' && RRIds != null) {
    query += ` and RRId in(` + RRIds + `)`;
  }
  // console.log("SQL=" + query);
  con.query(query, (err, res) => {
    if (err) {
      return result(err, null);
    }
    return result(null, { ExcelData: res });
  });
};
//Get BPIReport
RRReportsModel.BPIReport = (RRReportsModel, result) => {

  var query = "";
  selectquery = "";

  selectquery = ` SELECT rr.RRNo,rrp.PartNo,v.VendorName,m.VendorName Manufacturer,rrp.ManufacturerPartNo,rrp.SerialNo,rrp.Description,
  CASE rr.Status 
  WHEN 0 THEN '${Constants.array_rr_status[0]}'
  WHEN 1 THEN '${Constants.array_rr_status[1]}' 
  WHEN 2 THEN '${Constants.array_rr_status[2]}' 
  WHEN 3 THEN '${Constants.array_rr_status[3]}' 
  WHEN 4 THEN '${Constants.array_rr_status[4]}' 
  WHEN 5 THEN '${Constants.array_rr_status[5]}' 
  WHEN 6 THEN '${Constants.array_rr_status[6]}' 
  WHEN 7 THEN '${Constants.array_rr_status[7]}' 
  WHEN 8 THEN '${Constants.array_rr_status[8]}' 
  ELSE '-'	end StatusName, rr.Status,rr.Price as CustomerRepairCost,c.CompanyName,
  CONCAT('$ ',FORMAT(IFNULL(rr.PartPON,0),2)) as PriceOfNew,CONCAT('$ ',FORMAT(rr.Price,2)) as Cost,CONCAT('$ ',FORMAT(IFNULL(i.Shipping,0),2)) as ShippingCost,
  rr.Created as DateLogged,
  (select CASE WHEN HistoryStatus = '4' THEN Created ELSE "-" END from tbl_repair_request_status_history where  IsDeleted = 0 AND RRId=rr.RRId limit 4,1) as QuoteSubmittedToCustomer,
  '' as DateCompleted,
  Case IsWarrantyRecovery	 
  WHEN 1 THEN '${Constants.array_IsWarrantyRepair[1]}'
  WHEN 2 THEN '${Constants.array_IsWarrantyRepair[2]}'
  ELSE '-'	end IsWarrantyRecoveryName,rr.CustomerPONo,rrv.RouteCause `;

  recordfilterquery = `Select count(rr.RRId) as recordsFiltered `;
  query = query + ` FROM tbl_repair_request rr
  LEFT JOIN tbl_customers c on c.CustomerId = rr.CustomerId 
  LEFT JOIN tbl_vendors v on v.VendorId=rr.VendorId 
  LEFT JOIN tbl_repair_request_vendors rrv on rrv.RRVendorId=rr.VendorId 
  LEFT JOIN tbl_repair_request_parts rrp on rrp.RRId =rr.RRId 
  LEFT JOIN tbl_vendors m on m.VendorId=rrp.Manufacturer
  LEFT JOIN tbl_invoice i on i.RRId =rr.RRId  
  where  rr.IsDeleted= 0 `;

  if (RRReportsModel.Manufacturer != "") {
    query += " and ( rrp.Manufacturer ='" + RRReportsModel.Manufacturer + "' ) ";
  }
  if (RRReportsModel.ManufacturerPartNo != "") {
    query += " and ( rrp.ManufacturerPartNo ='" + RRReportsModel.ManufacturerPartNo + "' ) ";
  }
  if (RRReportsModel.SerialNo != "") {
    query += " and ( rr.SerialNo ='" + RRReportsModel.SerialNo + "' ) ";
  }
  if (RRReportsModel.Status != "") {
    query += " and ( rr.Status ='" + RRReportsModel.Status + "' ) ";
  }
  if (RRReportsModel.CustomerId != "") {
    query += " and rr.CustomerId In(" + RRReportsModel.CustomerId + ") ";
  }
  if (RRReportsModel.CustomerPONo != "") {
    query += " and ( rr.CustomerPONo ='" + RRReportsModel.CustomerPONo + "' ) ";
  }
  if (RRReportsModel.VendorId != "") {
    query += " and ( rr.VendorId ='" + RRReportsModel.VendorId + "' ) ";
  }
  var i = 0;
  if (RRReportsModel.order.length > 0) {
    query += " ORDER BY ";
  }
  for (i = 0; i < RRReportsModel.order.length; i++) {
    if (RRReportsModel.order[i].column != "" || RRReportsModel.order[i].column == "0")// 0 is equal to ""
    {
      switch (RRReportsModel.columns[RRReportsModel.order[i].column].name) {
        case "RRNo":
          query += " rr.RRNo " + RRReportsModel.order[i].dir + ",";
          break;
        case "CustomerId":
          query += " rr.CustomerId " + RRReportsModel.order[i].dir + ",";
          break;
        case "SerialNo":
          query += " rrp.SerialNo " + RRReportsModel.order[i].dir + ",";
          break;
        default:
          query += " " + RRReportsModel.columns[RRReportsModel.order[i].column].name + " " + RRReportsModel.order[i].dir + ",";

      }
    }
  }
  var tempquery = query.slice(0, -1);
  var query = tempquery;
  var Countquery = recordfilterquery + query;
  if (RRReportsModel.start != "-1" && RRReportsModel.length != "-1") {
    query += " LIMIT " + RRReportsModel.start + "," + (RRReportsModel.length);
  }
  query = selectquery + query;

  var TotalCountQuery = `SELECT Count(rr.RRId) as TotalCount 
  FROM tbl_repair_request rr
  LEFT JOIN tbl_customers c on c.CustomerId = rr.CustomerId 
  LEFT JOIN tbl_vendors v on v.VendorId=rr.VendorId 
  LEFT JOIN tbl_repair_request_vendors rrv on rrv.RRVendorId=rr.VendorId 
  LEFT JOIN tbl_repair_request_parts rrp on rrp.RRId =rr.RRId   
  LEFT JOIN tbl_vendors m on m.VendorId=rrp.Manufacturer
  LEFT JOIN tbl_invoice i on i.RRId =rr.RRId  
  where  rr.IsDeleted= 0 `;

  //console.log("query = " + query);
  //console.log("Countquery = " + Countquery);
  // console.log("TotalCountQuery = " + TotalCountQuery);
  async.parallel([
    function (result) { con.query(query, result) },
    function (result) { con.query(Countquery, result) },
    function (result) { con.query(TotalCountQuery, result) }
  ],
    function (err, results) {
      if (err)
        return result(err, null);

      // if (results[0][0].length > 0) {
      result(null, {
        data: results[0][0], recordsFiltered: results[1][0][0].recordsFiltered,
        recordsTotal: results[2][0][0].TotalCount, draw: RRReportsModel.draw
      });
      return;
      // }
      // else {
      //   result(null, "No record");
      //   return;
      // }
    });
};
//Get BPIReportReport ExportToExcel
RRReportsModel.BPIReportExportToExcel = (reqBody, result) => {

  var Ids = ``;
  for (let val of reqBody.RRReports) {
    Ids += val.RRId + `,`;
  }
  var RRIds = Ids.slice(0, -1);
  var sql = ``;
  sql = ` SELECT rr.RRNo,rrp.PartNo,v.VendorName,m.VendorName Manufacturer,rrp.ManufacturerPartNo,rrp.SerialNo,rrp.Description,
  CASE rr.Status 
  WHEN 0 THEN '${Constants.array_rr_status[0]}'
  WHEN 1 THEN '${Constants.array_rr_status[1]}' 
  WHEN 2 THEN '${Constants.array_rr_status[2]}' 
  WHEN 3 THEN '${Constants.array_rr_status[3]}' 
  WHEN 4 THEN '${Constants.array_rr_status[4]}' 
  WHEN 5 THEN '${Constants.array_rr_status[5]}' 
  WHEN 6 THEN '${Constants.array_rr_status[6]}' 
  WHEN 7 THEN '${Constants.array_rr_status[7]}' 
    WHEN 8 THEN '${Constants.array_rr_status[8]}' 
  ELSE '-'	end StatusName,rr.Price as CustomerRepairCost,c.CompanyName,
  CONCAT('$ ',FORMAT(IFNULL(rr.PartPON,0),2)) as PriceOfNew,CONCAT('$ ',FORMAT(rr.Price,2)) as Cost,CONCAT('$ ',FORMAT(IFNULL(i.Shipping,0),2)) as ShippingCost,
  rr.Created as DateLogged,
  (select CASE WHEN HistoryStatus = '4' THEN Created ELSE "-" END from tbl_repair_request_status_history where  IsDeleted = 0 AND RRId=rr.RRId limit 4,1) as QuoteSubmittedToCustomer,
  '' as DateCompleted,
  Case IsWarrantyRecovery	 
  WHEN 1 THEN '${Constants.array_IsWarrantyRepair[1]}'
  WHEN 2 THEN '${Constants.array_IsWarrantyRepair[2]}'
  ELSE '-'	end IsWarrantyRecoveryName,rr.CustomerPONo,rrv.RouteCause 
  FROM tbl_repair_request rr
  LEFT JOIN tbl_customers c on c.CustomerId = rr.CustomerId 
  LEFT JOIN tbl_vendors v on v.VendorId=rr.VendorId 
  LEFT JOIN tbl_repair_request_vendors rrv on rrv.RRVendorId=rr.VendorId 
  LEFT JOIN tbl_repair_request_parts rrp on rrp.RRId =rr.RRId  
  LEFT JOIN tbl_vendors m on m.VendorId=rrp.Manufacturer
   LEFT JOIN tbl_invoice i on i.RRId =rr.RRId and i.IsDeleted=0  
  where  rr.IsDeleted= 0 `;
  if (reqBody.Manufacturer != "") {
    sql += " and ( rrp.Manufacturer ='" + reqBody.Manufacturer + "' ) ";
  }
  if (reqBody.ManufacturerPartNo != "") {
    sql += " and ( rrp.ManufacturerPartNo ='" + reqBody.ManufacturerPartNo + "' ) ";
  }
  if (reqBody.SerialNo != "") {
    sql += " and ( rr.SerialNo ='" + reqBody.SerialNo + "' ) ";
  }
  if (reqBody.Status != "") {
    sql += " and ( rr.Status ='" + reqBody.Status + "' ) ";
  }
  if (reqBody.CustomerId != "") {
    sql += " and rr.CustomerId In(" + reqBody.CustomerId + ") ";
  }
  if (reqBody.CustomerPONo != "") {
    sql += " and ( rr.CustomerPONo ='" + reqBody.CustomerPONo + "' ) ";
  }
  if (reqBody.VendorId != "") {
    sql += " and ( rr.VendorId ='" + reqBody.VendorId + "' ) ";
  }
  if (RRIds != '' && RRIds != null) {
    sql += `and rr.RRId in(` + RRIds + `)`;
  }
  // console.log("SQL=" + sql);
  con.query(sql, (err, res) => {
    if (err) {
      return result(err, null);
    }
    return result(null, { ExcelData: res });
  });
};


//Get CustomerReportAmazonRaw
RRReportsModel.CustomerReportAmazonRaw = (RRReportsModel, result) => {

  var query = "";
  var order = "";
  var selectquery = ` 
  SELECT rr.RRNo as RepairRequest,
  (select ReferenceValue from tbl_repair_request_customer_ref rrcr Left Join tbl_cutomer_reference_labels cl Using(CReferenceId) where rrcr.IsDeleted = 0 AND RRId=rr.RRId order by 'Rank' limit 1,1) as APN,
  rr.SerialNo as 'Serial',
  rr.RRDescription as Description,
  c.CompanyName as  SiteCode,  
  CONCAT(CURL.CurrencySymbol,' ',IF(i.GrandTotal>=0,i.GrandTotal,If(q.GrandTotal>=0,q.GrandTotal,'TBD'))) RepairPrice,
  q.RouteCause as RootCause,
  CASE rr.Status
  WHEN 0 THEN '${Constants.array_rr_status[0]}'
  WHEN 1 THEN '${Constants.array_rr_status[1]}' 
  WHEN 2 THEN '${Constants.array_rr_status[2]}' 
  WHEN 3 THEN '${Constants.array_rr_status[3]}' 
  WHEN 4 THEN '${Constants.array_rr_status[4]}' 
  WHEN 5 THEN '${Constants.array_rr_status[5]}' 
  WHEN 6 THEN '${Constants.array_rr_status[6]}' 
  WHEN 7 THEN '${Constants.array_rr_status[7]}' 
  WHEN 8 THEN '${Constants.array_rr_status[8]}' 
  ELSE '-'	end Status,
  1 as Quantity,
  FORMAT(Round(rr.PartPON),2) as PartPrice,  
  DATE_FORMAT(rr.Created,'%m/%d/%Y') OpenDate,
  DATE_FORMAT(q.SubmittedDate,'%m/%d/%Y') QuoteSubmittedToCustomer,
  DATE_FORMAT(q.ApprovedDate,'%m/%d/%Y') QuoteApprovedDate,
  IF(rr.Status=6,DATE_FORMAT(rr.Modified,'%m/%d/%Y'),'') QuoteRejected,
  IF(rr.Status=7,DATE_FORMAT(rr.Modified,'%m/%d/%Y'),'') DateshippedbacktoFC,
  IF(rr.Status=6,(CASE q.QuoteRejectedType  
  WHEN 1 THEN '${Constants.array_customer_quote_reject_status[1]}' 
  WHEN 2 THEN '${Constants.array_customer_quote_reject_status[2]}' 
  WHEN 3 THEN '${Constants.array_customer_quote_reject_status[3]}' 
  WHEN 4 THEN '${Constants.array_customer_quote_reject_status[4]}'
  WHEN 5 THEN '${Constants.array_customer_quote_reject_status[5]}'
  WHEN 6 THEN '${Constants.array_customer_quote_reject_status[6]}'
  WHEN 7 THEN '${Constants.array_customer_quote_reject_status[7]}'
  WHEN 8 THEN '${Constants.array_customer_quote_reject_status[8]}'
  ELSE ''	end),'') as QuoteRejectedType `;


  recordfilterquery = `Select count(rr.RRId) as recordsFiltered `;
  query = query + ` FROM tbl_repair_request rr
LEFT JOIN tbl_customers c on c.CustomerId=rr.CustomerId
LEFT JOIN tbl_quotes q on q.RRId=rr.RRId  and q.RRId>0 and q.Status In(1,2,4) and q.QuoteCustomerStatus In(1,2,3) and q.IsDeleted = 0 
LEFT JOIN tbl_invoice i on i.RRId=rr.RRId and i.RRId>0 and i.IsDeleted = 0  AND i.Status!=${Constants.CONST_INV_STATUS_CANCELLED}
LEFT JOIN tbl_currencies as CURL  ON CURL.CurrencyCode = i.LocalCurrencyCode AND CURL.IsDeleted = 0 
 WHERE rr.IsDeleted=0  `;
  if (RRReportsModel.IdentityType == 0 && RRReportsModel.IsRestrictedCustomerAccess == 1 && RRReportsModel.MultipleCustomerIds != "") {
    query += ` and rr.CustomerId in(${RRReportsModel.MultipleCustomerIds}) `;
  }

  if (RRReportsModel.search.value != '') {
    query = query + ` and ( 
        rr.PartNo = '${RRReportsModel.search.value}' 
        or rr.RRNo LIKE '%${RRReportsModel.search.value}%' 
        or c.CompanyName LIKE '%${RRReportsModel.search.value}%' 
        or rr.SerialNo LIKE '%${RRReportsModel.search.value}%'
        ) `;
  }

  if (RRReportsModel.CustomerId != "") {
    query += " and  rr.CustomerId In (" + RRReportsModel.CustomerId + ") ";
  }
  if (RRReportsModel.CustomerGroupId != "") {
    query += " and  c.CustomerGroupId In (" + RRReportsModel.CustomerGroupId + ") ";
  }
  if (RRReportsModel.FromDate != "") {
    query += " and ( rr.Created >='" + RRReportsModel.FromDate + "' ) ";
  }
  if (RRReportsModel.ToDate != "") {
    query += " and  rr.Created <='" + RRReportsModel.ToDate + "'  ";
  }
  var i = 0;
  if (RRReportsModel.order.length > 0) {
    order += " ORDER BY ";
  }
  for (i = 0; i < RRReportsModel.order.length; i++) {
    if (RRReportsModel.order[i].column != "" || RRReportsModel.order[i].column == "0")// 0 is equal to ""
    {
      switch (RRReportsModel.columns[RRReportsModel.order[i].column].name) {
        case "PartNo":
          order += " rr.PartNo " + RRReportsModel.order[i].dir + ",";
          break;
        case "RRNo":
          order += " rr.RRId " + RRReportsModel.order[i].dir + ",";
          break;
        case "RepairRequest":
          order += " rr.RRId " + RRReportsModel.order[i].dir + ",";
          break;
        case "CustomerId":
          order += " rr.CustomerId " + RRReportsModel.order[i].dir + ",";
          break;
        default:
          order += " " + RRReportsModel.columns[RRReportsModel.order[i].column].name + " " + RRReportsModel.order[i].dir + ",";
          break;
      }
    }
  }
  order = order.slice(0, -1);
  // var tempquery = query.slice(0, -1);
  // var query = tempquery;
  var Countquery = recordfilterquery + query;
  var limit = "";
  if (RRReportsModel.start != "-1" && RRReportsModel.length != "-1") {
    limit += " LIMIT " + RRReportsModel.start + "," + (RRReportsModel.length);
  }
  query = selectquery + query + order + limit;

  var TotalCountQuery = `SELECT Count(rr.RRId) as TotalCount 
FROM tbl_repair_request rr
LEFT JOIN tbl_customers c on c.CustomerId=rr.CustomerId
LEFT JOIN tbl_quotes q on q.RRId=rr.RRId  and q.RRId>0 and q.Status IN(1,2,4) and q.QuoteCustomerStatus IN(1,2,3) and q.IsDeleted = 0 
LEFT JOIN tbl_invoice i on i.RRId=rr.RRId and i.RRId>0 and i.IsDeleted = 0  AND i.Status!=${Constants.CONST_INV_STATUS_CANCELLED}
 WHERE rr.IsDeleted=0 `;
  if (RRReportsModel.IdentityType == 0 && RRReportsModel.IsRestrictedCustomerAccess == 1 && RRReportsModel.MultipleCustomerIds != "") {
    TotalCountQuery += ` and rr.CustomerId in(${RRReportsModel.MultipleCustomerIds}) `;
  }
  //console.log("query = " + query);
  // console.log("Countquery = " + Countquery);
  //console.log("TotalCountQuery = " + TotalCountQuery);
  async.parallel([
    function (result) { con.query(query, result) },
    function (result) { con.query(Countquery, result) },
    function (result) { con.query(TotalCountQuery, result) }
  ],
    function (err, results) {
      if (err)
        return result(err, null);
      result(null, {
        data: results[0][0], recordsFiltered: results[1][0][0].recordsFiltered,
        recordsTotal: results[2][0][0].TotalCount, draw: RRReportsModel.draw
      });
      return;

    });
};


RRReportsModel.CustomerReportAmazonRawCSV = (RRReportsModel, result) => {

  var query = "";
  var selectquery = ` 
  SELECT rr.RRNo as 'Repair Request #',
  IFNULL((select ReferenceValue from tbl_repair_request_customer_ref rrcr Left Join tbl_cutomer_reference_labels cl Using(CReferenceId) where rrcr.IsDeleted = 0 AND RRId=rr.RRId order by 'Rank' limit 1,1), "") as 'APN#',
  rr.SerialNo as 'Serial #',
  rr.RRDescription as Description,
  c.CompanyName as  'Site Code',  
  i.LocalCurrencyCode as Currency,
  IF(i.GrandTotal>=0,i.GrandTotal,If(q.GrandTotal>=0,q.GrandTotal,'TBD')) 'Repair Price', 
  IFNULL(q.RouteCause, "") as 'Root Cause',
  CASE rr.Status
  WHEN 0 THEN '${Constants.array_rr_status[0]}'
  WHEN 1 THEN '${Constants.array_rr_status[1]}' 
  WHEN 2 THEN '${Constants.array_rr_status[2]}' 
  WHEN 3 THEN '${Constants.array_rr_status[3]}' 
  WHEN 4 THEN '${Constants.array_rr_status[4]}' 
  WHEN 5 THEN '${Constants.array_rr_status[5]}' 
  WHEN 6 THEN '${Constants.array_rr_status[6]}' 
  WHEN 7 THEN '${Constants.array_rr_status[7]}' 
    WHEN 8 THEN '${Constants.array_rr_status[8]}' 
  ELSE '-'	end Status,
  1 as Quantity,
  FORMAT(Round(rr.PartPON),2) as 'Part Price',  
  DATE_FORMAT(rr.Created,'%m/%d/%Y') as 'Date (Status = Open)',
  IFNULL(DATE_FORMAT(q.SubmittedDate,'%m/%d/%Y'), "") as 'Date (Status = Quote Submitted)',
  IFNULL(DATE_FORMAT(q.ApprovedDate,'%m/%d/%Y'), "") as 'Date (Status = Quote Approved)',
  IF(rr.Status=6,IFNULL(DATE_FORMAT(rr.Modified,'%m/%d/%Y'), ""),'') as 'Date (Status = Quote Rejected)',
  IF(rr.Status=7,IFNULL(DATE_FORMAT(rr.Modified,'%m/%d/%Y'), ""),'') as 'Date shipped back to FC',
  IF(rr.Status=6,(CASE q.QuoteRejectedType  
  WHEN 1 THEN '${Constants.array_customer_quote_reject_status[1]}' 
  WHEN 2 THEN '${Constants.array_customer_quote_reject_status[2]}' 
  WHEN 3 THEN '${Constants.array_customer_quote_reject_status[3]}' 
  WHEN 4 THEN '${Constants.array_customer_quote_reject_status[4]}'
  WHEN 5 THEN '${Constants.array_customer_quote_reject_status[5]}'
  WHEN 6 THEN '${Constants.array_customer_quote_reject_status[6]}'
  WHEN 7 THEN '${Constants.array_customer_quote_reject_status[7]}'
  WHEN 8 THEN '${Constants.array_customer_quote_reject_status[8]}'
  ELSE ''	end),'') as 'Rejection Code' `;



  query = query + ` FROM tbl_repair_request rr
LEFT JOIN tbl_customers c on c.CustomerId=rr.CustomerId
LEFT JOIN tbl_quotes q on q.RRId=rr.RRId  and q.RRId>0 and q.Status In(1,2,4) and q.QuoteCustomerStatus In(1,2,3) and q.IsDeleted = 0 
LEFT JOIN tbl_invoice i on i.RRId=rr.RRId and i.RRId>0 and i.IsDeleted = 0  AND i.Status!=${Constants.CONST_INV_STATUS_CANCELLED}
 WHERE rr.IsDeleted=0  `;
  if (RRReportsModel.IdentityType == 0 && RRReportsModel.IsRestrictedCustomerAccess == 1 && RRReportsModel.MultipleCustomerIds != "") {
    query += ` and rr.CustomerId in(${RRReportsModel.MultipleCustomerIds}) `;
  }
  if (RRReportsModel.CustomerId != "") {
    query += " and  rr.CustomerId In (" + RRReportsModel.CustomerId + ") ";
  }
  if (RRReportsModel.CustomerGroupId != "") {
    query += " and  c.CustomerGroupId In (" + RRReportsModel.CustomerGroupId + ") ";
  }
  if (RRReportsModel.FromDate != "") {
    query += " and ( rr.Created >='" + RRReportsModel.FromDate + "' ) ";
  }
  if (RRReportsModel.ToDate != "") {
    query += " and  rr.Created <='" + RRReportsModel.ToDate + "'  ";
  }
  var i = 0;
  if (RRReportsModel.order.length > 0) {
    query += " ORDER BY ";
  }
  for (i = 0; i < RRReportsModel.order.length; i++) {
    if (RRReportsModel.order[i].column != "" || RRReportsModel.order[i].column == "0")// 0 is equal to ""
    {
      switch (RRReportsModel.columns[RRReportsModel.order[i].column].name) {
        case "PartNo":
          query += " rr.PartNo " + RRReportsModel.order[i].dir + ",";
          break;
        case "RRNo":
          query += " rr.RRNo " + RRReportsModel.order[i].dir + ",";
          break;
        case "RepairRequest":
          query += " rr.RRNo " + RRReportsModel.order[i].dir + ",";
          break;
        case "CustomerId":
          query += " rr.CustomerId " + RRReportsModel.order[i].dir + ",";
          break;
        default:
          query += " " + RRReportsModel.columns[RRReportsModel.order[i].column].name + " " + RRReportsModel.order[i].dir + ",";
          break;
      }
    }
  }
  var tempquery = query.slice(0, -1);
  var query = tempquery;
  query = selectquery + query;

  //console.log(query);
  con.query(query, (err, res) => {
    if (err) {
      return result(err, null);
    }
    return result(null, { ExcelData: res });
  });
};

RRReportsModel.RRARReports = (RepairRequest, result) => {
  var query = ``;
  var selectquery = `SELECT rr.RRNo,rr.PartNo,v.VendorName as Vendor, v.VendorId, rr.RRDescription Description,rr.Status ,
    CASE rr.Status 
    WHEN 0 THEN '${Constants.array_rr_status[0]}'
    WHEN 1 THEN '${Constants.array_rr_status[1]}' 
    WHEN 2 THEN '${Constants.array_rr_status[2]}'
    WHEN 3 THEN '${Constants.array_rr_status[3]}'
    WHEN 4 THEN '${Constants.array_rr_status[4]}'
    WHEN 5 THEN '${Constants.array_rr_status[5]}'
    WHEN 6 THEN '${Constants.array_rr_status[6]}'
    WHEN 7 THEN '${Constants.array_rr_status[7]}'
    WHEN 8 THEN '${Constants.array_rr_status[8]}'
    ELSE '-'	end StatusName,
    CASE rr.RejectedStatusType 
    WHEN 0 THEN '-'
    WHEN 1 THEN '${Constants.array_customer_quote_reject_status[1]}' 
    WHEN 2 THEN '${Constants.array_customer_quote_reject_status[2]}'
    WHEN 3 THEN '${Constants.array_customer_quote_reject_status[3]}'
    WHEN 4 THEN '${Constants.array_customer_quote_reject_status[4]}'
    WHEN 5 THEN '${Constants.array_customer_quote_reject_status[5]}'
    WHEN 6 THEN '${Constants.array_customer_quote_reject_status[6]}'
    WHEN 7 THEN '${Constants.array_customer_quote_reject_status[7]}'
    WHEN 8 THEN '${Constants.array_customer_quote_reject_status[8]}'
    ELSE '-'	end RejectedApprovedCode,
    c.CompanyName Customer,c.CustomerId, 
    trrsh.ModifiedByName as RejectedApprovedBy,    
    IF(rr.Status=7, DATE_FORMAT(rr.RRCompletedDate,'%m/%d/%Y'), DATE_FORMAT(trrsh.Created,'%m/%d/%Y') )  as RejectedApprovedDate,
    CONCAT(ifnull(CURL.CurrencySymbol,CURQ.CurrencySymbol),' ',     
    FORMAT((IF(i.GrandTotal>=0,i.GrandTotal,If(so.GrandTotal>=0,so.GrandTotal,If(q.GrandTotal>=0,q.GrandTotal,'')))),2)) Amount 
    
    
    , '-' as fromDate, '-' as toDate`;

  recordfilterquery = `Select count(rr.RRId) as recordsFiltered `;

  query = query + ` FROM tbl_repair_request rr
    LEFT JOIN tbl_customers c on c.CustomerId=rr.CustomerId 
    LEFT JOIN tbl_vendors v on v.VendorId=rr.VendorId       
    LEFT JOIN tbl_quotes q on q.RRVendorId=rr.RRVendorId AND q.RRId=rr.RRId  and q.RRId>0 and q.Status In(1,2,4) and q.QuoteCustomerStatus In(1,2,3) and q.IsDeleted = 0     
    LEFT JOIN tbl_po as po ON po.POId = rr.VendorPOId and po.IsDeleted=0
    LEFT JOIN tbl_sales_order as so ON so.SOId = rr.CustomerSOId  and so.IsDeleted = 0
    LEFT JOIN tbl_invoice as i ON i.InvoiceId = rr.CustomerInvoiceId AND i.IsDeleted = 0
    LEFT JOIN tbl_currencies as CURL  ON CURL.CurrencyCode = i.LocalCurrencyCode AND CURL.IsDeleted = 0
    LEFT JOIN tbl_currencies as CURQ  ON CURQ.CurrencyCode = q.LocalCurrencyCode AND CURQ.IsDeleted = 0
    LEFT JOIN tbl_currencies as CURQB  ON CURQB.CurrencyCode = q.BaseCurrencyCode AND CURQB.IsDeleted = 0  
    LEFT JOIN tbl_repair_request_status_history as trrsh  ON trrsh.RRId = rr.RRId AND trrsh.HistoryStatus = rr.Status    
    WHERE rr.IsDeleted=0 and ifnull(po.IsDeleted,0)=0 and q.LocalCurrencyCode !='' and q.BaseCurrencyCode != '' and
    trrsh.HistoryId = (SELECT MAX(HistoryId)  FROM tbl_repair_request_status_history WHERE  RRId = rr.RRId AND  HistoryStatus = rr.Status)
    
    `;
  if (RepairRequest.IdentityType == 0 && RepairRequest.IsRestrictedCustomerAccess == 1 && RepairRequest.MultipleCustomerIds != "") {
    TotalCountQuery += ` and rr.CustomerId in(${RepairRequest.MultipleCustomerIds}) `;
    query += ` and rr.CustomerId in(${RepairRequest.MultipleCustomerIds}) `;
  }
  // if (RepairRequest.Status && RepairRequest.Status != '') {
  //   query += " and ( rr.Status ='" + RepairRequest.Status + "' ) ";
  // }
  if (RepairRequest.search.value != '') {

    query = query + ` and ( rr.RRNo LIKE '%${RepairRequest.search.value}%'
     or rr.PartNo LIKE '%${RepairRequest.search.value}%' 
     or rr.SerialNo LIKE '%${RepairRequest.search.value}%' 
    or c.CompanyName LIKE '%${RepairRequest.search.value}%' 
    or v.VendorName LIKE '%${RepairRequest.search.value}%'

    or rr.CustomerPONo LIKE '%${RepairRequest.search.value}%'
    or rr.VendorPONo LIKE '%${RepairRequest.search.value}%'
    or vi.VendorInvoiceNo LIKE '%${RepairRequest.search.value}%'
    or rr.Status LIKE '%${RepairRequest.search.value}%' ) `;
  }

  var cvalue = 0;
  var obj = RepairRequest;
  const found = obj.columns.find(element => element.name == "Status");
  if (found.search.value == '') {
    if (RepairRequest.Status && RepairRequest.Status != '') {
      TotalCountQuery += " and ( rr.Status ='" + RepairRequest.Status + "' ) ";
      query += " and ( rr.Status ='" + RepairRequest.Status + "' ) ";
    }
  }
  for (cvalue = 0; cvalue < obj.columns.length; cvalue++) {
    if (obj.columns[cvalue].search.value != "") {
      switch (obj.columns[cvalue].name) {
        case "RRNo":
          query += " and ( rr.RRNo='" + obj.columns[cvalue].search.value + "' ) ";
          break;
        case "CompanyName":
          query += " and ( c.CompanyName LIKE '%" + obj.columns[cvalue].search.value + "%' ) ";
          break;
        case "VendorName":
          query += " and ( v.VendorName='" + obj.columns[cvalue].search.value + "' ) ";
          break;
        case "PartNo":
          query += " and ( rr.PartNo='" + obj.columns[cvalue].search.value + "' ) ";
          break;
        case "Description":
          query += " and ( rr.Description LIKE '%" + obj.columns[cvalue].search.value + "%' ) ";
          break;
        case "Amount":
          query += " and ( cb.Amount ='" + obj.columns[cvalue].search.value + "' ) ";
          break;
        case "StatusName":
          query += " and ( rr.StatusName ='" + obj.columns[cvalue].search.value + "' ) ";
          break;
        case "RejectedApprovedBy":
          query += " and ( trrsh.ModifiedByName ='" + obj.columns[cvalue].search.value + "' ) ";
          break;
        case "RejectedDate":
          if (rr.Status == 7) {
            query += " and ( DATE(rr.RRCompletedDate) ='" + obj.columns[cvalue].search.value + "' ) ";
          } else {
            query += " and ( DATE(trrsh.Created) ='" + obj.columns[cvalue].search.value + "' ) ";
          }
          break;
        case "RejectionCode":
          query += " and ( rr.RejectionCode LIKE '%" + obj.columns[cvalue].search.value + "%' ) ";
          break;
        case "CustomerId":
          query += " and  rr.CustomerId in (" + obj.columns[cvalue].search.value + ") ";
          break;
        case "CustomerGroupId":
          query += " and  c.CustomerGroupId in (" + obj.columns[cvalue].search.value + ") ";
          break;
        case "VendorId":
          query += " and  rr.VendorId in (" + obj.columns[cvalue].search.value + ") ";
          break;
        case "Status":
          query += " and ( rr.Status ='" + obj.columns[cvalue].search.value + "' ) ";
          break;
        case "fromDate":
          if (RepairRequest.Status == 7) {
            query += " and ( DATE(rr.RRCompletedDate) >='" + obj.columns[cvalue].search.value + "' ) ";
          } else {
            query += " and ( DATE(trrsh.Created) >='" + obj.columns[cvalue].search.value + "' ) ";
          }
          break;
        case "toDate":
          if (RepairRequest.Status == 7) {
            query += " and ( DATE(rr.RRCompletedDate) <='" + obj.columns[cvalue].search.value + "' ) ";
          } else {
            query += " and ( DATE(trrsh.Created) <='" + obj.columns[cvalue].search.value + "' ) ";
          }
          break;
        default:
          query += " and ( " + obj.columns[cvalue].name + " LIKE '%" + obj.columns[cvalue].search.value + "%' ) ";
      }
    }
  }

  var i = 0;
  var orderQuery = "";
  if (RepairRequest.order.length > 0) {
    orderQuery += " ORDER BY ";
  }
  for (i = 0; i < RepairRequest.order.length; i++) {
    if (RepairRequest.order[i].column != "" || RepairRequest.order[i].column == "0")// 0 is equal to ""
    {
      switch (RepairRequest.columns[RepairRequest.order[i].column].name) {
        case "PartNo":
          orderQuery += " rr.PartNo " + RepairRequest.order[i].dir + "";
          break;
        case "RRNo":
          orderQuery += " rr.RRNo " + RepairRequest.order[i].dir + "";
          break;
        case "CompanyName":
          orderQuery += " c.CompanyName " + RepairRequest.order[i].dir + "";
          break;
        case "VendorName":
          orderQuery += " v.VendorName " + RepairRequest.order[i].dir + "";
          break;
        case "Status":
          orderQuery += " rr.Status " + RepairRequest.order[i].dir + " ";
          break;
        case "Description":
          orderQuery += " rr.Description " + RepairRequest.order[i].dir + " ";
          break;
        case "RejectedApprovedBy":
          orderQuery += " trrsh.ModifiedByName " + RepairRequest.order[i].dir + " ";
          break;
        case "RejectedDate":
          orderQuery += " trrsh.Created " + RepairRequest.order[i].dir + " ";
          break;
        default:
          orderQuery += " " + RepairRequest.columns[RepairRequest.order[i].column].name + " " + RepairRequest.order[i].dir + " ";

      }
    }
  }
  var Countquery = recordfilterquery + query + orderQuery;

  var limitQuery = '';
  if (RepairRequest.start != "-1" && RepairRequest.length != "-1") {
    limitQuery += " LIMIT " + RepairRequest.start + "," + (RepairRequest.length);
  }
  var basequery = selectquery + query + orderQuery + limitQuery;
  var TotalCountQuery = `SELECT Count(rr.RRId) as TotalCount
    FROM tbl_repair_request rr 
    LEFT JOIN tbl_quotes q on q.RRVendorId=rr.RRVendorId AND q.RRId=rr.RRId  and q.RRId>0 and q.Status In(1,2,4) and q.QuoteCustomerStatus In(1,2,3) and q.IsDeleted = 0     
    LEFT JOIN tbl_po as po ON po.POId = rr.VendorPOId and po.IsDeleted=0
    LEFT JOIN tbl_sales_order as so ON so.SOId = rr.CustomerSOId  and so.IsDeleted = 0
    LEFT JOIN tbl_invoice as i ON i.InvoiceId = rr.CustomerInvoiceId AND i.IsDeleted = 0
    LEFT JOIN tbl_currencies as CURL  ON CURL.CurrencyCode = i.LocalCurrencyCode AND CURL.IsDeleted = 0
    LEFT JOIN tbl_currencies as CURQ  ON CURQ.CurrencyCode = q.LocalCurrencyCode AND CURQ.IsDeleted = 0
    LEFT JOIN tbl_currencies as CURQB  ON CURQB.CurrencyCode = q.BaseCurrencyCode AND CURQB.IsDeleted = 0 
    LEFT JOIN tbl_customers c on c.CustomerId=rr.CustomerId 
    LEFT JOIN tbl_vendors v on v.VendorId=rr.VendorId   
    LEFT JOIN tbl_repair_request_status_history as trrsh  ON trrsh.RRId = rr.RRId AND trrsh.HistoryStatus = rr.Status    
    WHERE rr.IsDeleted=0 and ifnull(po.IsDeleted,0)=0 and q.LocalCurrencyCode !='' and q.BaseCurrencyCode != '' and
    trrsh.HistoryId = (SELECT MAX(HistoryId)  FROM tbl_repair_request_status_history WHERE  RRId = rr.RRId AND  HistoryStatus = rr.Status)
     `;
  if (RepairRequest.IdentityType == 0 && RepairRequest.IsRestrictedCustomerAccess == 1 && RepairRequest.MultipleCustomerIds != "") {
    TotalCountQuery += ` and rr.CustomerId in(${RepairRequest.MultipleCustomerIds}) `;
  }
  if (found.search.value == '') {
    if (RepairRequest.Status && RepairRequest.Status != '') {
      TotalCountQuery += " and ( rr.Status ='" + RepairRequest.Status + "' ) ";
    }
  }


  var summary = `SELECT q.LocalCurrencyCode as QLCC,
  CONCAT(ifnull(CURQ.CurrencySymbol, '$'),' ',FORMAT(SUM(IF(i.GrandTotal>=0,i.GrandTotal,If(so.GrandTotal>=0,so.GrandTotal,If(q.GrandTotal>=0,q.GrandTotal,0)))),2)) Amount `;
  summary = summary + query;
  summary += ` GROUP BY QLCC`;

  var baseSummary = `SELECT q.BaseCurrencyCode as QLCC,
  CONCAT(ifnull(CURQB.CurrencySymbol,'$'),' ',FORMAT(SUM(
    IF(i.BaseGrandTotal>=0,i.BaseGrandTotal,If(so.BaseGrandTotal>=0,so.BaseGrandTotal,If(q.BaseGrandTotal>=0,q.BaseGrandTotal,0)))
    ),2)) Amount `;


  baseSummary = baseSummary + query;
  baseSummary += ` GROUP BY QLCC`;

  //console.log("query = " + basequery);
  //console.log("Countquery = " + Countquery);
  //console.log("TotalCountQuery = " + TotalCountQuery);
  // console.log("Summary = " + summary);
  // console.log("BaseSummary = " + baseSummary);
  async.parallel([
    function (result) { con.query(basequery, result) },
    function (result) { con.query(Countquery, result) },
    function (result) { con.query(TotalCountQuery, result) },
    function (result) { con.query(summary, result) },
    function (result) { con.query(baseSummary, result) }
  ],
    function (err, results) {
      if (err)
        return result(err, null);

      result(null, {
        data: results[0][0], recordsFiltered: results[1][0][0].recordsFiltered,
        recordsTotal: results[2][0][0].TotalCount, OverAllSummary: results[3][0], OverAllBaseSummary: results[4][0], draw: RepairRequest.draw
      });
      return;
    });

};

RRReportsModel.RRARReportsToExcel = (RepairRequest, result) => {
  var query = ``;
  var selectquery = `SELECT rr.RRNo,rr.PartNo,v.VendorName as Vendor, v.VendorId, rr.RRDescription Description, rr.Status,
    CASE rr.Status 
    WHEN 0 THEN '${Constants.array_rr_status[0]}'
    WHEN 1 THEN '${Constants.array_rr_status[1]}' 
    WHEN 2 THEN '${Constants.array_rr_status[2]}'
    WHEN 3 THEN '${Constants.array_rr_status[3]}'
    WHEN 4 THEN '${Constants.array_rr_status[4]}'
    WHEN 5 THEN '${Constants.array_rr_status[5]}'
    WHEN 6 THEN '${Constants.array_rr_status[6]}'
    WHEN 7 THEN '${Constants.array_rr_status[7]}'
    WHEN 8 THEN '${Constants.array_rr_status[8]}'
    ELSE '-'	end StatusName,
    CASE rr.RejectedStatusType 
    WHEN 0 THEN '-'
    WHEN 1 THEN '${Constants.array_customer_quote_reject_status[1]}' 
    WHEN 2 THEN '${Constants.array_customer_quote_reject_status[2]}'
    WHEN 3 THEN '${Constants.array_customer_quote_reject_status[3]}'
    WHEN 4 THEN '${Constants.array_customer_quote_reject_status[4]}'
    WHEN 5 THEN '${Constants.array_customer_quote_reject_status[5]}'
    WHEN 6 THEN '${Constants.array_customer_quote_reject_status[6]}'
    WHEN 7 THEN '${Constants.array_customer_quote_reject_status[7]}'
    WHEN 8 THEN '${Constants.array_customer_quote_reject_status[8]}'
    ELSE '-'	end RejectedApprovedCode,
    c.CompanyName Customer, c.CustomerId, trrsh.ModifiedByName as RejectedApprovedBy, DATE_FORMAT(trrsh.Created,'%m/%d/%Y') as RejectedApprovedDate,
    CONCAT(ifnull(CURL.CurrencySymbol,CURQ.CurrencySymbol),' ',FORMAT((IF(i.GrandTotal>=0,i.GrandTotal,If(so.GrandTotal>=0,so.GrandTotal,If(q.GrandTotal>=0,q.GrandTotal,'')))),2)) Amount,
     
     '-' as fromDate, '-' as toDate` ;

  recordfilterquery = `Select count(rr.RRId) as recordsFiltered `;


  query = query + ` FROM tbl_repair_request rr
   LEFT JOIN tbl_customers c on c.CustomerId=rr.CustomerId 
    LEFT JOIN tbl_vendors v on v.VendorId=rr.VendorId       
    LEFT JOIN tbl_quotes q on q.RRVendorId=rr.RRVendorId AND q.RRId=rr.RRId  and q.RRId>0 and q.Status In(1,2,4) and q.QuoteCustomerStatus In(1,2,3) and q.IsDeleted = 0     
    LEFT JOIN tbl_po as po ON po.POId = rr.VendorPOId and po.IsDeleted=0
    LEFT JOIN tbl_sales_order as so ON so.SOId = rr.CustomerSOId  and so.IsDeleted = 0
    LEFT JOIN tbl_invoice as i ON i.InvoiceId = rr.CustomerInvoiceId AND i.IsDeleted = 0
    LEFT JOIN tbl_currencies as CURL  ON CURL.CurrencyCode = i.LocalCurrencyCode AND CURL.IsDeleted = 0
    LEFT JOIN tbl_currencies as CURQ  ON CURQ.CurrencyCode = q.LocalCurrencyCode AND CURQ.IsDeleted = 0
    LEFT JOIN tbl_currencies as CURQB  ON CURQB.CurrencyCode = q.BaseCurrencyCode AND CURQB.IsDeleted = 0  
    LEFT JOIN tbl_repair_request_status_history as trrsh  ON trrsh.RRId = rr.RRId AND trrsh.HistoryStatus = rr.Status    
    WHERE rr.IsDeleted=0 and ifnull(po.IsDeleted,0)=0 and q.LocalCurrencyCode !='' and q.BaseCurrencyCode != '' and
    trrsh.HistoryId = (SELECT MAX(HistoryId)  FROM tbl_repair_request_status_history WHERE  RRId = rr.RRId AND  HistoryStatus = rr.Status)
    
    `;
  if (RepairRequest.IdentityType == 0 && RepairRequest.IsRestrictedCustomerAccess == 1 && RepairRequest.MultipleCustomerIds != "") {
    query += ` and rr.CustomerId in(${RepairRequest.MultipleCustomerIds}) `;
  }
  if (RepairRequest.Status && RepairRequest.Status != '') {
    query += " and ( rr.Status ='" + RepairRequest.Status + "' ) ";
  }
  if (RepairRequest.search && RepairRequest.search.value != '') {

    query = query + ` and ( rr.RRNo LIKE '%${RepairRequest.search.value}%'
     or rr.PartNo LIKE '%${RepairRequest.search.value}%' 
     or rr.SerialNo LIKE '%${RepairRequest.search.value}%' 
    or c.CompanyName LIKE '%${RepairRequest.search.value}%' 
    or v.VendorName LIKE '%${RepairRequest.search.value}%'

    or rr.CustomerPONo LIKE '%${RepairRequest.search.value}%'
    or rr.VendorPONo LIKE '%${RepairRequest.search.value}%'
    or vi.VendorInvoiceNo LIKE '%${RepairRequest.search.value}%'
    or rr.Status LIKE '%${RepairRequest.search.value}%' ) `;
  }
  // Temp Hide
  //console.log("Temp Hide");
  // console.log(RepairRequest);
  if (RepairRequest.RRNo && RepairRequest.RRNo != '') {
    // console.log("Temp Hide @");
    query += " and ( rr.RRNo='" + RepairRequest.RRNo + "' ) ";
  }

  if (RepairRequest.PartNo && RepairRequest.PartNo != '') {
    query += " and ( rr.PartNo='" + RepairRequest.PartNo + "' ) ";
  }

  if (RepairRequest.Description && RepairRequest.Description != '') {
    query += " and ( rr.Description LIKE '%" + RepairRequest.Description + "%' ) ";
  }

  if (RepairRequest.StatusName && RepairRequest.StatusName != '') {
    query += " and ( rr.StatusName ='" + RepairRequest.StatusName + "' ) ";
  }

  if (RepairRequest.RejectedApprovedBy && RepairRequest.RejectedApprovedBy != '') {
    query += " and ( trrsh.ModifiedByName ='" + RepairRequest.RejectedApprovedBy + "' ) ";
  }

  if (RepairRequest.CustomerId && RepairRequest.CustomerId != '') {
    // console.log("Temp Hide !");
    // console.log(RepairRequest);
    query += " and  rr.CustomerId in (" + RepairRequest.CustomerId + ") ";
  }

  if (RepairRequest.CustomerGroupId && RepairRequest.CustomerGroupId != '') {
    // console.log("Temp Hide !");
    // console.log(RepairRequest);
    query += " and  c.CustomerGroupId in (" + RepairRequest.CustomerGroupId + ") ";
  }


  if (RepairRequest.VendorId && RepairRequest.VendorId != '') {
    query += " and  rr.VendorId in (" + RepairRequest.VendorId + ") ";
  }

  if (RepairRequest.RejectionCode && RepairRequest.RejectionCode != '') {
    query += " and ( rr.RejectedStatusType ='" + RepairRequest.RejectionCode + "' ) ";
  }

  if (RepairRequest.RejectedDate && RepairRequest.RejectedDate != '') {
    query += " and ( trrsh.Created LIKE '%" + RepairRequest.RejectedDate + "%' ) ";
  }

  if (RepairRequest.fromDate && RepairRequest.fromDate != '') {
    // console.log("Temp Hide1 !");
    if (RepairRequest.Status == 7) {
      query += " and ( DATE(rr.RRCompletedDate) >='" + RepairRequest.fromDate + "' ) ";
    } else {
      query += " and ( DATE(trrsh.Created) >='" + RepairRequest.fromDate + "' ) ";
    }

  }

  if (RepairRequest.toDate && RepairRequest.toDate != '') {
    // console.log("Temp Hide2 !");
    if (RepairRequest.Status == 7) {
      query += " and ( DATE(rr.RRCompletedDate) <='" + RepairRequest.toDate + "' ) ";
    } else {
      query += " and ( DATE(trrsh.Created) <='" + RepairRequest.toDate + "' ) ";
    }

  }


  var cvalue = 0;
  var obj = RepairRequest;
  for (cvalue = 0; cvalue < obj.columns.length; cvalue++) {
    if (obj.columns[cvalue].search.value != "") {
      switch (obj.columns[cvalue].name) {
        case "RRNo":
          query += " and ( rr.RRNo='" + obj.columns[cvalue].search.value + "' ) ";
          break;
        case "CompanyName":
          query += " and ( c.CompanyName LIKE '%" + obj.columns[cvalue].search.value + "%' ) ";
          break;
        case "VendorName":
          query += " and ( v.VendorName='" + obj.columns[cvalue].search.value + "' ) ";
          break;
        case "PartNo":
          query += " and ( rr.PartNo='" + obj.columns[cvalue].search.value + "' ) ";
          break;
        case "Description":
          query += " and ( rr.Description LIKE '%" + obj.columns[cvalue].search.value + "%' ) ";
          break;
        case "Amount":
          query += " and ( cb.Amount ='" + obj.columns[cvalue].search.value + "' ) ";
          break;
        case "StatusName":
          query += " and ( rr.StatusName ='" + obj.columns[cvalue].search.value + "' ) ";
          break;
        case "RejectedApprovedBy":
          query += " and ( trrsh.ModifiedByName ='" + obj.columns[cvalue].search.value + "' ) ";
          break;
        case "RejectedDate":
          query += " and ( trrsh.Created LIKE '%" + obj.columns[cvalue].search.value + "%' ) ";
          break;

        case "RejectionCode":
          query += " and ( rr.RejectedStatusType ='" + obj.columns[cvalue].search.value + "' ) ";
          break;
        case "CustomerId":
          query += " and  rr.CustomerId in (" + obj.columns[cvalue].search.value + ") ";
          break;
        case "VendorId":
          query += " and  rr.VendorId in (" + obj.columns[cvalue].search.value + ") ";
          break;
        case "Status":
          query += " and ( rr.Status ='" + obj.columns[cvalue].search.value + "' ) ";
          break;
        case "fromDate":
          if (RepairRequest.Status == 7) {
            query += " and ( DATE(rr.RRCompletedDate) >='" + obj.columns[cvalue].search.value + "' ) ";
          } else {
            query += " and ( DATE(trrsh.Created) >='" + obj.columns[cvalue].search.value + "' ) ";
          }
          break;
        case "toDate":
          if (RepairRequest.Status == 7) {
            query += " and ( DATE(rr.RRCompletedDate) <='" + obj.columns[cvalue].search.value + "' ) ";
          } else {
            query += " and ( DATE(trrsh.Created) <='" + obj.columns[cvalue].search.value + "' ) ";
          }
          break;



        default:
          query += " and ( " + obj.columns[cvalue].name + " LIKE '%" + obj.columns[cvalue].search.value + "%' ) ";
      }
    }
  }

  var i = 0;
  var orderQuery = "";
  if (RepairRequest.order.length > 0) {
    orderQuery += " ORDER BY ";
  }
  for (i = 0; i < RepairRequest.order.length; i++) {
    if (RepairRequest.order[i].column != "" || RepairRequest.order[i].column == "0")// 0 is equal to ""
    {
      switch (RepairRequest.columns[RepairRequest.order[i].column].name) {
        case "PartNo":
          orderQuery += " rr.PartNo " + RepairRequest.order[i].dir + "";
          break;
        case "RRNo":
          orderQuery += " rr.RRNo " + RepairRequest.order[i].dir + "";
          break;
        case "CompanyName":
          orderQuery += " c.CompanyName " + RepairRequest.order[i].dir + "";
          break;
        case "VendorName":
          orderQuery += " v.VendorName " + RepairRequest.order[i].dir + "";
          break;
        case "Status":
          orderQuery += " rr.Status " + RepairRequest.order[i].dir + " ";
          break;
        case "Description":
          orderQuery += " rr.Description " + RepairRequest.order[i].dir + " ";
          break;
        case "RejectedApprovedBy":
          orderQuery += " trrsh.ModifiedByName " + RepairRequest.order[i].dir + " ";
          break;
        case "RejectedDate":
          orderQuery += " trrsh.Created " + RepairRequest.order[i].dir + " ";
          break;
        default:
          orderQuery += " " + RepairRequest.columns[RepairRequest.order[i].column].name + " " + RepairRequest.order[i].dir + " ";

      }
    }
  }

  var basequery = selectquery + query + orderQuery;


  // console.log("query = " + basequery);
  async.parallel([
    function (result) { con.query(basequery, result) },
  ],
    function (err, results) {
      if (err)
        return result(err, null);

      result(null, {
        ExcelData: results[0][0]
      });
      return;
    });

};

// RR Report by Location
RRReportsModel.RRStartLocation = (RepairRequest, result) => {
  var query = ``;
  var selectquery = `SELECT '' as CustomerId, '' as VendorId, rr.RRId,rr.RRNo,rrsh.ShipFromIdentity,rrsh.ShipFromId,rrsh.ShipFromName,rrsh.ShipToIdentity,
  rrsh.ShipToId,rrsh.ShipToName,rrsh.ShipComment,rrsh.ReceiveComment,  rrsh.ShipViaId,TrackingNo,ShippedBy,
  DATE_FORMAT(rrsh.ShipDate,'%m/%d/%Y') as  ShipDate, DATE_FORMAT(rr.Created,'%m/%d/%Y') as  CreatedDate ,  rrsh.CreatedBy,
  DATE_FORMAT(rrsh.ReceiveDate,'%m/%d/%Y') as  ReceiveDate, DATE_FORMAT(rrsh.PickedUpDate,'%m/%d/%Y') as  PickedUpDate ,
   DATE_FORMAT(rrsh.ReadyForPickUpDate,'%m/%d/%Y') as  ReadyForPickUpDate ,  rrsh.IsPickedUp, rrsh.PickedUpBy
   ,SV.ShipViaName , 
  case rrsh.IsPickedUp
  WHEN 1 THEN 'Yes'
  ELSE 'No'
  end IsPickedUpType, IF(ReceiveDate, "Received", "Not Yet Received") as ShipStatus, 
  rr.ShippingIdentityType, rr.ShippingIdentityId, rr.ShippingAddressId, rr.PartNo, rr.PartId,rr.SerialNo
  `;
  recordfilterquery = `Select count(rr.RRId) as recordsFiltered `;

  query = query + ` FROM  tbl_repair_request as rr
             LEFT JOIN (
        SELECT
       RRId,ShippingHistoryId,ShipFromIdentity,ShipFromId,ShipFromName,ShipFromAddressId,ShipComment,ShipDate,ShippedBy,TrackingNo,ShipViaId,
ShipToIdentity,ShipToId,ShipToName,ReceivedBy,ReceiveDate,ReceiveComment,PickedUpBy,PickedUpDate,ReadyForPickUpDate,Created,IsPickedUp,CreatedBy,IsDeleted,
          ROW_NUMBER() OVER(PARTITION BY RRId  ORDER BY  ShippingHistoryId ASC) AS RowNo
        FROM tbl_repair_request_shipping_history
        WHERE  IsDeleted=0  GROUP BY RRId,ShippingHistoryId
      ) rrsh ON rr.RRId = rrsh.RRId and rrsh.IsDeleted=0 AND rrsh.RowNo=1  
    LEFT JOIN tbl_ship_via as SV ON SV.ShipViaId = rrsh.ShipViaId
    WHERE rr.IsDeleted=0 AND (rrsh.ShippingHistoryId IS NOT NULL OR rr.ShippingIdentityId>0)   `;

  if (RepairRequest.IdentityType == 0 && RepairRequest.IsRestrictedCustomerAccess == 1 && RepairRequest.MultipleCustomerIds != "") {
    query += ` and  ( 
                  (rrsh.ShipFromId in(${RepairRequest.MultipleCustomerIds}) AND ShipFromIdentity=1 ) 
                  OR (rrsh.ShipToId in(${RepairRequest.MultipleCustomerIds}) AND ShipToIdentity=1) 
                  OR (rrsh.ShippingHistoryId IS NULL AND rr.ShippingIdentityType=1 AND  rr.ShippingIdentityId in(${RepairRequest.MultipleCustomerIds}) )
                )`;
  }

  if (RepairRequest.search.value != '') {

    query = query + ` and ( rr.RRNo LIKE '%${RepairRequest.search.value}%'
     or rrsh.ShipFromName LIKE '%${RepairRequest.search.value}%' 
     or rrsh.ShipComment LIKE '%${RepairRequest.search.value}%' 
    or rrsh.ShipToName LIKE '%${RepairRequest.search.value}%' 
    or rrsh.TrackingNo LIKE '%${RepairRequest.search.value}%'  ) `;
  }

  // console.log(RepairRequest);

  // if (RepairRequest.CustomerId && RepairRequest.CustomerId != "") {
  //   query += ` and  ( (rrsh.ShipFromId in(${RepairRequest.CustomerId}) AND rrsh.ShipFromIdentity=1 ) OR (rrsh.ShipToId in(${RepairRequest.CustomerId}) AND rrsh.ShipToIdentity=1) )`;
  // }
  // if (RepairRequest.VendorId && RepairRequest.VendorId != "") {
  //   query += ` and  ( (rrsh.ShipFromId in(${RepairRequest.VendorId}) AND rrsh.ShipFromIdentity=2 ) OR (rrsh.ShipToId in(${RepairRequest.VendorId}) AND rrsh.ShipToIdentity=2) )`;
  // }
  if (RepairRequest.RRNo && RepairRequest.RRNo != '') {
    // console.log("Temp Hide @");
    query += " and ( rr.RRNo='" + RepairRequest.RRNo + "' ) ";
  }

  if (RepairRequest.PartNo && RepairRequest.PartNo != '') {
    query += " and ( rr.PartNo='" + RepairRequest.PartNo + "' ) ";
  }
  if (RepairRequest.ShippingIdentityType && RepairRequest.ShippingIdentityType != "") {
    query += " and ( (rrsh.ShipFromIdentity='" + RepairRequest.ShippingIdentityType + "') OR  (rrsh.ShippingHistoryId IS NULL AND rr.ShippingIdentityType='" + RepairRequest.ShippingIdentityType + "'  )) ";
  }
  if (RepairRequest.ShippingIdentityId && RepairRequest.ShippingIdentityId != "") {
    query += " and ( (rrsh.ShipFromId='" + RepairRequest.ShippingIdentityId + "')  OR  (rrsh.ShippingHistoryId IS NULL AND   rr.ShippingIdentityId ='" + RepairRequest.ShippingIdentityId + "'  )) ";

  }
  if (RepairRequest.ShippingAddressId && RepairRequest.ShippingAddressId != "") {
    query += " and ( (rrsh.ShipFromAddressId='" + RepairRequest.ShippingAddressId + "')  OR  (rrsh.ShippingHistoryId IS NULL AND   rr.ShippingAddressId ='" + RepairRequest.ShippingAddressId + "'  )) ";
  }

  /* if (RepairRequest.ShipViaId && RepairRequest.ShipViaId != "") {
     query += " and ( rrsh.ShipViaId='" + RepairRequest.ShipViaId + "' ) ";
   }
   if (RepairRequest.CreatedBy && RepairRequest.CreatedBy != "") {
     query += " and ( rrsh.CreatedBy='" + RepairRequest.CreatedBy + "' ) ";
   }
   if (RepairRequest.ShipDate && RepairRequest.ShipDate != "") {
     query += " and ( rrsh.ShipDate='" + RepairRequest.ShipDate + "' ) ";
   }
   if (RepairRequest.ReceiveDate && RepairRequest.ReceiveDate != "") {
     query += " and ( rrsh.ReceiveDate='" + RepairRequest.ReceiveDate + "' ) ";
   }
   if (RepairRequest.PickedUpDate && RepairRequest.PickedUpDate != "") {
     query += " and ( rrsh.PickedUpDate='" + RepairRequest.PickedUpDate + "' ) ";
   }
   if (RepairRequest.CreatedDate && RepairRequest.CreatedDate != "") {
     query += " and ( rrsh.CreatedDate='" + RepairRequest.CreatedDate + "' ) ";
   }
   if (RepairRequest.IsPickedUp && RepairRequest.IsPickedUp != "") {
     query += " and ( rrsh.IsPickedUp='" + RepairRequest.IsPickedUp + "' ) ";
   }*/


  /*if (RepairRequest.ShipFromIdentity && RepairRequest.ShipFromIdentity != "") {
    switch (RepairRequest.ShipFromIdentity) {
      case 1:
        query += " and ( (rrsh.ShipFromIdentity=1) OR  (rrsh.ShippingHistoryId IS NULL AND   rr.ShippingIdentityType = 1)   ) ";
        break;
      case 2:
        query += " and ( (rrsh.ShipFromIdentity=2 ) OR  (rrsh.ShippingHistoryId IS NULL AND   rr.ShippingIdentityType = 2) ) ";
        break;
      case 3:
        query += " and ( (rrsh.ShipFromIdentity=2 AND rrsh.ShipFromId=5) OR  (rrsh.ShippingHistoryId IS NULL AND   rr.ShippingIdentityType = 2 AND rr.ShippingIdentityId=5) ) ";
        break;
    }
  }*/
  /* if (RepairRequest.ShipToIdentity && RepairRequest.ShipToIdentity != "") {
     switch (RepairRequest.ShipToIdentity) {
       case 1:
         query += " and ( rrsh.ShipToIdentity=1 ) ";
         break;
       case 2:
         query += " and ( rrsh.ShipToIdentity=2 ) ";
         break;
       case 3:
         query += " and ( rrsh.ShipToIdentity=2 AND rrsh.ShipToId=5 ) ";
         break;
     }
   }*/
  var cvalue = 0;
  var obj = RepairRequest;
  for (cvalue = 0; cvalue < obj.columns.length; cvalue++) {
    if (obj.columns[cvalue].search.value != "") {
      switch (obj.columns[cvalue].name) {
        case "CustomerId":
          query += ` and  ( 
            (rrsh.ShipFromId in(${obj.columns[cvalue].search.value}) AND rrsh.ShipFromIdentity=1 ) 
            OR (rrsh.ShipToId in(${obj.columns[cvalue].search.value}) AND rrsh.ShipToIdentity=1) 

          
          )`;
          break;
        case "VendorId":
          query += ` and  ( 
            (rrsh.ShipFromId in(${obj.columns[cvalue].search.value}) AND rrsh.ShipFromIdentity=2 ) 
          OR (rrsh.ShipToId in(${obj.columns[cvalue].search.value}) AND rrsh.ShipToIdentity=2)
          
          )`;
          break;
        case "ShipViaId":
          query += " and ( rrsh.ShipViaId='" + obj.columns[cvalue].search.value + "' ) ";
          break;
        case "CreatedBy":
          query += " and ( rrsh.CreatedBy='" + obj.columns[cvalue].search.value + "' ) ";
          break;
        case "ShipDate":
          query += " and ( rrsh.ShipDate LIKE '%" + obj.columns[cvalue].search.value + "%' ) ";
          break;
        case "ShipFromIdentity":
          switch (obj.columns[cvalue].search.value) {
            case 1:
              query += " and ( rrsh.ShipFromIdentity=1 ) ";
              break;
            case 2:
              query += " and ( rrsh.ShipFromIdentity=2 ) ";
              break;
            case 3:
              query += " and ( rrsh.ShipFromIdentity=2 AND rrsh.ShipFromId=5 ) ";
              break;
          }
          break;
        case "ShipToIdentity":
          switch (obj.columns[cvalue].search.value) {
            case 1:
              query += " and ( rrsh.ShipToIdentity=1 ) ";
              break;
            case 2:
              query += " and ( rrsh.ShipToIdentity=2 ) ";
              break;
            case 3:
              query += " and ( rrsh.ShipToIdentity=2 AND rrsh.ShipToId=5 ) ";
              break;
          }

          break;
        default:
          query += " and ( " + obj.columns[cvalue].name + " LIKE '%" + obj.columns[cvalue].search.value + "%' ) ";
      }
    }
  }

  var i = 0;
  var orderQuery = "";
  if (RepairRequest.order.length > 0) {
    orderQuery += " ORDER BY ";
  }
  for (i = 0; i < RepairRequest.order.length; i++) {
    if (RepairRequest.order[i].column != "" || RepairRequest.order[i].column == "0")// 0 is equal to ""
    {
      switch (RepairRequest.columns[RepairRequest.order[i].column].name) {
        case "RRNo":
          orderQuery += " rr.RRNo " + RepairRequest.order[i].dir + "";
          break;
        case "ShipFromName":
          orderQuery += " rrsh.ShipFromName " + RepairRequest.order[i].dir + "";
          break;
        case "ShipToName":
          orderQuery += " rrsh.ShipToName " + RepairRequest.order[i].dir + "";
          break;
        default:
          orderQuery += " " + RepairRequest.columns[RepairRequest.order[i].column].name + " " + RepairRequest.order[i].dir + " ";

      }
    }
  }
  // console.log(query + orderQuery);
  var Countquery = recordfilterquery + query;
  var limitQuery = '';
  if (RepairRequest.start != "-1" && RepairRequest.length != "-1") {
    limitQuery += " LIMIT " + RepairRequest.start + "," + (RepairRequest.length);
  }
  var basequery = selectquery + query + orderQuery + limitQuery;
  var TotalCountQuery = `SELECT Count(rr.RRId) as TotalCount
  FROM  tbl_repair_request as rr
  LEFT JOIN (
SELECT
RRId,ShippingHistoryId,ShipFromIdentity,ShipFromId,ShipFromName,ShipFromAddressId,ShipComment,ShipDate,ShippedBy,TrackingNo,ShipViaId,
ShipToIdentity,ShipToId,ShipToName,ReceivedBy,ReceiveDate,ReceiveComment,PickedUpBy,PickedUpDate,ReadyForPickUpDate,Created,IsPickedUp,CreatedBy,IsDeleted,
ROW_NUMBER() OVER(PARTITION BY RRId  ORDER BY  ShippingHistoryId ASC) AS RowNo
FROM tbl_repair_request_shipping_history
WHERE  IsDeleted=0  GROUP BY RRId,ShippingHistoryId
) rrsh ON rr.RRId = rrsh.RRId and rrsh.IsDeleted=0 AND rrsh.RowNo=1  
LEFT JOIN tbl_ship_via as SV ON SV.ShipViaId = rrsh.ShipViaId
WHERE rr.IsDeleted=0 AND (rrsh.ShippingHistoryId IS NOT NULL OR rr.ShippingIdentityId>0) `;

  if (RepairRequest.IdentityType == 0 && RepairRequest.IsRestrictedCustomerAccess == 1 && RepairRequest.MultipleCustomerIds != "") {
    TotalCountQuery += ` and  ( (rrsh.ShipFromId in(${RepairRequest.MultipleCustomerIds}) 
    AND ShipFromIdentity=1 ) OR
    (rrsh.ShipToId in(${RepairRequest.MultipleCustomerIds}) AND ShipToIdentity=1) 
    OR (rrsh.ShippingHistoryId IS NULL AND rr.ShippingIdentityType=1 AND  rr.ShippingIdentityId in(${RepairRequest.MultipleCustomerIds})
    
    )`;
  }



  // console.log("query = " + basequery);
  // console.log("Countquery = " + Countquery);
  //  console.log("TotalCountQuery = " + TotalCountQuery);

  async.parallel([
    function (result) { con.query(basequery, result) },
    function (result) { con.query(Countquery, result) },
    function (result) { con.query(TotalCountQuery, result) }
  ],
    function (err, results) {
      if (err)
        return result(err, null);

      result(null, {
        data: results[0][0], recordsFiltered: results[1][0][0].recordsFiltered,
        recordsTotal: results[2][0][0].TotalCount, draw: RepairRequest.draw
      });
      return;
    });

};




RRReportsModel.RRStartLocationExcel = (RepairRequest, result) => {
  var query = ``;
  var selectquery = `SELECT  rr.RRNo,rrsh.ShipFromName as 'Ship From',  rrsh.ShipToName as 'Ship To',
   SV.ShipViaName as 'Ship Via', IF(ReceiveDate, "Received", "Not Yet Received") as ShipStatus ,
    DATE_FORMAT(rrsh.ShipDate,'%m/%d/%Y') as  ShipDate,rrsh.ShipComment,  
   DATE_FORMAT(rrsh.ReceiveDate,'%m/%d/%Y') as  ReceiveDate,rrsh.ReceiveComment,  
 rrsh.TrackingNo,rrsh.ShippedBy, DATE_FORMAT(rr.Created,'%m/%d/%Y') as  CreatedDate,
 case rrsh.IsPickedUp
  WHEN 1 THEN 'Yes'
  ELSE 'No'
  end IsPickedUpType,   DATE_FORMAT(rrsh.ReadyForPickUpDate,'%m/%d/%Y') as  ReadyForPickUpDate ,
  DATE_FORMAT(rrsh.PickedUpDate,'%m/%d/%Y') as  PickedUpDate ,  
   rrsh.PickedUpBy , rr.ShippingIdentityType, rr.ShippingIdentityId, rr.ShippingAddressId, rr.PartNo, rr.PartId,rr.SerialNo 
  `;
  recordfilterquery = `Select count(rr.RRId) as recordsFiltered `;

  query = query + ` FROM  tbl_repair_request as rr
             LEFT JOIN (
        SELECT
       RRId,ShippingHistoryId,ShipFromIdentity,ShipFromId,ShipFromName,ShipFromAddressId,ShipComment,ShipDate,ShippedBy,TrackingNo,ShipViaId,
ShipToIdentity,ShipToId,ShipToName,ReceivedBy,ReceiveDate,ReceiveComment,PickedUpBy,PickedUpDate,ReadyForPickUpDate,Created,IsPickedUp,CreatedBy,IsDeleted,
          ROW_NUMBER() OVER(PARTITION BY RRId  ORDER BY  ShippingHistoryId ASC) AS RowNo
        FROM tbl_repair_request_shipping_history
        WHERE  IsDeleted=0  GROUP BY RRId,ShippingHistoryId
      ) rrsh ON rr.RRId = rrsh.RRId and rrsh.IsDeleted=0 AND rrsh.RowNo=1  
    LEFT JOIN tbl_ship_via as SV ON SV.ShipViaId = rrsh.ShipViaId
    WHERE rr.IsDeleted=0 AND rrsh.ShippingHistoryId IS NOT NULL and rrsh.IsDeleted=0  `;

  if (RepairRequest.IdentityType == 0 && RepairRequest.IsRestrictedCustomerAccess == 1 && RepairRequest.MultipleCustomerIds != "") {
    query += ` and  ( (rr.ShipFromId in(${RepairRequest.MultipleCustomerIds}) AND ShipFromIdentity=1 ) OR (rr.ShipToId in(${RepairRequest.MultipleCustomerIds}) AND ShipToIdentity=1) )`;
  }


  var cvalue = 0;
  var obj = RepairRequest;
  // if (RepairRequest.CustomerId && RepairRequest.CustomerId != "") {
  //   query += ` and  ( (rrsh.ShipFromId in(${RepairRequest.CustomerId}) AND rrsh.ShipFromIdentity=1 ) OR (rrsh.ShipToId in(${RepairRequest.CustomerId}) AND rrsh.ShipToIdentity=1) )`;
  // }
  // if (RepairRequest.VendorId && RepairRequest.VendorId != "") {
  //   query += ` and  ( (rrsh.ShipFromId in(${RepairRequest.VendorId}) AND rrsh.ShipFromIdentity=2 ) OR (rrsh.ShipToId in(${RepairRequest.VendorId}) AND rrsh.ShipToIdentity=2) )`;
  // }
  if (RepairRequest.RRNo && RepairRequest.RRNo != '') {
    query += " and ( rr.RRNo='" + RepairRequest.RRNo + "' ) ";
  }

  if (RepairRequest.PartNo && RepairRequest.PartNo != '') {
    query += " and ( rr.PartNo='" + RepairRequest.PartNo + "' ) ";
  }
  if (RepairRequest.ShippingIdentityType && RepairRequest.ShippingIdentityType != "") {
    query += " and ( rrsh.ShipFromIdentity='" + RepairRequest.ShippingIdentityType + "' ) ";
  }
  if (RepairRequest.ShippingIdentityId && RepairRequest.ShippingIdentityId != "") {
    query += " and ( rrsh.ShipFromId='" + RepairRequest.ShippingIdentityId + "' ) ";
  }
  if (RepairRequest.ShippingAddressId && RepairRequest.ShippingAddressId != "") {
    query += " and ( rrsh.ShipFromAddressId='" + RepairRequest.ShippingAddressId + "' ) ";
  }

  if (RepairRequest.ShipViaId && RepairRequest.ShipViaId != "") {
    query += " and ( rrsh.ShipViaId='" + RepairRequest.ShipViaId + "' ) ";
  }
  if (RepairRequest.CreatedBy && RepairRequest.CreatedBy != "") {
    query += " and ( rrsh.CreatedBy='" + RepairRequest.CreatedBy + "' ) ";
  }
  if (RepairRequest.ShipDate && RepairRequest.ShipDate != "") {
    query += " and ( rrsh.ShipDate='" + RepairRequest.ShipDate + "' ) ";
  }
  if (RepairRequest.ReceiveDate && RepairRequest.ReceiveDate != "") {
    query += " and ( rrsh.ReceiveDate='" + RepairRequest.ReceiveDate + "' ) ";
  }
  if (RepairRequest.PickedUpDate && RepairRequest.PickedUpDate != "") {
    query += " and ( rrsh.PickedUpDate='" + RepairRequest.PickedUpDate + "' ) ";
  }
  if (RepairRequest.CreatedDate && RepairRequest.CreatedDate != "") {
    query += " and ( rrsh.CreatedDate='" + RepairRequest.CreatedDate + "' ) ";
  }
  if (RepairRequest.IsPickedUp && RepairRequest.IsPickedUp != "") {
    query += " and ( rrsh.IsPickedUp='" + RepairRequest.IsPickedUp + "' ) ";
  }
  if (RepairRequest.ShipFromIdentity && RepairRequest.ShipFromIdentity != "") {
    switch (RepairRequest.ShipFromIdentity) {
      case 1:
        query += " and ( rrsh.ShipFromIdentity=1 ) ";
        break;
      case 2:
        query += " and ( rrsh.ShipFromIdentity=2 ) ";
        break;
      case 3:
        query += " and ( rrsh.ShipFromIdentity=2 AND rrsh.ShipFromId=5 ) ";
        break;
    }
  }
  if (RepairRequest.ShipToIdentity && RepairRequest.ShipToIdentity != "") {
    switch (RepairRequest.ShipToIdentity) {
      case 1:
        query += " and ( rrsh.ShipToIdentity=1 ) ";
        break;
      case 2:
        query += " and ( rrsh.ShipToIdentity=2 ) ";
        break;
      case 3:
        query += " and ( rrsh.ShipToIdentity=2 AND rrsh.ShipToId=5 ) ";
        break;
    }
  }
  var orderQuery = " ORDER BY  rrsh.RRId DESC ";

  var basequery = selectquery + query + orderQuery;

  //console.log(basequery);
  con.query(basequery, (err, res) => {
    if (err) {
      console.log(err);
      return result(err, null);
    }
    return result(null, { ExcelData: res });
  });

};

RRReportsModel.RRCreatedByUserReports = (RepairRequest, result) => {
  var query = ``;
  var selectquery = `SELECT count(rr.RRId) as count, rr.CustomerId, c.CompanyName as Customer, u.Username as UserName,
  DATE(rr.Created) as Created, '-' as FromDate, '-' as ToDate, '-' as CustomerGroupId`;

  query = query + ` FROM tbl_repair_request rr
  LEFT JOIN tbl_customers c on c.CustomerId=rr.CustomerId 
  LEFT JOIN tbl_users u on u.UserId=rr.CreatedBy    
  WHERE rr.IsDeleted=0`;

  if (RepairRequest.IdentityType == 0 && RepairRequest.IsRestrictedCustomerAccess == 1 && RepairRequest.MultipleCustomerIds != "") {
    TotalCountQuery += ` and rr.CustomerId in(${RepairRequest.MultipleCustomerIds}) `;
    query += ` and rr.CustomerId in(${RepairRequest.MultipleCustomerIds}) `;
  }

  if (RepairRequest.search.value != '') {
    query = query + ` and ( c.CompanyName LIKE '%${RepairRequest.search.value}%' 
    or u.Username LIKE '%${RepairRequest.search.value}%'`;
  }

  if (RepairRequest.CustomerGroupId != '') {
    query += " and  c.CustomerGroupId in (" + RepairRequest.CustomerGroupId + ") ";
  }
  if (RepairRequest.UserName != '') {
    query += " and ( u.Username LIKE '%" + RepairRequest.UserName + "%' ) ";
  }
  if (RepairRequest.CustomerId != '') {
    query += " and  rr.CustomerId in (" + RepairRequest.CustomerId + ") ";
  }
  if (RepairRequest.FromDate != '') {
    query += " and ( DATE(rr.Created) >='" + RepairRequest.FromDate + "' ) ";
  }
  if (RepairRequest.ToDate != '') {
    query += " and ( DATE(rr.Created) <='" + RepairRequest.ToDate + "' ) ";
  }



  var cvalue = 0;
  var obj = RepairRequest;
  for (cvalue = 0; cvalue < obj.columns.length; cvalue++) {
    if (obj.columns[cvalue].search.value != "") {
      switch (obj.columns[cvalue].name) {
        case "UserName":
          query += " and ( u.Username LIKE '%" + obj.columns[cvalue].search.value + "%' ) ";
          break;
        case "CustomerId":
          query += " and  rr.CustomerId in (" + obj.columns[cvalue].search.value + ") ";
          break;
        case "CustomerGroupId":
          query += " and  c.CustomerGroupId in (" + obj.columns[cvalue].search.value + ") ";
          break;
        case "FromDate":
            query += " and ( DATE(rr.Created) >='" + obj.columns[cvalue].search.value + "' ) ";
          break;
        case "ToDate":
            query += " and ( DATE(rr.Created) <='" + obj.columns[cvalue].search.value + "' ) ";
          break;
        default:
          query += " and ( " + obj.columns[cvalue].name + " LIKE '%" + obj.columns[cvalue].search.value + "%' ) ";
      }
    }
  }

  var i = 0;
  var orderQuery = "";
  if (RepairRequest.order.length > 0) {
    orderQuery += " ORDER BY ";
  }
  for (i = 0; i < RepairRequest.order.length; i++) {
    if (RepairRequest.order[i].column != "" || RepairRequest.order[i].column == "0")// 0 is equal to ""
    {
      switch (RepairRequest.columns[RepairRequest.order[i].column].name) {
        case "UserName":
          orderQuery += " u.Username " + RepairRequest.order[i].dir + "";
          break;
        case "CompanyName":
          orderQuery += " c.CompanyName " + RepairRequest.order[i].dir + "";
          break;
        case "Created":
          orderQuery += " Created " + RepairRequest.order[i].dir + "";
          break;
        default:
          orderQuery += " Created DESC";

      }
    }
  }

  var limitQuery = '';
  if (RepairRequest.start != "-1" && RepairRequest.length != "-1") {
    limitQuery += " LIMIT " + RepairRequest.start + "," + (RepairRequest.length);
  }
  query += ` GROUP BY rr.CustomerId, Created, rr.CreatedBy`;
  var basequery = selectquery + query + orderQuery + limitQuery;
  var FilteredQuery = selectquery + query;
  var TotalCountQuery = `SELECT count(rr.RRId) as count, rr.CustomerId, c.CompanyName as Customer, u.Username as UserName,
  DATE(rr.Created) as Created, '-' as FromDate, '-' as ToDate FROM tbl_repair_request rr
  LEFT JOIN tbl_customers c on c.CustomerId=rr.CustomerId 
  LEFT JOIN tbl_users u on u.UserId=rr.CreatedBy    
  WHERE rr.IsDeleted=0`;
  if (RepairRequest.IdentityType == 0 && RepairRequest.IsRestrictedCustomerAccess == 1 && RepairRequest.MultipleCustomerIds != "") {
    TotalCountQuery += ` and rr.CustomerId in(${RepairRequest.MultipleCustomerIds}) `;
  }

  TotalCountQuery += ` GROUP BY rr.CustomerId, Created, rr.CreatedBy Order By Created DESC`;

  // console.log(basequery)
  // console.log("~~~~~~~~~~~~~~~~~")
  // console.log(TotalCountQuery)
  
  async.parallel([
    function (result) { con.query(basequery, result) },
    function (result) { con.query(FilteredQuery, result) },
    function (result) { con.query(TotalCountQuery, result) },
  ],
    function (err, results) {
      if (err)
        return result(err, null);

      result(null, {
        data: results[0][0], recordsFiltered: results[1][0].length,
        recordsTotal: results[2][0].length, draw: RepairRequest.draw
      });
      return;
    });

}

RRReportsModel.RRCreatedByUserReportsExcel = (RepairRequest, result) => {
  var query = ``;
  var selectquery = `SELECT u.Username as UserName, DATE_FORMAT(rr.Created,'%Y-%m-%d') as Created,  count(rr.RRId) as count, c.CompanyName as Customer`;

  query = query + ` FROM tbl_repair_request rr
  LEFT JOIN tbl_customers c on c.CustomerId=rr.CustomerId 
  LEFT JOIN tbl_users u on u.UserId=rr.CreatedBy    
  WHERE rr.IsDeleted=0`;

  if (RepairRequest.IdentityType == 0 && RepairRequest.IsRestrictedCustomerAccess == 1 && RepairRequest.MultipleCustomerIds != "") {
    TotalCountQuery += ` and rr.CustomerId in(${RepairRequest.MultipleCustomerIds}) `;
    query += ` and rr.CustomerId in(${RepairRequest.MultipleCustomerIds}) `;
  }

  if (RepairRequest.search && RepairRequest.search.value != '') {
    query = query + ` and ( c.CompanyName LIKE '%${RepairRequest.search.value}%' 
    or u.Username LIKE '%${RepairRequest.search.value}%'`;
  }

  if (RepairRequest.CustomerGroupId != '') {
    query += " and  c.CustomerGroupId in (" + RepairRequest.CustomerGroupId + ") ";
  }
  if (RepairRequest.UserName != '') {
    query += " and ( u.Username LIKE '%" + RepairRequest.UserName + "%' ) ";
  }
  if (RepairRequest.CustomerId != '') {
    query += " and  rr.CustomerId in (" + RepairRequest.CustomerId + ") ";
  }
  if (RepairRequest.FromDate != '') {
    query += " and ( DATE(rr.Created) >='" + RepairRequest.FromDate + "' ) ";
  }
  if (RepairRequest.ToDate != '') {
    query += " and ( DATE(rr.Created) <='" + RepairRequest.ToDate + "' ) ";
  }



  var cvalue = 0;
  var obj = RepairRequest;
  for (cvalue = 0; cvalue < obj.columns.length; cvalue++) {
    if (obj.columns[cvalue].search.value != "") {
      switch (obj.columns[cvalue].name) {
        case "UserName":
          query += " and ( u.Username LIKE '%" + obj.columns[cvalue].search.value + "%' ) ";
          break;
        case "CustomerId":
          query += " and  rr.CustomerId in (" + obj.columns[cvalue].search.value + ") ";
          break;
        case "CustomerGroupId":
          query += " and  c.CustomerGroupId in (" + obj.columns[cvalue].search.value + ") ";
          break;
        case "FromDate":
            query += " and ( DATE(rr.Created) >='" + obj.columns[cvalue].search.value + "' ) ";
          break;
        case "ToDate":
            query += " and ( DATE(rr.Created) <='" + obj.columns[cvalue].search.value + "' ) ";
          break;
        default:
          query += " and ( " + obj.columns[cvalue].name + " LIKE '%" + obj.columns[cvalue].search.value + "%' ) ";
      }
    }
  }

  // var i = 0;
  // var orderQuery = "";
  // if (RepairRequest.order.length > 0) {
  //   orderQuery += " ORDER BY ";
  // }
  // for (i = 0; i < RepairRequest.order.length; i++) {
  //   if (RepairRequest.order[i].column != "" || RepairRequest.order[i].column == "0")// 0 is equal to ""
  //   {
  //     switch (RepairRequest.columns[RepairRequest.order[i].column].name) {
  //       case "UserName":
  //         orderQuery += " u.Username " + RepairRequest.order[i].dir + "";
  //         break;
  //       case "CompanyName":
  //         orderQuery += " c.CompanyName " + RepairRequest.order[i].dir + "";
  //         break;
  //       case "Created":
  //         orderQuery += " Created " + RepairRequest.order[i].dir + "";
  //         break;
  //       default:
  //         orderQuery += " Created DESC";

  //     }
  //   }
  // }
  var orderQuery = " ORDER BY Created DESC";
  query += ` GROUP BY rr.CustomerId, Created, rr.CreatedBy`;
  var basequery = selectquery + query + orderQuery;
  // console.log(basequery);
  async.parallel([
    function (result) { con.query(basequery, result) },
  ],
    function (err, results) {
      if (err)
        return result(err, null);

      result(null, {
        ExcelData: results[0][0]
      });
      return;
    });
}

RRReportsModel.OpenOrderBySupplierWithoutVatReport = (RRReportsModel, result) => {

  var query = "";
  var order = "";
  var limit = "";
  selectquery = "";
  selectquery = ` SELECT rr.PartNo,ifnull(CustomerSONo,'') SONo,ifnull(VendorPONo,'') PONo,
ifnull(rr.VendorInvoiceNo,'') VendorInvoiceNo,ifnull(rr.CustomerInvoiceNo,'') InvoiceNo,rr.RRId,
rr.RRNo,v.VendorName as Supplier,v1.VendorName as Manufacturer,rrp.ManufacturerPartNo,rrp.SerialNo,rrp.Description,DATE_FORMAT(po.DueDate,'%m/%d/%Y') as PODueDate,
CASE rr.Status 
WHEN 0 THEN '${Constants.array_rr_status[0]}'
WHEN 1 THEN '${Constants.array_rr_status[1]}' 
WHEN 2 THEN '${Constants.array_rr_status[2]}' 
WHEN 3 THEN '${Constants.array_rr_status[3]}' 
WHEN 4 THEN '${Constants.array_rr_status[4]}' 
WHEN 5 THEN '${Constants.array_rr_status[5]}' 
WHEN 6 THEN '${Constants.array_rr_status[6]}' 
WHEN 7 THEN '${Constants.array_rr_status[7]}' 
WHEN 8 THEN '${Constants.array_rr_status[8]}'
ELSE '-'	end StatusName, rr.Status,c.CompanyName,rr.CustomerPONo,rr.SubStatusId,rr.AssigneeUserId,rr.RRPartLocationId,
IF(i.GrandTotal>=0,
  ifnull((SELECT ROUND((SUM(Price) - SUM(Tax)), 2)  FROM tbl_invoice_item WHERE IsDeleted = 0 AND  InvoiceId=i.InvoiceId), 0),
  If(q.GrandTotal>=0,ifnull((SELECT ROUND((SUM(Price) - SUM(Tax)), 2)  FROM tbl_quotes_item WHERE IsDeleted = 0 AND QuoteId=q.QuoteId), 0), 'TDB')
) as RepairPrice,

ROUND(rr.PartPON,2) as PriceOfNew,

IF(po.GrandTotal>=0,
 ifnull((SELECT ROUND((SUM(Price) - SUM(Tax)), 2)  FROM tbl_po_item  WHERE IsDeleted = 0 AND  POId=po.POId), 0),
  If(vq.GrandTotal>=0,ifnull((SELECT ROUND((SUM(Price) - SUM(Tax)), 2)  FROM tbl_vendor_quote_item WHERE IsDeleted = 0 AND VendorQuoteId=vq.VendorQuoteId ), 0), 'TDB')   
) as Cost,


IF(i.Shipping,CONCAT('',i.Shipping),CONCAT('',q.ShippingFee)) as ShippingCost,
(select CONCAT(ReferenceLabelName,": ",ReferenceValue) from tbl_repair_request_customer_ref rrcr Left Join tbl_cutomer_reference_labels cl Using(CReferenceId)
where rrcr.IsDeleted = 0 AND RRId=rr.RRId order by 'Rank' limit 0,1) as CustomerReference1,
(select CONCAT(ReferenceLabelName,": ",ReferenceValue) from tbl_repair_request_customer_ref rrcr Left Join tbl_cutomer_reference_labels cl Using(CReferenceId)
where rrcr.IsDeleted = 0 AND RRId=rr.RRId order by 'Rank' limit 1,1) as CustomerReference2,
(select CONCAT(ReferenceLabelName,": ",ReferenceValue) from tbl_repair_request_customer_ref rrcr Left Join tbl_cutomer_reference_labels cl Using(CReferenceId)
where rrcr.IsDeleted = 0 AND RRId=rr.RRId order by 'Rank' limit 2,1) as CustomerReference3,
(select CONCAT(ReferenceLabelName,": ",ReferenceValue)
from tbl_repair_request_customer_ref rrcr
Left Join tbl_cutomer_reference_labels cl Using(CReferenceId) where rrcr.IsDeleted = 0
AND RRId=rr.RRId order by 'Rank' limit 3,1) as CustomerReference4,
(select CONCAT(ReferenceLabelName,": ",ReferenceValue) from tbl_repair_request_customer_ref rrcr Left Join tbl_cutomer_reference_labels cl Using(CReferenceId)
where rrcr.IsDeleted = 0 AND RRId=rr.RRId order by 'Rank' limit 4,1) as CustomerReference5,
(select CONCAT(ReferenceLabelName,": ",ReferenceValue) from tbl_repair_request_customer_ref rrcr Left Join tbl_cutomer_reference_labels cl Using(CReferenceId)
where rrcr.IsDeleted = 0 AND RRId=rr.RRId order by 'Rank' limit 5,1) as CustomerReference6,
rrp.CustomerPartNo1,rrp.CustomerPartNo2,
rr.StatedIssue as CustomerStatedIssue,rrv.RouteCause RootCause,IFNULL(cd.CustomerDepartmentName,'') as CustomerDepartmentName,
Case IsCriticalSpare
WHEN 0 THEN 'No'
WHEN 1 THEN 'Yes'
ELSE '-' end CriticalSpare`;

  recordfilterquery = `Select count(rr.RRId) as recordsFiltered `;
  query = query + `  FROM tbl_repair_request rr
LEFT JOIN tbl_customers c on c.CustomerId = rr.CustomerId
LEFT JOIN tbl_vendors v on v.VendorId=rr.VendorId
LEFT JOIN tbl_repair_request_vendors rrv on rrv.VendorId=rr.VendorId AND rrv.Status!=3 AND rrv.RRId = rr.RRId   AND rrv.IsDeleted = 0
LEFT JOIN tbl_repair_request_parts rrp on rrp.RRId =rr.RRId
LEFT JOIN tbl_vendors v1 on v1.VendorId=rrp.Manufacturer
LEFT JOIN tbl_customer_departments cd on cd.CustomerDepartmentId=rr.DepartmentId
LEFT JOIN tbl_customer_assets ca on ca.CustomerAssetId=rr.AssetId

LEFT JOIN tbl_quotes q on q.RRId=rr.RRId  and q.RRId>0 and q.Status In(1,2,4) and q.QuoteCustomerStatus In(1,2,3) and q.IsDeleted = 0 
LEFT JOIN tbl_vendor_quote as vq ON vq.QuoteId = q.QuoteId AND vq.IsDeleted =0 AND vq.RRId = q.RRId 
LEFT JOIN tbl_invoice i on i.RRId=rr.RRId and i.RRId>0 AND i.IsDeleted = 0  AND i.Status!=${Constants.CONST_INV_STATUS_CANCELLED}
LEFT JOIN tbl_vendor_invoice vi on vi.RRId=rr.RRId and vi.RRId>0 and vi.IsDeleted = 0 
LEFT JOIN tbl_currencies as CURL  ON CURL.CurrencyCode = i.LocalCurrencyCode AND CURL.IsDeleted = 0 
LEFT JOIN tbl_currencies as CURLQ  ON CURLQ.CurrencyCode = q.LocalCurrencyCode AND CURLQ.IsDeleted = 0 
LEFT JOIN tbl_po po on po.RRId=rr.RRId and po.RRId>0  AND po.Status!=${Constants.CONST_PO_STATUS_CANCELLED} AND po.IsDeleted = 0 

LEFT JOIN tbl_sales_order s on s.RRId=rr.RRId   AND s.Status!=${Constants.CONST_SO_STATUS_CANCELLED}  AND s.IsDeleted = 0

where  rr.IsDeleted= 0 `;
  if (RRReportsModel.IdentityType == 0 && RRReportsModel.IsRestrictedCustomerAccess == 1 && RRReportsModel.MultipleCustomerIds != "") {
    query += ` and rr.CustomerId in(${RRReportsModel.MultipleCustomerIds}) `;
  }
  if (RRReportsModel.Manufacturer != "") {
    query += " and ( rrp.Manufacturer ='" + RRReportsModel.Manufacturer + "' ) ";
  }
  if (RRReportsModel.ManufacturerPartNo != "") {
    query += " and ( rrp.ManufacturerPartNo ='" + RRReportsModel.ManufacturerPartNo + "' ) ";
  }
  if (RRReportsModel.SerialNo != "") {
    query += " and ( rrp.SerialNo ='" + RRReportsModel.SerialNo + "' ) ";
  }
  if (RRReportsModel.Status != "") {
    query += " and ( rr.Status ='" + RRReportsModel.Status + "' ) ";
  }
  if (RRReportsModel.PODueDate != "") {
    query += " and  po.DueDate = '" + RRReportsModel.PODueDate + "'  ";
  }
  var Ids;
  if (RRReportsModel.CustomerId != "") {

    Ids = ``;
    for (let val of RRReportsModel.CustomerId) {
      Ids += val + `,`;
    }
    var CustomerIds = Ids.slice(0, -1);
    query += " and  rr.CustomerId IN (" + CustomerIds + " ) ";
  }
  if (RRReportsModel.CustomerPONo != "") {
    query += " and ( rr.CustomerPONo ='" + RRReportsModel.CustomerPONo + "' ) ";
  }
  if (RRReportsModel.SubStatusId != "") {
    query += " and rr.SubStatusId  = '" + RRReportsModel.SubStatusId + "'  ";
  }
  if (RRReportsModel.AssigneeUserId != "") {
    query += " and rr.AssigneeUserId  = '" + RRReportsModel.AssigneeUserId + "'  ";
  }
  if (RRReportsModel.RRPartLocationId != "") {
    query += " and rr.RRPartLocationId  = '" + RRReportsModel.RRPartLocationId + "'  ";
  }
  if (RRReportsModel.CustomerGroupId != "") {
    // query += " and (rr.CustomerId IN(SELECT CustomerId FROM tbl_customers  WHERE CustomerGroupId IN (" + RRReportsModel.CustomerGroupId + "))) ";
    query += ` and c.CustomerGroupId in(` + RRReportsModel.CustomerGroupId + `)`;
  }
  if (RRReportsModel.VendorId != "") {
    Ids = ``;
    for (let val of RRReportsModel.VendorId) {
      Ids += val + `,`;
    }
    var VendorIds = Ids.slice(0, -1);
    query += " and  rr.VendorId IN (" + VendorIds + " ) ";
  }
  var i = 0;
  if (RRReportsModel.order.length > 0) {
    order += " ORDER BY ";
  }
  for (i = 0; i < RRReportsModel.order.length; i++) {
    if (RRReportsModel.order[i].column != "" || RRReportsModel.order[i].column == "0")// 0 is equal to ""
    {
      switch (RRReportsModel.columns[RRReportsModel.order[i].column].name) {
        case "SONo":
          order += " ifnull(rr.CustomerSONo,'') " + RRReportsModel.order[i].dir + ",";
          break;
        case "PONo":
          order += " ifnull(rr.VendorPONo,'') " + RRReportsModel.order[i].dir + ",";
          break;
        case "VendorInvoiceNo":
          order += " ifnull(rr.VendorInvoiceNo,'') " + RRReportsModel.order[i].dir + ",";
          break;
        case "InvoiceNo":
          order += " ifnull(rr.CustomerInvoiceNo,'') " + RRReportsModel.order[i].dir + ",";
          break;
        case "RRNo":
          order += " rr.RRNo " + RRReportsModel.order[i].dir + ",";
          break;
        case "CustomerId":
          order += " rr.CustomerId " + RRReportsModel.order[i].dir + ",";
          break;
        case "SerialNo":
          order += " rrp.SerialNo " + RRReportsModel.order[i].dir + ",";
          break;
        default:
          order += " " + RRReportsModel.columns[RRReportsModel.order[i].column].name + " " + RRReportsModel.order[i].dir + ",";

      }
    }
  }
  order = order.slice(0, -1);
  // var tempquery = query.slice(0, -1);
  // var query = tempquery;
  var Countquery = recordfilterquery + query;
  if (RRReportsModel.start != "-1" && RRReportsModel.length != "-1") {
    limit += " LIMIT " + RRReportsModel.start + "," + (RRReportsModel.length);
  }
  query = selectquery + query + order + limit;

  var TotalCountQuery = `SELECT Count(rr.RRId) as TotalCount 
   FROM tbl_repair_request rr
LEFT JOIN tbl_customers c on c.CustomerId = rr.CustomerId
LEFT JOIN tbl_vendors v on v.VendorId=rr.VendorId
LEFT JOIN tbl_repair_request_vendors rrv on rrv.VendorId=rr.VendorId AND rrv.Status!=3 AND rrv.RRId = rr.RRId   AND rrv.IsDeleted = 0
LEFT JOIN tbl_repair_request_parts rrp on rrp.RRId =rr.RRId
LEFT JOIN tbl_vendors v1 on v1.VendorId=rrp.Manufacturer
LEFT JOIN tbl_customer_departments cd on cd.CustomerDepartmentId=rr.DepartmentId
LEFT JOIN tbl_customer_assets ca on ca.CustomerAssetId=rr.AssetId

LEFT JOIN tbl_quotes q on q.RRId=rr.RRId  and q.RRId>0 and q.Status In(1,2,4) and q.QuoteCustomerStatus In(1,2,3) and q.IsDeleted = 0 
LEFT JOIN tbl_invoice i on i.RRId=rr.RRId and i.RRId>0 AND i.IsDeleted = 0  AND i.Status!=${Constants.CONST_INV_STATUS_CANCELLED}
LEFT JOIN tbl_vendor_invoice vi on vi.RRId=rr.RRId and vi.RRId>0 and vi.IsDeleted = 0 
LEFT JOIN tbl_currencies as CURL  ON CURL.CurrencyCode = i.LocalCurrencyCode AND CURL.IsDeleted = 0 
LEFT JOIN tbl_currencies as CURLQ  ON CURLQ.CurrencyCode = q.LocalCurrencyCode AND CURLQ.IsDeleted = 0 
LEFT JOIN tbl_po po on po.RRId=rr.RRId and po.RRId>0  AND po.Status!=${Constants.CONST_PO_STATUS_CANCELLED} AND po.IsDeleted = 0 

LEFT JOIN tbl_sales_order s on s.RRId=rr.RRId  AND s.Status!=${Constants.CONST_SO_STATUS_CANCELLED}  AND s.IsDeleted = 0
where  rr.IsDeleted= 0 `;
  if (RRReportsModel.IdentityType == 0 && RRReportsModel.IsRestrictedCustomerAccess == 1 && RRReportsModel.MultipleCustomerIds != "") {
    TotalCountQuery += ` and rr.CustomerId in(${RRReportsModel.MultipleCustomerIds}) `;
  }
 // console.log("query-OpenOrderBySupplierReport-1 = " + query);
  //console.log("Countquery = " + Countquery);
  //console.log("TotalCountQuery = " + TotalCountQuery);
  async.parallel([
    function (result) { con.query(query, result) },
    function (result) { con.query(Countquery, result) },
    function (result) { con.query(TotalCountQuery, result) }
  ],
    function (err, results) {
      if (err) {
        console.log("err" + err)
        return result(err, null);
      }

      result(null, {
        data: results[0][0], recordsFiltered: results[1][0][0].recordsFiltered,
        recordsTotal: results[2][0][0].TotalCount, draw: RRReportsModel.draw
      });
      return;
    });
};
// 
RRReportsModel.OpenOrderBySupplierWithoutVatReportCount = (RRReportsModel, result) => {
  var TotalCountQuery = `SELECT Count(rr.RRId) as TotalCount 
   FROM tbl_repair_request rr
LEFT JOIN tbl_customers c on c.CustomerId = rr.CustomerId
LEFT JOIN tbl_vendors v on v.VendorId=rr.VendorId
LEFT JOIN tbl_repair_request_vendors rrv on rrv.VendorId=rr.VendorId AND rrv.Status!=3 AND rrv.RRId = rr.RRId   AND rrv.IsDeleted = 0
LEFT JOIN tbl_repair_request_parts rrp on rrp.RRId =rr.RRId
LEFT JOIN tbl_vendors v1 on v1.VendorId=rrp.Manufacturer
LEFT JOIN tbl_customer_departments cd on cd.CustomerDepartmentId=rr.DepartmentId
LEFT JOIN tbl_customer_assets ca on ca.CustomerAssetId=rr.AssetId

LEFT JOIN tbl_quotes q on q.RRId=rr.RRId  and q.RRId>0 and q.Status In(1,2,4) and q.QuoteCustomerStatus In(1,2,3) and q.IsDeleted = 0 
LEFT JOIN tbl_invoice i on i.RRId=rr.RRId and i.RRId>0 AND i.IsDeleted = 0  AND i.Status!=${Constants.CONST_INV_STATUS_CANCELLED}
LEFT JOIN tbl_vendor_invoice vi on vi.RRId=rr.RRId and vi.RRId>0 and vi.IsDeleted = 0 
LEFT JOIN tbl_currencies as CURL  ON CURL.CurrencyCode = i.LocalCurrencyCode AND CURL.IsDeleted = 0 
LEFT JOIN tbl_currencies as CURLQ  ON CURLQ.CurrencyCode = q.LocalCurrencyCode AND CURLQ.IsDeleted = 0 
LEFT JOIN tbl_po po on po.RRId=rr.RRId and po.RRId>0  AND po.Status!=${Constants.CONST_PO_STATUS_CANCELLED} AND po.IsDeleted = 0 

LEFT JOIN tbl_sales_order s on s.RRId=rr.RRId  AND s.Status!=${Constants.CONST_SO_STATUS_CANCELLED}  AND s.IsDeleted = 0
where  rr.IsDeleted= 0 `;
  if (RRReportsModel.IdentityType == 0 && RRReportsModel.IsRestrictedCustomerAccess == 1 && RRReportsModel.MultipleCustomerIds != "") {
    TotalCountQuery += ` and rr.CustomerId in(${RRReportsModel.MultipleCustomerIds}) `;
  }
  // console.log("query-OpenOrderBySupplierReport-1 = " + query);
  async.parallel([
    function (result) { con.query(TotalCountQuery, result) }
  ],
    function (err, results) {
      if (err) {
        console.log("err" + err)
        return result(err, null);
      }

      result(null, {
        recordsTotal: results[0][0][0].TotalCount
      });
      return;
    });
}


//Get OpenOrderBySupplierWithoutVatReport ExportToExcel
RRReportsModel.OpenOrderBySupplierWithoutVatReportExportToExcel = (reqBody, result) => {
// ROUND((IF(Appq.GrandTotal,ifnull(Appq.GrandTotal,0),ifnull(Otherq.GrandTotal,0))),2) as RepairPrice,
// ROUND((IF(Appvq.GrandTotal,Appvq.GrandTotal,Othervq.GrandTotal)),2) as Cost,
  var Ids = ``;
  for (let val of reqBody.RRReports) {
    Ids += val.RRId + `,`;
  }
  var RRIds = Ids.slice(0, -1);

  var query = ``;
  query = ` SELECT rr.PartNo,(Select if(qi.Quantity>0,qi.Quantity,if(rrp.Quantity>0,rrp.Quantity,0)) as Quantity
from tbl_repair_request_parts rrp
Left join tbl_quotes q on q.RRId=rrp.RRId and q.IsDeleted=0 and q.Status In(1,2,4) and q.QuoteCustomerStatus In(1,2,3)  
Left join tbl_quotes_item qi on qi.QuoteId=q.QuoteId  and qi.IsDeleted=0 and rrp.PartId=qi.PartId
where rrp.IsDeleted=0  and rrp.RRId=rr.RRId limit 0,1) Quantity,
ifnull(rr.CustomerSONo,'') SONo,ifnull(rr.VendorPONo,'') PONo,ifnull(rr.CustomerInvoiceNo,'') InvoiceNo,
(Select DATE_FORMAT(Created,'%m/%d/%Y') from tbl_repair_request_status_history 
where HistoryStatus=${Constants.CONST_RRS_QUOTE_REJECTED} and RRId=rr.RRId order by HistoryId desc limit 0,1) as RejectedDate,
DATE_FORMAT(rr.RRCompletedDate,'%m/%d/%Y')  as CompletedDate,rr.RRId,
rr.RRNo,v.VendorName as Supplier,v1.VendorName as Manufacturer,rrp.ManufacturerPartNo,rrp.SerialNo,rrp.Description,
CASE rr.Status 
WHEN 0 THEN '${Constants.array_rr_status[0]}'
WHEN 1 THEN '${Constants.array_rr_status[1]}' 
WHEN 2 THEN '${Constants.array_rr_status[2]}' 
WHEN 3 THEN '${Constants.array_rr_status[3]}' 
WHEN 4 THEN '${Constants.array_rr_status[4]}' 
WHEN 5 THEN '${Constants.array_rr_status[5]}' 
WHEN 6 THEN '${Constants.array_rr_status[6]}' 
WHEN 7 THEN '${Constants.array_rr_status[7]}' 
WHEN 8 THEN '${Constants.array_rr_status[8]}'
ELSE '-'	end StatusName, rr.Status,c.CompanyName,rr.CustomerPONo,  
 
IF(i.GrandTotal>=0,
  ifnull((SELECT ROUND((SUM(Price) - SUM(Tax)), 2)  FROM tbl_invoice_item WHERE IsDeleted = 0 AND  InvoiceId=i.InvoiceId), 0),
  If(q.GrandTotal>=0,ifnull((SELECT ROUND((SUM(Price) - SUM(Tax)), 2)  FROM tbl_quotes_item WHERE IsDeleted = 0 AND QuoteId=q.QuoteId), 0), 'TDB')
) as RepairPrice,

ROUND(rr.PartPON,2) as PriceOfNew,

IF(po.GrandTotal>=0,
 ifnull((SELECT ROUND((SUM(Price) - SUM(Tax)), 2)  FROM tbl_po_item  WHERE IsDeleted = 0 AND  POId=po.POId), 0),
  If(vq.GrandTotal>=0,ifnull((SELECT ROUND((SUM(Price) - SUM(Tax)), 2)  FROM tbl_vendor_quote_item WHERE IsDeleted = 0 AND VendorQuoteId=vq.VendorQuoteId ), 0), 'TDB')   
) as Cost,

IF(i.Shipping,CONCAT('',i.Shipping),CONCAT('',q.ShippingFee)) as ShippingCost,



DATE_FORMAT(rr.Created,'%m/%d/%Y') as AHReceivedDate,DATE_FORMAT(s.DueDate,'%m/%d/%Y') as SalesOrderRequiredDate,
DATE_FORMAT(q.SubmittedDate,'%m/%d/%Y')  as QuoteSubmittedDate,
DATE_FORMAT(q.ApprovedDate,'%m/%d/%Y') as ApprovedDate,
Case IsRushRepair
WHEN 0 THEN 'Normal'
WHEN 1 THEN 'Rush'
ELSE '-' end IsRushRepairName,
(select CONCAT(ReferenceLabelName,": ",ReferenceValue) from tbl_repair_request_customer_ref rrcr Left Join tbl_cutomer_reference_labels cl Using(CReferenceId)
where rrcr.IsDeleted = 0 AND RRId=rr.RRId order by 'Rank' limit 0,1) as CustomerReference1,
(select CONCAT(ReferenceLabelName,": ",ReferenceValue) from tbl_repair_request_customer_ref rrcr Left Join tbl_cutomer_reference_labels cl Using(CReferenceId)
where rrcr.IsDeleted = 0 AND RRId=rr.RRId order by 'Rank' limit 1,1) as CustomerReference2,
(select CONCAT(ReferenceLabelName,": ",ReferenceValue) from tbl_repair_request_customer_ref rrcr Left Join tbl_cutomer_reference_labels cl Using(CReferenceId)
where rrcr.IsDeleted = 0 AND RRId=rr.RRId order by 'Rank' limit 2,1) as CustomerReference3,
(select CONCAT(ReferenceLabelName,": ",ReferenceValue)
from tbl_repair_request_customer_ref rrcr
Left Join tbl_cutomer_reference_labels cl Using(CReferenceId) where rrcr.IsDeleted = 0
AND RRId=rr.RRId order by 'Rank' limit 3,1) as CustomerReference4,
(select CONCAT(ReferenceLabelName,": ",ReferenceValue) from tbl_repair_request_customer_ref rrcr Left Join tbl_cutomer_reference_labels cl Using(CReferenceId)
where rrcr.IsDeleted = 0 AND RRId=rr.RRId order by 'Rank' limit 4,1) as CustomerReference5,
(select CONCAT(ReferenceLabelName,": ",ReferenceValue) from tbl_repair_request_customer_ref rrcr Left Join tbl_cutomer_reference_labels cl Using(CReferenceId)
where rrcr.IsDeleted = 0 AND RRId=rr.RRId order by 'Rank' limit 5,1) as CustomerReference6,
rrp.CustomerPartNo1,rrp.CustomerPartNo2,
rr.StatedIssue as CustomerStatedIssue,rrv.RouteCause RootCause,IFNULL(cd.CustomerDepartmentName,'') as CustomerDepartmentName,
(Select GROUP_CONCAT(Notes ORDER BY Notes SEPARATOR ' // ')  from tbl_repair_request_followup_notes
where IsDeleted=0 and RRId=rr.RRId) as RRFollowUpNotes,
Case IsCriticalSpare
WHEN 0 THEN 'No'
WHEN 1 THEN 'Yes'
ELSE '-' end CriticalSpare

FROM tbl_repair_request rr
LEFT JOIN tbl_customers c on c.CustomerId = rr.CustomerId
LEFT JOIN tbl_vendors v on v.VendorId=rr.VendorId
LEFT JOIN tbl_repair_request_vendors rrv on rrv.VendorId=rr.VendorId AND rrv.Status!=3 AND rrv.RRId = rr.RRId   AND rrv.IsDeleted = 0
LEFT JOIN tbl_repair_request_parts rrp on rrp.RRId =rr.RRId
LEFT JOIN tbl_vendors v1 on v1.VendorId=rrp.Manufacturer
LEFT JOIN tbl_customer_departments cd on cd.CustomerDepartmentId=rr.DepartmentId
LEFT JOIN tbl_customer_assets ca on ca.CustomerAssetId=rr.AssetId

LEFT JOIN tbl_quotes q on q.RRId=rr.RRId  and q.RRId>0 and q.Status In(1,2,4) and q.QuoteCustomerStatus In(1,2,3) and q.IsDeleted = 0 
LEFT JOIN tbl_vendor_quote as vq ON vq.QuoteId = q.QuoteId AND vq.IsDeleted =0 AND vq.RRId = q.RRId
LEFT JOIN tbl_invoice i on i.RRId=rr.RRId and i.RRId>0 AND i.IsDeleted = 0  AND i.Status!=${Constants.CONST_INV_STATUS_CANCELLED}
LEFT JOIN tbl_vendor_invoice vi on vi.RRId=rr.RRId and vi.RRId>0 and vi.IsDeleted = 0 
LEFT JOIN tbl_currencies as CURL  ON CURL.CurrencyCode = i.LocalCurrencyCode AND CURL.IsDeleted = 0 
LEFT JOIN tbl_currencies as CURLQ  ON CURLQ.CurrencyCode = q.LocalCurrencyCode AND CURLQ.IsDeleted = 0 
LEFT JOIN tbl_po po on po.RRId=rr.RRId and po.RRId>0  AND po.Status!=${Constants.CONST_PO_STATUS_CANCELLED} AND po.IsDeleted = 0 

LEFT JOIN tbl_sales_order s on s.RRId=rr.RRId AND s.Status != 3 AND s.IsDeleted = 0
where  rr.IsDeleted= 0 `;
  if (reqBody.IdentityType == 0 && reqBody.IsRestrictedCustomerAccess == 1 && reqBody.MultipleCustomerIds != "") {
    query += ` and rr.CustomerId in(${reqBody.MultipleCustomerIds}) `;
  }
  if (reqBody.Manufacturer != "") {
    query += " and ( rrp.Manufacturer ='" + reqBody.Manufacturer + "' ) ";
  }
  if (reqBody.ManufacturerPartNo != "") {
    query += " and ( rrp.ManufacturerPartNo ='" + reqBody.ManufacturerPartNo + "' ) ";
  }
  if (reqBody.SerialNo != "") {
    query += " and ( rr.SerialNo ='" + reqBody.SerialNo + "' ) ";
  }
  if (reqBody.Status != "") {
    query += " and ( rr.Status ='" + reqBody.Status + "' ) ";
  }
  if (reqBody.SubStatusId != "") {
    query += " and rr.SubStatusId  = '" + reqBody.SubStatusId + "'  ";
  }
  if (reqBody.AssigneeUserId != "") {
    query += " and rr.AssigneeUserId  = '" + reqBody.AssigneeUserId + "'  ";
  }
  if (reqBody.RRPartLocationId != "") {
    query += " and rr.RRPartLocationId  = '" + reqBody.RRPartLocationId + "'  ";
  }
  if (reqBody.PODueDate != "") {
    query += " and  po.DueDate = '" + reqBody.PODueDate + "'  ";
  }
  if (reqBody.CustomerGroupId != "") {
    // query += " and (rr.CustomerId IN(SELECT CustomerId FROM tbl_customers  WHERE CustomerGroupId IN (" + reqBody.CustomerGroupId + "))) ";
    query += ` and c.CustomerGroupId in(` + reqBody.CustomerGroupId + `)`;
  }
  var Ids;
  if (reqBody.CustomerId != "") {
    Ids = ``;
    for (let val of reqBody.CustomerId) {
      Ids += val + `,`;
    }
    var CustomerIds = Ids.slice(0, -1);
    query += " and  rr.CustomerId IN (" + CustomerIds + ") ";
  }
  if (reqBody.CustomerPONo != "") {
    query += " and ( rr.CustomerPONo ='" + reqBody.CustomerPONo + "' ) ";
  }
  if (reqBody.VendorId != "") {
    Ids = ``;
    for (let val of reqBody.VendorId) {
      Ids += val + `,`;
    }
    var VendorIds = Ids.slice(0, -1);
    query += " and  rr.VendorId IN (" + VendorIds + " ) ";
  }
  if (RRIds != '' && RRIds != null) {
    query += ` and rr.RRId in(` + RRIds + `)`;
  }
  // console.log("SQL=" + query);
  con.query(query, (err, res) => {
    if (err) {
      return result(err, null);
    }
    return result(null, { ExcelData: res });
  });
};

RRReportsModel.getRMAReportCount = (RRReportsModel, result) => {
  var TotalCountQuery = `SELECT Count(rr.RRId) as TotalCount 
  FROM tbl_repair_request rr
  LEFT JOIN tbl_customers c on c.CustomerId = rr.CustomerId
  LEFT JOIN tbl_vendors v on v.VendorId=rr.VendorId
  LEFT JOIN tbl_repair_request_vendors rrv on rrv.VendorId=rr.VendorId AND rrv.Status!=3 AND rrv.RRId = rr.RRId   AND rrv.IsDeleted = 0
  LEFT JOIN tbl_repair_request_parts rrp on rrp.RRId =rr.RRId
  LEFT JOIN tbl_vendors v1 on v1.VendorId=rrp.Manufacturer
  LEFT JOIN tbl_customer_departments cd on cd.CustomerDepartmentId=rr.DepartmentId
  LEFT JOIN tbl_customer_assets ca on ca.CustomerAssetId=rr.AssetId
  
  LEFT JOIN tbl_quotes q on q.RRId=rr.RRId  and q.RRId>0 and q.Status In(1,2,4) and q.QuoteCustomerStatus In(1,2,3) and q.IsDeleted = 0 
  LEFT JOIN tbl_invoice i on i.RRId=rr.RRId and i.RRId>0 AND i.IsDeleted = 0  AND i.Status!=${Constants.CONST_INV_STATUS_CANCELLED}
  LEFT JOIN tbl_vendor_invoice vi on vi.RRId=rr.RRId and vi.RRId>0 and vi.IsDeleted = 0 
  LEFT JOIN tbl_currencies as CURL  ON CURL.CurrencyCode = i.LocalCurrencyCode AND CURL.IsDeleted = 0 
  LEFT JOIN tbl_currencies as CURLQ  ON CURLQ.CurrencyCode = q.LocalCurrencyCode AND CURLQ.IsDeleted = 0 
  LEFT JOIN tbl_po po on po.RRId=rr.RRId and po.RRId>0  AND po.Status!=${Constants.CONST_PO_STATUS_CANCELLED} AND po.IsDeleted = 0 
  
  LEFT JOIN tbl_sales_order s on s.RRId=rr.RRId   AND s.Status!=${Constants.CONST_SO_STATUS_CANCELLED}  AND s.IsDeleted = 0
  
  LEFT JOIN tbl_repair_request_shipping_history rrsh ON rrsh.RRId=rr.RRId and rrsh.ShipFromIdentity=1 and 
  rrsh.ShippingHistoryId = (SELECT ShippingHistoryId FROM tbl_repair_request_shipping_history
    WHERE RRId = rr.RRId and ShipFromIdentity=1 AND IsDeleted = 0 ORDER BY ShippingHistoryId DESC
    LIMIT 1) AND rrsh.IsDeleted = 0
  
  where  rr.IsDeleted= 0  `;
  if (RRReportsModel.IdentityType == 0 && RRReportsModel.IsRestrictedCustomerAccess == 1 && RRReportsModel.MultipleCustomerIds != "") {
    TotalCountQuery += ` and rr.CustomerId in(${RRReportsModel.MultipleCustomerIds}) `;
  }
  // console.log("query-OpenOrderBySupplierReport-1 = " + query);
  async.parallel([
    function (result) { con.query(TotalCountQuery, result) }
  ],
    function (err, results) {
      if (err) {
        console.log("err" + err)
        return result(err, null);
      }

      result(null, {
        recordsTotal: results[0][0][0].TotalCount
      });
      return;
    });
}

//Get DanaOpenOrderBySupplierReport
RRReportsModel.DanaOpenOrderBySupplierReport = (RRReportsModel, result) => {

  var query = "";
  var order = "";
  var limit = "";
  selectquery = "";

  //comment LEFT JOIN tbl_quotes q on q.RRId=rr.RRId and q.Status='${Constants.CONST_QUOTE_STATUS_APPROVED}' and q.QuoteCustomerStatus='${Constants.CONST_CUSTOMER_QUOTE_ACCEPTED}' AND q.IsDeleted = 0

  selectquery = ` SELECT rr.PartNo,(Select if(qi.Quantity>0,qi.Quantity,if(rrp.Quantity>0,rrp.Quantity,0)) as Quantity
from tbl_repair_request_parts rrp
Left join tbl_quotes q on q.RRId=rrp.RRId and q.IsDeleted=0 and q.Status In(1,2,4) and q.QuoteCustomerStatus In(1,2,3)
Left join tbl_quotes_item qi on qi.QuoteId=q.QuoteId  and qi.IsDeleted=0  and rrp.PartId=qi.PartId
where rrp.IsDeleted=0 and rrp.RRId=rr.RRId limit 0,1) Quantity,
ifnull(rr.CustomerSONo,'') SONo,ifnull(rr.VendorPONo,'') PONo,
ifnull(rr.VendorInvoiceNo,'') VendorInvoiceNo,ifnull(rr.CustomerInvoiceNo,'') InvoiceNo,
(Select DATE_FORMAT(Created,'%m/%d/%Y') from tbl_repair_request_status_history
where HistoryStatus=8 and RRId=rr.RRId order by HistoryId desc limit 0,1) as NotRepairableDate,
(Select DATE_FORMAT(Created,'%m/%d/%Y') from tbl_repair_request_status_history 
where HistoryStatus=${Constants.CONST_RRS_QUOTE_REJECTED} and RRId=rr.RRId order by HistoryId desc limit 0,1) as RejectedDate,
DATE_FORMAT(rr.RRCompletedDate,'%m/%d/%Y')  as CompletedDate,rr.RRId,
rr.RRNo,v.VendorName as Supplier,v1.VendorName as Manufacturer,rrp.ManufacturerPartNo,rrp.SerialNo,rrp.Description,DATE_FORMAT(po.DueDate,'%m/%d/%Y') as PODueDate,
CASE rr.Status 
WHEN 0 THEN '${Constants.array_rr_status[0]}'
WHEN 1 THEN '${Constants.array_rr_status[1]}' 
WHEN 2 THEN '${Constants.array_rr_status[2]}' 
WHEN 3 THEN '${Constants.array_rr_status[3]}' 
WHEN 4 THEN '${Constants.array_rr_status[4]}' 
WHEN 5 THEN '${Constants.array_rr_status[5]}' 
WHEN 6 THEN '${Constants.array_rr_status[6]}' 
WHEN 7 THEN '${Constants.array_rr_status[7]}' 
WHEN 8 THEN '${Constants.array_rr_status[8]}'
ELSE '-'	end StatusName, rr.Status,c.CompanyName,rr.CustomerPONo,rr.SubStatusId,rr.AssigneeUserId,rr.RRPartLocationId,

CONCAT(IFNULL(CURL.CurrencySymbol,CURLQ.CurrencySymbol),' ',FORMAT(IF(i.GrandTotal>=0,i.GrandTotal,If(q.GrandTotal>=0,q.GrandTotal,'TBD')),2)) RepairPrice,
ROUND(rr.PartPON,2) as PriceOfNew,
FORMAT(IF(vi.GrandTotal>=0,vi.GrandTotal,If(po.GrandTotal>=0,po.GrandTotal,'TBD')),2) Cost,

IF(i.Shipping,CONCAT('',i.Shipping),CONCAT('',q.ShippingFee)) as ShippingCost,
DATE_FORMAT(rr.Created,'%m/%d/%Y') as AHReceivedDate,DATE_FORMAT(s.DueDate,'%m/%d/%Y') as SalesOrderRequiredDate,
DATE_FORMAT(q.SubmittedDate,'%m/%d/%Y') as QuoteSubmittedDate,
DATE_FORMAT(q.ApprovedDate,'%m/%d/%Y') as ApprovedDate,
Case IsRushRepair
WHEN 0 THEN 'Normal'
WHEN 1 THEN 'Rush'
ELSE '-' end IsRushRepairName,
(select CONCAT(ReferenceLabelName,": ",ReferenceValue) from tbl_repair_request_customer_ref rrcr Left Join tbl_cutomer_reference_labels cl Using(CReferenceId)
where rrcr.IsDeleted = 0 AND RRId=rr.RRId order by 'Rank' limit 0,1) as CustomerReference1,
(select CONCAT(ReferenceLabelName,": ",ReferenceValue) from tbl_repair_request_customer_ref rrcr Left Join tbl_cutomer_reference_labels cl Using(CReferenceId)
where rrcr.IsDeleted = 0 AND RRId=rr.RRId order by 'Rank' limit 1,1) as CustomerReference2,
(select CONCAT(ReferenceLabelName,": ",ReferenceValue) from tbl_repair_request_customer_ref rrcr Left Join tbl_cutomer_reference_labels cl Using(CReferenceId)
where rrcr.IsDeleted = 0 AND RRId=rr.RRId order by 'Rank' limit 2,1) as CustomerReference3,
(select CONCAT(ReferenceLabelName,": ",ReferenceValue)
from tbl_repair_request_customer_ref rrcr
Left Join tbl_cutomer_reference_labels cl Using(CReferenceId) where rrcr.IsDeleted = 0
AND RRId=rr.RRId order by 'Rank' limit 3,1) as CustomerReference4,
(select CONCAT(ReferenceLabelName,": ",ReferenceValue) from tbl_repair_request_customer_ref rrcr Left Join tbl_cutomer_reference_labels cl Using(CReferenceId)
where rrcr.IsDeleted = 0 AND RRId=rr.RRId order by 'Rank' limit 4,1) as CustomerReference5,
(select CONCAT(ReferenceLabelName,": ",ReferenceValue) from tbl_repair_request_customer_ref rrcr Left Join tbl_cutomer_reference_labels cl Using(CReferenceId)
where rrcr.IsDeleted = 0 AND RRId=rr.RRId order by 'Rank' limit 5,1) as CustomerReference6,
rrp.CustomerPartNo1,rrp.CustomerPartNo2,
rr.StatedIssue as CustomerStatedIssue,rrv.RouteCause RootCause,IFNULL(cd.CustomerDepartmentName,'') as CustomerDepartmentName, IFNULL(ca.CustomerAssetName,'') as CustomerAssetName,
 
IF(FIND_IN_SET(v.VendorId,c.DirectedVendors)>0,'Yes','No') as DirectedSupplier,

if(rr.Status=6, CASE rr.RejectedStatusType 
WHEN 1 THEN '${Constants.array_customer_quote_reject_status[1]}' 
WHEN 2 THEN '${Constants.array_customer_quote_reject_status[2]}' 
WHEN 3 THEN '${Constants.array_customer_quote_reject_status[3]}' 
WHEN 4 THEN '${Constants.array_customer_quote_reject_status[4]}' 
WHEN 5 THEN '${Constants.array_customer_quote_reject_status[5]}' 
WHEN 6 THEN '${Constants.array_customer_quote_reject_status[6]}' 
WHEN 7 THEN '${Constants.array_customer_quote_reject_status[7]}' 
WHEN 8 THEN '${Constants.array_customer_quote_reject_status[8]}'
ELSE '' END  ,'') as QuoteRejectCode, rrv.VendorRefNo,
IsWarrantyDenied,Case IsWarrantyDenied
WHEN 0 THEN 'No'
WHEN 1 THEN 'Yes'
ELSE '-' end IsWarrantyDeniedName,
if(rrsh.ShipFromIdentity = 1, DATE_FORMAT(rrsh.ShipDate,'%m/%d/%Y'), '-') as ShipFromCustomer,
if(rrsh.ShipFromIdentity=1, CASE rrsh.ShipToId 
  WHEN 5 THEN 'AH Group' 
  ELSE 'Vendor' END, '-') as ShipToName,
  DATE_FORMAT(q.QuoteDate,'%m/%d/%Y') as QuoteDate,
  DATE_FORMAT(s.DueDate,'%m/%d/%Y') as SODueDate,
(select MAX(DATE_FORMAT(Created,'%m/%d/%Y') )  from tbl_repair_request_followup where IsDeleted=0 and RRId=rr.RRId) as MostRecentFollowUpDate,
rrsh1.ShipFromName as StartLocation, rrsh1.ShipToName as FirstShipToName, DATE_FORMAT(rrsh1.ShipDate,'%m/%d/%Y') as FirstShipDate

`;

  recordfilterquery = `Select count(rr.RRId) as recordsFiltered `;
  query = query + `  FROM tbl_repair_request rr
LEFT JOIN tbl_customers c on c.CustomerId = rr.CustomerId
LEFT JOIN tbl_vendors v on v.VendorId=rr.VendorId
LEFT JOIN tbl_repair_request_vendors rrv on rrv.VendorId=rr.VendorId AND rrv.Status!=3 AND rrv.RRId = rr.RRId   AND rrv.IsDeleted = 0
LEFT JOIN tbl_repair_request_parts rrp on rrp.RRId =rr.RRId
LEFT JOIN tbl_vendors v1 on v1.VendorId=rrp.Manufacturer
LEFT JOIN tbl_customer_departments cd on cd.CustomerDepartmentId=rr.DepartmentId
LEFT JOIN tbl_customer_assets ca on ca.CustomerAssetId=rr.AssetId

LEFT JOIN tbl_quotes q on q.RRId=rr.RRId  and q.RRId>0 and q.Status In(1,2,4) and q.QuoteCustomerStatus In(1,2,3) and q.IsDeleted = 0 
LEFT JOIN tbl_invoice i on i.RRId=rr.RRId and i.RRId>0 AND i.IsDeleted = 0  AND i.Status!=${Constants.CONST_INV_STATUS_CANCELLED}
LEFT JOIN tbl_vendor_invoice vi on vi.RRId=rr.RRId and vi.RRId>0 and vi.IsDeleted = 0 
LEFT JOIN tbl_currencies as CURL  ON CURL.CurrencyCode = i.LocalCurrencyCode AND CURL.IsDeleted = 0 
LEFT JOIN tbl_currencies as CURLQ  ON CURLQ.CurrencyCode = q.LocalCurrencyCode AND CURLQ.IsDeleted = 0 
LEFT JOIN tbl_po po on po.RRId=rr.RRId and po.RRId>0  AND po.Status!=${Constants.CONST_PO_STATUS_CANCELLED} AND po.IsDeleted = 0 

LEFT JOIN tbl_sales_order s on s.RRId=rr.RRId   AND s.Status!=${Constants.CONST_SO_STATUS_CANCELLED}  AND s.IsDeleted = 0

LEFT JOIN tbl_repair_request_shipping_history rrsh ON rrsh.RRId=rr.RRId and rrsh.ShipFromIdentity=1 and 
rrsh.ShippingHistoryId = (SELECT ShippingHistoryId FROM tbl_repair_request_shipping_history
  WHERE RRId = rr.RRId and ShipFromIdentity=1 AND IsDeleted = 0 ORDER BY ShippingHistoryId DESC
  LIMIT 1) AND rrsh.IsDeleted = 0

  LEFT JOIN tbl_repair_request_shipping_history rrsh1 ON rrsh1.RRId=rr.RRId  and 
rrsh1.ShippingHistoryId = (SELECT ShippingHistoryId FROM tbl_repair_request_shipping_history
  WHERE RRId = rr.RRId AND IsDeleted = 0 ORDER BY ShippingHistoryId ASC
  LIMIT 1) AND rrsh1.IsDeleted = 0
  

where  rr.IsDeleted= 0 `;
  if (RRReportsModel.IdentityType == 0 && RRReportsModel.IsRestrictedCustomerAccess == 1 && RRReportsModel.MultipleCustomerIds != "") {
    query += ` and rr.CustomerId in(${RRReportsModel.MultipleCustomerIds}) `;
  }
  if (RRReportsModel.Manufacturer != "") {
    query += " and ( rrp.Manufacturer ='" + RRReportsModel.Manufacturer + "' ) ";
  }
  if (RRReportsModel.ManufacturerPartNo != "") {
    query += " and ( rrp.ManufacturerPartNo ='" + RRReportsModel.ManufacturerPartNo + "' ) ";
  }
  if (RRReportsModel.SerialNo != "") {
    query += " and ( rrp.SerialNo ='" + RRReportsModel.SerialNo + "' ) ";
  }
  if (RRReportsModel.Status != "") {
    query += " and ( rr.Status ='" + RRReportsModel.Status + "' ) ";
  }
  if (RRReportsModel.PODueDate != "") {
    query += " and  po.DueDate = '" + RRReportsModel.PODueDate + "'  ";
  }
  var Ids;
  if (RRReportsModel.CustomerId != "") {

    Ids = ``;
    for (let val of RRReportsModel.CustomerId) {
      Ids += val + `,`;
    }
    var CustomerIds = Ids.slice(0, -1);
    query += " and  rr.CustomerId IN (" + CustomerIds + " ) ";
  }
  if (RRReportsModel.CustomerPONo != "") {
    query += " and ( rr.CustomerPONo ='" + RRReportsModel.CustomerPONo + "' ) ";
  }
  if (RRReportsModel.SubStatusId != "") {
    query += " and rr.SubStatusId  = '" + RRReportsModel.SubStatusId + "'  ";
  }
  if (RRReportsModel.AssigneeUserId != "") {
    query += " and rr.AssigneeUserId  = '" + RRReportsModel.AssigneeUserId + "'  ";
  }
  if (RRReportsModel.RRPartLocationId != "") {
    query += " and rr.RRPartLocationId  = '" + RRReportsModel.RRPartLocationId + "'  ";
  }
  if (RRReportsModel.CustomerGroupId != "") {
    // query += " and (rr.CustomerId IN(SELECT CustomerId FROM tbl_customers  WHERE CustomerGroupId IN (" + RRReportsModel.CustomerGroupId + "))) ";
    query += ` and c.CustomerGroupId in(` + RRReportsModel.CustomerGroupId + `)`;
  }
  if (RRReportsModel.VendorId != "") {
    Ids = ``;
    for (let val of RRReportsModel.VendorId) {
      Ids += val + `,`;
    }
    var VendorIds = Ids.slice(0, -1);
    query += " and  rr.VendorId IN (" + VendorIds + " ) ";
  }
  var i = 0;
  if (RRReportsModel.order.length > 0) {
    order += " ORDER BY ";
  }
  for (i = 0; i < RRReportsModel.order.length; i++) {
    if (RRReportsModel.order[i].column != "" || RRReportsModel.order[i].column == "0")// 0 is equal to ""
    {
      switch (RRReportsModel.columns[RRReportsModel.order[i].column].name) {
        case "SONo":
          order += " ifnull(rr.CustomerSONo,'') " + RRReportsModel.order[i].dir + ",";
          break;
        case "PONo":
          order += " ifnull(rr.VendorPONo,'') " + RRReportsModel.order[i].dir + ",";
          break;
        case "VendorInvoiceNo":
          order += " ifnull(rr.VendorInvoiceNo,'') " + RRReportsModel.order[i].dir + ",";
          break;
        case "InvoiceNo":
          order += " ifnull(rr.CustomerInvoiceNo,'') " + RRReportsModel.order[i].dir + ",";
          break;
        case "RRNo":
          order += " rr.RRNo " + RRReportsModel.order[i].dir + ",";
          break;
        case "CustomerId":
          order += " rr.CustomerId " + RRReportsModel.order[i].dir + ",";
          break;
        case "SerialNo":
          order += " rrp.SerialNo " + RRReportsModel.order[i].dir + ",";
          break;
        default:
          order += " " + RRReportsModel.columns[RRReportsModel.order[i].column].name + " " + RRReportsModel.order[i].dir + ",";

      }
    }
  }
  order = order.slice(0, -1);
  // var tempquery = query.slice(0, -1);
  // var query = tempquery;
  var Countquery = recordfilterquery + query;
  if (RRReportsModel.start != "-1" && RRReportsModel.length != "-1") {
    limit += " LIMIT " + RRReportsModel.start + "," + (RRReportsModel.length);
  }
  query = selectquery + query + order + limit;

  //   LEFT JOIN tbl_customers c on c.CustomerId = rr.CustomerId
  //   LEFT JOIN tbl_vendors v on v.VendorId=rr.VendorId
  //   LEFT JOIN tbl_repair_request_vendors rrv on rrv.VendorId=rr.VendorId AND rrv.Status!=3 AND rrv.RRId = rr.RRId   AND rrv.IsDeleted = 0
  //   LEFT JOIN tbl_repair_request_parts rrp on rrp.RRId =rr.RRId
  //   LEFT JOIN tbl_vendors v1 on v1.VendorId=rrp.Manufacturer
  //   LEFT JOIN tbl_customer_departments cd on cd.CustomerDepartmentId=rr.DepartmentId
  //   LEFT JOIN tbl_customer_assets ca on ca.CustomerAssetId=rr.AssetId

  //   LEFT JOIN tbl_invoice i on i.RRId =rr.RRId and i.IsDeleted = 0 
  //   LEFT JOIN LATERAL (SELECT *
  //                    FROM tbl_quotes
  //                    WHERE RRId = rr.RRId and Status='${Constants.CONST_QUOTE_STATUS_APPROVED}' AND IsDeleted = 0
  //                    LIMIT 1) as Appq
  //    ON Appq.RRId=rr.RRId and Appq.Status='${Constants.CONST_QUOTE_STATUS_APPROVED}' AND Appq.IsDeleted = 0

  //  LEFT JOIN tbl_vendor_quote Appvq on Appvq.QuoteId=Appq.QuoteId AND Appvq.RRId = rr.RRId  

  //   LEFT JOIN LATERAL (SELECT *
  //                    FROM tbl_quotes
  //                    WHERE RRId = rr.RRId and Status!='${Constants.CONST_QUOTE_STATUS_APPROVED}' and Status!='${Constants.CONST_QUOTE_STATUS_QUOTED}'  and Status!='${Constants.CONST_QUOTE_STATUS_CANCELLED}'   
  //                     AND IsDeleted = 0
  //                    ORDER BY Status DESC LIMIT 1) as Otherq
  //    ON Otherq.RRId=rr.RRId and Otherq.Status!='${Constants.CONST_QUOTE_STATUS_APPROVED}' and Otherq.Status!='${Constants.CONST_QUOTE_STATUS_QUOTED}' and Otherq.Status!='${Constants.CONST_QUOTE_STATUS_CANCELLED}' AND Otherq.IsDeleted = 0

  //  LEFT JOIN tbl_vendor_quote Othervq on Othervq.QuoteId=Otherq.QuoteId AND Othervq.RRId = rr.RRId

  //   LEFT JOIN tbl_sales_order s  on s.RRId=rr.RRId AND s.Status != 3 AND s.IsDeleted = 0
  //   where  rr.IsDeleted= 0 `;

  var TotalCountQuery = `SELECT Count(rr.RRId) as TotalCount 
   FROM tbl_repair_request rr
LEFT JOIN tbl_customers c on c.CustomerId = rr.CustomerId
LEFT JOIN tbl_vendors v on v.VendorId=rr.VendorId
LEFT JOIN tbl_repair_request_vendors rrv on rrv.VendorId=rr.VendorId AND rrv.Status!=3 AND rrv.RRId = rr.RRId   AND rrv.IsDeleted = 0
LEFT JOIN tbl_repair_request_parts rrp on rrp.RRId =rr.RRId
LEFT JOIN tbl_vendors v1 on v1.VendorId=rrp.Manufacturer
LEFT JOIN tbl_customer_departments cd on cd.CustomerDepartmentId=rr.DepartmentId
LEFT JOIN tbl_customer_assets ca on ca.CustomerAssetId=rr.AssetId

LEFT JOIN tbl_quotes q on q.RRId=rr.RRId  and q.RRId>0 and q.Status In(1,2,4) and q.QuoteCustomerStatus In(1,2,3) and q.IsDeleted = 0 
LEFT JOIN tbl_invoice i on i.RRId=rr.RRId and i.RRId>0 AND i.IsDeleted = 0  AND i.Status!=${Constants.CONST_INV_STATUS_CANCELLED}
LEFT JOIN tbl_vendor_invoice vi on vi.RRId=rr.RRId and vi.RRId>0 and vi.IsDeleted = 0 
LEFT JOIN tbl_currencies as CURL  ON CURL.CurrencyCode = i.LocalCurrencyCode AND CURL.IsDeleted = 0 
LEFT JOIN tbl_currencies as CURLQ  ON CURLQ.CurrencyCode = q.LocalCurrencyCode AND CURLQ.IsDeleted = 0 
LEFT JOIN tbl_po po on po.RRId=rr.RRId and po.RRId>0  AND po.Status!=${Constants.CONST_PO_STATUS_CANCELLED} AND po.IsDeleted = 0 

LEFT JOIN tbl_sales_order s on s.RRId=rr.RRId  AND s.Status!=${Constants.CONST_SO_STATUS_CANCELLED}  AND s.IsDeleted = 0
where  rr.IsDeleted= 0 `;
  if (RRReportsModel.IdentityType == 0 && RRReportsModel.IsRestrictedCustomerAccess == 1 && RRReportsModel.MultipleCustomerIds != "") {
    TotalCountQuery += ` and rr.CustomerId in(${RRReportsModel.MultipleCustomerIds}) `;
  }
  //console.log("query-OpenOrderBySupplierReport-1 = " + query);
  //console.log("Countquery = " + Countquery);
  //console.log("TotalCountQuery = " + TotalCountQuery);
  async.parallel([
    function (result) { con.query(query, result) },
    function (result) { con.query(Countquery, result) },
    function (result) { con.query(TotalCountQuery, result) }
  ],
    function (err, results) {
      if (err) {
        console.log("err" + err)
        return result(err, null);
      }

      result(null, {
        data: results[0][0], recordsFiltered: results[1][0][0].recordsFiltered,
        recordsTotal: results[2][0][0].TotalCount, draw: RRReportsModel.draw
      });
      return;
    });
};

// Get OpenOrderBySupplierReportCount
RRReportsModel.DanaOpenOrderBySupplierReportCount = (RRReportsModel, result) => {
  var TotalCountQuery = `SELECT Count(rr.RRId) as TotalCount 
   FROM tbl_repair_request rr
LEFT JOIN tbl_customers c on c.CustomerId = rr.CustomerId
LEFT JOIN tbl_vendors v on v.VendorId=rr.VendorId
LEFT JOIN tbl_repair_request_vendors rrv on rrv.VendorId=rr.VendorId AND rrv.Status!=3 AND rrv.RRId = rr.RRId   AND rrv.IsDeleted = 0
LEFT JOIN tbl_repair_request_parts rrp on rrp.RRId =rr.RRId
LEFT JOIN tbl_vendors v1 on v1.VendorId=rrp.Manufacturer
LEFT JOIN tbl_customer_departments cd on cd.CustomerDepartmentId=rr.DepartmentId
LEFT JOIN tbl_customer_assets ca on ca.CustomerAssetId=rr.AssetId

LEFT JOIN tbl_quotes q on q.RRId=rr.RRId  and q.RRId>0 and q.Status In(1,2,4) and q.QuoteCustomerStatus In(1,2,3) and q.IsDeleted = 0 
LEFT JOIN tbl_invoice i on i.RRId=rr.RRId and i.RRId>0 AND i.IsDeleted = 0  AND i.Status!=${Constants.CONST_INV_STATUS_CANCELLED}
LEFT JOIN tbl_vendor_invoice vi on vi.RRId=rr.RRId and vi.RRId>0 and vi.IsDeleted = 0 
LEFT JOIN tbl_currencies as CURL  ON CURL.CurrencyCode = i.LocalCurrencyCode AND CURL.IsDeleted = 0 
LEFT JOIN tbl_currencies as CURLQ  ON CURLQ.CurrencyCode = q.LocalCurrencyCode AND CURLQ.IsDeleted = 0 
LEFT JOIN tbl_po po on po.RRId=rr.RRId and po.RRId>0  AND po.Status!=${Constants.CONST_PO_STATUS_CANCELLED} AND po.IsDeleted = 0 

LEFT JOIN tbl_sales_order s on s.RRId=rr.RRId  AND s.Status!=${Constants.CONST_SO_STATUS_CANCELLED}  AND s.IsDeleted = 0
where  rr.IsDeleted= 0 `;
  if (RRReportsModel.IdentityType == 0 && RRReportsModel.IsRestrictedCustomerAccess == 1 && RRReportsModel.MultipleCustomerIds != "") {
    TotalCountQuery += ` and rr.CustomerId in(${RRReportsModel.MultipleCustomerIds}) `;
  }
  async.parallel([
    function (result) { con.query(TotalCountQuery, result) }
  ],
    function (err, results) {
      if (err) {
        return result(err, null);
      }

      result(null, {
        recordsTotal: results[0][0][0].TotalCount
      });
      return;
    });
}
//Get OpenOrderBySupplierReport ExportToExcel
RRReportsModel.DanaOpenOrderBySupplierReportExportToExcel = (reqBody, result) => {

  var Ids = ``;
  for (let val of reqBody.RRReports) {
    Ids += val.RRId + `,`;
  }
  var RRIds = Ids.slice(0, -1);
// if(rrsh.ShipFromIdentity = 1, DATE_FORMAT(rrsh.ShipDate,'%m/%d/%Y'), '-') as ShipFromCustomer,
  var query = ``;
  query = ` SELECT 
  rr.RRNo,v1.VendorName as Manufacturer,rrp.ManufacturerPartNo,rrp.SerialNo,rrp.Description,
  CASE rr.Status 
WHEN 0 THEN '${Constants.array_rr_status[0]}'
WHEN 1 THEN '${Constants.array_rr_status[1]}' 
WHEN 2 THEN '${Constants.array_rr_status[2]}' 
WHEN 3 THEN '${Constants.array_rr_status[3]}' 
WHEN 4 THEN '${Constants.array_rr_status[4]}' 
WHEN 5 THEN '${Constants.array_rr_status[5]}' 
WHEN 6 THEN '${Constants.array_rr_status[6]}' 
WHEN 7 THEN '${Constants.array_rr_status[7]}' 
WHEN 8 THEN '${Constants.array_rr_status[8]}'
ELSE '-'	end StatusName,

rrsh1.ShipFromName as StartLocation, rrsh1.ShipToName as FirstShipToName, DATE_FORMAT(rrsh1.ShipDate,'%m/%d/%Y') as FirstShipDate,

DATE_FORMAT(q.QuoteDate,'%m/%d/%Y') as QuoteDate,
DATE_FORMAT(q.ApprovedDate,'%m/%d/%Y') as ApprovedDate, DATE_FORMAT(s.DueDate,'%m/%d/%Y') as SODueDate,
CONCAT(IFNULL(CURL.CurrencySymbol,CURLQ.CurrencySymbol),' ',FORMAT(IF(i.GrandTotal>=0,i.GrandTotal,If(q.GrandTotal>=0,q.GrandTotal,'TBD')),2)) RepairPrice,rr.CustomerPONo, 
  (select CONCAT(ReferenceLabelName,": ",ReferenceValue) from tbl_repair_request_customer_ref rrcr Left Join tbl_cutomer_reference_labels cl Using(CReferenceId)
where rrcr.IsDeleted = 0 AND RRId=rr.RRId order by 'Rank' limit 0,1) as CustomerReference1,
(select CONCAT(ReferenceLabelName,": ",ReferenceValue) from tbl_repair_request_customer_ref rrcr Left Join tbl_cutomer_reference_labels cl Using(CReferenceId)
where rrcr.IsDeleted = 0 AND RRId=rr.RRId order by 'Rank' limit 1,1) as CustomerReference2,
(select CONCAT(ReferenceLabelName,": ",ReferenceValue) from tbl_repair_request_customer_ref rrcr Left Join tbl_cutomer_reference_labels cl Using(CReferenceId)
where rrcr.IsDeleted = 0 AND RRId=rr.RRId order by 'Rank' limit 2,1) as CustomerReference3,

(select MAX(DATE_FORMAT(Created,'%m/%d/%Y') )  from tbl_repair_request_followup where IsDeleted=0 and RRId=rr.RRId) as MostRecentFollowUpDate

FROM tbl_repair_request rr
LEFT JOIN tbl_customers c on c.CustomerId = rr.CustomerId
LEFT JOIN tbl_vendors v on v.VendorId=rr.VendorId
LEFT JOIN tbl_repair_request_vendors rrv on rrv.VendorId=rr.VendorId AND rrv.Status!=3 AND rrv.RRId = rr.RRId   AND rrv.IsDeleted = 0
LEFT JOIN tbl_repair_request_parts rrp on rrp.RRId =rr.RRId
LEFT JOIN tbl_vendors v1 on v1.VendorId=rrp.Manufacturer
LEFT JOIN tbl_customer_departments cd on cd.CustomerDepartmentId=rr.DepartmentId
LEFT JOIN tbl_customer_assets ca on ca.CustomerAssetId=rr.AssetId

LEFT JOIN tbl_quotes q on q.RRId=rr.RRId  and q.RRId>0 and q.Status In(1,2,4) and q.QuoteCustomerStatus In(1,2,3) and q.IsDeleted = 0 
LEFT JOIN tbl_invoice i on i.RRId=rr.RRId and i.RRId>0 AND i.IsDeleted = 0  AND i.Status!=${Constants.CONST_INV_STATUS_CANCELLED}
LEFT JOIN tbl_vendor_invoice vi on vi.RRId=rr.RRId and vi.RRId>0 and vi.IsDeleted = 0 
LEFT JOIN tbl_currencies as CURL  ON CURL.CurrencyCode = i.LocalCurrencyCode AND CURL.IsDeleted = 0 
LEFT JOIN tbl_currencies as CURLQ  ON CURLQ.CurrencyCode = q.LocalCurrencyCode AND CURLQ.IsDeleted = 0 
LEFT JOIN tbl_po po on po.RRId=rr.RRId and po.RRId>0  AND po.Status!=${Constants.CONST_PO_STATUS_CANCELLED} AND po.IsDeleted = 0 

LEFT JOIN tbl_sales_order s on s.RRId=rr.RRId AND s.Status != 3 AND s.IsDeleted = 0

LEFT JOIN tbl_repair_request_shipping_history rrsh ON rrsh.RRId=rr.RRId and rrsh.ShipFromIdentity=1 and 
rrsh.ShippingHistoryId = (SELECT ShippingHistoryId FROM tbl_repair_request_shipping_history
  WHERE RRId = rr.RRId and ShipFromIdentity=1 AND IsDeleted = 0 ORDER BY ShippingHistoryId DESC
  LIMIT 1) AND rrsh.IsDeleted = 0

  LEFT JOIN tbl_repair_request_shipping_history rrsh1 ON rrsh1.RRId=rr.RRId  and 
rrsh1.ShippingHistoryId = (SELECT ShippingHistoryId FROM tbl_repair_request_shipping_history
  WHERE RRId = rr.RRId AND IsDeleted = 0 ORDER BY ShippingHistoryId ASC
  LIMIT 1) AND rrsh1.IsDeleted = 0

where  rr.IsDeleted= 0 `;
  if (reqBody.IdentityType == 0 && reqBody.IsRestrictedCustomerAccess == 1 && reqBody.MultipleCustomerIds != "") {
    query += ` and rr.CustomerId in(${reqBody.MultipleCustomerIds}) `;
  }
  if (reqBody.Manufacturer != "") {
    query += " and ( rrp.Manufacturer ='" + reqBody.Manufacturer + "' ) ";
  }
  if (reqBody.ManufacturerPartNo != "") {
    query += " and ( rrp.ManufacturerPartNo ='" + reqBody.ManufacturerPartNo + "' ) ";
  }
  if (reqBody.SerialNo != "") {
    query += " and ( rr.SerialNo ='" + reqBody.SerialNo + "' ) ";
  }
  if (reqBody.Status != "") {
    query += " and ( rr.Status ='" + reqBody.Status + "' ) ";
  }
  if (reqBody.SubStatusId != "") {
    query += " and rr.SubStatusId  = '" + reqBody.SubStatusId + "'  ";
  }
  if (reqBody.AssigneeUserId != "") {
    query += " and rr.AssigneeUserId  = '" + reqBody.AssigneeUserId + "'  ";
  }
  if (reqBody.RRPartLocationId != "") {
    query += " and rr.RRPartLocationId  = '" + reqBody.RRPartLocationId + "'  ";
  }
  if (reqBody.PODueDate != "") {
    query += " and  po.DueDate = '" + reqBody.PODueDate + "'  ";
  }
  if (reqBody.CustomerGroupId != "") {
    // query += " and (rr.CustomerId IN(SELECT CustomerId FROM tbl_customers  WHERE CustomerGroupId IN (" + reqBody.CustomerGroupId + "))) ";
    query += ` and c.CustomerGroupId in(` + reqBody.CustomerGroupId + `)`;
  }
  var Ids;
  if (reqBody.CustomerId != "") {
    Ids = ``;
    for (let val of reqBody.CustomerId) {
      Ids += val + `,`;
    }
    var CustomerIds = Ids.slice(0, -1);
    query += " and  rr.CustomerId IN (" + CustomerIds + ") ";
  }
  if (reqBody.CustomerPONo != "") {
    query += " and ( rr.CustomerPONo ='" + reqBody.CustomerPONo + "' ) ";
  }
  if (reqBody.VendorId != "") {
    Ids = ``;
    for (let val of reqBody.VendorId) {
      Ids += val + `,`;
    }
    var VendorIds = Ids.slice(0, -1);
    query += " and  rr.VendorId IN (" + VendorIds + " ) ";
  }
  if (RRIds != '' && RRIds != null) {
    query += ` and rr.RRId in(` + RRIds + `)`;
  }
  // console.log("SQL=" + query);
  con.query(query, (err, res) => {
    if (err) {
      return result(err, null);
    }
    return result(null, { ExcelData: res });
  });
};


module.exports = RRReportsModel;