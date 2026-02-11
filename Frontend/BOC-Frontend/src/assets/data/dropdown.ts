const customergroup = [
  { GroupId: 1, CustomerGroupName: "Consumer" },
  { GroupId: 2, CustomerGroupName: "Retailer" },
  { GroupId: 3, CustomerGroupName: "Distributor" },
];

const customertype = [
  {
    CustomerTypeId: 1,
    CustomerType: "Company",
  },
  {
    CustomerTypeId: 2,
    CustomerType: "Personal",
  },
];

const statustype = [
  {
    StatusId: 1,
    StatusName: "Active",
  },
  {
    StatusId: 0,
    StatusName: "InActive",
  },
];
const taxtype = [
  {
    TaxType: 1,
    TaxTypeName: "Taxable",
  },
  {
    TaxType: 2,
    TaxTypeName: "Rolling Stack",
  },

  {
    TaxType: 3,
    TaxTypeName: "Reseller/Non Taxable",
  },
];

const terms = [
  {
    TermsId: 0,
    TermsName: "Net 10",
  },
  {
    TermsId: 1,
    TermsName: "Net 15",
  },
  {
    TermsId: 2,
    TermsName: "Net 30",
  },
  {
    TermsId: 3,
    TermsName: "Net 45",
  },
  {
    TermsId: 4,
    TermsName: "Net 60",
  },
  {
    TermsId: 5,
    TermsName: "Due on Receipt",
  },
  {
    TermsId: 6,
    TermsName: "COD",
  },
  {
    TermsId: 7,
    TermsName: "Special – Please see notes",
  },
  {
    TermsId: 8,
    TermsName: "2% 10, Net 45",
  },
  {
    TermsId: 9,
    TermsName: "Net 90",
  },
];
const vendor_type = [
  {
    VendorTypeId: "V",
    VendorTypeName: "Vendor",
  },
  {
    VendorTypeId: "M",
    VendorTypeName: "Manufacturer",
  },
  {
    VendorTypeId: "B",
    VendorTypeName: "OEM / Vendor",
  },
];

const po_print_format = [
  {
    PrintFormat: 1,
    PrintFormatName: "Both",
  },
  {
    PrintFormat: 2,
    PrintFormatName: "Excel",
  },
  {
    PrintFormat: 3,
    PrintFormatName: "PDF",
  },
];

const po_delivery_method = [
  {
    PODeliveryMethod: 1,
    PODeliveryMethodName: "EDI",
  },
  {
    PODeliveryMethod: 2,
    PODeliveryMethodName: "Email",
  },
  {
    PODeliveryMethod: 3,
    PODeliveryMethodName: "Print",
  },
  {
    PODeliveryMethod: 4,
    PODeliveryMethodName: "Fax",
  },
];

const notes_type = [
  {
    NotesType: "1",
    NotesTypeValue: "Internal",
  },
  {
    NotesType: "2",
    NotesTypeValue: "Customer",
  },
  {
    NotesType: "3",
    NotesTypeValue: "Vendor",
  },
];

const attachment_thumb_images = {
  "image/jpeg": { thumb: "JPG.jpg" },
  "image/png": { thumb: "PNG.jpg" },
  "application/msword": { thumb: "Word.jpg" },
  "application/pdf": { thumb: "PDF.jpg" },
  "application/vnd.ms-excel": { thumb: "Excel.jpg" },
  "text/csv": { thumb: "CSV.jpg" },
};

const warranty_list = [
  { WarrantyPeriodId: "0", WarrantyPeriodValue: "No Warranty" },
  { WarrantyPeriodId: "1", WarrantyPeriodValue: "1 Month" },
  { WarrantyPeriodId: "2", WarrantyPeriodValue: "2 Months" },
  { WarrantyPeriodId: "3", WarrantyPeriodValue: "3 Months" },
  { WarrantyPeriodId: "6", WarrantyPeriodValue: "6 Months" },
  { WarrantyPeriodId: "12", WarrantyPeriodValue: "12 Months" },
  { WarrantyPeriodId: "18", WarrantyPeriodValue: "18 Months" },
  { WarrantyPeriodId: "24", WarrantyPeriodValue: "24 Months" },
  { WarrantyPeriodId: "36", WarrantyPeriodValue: "36 Months" },
  { WarrantyPeriodId: "48", WarrantyPeriodValue: "48 Months" },
];

const rr_status = {
  "0": { title: "RR Generated", icon: "mdi mdi-source-branch" },
  "1": { title: "RR Needs To Be Sourced", icon: "fa fa-folder-open" },
  "2": {
    title: "Awaiting Vendor Quote",
    icon: "mdi mdi-file-document-outline",
  },
  "3": {
    title: "Customer Quote Submitted",
    icon: "mdi mdi-file-document-box-multiple-outline",
  },
  "4": { title: "Repair In Progress", icon: "fas fa-wrench" },
  "5": { title: "Completed", icon: "fa fa-paper-plane" },
};

