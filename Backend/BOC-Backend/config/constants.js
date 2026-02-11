
/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
module.exports.array_customer_group = {
  1: "Consumer",
  2: "Retailer",
  3: "Distributor"
};
module.exports.array_customer_type = {
  1: "Company",
  2: "Personal"
};
module.exports.array_identity_type = {
  0: "Admin",
  1: "Customer",
  2: "Vendor",
  3: "RR",
  4: "Quote",
  5: "SO",
  6: "PO",
  7: "Invoice"
};

module.exports.array_vendor_class =
{
  0: "Regular",
  1: "Minority",
  2: "Veteran",
  3: "Women",
}


module.exports.CONST_IDENTITY_TYPE_CUSTOMER = 1; // Customer
module.exports.CONST_IDENTITY_TYPE_VENDOR = 2; // Vendor
module.exports.CONST_IDENTITY_TYPE_RR = 3; // RR
module.exports.CONST_IDENTITY_TYPE_QUOTE = 4; // Quote
module.exports.CONST_IDENTITY_TYPE_SO = 5; // SO
module.exports.CONST_IDENTITY_TYPE_PO = 6;  // PO
module.exports.CONST_IDENTITY_TYPE_INVOICE = 7; // Invoice
module.exports.CONST_IDENTITY_TYPE_VENDOR_INVOICE = 8; // Vendor Invoice
module.exports.CONST_IDENTITY_TYPE_PART = 9; // Parts
module.exports.CONST_IDENTITY_TYPE_MRO = 10; // MRO
module.exports.CONST_IDENTITY_TYPE_MASTER = 11; // master
module.exports.CONST_IDENTITY_TYPE_REPORT = 12; // reports
module.exports.CONST_IDENTITY_TYPE_ADMINTAB = 13; // Admin tab




module.exports.array_address_type = {
  1: "Contact",
  2: "Shipping",
  3: "Billing"
};

module.exports.array_IsWarrantyRepair = {
  1: "Warranty Repair",
  2: "Warranty New"
};

module.exports.array_yes_no = {
  1: "Yes",
  0: "No"
};
module.exports.array_true_false = {
  1: "true",
  0: "false"
};
module.exports.array_status = {
  1: "Active",
  0: "InActive"
};

module.exports.array_tax_type = {
  1: "Taxable",
  2: "Rolling Stack",
  3: "Reseller/Non Taxable"
};
module.exports.array_terms = {
  0: "Net 10",
  1: "Net 15",
  2: "Net 30",
  3: "Net 45",
  4: "Net 60",
  5: "Due on Receipt",
  6: "COD",
  7: "Special – Please see notes",
  8: "2% 10, Net 45",
  9: "Net 90",
  10: "Prepaid",
};
module.exports.array_vendor_type = {
  "V": "Vendor",
  "M": "Manufacturer",
  "B": "OEM / Vendor"
};
module.exports.array_po_print_format = {
  1: "Excel & PDF",
  2: "Excel",
  3: "PDF"
};
module.exports.array_po_delivery_method = {
  1: "EDI",
  2: "Email",
  3: "Print",
  4: "Fax"
};
module.exports.array_notes_type = {
  1: "Internal",
  2: "Customer",
  3: "Vendor"
};
module.exports.CONST_NOTES_TYPE_INTERNAL = 1;
module.exports.CONST_NOTES_TYPE_CUSTOMER = 2;
module.exports.CONST_NOTES_TYPE_VENDOR = 3;

module.exports.CONST_CUSTOMER_QUOTE_TAX = 6;
module.exports.CONST_AH_GROUP_COMMISSION_PERCENT = 9.5;
module.exports.AH_GROUP_FROM_EMAIL = "info@ahgroup.com";
module.exports.AH_GROUP_VENDOR_ID = 5; // dont change this value and make sure this vendor id 5 is not deletable
module.exports.AH_GROUP_VENDOR_STORE_ID = 17738;
module.exports.AHGroupWebsite = "https://aibond.ai"

