import { Component, OnInit } from '@angular/core';
import { UploadService } from '../../services/upload.service';
import { FlashMessagesService } from 'angular2-flash-messages';

const URL = 'http://localhost:3000/api/';
const maxFileSize: Number = 1024 * 1024 * 10;
const validExtensions: Array<string> = [
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
];

@Component({
  selector: 'app-file-upload-form',
  templateUrl: './file-upload-form.component.html',
  styleUrls: ['./file-upload-form.component.css']
})
export class FileUploadFormComponent implements OnInit {

  username: String;
  password: String;
  disabled: boolean = true;


  constructor(
    private uploadService : UploadService,
    private flashMessagesService: FlashMessagesService,
  ) { }

  ngOnInit() {
  }

  onSubmit(input){
    if (this.disabled == false) {
      this.uploadService.uploadFile(input);
      input.value = '';
      this.disabled = true;
    }
  }

  onFileChange(event) {
    let fileList: FileList = event.target.files;

    // Check if the file size and the extension are appropriate
    if (fileList.length > 0) {
      let file: File = fileList[0];

      if (file.size > maxFileSize) {
        this.flashMessagesService.show('The file size shouldn\'t exceed 10Mb', {cssClass: 'alert-danger', timeout: 5000});
        this.disabled = true;
      }
      else if (validExtensions.indexOf(file.type) === -1) {
        this.flashMessagesService.show('This file type is invalid', {cssClass: 'alert-danger', timeout: 5000});
        this.disabled = true;
      }
      else {
        this.disabled = false;
      }
    }
  }

}
