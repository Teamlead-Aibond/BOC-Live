/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbTabset } from '@ng-bootstrap/ng-bootstrap';
import { NgxNavigationWithDataComponent } from 'ngx-navigation-with-data';
import { NgxSpinnerService } from 'ngx-spinner';
import { ElasticSearchService } from 'src/app/core/services/elastic-search.service';

@Component({
  selector: 'app-search-result',
  templateUrl: './search-result.component.html',
  styleUrls: ['./search-result.component.scss'],
  providers: [
    NgxSpinnerService,
  ]
})
export class SearchResultComponent implements OnInit, AfterViewInit {
  search_results;
  query: string;
  searchQuery: any;

  page = 1;
  pageSize = 10;
  totalRecords = 0;
  startIndex = 1;
  endIndex = 10;

  indexDescription: { index: string, desc: string, navigationURI?: { admin?: string, customer?: string, vendor?: string } }[] = []
  activeTab: string = "all";
  tabs: void;
  @ViewChild(NgbTabset, { static: false }) tabset;
  allTotal: any;
  IdentityType
  constructor(
    private activatedRoute: ActivatedRoute,
    private elasticSearchService: ElasticSearchService,
    public navCtrl: NgxNavigationWithDataComponent,
    private spinner: NgxSpinnerService,
    private router: Router
  ) {

    this.indexDescription.push({ index: "ahoms-repair-request", desc: "Repair Request", navigationURI: { admin: "/admin/repair-request/edit", customer: "/customer/RR-edit" } });
    this.indexDescription.push({ index: "ahoms-rr-customer-ref", desc: "RR Customer Reference", navigationURI: { admin: "/admin/customer/edit", customer: "" } });
    this.indexDescription.push({ index: "ahoms-rr-follow-up", desc: "RR Follow-up", navigationURI: { admin: "/admin/repair-request/edit", customer: "/customer/RR-edit" } });
    this.indexDescription.push({ index: "ahoms-rr-notes", desc: "RR Notes", navigationURI: { admin: "/admin/repair-request/edit", customer: "/customer/RR-edit" } });
    this.indexDescription.push({ index: "ahoms-rr-vendor-parts", desc: "RR Vandor Parts", navigationURI: { admin: "/admin/repair-request/edit", customer: "/customer/RR-edit" } });
    this.indexDescription.push({ index: "ahoms-rr-vendors", desc: "RR Vendors", navigationURI: { admin: "/admin/vendor/edit", customer: "" } });
    this.indexDescription.push({ index: "ahoms-purchase-quote", desc: "Purchase Quote (Vendor)", navigationURI: { admin: "/admin/repair-request/edit", customer: "/customer/RR-edit" } });
    this.indexDescription.push({ index: "ahoms-purchase-quote-items", desc: "Purchase Quote Items", navigationURI: { admin: "/admin/repair-request/edit", customer: "/customer/RR-edit" } });
    this.indexDescription.push({ index: "ahoms-sales-quote", desc: "Sales Quote", navigationURI: { admin: "/admin/sales-quote/list", customer: "" } });
    this.indexDescription.push({ index: "ahoms-sales-quote-items", desc: "Sales Quote Items", navigationURI: { admin: "/admin/sales-quote/list", customer: "" } });
    this.indexDescription.push({ index: "ahoms-sales-order", desc: "Sales Order", navigationURI: { admin: "/admin/orders/sales-list", customer: "" } });
    this.indexDescription.push({ index: "ahoms-sales-order-items", desc: "Sales Order Items", navigationURI: { admin: "/admin/orders/sales-list", customer: "" } });
    this.indexDescription.push({ index: "ahoms-sales-order-ref", desc: "Sales Order Reference", navigationURI: { admin: "/admin/orders/sales-list", customer: "" } });
    this.indexDescription.push({ index: "ahoms-purchase-order", desc: "Purchase Order", navigationURI: { admin: "/admin/orders/purchase-list", customer: "" } });
    this.indexDescription.push({ index: "ahoms-purchase-order-items", desc: "Purchase Order Items", navigationURI: { admin: "/admin/orders/purchase-list", customer: "" } });
    this.indexDescription.push({ index: "ahoms-sales-invoice", desc: "Sales Invoice", navigationURI: { admin: "/admin/invoice/list", customer: "/customer/invoice-view" } });
    this.indexDescription.push({ index: "ahoms-sales-invoice-items", desc: "Sales Invoice Items", navigationURI: { admin: "/admin/invoice/list", customer: "/customer/invoice-view" } });
    this.indexDescription.push({ index: "ahoms-purchase-invoice", desc: "Vendor Bill", navigationURI: { admin: "/admin/invoice/vendor-invoice-list", customer: "" } });
    this.indexDescription.push({ index: "ahoms-purchase-invoice-items", desc: "Purchase Bill Items", navigationURI: { admin: "/admin/invoice/vendor-invoice-list", customer: "" } });
    this.indexDescription.push({ index: "ahoms-sales-quotes", desc: "Sales Quote", navigationURI: { admin: "/admin/sales-quote/list", customer: "" } });
    this.indexDescription.push({ index: "ahoms-mro", desc: "MRO", navigationURI: { admin: "/admin/mro/edit", customer: "" } });

    this.activatedRoute.queryParams.subscribe(params => {
      this.query = params["query"].trim();
      this.searchQuery = params["query"].trim();
      this.elasticSearch();
    });
    this.IdentityType = localStorage.getItem("IdentityType")
  }