module.exports.array_rr_status = {
  0: "RR Generated",
  1: "Awaiting Vendor Selection",
  2: "Awaiting Vendor Quote",
  3: "Resource - Vendor Change",
  4: "Quoted - Awaiting Customer PO",
  5: "Repair in Process",
  6: "Quote Rejected",
  7: "Completed",
  8: "Not Repairable"
};
module.exports.array_rr_status_customer = {
  0: "RR Received",
  1: "RR Received",
  2: "RR under evaluation",
  3: "RR under evaluation",
  4: "RR Waiting for customer approval",
  5: "Repair In Process",
  6: "RR Rejected",
  7: "Completed",
  8: "Not Repairable"
};
module.exports.array_rr_status_vendor = {
  0: "RR Received",
  1: "RR Received",
  2: "Awaiting Quote",
  3: "Resource - Vendor Change",
  4: "Quoted",
  5: "Approved",
  6: "RR Rejected",
  7: "Completed",
  8: "Not Repairable"
};

module.exports.array_quote_status = {
  0: "Open",
  1: "Approved",
  2: "Cancelled",
  3: "Draft",
  4: "Submitted",
  5: "Quoted"
};
module.exports.CONST_QUOTE_STATUS_OPEN = 0;
module.exports.CONST_QUOTE_STATUS_APPROVED = 1;
module.exports.CONST_QUOTE_STATUS_CANCELLED = 2;
module.exports.CONST_QUOTE_STATUS_DRAFT = 3;
module.exports.CONST_QUOTE_STATUS_SUBMITTED = 4;
module.exports.CONST_QUOTE_STATUS_QUOTED = 5;


module.exports.CONST_CUSTOMER_QUOTE_DRAFT = 0;
module.exports.CONST_CUSTOMER_QUOTE_SUBMITTED = 1;
module.exports.CONST_CUSTOMER_QUOTE_ACCEPTED = 2;
module.exports.CONST_CUSTOMER_QUOTE_REJECTED = 3;
module.exports.CONST_CUSTOMER_QUOTE_CANCELLED = 4;

module.exports.array_quotetype = {
  0: "Regular",
  1: "Repair",
  2: "Doorship",
  3: "Exchange",
  4: "Surplus",
  5: "New",
  6: "MRO"
};
module.exports.CONST_QUOTE_TYPE_REGULAR = 0;
module.exports.CONST_QUOTE_TYPE_REPAIR = 1;
module.exports.CONST_QUOTE_TYPE_DOORSHIP = 2;
module.exports.CONST_QUOTE_TYPE_EXCHANGE = 3;
module.exports.CONST_QUOTE_TYPE_SURPLUS = 4;
module.exports.CONST_QUOTE_TYPE_NEW = 5;
module.exports.CONST_QUOTE_TYPE_MRO = 6;


module.exports.array_sale_order_status = {
  1: "Open",
  2: "Approved",
  3: "Cancelled",
  4: "On Hold",
  5: "Draft"
};
module.exports.CONST_SO_STATUS_OPEN = 1;
module.exports.CONST_SO_STATUS_APPROVED = 2;
module.exports.CONST_SO_STATUS_CANCELLED = 3;
module.exports.CONST_SO_STATUS_ONHOLD = 4;
module.exports.CONST_SO_STATUS_DRAFT = 5;
module.exports.CONST_SO_STATUS_CLOSED = 6;

module.exports.array_sale_order_type = {
  0: "Regular",
  1: "Repair",
  2: "Doorship",
  3: "Exchange",
  4: "Surplus",
  5: "New",
  6: "MRO"
};

module.exports.CONST_SO_TYPE_REGULAR = 0;
module.exports.CONST_SO_TYPE_REPAIR = 1;
module.exports.CONST_SO_TYPE_DOORSHIP = 2;
module.exports.CONST_SO_TYPE_EXCHANGE = 3;
module.exports.CONST_SO_TYPE_SURPLUS = 4;
module.exports.CONST_SO_TYPE_NEW = 5;
module.exports.CONST_SO_TYPE_MRO = 6;

