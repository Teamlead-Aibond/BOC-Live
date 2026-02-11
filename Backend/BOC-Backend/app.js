/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
var express = require('express');
require('dotenv').config();
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var compression = require('compression')

//routers
var indexRouter = require('./routes/index');
var userRouter = require('./routes/user.routes');
var customerRouter = require('./routes/customer.routes');
var customerCacheRouter = require('./routes/customercache.routes');
var languageRouter = require('./routes/languages.routes');
var departmentRouter = require('./routes/department.routes');
var warehouseRouter = require('./routes/warehouse.routes');
var countryRouter = require('./routes/country.routes');
var currencyRouter = require('./routes/currencies.routes');
var currencyExchangeRateRouter = require('./routes/currency.exchange.rate.routes');
var StateRouter = require('./routes/state.routes');
var ContactRouter = require('./routes/contact.routes');
var vendor = require('./routes/vendor.routes');
var Address = require('./routes/customeraddress.routes');
var customersasset = require('./routes/customersasset.routes');
var customersdepartment = require('./routes/customersdepartment.routes');
var attachment = require('./routes/attachment.routes');
var referencelable = require('./routes/referencelable.routes');
var CRefLabel = require('./routes/customer.reference.labels.routes');
var RepairRequest = require('./routes/repairrequest.routes');
var parts = require('./routes/parts.routes');
var quotes = require('./routes/quotes.routes');
var repairrequestnotes = require('./routes/repair.request.notes.routes');
var fileUpload = require('./routes/file.upload.routes');
var RRSH = require('./routes/repair.request.shipping.history.routes');
const bodyParser = require('body-parser');
var RRImages = require('./routes/repair.request.images.routes');
var RRA = require('./routes/repair.request.attachment.routes');
var FollowUp = require('./routes/repair.request.followup.routes');
var SalesOrder = require('./routes/sales.order.routes');
var RRVendors = require('./routes/repair.request.vendors.routes.js');
var PurchaseOrder = require('./routes/purchase.order.routes.js');
var RRCReference = require('./routes/repair.request.customer.reference.routes');
var invoiceRouter = require('./routes/invoice.routes');
var terms = require('./routes/terms.routes');
var customerParts = require('./routes/customer.parts.routes');
var warranty = require('./routes/warranty.routes');
var salesCustomerRef = require('./routes/sales.order.customer.ref.routes');
var VendorInvoice = require('./routes/vendor.invoice.routes');
var CustomerPortal = require('./routes/customer.portal.routes');
var VendorPortal = require('./routes/vendor.portal.routes');
var UserCustomer = require('./routes/users.customers.routes');
var WarehouseSublevel1 = require('./routes/warehouse.sublevel1.routes');
var WarehouseSublevel2 = require('./routes/warehouse.sublevel2.routes');
var WarehouseSublevel3 = require('./routes/warehouse.sublevel3.routes');
var WarehouseSublevel4 = require('./routes/warehouse.sublevel4.routes');
var Email = require('./routes/email.routes');
var Notification = require('./routes/notification.routes');
var RRReports = require('./routes/repair.request.reports.routes');
var InventoryTransfer = require('./routes/inventory.transfer.routes');
var RolePermission = require('./routes/role.permission.routes');
var Role = require('./routes/role.routes');
var Permission = require('./routes/permission.routes');
var InventoryStockout = require('./routes/inventory.stockout.routes');
var PoItem = require('./routes/po.item.routes');
var InventoryIndent = require('./routes/inventory.indent.routes');
var InventoryReceived = require('./routes/inventory.received.routes');
var InventoryStockIn = require('./routes/inventory.stockin.routes');
var InventoryReports = require('./routes/inventory.reports.routes');
var InventoryDamage = require('./routes/inventory.damage.routes');
var SalesOrderReports = require('./routes/sales.order.reports.routes');
var UPS = require('./routes/ups.routes');
var ElasticSearch = require('./routes/elasticsearch.routes');

