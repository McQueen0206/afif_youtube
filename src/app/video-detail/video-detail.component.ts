import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { YoutubeService } from '../youtubeservice.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-video-detail',
  templateUrl: './video-detail.component.html',
  styleUrls: ['./video-detail.component.css']
})
export class VideoDetailComponent implements OnInit {
  videoId: string = '';
  videoUrl!: SafeResourceUrl;
  videoTitle: string = 'Unknown Video';
  videoDescription: string = 'No description available.';
  videoPublicationDate: Date = new Date();
  videoViewCount: number = 0;
  videoLikeCount: number = 0;
  comments: any[] = [];
  nextPageToken: string = '';

  constructor(
    private route: ActivatedRoute,
    private youtubeService: YoutubeService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.videoId = params['id'];
      if (this.videoId) {
        this.initializeVideo(this.videoId);
      }
    });
  }

  initializeVideo(videoId: string) {
    this.videoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(`https://www.youtube.com/embed/${videoId}`);
    this.fetchVideoDetails(videoId);
    this.fetchVideoComments(videoId);
  }

  fetchVideoDetails(videoId: string) {
    this.youtubeService.getVideoDetails(videoId).subscribe(details => {
      const videoDetails = details.items[0];
      this.videoTitle = videoDetails.snippet.title;
      this.videoDescription = videoDetails.snippet.description;
      this.videoPublicationDate = new Date(videoDetails.snippet.publishedAt);
      this.videoViewCount = videoDetails.statistics.viewCount;
      this.videoLikeCount = videoDetails.statistics.likeCount;
    });
  }

  fetchVideoComments(videoId: string, pageToken: string = '') {
    this.youtubeService.getVideoComments(videoId, pageToken).subscribe(data => {
      this.comments = this.comments.concat(data.items);
      this.nextPageToken = data.nextPageToken || '';
    });
  }

  loadMoreComments() {
    if (this.nextPageToken) {
      this.fetchVideoComments(this.videoId, this.nextPageToken);
    }
  }
}
