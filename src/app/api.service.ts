import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = 'https://automatic-space-train-v66gj966pp7vc7rg-5000.app.github.dev'; // Replace with your base API URL

  constructor(private http: HttpClient) {}

  getFileNames(): Observable<string[]> {
    const url = `${this.baseUrl}/get_file_names`;
    return this.http.get<string[]>(url);
  }

  getPieChartData(fileName: string): Observable<any> {
    const apiUrl = `${this.baseUrl}/pie_chart_data`;
    const requestBody = { file_name: fileName }; // Prepare the request body

    return this.http.post<any>(apiUrl, requestBody);
  }
}
