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
  imgSrc: SafeResourceUrl | null | undefined;
  loadingError: string | null = null;

  constructor(private route: ActivatedRoute, private http: HttpClient,
              private sanitizer: DomSanitizer) {}

  ngOnInit(): void {
    this.itemId = this.route.snapshot.paramMap.get('id');
    if (this.itemId) {
      this.loadImage(`assets/imgs/${this.itemId}.jpg`);
    }
  }

  private loadImage(imageUrl: string): void {
    if (typeof Worker !== 'undefined') {
      const worker = new Worker(new URL('../app.worker', import.meta.url));
      worker.onmessage = ({ data }) => {
        if (data.error) {
          this.loadingError = data.error;
          this.imgSrc = null;
        } else {
          this.imgSrc = this.sanitizer.bypassSecurityTrustResourceUrl(data as string);
        }
      };
      worker.postMessage({ imageUrl });
    } else {
      console.log('Web Workers are not supported in this environment.');
      this.fallbackLoadImage(imageUrl);
    }
  }

  private fallbackLoadImage(imageUrl: string): void {
    this.http.get(imageUrl, { responseType: 'blob' }).subscribe(blob => {
      const reader = new FileReader();
      reader.onloadend = () => {
        this.imgSrc = this.sanitizer.bypassSecurityTrustResourceUrl(reader.result as string);
      };
      reader.readAsDataURL(blob);
    }, error => {
      this.loadingError = 'Failed to load image';
    });
  }

  private setFileSource(path: string, type: 'img'): void {
    this.checkFileExistence(path).then(exists => {
      if (type === 'img') {
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
