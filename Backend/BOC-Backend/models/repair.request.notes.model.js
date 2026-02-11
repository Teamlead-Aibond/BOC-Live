/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
const con = require("../helper/db.js");
var cDateTime = require("../utils/generic.js");
const Constants = require("../config/constants.js");
var async = require('async');
const { getLogInUserId, getLogInIdentityId, getLogInIdentityType, getLogInIsRestrictedCustomerAccess, getLogInMultipleCustomerIds, getLogInMultipleAccessIdentityIds } = require("../helper/common.function.js");
const RRCustomerRef = require("../models/cutomer.reference.labels.model.js");
const objModel = function FuncName(RepairRequest) {
  this.NotesId = RepairRequest.NotesId;
  this.RRId = RepairRequest.RRId ? RepairRequest.RRId : 0;
  this.NotesType = RepairRequest.NotesType ? RepairRequest.NotesType : 0;
  this.IdentityType = RepairRequest.IdentityType ? RepairRequest.IdentityType : 0;
  this.IdentityId = RepairRequest.IdentityId ? RepairRequest.IdentityId : 0;
  this.Notes = RepairRequest.Notes ? RepairRequest.Notes : '';
  this.FileName = RepairRequest.FileName ? RepairRequest.FileName : '';
  this.FileUrl = RepairRequest.FileUrl ? RepairRequest.FileUrl : '';
  this.FileSize = RepairRequest.FileSize ? RepairRequest.FileSize : '';
  this.FileMimeType = RepairRequest.FileMimeType ? RepairRequest.FileMimeType : '';
  this.Created = cDateTime.getDateTime();
  this.Modified = cDateTime.getDateTime();
  const TokenUserId = global.authuser.UserId ? global.authuser.UserId : 0;
  this.CreatedBy = (RepairRequest.authuser && RepairRequest.authuser.UserId) ? RepairRequest.authuser.UserId : TokenUserId;
  this.ModifiedBy = (RepairRequest.authuser && RepairRequest.authuser.UserId) ? RepairRequest.authuser.UserId : TokenUserId;
  this.NotesTypeName = RepairRequest.NotesTypeName ? RepairRequest.NotesTypeName : '';

  this.QuoteApprovedBy = RepairRequest.QuoteApprovedBy ? RepairRequest.QuoteApprovedBy : '';
  this.IsSOCreated = RepairRequest.IsSOCreated ? RepairRequest.IsSOCreated : '';
  this.CustomerInvoiceId = RepairRequest.CustomerInvoiceId ? RepairRequest.CustomerInvoiceId : '';
  this.Status = RepairRequest.Status ? RepairRequest.Status : '';
  this.PartId = RepairRequest.PartId ? RepairRequest.PartId : '';
  this.VendorId = RepairRequest.VendorId ? RepairRequest.VendorId : '';
  this.RRIdVendorPO = RepairRequest.RRIdVendorPO ? RepairRequest.RRIdVendorPO : '';
  this.RRIdCustomerPO = RepairRequest.RRIdCustomerPO ? RepairRequest.RRIdCustomerPO : '';
  this.RRIdCustomerSO = RepairRequest.RRIdCustomerSO ? RepairRequest.RRIdCustomerSO : '';
  this.MobileVerify = RepairRequest.MobileVerify ? RepairRequest.MobileVerify : '';
  this.DueDatePassed = RepairRequest.DueDatePassed ? RepairRequest.DueDatePassed : '';
  this.SODueDatePassed = RepairRequest.SODueDatePassed ? RepairRequest.SODueDatePassed : '';
  this.PODueDatePassed = RepairRequest.PODueDatePassed ? RepairRequest.PODueDatePassed : '';
  this.InvDueDatePassed = RepairRequest.InvDueDatePassed ? RepairRequest.InvDueDatePassed : '';
  this.DueDateNears = RepairRequest.DueDateNears ? RepairRequest.DueDateNears : '';

  this.SODueDateNears = RepairRequest.SODueDateNears ? RepairRequest.SODueDateNears : '';
  this.PODueDateNears = RepairRequest.PODueDateNears ? RepairRequest.PODueDateNears : '';
  this.InvDueDateNears = RepairRequest.InvDueDateNears ? RepairRequest.InvDueDateNears : '';
  this.IsPartsDeliveredToCustomer = RepairRequest.IsPartsDeliveredToCustomer ? RepairRequest.IsPartsDeliveredToCustomer : '';
  this.PartNo = RepairRequest.PartNo ? RepairRequest.PartNo : '';
  this.ShippingStatusCategory = RepairRequest.ShippingStatusCategory ? RepairRequest.ShippingStatusCategory : '';
  this.ReferenceValue = RepairRequest.ReferenceValue ? RepairRequest.ReferenceValue : '';
  this.StatusChangeFrom = RepairRequest.StatusChangeFrom ? RepairRequest.StatusChangeFrom : '';
  this.StatusChangeTo = RepairRequest.StatusChangeTo ? RepairRequest.StatusChangeTo : '';
  this.StatusChangeId = RepairRequest.StatusChangeId ? RepairRequest.StatusChangeId : '';
  this.CustomerPONo = RepairRequest.CustomerPONo ? RepairRequest.CustomerPONo : '';
  this.RRNo = RepairRequest.RRNo ? RepairRequest.RRNo : '';
  this.ShippingStatusCategory = RepairRequest.ShippingStatusCategory ? RepairRequest.ShippingStatusCategory : '';
  this.ShippingStatus = RepairRequest.ShippingStatus ? RepairRequest.ShippingStatus : '';
  this.RRDescription = RepairRequest.RRDescription ? RepairRequest.RRDescription : '';
  this.SerialNo = RepairRequest.SerialNo ? RepairRequest.SerialNo : '';
  this.VendorInvoiceId = RepairRequest.VendorInvoiceId ? RepairRequest.VendorInvoiceId : '';
  this.CustomerPartNo1 = RepairRequest.CustomerPartNo1 ? RepairRequest.CustomerPartNo1 : '';
  this.IsRushRepair = RepairRequest.IsRushRepair ? RepairRequest.IsRushRepair : '';
  this.IsRepairTag = RepairRequest.IsRepairTag ? RepairRequest.IsRepairTag : '';
  this.CustomerGroupId = RepairRequest.CustomerGroupId ? RepairRequest.CustomerGroupId : '';
  this.authuser = RepairRequest.authuser ? RepairRequest.authuser : {};

  // Code used for Avoid insert duplicate record


  // For Server Side Search 
  this.start = RepairRequest.start;
  this.length = RepairRequest.length;
  this.search = RepairRequest.search;
  this.sortCol = RepairRequest.sortCol;
  this.sortDir = RepairRequest.sortDir;
  this.sortColName = RepairRequest.sortColName;
  this.order = RepairRequest.order;
  this.columns = RepairRequest.columns;
  this.draw = RepairRequest.draw;
  this.Status = RepairRequest.Status ? RepairRequest.Status : '';
  this.FromDate = RepairRequest.FromDate ? RepairRequest.FromDate : '';
  this.ToDate = RepairRequest.ToDate ? RepairRequest.ToDate : '';
  this.Number1 = RepairRequest.Number1 ? RepairRequest.Number1 : 0;
  this.Number2 = RepairRequest.Number2 ? RepairRequest.Number2 : 0;
  this.Current = RepairRequest.Current ? RepairRequest.Current : 0;
  this.CustomerId = RepairRequest.CustomerId ? RepairRequest.CustomerId : 0;
  this.AssigneeUserId = RepairRequest.AssigneeUserId ? RepairRequest.AssigneeUserId : 0;
  this.SubStatusId = RepairRequest.SubStatusId ? RepairRequest.SubStatusId : 0;
  this.RRPartLocationId = RepairRequest.RRPartLocationId ? RepairRequest.RRPartLocationId : 0;

  this.CreatedByLocation = RepairRequest.CreatedByLocation ? RepairRequest.CreatedByLocation : 0;

};