  ngAfterViewInit() {
    // console.log(this.tabset.activeId)
  }

  tabChange(e) {
    if (e) {
      this.activeTab = e.nextId;
      this.elasticSearch();
    }
  }

  elasticSearch() {
    this.spinner.show();
    var body = {
      "from": this.startIndex - 1,
      "size": this.pageSize,
      "active": this.activeTab,
      "query": {
        "multi_match": {
          "query": this.searchQuery
        }
      },
      "IdentityType": localStorage.getItem("IdentityType"),
    }
    this.elasticSearchService.search(body).subscribe(res => {
      if (res) {
        this.search_results = res["hits"];
        this.totalRecords = res["hits"].total.value;
        this.allTotal = res["hits"].groupTotal.all;

        this.tabs = this.search_results.groupTotal.others.map(tab => {
          if (this.indexDescription.find(a => a.index == tab._index)) {
            return {
              view: this.indexDescription.find(a => a.index == tab._index).desc,
              ...tab
            }
          }
        })
        // console.log(this.search_results);
        this.spinner.hide();
      }
    })
  }

  searchClick() {
    this.searchQuery = this.query;
    this.elasticSearch()
  }

  navigateToPage(searchItem) {
    var idesc = this.indexDescription.find(a => a.index == searchItem._index);
    let identityType = localStorage.getItem("IdentityType");
    var navigationURI = idesc.navigationURI.admin;

    if (identityType == "1") {
      navigationURI = idesc.navigationURI.customer;
    } else if (identityType == "2") {
      navigationURI = idesc.navigationURI.vendor;
    }

    switch (searchItem._index) {
      case "ahoms-repair-request":
        if (identityType == "1") {
          this.navCtrl.navigate('customer/RR-edit', { RRId: searchItem._source.rrid });
        }
        else if (identityType == "0") {
          this.router.navigate([navigationURI], { state: { RRId: searchItem._source.rrid } })
        }
        else if (identityType == "2") {
          this.router.navigate(['vendor/RR-edit'], {  state: {RRId: searchItem._source.rrid }})
        }

        break;
      case "ahoms-rr-customer-ref":
        this.navCtrl.navigate(navigationURI, { CustomerId: searchItem._source.customerid });
        break;
      case "ahoms-rr-follow-up":
        this.router.navigate([navigationURI], { state: { RRId: searchItem._source.rrreferenceid } });
        break;
      case "ahoms-rr-notes":
        this.router.navigate([navigationURI], { state: { RRId: searchItem._source.rrreferenceid } });
        break;
      case "ahoms-rr-vendor-parts":
        this.router.navigate([navigationURI], { state: { RRId: searchItem._source.rrreferenceid } });
        break;
      case "ahoms-rr-vendors":
        this.navCtrl.navigate(navigationURI, { VendorId: searchItem._source.vendorid });
        break;
      case "ahoms-purchase-quote":
        this.router.navigate([navigationURI], { state: { RRId: searchItem._source.rrreferenceid } });
        break;
      case "ahoms-purchase-quote-items":
        this.navCtrl.navigate(navigationURI, { RRId: searchItem._source.rrreferenceid });
        break;
      case "ahoms-sales-quote":
        this.router.navigate([navigationURI], { state: { QuoteId: searchItem._source.quoteid } });
        break;
      case "ahoms-sales-quote-items":
        this.router.navigate([navigationURI], { state: { QuoteId: searchItem._source.quoteid } });
        break;
      case "ahoms-sales-order":
        this.router.navigate([navigationURI], { state: { SOId: searchItem._source.soid } });
        break;
      case "ahoms-sales-order-items":
        this.router.navigate([navigationURI], { state: { SOId: searchItem._source.soid } });
        break;
      case "ahoms-sales-order-ref":
        this.router.navigate([navigationURI], { state: { SOId: searchItem._source.soid } });
        break;
      case "ahoms-purchase-order":

        if (identityType == "0") {
          this.router.navigate([navigationURI], { state: { POId: searchItem._source.poid } });
        }
        else if (identityType == "2") {
          this.router.navigate(['vendor/po-view'], {  state: {POId: searchItem._source.poid} })
        }

        break;
      case "ahoms-purchase-order-items":
        if (identityType == "0") {
          this.router.navigate([navigationURI], { state: { POId: searchItem._source.poid } });
        }
        else if (identityType == "2") {
          this.router.navigate(['vendor/po-view'], {  state: {POId: searchItem._source.poid} })
        }
        // this.router.navigate([navigationURI], { state:{POId: searchItem._source.poid }});
        break;
      case "ahoms-sales-invoice":
        if (identityType == "1") {
          this.router.navigate([navigationURI], { state: { InvoiceId: searchItem._source.invoiceid } })
        }
        else if (identityType == "0") {
          this.router.navigate([navigationURI], { state: { InvoiceId: searchItem._source.invoiceid } });
        }
        else if (identityType == "2") {
          this.router.navigate(['vendor/vendor-bill-view'], {  state: {VendorInvoiceId: searchItem._source.vendorinvoiceid} })
        }

        break;
      case "ahoms-sales-invoice-items":
        if (identityType == "1") {
          this.router.navigate([navigationURI], { state: { InvoiceId: searchItem._source.invoiceid } })
        }
        else if (identityType == "0") {
          this.router.navigate([navigationURI], { state: { InvoiceId: searchItem._source.invoiceid } });
        }
        else if (identityType == "2") {
          this.router.navigate(['vendor/vendor-bill-view'], {  state: {VendorInvoiceId: searchItem._source.vendorinvoiceid} })
        }
        break;
      case "ahoms-purchase-invoice":
        if (identityType == "0") {
        this.router.navigate([navigationURI], { state: { VendorInvoiceId: searchItem._source.vendorinvoiceid } });
        }
        else if (identityType == "2") {
          this.router.navigate(['vendor/vendor-bill-view'], {  state: {VendorInvoiceId: searchItem._source.vendorinvoiceid} })
        }
        break;
      case "ahoms-purchase-invoice-items":
        if (identityType == "0") {
        this.router.navigate([navigationURI], { state: { VendorInvoiceId: searchItem._source.vendorinvoiceid } });
        }else if (identityType == "2") {
          this.router.navigate(['vendor/vendor-bill-view'], {  state: {VendorInvoiceId: searchItem._source.vendorinvoiceid} })
        }
        break;
      case "ahoms-sales-quotes":
        this.router.navigate([navigationURI], { state: { QuoteId: searchItem._source.quoteid } });
        break;
        case "ahoms-mro":
        this.router.navigate([navigationURI], { state: { MROId: searchItem._source.mroid } });
        break;
      default:

        break;
    }
  }

  onPageChange(page): void {
    this.startIndex = (page - 1) * this.pageSize + 1;
    this.endIndex = (page - 1) * this.pageSize + this.pageSize;
    if (this.endIndex > this.totalRecords) {
      this.endIndex = this.totalRecords;
    }

    this.elasticSearch();
  }

  ngOnInit(): void {
    // this.spinner.show();

  }

  getIndexDescription(index) {
    return this.indexDescription.find(a => a.index == index).desc
  }

}
