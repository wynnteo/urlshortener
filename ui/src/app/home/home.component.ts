import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MainService } from '../services/main.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Clipboard } from '@angular/cdk/clipboard';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  enteredURL: string = "";
  result: any =  null;
  btn_text: string = "Copy";

  constructor(private route:ActivatedRoute, private api:MainService, private snackBar: MatSnackBar, private clipboard: Clipboard) { }

  ngOnInit(): void {
    
  }

  // User click `GO` button to shorten an URL
  shortenurl() {
    this.api.createShortenURL({url:this.enteredURL}).subscribe(
      {
        next: (resp: any) => {
          this.result = {
            org_url: this.enteredURL,
            new_url: "http://" + window.location.hostname + "/" +resp.data
          }
          this.btn_text = "Copy";
        },
        error: (err: any) => {
          this.result = {};
          console.error(err);
            this.snackBar.open("Request error, please try again!", "Dismiss", {
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