const array_rr_status = [
  { id: 0, title: "RR Generated", cstyle: "badge-pink" },
  { id: 1, title: "Awaiting Vendor Selection", cstyle: "badge-warning" },
  { id: 2, title: "Awaiting Vendor Quote", cstyle: "badge-info" },
  { id: 3, title: "Resource - Vendor Change", cstyle: "badge-purple" },
  { id: 4, title: "Quoted - Awaiting Customer PO", cstyle: "badge-primary" },
  { id: 5, title: "Repair In Progress", cstyle: "badge-secondary" },
  { id: 6, title: "Quote Rejected", cstyle: "badge-danger" },
  { id: 7, title: "Completed", cstyle: "badge-success" },
  { id: 8, title: "Not Repairable", cstyle: "badge-light" },
];
const rr_status_customer = [
  { id: 0, title: "Repairs Received", cstyle: "badge-pink" },
  { id: 1, title: "Repairs Received", cstyle: "badge-pink" },
  { id: 2, title: "Repairs Under Evaluation", cstyle: "badge-info" },
  { id: 3, title: "Repairs Under Evaluation", cstyle: "badge-info" },
  {
    id: 4,
    title: "Repairs Waiting for Customer Approval",
    cstyle: "badge-warning",
  },
  { id: 5, title: "Repairs In Progress", cstyle: "badge-secondary" },
  { id: 6, title: "Repairs Rejected", cstyle: "badge-danger" },
  { id: 7, title: "Completed", cstyle: "badge-success" },
  { id: 8, title: "Not Repairable", cstyle: "badge-light" },
];
const rr_status_vendor = [
  { id: 0, title: "RR Received", cstyle: "badge-pink" },
  { id: 1, title: "RR Received", cstyle: "badge-pink" },
  { id: 2, title: "Awaiting Quote", cstyle: "badge-info" },
  { id: 3, title: "Resource - Vendor Change", cstyle: "badge-purple" },
  { id: 4, title: "Quoted", cstyle: "badge-primary" },
  { id: 5, title: "Approved", cstyle: "badge-secondary" },
  { id: 6, title: "RR Rejected", cstyle: "badge-danger" },
  { id: 7, title: "Completed", cstyle: "badge-success" },
  { id: 8, title: "Not Repairable", cstyle: "badge-light" },
];

const QuoteType = [
  {
    QuoteTypeId: "Regular",
    QuoteType: "Regular",
  },
  {
    QuoteTypeId: "Repair/Exchange",
    QuoteType: "Repair/Exchange",
  },
];

const SalesOrder_Status = [
  {
    Saleorder_StateId: "1",
    Saleorder_StateName: "Open",
  },
  {
    Saleorder_StateId: "2",
    Saleorder_StateName: "Approved",
  },
  {
    Saleorder_StateId: "3",
    Saleorder_StateName: "Cancelled",
  },
  {
    Saleorder_StateId: "4",
    Saleorder_StateName: "On Hold",
  },
  {
    Saleorder_StateId: "5",
    Saleorder_StateName: "Draft",
  },
];

const SalesOrder_Status_expectApprove = [
  {
    Saleorder_StateId: "1",
    Saleorder_StateName: "Open",
  },

  // {
  //     Saleorder_StateId: "3",
  //     Saleorder_StateName: 'Cancelled',

  // },
  {
    Saleorder_StateId: "4",
    Saleorder_StateName: "On Hold",
  },
  {
    Saleorder_StateId: "5",
    Saleorder_StateName: "Draft",
  },
];

const SalesOrder_Type = [
  {
    SalesOrder_TypeId: "0",
    SalesOrder_TypeName: "Regular",
    cstyle: "badge-light",
    cstyleview: "badge badge-light",
  },
  {
    SalesOrder_TypeId: "1",
    SalesOrder_TypeName: "Repair",
    cstyle: "badge-danger",
    cstyleview: "badge badge-danger",
  },
  {
    SalesOrder_TypeId: "2",
    SalesOrder_TypeName: "Doorship",
    cstyle: "badge-warning",
    cstyleview: "badge badge-warning",
  },
  {
    SalesOrder_TypeId: "3",
    SalesOrder_TypeName: "Exchange",
    cstyle: "badge-primary",
    cstyleview: "badge badge-primary",
  },
  {
    SalesOrder_TypeId: "4",
    SalesOrder_TypeName: "Surplus",
    cstyle: "badge-secondary",
    cstyleview: "badge badge-secondary",
  },
  {
    SalesOrder_TypeId: "5",
    SalesOrder_TypeName: "New",
    cstyle: "badge-success",
    cstyleview: "badge badge-success",
  },
  {
    SalesOrder_TypeId: "6",
    SalesOrder_TypeName: "MRO",
    cstyle: "badge-pink",
    cstyleview: "badge badge-pink",
  },
];

const PurchaseOrder_Type = [
  {
    PurchaseOrder_TypeId: "0",
    PurchaseOrder_TypeName: "Regular",
    cstyle: "badge-light",
    cstyleview: "badge badge-light",
  },
  {
    PurchaseOrder_TypeId: "1",
    PurchaseOrder_TypeName: "Repair",
    cstyle: "badge-danger",
    cstyleview: "badge badge-danger",
  },
  {
    PurchaseOrder_TypeId: "2",
    PurchaseOrder_TypeName: "Doorship",
    cstyle: "badge-warning",
    cstyleview: "badge badge-warning",
  },
  {
    PurchaseOrder_TypeId: "3",
    PurchaseOrder_TypeName: "Inventory",
    cstyle: "badge-primary",
    cstyleview: "badge badge-primary",
  },
  {
    PurchaseOrder_TypeId: "4",
    PurchaseOrder_TypeName: "Material",
    cstyle: "badge-secondary",
    cstyleview: "badge badge-secondary",
  },
  {
    PurchaseOrder_TypeId: "5",
    PurchaseOrder_TypeName: "Supplies",
    cstyle: "badge-success",
    cstyleview: "badge badge-success",
  },
  {
    PurchaseOrder_TypeId: "6",
    PurchaseOrder_TypeName: "Freight",
    cstyle: "badge-pink",
    cstyleview: "badge badge-pink",
  },
  {
    PurchaseOrder_TypeId: "7",
    PurchaseOrder_TypeName: "Warranty Recovery",
    cstyle: "badge-purple",
    cstyleview: "badge badge-purple",
  },
  {
    PurchaseOrder_TypeId: "8",
    PurchaseOrder_TypeName: "MRO",
    cstyle: "badge-pink",
    cstyleview: "badge badge-pink",
  },
];