module.exports.array_purchase_order_type = {
  0: "Regular",
  1: "Repair",
  2: "Doorship",
  3: "Inventory",
  4: "Material",
  5: "Supplies",
  6: "Freight",
  7: "Warranty Recovery",
  8: "MRO",
};
module.exports.CONST_PO_TYPE_REGULAR = 0;
module.exports.CONST_PO_TYPE_REPAIR = 1;
module.exports.CONST_PO_TYPE_DOORSHIP = 2;
module.exports.CONST_PO_TYPE_INVENTORY = 3;
module.exports.CONST_PO_TYPE_MATERIAL = 4;
module.exports.CONST_PO_TYPE_SUPPLIES = 5;
module.exports.CONST_PO_TYPE_FREIGHT = 6;
module.exports.CONST_PO_TYPE_WARRNTYRECOVERY = 7;
module.exports.CONST_PO_TYPE_MRO = 8;


module.exports.array_purchase_order_status = {
  1: "Open",
  2: "Closed",
  3: "Submit For Approval",
  4: "Hold",
  5: "Cancelled",
  6: "Approved",
  7: "Reviewed",
  8: "Draft",
  9: "Reopened",
};
module.exports.CONST_PO_STATUS_OPEN = 1;
module.exports.CONST_PO_STATUS_CLOSED = 2;
module.exports.CONST_PO_STATUS_SUBMIT = 3;
module.exports.CONST_PO_STATUS_HOLD = 4;
module.exports.CONST_PO_STATUS_CANCELLED = 5;
module.exports.CONST_PO_STATUS_APPROVED = 6;
module.exports.CONST_PO_STATUS_RECEIVED = 7;
module.exports.CONST_PO_STATUS_DRAFT = 8;
module.exports.CONST_PO_STATUS_AMENDED = 9;

module.exports.array_invoice_status = {
  0: "-",//"Draft"
  1: "Open",
  2: "Approved",
  3: "Cancelled",
  4: "-",//"UnPaid"
  5: "-",//"Partially Paid"
  6: "-",//"Paid"
  7: "Reopened",
  8: "On Hold"
};

module.exports.array_vendor_invoice_status = {
  0: "-",//Draft
  1: "Open",
  2: "Approved",
  3: "WOB",
  4: "Cancelled",
  5: "Reopened",
};

module.exports.CONST_VENDOR_INV_STATUS_DRAFT = 0;
module.exports.CONST_VENDOR_INV_STATUS_OPEN = 1;
module.exports.CONST_VENDOR_INV_STATUS_APPROVED = 2;
module.exports.CONST_VENDOR_INV_STATUS_WOB = 3;
module.exports.CONST_VENDOR_INV_STATUS_CANCELLED = 4;
module.exports.CONST_VENDOR_INV_STATUS_AMENDED = 5;

module.exports.CONST_INV_STATUS_DRAFT = 0;
module.exports.CONST_INV_STATUS_OPEN = 1;
module.exports.CONST_INV_STATUS_APPROVED = 2;
module.exports.CONST_INV_STATUS_CANCELLED = 3;
module.exports.CONST_INV_STATUS_UNPAID = 4;
module.exports.CONST_INV_STATUS_PARTIALLY_PAID = 5;
module.exports.CONST_INV_STATUS_PAID = 6;
module.exports.CONST_INV_STATUS_AMENDED = 7;

module.exports.array_invoice_type = {
  0: "Regular",
  2: "Repair",
  3: "Dropship",
  4: "MRO"
};

module.exports.CONST_INV_TYPE_REGULAR = 0;
module.exports.CONST_INV_TYPE_REPAIR = 2;
module.exports.CONST_INV_TYPE_DROPSHIP = 3;
module.exports.CONST_INV_TYPE_MRO = 4;