//var ExportToExcel = require('./routes/export.to.excel.routes');
var SettingsGeneral = require('./routes/settings.general.routes');
var VendorPortalProfile = require('./routes/vendor.portal.profile.routes');
var CustomerPortalProfile = require('./routes/customer.portal.profile.routes');
const UserPermission = require('./routes/user.permission.routes');
var RRWarranty = require('./routes/repair.request.warranty.routes.js');
var MROShippingHistory = require('./routes/mro.shipping.history.routes.js');

const multer = require('multer');
//Swagger service for api documentation
const swaggerApiDoc = require('./routes/api-doc.routes');
const Inventory = require('./routes/inventory.routes');
const POReports = require('./routes/purchase.order.reports.routes');
const InvoiceReport = require('./routes/invoice.report.routes');
const ImportRoutes = require('./routes/import.routes');
const MRO = require('./routes/mro.routes');
const MRONotes = require('./routes/mro.notes.routes');
const MROAttachment = require('./routes/mro.attachment.routes');
const CommunicationMessages = require('./routes/communication.messages.routes.js');
const RRVendorAttachment = require('./routes/repair.request.vendor.attachment.routes.js');
const CustomerBlanketPO = require('./routes/customer.blanket.po.routes');
const CustomerBlanketPOTopUp = require('./routes/customer.blanket.po.topup.routes');
const CustomerBlanketPOHistory = require('./routes/customer.blanket.po.history.routes');
const ImportChanges = require('./routes/import.changes.routes');
const AutoScript = require('./routes/autoscript.routes');
var RRCustomerAttachment = require('./routes/repair.request.customer.attachment.routes');
var RRFollowUpNotes = require('./routes/repair.request.followup.notes.routes');
var RRSubStatus = require('./routes/substatus.routes');
var RRPartLocation = require('./routes/repair.request.part.location.routes');
var AutoScriptFix = require('./routes/autoscript.find.fix.issues.routes');
var ConsolidateInvoice = require('./routes/consolidate.routes');
var EDI = require('./routes/edi.routes');
var UserLoginLog = require('./routes/users.login.log.routes');
var employee = require('./routes/employee.routes');
var tempRFID = require('./routes/temp.rfid.routes');
var Ecommerce = require('./routes/ecommerce.routes');
var RequestForQuoteRouter = require('./routes/request.for.quote.routes');
var PartCategoryRouter = require('./routes/part.category.routes');
var RepairRequestGmTrackerRouter = require('./routes/repair.request.gm.tracker.routes');
var RepairRequestWorksheetRouter = require('./routes/repair.request.worksheet.routes');
var StoreLocationRouter = require('./routes/store.location.routes');
var Shopparts = require('./routes/shop.parts.routes');
var CustomerGroup = require('./routes/customer.group.routes');
var VendorQuoteAttachment = require('./routes/repair.request.vendorquote.attachment.routes')
//var MaryGold = require('./routes/mary.mockup.routes');

var app = express();

var Handlebars = require("handlebars")
var moment = require("moment")

app.use(logger('dev'));
// app.use(express.json());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: false, limit: '50mb', parameterLimit: 500000 }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(compression({ filter: shouldCompress }))

function shouldCompress(req, res) {
  if (req.headers['x-no-compression']) {
    // don't compress responses with this request header
    return false
  }

  // fallback to standard filter function
  return compression.filter(req, res)
}


var upload = multer();
// app.use(upload.array());

Handlebars.registerHelper('formatDate', function (dateString) {
  let formattedDateString = dateString.split("/").reverse().join("-");
  return new Handlebars.SafeString(
    moment(formattedDateString).isValid() ? moment(formattedDateString).format("MM-DD-YYYY").toUpperCase() : ""
  );
});

Handlebars.registerHelper('formatDecimal', function (value) {
  return new Handlebars.SafeString(
    Number(value).toFixed(2)
  );
});

