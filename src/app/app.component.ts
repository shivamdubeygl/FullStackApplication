import { Component, OnInit  } from '@angular/core';
import { ApiService } from './api.service';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'angular-codespace';
  responseData: any;
  dataControl = new FormControl();
  dataList$!: Observable<string[]>;
  selectedFileName!: string;

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.dataList$ = this.apiService.getFileNames();
    this.dataControl.valueChanges.subscribe((fileName: string) => {
      this.selectedFileName = fileName;
    });
  }
}
