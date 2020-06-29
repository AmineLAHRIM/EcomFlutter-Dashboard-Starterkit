import {AfterViewInit, Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';

import {AuthService} from '../../../core/services/auth.service';
import {Message} from '../../../core/models/message';

@Component({
    selector: 'app-signup',
    templateUrl: './signup.component.html',
    styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit, AfterViewInit {

    signupForm: FormGroup;
    submitted = false;
    errors: Message[] = [];
    successmsg = false;

    // set the currenr year
    year: number = new Date().getFullYear();

    // tslint:disable-next-line: max-line-length
    constructor(private formBuilder: FormBuilder, private route: ActivatedRoute, private router: Router, private authService: AuthService) {
    }

    ngOnInit() {

        this.signupForm = this.formBuilder.group({
            username: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            password: ['', Validators.required],
        });
    }

    ngAfterViewInit() {
    }

    // convenience getter for easy access to form fields
    get f() {
        return this.signupForm.controls;
    }

    /**
     * On submit form
     */
    onSubmit() {
        this.submitted = true;

        // stop here if form is invalid
        if (this.signupForm.invalid) {
            return;
        }

        this.authService.register(this.f.username.value, this.f.email.value, this.f.password.value).subscribe(res => {

            if (res.succes) {
                this.errors = [];
                this.successmsg = true;
                setTimeout(() => {
                    this.router.navigate(['/default']);
                }, 1000);
            }
        }, errorMessages => {
            console.log('signup errors', errorMessages);
            this.errors = errorMessages;
        });
    }
}