objModel.getRRListByServerSide = (RepairRequest, result) => {

  var query = "";
  var selectquery = `SELECT  
rr.RRNo,rr.CustomerInvoiceNo InvoiceNo,rr.VendorPONo PONo,rr.CustomerSONo SONo, rr.VendorPOId,rr.CustomerSOId,rr.CustomerInvoiceId,IFNULL(ca.CustomerAssetName,'') as CustomerAssetName,rr.CreatedByLocation,rr.IsActive,rr.SubStatusId,rr.AssigneeUserId,rr.RRPartLocationId,(select ModifiedByName from tbl_repair_request_assignee_history where RRId=rr.RRId  ORDER BY AssigneeHistoryId DESC LIMIT 1) as SubTaskAssignedBy,
IF(i.GrandTotal>=0,CONCAT('$',' ',i.GrandTotal),
If(q.GrandTotal >=0,CONCAT('$',' ',q.GrandTotal),'TBD')) as  InvoiceAmountOrQuoteAmount,
ifnull(IF(i.GrandTotal>=0,CONCAT('$',' ',ROUND(i.GrandTotal,2)),If(s.GrandTotal>=0,CONCAT('$',' ',ROUND(s.GrandTotal,2)),
if(q.GrandTotal>=0,CONCAT('$',' ',ROUND(q.GrandTotal,2)),'TBD'))),'') as RepairPrice,rr.CreatedByLocation,ss.SubStatusName, CONCAT(a.FirstName,' ', a.LastName) as AssigneeName, l.RRPartLocation as RRPartLocationName,DATE_FORMAT(po.DueDate,'%m/%d/%Y') as PODueDate,
rr.Price,
rr.PartId,
rr.PartNo,
rrp.SerialNo,
c.CompanyName,
VendorName,
'' as Invoice,
'' as StatusChangeFrom,
'' as StatusChangeTo ,
'' as StatusChangeId,
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
 ELSE '-'	end StatusName, rr.Status,
VendorPONo,
DATE_FORMAT(rr.VendorPODueDate,'%m/%d/%Y') as VendorPODueDate,
RRDescription,
CustomerSONo,rr.CustomerBlanketPOId,
DATE_FORMAT(rr.CustomerSODueDate,'%m/%d/%Y') as CustomerSODueDate,
DATE_FORMAT(rr.CustomerInvoiceDueDate,'%m/%d/%Y') as CustomerInvoiceDueDate,
CustomerPartNo1,
rr.CustomerPONo,
VendorInvoiceNo, '' as QuoteApprovedBy, '' as IsSOCreated,
'' as ReferenceValue,
Case IsWarrantyRecovery 
WHEN 1 THEN '${Constants.array_IsWarrantyRepair[1]}'
WHEN 2 THEN '${Constants.array_IsWarrantyRepair[2]}'
ELSE '-'	end IsWarrantyRecovery,
Case IsRushRepair 
WHEN 0 THEN '${Constants.array_true_false[0]}'
WHEN 1 THEN '${Constants.array_true_false[1]}'
ELSE '-'	end IsRushRepair,
Case IsRepairTag 
WHEN 0 THEN '${Constants.array_true_false[0]}'
WHEN 1 THEN '${Constants.array_true_false[1]}'
ELSE '-'	end IsRepairTag,
rr.RRId,VendorInvoiceId,CustomerInvoiceId,
(select REPLACE(ImagePath,'${Constants.CONST_BUCKET_PATH_SUBDOMAIN}','${Constants.CONST_BUCKET_PATH_AWS_DOMAIN}') as ImagePath from tbl_repair_request_images where  IsDeleted = 0 AND RRId=rr.RRId ORDER BY IsPrimaryImage DESC,RRImageId ASC limit 0,1) as RRImage,
DATE_FORMAT(rr.Created, '%m/%d/%Y') as Created,
ContactPhone,ContactEmail,AddedFrom,'' as MobileVerify,
IF(rr.CustomerSODueDate <= CURRENT_DATE OR rr.VendorPODueDate <= CURRENT_DATE OR rr.CustomerInvoiceDueDate <= CURRENT_DATE, "1", "0") as DueDatePassed,
'' as SODueDatePassed,
'' as PODueDatePassed,
'' as InvDueDatePassed, '' as IsPartsDeliveredToCustomer,
IF((DATEDIFF(rr.CustomerSODueDate,CURDATE())<=2 and DATEDIFF(rr.CustomerSODueDate,CURDATE()>0)) OR (DATEDIFF(rr.VendorPODueDate,CURDATE())<=2 and DATEDIFF(rr.CustomerSODueDate,CURDATE())>0) OR (DATEDIFF(rr.CustomerInvoiceDueDate,CURDATE())<=2 and DATEDIFF(rr.CustomerSODueDate,CURDATE())>0), "1", "0") as DueDateNears,
'' as SODueDateNears,
'' as PODueDateNears,
'' as InvDueDateNears, rr.CustomerId, rr.VendorId,'' as RRIdVendorPO,'' as RRIdCustomerPO,'' as RRIdCustomerSO,'' ShippingStatusCategory,'' ShippingStatus,
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
(SELECT ConsolidateInvoiceId FROM tbl_invoice_consolidate_detail where InvoiceId=i.InvoiceId AND IsDeleted = 0 LIMIT 1) as ConsolidateInvoiceId,
   IF((SELECT ConsolidateInvoiceId FROM tbl_invoice_consolidate_detail where InvoiceId=i.InvoiceId AND IsDeleted = 0 LIMIT 1)>0, true, false) as Consolidated,c.CustomerGroupId`;
  recordfilterquery = `Select count(rr.RRId) as recordsFiltered `;

  query = query + ` FROM tbl_repair_request rr
LEFT JOIN tbl_customers c on c.CustomerId = rr.CustomerId  
LEFT JOIN tbl_quotes q on q.RRId=rr.RRId and q.RRId>0 and q.Status In(1,2,4) and q.QuoteCustomerStatus In(1,2,3) and q.IsDeleted = 0 
LEFT JOIN tbl_vendors v on v.VendorId=rr.VendorId 
LEFT JOIN tbl_repair_request_parts rrp on rrp.RRId =rr.RRId 
LEFT JOIN tbl_customer_assets ca on ca.CustomerAssetId=rr.AssetId  
LEFT JOIN tbl_po as po ON po.POId = rr.VendorPOId and po.IsDeleted=0
LEFT JOIN tbl_sales_order as s ON s.SOId = rr.CustomerSOId  and s.IsDeleted = 0
LEFT JOIN tbl_invoice as i ON i.InvoiceId = rr.CustomerInvoiceId AND i.IsDeleted = 0
LEFT JOIN tbl_users a ON a.UserId=rr.AssigneeUserId
LEFT JOIN tbl_repair_request_substatus ss ON ss.SubStatusId=rr.SubStatusId
LEFT JOIN tbl_repair_request_part_location l ON l.RRPartLocationId=rr.RRPartLocationId
where  rr.IsDeleted= 0 `;

  var TokenIdentityType = getLogInIdentityType(RepairRequest);
  var IsRestrictedCustomerAccess = getLogInIsRestrictedCustomerAccess(RepairRequest);
  var MultipleCustomerIds = getLogInMultipleCustomerIds(RepairRequest);


  if (RepairRequest.AssigneeUserId && RepairRequest.AssigneeUserId > 0) {
    query += ` and rr.AssigneeUserId = ${RepairRequest.AssigneeUserId} `;
  }
  if (RepairRequest.Status != '') {
    var DateRange = ''; var Status = '';

    if (RepairRequest.Status == "Web")
      Status += ` and Status IN (0) and AddedFrom = 0 `;
    else if (RepairRequest.Status == "Mobile")
      Status += ` and Status IN (0) and AddedFrom = 1 `;
    else
      Status += ` and Status IN (` + RepairRequest.Status + `)  `;

    if (RepairRequest.FromDate != '' && RepairRequest.ToDate != '') {
      DateRange += ` AND DATE(Created) BETWEEN '${RepairRequest.FromDate}' AND '${RepairRequest.ToDate}' `
    }
    query += `and rr.RRId IN ( Select RRId from tbl_repair_request where IsDeleted=0 ${Status} ${DateRange} )  `;
  }

  if (RepairRequest.Number1 > 0 || RepairRequest.Number2 > 0 || RepairRequest.Current > 0) {

    query += `and rr.RRId IN ( Select rrsh.RRId
    FROM tbl_repair_request_status_history rrsh
    LEFT JOIN tbl_repair_request as RR ON RR.RRId = rrsh.RRId AND RR.Status = ${RepairRequest.Status}  AND RR.IsDeleted = 0
    where RR.RRId = rrsh.RRId AND rrsh.IsDeleted=0 and HistoryId = (SELECT MAX(HistoryId) FROM tbl_repair_request_status_history rrsh1 where
    rrsh1.HistoryStatus =${RepairRequest.Status} AND RR.RRId = rrsh1.RRId  LIMIT 1)  `;
    if (RepairRequest.Number2 > 0) {
      query += `and  DATEDIFF(CURDATE(),rrsh.Created)>=${RepairRequest.Number1} and DATEDIFF(CURDATE(),rrsh.Created)<= ${RepairRequest.Number2}) `;
    }
    else if (RepairRequest.Current > 0) {
      query += `and DATEDIFF(CURDATE(),rrsh.Created)< ${RepairRequest.Current})`;
    }
    else if (RepairRequest.Number2 <= 0) {
      query += `and DATEDIFF(CURDATE(),rrsh.Created)> ${RepairRequest.Number1})`;
    }
  }
  if (TokenIdentityType == 0 && IsRestrictedCustomerAccess == 1 && MultipleCustomerIds != "") {
    query += ` and rr.CustomerId in(${MultipleCustomerIds}) `;
  }
  query += `  ${RepairRequest.CustomerId == 0 ? '' : `  And rr.CustomerId in (` + RepairRequest.CustomerId + `)  `} `;
  query += `  ${RepairRequest.CreatedByLocation == 0 ? '' : `  And rr.CreatedByLocation in (` + RepairRequest.CreatedByLocation + `)  `}  `;

  if (RepairRequest.search.value != '') {

    query = query + ` and ( rr.RRNo LIKE '%${RepairRequest.search.value}%'
     or rr.PartNo LIKE '%${RepairRequest.search.value}%' 
     or rrp.SerialNo LIKE '%${RepairRequest.search.value}%' 
    or c.CompanyName LIKE '%${RepairRequest.search.value}%' 
    or VendorName LIKE '%${RepairRequest.search.value}%'

    or CustomerSONo LIKE '%${RepairRequest.search.value}%'
    or rr.CustomerPONo LIKE '%${RepairRequest.search.value}%'
    or VendorPONo LIKE '%${RepairRequest.search.value}%'
    or VendorInvoiceNo LIKE '%${RepairRequest.search.value}%'
    or rr.Status LIKE '%${RepairRequest.search.value}%' ) `;
  }

  var cvalue = 0;
  var StatusChangeFrom = '';
  var StatusChangeTo = '';
  var StatusChangeId = '';

  for (cvalue = 0; cvalue < RepairRequest.columns.length; cvalue++) {

    if (RepairRequest.columns[cvalue].search.value != "") {

      if (RepairRequest.columns[cvalue].search.value == "true") {
        RepairRequest.columns[cvalue].search.value = "1";
      }
      if (RepairRequest.columns[cvalue].search.value == "false") {
        RepairRequest.columns[cvalue].search.value = "0";
      }
      switch (RepairRequest.columns[cvalue].name) {
        case "ShippingStatus":
          if (RepairRequest.columns[cvalue].search.value == 1 || RepairRequest.columns[cvalue].search.value == 2 || RepairRequest.columns[cvalue].search.value == 3) {
            var Val = RepairRequest.columns[cvalue].search.value;
            query += ` and rr.ShippingStatus = 1 and rr.ShippingIdentityType =${Val == 2 ? 1 : 2} `;//2=Shipped by Customer
            if (RepairRequest.columns[cvalue].search.value == 1) {
              query += ` and rr.ShippingIdentityId =${Constants.AH_GROUP_VENDOR_ID} `;
            }
            if (RepairRequest.columns[cvalue].search.value == 3) {
              query += ` and rr.ShippingIdentityId !=${Constants.AH_GROUP_VENDOR_ID} `;
            }
            query += ` and rr.RRId In (Select RRId from   tbl_repair_request_shipping_history where IsDeleted=0) `;
          } else if (RepairRequest.columns[cvalue].search.value == 4 || RepairRequest.columns[cvalue].search.value == 5 || RepairRequest.columns[cvalue].search.value == 6) {
            var Val2 = RepairRequest.columns[cvalue].search.value;
            query += ` and rr.ShippingStatus = 2 and rr.ShippingIdentityType =${Val2 == 5 ? 1 : 2} `;//5-Received by Customer
            if (RepairRequest.columns[cvalue].search.value == 4) {
              query += ` and rr.ShippingIdentityId =${Constants.AH_GROUP_VENDOR_ID} `;
            }
            if (RepairRequest.columns[cvalue].search.value == 6) {
              query += ` and rr.ShippingIdentityId !=${Constants.AH_GROUP_VENDOR_ID} `;
            }
            query += ` and rr.RRId In (Select RRId from   tbl_repair_request_shipping_history where IsDeleted=0) `;
          } else if (RepairRequest.columns[cvalue].search.value == 7 || RepairRequest.columns[cvalue].search.value == 8 || RepairRequest.columns[cvalue].search.value == 9) {
            var Val3 = RepairRequest.columns[cvalue].search.value;
            query += ` and rr.ShippingStatus = 4 and rr.ShippingIdentityType =${Val3 == 8 ? 1 : 2} `;//8-Picked Up by Customer
            if (RepairRequest.columns[cvalue].search.value == 7) {
              query += ` and rr.ShippingIdentityId =${Constants.AH_GROUP_VENDOR_ID} `;
            }
            if (RepairRequest.columns[cvalue].search.value == 9) {
              query += ` and rr.ShippingIdentityId !=${Constants.AH_GROUP_VENDOR_ID} `;
            }
            query += ` and rr.RRId In (Select RRId from   tbl_repair_request_shipping_history where IsDeleted=0) `;
          } else if (RepairRequest.columns[cvalue].search.value == 10) {
            query += ` and rr.ShippingStatus = 3 and rr.RRId In (Select RRId from   tbl_repair_request_shipping_history where IsDeleted=0) `;
          } else if (RepairRequest.columns[cvalue].search.value == 12) {
            query += ` and rr.ShippingStatus = 4 and rr.RRId In (Select RRId from   tbl_repair_request_shipping_history where IsDeleted=0) `;
          } else if (RepairRequest.columns[cvalue].search.value == 11) {
            query += ` and rr.RRId Not In (Select RRId from  tbl_repair_request_shipping_history where IsDeleted=0) `;
          }
          break;
        case "ShippingStatusCategory":
          if (RepairRequest.columns[cvalue].search.value == 1) {
            query += ` and rr.ShippingStatus = 2 and rr.ShippingIdentityType =1  and rr.RRId Not In (Select RRId from   tbl_repair_request_shipping_history where IsDeleted=0) `;
          } else if (RepairRequest.columns[cvalue].search.value == 2) {
            query += ` and rr.ShippingStatus = 2 and rr.ShippingIdentityType =2  and rr.ShippingIdentityId !=${Constants.AH_GROUP_VENDOR_ID}  and rr.RRId Not In (Select RRId from  tbl_repair_request_shipping_history where IsDeleted=0) `;
          } else if (RepairRequest.columns[cvalue].search.value == 3) {
            query += ` and rr.ShippingStatus = 2 and rr.ShippingIdentityType =2  and rr.ShippingIdentityId =${Constants.AH_GROUP_VENDOR_ID}  and rr.RRId Not In (Select RRId from  tbl_repair_request_shipping_history where IsDeleted=0) `;
          } else if (RepairRequest.columns[cvalue].search.value == 4) {
            query += ` and rr.ShippingStatus = 0 `;
          }
          break;
        case "QuoteApprovedBy":
          query += " ";
          break;
        case "IsSOCreated":
          query += " and rr.RRId IN(SELECT RRId FROM tbl_sales_order  WHERE IsDeleted=0 AND RRId = rr.RRId) ";
          break;
        case "VendorInvoiceId":
          if (RepairRequest.columns[cvalue].search.value == 1) {
            query += " and ( rr.VendorInvoiceId>0 ) ";
          } else if (RepairRequest.columns[cvalue].search.value == 0) {
            query += " and ( rr.VendorInvoiceId = 0 ) ";
          }
          break;
        case "CustomerInvoiceId":
          if (RepairRequest.columns[cvalue].search.value == 1) {
            query += " and ( rr.CustomerInvoiceId>0 ) ";
          } else if (RepairRequest.columns[cvalue].search.value == 0) {
            query += " and ( rr.CustomerInvoiceId = 0 ) ";
          }
          break;
        case "Status":
          query += " and ( rr." + RepairRequest.columns[cvalue].name + " LIKE '%" + RepairRequest.columns[cvalue].search.value + "%' ) ";
          break;

        case "PartId":
          query += " and ( rr.PartId =  '" + RepairRequest.columns[cvalue].search.value + "' ) ";
          break;
        case "VendorId":
          query += " and ( rr.VendorId  = '" + RepairRequest.columns[cvalue].search.value + "' ) ";
          break;
        case "CustomerId":
          query += " and ( rr.CustomerId IN (" + RepairRequest.columns[cvalue].search.value + ")) ";
          break;
        case "RRId":
          query += " and ( rr.RRId =  '" + RepairRequest.columns[cvalue].search.value + "' ) ";
          break;
        case "CreatedByLocation":
          query += " and ( rr.CreatedByLocation IN (" + RepairRequest.columns[cvalue].search.value + ")) ";
          break;
        case "RRIdVendorPO":
          query += " and ( rr.RRId =  '" + RepairRequest.columns[cvalue].search.value + "' ) ";
          break;
        case "RRIdCustomerPO":
          query += " and ( rr.RRId =  '" + RepairRequest.columns[cvalue].search.value + "' ) ";
          break;
        case "RRIdCustomerSO":
          query += " and ( rr.RRId =  '" + RepairRequest.columns[cvalue].search.value + "' ) ";
          break;
        case "MobileVerify":
          if (RepairRequest.columns[cvalue].search.value == 1) {
            query += 'and (  rr.Status=' + Constants.CONST_RRS_GENERATED + ' AND AddedFrom = 1 ) ';
          }
          break;
        case "DueDatePassed":
          if (RepairRequest.columns[cvalue].search.value == 1) {
            query += ` and ((rr.VendorPODueDate <= CURRENT_DATE
             OR rr.CustomerSODueDate <= CURRENT_DATE or rr.CustomerInvoiceDueDate <=CURRENT_DATE) AND rr.Status!=${Constants.CONST_RRS_COMPLETED} AND  rr.Status!=${Constants.CONST_RRS_QUOTE_REJECTED}  AND  rr.Status!=${Constants.CONST_RRS_NOT_REPAIRABLE} )`;
          }
          break;

        case "SODueDatePassed":
          if (RepairRequest.columns[cvalue].search.value == 1) {
            query += ` and (rr.CustomerSODueDate <= CURRENT_DATE AND rr.Status!=${Constants.CONST_RRS_COMPLETED} AND  rr.Status!=${Constants.CONST_RRS_QUOTE_REJECTED}  AND  rr.Status!=${Constants.CONST_RRS_NOT_REPAIRABLE} )`;
          }
          break;
        case "PODueDatePassed":
          if (RepairRequest.columns[cvalue].search.value == 1) {
            query += ` and (rr.VendorPODueDate <= CURRENT_DATE AND rr.Status!=${Constants.CONST_RRS_COMPLETED} AND  rr.Status!=${Constants.CONST_RRS_QUOTE_REJECTED}  AND  rr.Status!=${Constants.CONST_RRS_NOT_REPAIRABLE} )`;
          }
          break;
        case "InvDueDatePassed":
          if (RepairRequest.columns[cvalue].search.value == 1) {
            query += ` and (rr.CustomerInvoiceDueDate <=CURRENT_DATE AND rr.Status!=${Constants.CONST_RRS_COMPLETED} AND  rr.Status!=${Constants.CONST_RRS_QUOTE_REJECTED}  AND  rr.Status!=${Constants.CONST_RRS_NOT_REPAIRABLE} )`;
          }
          break;

        case "DueDateNears":
          if (RepairRequest.columns[cvalue].search.value == 1) {
            query += ` and (
          (DATEDIFF(rr.VendorPODueDate,CURDATE())<=2 and DATEDIFF(rr.VendorPODueDate,CURDATE())>0)
          or (DATEDIFF(rr.CustomerSODueDate,CURDATE())<=2 and DATEDIFF(rr.CustomerSODueDate,CURDATE())>0)
          or (DATEDIFF(rr.CustomerInvoiceDueDate,CURDATE())<=2 and DATEDIFF(rr.CustomerInvoiceDueDate,CURDATE())>0)
          AND rr.Status!=${Constants.CONST_RRS_COMPLETED} AND  rr.Status!=${Constants.CONST_RRS_QUOTE_REJECTED}  AND  rr.Status!=${Constants.CONST_RRS_NOT_REPAIRABLE} 
              )`;
          }
          break;

        case "SODueDateNears":
          if (RepairRequest.columns[cvalue].search.value == 1) {
            query += ` and (
            DATEDIFF(rr.CustomerSODueDate,CURDATE())<=2 and DATEDIFF(rr.CustomerSODueDate,CURDATE())>0
             AND rr.Status!=${Constants.CONST_RRS_COMPLETED} AND  rr.Status!=${Constants.CONST_RRS_QUOTE_REJECTED}  AND  rr.Status!=${Constants.CONST_RRS_NOT_REPAIRABLE}    )`;
          }
          break;
        case "PODueDateNears":
          if (RepairRequest.columns[cvalue].search.value == 1) {
            query += ` and (
          DATEDIFF(rr.VendorPODueDate,CURDATE())<=2 and DATEDIFF(rr.VendorPODueDate,CURDATE())>0
          AND rr.Status!=${Constants.CONST_RRS_COMPLETED} AND  rr.Status!=${Constants.CONST_RRS_QUOTE_REJECTED}  AND  rr.Status!=${Constants.CONST_RRS_NOT_REPAIRABLE} 
              )`;
          }
          break;
        case "InvDueDateNears":
          if (RepairRequest.columns[cvalue].search.value == 1) {
            query += ` and (
          DATEDIFF(rr.CustomerInvoiceDueDate,CURDATE())<=2 and DATEDIFF(rr.CustomerInvoiceDueDate,CURDATE())>0
          AND rr.Status!=${Constants.CONST_RRS_COMPLETED} AND  rr.Status!=${Constants.CONST_RRS_QUOTE_REJECTED}  AND  rr.Status!=${Constants.CONST_RRS_NOT_REPAIRABLE} 
              )`;
          }
          break;

        case "IsPartsDeliveredToCustomer":
          if (RepairRequest.columns[cvalue].search.value == 1) {
            query += ` and ( rr.ShippingStatus = 2 AND rr.ShippingIdentityType=${Constants.CONST_IDENTITY_TYPE_CUSTOMER} AND rr.CustomerId = rr.ShippingIdentityId )`;
          } else if (RepairRequest.columns[cvalue].search.value == 0) {
            query += ` and ( rr.ShippingStatus != 2 OR rr.ShippingIdentityType!=${Constants.CONST_IDENTITY_TYPE_CUSTOMER} OR rr.CustomerId != rr.ShippingIdentityId )`;
          }
          break;

        case "PartNo":
          query += " and ( rr." + RepairRequest.columns[cvalue].name + " LIKE '%" + RepairRequest.columns[cvalue].search.value + "%' ) ";
          break;
        case "SerialNo":
          query += " and ( rrp." + RepairRequest.columns[cvalue].name + " LIKE '%" + RepairRequest.columns[cvalue].search.value + "%' ) ";
          break;
        case "ReferenceValue":
          query += " and rr.RRId IN(SELECT RRId FROM tbl_repair_request_customer_ref  WHERE " + RepairRequest.columns[cvalue].name + " LIKE '%" + RepairRequest.columns[cvalue].search.value + "%' ) ";
          break;

        case "StatusChangeFrom":
          StatusChangeFrom = RepairRequest.columns[cvalue].search.value;
          break;
        case "StatusChangeTo":
          StatusChangeTo = RepairRequest.columns[cvalue].search.value;
          break;
        case "StatusChangeId":
          StatusChangeId = RepairRequest.columns[cvalue].search.value;
          break;

        case "CustomerPONo":
          // query += " and ( rr.CustomerPONo =  '" + RepairRequest.columns[cvalue].search.value + "' ) ";
          query += " and ( rr.CustomerPONo LIKE '%" + RepairRequest.columns[cvalue].search.value + "%' ) ";
          break;
        case "CreatedByLocation":
          query += " and ( rr.CreatedByLocation IN (" + RepairRequest.columns[cvalue].search.value + ") ) ";
          break;

        case "RRNo":
          // query += " and ( rr.RRNo =  '" + RepairRequest.columns[cvalue].search.value + "' ) ";
          var Nos = "'" + RepairRequest.columns[cvalue].search.value.split(",").join("','") + "'";
          query += " and rr.RRNo IN (" + Nos + " ) ";
          break;
        case "SubStatusId":
          query += " and ( rr.SubStatusId =  '" + RepairRequest.columns[cvalue].search.value + "' ) ";
          break;
        case "AssigneeUserId":
          query += " and ( rr.AssigneeUserId =  '" + RepairRequest.columns[cvalue].search.value + "' ) ";
          break;
        case "RRPartLocationId":
          query += " and ( rr.RRPartLocationId =  '" + RepairRequest.columns[cvalue].search.value + "' ) ";
          break;
        case "CustomerGroupId":
          // console.log(" and (rr.CustomerId IN(SELECT CustomerId FROM tbl_customers  WHERE " + RepairRequest.columns[cvalue].name + " IN (" + RepairRequest.columns[cvalue].search.value + "))) ");
          query += " and (rr.CustomerId IN(SELECT CustomerId FROM tbl_customers  WHERE " + RepairRequest.columns[cvalue].name + " IN (" + RepairRequest.columns[cvalue].search.value + "))) ";
          break;

        default:
          query += " and ( " + RepairRequest.columns[cvalue].name + " LIKE '%" + RepairRequest.columns[cvalue].search.value + "%' ) ";
      }
    }
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
    query += " ORDER BY ";
  }
  for (i = 0; i < RepairRequest.order.length; i++) {
    if (RepairRequest.order[i].column != "" || RepairRequest.order[i].column == "0")// 0 is equal to ""
    {
      switch (RepairRequest.columns[RepairRequest.order[i].column].name) {
        case "PartNo":
          query += " rr." + RepairRequest.columns[RepairRequest.order[i].column].name + " " + RepairRequest.order[i].dir + ",";
          break;
        case "RRNo":
          query += " rr." + RepairRequest.columns[RepairRequest.order[i].column].name + " " + RepairRequest.order[i].dir + ",";
          break;
        case "CompanyName":
          query += " c." + RepairRequest.columns[RepairRequest.order[i].column].name + " " + RepairRequest.order[i].dir + ",";
          break;
        case "SerialNo":
          query += " rrp." + RepairRequest.columns[RepairRequest.order[i].column].name + " " + RepairRequest.order[i].dir + ",";
          break;

        case "Status":
          query += " rr." + RepairRequest.columns[RepairRequest.order[i].column].name + " " + RepairRequest.order[i].dir + ",";
          break;

        case "CustomerPONo":
          query += " rr.CustomerPONo " + RepairRequest.order[i].dir + ",";
          break;

        default://could be any column except above 
          query += " " + RepairRequest.columns[RepairRequest.order[i].column].name + " " + RepairRequest.order[i].dir + ",";

      }
    }
  }
  var tempquery = query.slice(0, -1);
  var query = tempquery;
  var Countquery = recordfilterquery + query;

  if (RepairRequest.start != "-1" && RepairRequest.length != "-1") {
    query += " LIMIT " + RepairRequest.start + "," + (RepairRequest.length);

  }
  query = selectquery + query;


  var TotalCountQuery = `SELECT Count(rr.RRId) as TotalCount FROM tbl_repair_request rr where  rr.IsDeleted= 0`;
  if (TokenIdentityType == 0 && IsRestrictedCustomerAccess == 1 && MultipleCustomerIds != "") {
    TotalCountQuery += ` and rr.CustomerId in(${MultipleCustomerIds}) `;
  }
  if (RepairRequest.AssigneeUserId && RepairRequest.AssigneeUserId > 0) {
    TotalCountQuery += ` and rr.AssigneeUserId = ${RepairRequest.AssigneeUserId} `;
  }

  /*if (RepairRequest.Status != '') {
    var DateRange = ''; var Status = '';

    if (RepairRequest.Status == "Web")
      Status += ` and Status IN (0) and AddedFrom = 0 `;
    else if (RepairRequest.Status == "Mobile")
      Status += ` and Status IN (0) and AddedFrom = 1 `;
    else
      Status += ` and Status IN (` + RepairRequest.Status + `)  `;

    if (RepairRequest.FromDate != '' && RepairRequest.ToDate != '') {
      DateRange += ` AND DATE(Created) BETWEEN '${RepairRequest.FromDate}' AND '${RepairRequest.ToDate}' `
    }
    TotalCountQuery += ` and rr.RRId IN ( Select RRId from tbl_repair_request where IsDeleted=0 ${Status} ${DateRange} )  `;
  }*/

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

      // console.log("TotalCount : " + results[2][0][0].TotalCount)
      result(null, {
        data: results[0][0], recordsFiltered: results[1][0][0].recordsFiltered,
        recordsTotal: results[2][0][0].TotalCount, draw: RepairRequest.draw
      });
      return;
    }
  );

};