const PurchaseOrder_Status = [
  {
    PurchaseOrder_StateId: "1",
    PurchaseOrder_StateName: "Open",
    cstyle: "badge-warning",
  },
  {
    PurchaseOrder_StateId: "2",
    PurchaseOrder_StateName: "Closed",
    cstyle: "badge-secondary",
  },
  {
    PurchaseOrder_StateId: "3",
    PurchaseOrder_StateName: "Submit For Approval",
    cstyle: "badge-purple",
  },
  {
    PurchaseOrder_StateId: "4",
    PurchaseOrder_StateName: "Hold",
    cstyle: "badge-light",
  },
  {
    PurchaseOrder_StateId: "5",
    PurchaseOrder_StateName: "Cancelled",
    cstyle: "badge-danger",
  },
  {
    PurchaseOrder_StateId: "6",
    PurchaseOrder_StateName: "Approved",
    cstyle: "badge-success",
  },
  {
    PurchaseOrder_StateId: "7",
    PurchaseOrder_StateName: "Reviewed",
    cstyle: "badge-pink",
  },
  {
    PurchaseOrder_StateId: "8",
    PurchaseOrder_StateName: "Draft",
    cstyle: "badge-info",
  },
  {
    PurchaseOrder_StateId: "9",
    PurchaseOrder_StateName: "ReOpened",
    cstyle: "badge-primary",
  },
];

const PurchaseOrder_Status_expectApprove = [
  {
    PurchaseOrder_StateId: "1",
    PurchaseOrder_StateName: "Open",
  },
  {
    PurchaseOrder_StateId: "2",
    PurchaseOrder_StateName: "Closed",
  },
  {
    PurchaseOrder_StateId: "3",
    PurchaseOrder_StateName: "Submit For Approval",
  },
  {
    PurchaseOrder_StateId: "4",
    PurchaseOrder_StateName: "Hold",
  },
  {
    PurchaseOrder_StateId: "5",
    PurchaseOrder_StateName: "Cancelled",
  },

  {
    PurchaseOrder_StateId: "7",
    PurchaseOrder_StateName: "Reviewed",
  },
  {
    PurchaseOrder_StateId: "8",
    PurchaseOrder_StateName: "Draft",
  },
  {
    PurchaseOrder_StateId: "9",
    PurchaseOrder_StateName: "ReOpened",
  },
];

const Quote_type = [
  {
    Quote_TypeId: "0",
    Quote_TypeName: "Regular",
    cstyle: "badge-light",
    cstyleview: "badge badge-light",
  },
  {
    Quote_TypeId: "1",
    Quote_TypeName: "Repair",
    cstyle: "badge-danger",
    cstyleview: "badge badge-danger",
  },
  {
    Quote_TypeId: "2",
    Quote_TypeName: "Doorship",
    cstyle: "badge-warning",
    cstyleview: "badge badge-warning",
  },
  {
    Quote_TypeId: "3",
    Quote_TypeName: "Exchange",
    cstyle: "badge-primary",
    cstyleview: "badge badge-primary",
  },
  {
    Quote_TypeId: "4",
    Quote_TypeName: "Surplus",
    cstyle: "badge-secondary",
    cstyleview: "badge badge-secondary",
  },
  {
    Quote_TypeId: "5",
    Quote_TypeName: "New",
    cstyle: "badge-success",
    cstyleview: "badge badge-success",
  },
  {
    Quote_TypeId: "6",
    Quote_TypeName: "MRO",
    cstyle: "badge-pink",
    cstyleview: "badge badge-pink",
  },
];

const SalesQuote_Status = [
  {
    SalesQuote_StatusId: "0",
    SalesQuote_StatusName: "Open",
  },
  {
    SalesQuote_StatusId: "1",
    SalesQuote_StatusName: "Approved",
  },
  {
    SalesQuote_StatusId: "2",
    SalesQuote_StatusName: "Cancelled",
  },
  {
    SalesQuote_StatusId: "3",
    SalesQuote_StatusName: "Draft",
  },
  {
    SalesQuote_StatusId: "4",
    SalesQuote_StatusName: "Submitted",
  },
  {
    SalesQuote_StatusId: "5",
    SalesQuote_StatusName: "Quoted",
  },
];

const SalesQuote_Status_customer = [
  {
    SalesQuote_StatusId: "1",
    SalesQuote_StatusName: "Approved",
  },
  {
    SalesQuote_StatusId: "2",
    SalesQuote_StatusName: "Cancelled",
  },
  {
    SalesQuote_StatusId: "4",
    SalesQuote_StatusName: "Submitted",
  },
];

const Invoice_Type = [
  {
    Invoice_TypeId: "0",
    Invoice_TypeName: "Regular",
    cstyle: "badge-light",
    cstyleview: "badge badge-light",
  },
  {
    Invoice_TypeId: "2",
    Invoice_TypeName: "Repair",
    cstyle: "badge-danger",
    cstyleview: "badge badge-danger",
  },
  {
    Invoice_TypeId: "3",
    Invoice_TypeName: "Doorship",
    cstyle: "badge-warning",
    cstyleview: "badge badge-warning",
  },
  {
    Invoice_TypeId: "4",
    Invoice_TypeName: "MRO",
    cstyle: "badge-pink",
    cstyleview: "badge badge-pink",
  },
];