module.exports.array_vendor_invoice_type = {
  0: "Regular",
  2: "Repair",
  3: "Dropship",
  4: "MRO",
};

module.exports.CONST_VINV_TYPE_REGULAR = 0;
module.exports.CONST_VINV_TYPE_REPAIR = 2;
module.exports.CONST_VINV_TYPE_DROPSHIP = 3;
module.exports.CONST_VINV_TYPE_MRO = 4;


module.exports.CONST_RRS_GENERATED = 0;
module.exports.CONST_RRS_NEED_SOURCED = 1;
module.exports.CONST_RRS_AWAIT_VQUOTE = 2;
module.exports.CONST_RRS_NEED_RESOURCED = 3;
module.exports.CONST_RRS_QUOTE_SUBMITTED = 4;
module.exports.CONST_RRS_IN_PROGRESS = 5;
module.exports.CONST_RRS_QUOTE_REJECTED = 6;
module.exports.CONST_RRS_COMPLETED = 7;
module.exports.CONST_RRS_NOT_REPAIRABLE = 8;

//module.exports.CONST_AH_GROUP_COMMISSION_PERCENT = 9.5;


module.exports.CONST_VENDOR_STATUS_ASSIGNED = 0;
module.exports.CONST_VENDOR_STATUS_QREQUESTED = 1;
module.exports.CONST_VENDOR_STATUS_APPROVED = 2;
module.exports.CONST_VENDOR_STATUS_REJECTED = 3;
module.exports.CONST_VENDOR_STATUS_NOT_REPAIRABLE = 4;



module.exports.CONST_AH_FROM_EMAIL_ID = 'info@ahgroup.com';
module.exports.CONST_AH_CC_EMAIL_ID = '';
module.exports.CONST_DUE_DAYS = 2;
module.exports.CONST_DUE_DAYS_SO = 2;
module.exports.CONST_DUE_DAYS_PO = 30;
module.exports.CONST_DUE_DAYS_INVOICE = 30;
module.exports.CONST_DUE_DAYS_VEN_INVOICE = 30;


module.exports.CONST_PRIORITY = {
  1: 'Urgent - Machine down',
  2: 'High',
  3: 'Low'
}




/// Kesavan added ADDRESS TYPE
module.exports.CONST_ADDRES_TYPE_BILLING = 1;
module.exports.CONST_ADDRES_TYPE_SHIPPING = 2;
module.exports.CONST_ADDRES_TYPE_CONTACT = 3;

module.exports.CONST_EMAIL_TEMPLETE_TYPE_CUSTOMER_QUOTE = "CUSTOMER_QUOTE";
module.exports.CONST_EMAIL_TEMPLETE_TYPE_CUSTOMER_QUOTE_BULK = "CUSTOMER_QUOTE_BULK";
module.exports.CONST_EMAIL_TEMPLETE_TYPE_SALES_ORDER_QUOTE = "SALES_ORDER_QUOTE";
module.exports.CONST_EMAIL_TEMPLETE_TYPE_INVOICE_EMAIL = "INVOICE_EMAIL";
module.exports.CONST_EMAIL_TEMPLETE_TYPE_PURCHASE_ORDER = "PURCHASE_ORDER_EMAIL";
module.exports.CONST_EMAIL_TEMPLETE_TYPE_INVENTORY_STOCKOUT_NOTIFICATION = "INVENTORY_STOCKOUT_NOTIFICATION";
module.exports.CONST_EMAIL_TEMPLETE_TYPE_REVERT_NOTIFICATION = "REVERT_NOTIFICATION";

module.exports.CONST_EMAIL_TEMPLETE_TYPE_MRO_CUSTOMER_QUOTE = "MRO_CUSTOMER_QUOTE";
module.exports.CONST_EMAIL_TEMPLETE_TYPE_MRO_SALES_ORDER_QUOTE = "MRO_SALES_ORDER_QUOTE";


