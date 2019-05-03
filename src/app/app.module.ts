import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler, APP_INITIALIZER } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { DashboardModule } from './dashboard/dashboard.module';
import { load } from 'src/config-loader';
import { ConfigService } from './config.service';
import { BuildScreenErrorHandler } from './BuildScreenErrorHandler';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    CoreModule,
    DashboardModule
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: load,
      deps: [
        HttpClient,
        ConfigService
      ],
      multi: true
    },
    {
      provide: ErrorHandler,
      useClass: BuildScreenErrorHandler
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