const Invoice_Status = [
  // {
  //     Invoice_StatusId: '0',
  //     Invoice_StatusName: 'Draft'
  // },
  {
    Invoice_StatusId: "1",
    Invoice_StatusName: "Open",
    cstyle: "badge-warning",
  },
  {
    Invoice_StatusId: "2",
    Invoice_StatusName: "Approved",
    cstyle: "badge-success",
  },
  {
    Invoice_StatusId: "3",
    Invoice_StatusName: "Cancelled",
    cstyle: "badge-danger",
  },
  {
    Invoice_StatusId: "7",
    Invoice_StatusName: "ReOpened",
    cstyle: "badge-primary",
  },
  {
    Invoice_StatusId: "8",
    Invoice_StatusName: "On Hold",
    cstyle: "badge-secondary",
  },
];
const Invoice_Status_expectApprove = [
  // {
  //     Invoice_StatusId: '0',
  //     Invoice_StatusName: 'Draft'
  // },
  {
    Invoice_StatusId: "1",
    Invoice_StatusName: "Open",
  },
  {
    Invoice_StatusId: "3",
    Invoice_StatusName: "Cancelled",
  },
  {
    Invoice_StatusId: "7",
    Invoice_StatusName: "ReOpened",
  },
  {
    Invoice_StatusId: "8",
    Invoice_StatusName: "On Hold",
  },
];

const Customer_Invoice_Status = [
  // {
  //     Cust_Invoice_StatusId: '0',
  //     Cust_Invoice_StatusName: 'Draft'
  // },
  {
    Cust_Invoice_StatusId: "1",
    Cust_Invoice_StatusName: "Open",
  },
  {
    Cust_Invoice_StatusId: "2",
    Cust_Invoice_StatusName: "Approved",
  },
  {
    Cust_Invoice_StatusId: "3",
    Cust_Invoice_StatusName: "Cancelled",
  },
  {
    Cust_Invoice_StatusId: "7",
    Cust_Invoice_StatusName: "ReOpened",
  },
  {
    Cust_Invoice_StatusId: "8",
    Cust_Invoice_StatusName: "On Hold",
  },
  // {
  //     Cust_Invoice_StatusId: '4',
  //     Cust_Invoice_StatusName: 'UnPaid'
  // },
  // {
  //     Cust_Invoice_StatusId: '5',
  //     Cust_Invoice_StatusName: 'Partially Paid'
  // },
  // {
  //     Cust_Invoice_StatusId: '6',
  //     Cust_Invoice_StatusName: 'Paid'
  // },
];

const Customer_Invoice_Status_expectApprove = [
  // {
  //     Cust_Invoice_StatusId: '0',
  //     Cust_Invoice_StatusName: 'Draft'
  // },
  {
    Cust_Invoice_StatusId: "1",
    Cust_Invoice_StatusName: "Open",
  },
  // {
  //     Cust_Invoice_StatusId: '3',
  //     Cust_Invoice_StatusName: 'Cancelled'
  // },
  {
    Cust_Invoice_StatusId: "7",
    Cust_Invoice_StatusName: "ReOpened",
  },
  // {
  //     Cust_Invoice_StatusId: '4',
  //     Cust_Invoice_StatusName: 'UnPaid'
  // },
  // {
  //     Cust_Invoice_StatusId: '5',
  //     Cust_Invoice_StatusName: 'Partially Paid'
  // },
  // {
  //     Cust_Invoice_StatusId: '6',
  //     Cust_Invoice_StatusName: 'Paid'
  // },
  {
    Cust_Invoice_StatusId: "8",
    Cust_Invoice_StatusName: "On Hold",
  },
];

const Vendor_Bill_Status_creare = [
  // {
  //     Invoice_StatusId: '0',
  //     Invoice_StatusName: 'Draft',
  //     cstyle: 'badge-info',
  // },
  {
    Invoice_StatusId: "1",
    Invoice_StatusName: "Open",
    cstyle: "badge-warning",
  },

  {
    Invoice_StatusId: "3",
    Invoice_StatusName: "WOB",
    cstyle: "badge-info",
  },
  {
    Invoice_StatusId: "4",
    Invoice_StatusName: "Cancelled",
    cstyle: "badge-danger",
  },
  {
    Invoice_StatusId: "5",
    Invoice_StatusName: "ReOpened",
    cstyle: "badge-primary",
  },
];
const Vendor_Bill_Status = [
  // {
  //     Invoice_StatusId: '0',
  //     Invoice_StatusName: 'Draft',
  //     cstyle: 'badge-info',
  // },
  {
    Invoice_StatusId: "1",
    Invoice_StatusName: "Open",
    cstyle: "badge-warning",
  },
  {
    Invoice_StatusId: "2",
    Invoice_StatusName: "Approved",
    cstyle: "badge-success",
  },
  {
    Invoice_StatusId: "3",
    Invoice_StatusName: "WOB",
    cstyle: "badge-info",
  },
  {
    Invoice_StatusId: "4",
    Invoice_StatusName: "Cancelled",
    cstyle: "badge-danger",
  },
  {
    Invoice_StatusId: "5",
    Invoice_StatusName: "ReOpened",
    cstyle: "badge-primary",
  },
];
const Vendor_Bill_Status_expectApprove = [
  // {
  //     Invoice_StatusId: '0',
  //     Invoice_StatusName: 'Draft'
  // },
  {
    Invoice_StatusId: "1",
    Invoice_StatusName: "Open",
  },
  {
    Invoice_StatusId: "3",
    Invoice_StatusName: "WOB",
  },
  {
    Invoice_StatusId: "4",
    Invoice_StatusName: "Cancelled",
  },
  {
    Invoice_StatusId: "5",
    Invoice_StatusName: "ReOpened",
    cstyle: "badge-primary",
  },
];

