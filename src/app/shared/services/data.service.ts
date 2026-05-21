import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

export interface UploadResponse {
  data: {
    baseCodeFile: string;
    name: string;
  };
  errors: any[];
  message: string;
  status: boolean;
}

export interface DownloadResponse {
  data: {
    extension: string;
    fileName: string;
    bytesFile: string;
  };
}

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

const httpOptionsToken = {
  headers: new HttpHeaders({
    'apiKey': ''
  })
};

@Injectable({
  providedIn: 'root'
})
export class DataService {

    //Declare the environment and api
    private environmentXD: string = 'prd';
    private API: string;

  constructor( private httpClient: HttpClient) {
    switch (this.environmentXD) {
      case 'local':
        this.API = '';
        break;
      case 'dev':
        this.API = '';
        break;
      case 'prd':
        this.API = environment.apiUrl;
        break;
    }
  }

  doRequestPost(endpoint, data): any{
    console.log('REQUEST POST',data);
    console.log(JSON.stringify(data));
    return this.httpClient.post(this.API + '/collection/doit/' + endpoint, data, httpOptions);
  }

  uploadFile(file: File): Observable<UploadResponse> {
    const baseCodeFolder = "CB581EF0-4736-4091-BC49-314AE485CFFB";
    const formData = new FormData();
    formData.append('BaseCodeFolder', baseCodeFolder);
    formData.append('file', file);
    return this.httpClient.post<UploadResponse>( this.API + `/file/upload`, formData);
  }

  downloadFile(baseCodeFile: string): Observable<DownloadResponse> {
    return this.httpClient.get<DownloadResponse>(this.API + `/file/download/${baseCodeFile}`);
  }
}
