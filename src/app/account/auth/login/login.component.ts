import {AfterViewInit, Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

import {AuthService} from '../../../core/services/auth.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Message} from '../../../core/models/message';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})

/**
 * Login component
 */
export class LoginComponent implements OnInit, AfterViewInit {

    loginForm: FormGroup;
    submitted = false;
    errors: Message[] = [];

    // set the currenr year
    year: number = new Date().getFullYear();

    // tslint:disable-next-line: max-line-length
    constructor(private formBuilder: FormBuilder, private route: ActivatedRoute, private router: Router, private authService: AuthService) {
    }

    ngOnInit() {
        this.loginForm = this.formBuilder.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', Validators.required],
            rememberme: [false]
        });

        // reset login status
        this.authService.logout();
    }

    ngAfterViewInit() {
    }

    // convenience getter for easy access to form fields
    get f() {
        return this.loginForm.controls;
    }

    /**
     * Form submit
     */
    onSubmit() {
        this.submitted = true;

        // stop here if form is invalid
        if (this.loginForm.invalid) {
            return;
        }

        this.authService.login(this.f.email.value, this.f.password.value, this.f.rememberme.value).subscribe(res => {
            if (res.succes) {
                this.errors = [];
                this.router.navigate(['/ecommerce/products']);
            }
        }, errorMessages => {
            this.errors = errorMessages;
        });
    }
}
