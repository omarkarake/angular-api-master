import { Component } from '@angular/core';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.css',
})
export class NavigationComponent {
  activeLink: string = 'home'; // Default active link

  setActiveLink(link: string) {
    this.activeLink = link;
  }
}
