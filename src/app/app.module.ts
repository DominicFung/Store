import { BrowserModule } from '@angular/platform-browser'
import { NgModule } from '@angular/core'
import { FormsModule , ReactiveFormsModule } from '@angular/forms'
import { HttpModule } from '@angular/http'
import { RouterModule, Routes } from '@angular/router'
import { StoreModule } from '@ngrx/store'
import { StoreRouterConnectingModule } from '@ngrx/router-store'

import { DropzoneModule, DropzoneConfigInterface } from 'ngx-dropzone-wrapper'

import { AppComponent } from './app.component'
import { StoredisplayComponent } from './components/storedisplay/storedisplay.component'
import { StoreitemComponent } from './components/storeitem/storeitem.component'
import { HomeComponent } from './components/home/home.component'
import { AdminComponent } from './components/admin/admin.component'

import { StoreDataService } from './services/store-data.service'
import { adminReducer } from './reducer/admin.reducer'
import { pageReducer } from './reducer/page.reducer'
import { itemReducer } from './reducer/item.reducer';
import { StorecartComponent } from './components/storecart/storecart.component';
import { TopMatchPipe } from './filter/top-match.pipe'

const appRoutes: Routes = [
  {path:'', component:HomeComponent},
  {path:'store', component:StoredisplayComponent},
  {path:'administrator/login', component:AdminComponent},
  {path:'store/:id', component:StoreitemComponent},
  {path:'cart', component:StorecartComponent}
]

const DROPZONE_CONFIG: DropzoneConfigInterface = {
  url: '/api/upload',
  acceptedFiles: 'image/*',
  uploadMultiple: true
}

@NgModule({
  declarations: [
    AppComponent,
    StoredisplayComponent,
    StoreitemComponent,
    HomeComponent,
    AdminComponent,
    StorecartComponent,
    TopMatchPipe
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    ReactiveFormsModule,
    RouterModule.forRoot(appRoutes),
    StoreRouterConnectingModule,
    StoreModule.forRoot({ admin: adminReducer, page: pageReducer, storeData: itemReducer}),
    DropzoneModule.forRoot(DROPZONE_CONFIG)
  ],
  providers: [ StoreDataService ],
  bootstrap: [AppComponent]
})
export class AppModule { }

//ng g component components/${commponentName}
