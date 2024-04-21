// youtube.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class YoutubeService {
  apiKey: string = environment.youtubeApiKey;
  apiUrl: string = 'https://www.googleapis.com/youtube/v3/';

  constructor(private http: HttpClient) {}

  searchVideos(query: string, pageToken: string = ''): Observable<any> {
    const url = `${this.apiUrl}search?q=${encodeURIComponent(query)}&part=snippet&type=video&maxResults=9&key=${this.apiKey}${pageToken ? `&pageToken=${pageToken}` : ''}`;
    return this.http.get(url);
  }

  getTrendvideos(pageToken: string = ''): Observable<any> {
    const url = `${this.apiUrl}videos?part=snippet,contentDetails,statistics&chart=mostPopular&regionCode=MY&maxResults=9&key=${this.apiKey}${pageToken ? `&pageToken=${pageToken}` : ''}`;
    return this.http.get(url);
  }

  getVideoDetails(videoId: string): Observable<any> {  // Added this method
    const url = `${this.apiUrl}videos?id=${videoId}&part=snippet,contentDetails,statistics&key=${this.apiKey}`;
    return this.http.get(url);
  }

  getVideoComments(videoId: string, pageToken: string = ''): Observable<any> {
    const url = `${this.apiUrl}commentThreads?part=snippet&videoId=${videoId}&maxResults=10&key=${this.apiKey}${pageToken ? `&pageToken=${pageToken}` : ''}`;
    return this.http.get(url);
  }
}