objModel.getRRListByServerSideBasic = (RepairRequest, result) => {

  var TokenIdentityType = getLogInIdentityType(RepairRequest);
  var IsRestrictedCustomerAccess = getLogInIsRestrictedCustomerAccess(RepairRequest);
  var MultipleCustomerIds = getLogInMultipleCustomerIds(RepairRequest);

  var query = "";
  var selectquery = `SELECT   
  rr.RRNo,
  (select REPLACE(ImagePath,'${Constants.CONST_BUCKET_PATH_SUBDOMAIN}','${Constants.CONST_BUCKET_PATH_AWS_DOMAIN}') as ImagePath from tbl_repair_request_images where  IsDeleted = 0 AND RRId=rr.RRId ORDER BY IsPrimaryImage DESC,RRImageId ASC limit 0,1) as RRImage,
  rr.PartId,
  rr.PartNo,
  RRP.SerialNo,
  c.CompanyName,
  VendorName,
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
 ELSE '-'	end StatusName, rr.Status,rr.IsActive,
VendorPONo,
rr.CreatedByLocation,
ss.SubStatusName, 
CONCAT(a.FirstName,' ', a.LastName) as AssigneeName, 
l.RRPartLocation as RRPartLocationName,
Case IsRushRepair
WHEN 0 THEN '${Constants.array_true_false[0]}'
WHEN 1 THEN '${Constants.array_true_false[1]}'
ELSE '-'	end IsRushRepair,
Case IsRepairTag 
WHEN 0 THEN '${Constants.array_true_false[0]}'
WHEN 1 THEN '${Constants.array_true_false[1]}'
ELSE '-'	end IsRepairTag,
rr.RRId,VendorInvoiceId,CustomerInvoiceId,
  rr.CustomerInvoiceNo InvoiceNo,
  rr.VendorPONo PONo, rr.SubStatusId,rr.RRPartLocationId,rr.AssigneeUserId,'' as InvoiceAmountOrQuoteAmount, '' as CustomerReference,
  rr.CustomerSONo SONo, 
  rr.VendorPOId,
  rr.CustomerSOId,
  DATE_FORMAT(rr.Created, '%m/%d/%Y') as Created, c.CustomerGroupId

  `;
  recordfilterquery = `Select count(rr.RRId) as recordsFiltered `;

  query = query + ` FROM tbl_repair_request rr
LEFT JOIN tbl_repair_request_parts as RRP ON RRP.RRId = rr.RRId and RRP.IsDeleted=0
LEFT JOIN tbl_customers c on c.CustomerId = rr.CustomerId 
LEFT JOIN tbl_vendors v on v.VendorId=rr.VendorId 
LEFT JOIN tbl_users a ON a.UserId=rr.AssigneeUserId
LEFT JOIN tbl_repair_request_substatus ss ON ss.SubStatusId=rr.SubStatusId AND ss.IsDeleted = 0
LEFT JOIN tbl_repair_request_part_location l ON l.RRPartLocationId=rr.RRPartLocationId AND l.IsDeleted = 0
where  rr.IsDeleted= 0 `;

  if (RepairRequest.AssigneeUserId && RepairRequest.AssigneeUserId > 0) {
    query += ` and rr.AssigneeUserId = ${RepairRequest.AssigneeUserId} `;
  }
  if (RepairRequest.Status != '') {
    var DateRange = ''; var Status = '';

    if (RepairRequest.Status == "Web")
      Status += ` and rr.Status IN (0) and AddedFrom = 0 `;
    else if (RepairRequest.Status == "Mobile")
      Status += ` and rr.Status IN (0) and AddedFrom = 1 `;
    else
      Status += ` and rr.Status IN (` + RepairRequest.Status + `)  `;

    if (RepairRequest.FromDate != '' && RepairRequest.ToDate != '') {
      DateRange += ` AND DATE(rr.Created) BETWEEN '${RepairRequest.FromDate}' AND '${RepairRequest.ToDate}' `
    }
    query += `and rr.RRId IN ( Select RRId from tbl_repair_request where IsDeleted=0 ${Status} ${DateRange} )  `;
  }

  if (TokenIdentityType == 0 && IsRestrictedCustomerAccess == 1 && MultipleCustomerIds != "") {
    query += ` and rr.CustomerId in(${MultipleCustomerIds}) `;
  }
  query += `  ${RepairRequest.CustomerId == 0 ? '' : `  And rr.CustomerId in (` + RepairRequest.CustomerId + `)  `} `;
  query += `  ${RepairRequest.CreatedByLocation == 0 ? '' : `  And rr.CreatedByLocation in (` + RepairRequest.CreatedByLocation + `)  `}  `;

  if (RepairRequest.search.value != '') {

    query = query + ` and ( rr.RRNo LIKE '%${RepairRequest.search.value}%'
     or rr.PartNo LIKE '%${RepairRequest.search.value}%' 
     or RRP.SerialNo LIKE '%${RepairRequest.search.value}%' 
    or c.CompanyName LIKE '%${RepairRequest.search.value}%' 
    or VendorName LIKE '%${RepairRequest.search.value}%'

    or CustomerSONo LIKE '%${RepairRequest.search.value}%'
    or rr.CustomerPONo LIKE '%${RepairRequest.search.value}%'
    or VendorPONo LIKE '%${RepairRequest.search.value}%'
    or VendorInvoiceNo LIKE '%${RepairRequest.search.value}%'
    or rr.Status LIKE '%${RepairRequest.search.value}%' ) `;
  }

  if (RepairRequest.RRNo != '') {
    var Nos = "'" + RepairRequest.RRNo.split(",").join("','") + "'";
    query += " and rr.RRNo IN (" + Nos + " ) ";
  }
  if (RepairRequest.RRId != '') {
    query += " and ( rr.RRId = " + RepairRequest.RRId + " ) ";
  }

  if (RepairRequest.RRDescription != '') {
    query += " and ( rr.RRDescription LIKE '%" + RepairRequest.RRDescription + "%' ) ";
  }
  if (RepairRequest.PartId != '') {
    query += " and ( rr.PartId LIKE '" + RepairRequest.PartId + "' ) ";
  }
  if (RepairRequest.PartNo != '') {
    query += " and ( rr.PartNo LIKE '%" + RepairRequest.PartNo + "%' ) ";
  }
  if (RepairRequest.SerialNo != '') {
    query += " and ( RRP.SerialNo LIKE '%" + RepairRequest.SerialNo + "%' ) ";
  }
  if (RepairRequest.RRIdCustomerSO != '') {
    query += " and ( rr.RRId =  '" + RepairRequest.RRIdCustomerSO + "' ) ";
  }
  if (RepairRequest.CustomerSONo && RepairRequest.CustomerSONo != '') {
    query += " and ( rr.CustomerSONo LIKE '" + RepairRequest.CustomerSONo + "' ) ";
  }
  if (RepairRequest.Status != '') {
    query += " and ( rr.Status LIKE '" + RepairRequest.Status + "' ) ";
  }
  if (RepairRequest.CustomerId != '') {
    query += " and ( rr.CustomerId IN (" + RepairRequest.CustomerId + ") ) ";
  }
  if (RepairRequest.CustomerPartNo1 != '') {
    query += " and ( RRP.CustomerPartNo1 LIKE '%" + RepairRequest.CustomerPartNo1 + "%' ) ";
  }
  if (RepairRequest.CustomerPONo != '') {
    query += " and ( rr.CustomerPONo = '" + RepairRequest.CustomerPONo + "' ) ";
  }
  if (RepairRequest.ReferenceValue != '') {
    query += " and rr.RRId IN(SELECT RRId FROM tbl_repair_request_customer_ref  WHERE ReferenceValue LIKE '%" + RepairRequest.ReferenceValue + "%' ) ";
  }

  if (RepairRequest.VendorId != '') {
    query += " and ( rr.VendorId LIKE '" + RepairRequest.VendorId + "' ) ";
  }
  //console.log("RepairRequest.VendorPONo = " + RepairRequest.VendorPONo)
  if (RepairRequest.VendorPONo != '') {
    // query += " and ( rr.VendorPONo = '" + RepairRequest.VendorPONo + "' ) ";
  }
  if (RepairRequest.RRIdVendorPO != '') {
    query += " and ( rr.RRId =  '" + RepairRequest.RRIdVendorPO + "' ) ";
  }
  if (RepairRequest.VendorInvoiceId != '') {
    if (RepairRequest.VendorInvoiceId == 1) {
      query += " and ( rr.VendorInvoiceId>0 ) ";
    } else if (RepairRequest.VendorInvoiceId == 0) {
      query += " and ( rr.VendorInvoiceId = 0 ) ";
    }
  }
  if (RepairRequest.CustomerInvoiceId != '') {
    if (RepairRequest.CustomerInvoiceId == 1) {
      query += " and ( rr.CustomerInvoiceId>0 ) ";
    } else if (RepairRequest.CustomerInvoiceId == 0) {
      query += " and ( rr.CustomerInvoiceId = 0 ) ";
    }
  }
  if (RepairRequest.IsPartsDeliveredToCustomer != '') {
    if (RepairRequest.IsPartsDeliveredToCustomer == 1) {
      query += ` and ( rr.ShippingStatus = 2 AND rr.ShippingIdentityType=${Constants.CONST_IDENTITY_TYPE_CUSTOMER} AND rr.CustomerId = rr.ShippingIdentityId )`;
    } else if (RepairRequest.IsPartsDeliveredToCustomer == 0) {
      query += ` and ( rr.ShippingStatus != 2 OR rr.ShippingIdentityType!=${Constants.CONST_IDENTITY_TYPE_CUSTOMER} OR rr.CustomerId != rr.ShippingIdentityId )`;
    }
  }
  if (RepairRequest.CustomerGroupId != "") {
    // query += " and (rr.CustomerId IN(SELECT CustomerId FROM tbl_customers  WHERE CustomerGroupId IN (" + RepairRequest.CustomerGroupId + "))) ";
    query += ` and c.CustomerGroupId in(` + RepairRequest.CustomerGroupId + `)`;
  }

  var StatusChangeFrom = '';
  var StatusChangeTo = '';
  var StatusChangeId = '';

  if (RepairRequest.StatusChangeFrom != '') {
    StatusChangeFrom = RepairRequest.columns[cvalue].search.value;
  }
  if (RepairRequest.StatusChangeTo != '') {
    StatusChangeTo = RepairRequest.columns[cvalue].search.value;
  }
  if (RepairRequest.StatusChangeId != '') {
    StatusChangeId = RepairRequest.columns[cvalue].search.value;
  }

  // if (StatusChangeFrom != '' && StatusChangeTo != '') {
  //   query += " and rr.RRId IN(SELECT RRId FROM tbl_repair_request_status_history  WHERE (DATE(Created) >= '" + StatusChangeFrom + "' and DATE(Created) <= '" + StatusChangeTo + "') ";
  //   if (StatusChangeId) {
  //     query += " and HistoryStatus = '" + StatusChangeId + "'";
  //   }
  //   query += ")";
  // }
  // else {
  //   if (StatusChangeFrom != '' || StatusChangeTo != '') {
  //     if (StatusChangeFrom != '') {
  //       query += " and rr.RRId IN(SELECT RRId FROM tbl_repair_request_status_history  WHERE (DATE(Created) >= '" + StatusChangeFrom + "'  ) ";
  //     }
  //     if (StatusChangeTo != '') {
  //       query += " and rr.RRId IN(SELECT RRId FROM tbl_repair_request_status_history  WHERE (  DATE(Created) <= '" + StatusChangeTo + "') ";
  //     }
  //     if (StatusChangeId) {
  //       query += " and HistoryStatus = '" + StatusChangeId + "'";
  //     }
  //     query += ")";
  //   }
  // }

  if (RepairRequest.ShippingStatus != '') {
    var ShippingStatus = RepairRequest.ShippingStatus;
    if (ShippingStatus == 1 || ShippingStatus == 2 || ShippingStatus == 3) {
      var Val = ShippingStatus;
      query += ` and rr.ShippingStatus = 1 and rr.ShippingIdentityType =${Val == 2 ? 1 : 2} `;//2=Shipped by Customer
      if (ShippingStatus == 1) {
        query += ` and rr.ShippingIdentityId =${Constants.AH_GROUP_VENDOR_ID} `;
      }
      if (ShippingStatus == 3) {
        query += ` and rr.ShippingIdentityId !=${Constants.AH_GROUP_VENDOR_ID} `;
      }
      query += ` and rr.RRId In (Select RRId from   tbl_repair_request_shipping_history where IsDeleted=0) `;
    } else if (ShippingStatus == 4 || ShippingStatus == 5 || ShippingStatus == 6) {
      var Val2 = ShippingStatus;
      query += ` and rr.ShippingStatus = 2 and rr.ShippingIdentityType =${Val2 == 5 ? 1 : 2} `;//5-Received by Customer
      if (ShippingStatus == 4) {
        query += ` and rr.ShippingIdentityId =${Constants.AH_GROUP_VENDOR_ID} `;
      }
      if (ShippingStatus == 6) {
        query += ` and rr.ShippingIdentityId !=${Constants.AH_GROUP_VENDOR_ID} `;
      }
      query += ` and rr.RRId In (Select RRId from   tbl_repair_request_shipping_history where IsDeleted=0) `;
    } else if (ShippingStatus == 7 || ShippingStatus == 8 || ShippingStatus == 9) {
      var Val3 = ShippingStatus;
      query += ` and rr.ShippingStatus = 4 and rr.ShippingIdentityType =${Val3 == 8 ? 1 : 2} `;//8-Picked Up by Customer
      if (ShippingStatus == 7) {
        query += ` and rr.ShippingIdentityId =${Constants.AH_GROUP_VENDOR_ID} `;
      }
      if (ShippingStatus == 9) {
        query += ` and rr.ShippingIdentityId !=${Constants.AH_GROUP_VENDOR_ID} `;
      }
      query += ` and rr.RRId In (Select RRId from   tbl_repair_request_shipping_history where IsDeleted=0) `;
    } else if (ShippingStatus == 10) {
      query += ` and rr.ShippingStatus = 3 and rr.RRId In (Select RRId from   tbl_repair_request_shipping_history where IsDeleted=0) `;
    } else if (ShippingStatus == 12) {
      query += ` and rr.ShippingStatus = 4 and rr.RRId In (Select RRId from   tbl_repair_request_shipping_history where IsDeleted=0) `;
    } else if (ShippingStatus == 11) {
      query += ` and rr.RRId Not In (Select RRId from  tbl_repair_request_shipping_history where IsDeleted=0) `;
    }
  }

  if (RepairRequest.ShippingStatusCategory != '') {
    var ShippingStatusCategory = RepairRequest.ShippingStatusCategory;
    if (ShippingStatusCategory == 1) {
      query += ` and rr.ShippingStatus = 2 and rr.ShippingIdentityType =1  and rr.RRId Not In (Select RRId from   tbl_repair_request_shipping_history where IsDeleted=0) `;
    } else if (ShippingStatusCategory == 2) {
      query += ` and rr.ShippingStatus = 2 and rr.ShippingIdentityType =2  and rr.ShippingIdentityId !=${Constants.AH_GROUP_VENDOR_ID}  and rr.RRId Not In (Select RRId from  tbl_repair_request_shipping_history where IsDeleted=0) `;
    } else if (ShippingStatusCategory == 3) {
      query += ` and rr.ShippingStatus = 2 and rr.ShippingIdentityType =2  and rr.ShippingIdentityId =${Constants.AH_GROUP_VENDOR_ID}  and rr.RRId Not In (Select RRId from  tbl_repair_request_shipping_history where IsDeleted=0) `;
    } else if (ShippingStatusCategory == 4) {
      query += ` and rr.ShippingStatus = 0 `;
    }
  }

  if (RepairRequest.IsSOCreated) {
    query += " and rr.RRId IN(SELECT RRId FROM tbl_sales_order  WHERE IsDeleted=0 AND RRId = rr.RRId ) ";
  }
  //console.log("RepairRequest.IsWarrantyRecovery = " + RepairRequest.IsWarrantyRecovery)
  if (RepairRequest.IsWarrantyRecovery != '') {
    //query += " and ( rr.IsWarrantyRecovery =  '" + RepairRequest.IsWarrantyRecovery + "' ) ";
  }
  if (RepairRequest.IsRushRepair != '') {
    query += " and ( rr.IsRushRepair =  '" + RepairRequest.IsRushRepair + "' ) ";
  }
  if (RepairRequest.RRIdVendorPO != '') {
    query += " and ( rr.IsRepairTag =  '" + RepairRequest.IsRepairTag + "' ) ";
  }

  if (RepairRequest.CreatedByLocation != '') {
    query += " and ( rr.CreatedByLocation IN ( " + RepairRequest.CreatedByLocation + ") ) ";
  }

  if (RepairRequest.MobileVerify != '') {
    if (RepairRequest.MobileVerify == 1) {
      query += 'and (  rr.Status=' + Constants.CONST_RRS_GENERATED + ' AND AddedFrom = 1 ) ';
    }
  }

  if (RepairRequest.SubStatusId != '') {
    query += " and ( rr.SubStatusId = '" + RepairRequest.SubStatusId + "' ) ";
  }
  if (RepairRequest.AssigneeUserId != '') {
    query += " and ( rr.AssigneeUserId = '" + RepairRequest.AssigneeUserId + "' ) ";
  }
  if (RepairRequest.RRPartLocationId != '') {
    query += " and ( rr.RRPartLocationId = '" + RepairRequest.RRPartLocationId + "' ) ";
  }


  var i = 0;
  if (RepairRequest.order.length > 0) {
    query += " ORDER BY ";
  }
  for (i = 0; i < RepairRequest.order.length; i++) {
    if (RepairRequest.order[i].column != "" || RepairRequest.order[i].column == "0")// 0 is equal to ""
    {
      switch (RepairRequest.columns[RepairRequest.order[i].column].name) {
        case "PartNo":
          query += " rr." + RepairRequest.columns[RepairRequest.order[i].column].name + " " + RepairRequest.order[i].dir + ",";
          break;
        case "RRNo":
          query += " rr.RRId " + RepairRequest.order[i].dir + ",";
          break;
        case "CompanyName":
          query += " c." + RepairRequest.columns[RepairRequest.order[i].column].name + " " + RepairRequest.order[i].dir + ",";
          break;
        case "SerialNo":
          query += " rrp." + RepairRequest.columns[RepairRequest.order[i].column].name + " " + RepairRequest.order[i].dir + ",";
          break;

        case "Status":
          query += " rr." + RepairRequest.columns[RepairRequest.order[i].column].name + " " + RepairRequest.order[i].dir + ",";
          break;

        case "CustomerPONo":
          query += " rr.CustomerPONo " + RepairRequest.order[i].dir + ",";
          break;

        default://could be any column except above 
          query += " " + RepairRequest.columns[RepairRequest.order[i].column].name + " " + RepairRequest.order[i].dir + ",";

      }
    }
  }
  var tempquery = query.slice(0, -1);
  var query = tempquery;
  var Countquery = recordfilterquery + query;

  if (RepairRequest.start != "-1" && RepairRequest.length != "-1") {
    query += " LIMIT " + RepairRequest.start + "," + (RepairRequest.length);

  }
  query = selectquery + query;

  var TotalCountQuery = `SELECT Count(rr.RRId) as TotalCount FROM tbl_repair_request rr where  rr.IsDeleted= 0
 `;
  if (TokenIdentityType == 0 && IsRestrictedCustomerAccess == 1 && MultipleCustomerIds != "") {
    TotalCountQuery += ` and rr.CustomerId in(${MultipleCustomerIds}) `;
  }
  if (RepairRequest.AssigneeUserId && RepairRequest.AssigneeUserId > 0) {
    TotalCountQuery += ` and rr.AssigneeUserId = ${RepairRequest.AssigneeUserId} `;
  }
  // console.log(query);

  async.parallel([
    function (result) { con.query(query, result) },
    function (result) { con.query(Countquery, result) },
    function (result) { con.query(TotalCountQuery, result) }
  ],
    function (err, results) {
      if (err)
        return result(err, null);

      // console.log("TotalCount : " + results[2][0][0].TotalCount)
      result(null, {
        data: results[0][0], recordsFiltered: results[1][0][0].recordsFiltered,
        recordsTotal: results[2][0][0].TotalCount, draw: RepairRequest.draw
      });

    }
  );

};



