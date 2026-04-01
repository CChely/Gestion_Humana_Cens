import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyMenuModule as MatMenuModule } from '@angular/material/legacy-menu'; 
import { FuseLoadingBarModule } from '@fuse/components/loading-bar';
import { FuseNavigationModule } from '@fuse/components/navigation';  
import { NotificationsModule } from 'app/layout/common/notifications/notifications.module'; 
import { SearchModule } from 'app/layout/common/search/search.module'; 
import { UserModule } from 'app/layout/common/user/user.module';
import { SharedModule } from 'app/shared/shared.module';
import { ModernLayoutComponent } from 'app/layout/layouts/horizontal/modern/modern.component';

@NgModule({
    declarations: [
        ModernLayoutComponent
    ],
    imports     : [
        HttpClientModule,
        RouterModule,
        MatButtonModule,
        MatDividerModule,
        MatIconModule,
        MatMenuModule, 
        FuseLoadingBarModule,
        FuseNavigationModule,  
        NotificationsModule, 
        SearchModule, 
        UserModule,
        SharedModule
    ],
    exports     : [
        ModernLayoutComponent
    ]
})
export class ModernLayoutModule
{
}
