import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
@Component({ selector:'app-root', templateUrl:'./app.component.html' })
export class AppComponent implements OnInit{
  title='Fleet Dashboard'; drivers:any[]=[]; trucks:any[]=[];
  constructor(private http:HttpClient){}
  ngOnInit(){
    this.http.get<any[]>('/api/drivers').subscribe(d=>this.drivers=d);
    this.http.get<any[]>('/api/trucks').subscribe(t=>this.trucks=t);
  }}