objModel.getRRMyWorksListByServerSide = (RepairRequest, result) => {

  var TokenIdentityType = getLogInIdentityType(RepairRequest);
  var IsRestrictedCustomerAccess = getLogInIsRestrictedCustomerAccess(RepairRequest);
  var MultipleCustomerIds = getLogInMultipleCustomerIds(RepairRequest);

  var query = "";
  var recordfilterquery = "";
  var selectquery = `SELECT  
  rr.RRId, rr.RRNo, rr.CreatedByLocation,rr.IsActive,rr.SubStatusId,rr.AssigneeUserId,rr.RRPartLocationId,(select ModifiedByName from tbl_repair_request_assignee_history 
where RRId=rr.RRId  ORDER BY AssigneeHistoryId DESC LIMIT 1) as SubTaskAssignedBy,rr.ShippingIdentityId,
rr.PartNo,CustomerPartNo1,
rrp.SerialNo,
c.CompanyName,rr.ShippingStatus,rr.ShippingIdentityId,rr.ShippingIdentityType,
VendorName,rr.CustomerId,'' as QuoteApprovedBy,
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
 ELSE '-'	end StatusName, rr.Status, 
Case IsWarrantyRecovery 
WHEN 1 THEN '${Constants.array_IsWarrantyRepair[1]}'
WHEN 2 THEN '${Constants.array_IsWarrantyRepair[2]}'
ELSE '-'	end IsWarrantyRecovery,
Case IsRushRepair 
WHEN 0 THEN '${Constants.array_true_false[0]}'
WHEN 1 THEN '${Constants.array_true_false[1]}'
ELSE '-'	end IsRushRepair,
Case IsRepairTag 
WHEN 0 THEN '${Constants.array_true_false[0]}'
WHEN 1 THEN '${Constants.array_true_false[1]}'
ELSE '-'	end IsRepairTag,
rr.RRId,
(select REPLACE(ImagePath,'${Constants.CONST_BUCKET_PATH_SUBDOMAIN}','${Constants.CONST_BUCKET_PATH_AWS_DOMAIN}') as ImagePath from tbl_repair_request_images where  IsDeleted = 0 AND RRId=rr.RRId ORDER BY IsPrimaryImage DESC,RRImageId ASC limit 0,1) as RRImage,
DATE_FORMAT(rr.Created, '%m/%d/%Y') as Created, ss.SubStatusName,  CONCAT(a.FirstName,' ', a.LastName) as AssigneeName, l.RRPartLocation as RRPartLocationName`;
  recordfilterquery = `Select count(rr.RRId) as recordsFiltered `;

  //   query = query + ` FROM tbl_repair_request rr
  // LEFT JOIN tbl_customers c on c.CustomerId = rr.CustomerId 
  // LEFT JOIN tbl_vendors v on v.VendorId=rr.VendorId 
  // LEFT JOIN tbl_users a ON a.UserId=rr.AssigneeUserId
  // LEFT JOIN tbl_repair_request_substatus ss ON ss.SubStatusId=rr.SubStatusId
  // LEFT JOIN tbl_repair_request_part_location l ON l.RRPartLocationId=rr.RRPartLocationId
  // where  rr.IsDeleted= 0 `;

  query = query + ` FROM tbl_repair_request rr
LEFT JOIN tbl_customers c on c.CustomerId = rr.CustomerId 
LEFT JOIN tbl_invoice i on i.RRId=rr.RRId and i.RRId>0 AND i.IsDeleted = 0 
LEFT JOIN tbl_quotes q on q.RRId=rr.RRId and q.RRId>0 and q.Status In(1,2,4) and q.QuoteCustomerStatus In(1,2,3) and q.IsDeleted = 0 
LEFT JOIN tbl_vendors v on v.VendorId=rr.VendorId 
LEFT JOIN tbl_repair_request_parts rrp on rrp.RRId =rr.RRId 
LEFT JOIN tbl_customer_assets ca on ca.CustomerAssetId=rr.AssetId 
LEFT JOIN tbl_sales_order s on s.RRId=rr.RRId  AND s.IsDeleted = 0 AND s.Status!=3
LEFT JOIN tbl_po po on po.RRId=rr.RRId  AND po.IsDeleted = 0  AND po.Status!=5
LEFT JOIN tbl_users a ON a.UserId=rr.AssigneeUserId
LEFT JOIN tbl_repair_request_substatus ss ON ss.SubStatusId=rr.SubStatusId
LEFT JOIN tbl_repair_request_part_location l ON l.RRPartLocationId=rr.RRPartLocationId
where  rr.IsDeleted= 0 `;

  if (RepairRequest.AssigneeUserId && RepairRequest.AssigneeUserId > 0) {
    query += ` and rr.AssigneeUserId = "${RepairRequest.AssigneeUserId}" `;
  }
  if (RepairRequest.Status != '') {
    var DateRange = ''; var Status = '';

    if (RepairRequest.Status == "Web")
      Status += ` and Status IN (0) and AddedFrom = 0 `;
    else if (RepairRequest.Status == "Mobile")
      Status += ` and Status IN (0) and AddedFrom = 1 `;
    else
      Status += ` and Status IN (` + RepairRequest.Status + `)  `;

    if (RepairRequest.FromDate != '' && RepairRequest.ToDate != '') {
      DateRange += ` AND DATE(Created) BETWEEN '${RepairRequest.FromDate}' AND '${RepairRequest.ToDate}' `
    }
    query += `and rr.RRId IN ( Select RRId from tbl_repair_request where IsDeleted=0 ${Status} ${DateRange} )  `;
  }

  if (TokenIdentityType == 0 && IsRestrictedCustomerAccess == 1 && MultipleCustomerIds != "") {
    query += ` and rr.CustomerId in(${MultipleCustomerIds}) `;
  }
  query += `  ${RepairRequest.CustomerId == 0 ? '' : `  And rr.CustomerId in (` + RepairRequest.CustomerId + `)  `} `;
  query += `  ${RepairRequest.CreatedByLocation == 0 ? '' : `  And rr.CreatedByLocation in (` + RepairRequest.CreatedByLocation + `)  `}  `;

  if (RepairRequest.ShippingStatus != '') {
    if (RepairRequest.ShippingStatus == 1 || RepairRequest.ShippingStatus == 2 || RepairRequest.ShippingStatus == 3) {
      var Val = RepairRequest.ShippingStatus;
      query += ` and rr.ShippingStatus = 1 and rr.ShippingIdentityType =${Val == 2 ? 1 : 2} `;//2=Shipped by Customer
      if (RepairRequest.ShippingStatus == 1) {
        query += ` and rr.ShippingIdentityId =${Constants.AH_GROUP_VENDOR_ID} `;
      }
      if (RepairRequest.ShippingStatus == 3) {
        query += ` and rr.ShippingIdentityId !=${Constants.AH_GROUP_VENDOR_ID} `;
      }
      query += ` and rr.RRId In (Select RRId from   tbl_repair_request_shipping_history where IsDeleted=0) `;
    } else if (RepairRequest.ShippingStatus == 4 || RepairRequest.ShippingStatus == 5 || RepairRequest.ShippingStatus == 6) {
      var Val2 = RepairRequest.ShippingStatus;
      query += ` and rr.ShippingStatus = 2 and rr.ShippingIdentityType =${Val2 == 5 ? 1 : 2} `;//5-Received by Customer
      if (RepairRequest.ShippingStatus == 4) {
        query += ` and rr.ShippingIdentityId =${Constants.AH_GROUP_VENDOR_ID} `;
      }
      if (RepairRequest.ShippingStatus == 6) {
        query += ` and rr.ShippingIdentityId !=${Constants.AH_GROUP_VENDOR_ID} `;
      }
      query += ` and rr.RRId In (Select RRId from   tbl_repair_request_shipping_history where IsDeleted=0) `;
    } else if (RepairRequest.ShippingStatus == 7 || RepairRequest.ShippingStatus == 8 || RepairRequest.ShippingStatus == 9) {
      var Val3 = RepairRequest.ShippingStatus;
      query += ` and rr.ShippingStatus = 4 and rr.ShippingIdentityType =${Val3 == 8 ? 1 : 2} `;//8-Picked Up by Customer
      if (RepairRequest.ShippingStatus == 7) {
        query += ` and rr.ShippingIdentityId =${Constants.AH_GROUP_VENDOR_ID} `;
      }
      if (RepairRequest.ShippingStatus == 9) {
        query += ` and rr.ShippingIdentityId !=${Constants.AH_GROUP_VENDOR_ID} `;
      }
      query += ` and rr.RRId In (Select RRId from   tbl_repair_request_shipping_history where IsDeleted=0) `;
    } else if (RepairRequest.ShippingStatus == 10) {
      query += ` and rr.ShippingStatus = 3 and rr.RRId In (Select RRId from   tbl_repair_request_shipping_history where IsDeleted=0) `;
    } else if (RepairRequest.ShippingStatus == 12) {
      query += ` and rr.ShippingStatus = 4 and rr.RRId In (Select RRId from   tbl_repair_request_shipping_history where IsDeleted=0) `;
    } else if (RepairRequest.ShippingStatus == 11) {
      query += ` and rr.RRId Not In (Select RRId from  tbl_repair_request_shipping_history where IsDeleted=0) `;
    }
  } // if end

  if (RepairRequest.ShippingStatusCategory != '') {
    if (RepairRequest.ShippingStatusCategory == 1) {
      query += ` and rr.ShippingStatus = 2 and rr.ShippingIdentityType =1  and rr.RRId Not In (Select RRId from tbl_repair_request_shipping_history where IsDeleted=0) `;
    } else if (RepairRequest.ShippingStatusCategory == 2) {
      query += ` and rr.ShippingStatus = 2 and rr.ShippingIdentityType =2  and rr.ShippingIdentityId !=${Constants.AH_GROUP_VENDOR_ID}  and rr.RRId Not In (Select RRId from  tbl_repair_request_shipping_history where IsDeleted=0) `;
    } else if (RepairRequest.ShippingStatusCategory == 3) {
      query += ` and rr.ShippingStatus = 2 and rr.ShippingIdentityType =2  and rr.ShippingIdentityId =${Constants.AH_GROUP_VENDOR_ID}  and rr.RRId Not In (Select RRId from  tbl_repair_request_shipping_history where IsDeleted=0) `;
    } else if (RepairRequest.ShippingStatusCategory == 4) {
      query += ` and (rr.ShippingStatus = 0 OR rr.ShippingStatus IS NULL) `;
    }
  } // if end



  if (RepairRequest.QuoteApprovedBy != '') {
    query += " ";
  } // if end
  if (RepairRequest.IsSOCreated != '') {
    if (RepairRequest.IsSOCreated == 0) {
      query += " and rr.RRId NOT IN(SELECT RRId FROM tbl_sales_order  WHERE IsDeleted=0 AND RRId = rr.RRId) ";
    } else {
      query += " and rr.RRId IN(SELECT RRId FROM tbl_sales_order  WHERE IsDeleted=0 AND RRId = rr.RRId) ";
    }
  } // if end
  if (RepairRequest.VendorInvoiceId != '') {
    if (RepairRequest.VendorInvoiceId == 1) {
      query += " and ( rr.VendorInvoiceId>0 ) ";
    } else if (RepairRequest.VendorInvoiceId == 0) {
      query += " and ( rr.VendorInvoiceId = 0 ) ";
    }
  } // if end
  if (RepairRequest.CustomerInvoiceId != '') {
    if (RepairRequest.CustomerInvoiceId == 1) {
      query += " and ( rr.CustomerInvoiceId>0 ) ";
    } else if (RepairRequest.CustomerInvoiceId == 0) {
      query += " and ( rr.CustomerInvoiceId = 0 ) ";
    }
  } // if end
  if (RepairRequest.Status != '' && RepairRequest.Status > 0) {
    query += " and ( rr.Status  = '" + RepairRequest.Status + "' ) ";
  } // if end
  if (RepairRequest.RRDescription != '') {
    query += " and ( rr.RRDescription LIKE '%" + RepairRequest.RRDescription + "%' ) ";
  } // if end
  if (RepairRequest.PartId != '') {
    query += " and ( rr.PartId =  '" + RepairRequest.PartId + "' ) ";
  } // if end
  if (RepairRequest.VendorId != '') {
    query += " and ( rr.VendorId  = '" + RepairRequest.VendorId + "' ) ";
  } // if end
  if (RepairRequest.RRId != '') {
    query += " and ( rr.RRId =  '" + RepairRequest.RRId + "' ) ";
  } // if end
  if (RepairRequest.CreatedByLocation != '') {
    query += " and ( rr.CreatedByLocation IN (" + RepairRequest.CreatedByLocation + ")) ";
  } // if end
  if (RepairRequest.RRIdVendorPO != '') {
    query += " and ( rr.VendorPONo =  '" + RepairRequest.RRIdVendorPO + "' ) ";
  } // if end
  if (RepairRequest.RRIdCustomerPO != '') {
    query += " and ( rr.CustomerPONo =  '" + RepairRequest.RRIdCustomerPO + "' ) ";
  } // if end
  if (RepairRequest.RRIdCustomerSO != '') {
    // console.log(" and ( rr.CustomerSONo =  '" + RepairRequest.RRIdCustomerSO + "' ) ");
    query += " and ( rr.CustomerSONo =  '" + RepairRequest.RRIdCustomerSO + "' ) ";
  } // if end
  // ToDo
  if (RepairRequest.MobileVerify != '') {
    if (RepairRequest.MobileVerify == 1) {
      query += 'and (  rr.Status=' + Constants.CONST_RRS_GENERATED + ' AND AddedFrom = 1 ) ';
    }
  } // if end
  if (RepairRequest.DueDatePassed != '') {
    if (RepairRequest.DueDatePassed == 1) {
      query += ` and ((rr.VendorPODueDate <= CURRENT_DATE
     OR rr.CustomerSODueDate <= CURRENT_DATE or rr.CustomerInvoiceDueDate <=CURRENT_DATE) AND rr.Status!=${Constants.CONST_RRS_COMPLETED} AND  rr.Status!=${Constants.CONST_RRS_QUOTE_REJECTED}  AND  rr.Status!=${Constants.CONST_RRS_NOT_REPAIRABLE} )`;
    }
  } // if end

  if (RepairRequest.SODueDatePassed != '') {
    if (RepairRequest.SODueDatePassed == 1) {
      query += ` and (rr.CustomerSODueDate <= CURRENT_DATE AND rr.Status!=${Constants.CONST_RRS_COMPLETED} AND  rr.Status!=${Constants.CONST_RRS_QUOTE_REJECTED}  AND  rr.Status!=${Constants.CONST_RRS_NOT_REPAIRABLE} )`;
    }
  } // if end
  if (RepairRequest.PODueDatePassed != '') {
    if (RepairRequest.PODueDatePassed == 1) {
      query += ` and (rr.VendorPODueDate <= CURRENT_DATE AND rr.Status!=${Constants.CONST_RRS_COMPLETED} AND  rr.Status!=${Constants.CONST_RRS_QUOTE_REJECTED}  AND  rr.Status!=${Constants.CONST_RRS_NOT_REPAIRABLE} )`;
    }
  } // if end
  if (RepairRequest.InvDueDatePassed != '') {
    if (RepairRequest.InvDueDatePassed == 1) {
      query += ` and (rr.CustomerInvoiceDueDate <=CURRENT_DATE AND rr.Status!=${Constants.CONST_RRS_COMPLETED} AND  rr.Status!=${Constants.CONST_RRS_QUOTE_REJECTED}  AND  rr.Status!=${Constants.CONST_RRS_NOT_REPAIRABLE} )`;
    }
  } // if end

  if (RepairRequest.DueDateNears != '') {
    if (RepairRequest.DueDateNears == 1) {
      query += ` and (
  (DATEDIFF(rr.VendorPODueDate,CURDATE())<=2 and DATEDIFF(rr.VendorPODueDate,CURDATE())>0)
  or (DATEDIFF(rr.CustomerSODueDate,CURDATE())<=2 and DATEDIFF(rr.CustomerSODueDate,CURDATE())>0)
  or (DATEDIFF(rr.CustomerInvoiceDueDate,CURDATE())<=2 and DATEDIFF(rr.CustomerInvoiceDueDate,CURDATE())>0)
  AND rr.Status!=${Constants.CONST_RRS_COMPLETED} AND  rr.Status!=${Constants.CONST_RRS_QUOTE_REJECTED}  AND  rr.Status!=${Constants.CONST_RRS_NOT_REPAIRABLE} 
      )`;
    }
  } // if end

  if (RepairRequest.SODueDateNears != '') {
    if (RepairRequest.SODueDateNears == 1) {
      query += ` and (
    DATEDIFF(rr.CustomerSODueDate,CURDATE())<=2 and DATEDIFF(rr.CustomerSODueDate,CURDATE())>0
     AND rr.Status!=${Constants.CONST_RRS_COMPLETED} AND  rr.Status!=${Constants.CONST_RRS_QUOTE_REJECTED}  AND  rr.Status!=${Constants.CONST_RRS_NOT_REPAIRABLE}    )`;
    }
  } // if end
  if (RepairRequest.PODueDateNears != '') {
    if (RepairRequest.PODueDateNears == 1) {
      query += ` and (
  DATEDIFF(rr.VendorPODueDate,CURDATE())<=2 and DATEDIFF(rr.VendorPODueDate,CURDATE())>0
  AND rr.Status!=${Constants.CONST_RRS_COMPLETED} AND  rr.Status!=${Constants.CONST_RRS_QUOTE_REJECTED}  AND  rr.Status!=${Constants.CONST_RRS_NOT_REPAIRABLE} 
      )`;
    }
  } // if end
  // ToDo1
  if (RepairRequest.InvDueDateNears != '') {
    if (RepairRequest.InvDueDateNears == 1) {
      query += ` and (
  DATEDIFF(rr.CustomerInvoiceDueDate,CURDATE())<=2 and DATEDIFF(rr.CustomerInvoiceDueDate,CURDATE())>0
  AND rr.Status!=${Constants.CONST_RRS_COMPLETED} AND  rr.Status!=${Constants.CONST_RRS_QUOTE_REJECTED}  AND  rr.Status!=${Constants.CONST_RRS_NOT_REPAIRABLE} 
      )`;
    }
  } // if end

  if (RepairRequest.IsPartsDeliveredToCustomer != '') {
    if (RepairRequest.IsPartsDeliveredToCustomer == 1) {
      query += ` and ( rr.ShippingStatus = 2 AND rr.ShippingIdentityType=${Constants.CONST_IDENTITY_TYPE_CUSTOMER} AND rr.CustomerId = rr.ShippingIdentityId ) `;
    } else if (RepairRequest.IsPartsDeliveredToCustomer == 0) {
      query += ` and ( rr.ShippingStatus != 2 OR rr.ShippingIdentityType!=${Constants.CONST_IDENTITY_TYPE_CUSTOMER} OR rr.CustomerId != rr.ShippingIdentityId ) `;
    }
  } // if end

  if (RepairRequest.PartNo != '') {
    query += " and ( rr.PartNo LIKE '%" + RepairRequest.PartNo + "%' ) ";
  } // if end
  if (RepairRequest.SerialNo && RepairRequest.SerialNo != '') {
    query += " and ( rrp.SerialNo LIKE '%" + RepairRequest.SerialNo + "%' ) ";
  } // if end
  if (RepairRequest.ReferenceValue != '') {
    query += " and rr.RRId IN(SELECT RRId FROM tbl_repair_request_customer_ref  WHERE ReferenceValue LIKE '%" + RepairRequest.ReferenceValue + "%' ) ";
  } // if end
  var cvalue = 0;
  var StatusChangeFrom = '';
  var StatusChangeTo = '';
  var StatusChangeId = '';

  if (RepairRequest.StatusChangeFrom != '') {
    StatusChangeFrom = RepairRequest.StatusChangeFrom;
  } // if end
  if (RepairRequest.StatusChangeTo != '') {
    StatusChangeTo = RepairRequest.StatusChangeTo;
  } // if end
  if (RepairRequest.StatusChangeId != '') {
    StatusChangeId = RepairRequest.StatusChangeId;
  } // if end

  if (RepairRequest.CustomerPONo != '') {
    query += " and ( rr.CustomerPONo =  '" + RepairRequest.CustomerPONo + "' ) ";
  } // if end
  if (RepairRequest.CreatedByLocation != '') {
    query += " and ( rr.CreatedByLocation IN (" + RepairRequest.CreatedByLocation + ") ) ";
  } // if end

  if (RepairRequest.RRNo != '') {
    // query += " and ( rr.RRNo =  '" + RepairRequest.ShippingStatusCategory + "' ) ";
    var Nos = "'" + RepairRequest.RRNo.split(",").join("','") + "'";
    query += " and rr.RRNo IN (" + Nos + " ) ";
  } // if end
  if (RepairRequest.SubStatusId != '' && RepairRequest.SubStatusId > 0) {
    query += " and ( rr.SubStatusId =  '" + RepairRequest.SubStatusId + "' ) ";
  } // if end

  if (RepairRequest.RRPartLocationId != '' && RepairRequest.RRPartLocationId > 0) {
    query += " and ( rr.RRPartLocationId =  '" + RepairRequest.RRPartLocationId + "' ) ";
  } // if end

  if (RepairRequest.CustomerPartNo1 != '') {
    query += " and ( CustomerPartNo1 =  '" + RepairRequest.CustomerPartNo1 + "' ) ";
  } // if end
  if (RepairRequest.IsRushRepair != '') {
    // console.log("!@#$%!@#$%^&*($%^&*")
    if (RepairRequest.IsRushRepair === true) {
      query += " and ( rr.IsRushRepair = true ) ";
    }

  }
  if (RepairRequest.IsRepairTag != '') {
    if (RepairRequest.IsRepairTag === true) {
      query += " and ( rr.IsRepairTag = true ) ";
    }

  }
  if (StatusChangeFrom != '' && StatusChangeTo != '') {
    query += " and rr.RRId IN(SELECT RRId FROM tbl_repair_request_status_history  WHERE (DATE(Created) >= '" + StatusChangeFrom + "' and DATE(Created) <= '" + StatusChangeTo + "') ";
    if (StatusChangeId != '') {
      query += " and HistoryStatus = '" + StatusChangeId + "'";
    }
    query += " ) ";
  }
  else {
    if (StatusChangeFrom != '' || StatusChangeTo != '' || StatusChangeId != '') {
      if (StatusChangeFrom != '' || StatusChangeTo != '') {
        if (StatusChangeFrom != '') {
          query += " and rr.RRId IN(SELECT RRId FROM tbl_repair_request_status_history  WHERE (DATE(Created) >= '" + StatusChangeFrom + "'  ) ";
        }
        if (StatusChangeTo != '') {
          query += " and rr.RRId IN(SELECT RRId FROM tbl_repair_request_status_history  WHERE (DATE(Created) <= '" + StatusChangeTo + "') ";
        }
        if (StatusChangeId) {
          query += " and HistoryStatus = '" + StatusChangeId + "'";
        }
        query += " ) ";
      } else if ((StatusChangeFrom == '' && StatusChangeTo == '') && StatusChangeId != '') {
        query += " and rr.RRId IN(SELECT RRId FROM tbl_repair_request_status_history  WHERE HistoryStatus = '" + StatusChangeId + "' ";
        query += " ) ";
      }

    }
  }

  var i = 0;
  /*if (RepairRequest.order.length > 0) {
    query += " ORDER BY ";
  }
  for (i = 0; i < RepairRequest.order.length; i++) {
    if (RepairRequest.order[i].column != "" || RepairRequest.order[i].column == "0")// 0 is equal to ""
    {
      switch (RepairRequest.columns[RepairRequest.order[i].column].name) {
        case "PartNo":
          query += " rr." + RepairRequest.columns[RepairRequest.order[i].column].name + " " + RepairRequest.order[i].dir + ",";
          break;
        case "RRNo":
          query += " rr." + RepairRequest.columns[RepairRequest.order[i].column].name + " " + RepairRequest.order[i].dir + ",";
          break;
        case "CompanyName":
          query += " c." + RepairRequest.columns[RepairRequest.order[i].column].name + " " + RepairRequest.order[i].dir + ",";
          break;
        case "SerialNo":
          query += " rr." + RepairRequest.columns[RepairRequest.order[i].column].name + " " + RepairRequest.order[i].dir + ",";
          break;
 
        case "Status":
          query += " rr." + RepairRequest.columns[RepairRequest.order[i].column].name + " " + RepairRequest.order[i].dir + ",";
          break;
 
        case "CustomerPONo":
          query += " rr.CustomerPONo " + RepairRequest.order[i].dir + ",";
          break;
 
        default://could be any column except above 
          query += " " + RepairRequest.columns[RepairRequest.order[i].column].name + " " + RepairRequest.order[i].dir + ",";
 
      }
    }
  }*/
  var tempquery = query.slice(0, -1);
  var query = tempquery;
  var Countquery = recordfilterquery + query;

  /*if (RepairRequest.start != "-1" && RepairRequest.length != "-1") {
    if (!RepairRequest.fromMyWorkChain) {
      query += " LIMIT " + RepairRequest.start + "," + (RepairRequest.length);
    }
  }*/
  query = selectquery + query;

  var TotalCountQuery = `SELECT Count(rr.RRId) as TotalCount
 FROM tbl_repair_request rr
LEFT JOIN tbl_customers c on c.CustomerId = rr.CustomerId 
LEFT JOIN tbl_invoice i on i.RRId=rr.RRId and i.RRId>0 AND i.IsDeleted = 0 
LEFT JOIN tbl_quotes q on q.RRId=rr.RRId and q.RRId>0 and q.Status In(1,2,4) and q.QuoteCustomerStatus In(1,2,3) and q.IsDeleted = 0 
LEFT JOIN tbl_vendors v on v.VendorId=rr.VendorId 
LEFT JOIN tbl_repair_request_parts rrp on rrp.RRId =rr.RRId 
LEFT JOIN tbl_customer_assets ca on ca.CustomerAssetId=rr.AssetId 
LEFT JOIN tbl_sales_order s on s.RRId=rr.RRId  AND s.IsDeleted = 0 AND s.Status!=3
LEFT JOIN tbl_po po on po.RRId=rr.RRId  AND po.IsDeleted = 0  AND po.Status!=5
LEFT JOIN tbl_users a ON a.UserId=rr.AssigneeUserId
LEFT JOIN tbl_repair_request_substatus ss ON ss.SubStatusId=rr.SubStatusId
LEFT JOIN tbl_repair_request_part_location l ON l.RRPartLocationId=rr.RRPartLocationId
where  rr.IsDeleted= 0 `;
  if (TokenIdentityType == 0 && IsRestrictedCustomerAccess == 1 && MultipleCustomerIds != "") {
    TotalCountQuery += ` and rr.CustomerId in(${MultipleCustomerIds}) `;
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

      // console.log("TotalCount : " + results[2][0][0].TotalCount)
      result(null, {
        data: results[0][0], recordsFiltered: results[1][0][0].recordsFiltered,
        recordsTotal: results[2][0][0].TotalCount, draw: RepairRequest.draw
      });
      return;
    }
  );

};




