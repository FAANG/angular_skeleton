import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {NgIf, NgOptimizedImage} from "@angular/common";
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-item',
  standalone: true,
  imports: [
    NgIf,
    NgOptimizedImage,
    HttpClientModule
  ],
  templateUrl: './item.component.html',
  styleUrl: './item.component.css'
})
export class ItemComponent implements OnInit {
  itemId: string | null = null;
  pdfSrc: SafeResourceUrl | null | undefined;
  imgSrc: SafeResourceUrl | null | undefined;

  constructor(private route: ActivatedRoute, private http: HttpClient,
              private sanitizer: DomSanitizer) {}

  ngOnInit(): void {
    this.itemId = this.route.snapshot.paramMap.get('id');
    if (this.itemId) {
      this.setFileSource(`assets/pdfs/${this.itemId}.pdf`, 'pdf');
      this.setFileSource(`assets/imgs/${this.itemId}.jpg`, 'img');
    }
  }

  private setFileSource(path: string, type: 'pdf' | 'img'): void {
    this.checkFileExistence(path).then(exists => {
      if (type === 'pdf') {
        this.pdfSrc = exists ? this.sanitizer.bypassSecurityTrustResourceUrl(path) : null;
      } else if (type === 'img') {
        this.imgSrc = exists ? this.sanitizer.bypassSecurityTrustResourceUrl(path) : null;
      }
    });
  }

  private checkFileExistence(url: string): Promise<boolean> {
    return this.http.head(url, { observe: 'response' }).toPromise()
        .then(response => response?.status === 200)
        .catch(() => false);
  }
}