const array_MRO_status = [
  { id: 0, title: "MRO Created", cstyle: "badge-pink" },
  { id: 1, title: "Customer Quote Ready", cstyle: "badge-info" },
  { id: 2, title: "Quoted - Awaiting Customer PO", cstyle: "badge-warning" },
  { id: 3, title: "MRO Approved", cstyle: "badge-purple" },
  { id: 4, title: "Partially Received", cstyle: "badge-primary" },
  { id: 5, title: "Order Fulfilled by vendor", cstyle: "badge-secondary" },
  { id: 6, title: "Rejected", cstyle: "badge-danger" },
  { id: 7, title: "Completed", cstyle: "badge-success" },
];
const CONST_IDENTITY_TYPE_CUSTOMER = 1; // Customer
const CONST_IDENTITY_TYPE_VENDOR = 2; // Vendor
const CONST_IDENTITY_TYPE_RR = 3; // RR
const CONST_IDENTITY_TYPE_QUOTE = 4; // Quote
const CONST_IDENTITY_TYPE_SO = 5; // SO
const CONST_IDENTITY_TYPE_PO = 6; // PO
const CONST_IDENTITY_TYPE_INVOICE = 7; // Invoice
const CONST_IDENTITY_TYPE_VENDORINVOICE = 8; // VendorInvoice
const CONST_IDENTITY_TYPE_MRO = 10;
const footerlineLeft = "Help";
const footerlineRight =
  "Copyright © 2020 American Hydrostatics. All rights reserved.";

const Quote_notes =
  "We sincerely appreciate the opportunity to quote, please let us know if there is anything we can do to earn your business.";
const SalesOrder_notes =
  "We sincerely appreciate the opportunity to quote, please let us know if there is anything we can do to earn your business.";
const PurchaseOrder_notes =
  "Documentation: Confirmation of this purchase order is required. Please confirm to mailto:info@aibond.ai.All packing slips,invoices, and other correspondence must reference the PO Number or RR Number,with the Purchase Order and Invoice matching exactly to receive payment.   Shipping Instructions: All ground and outbound freight charges for shipments delivered back to Aibond are to be covered by Supplier,and Aibond will not be responsible for any outgoing charges. No freight charges or shipping & handling fees may be added to the PO or invoiced amount. Please contact info@aibond.ai with questions. Any changes to this order, any variance in price, delivery date, specifications,quantities, or terms must be requested by returning am copy of this order with proposed changes to AH. If approved, a revised PO will be issued. No verbal changes are accepted.Terms & Conditions: Please reference American Hydrostatics Terms and Conditions.If you do not have a copy of these Terms, please email info@aibond.ai";
const invoice_notes =
  "INVOICE SUBJECT TO SALES TAX ADJUSTMENT IF UPON AUDIT BY MICHIGAN DEPARTMENT OF REVENUE ANY CHANGE IS MADE, YOU WILL RECEIVE CREDIT OR REFUND OR INVOICE FOR ADDITION. WE HEREBY CERTIFY THAT WITH RESPECT TO THE PRODUCTION OF THE ARTICLES AND/OR THE PERFORMANCE OF THE SERVICE COVERED BY THIS INVOICE. WE HAVE FULLY COMPLIED WITH THE FAIR LABOR STANDARDS ACT OF 1938, AS AMENDED.";
const Vendorinvoice_notes = "THANK YOU FOR THE BUSINESS";

const vendor_reject_reasons = [
  { id: 1, title: "Repair Price Exceeds Customer Threshold" },
  { id: 2, title: "Not Quoted" },
  { id: 3, title: "Not Repairable" },
  //{ id: 4, title: "Approved but not Repairable" }
];

const customer_quote_reject_reasons_customer_portal = [
  { id: 5, title: "Repair Price Exceeds Cost of New" },
  { id: 6, title: "Not Repairable / Scrap" },
  { id: 7, title: "Overstock" },
  { id: 8, title: "Other" },
];
const customer_quote_reject_reasons_admin = [
  { id: 1, title: "Quoted New Replacement" },
  { id: 2, title: "Quoted Exchange" },
  { id: 3, title: "Customer Rejected / Scrap" },
  { id: 4, title: "Not Repairable/Return not repaired" },
  { id: 5, title: "Repair Price Exceeds Cost of New" },
  { id: 6, title: "Not Repairable / Scrap" },
  { id: 7, title: "Overstock" },
  { id: 8, title: "Other" },
];

const not_repairable_reasons = [
  { id: 1, title: "Not Repairable/Scrap" },
  { id: 2, title: "Not Repairable/Return not repaired" },
];
const mro_rejected_reason = [
  { id: 1, title: "Customer Quote Exceeded" },
  { id: 2, title: "Customer Cancelled the Order" },
];

const parts_import = [
  { label: "Part No", key: "PartNo" },
  { label: "Description", key: "Description" },
  { label: "Manufacturer", key: "Manufacturer" },
  { label: "Manufacturer Part No", key: "ManufacturerPartNo" },
  { label: "Price", key: "Price" },
];

const vendor_class = [
  { VendorClassId: 0, VendorClassName: "Regular" },
  { VendorClassId: 1, VendorClassName: "Minority" },
  { VendorClassId: 2, VendorClassName: "Veteran" },
  { VendorClassId: 3, VendorClassName: "Women" },
];

