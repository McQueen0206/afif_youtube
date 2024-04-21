import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { YoutubeService } from '../youtubeservice.service';

@Component({
  selector: 'app-searchresult',
  templateUrl: './searchresult.component.html',
  styleUrls: ['./searchresult.component.css']
})
export class SearchResultComponent implements OnInit {
  videos: any[] = [];
  query: string = '';  // Ensure query is always initialized

  constructor(private route: ActivatedRoute, private youtubeService: YoutubeService) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.query = params['q'] || '';  // Default to empty string if no query param is provided
      this.searchVideos();
    });
  }

  searchVideos(): void {
    if (this.query && this.query.trim() !== '') {
      this.youtubeService.searchVideos(this.query.trim()).subscribe({
        next: (response: any) => {
          this.videos = response.items;
        },
        error: (err) => console.error('Failed to fetch videos', err)
      });
    }
  }
}
