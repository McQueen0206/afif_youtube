import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { YoutubeService } from '../youtubeservice.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  searchQuery: string = '';
  trendingVideos: any[] = [];
  nextPageToken: string = '';
  prevPageToken: string = '';
  currentPageToken: string = '';
  currentPage: number = 1;
  totalResults: number = 0;
  resultsPerPage: number = 9; 
  totalPages: number = 0;

  constructor(private youtubeService: YoutubeService, private router: Router) {}

  ngOnInit() {
    this.fetchTrendingVideos();
  }

  searchVideos() {
    if (!this.searchQuery) return;
    this.router.navigate(['/search'], { queryParams: { q: this.searchQuery, pageToken: this.currentPageToken } });
  }

  fetchTrendingVideos(token: string = '') {
    this.youtubeService.getTrendvideos(token).subscribe(data => {
      this.trendingVideos = data.items;
      this.totalResults = data.pageInfo.totalResults;
      this.nextPageToken = data.nextPageToken;
      this.prevPageToken = data.prevPageToken;
      this.totalPages = Math.ceil(this.totalResults / this.resultsPerPage);
    }, error => {
      console.error('Error fetching trending videos:', error);
    });
  }

  goToNextPage() {
    this.currentPage++;
    this.currentPageToken = this.nextPageToken;
    this.fetchTrendingVideos(this.nextPageToken);
  }

  goToPrevPage() {
    this.currentPage--;
    this.currentPageToken = this.prevPageToken;
    this.fetchTrendingVideos(this.prevPageToken);
  }
}
