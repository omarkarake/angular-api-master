import { Component, OnInit } from '@angular/core';
import { ApiClientService } from '../../../services/api-client.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  constructor(private apiClient: ApiClientService) {}

  ngOnInit(): void {
    this.apiClient.getPosts().subscribe((data) => {
      console.log(data);
    });
  }
}
