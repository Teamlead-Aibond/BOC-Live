/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */

import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbDropdownModule, NgbDatepickerModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { NgApexchartsModule } from 'ng-apexcharts';
import { PagesRoutingModule } from './pages-routing.module';
import { UIModule } from '../shared/ui/ui.module';
import { BsModalRef, ModalModule } from 'ngx-bootstrap/modal';
import { LayoutsModule } from '../layouts/layouts.module';
import { ChartsModule } from 'ng2-charts';
import { AddressComponent as CustomerAddressComponent } from './customer-modules/common-template/address/address.component';
import { EditAddressComponent as CustomerEditAddressComponent } from './customer-modules/common-template/edit-address/edit-address.component';
import { AddDepartmentComponent } from './customer-modules/common-template/add-department/add-department.component';
import { EditDepartmentComponent } from './customer-modules/common-template/edit-department/edit-department.component';
import { AddAssetComponent } from './customer-modules/common-template/add-asset/add-asset.component';
import { EditAssetComponent } from './customer-modules/common-template/edit-asset/edit-asset.component';
import { EditAttachmentComponent as CustomerEditAttachmentComponent } from './customer-modules/common-template/edit-attachment/edit-attachment.component';
import { AttachementComponent as CustomerAttachementComponent } from './customer-modules/common-template/attachement/attachement.component';
import { CustomerReferenceComponent } from './customer-modules/common-template/customer-reference/customer-reference.component';
import { EditCustomerReferenceComponent } from './customer-modules/common-template/edit-customer-reference/edit-customer-reference.component';
import { WarrantyViewComponent as CustomerWarrantyViewComponent } from './customer-modules/common-template/warranty-view/warranty-view.component';
import { AddUserComponent } from './vendor-modules/common-template/add-user/add-user.component';
import { EditUserComponent } from './vendor-modules/common-template/edit-user/edit-user.component';
import { ContactAddComponent } from './vendor-modules/common-template/contact-add/contact-add.component';
import { EditContactComponent } from './vendor-modules/common-template/edit-contact/edit-contact.component';
import { RrShippingHistoryComponent } from './vendor-modules/common-template/rr-shipping-history/rr-shipping-history.component';
import { EditAttachmentComponent } from './vendor-modules/common-template/edit-attachment/edit-attachment.component';
import { AttachementComponent } from './vendor-modules/common-template/attachement/attachement.component';
import { EditAddressComponent } from './vendor-modules/common-template/edit-address/edit-address.component';
import { AddressComponent } from './vendor-modules/common-template/address/address.component';
import { WarrantyViewComponent } from './vendor-modules/common-template/warranty-view/warranty-view.component';
import { FileSaverModule, FileSaverService } from 'ngx-filesaver';
import { PipesModule } from '../shared/pipes/pipes.module';
import { RejectquoteComponent } from './customer-modules/common-template/rejectquote/rejectquote.component';
import { BlanketPoCustomerPortalComponent } from './customer-modules/common-template/blanket-po-customer-portal/blanket-po-customer-portal.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { ShippingHistoryCustomerPortalComponent } from './customer-modules/common-template/shipping-history-customer-portal/shipping-history-customer-portal.component';
import { CustomerAddWarrantyComponent } from './customer-modules/common-template/customer-add-warranty/customer-add-warranty.component';
import { CustomerPortalQrCodeComponent } from './customer-modules/common-template/customer-portal-qr-code/customer-portal-qr-code.component';
import { QRCodeModule } from 'angularx-qrcode';
import { RRCustomerAttachmentComponent } from './customer-modules/common-template/rr-customer-attachment/rr-customer-attachment.component';
import { RrCustomerAttachementEditComponent } from './customer-modules/common-template/rr-customer-attachement-edit/rr-customer-attachement-edit.component';
import { EditCustomerRefCustomerportalComponent } from './customer-modules/common-template/edit-customer-ref-customerportal/edit-customer-ref-customerportal.component';
import { CheckInComponent } from './admin-modules/inventory/check-in/check-in.component';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { CheckOutComponent } from './admin-modules/inventory/check-out/check-out.component';
import { FileUploadModule } from '@iplab/ngx-file-upload';
// import { UpsSoapComponent } from './admin-modules/ups/ups-soap/ups-soap.component';

@NgModule({
  declarations: [CustomerAddressComponent,
    CustomerEditAddressComponent,
    AddDepartmentComponent,
    EditDepartmentComponent,
    AddAssetComponent, 
    EditAssetComponent,
    CustomerEditAttachmentComponent,
    CustomerAttachementComponent,
    CustomerReferenceComponent,
    EditCustomerReferenceComponent,
    CustomerWarrantyViewComponent,
    RejectquoteComponent,
     //for venodr module
     AddUserComponent,
     EditUserComponent,
     ContactAddComponent,
     EditContactComponent,
     RrShippingHistoryComponent,
    EditAttachmentComponent, 
    AttachementComponent, 
    EditAddressComponent,
    AddressComponent,
    WarrantyViewComponent,
    BlanketPoCustomerPortalComponent,
    ShippingHistoryCustomerPortalComponent,
    CustomerAddWarrantyComponent,
    CustomerPortalQrCodeComponent,
    RRCustomerAttachmentComponent,
    RrCustomerAttachementEditComponent,
    EditCustomerRefCustomerportalComponent,
    // UpsSoapComponent,
    CheckInComponent ,
    CheckOutComponent

  
  ],
  imports: [
    ChartsModule,
    CommonModule,
    FormsModule,
    NgbDropdownModule,
    NgbDatepickerModule,
    NgApexchartsModule,
    PagesRoutingModule,
    ReactiveFormsModule,
    NgbTooltipModule,
    UIModule,
    ModalModule.forRoot(),
    FileSaverModule ,
    PipesModule,
    QRCodeModule,
    AutocompleteLibModule,
    NgSelectModule,
    FileUploadModule,



  ],
  entryComponents:[   
     CustomerAddressComponent,
     CustomerEditAddressComponent,
     AddDepartmentComponent,
     EditDepartmentComponent,
     AddAssetComponent,
     EditAssetComponent,
     CustomerEditAttachmentComponent,
     CustomerAttachementComponent,
     CustomerReferenceComponent,
     EditCustomerReferenceComponent,
     CustomerWarrantyViewComponent,
     RejectquoteComponent,
     CustomerAddWarrantyComponent,
     CustomerPortalQrCodeComponent,
     RRCustomerAttachmentComponent,
     RrCustomerAttachementEditComponent,
    //for venodr module
    AddUserComponent,
    EditUserComponent,
    ContactAddComponent,
    EditContactComponent,
    RrShippingHistoryComponent,
    EditAttachmentComponent, 
    AttachementComponent, 
    EditAddressComponent,
    AddressComponent,
    WarrantyViewComponent,
    BlanketPoCustomerPortalComponent,
    ShippingHistoryCustomerPortalComponent,
    EditCustomerRefCustomerportalComponent,
      CheckInComponent,
      CheckOutComponent

  
  ],
  providers: [
    FileSaverService,
    FormsModule,
    NgSelectModule,BsModalRef,
    
  ]
  
})
export class PagesModule { }
