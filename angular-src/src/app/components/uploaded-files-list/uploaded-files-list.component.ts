import { Component, OnInit } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { UploadService } from '../../services/upload.service';

@Component({
  selector: 'app-uploaded-files-list',
  templateUrl: './uploaded-files-list.component.html',
  styleUrls: ['./uploaded-files-list.component.css']
})
export class UploadedFilesListComponent implements OnInit {

  uploadedFiles: Array<any>;
  username : String;

  constructor(
    private uploadService : UploadService
  ) { }

  ngOnInit() {
    this.username = JSON.parse(localStorage.getItem("user")).username;
    this.uploadService.getFiles(this.username)
      .then(data => {
        this.uploadedFiles = data;
      })
  }

  downloadFile(filename) {
    this.uploadService.downloadFile(filename)
      .subscribe(
        data => {
          //console.log(data);
        }
      )
  }

  deleteFile(file) {
    let id = file["_id"];
    this.uploadService.deleteFile(id);
  }
}

