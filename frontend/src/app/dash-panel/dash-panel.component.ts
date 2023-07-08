import { Component, Output, EventEmitter, Input, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { NavbarService } from 'src/services/navbar.service';
@Component({
  selector: 'app-dash-panel',
  templateUrl: './dash-panel.component.html',
  styleUrls: ['./dash-panel.component.scss']
})
export class DashPanelComponent implements OnInit{
  @Output() openForm = new EventEmitter<void>();
  @Input() tickets: any[] = [];

  isCollapsed!: boolean;

  constructor(public authService: AuthService, private router: Router, public navbarService: NavbarService) { }

  ngOnInit(): void {
    this.navbarService.collapsed$.subscribe(collapsed => {
      this.isCollapsed = collapsed;
    });
  }

  toggleCollapse(){
    this.isCollapsed = !this.isCollapsed;
    this.navbarService.setCollapsedState(this.isCollapsed);
  }

  openNewTicketForm() {
    console.log("openNewTicketForm called");
    this.router.navigate(['/new-ticket-form']);
  }

  openCreateAccount() {
    console.log("openCreateAccount called");
    this.router.navigate(['/create-account']);
  }

  openSettings(){
    console.log("settings page called");
    this.router.navigate(['/settings']);
  }

  openDashboard(){
    console.log("dashboard page called");
    this.router.navigate(['/dashboard']);
  }

  //checking active route
  checkIfDashboardRoute(): boolean {
    return this.router.url.includes('dashboard') || /^\/ticket\/\d+$/.test(this.router.url);
  }

  checkIfGroupsRoute(): boolean {
    return this.router.url.includes('group');
  }

  checkIfAnalyticsRoute(): boolean {
    return this.router.url.includes('analytics');
  }

  checkIfCreateAccountRoute(): boolean {
    return this.router.url.includes('create-account');
  }

  checkIfCreateTicketRoute(): boolean {
    return this.router.url.endsWith('/new-ticket-form');
  }

  checkIfProfileRoute(): boolean {
    return this.router.url.includes('settings');
  }
}
