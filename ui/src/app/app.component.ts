import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MainService } from './services/main.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'URL Shortener | Wynn Teo';

  constructor(private route:ActivatedRoute, private api:MainService, private snackBar: MatSnackBar, private router: Router) {
    const value = this.route.snapshot.paramMap.get('id');
    if (value) {
      this.api.getShortenURL(value).subscribe(
        {
          next: (resp: any) => {
            if (resp.data.org_url.indexOf("http://") == 0 || resp.data.org_url.indexOf("https://") == 0) {
              (window as any).open(resp.data.org_url, "_self");
            } else {
              (window as any).open(`http://${resp.data.org_url}`, "_self");
            }
          },
          error: (err: any) => {
            let msg = "An unknown error occurred.";
            if (err.status === 404) {
              msg = "The requested URL does not exist.";
            } else if (err.status=== 500) {
              msg = "An error occurred on the server.";
            }

            this.router.navigate(['/']);
            this.snackBar.open(msg, "Dismiss", {
              duration: 3000,
              verticalPosition: 'top',
              horizontalPosition: 'right',
              panelClass: ['red-snackbar']
           });
          },
        }
      )
    } 
  }

}