Handlebars.registerHelper('ifCond', function (v1, operator, v2, options) {
  switch (operator) {
    case '==':
      return (v1 == v2) ? options.fn(this) : options.inverse(this);
    case '===':
      return (v1 === v2) ? options.fn(this) : options.inverse(this);
    case '!=':
      return (v1 != v2) ? options.fn(this) : options.inverse(this);
    case '!==':
      return (v1 !== v2) ? options.fn(this) : options.inverse(this);
    case '<':
      return (v1 < v2) ? options.fn(this) : options.inverse(this);
    case '<=':
      return (v1 <= v2) ? options.fn(this) : options.inverse(this);
    case '>':
      return (v1 > v2) ? options.fn(this) : options.inverse(this);
    case '>=':
      return (v1 >= v2) ? options.fn(this) : options.inverse(this);
    case '&&':
      return (v1 && v2) ? options.fn(this) : options.inverse(this);
    case '||':
      return (v1 || v2) ? options.fn(this) : options.inverse(this);
    default:
      return options.inverse(this);
  }
});

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
  res.header("Access-Control-Allow-Headers", "Authorization, Origin, X-Requested-With, Content-Type, Accept");
  res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
  next();
});

app.use('/', indexRouter);
app.use('/users', userRouter);
app.use('/api/v1.0/customers', customerRouter);
app.use('/api/v1.0/customers/cache', customerCacheRouter);
app.use('/api/v1.0/languages', languageRouter);

app.use('/api/v1.0/department', departmentRouter);
app.use('/api/v1.0/warehouse', warehouseRouter);
app.use('/api/v1.0/country', countryRouter);
app.use('/api/v1.0/currency', currencyRouter);
app.use('/api/v1.0/currencyExchangeRate', currencyExchangeRateRouter);
app.use('/api/v1.0/state', StateRouter);
app.use('/api/v1.0/contact', ContactRouter);
app.use('/api/v1.0/vendor', vendor);

app.use('/api/v1.0/address', Address);
app.use('/api/v1.0/customersasset', customersasset);
app.use('/api/v1.0/customersdepartment', customersdepartment);
app.use('/api/v1.0/attachment', attachment);
app.use('/api/v1.0/referencelable', referencelable);
app.use('/api/v1.0/customerRefLabel', CRefLabel);
app.use('/api/v1.0/repairRequest', RepairRequest);
app.use('/api/v1.0/RRVendors', RRVendors);
app.use('/api/v1.0/repairrequestnotes', repairrequestnotes);
app.use('/api/v1.0/rrimages', RRImages);
app.use('/api/v1.0/parts', parts);
app.use('/api/v1.0/quotes', quotes);
app.use('/api/v1.0/fileUplod', fileUpload);
app.use('/api/v1.0/RRShipping', RRSH);
app.use('/api/v1.0/GlobalAttachment', RRA);
app.use('/api/v1.0/FollowUp', FollowUp);
app.use('/api/v1.0/SalesOrder', SalesOrder);
app.use('/api/v1.0/PurchaseOrder', PurchaseOrder);
app.use('/api/v1.0/RRCReference', RRCReference);
app.use('/api/v1.0/invoice', invoiceRouter);
app.use('/api/v1.0/term', terms);
app.use('/api/v1.0/customerParts', customerParts);
app.use('/api/v1.0/warranty', warranty);
app.use('/api/v1.0/salesOrderCustomerRef', salesCustomerRef);
app.use('/api/v1.0/VendorInvoice', VendorInvoice);
app.use('/api/v1.0/CustomerPortal', CustomerPortal);
app.use('/api/v1.0/VendorPortal', VendorPortal);
app.use('/api/v1.0/UserCustomer', UserCustomer);
app.use('/api/v1.0/WarehouseSublevel1', WarehouseSublevel1);
app.use('/api/v1.0/WarehouseSublevel2', WarehouseSublevel2);
app.use('/api/v1.0/WarehouseSublevel3', WarehouseSublevel3);
app.use('/api/v1.0/WarehouseSublevel4', WarehouseSublevel4);
app.use('/api/v1.0/Email', Email);
app.use('/api/v1.0/notification', Notification);