objModel.getRRStatistics = (Reqbody, result) => {
  var sql = ` SELECT  Status, COUNT(Status) as Count,   
  CASE Status  
  WHEN ${Constants.CONST_RRS_GENERATED} THEN '${Constants.array_rr_status[Constants.CONST_RRS_GENERATED]}'  
  WHEN ${Constants.CONST_RRS_NEED_SOURCED} THEN '${Constants.array_rr_status[Constants.CONST_RRS_NEED_SOURCED]}' 
  WHEN ${Constants.CONST_RRS_AWAIT_VQUOTE} THEN '${Constants.array_rr_status[Constants.CONST_RRS_AWAIT_VQUOTE]}' 
  WHEN ${Constants.CONST_RRS_NEED_RESOURCED} THEN '${Constants.array_rr_status[Constants.CONST_RRS_NEED_RESOURCED]}' 
  WHEN ${Constants.CONST_RRS_QUOTE_SUBMITTED} THEN '${Constants.array_rr_status[Constants.CONST_RRS_QUOTE_SUBMITTED]}'  
  WHEN ${Constants.CONST_RRS_IN_PROGRESS} THEN '${Constants.array_rr_status[Constants.CONST_RRS_IN_PROGRESS]}'      
  WHEN ${Constants.CONST_RRS_QUOTE_REJECTED} THEN '${Constants.array_rr_status[Constants.CONST_RRS_QUOTE_REJECTED]}' 
  WHEN ${Constants.CONST_RRS_COMPLETED} THEN '${Constants.array_rr_status[Constants.CONST_RRS_COMPLETED]}'  
  WHEN ${Constants.CONST_RRS_NOT_REPAIRABLE} THEN '${Constants.array_rr_status[Constants.CONST_RRS_NOT_REPAIRABLE]}'  
  ELSE '-' end StatusName   
  FROM tbl_repair_request  
  WHERE  IsDeleted = 0  `;
  if (Reqbody.hasOwnProperty('startDate') && Reqbody.hasOwnProperty('endDate')) {
    const Fromdatearray = Reqbody.startDate.split('T');
    const Todatearray = Reqbody.endDate.split('T');
    var fromDate = Fromdatearray[0];//.split("/");
    var toDate = Todatearray[0];//.split("/");   
    sql += ` AND (DATE(Created) BETWEEN  '${fromDate}' AND '${toDate}') `;
  }
  sql += ` GROUP BY Status `;

  //console.log("good :" + sql);

  con.query(sql, (err, res) => {
    if (err) {
      // console.log("error: ", err);
      result(err, null);
      return;
    }
    if (res.affectedRows == 0) {
      result({ msg: "RR not found" }, null);
      return;
    }

    result(null, res);
  });
};