const shipping_status = [
  { shipping_statusId: 1, shipping_statusName: "Shipped by Aibond" },
  { shipping_statusId: 2, shipping_statusName: "Shipped by Customer" },
  { shipping_statusId: 3, shipping_statusName: "Shipped by Vendor" },
  { shipping_statusId: 4, shipping_statusName: "Received by Aibond" },
  { shipping_statusId: 5, shipping_statusName: "Received by Customer " },
  { shipping_statusId: 6, shipping_statusName: "Received by Vendor" },
  { shipping_statusId: 10, shipping_statusName: "Ready for Pick Up" },
  { shipping_statusId: 12, shipping_statusName: "Picked Up" },
  { shipping_statusId: 11, shipping_statusName: "Shipping Not Yet Started" },
];

const shipping_category = [
  { shipping_categoryId: 1, shipping_categoryName: "Customer" },
  { shipping_categoryId: 2, shipping_categoryName: "Vendor" },
  { shipping_categoryId: 3, shipping_categoryName: "Aibond" },
  { shipping_categoryId: 4, shipping_categoryName: "Location Not Yet Added" },
];

const part_type = [
  { part_typeId: 1, part_typeName: "Refurbished" },
  { part_typeId: 2, part_typeName: "New" },
  { part_typeId: 3, part_typeName: "Used" },
  { part_typeId: 4, part_typeName: "Reman" },
  { part_typeId: 5, part_typeName: "Surplus" },
];

const user_type = [
  { user_type_id: "Aibond", user_type_Name: "Ai Bond" },
  { user_type_id: "Customer", user_type_Name: "Customer" },
  { user_type_id: "Vendor", user_type_Name: "Vendor" },
];

const warranty_type = [
  { warranty_type_id: "1", warranty_type_Name: "Warranty Repair" },
  { warranty_type_id: "2", warranty_type_Name: "Warranty New" },
];

const custompooptions = [
  {
    displayName: "Warranty Repair",
    name: "WarrantyRepair",
    value: "Warranty Repair",
    checked: false,
  },
  {
    displayName: "No Problem Found",
    name: "NoProblemFound",
    value: "No Problem Found",
    checked: false,
  },
];

// For user access rights
const CONST_ACCESS_LIMIT = 6;

const CONST_VIEW_ACCESS = 0;
const CONST_CREATE_ACCESS = 1;
const CONST_MODIFY_ACCESS = 2;
const CONST_DELETE_ACCESS = 3;
const CONST_APPROVE_ACCESS = 4;
const CONST_VIEW_COST_ACCESS = 5;

const CONST_COST_HIDE_VALUE = "***";
const CONST_AH_Group_ID = 5;

//Vendor Status
const CONST_VENDOR_STATUS_ASSIGNED = 0;
const CONST_VENDOR_STATUS_QREQUESTED = 1;
const CONST_VENDOR_STATUS_APPROVED = 2;
const CONST_VENDOR_STATUS_REJECTED = 3;
const CONST_VENDOR_STATUS_NOT_REPAIRABLE = 4;

//Quote Status
const CONST_CUSTOMER_QUOTE_DRAFT = 0;
const CONST_CUSTOMER_QUOTE_SUBMITTED = 1;
const CONST_CUSTOMER_QUOTE_ACCEPTED = 2;
const CONST_CUSTOMER_QUOTE_REJECTED = 3;
const CONST_CUSTOMER_QUOTE_VENDOR_REJECTED = 4;

//RR Status
const CONST_RRS_GENERATED = 0;
const CONST_RRS_NEED_SOURCED = 1;
const CONST_RRS_AWAIT_VQUOTE = 2;
const CONST_RRS_NEED_RESOURCED = 3;
const CONST_RRS_QUOTE_SUBMITTED = 4;
const CONST_RRS_IN_PROGRESS = 5;
const CONST_RRS_QUOTE_REJECTED = 6;
const CONST_RRS_COMPLETED = 7;
const CONST_RRS_NOT_REPAIRABLE = 8;

//MRO Status
const CONST_MRO_GENERATED = 0;
const CONST_MRO_NEED_SOURCED = 1;
const CONST_MRO_AWAIT_VQUOTE = 2;
const CONST_MRO_NEED_RESOURCED = 3;
const CONST_MRO_QUOTE_SUBMITTED = 4;
const CONST_MRO_IN_PROGRESS = 5;
const CONST_MRO_QUOTE_REJECTED = 6;
const CONST_MRO_COMPLETED = 7;
const CONST_MRO_NOT_REPAIRABLE = 8;

const CONST_ShipAddressType = 3;
const CONST_ContactAddressType = 1;
const CONST_BillAddressType = 2;
const Const_AHGroupWebsite = "info@aibond.ai";
const CONST_Email_address = "info@aibond.ai";
const CONST_REPAIR_QT_address = "info@aibond.ai";

const Const_Alert_pop_title = "Insufficient Data...";
const Const_Alert_pop_message = "Please fill in all the required fields.";

const YEAR_FILTER_START = 2010;

const UPS_ID = 1;
const shipDescription = "AH Repairs";
const UPS_AH_Account_No = "425597";

const CURRENCY_CODE = "USD";
const CURRENCY_DISPLAY = "$";
const DIGIT_WHOLE_NUMBER = "1.0-2";