module.exports.array_parts_unit_Type = {
  1: "EA",
  2: "PK",
  3: "FT",
  4: "BX",
  5: "IN",
  6: "OZ",
  7: "WA",
  8: "EC"
};

module.exports.array_inventory_Type = {
  1: "Stock Part",
  2: "Non Stock Part",
  3: "Service",
  4: "Specials"
};
module.exports.array_vendor_reject_status = {
  1: "Repair Price Exceeds Customer Threshold",
  2: "Not Quoted",
  3: "Not Repairable",
  4: "Approved but not Repairable"

};
module.exports.array_customer_quote_reject_status = {
  1: "Quoted New Replacement",
  2: "Quoted Exchange",
  3: "Customer Rejected / Scrap",
  4: "Not Repairable/Return not repaired",
  5: "Repair Price Exceeds Cost of New",
  6: "Not Repairable / Scrap",
  7: "Overstock",
  8: "Other"
};

module.exports.array_customer_quote_reject_status_admin = {
  1: "Quoted New Replacement",
  2: "Quoted Exchange",
  3: "Not Repairable/Scarp",
  4: "Not Repairable/Return not repaired"
};
module.exports.array_customer_quote_reject_status_customer_portal = {
  5: "Repair Price Exceeds Cost of New",
  6: "Not Repairable / Scrap",
  7: "Overstock",
  8: "Other"
};



module.exports.array_mro_status = {
  0: "MRO Created",
  1: "Customer Quote Ready",
  2: "Quoted - Awaiting Customer PO",
  3: "MRO Approved",
  4: "Partially Received",
  5: "Order Fulfilled by vendor",
  6: "Rejected",
  7: "Completed"
};
module.exports.CONST_MROS_GENERATED = 0;
module.exports.CONST_MROS_AWAIT_VQUOTE = 1;
module.exports.CONST_MROS_QUOTED_AWAITING_CUSTOMER_PO = 2;
module.exports.CONST_MROS_APPROVED = 3;
module.exports.CONST_MROS_PARTIALLY_RECEIVED = 4;
module.exports.CONST_MROS_FULFILLED_BY_VENDOR = 5;
module.exports.CONST_MROS_REJECTED = 6;
module.exports.CONST_MROS_COMPLETED = 7;

module.exports.array_part_type = {
  1: "Refurbished",
  2: "New",
  3: "Used",
  4: "Reman",
  5: "Surplus"
};

module.exports.CONST_BUCKET_PATH_SUBDOMAIN = 'https://bocapp-bucket.s3.us-east-2.amazonaws.com/';
module.exports.CONST_BUCKET_PATH_AWS_DOMAIN = 'https://s3.us-east-2.amazonaws.com/bocapp-bucket/';

//module.exports.CONST_BUCKET_PATH_SUBDOMAIN = 'https://ahgroup-omsbucket.s3.us-east-2.amazonaws.com/';
//module.exports.CONST_BUCKET_PATH_AWS_DOMAIN = 'https://s3.us-east-2.amazonaws.com/ahgroup-omsbucket/';

//module.exports.CONST_BUCKET_PATH_SUBDOMAIN = 'https://aibond-boc.nyc3.digitaloceanspaces.com/';
//module.exports.CONST_BUCKET_PATH_AWS_DOMAIN = 'https://nyc3.digitaloceanspaces.com/aibond-boc/';

// module.exports.CONST_UPS_SHIPPERNUMBER = '9X352Y';
module.exports.CONST_UPS_SHIPPERNUMBER = '425597';
module.exports.CONST_UPS_ACCESS = '0D90D48B4B528035';
module.exports.CONST_UPS_USERNAME = 'ahdshipping1';
module.exports.CONST_UPS_PASSWORD = 'American@2020';