objModel.create = (objModel, result) => {
  var sql = ``;
  sql = `insert into tbl_repair_request_notes(
         RRId,IdentityType,IdentityId,NotesType,Notes,FileName,
         FileUrl,FileMimeType,FileSize,Created,CreatedBy)
         values(?,?,?,?,?,?,?,?,?,?,?)`;
  objModel.FileName = objModel.FileName ? objModel.FileName : '';
  var values = [
    objModel.RRId, objModel.IdentityType, objModel.IdentityId, objModel.NotesType, objModel.Notes, objModel.FileName,
    objModel.FileUrl, objModel.FileMimeType, objModel.FileSize, objModel.Created, objModel.CreatedBy
  ]

  con.query(sql, values, (err, res) => {
    if (err) {
      // console.log("error: ", err);
      result(err, null);
      return;
    }
    objModel.NotesId = res.insertId;
    //console.log("created new Notes : ", { NotesId: res.insertId, ...objModel });
    result(null, { id: res.insertId, ...objModel });
  });
};


objModel.getAll = (result) => {

  var sql = ``;

  sql = `SELECT RRId,NotesType,
    case NotesType
      WHEN 1 THEN '${Constants.array_notes_type[1]}'
      WHEN 2 THEN '${Constants.array_notes_type[2]}'
      WHEN 3 THEN '${Constants.array_notes_type[3]}'
      ELSE '-'
      end NotesTypeName,
    Notes,FileName,FileUrl,FileMimeType,FileSize,Created
    FROM tbl_repair_request_notes WHERE
    IsDeleted=0`;
  con.query(sql, (err, res) => {
    if (err) {
      // console.log("error: ", err);
      result(err, null);
      return;
    }
    result(null, res);
    return;
  });
};

