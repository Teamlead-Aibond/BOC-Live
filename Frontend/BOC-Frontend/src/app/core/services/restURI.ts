let URI = {
    //Global Search Auto Suggents
    'GlobalAutoSuggest': '/api/v1.0/repairrequest/GlobalAutoSuggest',
    'changeDefaultLocation': '/users/changeLocation',
    'onUpdatePreferredVendor': '/api/v1.0/parts/preferred_vendor/update',
    'getRRMyWorksListByServerSide': '/api/v1.0/repairrequestnotes/getRRMyWorksListByServerSide',


    //SettingsGeneral
    'getSettingsGeneralView': '/api/v1.0/SettingsGeneral/view',
    'UpdateSettings': '/api/v1.0/SettingsGeneral/update',
    'getAHGroupVendorAddress': '/api/v1.0/address/GetAHGroupVendorAddress',

    //Notification
    'getLatestNotification': '/api/v1.0/notification/getLatest',
    'getWorkchainCount': '/api/v1.0/repairRequest/WorkchainMyTaskCount',

    //Dashboard
    'LoggedInStatus': '/api/v1.0/repairrequest/loggedInStatusBarChart',
    'DashboardStatisticsCount': '/api/v1.0/repairrequest/DashboardStatisticsCount',
    'POListWithOutPartId': '/api/v1.0/PurchaseOrder/POListWithOutPartId',
    'UpdateMissingPartIdInPO': '/api/v1.0/PurchaseOrder/UpdateMissingPartIdInPO',
    'DashboardStatusCount': '/api/v1.0/repairRequest/AHNewDashboardStatisticsCount',

    //ChangePassword
    'getChangePwd': '/users/changePassword',
    'changePasswordByAdmin': '/users/changePasswordByAdmin',


    //SearchPartByPartNo
    'getonSearchPartByPartNo': '/api/v1.0/parts/SearchPartByPartNo',
    'SearchNonRepairPartByPartNo': '/api/v1.0/parts/SearchNonRepairPartByPartNo',
    'checkPartId': '/api/v1.0/parts/checkPartId',


    // Common Dropdowns        
    'getCustomerListDropdown': '/api/v1.0/customers/getAllActive',
    'getAddressList': '/api/v1.0/address/list',
    'getVendorListDropdown': '/api/v1.0/vendor/getAllActive ',
    'getDepartmentListDropdown': '/api/v1.0/department/list',
    'getAssetListDropdown': '/api/v1.0/customersasset/getAll',
    'getAllAutoComplete': '/api/v1.0/customers/getAllAutoComplete',
    'getAllAutoCompleteofVendor': '/api/v1.0/vendor/getAllAutoComplete',
    'getAllAutoCompleteofVendorMRO': '/api/v1.0/vendor/getAllAutoCompleteMRO',
    'RRNoAotoSuggest': '/api/v1.0/repairRequest/RRNoAotoSuggest',
    'VendorPOAutoSuggest': '/api/v1.0/repairRequest/VendorPOAutoSuggest',
    'CustomerPOAutoSuggest': '/api/v1.0/repairRequest/CustomerPOAutoSuggest',
    'SONoAutoSuggest': '/api/v1.0/repairRequest/SONoAutoSuggest',
    'getCurrencyCode': '/api/v1.0/country/view',

    //'getAdminListDropdown'           : '/api/v1.0/customersasset/getAll',   
    'getCustomerReferenceListDropdown': '/api/v1.0/customerRefLabel/list',
    'getCustomerDepartmentListDropdown': '/api/v1.0/customersdepartment/list',
    'getPartListDropdown': '/api/v1.0/customerParts/list',  //'/api/v1.0/parts/list',
    'getStateListDropdown': '/api/v1.0/state/list/',
    'getPartListDD': '/api/v1.0/parts/list20',
    'getPON&LPP': '/api/v1.0/invoice/listPartsLPP',
    'getUPSTracking': '/api/v1.0/ups/track',

    // Parts section
    'getPartDetails': '/api/v1.0/parts/view',
    'getPartItemView': '/api/v1.0/parts/PartItemInfo',
    'addPart': '/api/v1.0/parts/addPart',
    'UpdatePart': '/api/v1.0/parts/updatePart',
    'getcheckMROPartsAvailability': '/api/v1.0/parts/checkMROPartsAvailability',

    // Repair Request
    'RepairRequestAdd': '/api/v1.0/repairRequest/create',
    'RepairRequestUploadAttachment': '/api/v1.0/fileUplod/RRAttachment',
    'RepairRequestVendorQuoteUploadAttachment': '/api/v1.0/fileUplod/RRVendorQuoteAttachment',
    'RepairRequestView': '/api/v1.0/repairRequest/view',
    'getRRForLoopQR': '/api/v1.0/repairRequest/getRRForLoopQR',
    'RepairRequestEdit': '/api/v1.0/repairRequest/update',
    'RepairRequestEdit2': '/api/v1.0/repairRequest/updateStep2',
    'getRepairStatistics': '/api/v1.0/repairrequestnotes/getStatistics',
    'RepairRequestDelete': '/api/v1.0/repairRequest/delete',
    'RepairRequestImageDelete': '/api/v1.0/rrimages/delete',
    'RRImageupload': '/api/v1.0/fileUplod/RRImage',
    'CRDelete': '/api/v1.0/customerRefLabel/deleteRRCusRef',
    'CRAdd': '/api/v1.0/RRCReference/create',
    'RRPartsAvailabilityCheck': '/api/v1.0/parts/checkPartsAvailability',
    'RRCustomerPartscreate': '/api/v1.0/customerParts/create',
    'RRNewCustomerPartsCreate': '/api/v1.0/customerParts/addNewPart',
    'RRGetPartPrice': '/api/v1.0/invoice/listPartsLPP',
    'RRFindWarranty': '/api/v1.0/repairRequest/findDuplicateOrWarranty',

    'getRRPrice': '/api/v1.0/repairrequestnotes/getRRPrice',
    'getRRCustomerReference': '/api/v1.0/repairrequestnotes/getRRCustomerReference',


    'getVendorsByKeyword': '/api/v1.0/vendor/getAllAutoComplete',
    'UpdatePON': '/api/v1.0/repairRequest/UpdatePON',

    'RRVendorQuote': '/api/v1.0/RRVendors/view',
    'RRAssignVendor': '/api/v1.0/repairRequest/AssignVendor',
    'RRVendorRemove': '/api/v1.0/repairRequest/RemoveRRVendor',
    'RRVendorPartDelete': '/api/v1.0/repairRequest/DeleteVendorParts',

    'RRVendorQuoteUpdate': '/api/v1.0/repairRequest/UpdateVendorQuote',
    'RRSaveAndCreateCustomerQuote': '/api/v1.0/quotes/SaveAndCreateCustomerQuote',
    'RRVendorQuoteSubmit': '/api/v1.0/repairRequest/AcceptRRVendor',
    'RRVendorQuoteReject': '/api/v1.0/repairRequest/RejectRRVendor',

    'RRCustomerQuoteCreate': '/api/v1.0/quotes/AutoCreate',
    'RRCustomerQuoteView': '/api/v1.0/quotes/view',
    'RRCustomerQuoteEdit': '/api/v1.0/quotes/updatecustomerquote',
    'RRCustomerQuoteSubmit': '/api/v1.0/quotes/submitQuoteToCustomer',
    'RRCustomerQuoteDelete': '/api/v1.0/quotes/deleteQuoteItem',

    'SaveAndSubmitToCustomer': '/api/v1.0/quotes/SaveAndSubmitToCustomer',

    'RRCustomerQuoteApprove': '/api/v1.0/quotes/approveCustomerQuote',
    'RRCustomerQuoteReject': '/api/v1.0/quotes/rejectCustomerQuote',

    'RRCreateSO': '/api/v1.0/SalesOrder/autocreate',
    'RRCreatePO': '/api/v1.0/PurchaseOrder/autocreate',
    'RRCreateInvoice': '/api/v1.0/invoice/autocreate',

    'RRComplete': '/api/v1.0/repairRequest/complete',
    'RRNotRepairable': '/api/v1.0/repairRequest/RRNotRepairable',
    'RRCreateVendorInvoice': '/api/v1.0/VendorInvoice/autocreate',
    'UpdateRRVendorRefNo': '/api/v1.0/RRVendors/UpdateRRVendorRefNo',

    'RRDuplicate': '/api/v1.0/repairRequest/DuplicateRepairRequest',
    'RRListView': '/api/v1.0/customers/CustomerRRListByServerSide',
    'SOListView': '/api/v1.0/customers/CustomerSOListByServerSide',

    'RRRevert': '/api/v1.0/repairRequest/RevertRR',

    'FromRR': '/api/v1.0/repairRequest/CreateInventoryFromRR',

    'SaveCustomerPONo': '/api/v1.0/repairRequest/UpdateCustomerPO',

    'UpdateCustomerPONoInRR': '/api/v1.0/quotes/UpdateCustomerPONoInRR',

    'RRVendorAttachmentstDelete': '/api/v1.0/RRVendorAttachment/Delete',

    "ActiveInActiveRR": "/api/v1.0/repairRequest/ActiveInActiveRR",
    'SetAsPrimaryImage': '/api/v1.0/rrimages/SetAsPrimary',

    'UpdateRRDepartmentWarranty': '/api/v1.0/repairRequest/updateRRDepartmentWarranty',

    //RR Sub Status 
    'RRSubStatusList': '/api/v1.0/RRSubStatus/list',
    'RRSubStatusCreate': '/api/v1.0/RRSubStatus/create',
    'RRSubStatusUpdate': '/api/v1.0/RRSubStatus/update',
    'RRSubStatusView': '/api/v1.0/RRSubStatus/view',
    'RRSubStatusDelete': '/api/v1.0/RRSubStatus/delete',
    'RRSubStatusDDl': '/api/v1.0/RRSubStatus/dropdown',

    //Bulk Shipping
    'SearchListForBulkShipping': '/api/v1.0/repairRequest/SearchListForBulkShipping',
    'BulkShipping': '/api/v1.0/RRShipping/BulkShipping',
    'BulkShipPackingSlip': '/api/v1.0/repairRequest/BulkShipPackingSlip',
    'BulkShipping-Pdf': '/api/v1.0/import/BulkShipping-Pdf',


    //Followup Notes
    'FollowpNotesAdd': '/api/v1.0/RRFollowUpNotes/create',
    'FollowpNotesUpdate': '/api/v1.0/RRFollowUpNotes/update',
    'FollowpNotesDelete': '/api/v1.0/RRFollowUpNotes/delete',



    //MRO
    'createMRO': '/api/v1.0/MRO/createMRO',
    'viewMRO': '/api/v1.0/MRO/viewMRO',
    'updateMRO': '/api/v1.0/MRO/updateMRO',
    'MROAssignVendor': '/api/v1.0/MRO/AssignVendor',
    'MROInventoryAssignVendor': '/api/v1.0/MRO/AssignAHGroupVendor',
    'UpdateMROVendorQuote': '/api/v1.0/MRO/UpdateMROVendorQuote',
    'SaveAndCreateMROCustomerQuote': '/api/v1.0/quotes/SaveAndCreateMROCustomerQuote',
    'SubmitMROQuoteToCustomer': '/api/v1.0/quotes/SubmitMROQuoteToCustomer',
    'MROQuoteView': '/api/v1.0/quotes/MROQuoteView',
    'UpdateMROCustomerQuote': '/api/v1.0/quotes/UpdateMROCustomerQuote',
    'UpdateMROAddCustomerQuote': '/api/v1.0/MRO/updateAddQuotes',
    'ApproveMROCustomerQuote': '/api/v1.0/quotes/ApproveMROCustomerQuote',
    'RejectMROCustomerQuote': '/api/v1.0/quotes/RejectMROCustomerQuote',
    'MROAutoSOCreate': '/api/v1.0/SalesOrder/MROAutoCreate',
    'MROAutoPOCreate': '/api/v1.0/PurchaseOrder/MROAutoCreate',
    'MROAutoInvoiceCreate': '/api/v1.0/invoice/MROAutoCreate',
    'MROComplete': '/api/v1.0/MRO/Complete',
    'MROVendorQuoteReject': '/api/v1.0/MRO/RejectMROVendor',
    'MROVendorRemove': '/api/v1.0/MRO/RemoveMROVendor',
    'MROCreateVendorInvoice': '/api/v1.0/VendorInvoice/MROAutoCreate',
    'UpdateMROStep2': '/api/v1.0/MRO/UpdateMROStep2',
    'MRODelete': '/api/v1.0/MRO/DeleteMRO',
    'RevertMROShipping': '/api/v1.0/RRShipping/MRORevert',
    'MROCustomerQuoteCreate': '/api/v1.0/quotes/MROAutoCreate',
    'VendorQuoteBySO': '/api/v1.0/MRO/VendorQuoteBySO',
    'CreatePOByMRO': '/api/v1.0/PurchaseOrder/CreatePOByMRO',

    'GetMROFollowUpGetContent': '/api/v1.0/FollowUp/GetMROFollowUpGetContent',
    'CreateMROFollowup': '/api/v1.0/FollowUp/MROCreate',
    'GetMROEmailContent': '/api/v1.0/Email/GetMROEmailContent',
    'MROSendEmail': '/api/v1.0/Email/MROSendEmail',

    'MROUpdatePartCurrentLocation': '/api/v1.0/MRO/UpdatePartCurrentLocation',
    'MROReceive': '/api/v1.0/RRShipping/MROReceive',
    'MROShipping': '/api/v1.0/RRShipping/MROship',
    'PackingSlipMRO': '/api/v1.0/MRO/PackingSlip',
    'MROShippingHistoryUpdate': '/api/v1.0/MROShippingHistory/update',

    'GetMROStatistics': '/api/v1.0/MRO/GetMROStatistics',
    'MROCREFcreate': '/api/v1.0/RRCReference/MROcreate',
    'changeStatusToQuoted': '/api/v1.0/MRO/changeStatusToQuoted',

    'MRODuplicate': '/api/v1.0/MRO/DuplicateMRO',
    'MRORejected': '/api/v1.0/MRO/RejectMRO',
    'MROInvoiceDetailedReportCSV': '/api/v1.0/InvoiceReports/MROInvoiceDetailedReportCSV',


    'ActiveInActiveMRO': '/api/v1.0/MRO/ActiveInActiveMRO',

    //Quote sectionof new MRO
    'UpdateMROSingleCustomerQuote': '/api/v1.0/quotes/UpdateMROSingleCustomerQuoteItem',
    'ViewMROSingleCustomerQuoteItem': '/api/v1.0/quotes/ViewMROSingleCustomerQuoteItem',

    //SO Create Of new MRO
    'MROSOCreate': '/api/v1.0/SalesOrder/CreateSOByMRO',


    //Vendor section of new MRO
    'ViewMROVendorInfo': '/api/v1.0/MRO/ViewMROVendorInfo',


    //Ship & Receive of new MRO
    'ShipAndReceive': '/api/v1.0/MROShippingHistory/ShipAndReceive',
    'Ship': '/api/v1.0/MROShippingHistory/Ship',
    'Receive': '/api/v1.0/MROShippingHistory/Receive',

    //Vendor Invoice Of new MRO
    'MROVendorInvoiceCreate': '/api/v1.0/VendorInvoice/MROAutoCreate',

    //Shipping
    'RRShipping': '/api/v1.0/RRShipping/ship',
    'RRreceive': '/api/v1.0/RRShipping/receive',
    'RRupdateShipping': '/api/v1.0/RRShipping/update',
    'PackingSlip': '/api/v1.0/repairRequest/PackingSlip',
    'ShipViaList': '/api/v1.0/RRShipping/shipViaList',
    'RRLog': '/api/v1.0/notification/getRRNotificationList',
    'UpdatePartCurrentLocation': '/api/v1.0/repairRequest/UpdatePartCurrentLocation',
    'RevertRRShipping': '/api/v1.0/RRShipping/revert',
    'UpdateReadyForPickUpToPickUp': '/api/v1.0/RRShipping/UpdateReadyForPickUpToPickUp',
    'RRShipHistoryListByVendor': '/api/v1.0/RRShipping/ClientSideRRShipHistoryListByVendor',

    'UPSCreate': '/api/v1.0/ups/create',
    'UPSCancel': '/api/v1.0/ups/void',
    'UPSView': '/api/v1.0/ups/view',
    'UPSGenerateLabel': '/api/v1.0/ups/generateLabel',
    'UPSCancelLabel': '/api/v1.0/ups/cancelLabel',
    'UPSTrackLabel': '/api/v1.0/ups/trackLabel',
    'UPSAddressValidate': '/api/v1.0/ups/addressValidate',
    'UPSBulkCreate': '/api/v1.0/ups/bulk_create',

    //Notes
    'NotesAdd': '/api/v1.0/repairrequestnotes/create',
    'RRNotesAttachment': '/api/v1.0/fileUplod/RRNotes',
    'NotesDelete': '/api/v1.0/repairrequestnotes/delete',
    'NotesUpdate': '/api/v1.0/repairrequestnotes/update',


    //Advance PO
    'CreateBlanketPO': '/api/v1.0/CustomerBlanketPO/Create',
    'UpdateBlanketPO': '/api/v1.0/CustomerBlanketPO/Update',
    'ViewBlanketPO': '/api/v1.0/CustomerBlanketPO/View',
    'ByCustomerBlanketPOList': "/api/v1.0/CustomerBlanketPO/BlanketPOListByCustomerId",
    'TopUpCreate': '/api/v1.0/CustomerBlanketPOTopUp/Create',
    'ListTopUpByPO': '/api/v1.0/CustomerBlanketPOTopUp/ListTopUpByPO',
    'UpdateBlanketPO1': '/api/v1.0/CustomerBlanketPO/Update2',
    'DeleteCustomerBlanketPO': '/api/v1.0/CustomerBlanketPO/Delete',
    'UpdateBlanketPO2': '/api/v1.0/CustomerBlanketPO/Update3',


    //Attachment
    'AttachmentAdd': '/api/v1.0/GlobalAttachment/create',
    'AttachmentUpdate': '/api/v1.0/GlobalAttachment/update',
    'AttachmentView': '/api/v1.0/GlobalAttachment/view',
    'AttachmentDelete': '/api/v1.0/GlobalAttachment/delete',


    //Followup
    'GetFollowup': '/api/v1.0/FollowUp/GetFollowUpGetContent',
    'CreateFollowup': '/api/v1.0/FollowUp/Create',
    'ViewFollowup': '/api/v1.0/FollowUp/View',
    'UpdateFollowupNotes': '/api/v1.0/FollowUp/UpdateNotes',
    'DeleteFollowup': '/api/v1.0/FollowUp/Delete',


    //Email:
    'getEmailContent': '/api/v1.0/Email/GetEmailContent',
    'sendEmail': '/api/v1.0/Email/SendEmail',

    //Commontemplate
    'getAddressView': '/api/v1.0/address/view',
    'getAddressAdd': '/api/v1.0/address/create',
    'getAddressEdit': '/api/v1.0/address/update',
    'getAddressDelete': '/api/v1.0/address/delete',
    'getContactAdd': '/api/v1.0/contact/create',
    'getContactEdit': '/api/v1.0/contact/update',
    'getContactDelete': '/api/v1.0/contact/delete',
    'getDepartmentAdd': '/api/v1.0/customersdepartment/create',
    'getDepartmentEdit': '/api/v1.0/customersdepartment/update',
    'getDepartmentDelete': '/api/v1.0/customersdepartment/delete',
    'getAssetAdd': '/api/v1.0/customersasset/create',
    'getAssetEdit': '/api/v1.0/customersasset/update',
    'getAssetDelete': '/api/v1.0/customersasset/delete',
    'getAttachmentAdd': '/api/v1.0/attachment/create',
    'getAttachmentdelete': '/api/v1.0/attachment/delete',
    'getAttachmentUpdate': '/api/v1.0/attachment/update',
    'getSetprimaryaddress': '/api/v1.0/address/setprimaryaddress',

    // Customer
    'getCustomerList': '/api/v1.0/customers/getCustomerListByServerSide',
    'getCustomerAdd': '/api/v1.0/customers/create',
    'getCustomerEdit': '/api/v1.0/customers/update',
    'getCustomerView': '/api/v1.0/customers/view',
    'getCustomerStatistics': '/api/v1.0/customers/getcustomerstatics',
    'getCustomerViewStatistics': '/api/v1.0/customers/getcustomerviewstatics',
    'getCustomerDelete': '/api/v1.0/customers/delete',
    'getuploadCustomerProfile': '/api/v1.0/fileUplod/customerProfile',
    'getDeleteCustomer': '/api/v1.0/customers/delete',
    'getCustomeruploadAttachment': '/api/v1.0/fileUplod/customerAttachment',
    'CustomerExportToExcel': '/api/v1.0/customers/ExportToExcel',

    'UpdateCustomerRefOrder': '/api/v1.0/customerRefLabel/UpdateCustomerRefRank',
    'getReferencevalueUpdate': '/api/v1.0/RRCreference/update',
    'onUpdateDisplayInQR': '/api/v1.0/customerRefLabel/updateDisplayInQR',
    'updateEditableByCustomer': '/api/v1.0/customerRefLabel/updateEditableByCustomer',

    //CustomerPart
    'getCustomerPartInfoView': '/api/v1.0/customerParts/viewCustomerInfo',
    'getAddCustomerPart': '/api/v1.0/customerParts/create',
    'getCustomerPartDelete': '/api/v1.0/customerParts/delete',
    'getCustomerPartEdit': '/api/v1.0/customerParts/update',
    'CustomerPartListView': '/api/v1.0/parts/PartsListByServerSide',
    'PartsListView': '/api/v1.0/customerParts/CustomerPartsListByServerSide',

    // Vendor
    'getVendorList': '/api/v1.0/vendor/getVendorListByServerSide',
    'getVendorStatistics': '/api/v1.0/vendor/getvendorstatics',
    'getVendorViewStatistics': '/api/v1.0/vendor/getvendorviewstatics',
    'getuploadVendorProfile': '/api/v1.0/fileUplod/vendorProfile',
    'getVendorView': '/api/v1.0/vendor/view',
    'getVendorAdd': '/api/v1.0/vendor/create',
    'getVendoruploadAttachment': '/api/v1.0/fileUplod/vendorAttachment',
    'getVendorEdit': '/api/v1.0/vendor/update',
    'getDeleteVendor': '/api/v1.0/vendor/delete',
    'getReferenceDelete': '/api/v1.0/customerRefLabel/delete',
    'getReferenceCreate': '/api/v1.0/customerRefLabel/create',
    'getReferenceUpdate': '/api/v1.0/customerRefLabel/update',
    'VendorrepairreqView': '/api/v1.0/vendor/VendorRRListByServerSide',
    'VendorPOView': '/api/v1.0/vendor/VendorPOListByServerSide',
    'VendorExportToExcel': '/api/v1.0/vendor/ExportToExcel',

    //Users
    'getLogin': '/users/login',
    'getUserCreate': '/users/create',
    'getUserUpdate': '/users/update',
    'getUserList': '/users/list',
    'getUserListWithFilter': '/users/UserListWithFilter',
    'getUserView': '/users/view',
    'getUserDelete': '/users/delete',
    'getUserimageupload': '/api/v1.0/fileUplod/userProfile',
    'getAllActiveAdmin': '/users/getAllActiveAdmin',
    'UserDeletePermission': '/api/v1.0/UserPermission/DeletePermission',
    'setasprimary': '/users/setasprimary',

    //Department
    'getDepartmentList': '/api/v1.0/department/list',

    //Sales Quote 
    'getAddForm': '/api/v1.0/quotes/create',

    //State 
    'StateAdd': '/api/v1.0/state/create',
    'StateDelete': '/api/v1.0/state/delete',
    'StateView': '/api/v1.0/state/view',
    'getStateUpdate': '/api/v1.0/state/update',
    'getStateList': '/api/v1.0/state/list',

    //Countries
    'CountriesAdd': '/api/v1.0/country/create',
    'CountriesDelete': '/api/v1.0/country/delete',
    'CountriesView': '/api/v1.0/country/view',
    'CountriesEdit': '/api/v1.0/country/update',
    'getCountryList': '/api/v1.0/country/list',
    'getCountryListWithSymbol': '/api/v1.0/country/listwithsymbol',

    //Terms 
    'getTermsList': '/api/v1.0/term/list',
    'TermsAdd': '/api/v1.0/term/create',
    'TermsUpdate': '/api/v1.0/term/update',
    'TermsView': '/api/v1.0/term/view',
    'TermsDelete': '/api/v1.0/term/delete',


    //Orders
    'getSalesOrderView': '/api/v1.0/SalesOrder/view',
    'getPuchaseOrderView': '/api/v1.0/PurchaseOrder/view',
    'editSalesOrder': '/api/v1.0/SalesOrder/update',
    'editPurchaseOrder': '/api/v1.0/PurchaseOrder/update',
    'ApprovedPO': '/api/v1.0/PurchaseOrder/ApprovePO',
    'POCreate': '/api/v1.0/PurchaseOrder/create',
    'SOCreate': '/api/v1.0/SalesOrder/create',
    'AutoCreateInvoice': '/api/v1.0/invoice/autocreate',
    'ApprovedSO': '/api/v1.0/SalesOrder/ApproveSO',
    'SendEmailFromPOList': '/api/v1.0/PurchaseOrder/SendPOEmailByPOList',
    'SendEmailFromSOList': '/api/v1.0/SalesOrder/SendEmailToSalesOrderQuoteBySOList',
    'getSOEmailcontent': '/api/v1.0/SalesOrder/GetEmailContentForSalesOrder',
    'SendEmailToSalesOrder': '/api/v1.0/SalesOrder/SendEmailToSalesOrder',
    'DeleteSO': '/api/v1.0/SalesOrder/delete',
    'DeletePO': '/api/v1.0/PurchaseOrder/delete',
    'DeleteSoItem': '/api/v1.0/SalesOrder/DeleteSOItem',
    'DeletePoItem': '/api/v1.0/PurchaseOrder/DeletePOItem',
    'getSOExportToExcel': '/api/v1.0/SalesOrder/ExportToExcel',
    'getPOExportToExcel': '/api/v1.0/PurchaseOrder/ExportToExcel',
    'CreatesalesOrderCustomerRef': '/api/v1.0/salesOrderCustomerRef/create',
    'ReopenPO': '/api/v1.0/PurchaseOrder/ReOpenPO',
    'CreatePOFromSO': '/api/v1.0/PurchaseOrder/CreatePOFromNormalSO',
    'onMovetoExcludedParts': '/api/v1.0/SalesOrder/addtoexclude',
    'onMovetoParts': '/api/v1.0/SalesOrder/removefromexclude',
    'CancelSO': '/api/v1.0/SalesOrder/CancelSO',


    'getPOPdfBase64': '/api/v1.0/import/po-pdf',
    'getSQPdfBase64': '/api/v1.0/import/sq-pdf',
    'getSQMultiplePdfBase64': '/api/v1.0/import/sq-multiple-pdf',
    'getPSPdfBase64': '/api/v1.0/import/ps-pdf',
    'getSOPdfBase64': '/api/v1.0/import/so-pdf',
    'getVIPdfBase64': '/api/v1.0/import/vi-pdf',
    'getINVPdfBase64': '/api/v1.0/import/inv-pdf',
    'getCINVPdfBase64': '/api/v1.0/import/c-inv-pdf',
    'getINVCSVBase64': '/api/v1.0/import/inv-csv',
    'uploadEDIINVCSV': '/api/v1.0/import/edi-csv',
    'autoUploadINVCSV': '/api/v1.0/import/inv-csv-auto-upload',
    'getWithoutTaxPdfBase64': '/api/v1.0/import/inv-pdf-wo-tax',
    'getPOPdfWithoutTaxBase64': '/api/v1.0/import/po-pdf-wo-tax',


    //Quotes
    'getSalesQuotesView': '/api/v1.0/quotes/view',
    'editSalesQuotes': '/api/v1.0/quotes/update',
    'QuotesCreate': '/api/v1.0/quotes/create',
    'AutoCreateSO': '/api/v1.0/SalesOrder/autocreate',
    'SendEmailFromQuotesList': '/api/v1.0/quotes/SendEmailToCustomerQuoteByQuoteList',
    'DeleteQuote': '/api/v1.0/quotes/delete',
    'DeleteQuoteItem': '/api/v1.0/quotes/deleteQuoteItem',
    'getQuotesExportToExcel': '/api/v1.0/quotes/ExportToExcel',
    'QTDuplicate': '/api/v1.0/quotes/DuplicateQuote',
    'viewQuoteItemUsingPartIdAndMROId': '/api/v1.0/quotes/viewQuoteItemUsingPartIdAndMROId',

    //Invoice
    'getInvoiceView': '/api/v1.0/invoice/view',
    'InvoiceCreate': '/api/v1.0/invoice/create',
    'InvoiceUpdate': '/api/v1.0/invoice/update',
    'SendEmailFromInvoiceList': '/api/v1.0/invoice/SendInvoiceEmailByInvoiceList',
    'DeleteInvoice': '/api/v1.0/Invoice/delete',
    'DeleteInvoiceItem': '/api/v1.0/invoice/DeleteInvoiceItem',
    'ApprovedInvoice': '/api/v1.0/invoice/ApproveInvoice',
    'InvoiceExcel': '/api/v1.0/invoice/ExportToExcel',
    'ReOpenInvoice': '/api/v1.0/invoice/ReOpenInvoice',
    'InvoiceExcelNew': '/api/v1.0/invoice/ExportToExcelNew',
    'CancelInvoice': '/api/v1.0/invoice/CancelInvoice',
    'InvoiceIntacctCSVExport': '/api/v1.0/invoice/IntacctCSVDownload',


    'ConsolidateInvoiceSearch': '/api/v1.0/ConsolidateInvoice/search-list',
    'ConsolidateInvoiceCreate': '/api/v1.0/ConsolidateInvoice/create',
    'ConsolidateInvoiceDelete': '/api/v1.0/ConsolidateInvoice/delete',
    'ConsolidateInvoiceView': '/api/v1.0/ConsolidateInvoice/view',
    'ConsolidateInvoiceUpdate': '/api/v1.0/ConsolidateInvoice/update',
    'ConsolidateInvoiceDeleteDetail': '/api/v1.0/ConsolidateInvoice/delete-detail',

    'EDIInvoiceUpdate': '/api/v1.0/edi/update',
    'EDIInvoiceView': '/api/v1.0/edi/view',
    'EDIStatusddl': '/api/v1.0/edi/status-list',


    //Warranty
    'CreateWarranty': '/api/v1.0/RRWarranty/create',
    'UpdateWarranty': '/api/v1.0/RRWarranty/update',
    'DeleteWarranty': '/api/v1.0/RRWarranty/delete',


    //VendorInvoice
    'getVendorInvoiceView': '/api/v1.0/VendorInvoice/view',
    'getPONOList': '/api/v1.0/PurchaseOrder/POListForVendorBills',
    'VendorInvoiceCreate': '/api/v1.0/VendorInvoice/create',
    'VendorInvoiceUpdate': '/api/v1.0/VendorInvoice/update',
    'DeleteVendorInvoice': '/api/v1.0/VendorInvoice/delete',
    'VendorInvoiceExcelData': '/api/v1.0/VendorInvoice/ExportToExcel',
    'DeleteVendorInvoiceItem': '/api/v1.0/vendorinvoice/DeleteVendorInvoiceItem',
    'ApprovedVendorInvoice': '/api/v1.0/VendorInvoice/ApproveVendorInvoice',
    'ReOpenVendorInvoice': '/api/v1.0/VendorInvoice/ReOpenVendorInvoice',



    //ReportsExcel
    //RR
    'getTotalCostSavingsVsCostofNewReportExportToExcel': '/api/v1.0/RRReports/TotalCostSavingsVsCostofNewReportExportToExcel',
    'getTotalCostSavingsVsLastPricePaidReportExportToExcel': '/api/v1.0/RRReports/TotalCostSavingsVsLastPricePaidReportExportToExcel',
    'getOnTimeDeliveryReportExportToExcel': '/api/v1.0/RRReports/OnTimeDeliveryReportExportToExcel',
    'getOpenOrderReportExportToExcel': '/api/v1.0/RRReports/OpenOrderReportExportToExcel',
    'getProcessFitnessReportExportToExcel': '/api/v1.0/RRReports/ProcessFitnessReportExportToExcel',
    'getOpenOrderBySupplierReport': '/api/v1.0/RRReports/OpenOrderBySupplierReportExportToExcel',
    'getOpenOrderBySupplierReportCount': '/api/v1.0/RRReports/OpenOrderBySupplierReportCount',
    'getFollowUpReportExportToExcel': '/api/v1.0/RRReports/FollowUpReportExportToExcel',
    'getRMAReport': '/api/v1.0/RRReports/RMAReport',
    'getRMAReportExportToExcel': '/api/v1.0/RRReports/RMAReportExportToExcel',
    'getBPIReportExportToExcel': '/api/v1.0/RRReports/BPIReportExportToExcel',
    'getRepairRequestCustomReportExcel': '/api/v1.0/RRReports/RepairRequestCustomReportExcel',
    'CustomerReportAmazonRawCSV': '/api/v1.0/RRReports/CustomerReportAmazonRawCSV',
    'ShipViaExportToExcel': '/api/v1.0/RRReports/RRShipViaReportExcel',
    'ReportByLocation': '/api/v1.0/RRReports/RRStartLocationReportExcel',
    'RRCreatedByUserReportsExcel': '/api/v1.0/RRReports/RRCreatedByUserReportsExcel',
    'getOpenOrderBySupplierWithoutVatReport': '/api/v1.0/RRReports/OpenOrderBySupplierWithoutVatReportExportToExcel',
    'getOpenOrderBySupplierWithoutVatReportCount': '/api/v1.0/RRReports/OpenOrderBySupplierWithoutVatReportCount',

    'getDanaOpenOrderBySupplierReport': '/api/v1.0/RRReports/DanaOpenOrderBySupplierReportExportToExcel',
    'getDanaOpenOrderBySupplierReportCount': '/api/v1.0/RRReports/DanaOpenOrderBySupplierReportCount',

    //SO
    'getSalesOrderByCustomerReportToExcel': '/api/v1.0/SalesOrderReports/SalesOrderByCustomerReportToExcel',
    'getSalesByPartsReportToExcel': '/api/v1.0/SalesOrderReports/SalesByPartsReportToExcel',
    'getSalesByMonthReportToExcel': '/api/v1.0/SalesOrderReports/SalesByMonthReportToExcel',
    'getSalesByMonthReportToExcelNew': '/api/v1.0/SalesOrderReports/SalesByMonthReportToExcelNew',
    'ParticularMonthSOByCustomerToExcel': '/api/v1.0/SalesOrderReports/ParticularMonthSOByCustomerToExcel',
    'ParticularMonthSOByCustomerToExcelNew': '/api/v1.0/SalesOrderReports/ParticularMonthSOByCustomerToExcelNew',
    'SODetailedReport': '/api/v1.0/SalesOrderReports/SODetailedReport',
    'SODetailedReportNew': '/api/v1.0/SalesOrderReports/SODetailedReportNew',
    'UpdateNonRRAndNonMROCustomerPONoInSO': '/api/v1.0/SalesOrder/UpdateNonRRAndNonMROCustomerPONoInSO',



    'SODetailedReportWithCurrency': '/api/v1.0/SalesOrderReports/SODetailedReportWithCurrency',
    'SalesByMonthReportToExcelWithCurrency': '/api/v1.0/SalesOrderReports/SalesByMonthReportToExcelWithCurrency',
    'ParticularMonthSOByCustomerToExcelWithCurrency': '/api/v1.0/SalesOrderReports/ParticularMonthSOByCustomerToExcelWithCurrency',


    //PO
    'getPurchasesByMonthReportToExcel': '/api/v1.0/POReports/PurchasesByMonthReportToExcel',
    'getPurchasesByVendorReportToExcel': '/api/v1.0/POReports/PurchasesByVendorReportToExcel',
    'getPurchasesByItemReportToExcel': '/api/v1.0/POReports/PurchasesByItemReportToExcel',
    //Invoice
    'getInvoiceByCustomerReportToExcel': '/api/v1.0/InvoiceReports/InvoiceByCustomerReportToExcel',
    'getInvoiceByPartsReportToExcel': '/api/v1.0/InvoiceReports/InvoiceByPartsReportToExcel',
    'getInvoiceByMonthReportToExcel': '/api/v1.0/InvoiceReports/InvoiceByMonthReportToExcel',
    'getInvoiceByMonthReportToExcelNew': '/api/v1.0/InvoiceReports/InvoiceByMonthReportToExcelNew',
    'getParticularMonthInvoiceByCustomerToExcel': '/api/v1.0/InvoiceReports/ParticularMonthInvoiceByCustomerToExcel',
    'getParticularMonthInvoiceByCustomerToExcelNew': '/api/v1.0/InvoiceReports/ParticularMonthInvoiceByCustomerToExcelNew',
    'getInvoiceDetailedReport': '/api/v1.0/InvoiceReports/InvoiceDetailedReport',
    'InvoiceBlanketPOUpdate': '/api/v1.0/invoice/UpdateNonRRAndNonMROCustomerPONoInInvoice',
    'getInvoiceByCustomerReportToCSV': '/api/v1.0/InvoiceReports/InvoiceDetailedReportCSV',
    'getInvoiceDetailedReportNew': '/api/v1.0/InvoiceReports/InvoiceDetailedReportNew',


    'getInvoiceByMonthWithCurrency': '/api/v1.0/InvoiceReports/InvoiceByMonthWithCurrency',
    'getParticularMonthInvoiceByCustomerWithCurrency': '/api/v1.0/InvoiceReports/ParticularMonthInvoiceByCustomerWithCurrency',
    'InvoiceByMonthReportToExcelWithCurrency': '/api/v1.0/InvoiceReports/InvoiceByMonthReportToExcelWithCurrency',
    'ParticularMonthInvoiceByCustomerToExcelWithCurrency': '/api/v1.0/InvoiceReports/ParticularMonthInvoiceByCustomerToExcelWithCurrency',
    'InvoiceDetailedReportWithCurrency': '/api/v1.0/InvoiceReports/InvoiceDetailedReportWithCurrency',

    //Reports
    'StatusReport': '/api/v1.0/repairRequest/StatusReport',
    'FailureTrendAnalysisReportBySupplier': '/api/v1.0/repairRequest/FailureTrendAnalysisReportBySupplier',
    'RepairSavingsReport': '/api/v1.0/repairRequest/RepairAndSavingsReport',
    'GMCostSavingReportExcel': '/api/v1.0/RRReports/GMCostSavingReportExcel',
    'DanaCostSavingReport': '/api/v1.0/repairRequest/DanaCostSavingReport',
    'DanaCostSavingReportExcel': '/api/v1.0/RRReports/DanaCostSavingReportExcel',
    'GMRepairTrackerReportExcel': '/api/v1.0/RRReports/GMRepairTrackerReportExcel',


    'SOTaxVatReportToExcel': '/api/v1.0/SalesOrderReports/SOTaxVatReportToExcel',
    'POTaxVatReportToExcel': '/api/v1.0/POReports/POTaxVatReportToExcel',
    'PayableReportDetailsToExcel': '/api/v1.0/SalesOrderReports/PayableReportDetailsToExcel',
    'RRARReportsToExcel': '/api/v1.0/RRReports/RRARReportsToExcel',


    //Manufacturer List Dropdown
    'getManufacturerList': '/api/v1.0/vendor/manufacturerList',
    'getManufacturerListWithChecked': '/api/v1.0/vendor/manufacturerListWithChecked',
    'ManufacturerAutoSuggest': '/api/v1.0/vendor/ManufacturerAutoSuggest',

    //Warehouse
    'getWarehouseList': '/api/v1.0/warehouse/list',
    'createWarehouse': '/api/v1.0/warehouse/create',
    'updateWarehouse': '/api/v1.0/warehouse/update',
    'deleteWarehouse': '/api/v1.0/warehouse/delete',
    'viewWarehouse': '/api/v1.0/warehouse/view',

    //Building
    'getWarehouseSub1List': '/api/v1.0/WarehouseSublevel1/list',
    'createWarehouseSub1': '/api/v1.0/WarehouseSublevel1/create',
    'updateWarehouseSub1': '/api/v1.0/WarehouseSublevel1/update',
    'deleteWarehouseSub1': '/api/v1.0/WarehouseSublevel1/delete',
    'viewWarehouseSub1': '/api/v1.0/WarehouseSublevel1/view',

    //Room
    'getWarehouseSub2List': '/api/v1.0/WarehouseSublevel2/list',
    'createWarehouseSub2': '/api/v1.0/WarehouseSublevel2/create',
    'updateWarehouseSub2': '/api/v1.0/WarehouseSublevel2/update',
    'deleteWarehouseSub2': '/api/v1.0/WarehouseSublevel2/delete',
    'viewWarehouseSub2': '/api/v1.0/WarehouseSublevel2/view',

    //Row   
    'getWarehouseSub3List': '/api/v1.0/WarehouseSublevel3/list',
    'createWarehouseSub3': '/api/v1.0/WarehouseSublevel3/create',
    'updateWarehouseSub3': '/api/v1.0/WarehouseSublevel3/update',
    'deleteWarehouseSub3': '/api/v1.0/WarehouseSublevel3/delete',
    'viewWarehouseSub3': '/api/v1.0/WarehouseSublevel3/view',

    //Shelf
    'getWarehouseSub4List': '/api/v1.0/WarehouseSublevel4/list',
    'createWarehouseSub4': '/api/v1.0/WarehouseSublevel4/create',
    'updateWarehouseSub4': '/api/v1.0/WarehouseSublevel4/update',
    'deleteWarehouseSub4': '/api/v1.0/WarehouseSublevel4/delete',
    'viewWarehouseSub4': '/api/v1.0/WarehouseSublevel4/view',

    // Inventory List
    'getInventoryByServerSide': '/api/v1.0/parts/getInventoryByServerSide',

    //Add Inventory
    'InventoryPartAdd': '/api/v1.0/parts/CreateInventory',
    'InventoryPartUpdate': '/api/v1.0/parts/UpdateInventory',
    'PartImageupload': '/api/v1.0/fileUplod/PartImages',
    'getInventoryView': '/api/v1.0/parts/ViewInventory',
    'ViewPartImages': '/api/v1.0/parts/ViewPartImages',


    //Inventory Dashboard
    'InventoryDashboardStatisticsCount': '/api/v1.0/Inventory/InventoryDashboardStatisticsCount',
    'DashboardSummaryStatisticsCount': '/api/v1.0/Inventory/DashboardSummaryStatisticsCount',

    //Inventory RFID Dashboard
    'RFIDDashboardStatisticsCount': '/api/v1.0/Inventory/RFIDDashboardStatisticsCount',
    'LatestStockInStockOutList': '/api/v1.0/Inventory/LatestStockInStockOutList',
    'LineChartDayWise': '/api/v1.0/Inventory/LineChartDayWise',
    'StockOutSuccess': '/api/v1.0/InventoryStockout/StockOutSuccess',

    'RFIDDashboardV1Statistics': '/api/v1.0/Inventory/RFIDDashboardV1Statistics',

    // RFID Config

    'GetRFIDConfig': '/api/v1.0/SettingsGeneral/GetRFIDConfig',


    //Inventory Notification settings
    'InventoryNotificationsettingsView': '/api/v1.0/SettingsGeneral/view',
    'UpdateInventorySettings': '/api/v1.0/Inventory/UpdateInventorySettings',

    //Stockout   
    'getPartsTracking': '/api/v1.0/parts/PartsTracking',
    'getPartstrackingByRFIdTagNo': '/api/v1.0/parts/PartstrackingByRFIdTagNo',
    'getPartstrackingByRFIdTagNos': '/api/v1.0/parts/PartstrackingByRFIdTagNos',
    'AddStactout': '/api/v1.0/InventoryStockout/Create',
    'InventoryStockoutList': '/api/v1.0/InventoryStockout/List',
    'DeleteStockout': '/api/v1.0/InventoryStockout/Delete',
    'AutoCheckout': '/api/v1.0/Inventory/AutoCheckout',
    'ResetStockOut': '/api/v1.0/InventoryStockout/Reset',

    //Stockin
    'GetPODetails': '/api/v1.0/PoItem/GetPODetails',
    'GetPartByPartNo': '/api/v1.0/parts/GetPartByPartNo',
    'CheckRFIDTagExists': '/api/v1.0/InventoryStockIn/CheckRFIDTagExists',
    'addNewPartItems': '/api/v1.0/parts/addNewPartItems',
    'updateNewPartItems': '/api/v1.0/parts/updateNewPartItems',
    'RFIDTempCreate': '/api/v1.0/temp/rfid/create',
    'RFIDTempList': '/api/v1.0/temp/rfid/list',
    'RFIDTempDelete': '/api/v1.0/temp/rfid/delete',
    'getEmployeeNo': '/api/v1.0/employee/getEmployeeNo',
    //'CheckRFIDTagTempExists': '/api/v1.0/InventoryStockIn/CheckRFIDTagTempExists',

    //Loss Prevention
    'createLossPreventionLog': '/api/v1.0/Inventory/createLossPreventionLog',

    //Indent

    'CreateIndent': '/api/v1.0/InventoryIndent/Create',
    "getWarehouseListByUserId": '/api/v1.0/warehouse/GetWareHouseByUserId',

    'GetInventoryItemsByIndentNo': '/api/v1.0/InventoryIndent/GetInventoryItemsByIndentNo',

    //Transfer
    'CreateMultipleTransfer': '/api/v1.0/InventoryTransfer/CreateMultiple',
    "GetProductByTransferNo": '/api/v1.0/InventoryReceived/GetProductByTransferNo',
    "CreateReceivedPrductByList": '/api/v1.0/InventoryReceived/CreateReceivedPrductByList',


    //Currency
    'CreateCurrency': '/api/v1.0/currency/create',
    "GetCurrencyList": '/api/v1.0/currency/list',
    "UpdateCurrency": '/api/v1.0/currency/update',
    "ViewCurrency": '/api/v1.0/currency/view',
    "DeleteCurrency": '/api/v1.0/currency/delete',
    "Currencyddl": '/api/v1.0/currency/dropdown',
    'Exchange': '/api/v1.0/currencyExchangeRate/exchange',


    //Currency Exchange Rate
    'CreateCurrencyExchangeRate': '/api/v1.0/currencyExchangeRate/create',
    "GetCurrencyExchangeRateList": '/api/v1.0/currencyExchangeRate/list',
    "UpdateCurrencyExchangeRate": '/api/v1.0/currencyExchangeRate/update',
    "ViewCurrencyExchangeRate": '/api/v1.0/currencyExchangeRate/view',
    "DeleteCurrencyExchangeRate": '/api/v1.0/currencyExchangeRate/delete',

    //RR Part Location
    'RRPartLocationList': '/api/v1.0/RRPartLocation/list',
    'RRPartLocationCreate': '/api/v1.0/RRPartLocation/create',
    'RRPartLocationUpdate': '/api/v1.0/RRPartLocation/update',
    'RRPartLocationView': '/api/v1.0/RRPartLocation/view',
    'RRPartLocationDelete': '/api/v1.0/RRPartLocation/delete',
    'RRPartLocationDDl': '/api/v1.0/RRPartLocation/dropdown',


    'RRPartLocationEdit': '/api/v1.0/repairRequest/UpdateRRPartsLocation',
    'RRSubStatusEdit': '/api/v1.0/repairRequest/UpdateRRSubStatus',
    'RRAssigneeEdit': '/api/v1.0/repairRequest/UpdateRRAssignee',

    "BulkEditSubStatusAssignee": '/api/v1.0/repairRequest/WorkchainBulkUpdate',



    //Employee
    'CreateEmployee': '/api/v1.0/employee/create',
    "UpdateEmployee": '/api/v1.0/employee/update',
    "ViewEmployee": '/api/v1.0/employee/view',
    "DeleteEmployee": '/api/v1.0/employee/delete',
    "ResponsibilityDDL": '/api/v1.0/employee/responsibilityddllist',
    "CreateResponsibility": '/api/v1.0/employee/responsibilitycreate',
    "UpdateResponsibility": '/api/v1.0/employee/responsibilityupdate',
    "ViewResponsibility": '/api/v1.0/employee/responsibilityview',
    "DeleteResponsibility": '/api/v1.0/employee/responsibilitydelete',
    "ResponsibilityList": '/api/v1.0/employee/responsibilitylist',

    //****************************Vendor Module********************** **************/

    //Dashboard
    'VendorloggedInStatusBarChart': '/api/v1.0/VendorPortal/VendorloggedInStatusBarChart',
    'VendorDashboardStatisticsCount': '/api/v1.0/VendorPortal/VendorDashboardStatisticsCount',


    //Profile
    'ViewVendorProfile': '/api/v1.0/VendorPortal/ViewProfile',
    'UpdateVendorProfile': '/api/v1.0/VendorPortal/UpdateProfile',
    'ViewUserProfile': '/api/v1.0/VendorPortalProfile/ViewUserProfile',
    'UpdateUserProfile': '/api/v1.0/VendorPortalProfile/UpdateUserProfile',

    //AddressSection
    'CreateAddressVendor': '/api/v1.0/VendorPortalProfile/CreateAddress',
    'UpdateAddressVendor': '/api/v1.0/VendorPortalProfile/UpdateAddress',
    'DeleteAddressVendor': '/api/v1.0/VendorPortalProfile/DeleteAddress',
    'SetPrimaryAddressVendor': '/api/v1.0/VendorPortalProfile/SetPrimaryAddress',

    //ContactSession
    'CreateContactVendor': '/api/v1.0/VendorPortalProfile/CreateContact',
    'UpdateContactVendor': '/api/v1.0/VendorPortalProfile/UpdateContact',
    'DeleteContactVendor': '/api/v1.0/VendorPortalProfile/DeleteContact',

    //UserSection
    'CreateUserVendor': '/api/v1.0/VendorPortalProfile/CreateUser',
    'UpdateUserVendor': '/api/v1.0/VendorPortalProfile/UpdateUser',
    'DeleteUserVendor': '/api/v1.0/VendorPortalProfile/DeleteUser',

    //AttachmentSection
    'CreateAttachementVendor': '/api/v1.0/VendorPortalProfile/CreateAttachment',
    'UpdateAttachmentVendor': '/api/v1.0/VendorPortalProfile/UpdateAttachment',
    'DeleteAttachmentVendor': '/api/v1.0/VendorPortalProfile/DeleteAttachment',

    //ChangePassword
    'ChangePwdVendor': '/api/v1.0/VendorPortal/ChangePassword',

    //Repair Request
    'VendorRRList': '/api/v1.0/VendorPortal/VendorRRListByServerSide',
    'VendorRRView': '/api/v1.0/VendorPortal/RRView',

    //Purchase order
    'POView': '/api/v1.0/VendorPortal/PurchaseOrderByVendorId',

    //VenddorInvoice
    'VendorInvoiceView': '/api/v1.0/VendorPortal/VendorInvoiceByVendorId',



    //****************************Customer Module********************** **************/

    'CustomerloggedInStatusBarChart': '/api/v1.0/CustomerPortal/CustomerloggedInStatusBarChart',
    'CustomerDashboardStatisticsCount': '/api/v1.0/CustomerPortal/CustomerDashboardStatisticsCount',
    'CustomerDropDownListForDashboard': '/api/v1.0/CustomerPortal/CustomerDropDownListForDashboard',
    'CustomerNameAutoSuggest': '/api/v1.0/CustomerPortal/CustomerNameAutoSuggest',

    'ViewCustomerProfile': '/api/v1.0/CustomerPortal/ViewProfile',
    'UpdateCustomerProfile': '/api/v1.0/CustomerPortal/UpdateProfile',
    'ViewCustomerUserProfile': '/api/v1.0/CustomerPortalProfile/ViewUserProfile',
    'UpdateCustomerUserProfile': '/api/v1.0/CustomerPortalProfile/UpdateUserProfile',


    'ListPOTopUpHistory': '/api/v1.0/CustomerPortal/ListPOTopUpHistory',
    'ViewBlanketPOByCustomer': '/api/v1.0/CustomerPortal/ViewBlanketPOByCustomer',



    //AddressSection
    'CreateAddressCustomer': '/api/v1.0/CustomerPortalProfile/CreateAddress',
    'UpdateAddressCustomer': '/api/v1.0/CustomerPortalProfile/UpdateAddress',
    'DeleteAddressCustomer': '/api/v1.0/CustomerPortalProfile/DeleteAddress',
    'SetPrimaryAddressCustomer': '/api/v1.0/CustomerPortalProfile/SetPrimaryAddress',


    //AttachmentSection
    'CreateAttachementCustomer': '/api/v1.0/CustomerPortalProfile/CreateAttachment',
    'UpdateAttachmentCustomer': '/api/v1.0/CustomerPortalProfile/UpdateAttachment',
    'DeleteAttachmentCustomer': '/api/v1.0/CustomerPortalProfile/DeleteAttachment',

    //DepartmentSection
    'DepartmentAddCustomer': '/api/v1.0/CustomerPortalProfile/CreateDepartment',
    'DepartmentEditCustomer': '/api/v1.0/CustomerPortalProfile/UpdateDepartment',
    'DepartmentDeleteCustomer': '/api/v1.0/CustomerPortalProfile/DeleteDepartment',


    //AssetSection
    'AssetAddCustomer': '/api/v1.0/CustomerPortalProfile/CreateAsset',
    'AssetEditCustomer': '/api/v1.0/CustomerPortalProfile/UpdateAsset',
    'AssetDeleteCustomer': '/api/v1.0/CustomerPortalProfile/DeleteAsset',

    //Sales order
    'SOView': '/api/v1.0/CustomerPortal/SOViewByCustomerId',

    //Quotes
    'QuotesView': '/api/v1.0/CustomerPortal/QuoteView',


    //ChangePassword
    'ChangePwdCustomer': '/api/v1.0/CustomerPortal/ChangePassword',


    //Invoice
    'InvoiceView': '/api/v1.0/CustomerPortal/InvoiceViewByCustomerId',

    //Warranty
    'viewWarranty': '/api/v1.0/RRWarranty/view',
    'AddWarranty': '/api/v1.0/CustomerPortal/WarrantyCreate',

    //Elastic Search
    'ElasticSearch': '/api/v1.0/ElasticSearch',
    //Global Search 
    'GlobalSearch': '/api/v1.0/ElasticSearch/global',

    //Repair Request
    'CustomerRRView': '/api/v1.0/CustomerPortal/RRView',
    'RejectQuote': '/api/v1.0/CustomerPortal/RejectCustomerQuoteFromCustomerPortal',
    'CustomerQuoteApprove': '/api/v1.0/CustomerPortal/ApproveCustomerQuote',
    'ByCustomerPortalBlanketPOList': '/api/v1.0/customerportal/BlanketPOListByCustomerId',

    //Tracking
    'TrackingNumber': '/api/v1.0/CustomerPortal/TrackingNumber',



    //Add Inventory
    //'InventoryPartAdd': '/api/v1.0/parts/CreateInventory',

    //Access Rights
    'GetRolePermissionByRole': '/api/v1.0/RolePermission/GetRolePermissionByRoleId',
    'UpdateRolePermission': '/api/v1.0/RolePermission/UpdateRolePermission',
    'GetRolePermissionByUser': '/api/v1.0/UserPermission/GetUserPermissionByUserId',
    'UpdateUserPermission': '/api/v1.0/UserPermission/UpdateUserPermission',

    //User Roles
    'UserRoleAdd': '/api/v1.0/Role/Create',
    'UserRoleDelete': '/api/v1.0/Role/Remove',
    //'UserRoleView': '/api/v1.0/Role/View',
    'UserRoleEdit': '/api/v1.0/Role/Update',
    'UserRoleList': '/api/v1.0/Role/GetAllRoles',
    'ChartStatusByDate': '/api/v1.0/repairRequest/ChartStatusByDate',

    //Damage
    'CreateDamage': '/api/v1.0/InventoryDamage/create',


    "getWarehouseSub2ListByRoomId": '/api/v1.0/WarehouseSublevel3/ListByRoom',
    "trackPart": '/api/v1.0/parts/trackPart',

    "ImportParts": "",


    "RRCreateCustomerAttachment": '/api/v1.0/RRCustomerAttachment/create',
    'RRUpdateCustomerAttachment': '/api/v1.0/RRCustomerAttachment/update',
    'RRDeleteCustomerAttachment': '/api/v1.0/RRCustomerAttachment/delete',
    'RRViewCustomerAttachment': '/api/v1.0/RRCustomerAttachment/view',

    'getWorkchainChartValues': '/api/v1.0/repairRequest/WorkchainMyTaskChart',
    'RepairRequestBatchAdd': '/api/v1.0/repairRequest/create-rr-batch',
    'RepairRequestBatchList': '/api/v1.0/repairRequest/rr-batch-list',
    'getEcommerceProduct': '/api/v1.0/parts/ecommerce/product',
    'addToCart': '/api/v1.0/ecommerce/product/addToCart',
    'getCartCount': '/api/v1.0/ecommerce/product/cartCount',
    'getCart': '/api/v1.0/ecommerce/product/getCart',
    'removeFromCart': '/api/v1.0/ecommerce/product/removeFromCart',
    'changeCartCount': '/api/v1.0/ecommerce/product/changeCartCount',
    'createOrder': '/api/v1.0/ecommerce/order/create',
    'getEcommerceProductView': '/api/v1.0/parts/ecommerce/product/view',

    'getPartCategory': '/api/v1.0/PartCategory/PartCategoryDropdown',
    'updatePartQuantity': '/api/v1.0/parts/updatePartQuantity',
    'shopOrderList': '/api/v1.0/ecommerce/order/listClient',
    'getOrder': '/api/v1.0/ecommerce/order/view',
    'createRequestForQuote': '/api/v1.0/RequestForQuote/create',
    'viewRequestForQuote': '/api/v1.0/RequestForQuote/view',
    'updateRequestForQuote': '/api/v1.0/RequestForQuote/update',
    'deleteRequestForQuote': '/api/v1.0/RequestForQuote/delete',
    'UpdateShopPart': '/api/v1.0/parts/updateShopPart',
    'LockVendorShipAddr': '/api/v1.0/RRVendors/LockVendorShipAddr',
    'unlockCustomerShipAddress': '/api/v1.0/repairRequest/unlockCustomerShipAddress',
    'unlockVendorShipAddress': '/api/v1.0/repairRequest/unlockVendorShipAddress',

    //GMRepairTrackerInfo
    'createGMRepairTrackerInfo': '/api/v1.0/RepairRequestGmTracker/create',
    'updateGMRepairTrackerInfo': '/api/v1.0/RepairRequestGmTracker/update',
    'viewGMRepairTrackerInfo': '/api/v1.0/RepairRequestGmTracker/view',
    'deleteGMRepairTrackerInfo': '/api/v1.0/RepairRequestGmTracker/delete',

    // Worksheet
    'getWorksheetList': '/api/v1.0/RepairRequestWorksheet/getall',
    'getChecklistBothPdfBase64': '/api/v1.0/import/checklist-both-pdf',
    'getChecklistPdfBase64': '/api/v1.0/import/checklist-pdf',

    // Shop Parts
    'addShopPart': '/api/v1.0/shop/addPart',
    'updateShopPart': '/api/v1.0/shop/updatePart',
    'viewShopPart': '/api/v1.0/shop/viewPart',
    'deleteShopPart': '/api/v1.0/shop/deletePart',
    'deleteShopPartItem': '/api/v1.0/shop/deletePartItem',
    'updatePartsItemQuantity': '/api/v1.0/shop/updateQuantity',
    'reducePartsItemQuantity': '/api/v1.0/shop/reduceQuantity',
    'addShopPartItem': '/api/v1.0/shop/addPartItem',
    'getPartsStockLogs': '/api/v1.0/shop/stocklogs',
    'getShopDashboard': '/api/v1.0/shop/dashboard',

    //Store Location
    'addStoreLocation': '/api/v1.0/storeLocation/create',
    'updateStoreLocation': '/api/v1.0/storeLocation/update',
    'viewStoreLocation': '/api/v1.0/storeLocation/view',
    'deleteStoreLocation': '/api/v1.0/storeLocation/delete',
    'listStoreLocation': '/api/v1.0/storeLocation/list',
    'ddStoreLocation': '/api/v1.0/storeLocation/dropdown',

    //Customer Group
    'addCustomerGroup': '/api/v1.0/CustomerGroup/create',
    'updateCustomerGroup': '/api/v1.0/CustomerGroup/update',
    'viewCustomerGroup': '/api/v1.0/CustomerGroup/view',
    'deleteCustomerGroup': '/api/v1.0/CustomerGroup/delete',
    'listCustomerGroup': '/api/v1.0/CustomerGroup/list',
    'ddCustomerGroup': '/api/v1.0/CustomerGroup/dropdown',

    //Vendore Quote Attachment
    'VendorQuoteAttachmentAdd': '/api/v1.0/VendorQuoteAttachment/create',
    'VendorQuoteAttachmentList': '/api/v1.0/VendorQuoteAttachment/list',
    'VendorQuoteAttachmentUpdate': '/api/v1.0/VendorQuoteAttachment/update',
    'VendorQuoteAttachmentDelete': '/api/v1.0/VendorQuoteAttachment/delete',
    'VendorQuoteAttachmentView': '/api/v1.0/VendorQuoteAttachment/view',
    'VendorQuoteAttachmentUpdateAll': '/api/v1.0/VendorQuoteAttachment/updateall',
    'VendorQuoteAttachmentGetRRVendors': '/api/v1.0/VendorQuoteAttachment/getRRVendors',
    'VendorQuoteAttachmentFeedbackUpdate': '/api/v1.0/VendorQuoteAttachment/feedback/update',
    'VendorQuoteAttachmentPriceBulkUpdate': '/api/v1.0/VendorQuoteAttachment/updateBulkPrice',
    'VendorQuoteAttachmentApproverFeedbackUpdate': '/api/v1.0/VendorQuoteAttachment/feedback/update',
    'VendorQuoteAttachmentInternalNotesUpdate': '/api/v1.0/VendorQuoteAttachment/notes/update',


    'getRMAReportCount': '/api/v1.0/RRReports/getRMAReportCount',

    // MEMS API
    'MEMSPREDICTPOST': 'https://dss.memsdevops.com/predict'

}

export { URI };
