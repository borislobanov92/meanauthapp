import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, ResponseContentType, Response } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import * as FileSaver from 'file-saver';


@Injectable()
export class UploadService {

  uploadedFiles: Array<any>;

  constructor(
    private http : Http
  ) { }

  getFiles(username) : Promise<any>{
    let url = 'http://localhost:3000/api/files/' + username;

    return this.http.get(url)
      .toPromise()
      .then(res => res.json())
      .then(data => this.uploadedFiles = data)
      .catch(this.handleError);
  }

  uploadFile(input) : Promise<any> {
    let fileList: FileList = input.files;

    if(fileList.length > 0) {
      let file: File = fileList[0];
      let url = 'http://localhost:3000/api/upload';
      let formData = new FormData();
      let owner = localStorage.getItem('user');

      formData.append('owner', owner);
      formData.append('uploadFile', file);

      return this.http.post(url, formData)
        .toPromise()
        .then(res => {
          return res.json();
        })
        .then(file => {
          this.uploadedFiles.push(file);
          return {'success': true, msg: 'File uploaded'};
        })
        .catch(this.handleError);
    }
  }

  deleteFile(id) {
    let url = 'http://localhost:3000/api/files/' + id;
    let headers = new Headers({ 'Content-Type': 'application/json'});
    let options = new RequestOptions({ headers });

    return this.http.delete(url, options)
      .toPromise()
      .then(res => {
        let index = this.uploadedFiles
          .map(file => file["_id"])
          .indexOf(id);

        this.uploadedFiles.splice(index, 1);
      })
      .catch(this.handleError);
  }

  downloadFile(filename) {
    let url = 'http://localhost:3000/api/files/' + filename;
    let headers = new Headers({
      'Content-Type': 'application/json',
      'Accept': 'application/vnd.ms-excel' });
    let options = new RequestOptions({ headers: headers, responseType: ResponseContentType.Blob });

    return this.http.post(url, '', options)
      .map(res => {
        let blob: Blob = res.blob();
        return FileSaver['saveAs'](blob, filename);
      });
  }

  private handleError(error : any) {
    console.error('Произошла ошибка', error);
    return Promise.reject(error.message || error);
  }
}
