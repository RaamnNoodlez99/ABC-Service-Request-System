import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Router } from "@angular/router";
import { Injectable } from "@angular/core";
import { ticket, attachment, TicketModel } from "../../../backend/tickets/src/models/ticket.model";
import { map, switchMap, tap } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})

export class TicketsService {
  TICKET_URL = 'http://localhost:3000/api/ticket';
  USER_URL: any;
  API_URL = 'http://localhost:3000/api/user';

  private token: string | null;

  constructor(private http: HttpClient, private router: Router) {
    this.token = localStorage.getItem('token'); // retrieve token from localStorage
  }

  getAllTickets(){
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);
    console.log('Bearer ${this.token}:', `Bearer ${this.token}`);
    console.log('Ticket HEADER:', headers);
    return this.http.get<ticket[]>(this.TICKET_URL, {headers});
  }

  getTicketWithID(objectId: string){
    return this.http.get<ticket>(`${this.TICKET_URL}/id?id=${objectId}`);
  }

  getTicketsWithName(userName: string) {
    return this.http.get<ticket[]>(`${this.TICKET_URL}/assigned?id=${userName}`);
  }

  getTicketsWithProjectName(projectName: string) {
    console.log('went in service');
    return this.http.get<ticket[]>(`${this.TICKET_URL}/project?name=${projectName}`);
  }

  getAllProjectNamesForCurrentUserWithGroupName(groupName: string){
    console.log('groupname service: ', groupName);
    return this.http.get<string[]>(`${this.TICKET_URL}/projects?groupName=${groupName}`);
  }

  getTicketsWithGroupName(groupName: string) {
    return this.http.get<ticket[]>(`${this.TICKET_URL}/group?name=${groupName}`);
  }

  makeAComment(ticketId: string, comment: string, author: string, authorPhoto: string, type: string, attachment: attachment){
    const body = {ticketId, comment, author, authorPhoto, type, attachment};
    return this.http.put(`http://localhost:3001/api/ticket/comment`, body);
  }

  // Add Ticket Functionality
  addTicket(summary: string,  description: string, assignee: string, assigned: string, group: string, priority: string, startDate: string, endDate: string, status: string, comments: string[], project: string, todo: string[], todoChecked: boolean[], assigneeFullName: string, assignedFullName: string) {
    const body = {summary, description, assignee, assigned, group, priority, startDate, endDate, status, comments, project, todo, todoChecked, assigneeFullName, assignedFullName};
   console.log('Ticket is added service:', body);
   const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);
   console.log('Bearer ${this.token}:', `Bearer ${this.token}`);
   console.log('Ticket HEADER:', headers);
    return this.http.post(`${this.TICKET_URL}/addticket`, body , {headers});
  }

  updateTodoChecked(id: string, todoChecked: boolean[]) {
    const body = { todoChecked };
    return this.http.put(`${this.TICKET_URL}/updateTodoChecked/${id}`, body);
  }

  uploadFile(file: File) {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post<{ url: string }>(`${this.TICKET_URL}/upload`, formData);
  }

  updateTicketStatus(ticketId: string, status: string) {
    const body = {ticketId, status};
    return this.http.put(`${this.TICKET_URL}/updateStatus`, body);
  }

  addTimeToFirstResponse(ticketId: string, commentTime: Date) {
    return this.http.post(`${this.TICKET_URL}/addTimeToFirstResponse`, {ticketId, commentTime});
  }

}