const UPS_Service = [
  { UPS_Service_Code: "01", UPS_Service_Description: "Next Day Air" },
  { UPS_Service_Code: "02", UPS_Service_Description: "2nd Day Air" },
  { UPS_Service_Code: "03", UPS_Service_Description: "Ground" },
  { UPS_Service_Code: "07", UPS_Service_Description: "Express" },
  { UPS_Service_Code: "08", UPS_Service_Description: "Expedited" },
  { UPS_Service_Code: "11", UPS_Service_Description: "UPS Standard" },
  { UPS_Service_Code: "12", UPS_Service_Description: "3 Day Select" },
  { UPS_Service_Code: "13", UPS_Service_Description: "Next Day Air Saver" },
  {
    UPS_Service_Code: "14",
    UPS_Service_Description: "UPS Next Day Air® Early",
  },
  {
    UPS_Service_Code: "17",
    UPS_Service_Description: "UPS Worldwide Economy DDU",
  },
  { UPS_Service_Code: "54", UPS_Service_Description: "Express Plus" },
  { UPS_Service_Code: "59", UPS_Service_Description: "2nd Day Air A.M." },
  { UPS_Service_Code: "65", UPS_Service_Description: "UPS Saver" },
  { UPS_Service_Code: "M2", UPS_Service_Description: "First Class Mail" },
  { UPS_Service_Code: "M3", UPS_Service_Description: "Priority Mail" },
  {
    UPS_Service_Code: "M4",
    UPS_Service_Description: "Expedited MaiI Innovations",
  },
  {
    UPS_Service_Code: "M5",
    UPS_Service_Description: "Priority Mail Innovations",
  },
  {
    UPS_Service_Code: "M6",
    UPS_Service_Description: "Economy Mail Innovations",
  },
  {
    UPS_Service_Code: "M7",
    UPS_Service_Description: "MaiI Innovations (MI) Returns",
  },
  {
    UPS_Service_Code: "70",
    UPS_Service_Description: "UPS Access PointTM Economy",
  },
  {
    UPS_Service_Code: "71",
    UPS_Service_Description: "UPS Worldwide Express Freight Midday",
  },
  {
    UPS_Service_Code: "72",
    UPS_Service_Description: "UPS Worldwide Economy DDP",
  },
  { UPS_Service_Code: "74", UPS_Service_Description: "UPS Express®12:00" },
  { UPS_Service_Code: "82", UPS_Service_Description: "UPS Today Standard" },
  {
    UPS_Service_Code: "83",
    UPS_Service_Description: "UPS Today Dedicated Courier",
  },
  { UPS_Service_Code: "84", UPS_Service_Description: "UPS Today Intercity" },
  { UPS_Service_Code: "85", UPS_Service_Description: "UPS Today Express" },
  {
    UPS_Service_Code: "86",
    UPS_Service_Description: "UPS Today Express Saver",
  },
  {
    UPS_Service_Code: "96",
    UPS_Service_Description: "UPS Worldwide Express Freight",
  },
];

const VAT_field_Name = "Vat/Tax";
const TOTAL_VAT_field_Name = "Total Vat/Tax";
const Shipping_field_Name = "Shipping";
const IsDisplayBaseCurrencyValue = 1;
const Hide_add = 1;

const array_rr_status_rejectreport = [
  { id: 6, title: "Quote Rejected", cstyle: "badge-danger" },
  { id: 7, title: "Completed", cstyle: "badge-success" },
];
const EDI_status = [
  { id: 0, title: "Open", cstyle: "badge-warning" },
  { id: 1, title: "Processing", cstyle: "badge-info" },
  { id: 2, title: "Success", cstyle: "badge-success" },
  { id: 3, title: "Failed", cstyle: "badge-danger" },
];
const ShipViaReportIdentity = [
  { id: 3, moduleName: "Aibond" },
  { id: 1, moduleName: "Customer" },
  { id: 2, moduleName: "Vendor" },
];
const BillTransportationTo = [
  { id: 1, BillTransportationToName: "Shipper" },
  { id: 2, BillTransportationToName: "Receiver" },
];
const EmployeeResponsibilites = [
  { id: 1, Name: "Warehouse clerk" },
  { id: 2, Name: "Forklift operator" },
  { id: 3, Name: "Merchandise pickup" },
  { id: 4, Name: "Merchandise receiving associate" },
  { id: 5, Name: "Loader" },
  { id: 6, Name: "General Laborer" },
];
const EmployeeJobRole = [
  { id: 1, Name: "Handle STOCK IN" },
  { id: 2, Name: "Handle STOCK OUT" },
  { id: 3, Name: "Handle both STOCK IN and STOCK OUT" },
];
const priority = [
  { id: 1, Name: "Urgent - Machine down" },
  { id: 2, Name: "High" },
  { id: 3, Name: "Low" },
];
const requestQuoteStatus = [
  { id: 1, Name: "Open" },
  { id: 2, Name: "Closed" },
];
const booleanValues = [
  { id: 1, Name: "Yes" },
  { id: 0, Name: "No" },
];
const months = [
  { value: 1, text: "January" },
  { value: 2, text: "February" },
  { value: 3, text: "March" },
  { value: 4, text: "April" },
  { value: 5, text: "May" },
  { value: 6, text: "June" },
  { value: 7, text: "July" },
  { value: 8, text: "August" },
  { value: 9, text: "September" },
  { value: 10, text: "October" },
  { value: 11, text: "November" },
  { value: 12, text: "December" },
];
const boolean = [
  { id: 1, Name: "Yes" },
  { id: 2, Name: "No" },
];

const PartLocations = [
  { id: 0, Name: "Location 1" },
  { id: 1, Name: "Location 2" },
  { id: 2, Name: "Location 3" },
];
const ProcessingHTML =
  '<div style="position: fixed;left: 0;top: 0;width: 100%;height: 100%;background-color: #fff;opacity: 0.7;z-index: 1000;"></div>';