objModel.findById = (NotesId, result) => {
  var sql = `SELECT IdentityId,IdentityType, RRId,NotesType,
    case NotesType
      WHEN 1 THEN '${Constants.array_notes_type[1]}'
      WHEN 2 THEN '${Constants.array_notes_type[2]}'
      WHEN 3 THEN '${Constants.array_notes_type[3]}'
      ELSE '-'
      end NotesTypeName,
      Notes,FileName,FileUrl,FileSize,FileMimeType,Created
     FROM tbl_repair_request_notes WHERE NotesId = ${NotesId}`;

  con.query(sql, (err, res) => {
    if (err) {
      // console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      // console.log("found the Notes: ", res[0]);
      result(null, res[0]);
      return;
    }

    // not found Department with the id
    result({ kind: "Notes not found" }, null);
  });
};


objModel.updateById = (objModel, result) => {
  var sql = `UPDATE tbl_repair_request_notes 
    SET RRId = ?,NotesType = ?,Notes = ?,
    FileName = ?,FileUrl = ?,FileMimeType = ?,FileSize = ?,Modified = ?,ModifiedBy = ? WHERE NotesId = ?`;
  var values = [
    objModel.RRId, objModel.NotesType, objModel.Notes, objModel.FileName,
    objModel.FileUrl, objModel.FileMimeType, objModel.FileSize, objModel.Modified, objModel.ModifiedBy, objModel.NotesId
  ];
  // console.log("values=" + values)
  con.query(sql, values, (err, res) => {

    if (err) {
      // console.log("error: ", err);
      result(null, err);
      return;
    }
    if (res.affectedRows == 0) {
      // not found Department with the id
      result({ kind: "not_found" }, null);
      return;
    }

    result(null, { id: objModel.NotesId, ...objModel });
  }
  );
  // console.log("Updated Notes !");
};

