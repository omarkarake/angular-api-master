import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { ApiClientService } from '../../services/api-client.service';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css'], // Corrected 'styleUrl' to 'styleUrls'
})
export class NavigationComponent implements OnInit {
  activeLink: string = 'home'; // Default active link
  isViewPostRoute: boolean = false;

  constructor(
    private router: Router,
    private apiClientService: ApiClientService
  ) {}

  ngOnInit(): void {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        const navEndEvent = event as NavigationEnd;
        if (navEndEvent.urlAfterRedirects.startsWith('/home')) {
          this.activeLink = 'home';
        } else if (navEndEvent.urlAfterRedirects.startsWith('/view-post')) {
          this.activeLink = 'single';
        }
      });
  }

  setActiveLink(link: string) {
    this.activeLink = link;
  }

  openModal(): void {
    this.apiClientService.openModal();
  }
}