// Sandbox
//module.exports.CONST_UPS_URL_SHIP = 'https://wwwcie.ups.com/webservices/Ship';
//module.exports.CONST_UPS_URL_VOID = 'https://wwwcie.ups.com/ups.app/xml/Void';
//module.exports.CONST_UPS_URL_TRACK = 'https://wwwcie.ups.com/ups.app/xml/Track';
//module.exports.CONST_UPS_URL_AV = 'https://wwwcie.ups.com/rest/AV';

// Live
module.exports.CONST_UPS_URL_SHIP = 'https://onlinetools.ups.com/webservices/Ship';
module.exports.CONST_UPS_URL_VOID = 'https://onlinetools.ups.com/ups.app/xml/Void';
module.exports.CONST_UPS_URL_TRACK = 'https://onlinetools.ups.com/ups.app/xml/Track';
module.exports.CONST_UPS_URL_AV = 'https://onlinetools.ups.com/rest/AV';

module.exports.array_ediStatus = {
  0: "Open",
  1: "Processing",
  2: "Success",
  3: "Failed"
};

module.exports.employee_job_role = {
  1: "Handle STOCK IN",
  2: "Handle STOCK OUT",
  3: "Handle both STOCK IN and STOCK OUT",
  4: "Choose the STOCK IN List- RFID number",
  5: "Choose the STOCK OUT List- RFID number",
};
module.exports.employee_job_responsibilites = {
  1: "Warehouse clerk",
  2: "Forklift operator",
  3: "Merchandise pickup",
  4: "Merchandise receiving associate",
  5: "Loader",
  6: "General Laborer",
};
module.exports.gender_type = {
  1: "Male",
  2: "FeMale",
};

module.exports.MotorChecklist = [
  {
    Name: "Brake", DisplayName: "Brake", Type: "select", Value: ['Yes', 'No']
  },
  {
    Name: "IfYes", DisplayName: "If Yes", Type: "number", Value: ''
  },
  {
    Name: "BadBrake", DisplayName: "Bad Brake", Type: "checkbox", Value: ''
  },
  {
    Name: "MissingWireBoxCover", DisplayName: "Missing Wire Box Cover", Type: "checkbox", Value: ''
  },
  {
    Name: "BadWindings", DisplayName: "Bad Windings", Type: "checkbox", Value: ''
  },
  {
    Name: "BadInsulation", DisplayName: "Bad Insulation", Type: "checkbox", Value: ''
  },
  {
    Name: "Windings", DisplayName: "Windings", Type: "textarea", Value: ''
  },
  {
    Name: "Insulation", DisplayName: "Insulation", Type: "textarea", Value: ''
  }
];

module.exports.MotorWithBrakeChecklist = [
  {
    Name: "Brake", DisplayName: "Brake", Type: "radio", Value: ['Yes', 'No']
  },
  {
    Name: "IfYes", DisplayName: "If Yes", Type: "number", Value: ''
  },
  {
    Name: "BadBrake", DisplayName: "Bad Brake", Type: "checkbox", Value: ''
  },
  {
    Name: "MissingWireBoxCover", DisplayName: "Missing Wire Box Cover", Type: "checkbox", Value: ''
  },
  {
    Name: "BadWindings", DisplayName: "Bad Windings", Type: "checkbox", Value: ''
  },
  {
    Name: "BadInsulation", DisplayName: "Bad Insulation", Type: "checkbox", Value: ''
  }
];

module.exports.BrakeMotorChecklist = [
  {
    Name: "Brake", DisplayName: "Brake", Type: "radio", Value: ['Yes', 'No']
  },
  {
    Name: "IfYes", DisplayName: "If Yes", Type: "number", Value: ''
  },
  {
    Name: "BadBrake", DisplayName: "Bad Brake", Type: "checkbox", Value: ''
  },
  {
    Name: "MissingWireBoxCover", DisplayName: "Missing Wire Box Cover", Type: "checkbox", Value: ''
  },
  {
    Name: "BadWindings", DisplayName: "Bad Windings", Type: "checkbox", Value: ''
  }
];