objModel.remove = (id, result) => {
  var Obj = new objModel({ NotesId: id });
  var sql = `UPDATE tbl_repair_request_notes SET IsDeleted = 1,Modified='${Obj.Modified}',ModifiedBy='${Obj.ModifiedBy}' WHERE NotesId = ${Obj.NotesId}`;
  con.query(sql, (err, res) => {

    if (err) {
      // console.log("error: ", err);
      result(null, err);
      return;
    }

    if (res.affectedRows == 0) {
      result({ kind: "not_found" }, null);
      return;
    }
    // console.log("deleted Notes with NotesId: ", id);
    result(null, res);
  });
};


objModel.DeleteRRNotesQuery = (IdentityType, IdentityId) => {
  var Obj = new objModel({ IdentityId: IdentityId });
  var sql = `UPDATE tbl_repair_request_notes SET IsDeleted=1,Modified='${Obj.Modified}',ModifiedBy='${Obj.ModifiedBy}' WHERE  IsDeleted = 0 AND IdentityId>0 AND IdentityType=${IdentityType} and IdentityId=${IdentityId}`;
  return sql;
}


objModel.ViewNotes = (IdentityType, IdentityId) => {
  var sql = `Select NotesId,RRId,NotesType,Notes,N.IdentityId,N.IdentityType, 
    CASE NotesType
    WHEN 1 THEN '${Constants.array_notes_type[1]}'
    WHEN 2 THEN '${Constants.array_notes_type[2]}'
    WHEN 3 THEN '${Constants.array_notes_type[3]}'
    ELSE '-'
    end NotesTypeName,FileName,REPLACE(FileUrl,'${Constants.CONST_BUCKET_PATH_SUBDOMAIN}','${Constants.CONST_BUCKET_PATH_AWS_DOMAIN}') as FileUrl,FileSize,FileMimeType, N.Created, N.CreatedBy,U.FirstName,U.LastName,U.Username
    from tbl_repair_request_notes as N
    LEFT JOIN tbl_users as U ON U.UserId = N.CreatedBy
    where N.IsDeleted=0  and N.IdentityType=${IdentityType} AND N.IdentityId>0 and N.IdentityId=${IdentityId}`;
  //console.log(sql);
  return sql;
}

objModel.ViewRRCustomerNotes = (IdentityType, IdentityId) => {
  var sql = `Select NotesId,RRId,NotesType,Notes,IdentityId,IdentityType, 
    CASE NotesType
    WHEN 1 THEN '${Constants.array_notes_type[1]}'
    WHEN 2 THEN '${Constants.array_notes_type[2]}'
    WHEN 3 THEN '${Constants.array_notes_type[3]}'
    ELSE '-'
    end NotesTypeName,FileName,REPLACE(FileUrl,'${Constants.CONST_BUCKET_PATH_SUBDOMAIN}','${Constants.CONST_BUCKET_PATH_AWS_DOMAIN}') as FileUrl,FileSize,FileMimeType, Created
    from tbl_repair_request_notes where IsDeleted=0  and NotesType = 2 AND IdentityType=${IdentityType} AND IdentityId>0 and IdentityId=${IdentityId}`;
  //console.log(sql);
  return sql;
}
objModel.ViewRRVendorNotes = (IdentityType, IdentityId) => {
  var sql = `Select NotesId,RRId,NotesType,Notes,IdentityId,IdentityType, 
    CASE NotesType
    WHEN 1 THEN '${Constants.array_notes_type[1]}'
    WHEN 2 THEN '${Constants.array_notes_type[2]}'
    WHEN 3 THEN '${Constants.array_notes_type[3]}'
    ELSE '-'
    end NotesTypeName,FileName,REPLACE(FileUrl,'${Constants.CONST_BUCKET_PATH_SUBDOMAIN}','${Constants.CONST_BUCKET_PATH_AWS_DOMAIN}') as FileUrl,FileSize,FileMimeType, Created
    from tbl_repair_request_notes where IsDeleted=0  and NotesType = 3 AND IdentityType=${IdentityType} AND IdentityId>0 and IdentityId=${IdentityId}`;
  //console.log(sql);
  return sql;
}
objModel.ViewRRNotesByNoteType = (NoteType, IdentityId) => {
  var sql = `Select NotesId,RRId,NotesType,Notes,IdentityId,IdentityType, 
    CASE NotesType
    WHEN 1 THEN '${Constants.array_notes_type[1]}'
    WHEN 2 THEN '${Constants.array_notes_type[2]}'
    WHEN 3 THEN '${Constants.array_notes_type[3]}'
    ELSE '-'
    end NotesTypeName,FileName,REPLACE(FileUrl,'${Constants.CONST_BUCKET_PATH_SUBDOMAIN}','${Constants.CONST_BUCKET_PATH_AWS_DOMAIN}') as FileUrl,FileSize,FileMimeType, Created
    from tbl_repair_request_notes where IsDeleted=0  and NotesType =${NoteType} AND IdentityId>0 and IdentityId=${IdentityId}`;
  //console.log(sql);
  return sql;
}

objModel.getRRPrice = (RRId, result) => {
  var sql = `Select IF(i.GrandTotal>=0,CONCAT('$',' ',i.GrandTotal),
  If(q.GrandTotal >=0,CONCAT('$',' ',q.GrandTotal),'TBD')) as  InvoiceAmountOrQuoteAmount
  FROM tbl_repair_request rr
  LEFT JOIN tbl_quotes q on q.RRId=rr.RRId and q.RRId>0 and q.Status In(1,2,4) and q.QuoteCustomerStatus In(1,2,3) and q.IsDeleted = 0 
  LEFT JOIN tbl_invoice as i ON i.InvoiceId = rr.CustomerInvoiceId AND i.IsDeleted = 0
  where  rr.IsDeleted= 0 AND rr.RRId=${RRId}`;
  con.query(sql, (err, res) => {

    if (err) {
      // console.log("error: ", err);
      result(null, err);
      return;
    }
    result(null, res[0]);
  });
}
objModel.getRRCustomerReference = (RRId, result) => {
  var sql = RRCustomerRef.ViewCustomerReference(RRId);
  con.query(sql, (err, res) => {

    if (err) {
      // console.log("error: ", err);
      result(null, err);
      return;
    }
    result(null, res);
  });
}
module.exports = objModel;
