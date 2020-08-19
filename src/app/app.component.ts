import {Component, OnInit} from '@angular/core';
import {AuthService} from './core/services/auth.service';
import {RoutingStateService} from './core/services/routing-state.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

    constructor(private authService: AuthService, private routingStateService: RoutingStateService) {
        this.routingStateService.loadRouting();
    }

    ngOnInit(): void {
        this.authService.autoLogin();
    }
}