const CUSTOMER_GROUP_ID_AMAZON = 1;
const CUSTOMER_GROUP_ID_GM = 2;
const CUSTOMER_GROUP_ID_FORD = 3;
const CUSTOMER_GROUP_ID_DANA = 4;
const CUSTOMER_GROUP_ID_WALMART = 5;
const CUSTOMER_GROUP_ID_OTHER = 6;
export {
  rr_status_vendor,
  CONST_ShipAddressType,
  CONST_ContactAddressType,
  CONST_BillAddressType,
  CONST_Email_address,
  Const_AHGroupWebsite,
  Invoice_Type,
  Vendor_Bill_Status,
  Vendor_Bill_Status_expectApprove,
  Customer_Invoice_Status_expectApprove,
  Invoice_Status_expectApprove,
  SalesOrder_Status_expectApprove,
  PurchaseOrder_Status_expectApprove,
  CONST_AH_Group_ID,
  footerlineLeft,
  footerlineRight,
  SalesQuote_Status_customer,
  rr_status_customer,
  PurchaseOrder_Type,
  Customer_Invoice_Status,
  CONST_IDENTITY_TYPE_VENDORINVOICE,
  Vendorinvoice_notes,
  invoice_notes,
  PurchaseOrder_notes,
  SalesOrder_notes,
  Quote_notes,
  Invoice_Status,
  SalesQuote_Status,
  Quote_type,
  PurchaseOrder_Status,
  SalesOrder_Type,
  SalesOrder_Status,
  warranty_list,
  QuoteType,
  notes_type,
  po_delivery_method,
  po_print_format,
  vendor_type,
  terms,
  taxtype,
  statustype,
  customertype,
  customergroup,
  attachment_thumb_images,
  rr_status,
  array_rr_status,
  CONST_IDENTITY_TYPE_CUSTOMER,
  CONST_IDENTITY_TYPE_VENDOR,
  CONST_IDENTITY_TYPE_RR,
  CONST_IDENTITY_TYPE_QUOTE,
  CONST_IDENTITY_TYPE_SO,
  CONST_IDENTITY_TYPE_PO,
  CONST_IDENTITY_TYPE_INVOICE,
  CONST_VIEW_ACCESS,
  CONST_CREATE_ACCESS,
  CONST_MODIFY_ACCESS,
  CONST_DELETE_ACCESS,
  CONST_APPROVE_ACCESS,
  CONST_VIEW_COST_ACCESS,
  CONST_ACCESS_LIMIT,
  CONST_COST_HIDE_VALUE,
  CONST_VENDOR_STATUS_ASSIGNED,
  CONST_VENDOR_STATUS_QREQUESTED,
  CONST_VENDOR_STATUS_APPROVED,
  CONST_VENDOR_STATUS_REJECTED,
  CONST_VENDOR_STATUS_NOT_REPAIRABLE,
  CONST_CUSTOMER_QUOTE_DRAFT,
  CONST_CUSTOMER_QUOTE_SUBMITTED,
  CONST_CUSTOMER_QUOTE_ACCEPTED,
  CONST_CUSTOMER_QUOTE_REJECTED,
  CONST_CUSTOMER_QUOTE_VENDOR_REJECTED,
  CONST_RRS_GENERATED,
  CONST_RRS_NEED_SOURCED,
  CONST_RRS_AWAIT_VQUOTE,
  CONST_RRS_NEED_RESOURCED,
  CONST_RRS_QUOTE_SUBMITTED,
  CONST_RRS_IN_PROGRESS,
  CONST_RRS_QUOTE_REJECTED,
  CONST_RRS_COMPLETED,
  CONST_RRS_NOT_REPAIRABLE,
  warranty_type,
  vendor_reject_reasons,
  customer_quote_reject_reasons_admin,
  not_repairable_reasons,
  Vendor_Bill_Status_creare,
  Const_Alert_pop_title,
  Const_Alert_pop_message,
  YEAR_FILTER_START,
  array_MRO_status,
  CONST_IDENTITY_TYPE_MRO,
  CONST_MRO_GENERATED,
  CONST_MRO_NEED_SOURCED,
  CONST_MRO_AWAIT_VQUOTE,
  CONST_MRO_NEED_RESOURCED,
  CONST_MRO_QUOTE_SUBMITTED,
  CONST_MRO_IN_PROGRESS,
  CONST_MRO_QUOTE_REJECTED,
  CONST_MRO_COMPLETED,
  CONST_MRO_NOT_REPAIRABLE,
  parts_import,
  user_type,
  vendor_class,
  shipping_status,
  shipping_category,
  part_type,
  customer_quote_reject_reasons_customer_portal,
  mro_rejected_reason,
  custompooptions,
  UPS_ID,
  shipDescription,
  UPS_AH_Account_No,
  CURRENCY_CODE,
  CURRENCY_DISPLAY,
  DIGIT_WHOLE_NUMBER,
  UPS_Service,
  VAT_field_Name,
  TOTAL_VAT_field_Name,
  IsDisplayBaseCurrencyValue,
  Hide_add,
  array_rr_status_rejectreport,
  Shipping_field_Name,
  ShipViaReportIdentity,
  priority,
  requestQuoteStatus,
  booleanValues,
  months,
  boolean,
  EDI_status,
  BillTransportationTo,
  EmployeeResponsibilites,
  EmployeeJobRole,
  PartLocations,
  ProcessingHTML,
  CONST_REPAIR_QT_address,
  CUSTOMER_GROUP_ID_AMAZON,
  CUSTOMER_GROUP_ID_GM,
  CUSTOMER_GROUP_ID_DANA,
  CUSTOMER_GROUP_ID_FORD,
  CUSTOMER_GROUP_ID_WALMART,
  CUSTOMER_GROUP_ID_OTHER,
};