app.use('/api/v1.0/ups', UPS);
app.use('/api/v1.0/ElasticSearch', ElasticSearch);
//app.use('/api/v1.0/ExportToExcel',ExportToExcel );
app.use('/api/v1.0/SettingsGeneral', SettingsGeneral);
app.use('/api/v1.0/VendorPortalProfile', VendorPortalProfile);
app.use('/api/v1.0/CustomerPortalProfile', CustomerPortalProfile);
app.use('/api/v1.0/RRWarranty', RRWarranty);
app.use('/api/v1.0/RRReports', RRReports);
app.use('/api/v1.0/InventoryTransfer', InventoryTransfer);
app.use('/api/v1.0/RolePermission', RolePermission);
app.use('/api/v1.0/Inventory', Inventory);
app.use('/api/v1.0/InventoryDamage', InventoryDamage);

app.use('/api/v1.0/Role', Role);
app.use('/api/v1.0/Permission', Permission);
app.use('/api/v1.0/InventoryStockout', InventoryStockout);
app.use('/api/v1.0/PoItem', PoItem);
app.use('/api/v1.0/InventoryIndent', InventoryIndent);
app.use('/api/v1.0/InventoryReceived', InventoryReceived);
app.use('/api/v1.0/InventoryStockIn', InventoryStockIn);
app.use('/api/v1.0/InventoryReports', InventoryReports);
app.use('/api/v1.0/InventoryReports', InventoryReports);
app.use('/api/v1.0/SalesOrderReports', SalesOrderReports);
app.use('/api/v1.0/POReports', POReports);
app.use('/api/v1.0/UserPermission', UserPermission);
app.use('/api/v1.0/InvoiceReports', InvoiceReport);
app.use('/api/v1.0/import', ImportRoutes);
app.use('/api/v1.0/MRO', MRO);
app.use('/api/v1.0/MRONotes', MRONotes);
app.use('/api/v1.0/MROAttachment', MROAttachment);
app.use('/api/v1.0/CommunicationMessages', CommunicationMessages);
app.use('/api/v1.0/MROShippingHistory', MROShippingHistory);
app.use('/api/v1.0/RRVendorAttachment', RRVendorAttachment);
app.use('/api/v1.0/CustomerBlanketPO', CustomerBlanketPO);
app.use('/api/v1.0/CustomerBlanketPOTopUp', CustomerBlanketPOTopUp);
app.use('/api/v1.0/CustomerBlanketPOHistory', CustomerBlanketPOHistory);
app.use('/api/v1.0/importChanges', ImportChanges);
app.use('/api/v1.0/AutoScript', AutoScript);
app.use('/api/v1.0/RRCustomerAttachment', RRCustomerAttachment);
app.use('/api/v1.0/RRFollowUpNotes', RRFollowUpNotes);
app.use('/api/v1.0/RRSubStatus', RRSubStatus);
app.use('/api/v1.0/RRPartLocation', RRPartLocation);
app.use('/api/v1.0/AutoScriptFix', AutoScriptFix);
app.use('/api/v1.0/ConsolidateInvoice', ConsolidateInvoice);
app.use('/api/v1.0/edi', EDI);
app.use('/api/v1.0/UserLoginLog', UserLoginLog);
app.use('/api/v1.0/employee', employee);
app.use('/api/v1.0/temp/rfid', tempRFID);

app.use('/api/v1.0/ecommerce', Ecommerce);
app.use('/api/v1.0/RequestForQuote', RequestForQuoteRouter);
app.use('/api/v1.0/PartCategory', PartCategoryRouter);
app.use('/api/v1.0/RepairRequestGmTracker', RepairRequestGmTrackerRouter);
app.use('/api/v1.0/RepairRequestWorksheet', RepairRequestWorksheetRouter);
app.use('/api/v1.0/storeLocation', StoreLocationRouter);
app.use('/api/v1.0/CustomerGroup', CustomerGroup);
app.use('/api/v1.0/VendorQuoteAttachment', VendorQuoteAttachment);



app.use('/api/v1.0/shop', Shopparts);

//app.use('/api/v1.0/MaryGold', MaryGold);

//Api Document using Swagger Document Service
app.use('/', swaggerApiDoc)

app.use(function (err, req, res, next) {
  console.log('This is the invalid field ->', err.field)
  next(err)
})
//
module.exports = app;
