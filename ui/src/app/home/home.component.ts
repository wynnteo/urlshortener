import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MainService } from '../services/main.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Clipboard } from '@angular/cdk/clipboard';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  shortenForm!: FormGroup ;
  result: any =  null;
  btn_text: string = "Copy";

  constructor(private fb: FormBuilder, private route:ActivatedRoute, private api:MainService, private snackBar: MatSnackBar, private clipboard: Clipboard) { }

  ngOnInit(): void {
    this.shortenForm = this.fb.group({
      enteredURL: new FormControl('', [Validators.required, Validators.pattern('^(http|https)://[a-zA-Z0-9\-\.]+\.[a-zA-Z]{2,3}(/\S*)?$')])
    });
  }

  // User click `GO` button to shorten an URL
  shortenurl() {
    if (this.shortenForm.invalid && this.shortenForm.controls['enteredURL']?.errors?.['required']) {
      this.snackBar.open('URL is required', 'Dismiss', {
        duration: 3000,
        verticalPosition: 'top',
        horizontalPosition: 'right',
        panelClass: ['red-snackbar']
      });
      return;
    }

    if (this.shortenForm.invalid && this.shortenForm.controls['enteredURL']?.errors?.['pattern']) {
      this.snackBar.open('Invalid URL format.', 'Dismiss', {
        duration: 3000,
        verticalPosition: 'top',
        horizontalPosition: 'right',
        panelClass: ['red-snackbar']
      });
      return;
    }
    const enteredUrl = this.shortenForm.get('enteredURL')?.value;
    this.api.createShortenURL({url: enteredUrl}).subscribe(
      {
        next: (resp: any) => {
          this.result = {
            org_url: enteredUrl,
            new_url: "http://" + window.location.hostname + "/" +resp.data
          }
          this.btn_text = "Copy";
        },
        error: (err: any) => {
          this.result = {};
          let msg = "An unknown error occurred.";
          if (err.status === 400 && err.error.msg) {
            msg =  && err.error.msg;
          } else if (err.status === 500) {
            msg = "An error occurred on the server.";
          }
          this.snackBar.open(msg, "Dismiss", {
            duration: 3000,
            verticalPosition: 'top',
            horizontalPosition: 'right',
            panelClass: ['red-snackbar']
         });
        }
      }
    )
  }

  goToURL(orgLink: string): void {
    if (orgLink.indexOf("http://") == 0 || orgLink.indexOf("https://") == 0) {
      (window as any).open(orgLink);
    } else {
      (window as any).open(`http://${orgLink}`);
    }
  }

  copyToClipboard(link: string) {
    this.clipboard.copy(link);
    this.btn_text = "Copied!";
  }
}