import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/services/user.service';
import { user } from '../../../../backend/src/models/user.model';
import { TicketsService } from 'src/services/ticket.service';
import { GroupService } from 'src/services/group.service';
import { ClientService } from 'src/services/client.service';
import { ticket } from '../../../../backend/src/models/ticket.model';
import { group } from '../../../../backend/src/models/group.model';
import { client, project } from '../../../../backend/src/models/client.model';

@Component({
  selector: 'app-notifications-search',
  templateUrl: './notifications-search.component.html',
  styleUrls: ['./notifications-search.component.scss']
})
export class NotificationsSearchComponent implements OnInit {
  searchQuery!: string;
  resultsUsers: user[]=[];
  resultsGroup: group[]=[];
  resultsClients: client[]=[];
  resultsClientsName: client[] = [];
  resultsTicketsAssigned: ticket[]=[];
  resultsTicketsSummary: ticket[]=[];
  resultsTicketsDescription: ticket[]=[];
  resultsProjectName: project[]=[];
  resultsProject: client[]=[];
  allUsersArray: user[] = [];
  allTicketsArray: ticket[] = [];
  allGroupsArray: group[] = [];
  allClientsArray: client[] = [];

  searchResults: any[] = [];
  searchPerformed!: boolean;

  ticketFilter!: boolean;
  groupsFilter!: boolean;
  usersFilter!: boolean;
  clientsFilter!: boolean;
  projectsFilter!: boolean;

  constructor(private userService: UserService, private ticketService: TicketsService, private groupService: GroupService, private clientService: ClientService){
    this.ticketFilter = true;
    this.groupsFilter = true;
    this.usersFilter = true;
    this.clientsFilter = true;
    this.projectsFilter = true;
  }

  sortUsers(users: user[]): user[] {
   // console.log(users);
    return users;
  }

  sortProjects(projects: project[]): project[]{
    return projects;
  }
  sortClients(clients: client[]):client[]{
    //console.log(clients);
    return clients;
  }

  sortTickets(tickets:ticket[]):ticket[]{
    //console.log(tickets);
    return tickets;
  }
  sortGroups(groups:group[]):group[]{
    console.log(groups);
    return groups;
  }

  ngOnInit(){
      this.searchQuery = '';
      this.searchPerformed = false;
  }
 setResultsUsers(temp:user[]){
  this.resultsUsers = temp;
  //console.log('resultsUser in set',this.resultsUsers)
 }
  onSearch(){
    this.searchPerformed = true;
    this.resultsClients = [];
      this.resultsClientsName = [];
      this.resultsGroup = [];
      this.resultsProjectName = [];
      this.resultsProject = [];
      this.resultsTicketsAssigned = [];
      this.resultsTicketsSummary = [];
      this.resultsUsers = [];
    if(this.searchQuery.trim() =='')
    {
      this.resultsClients = [];
      this.resultsClientsName = [];
      this.resultsGroup = [];
      this.resultsProjectName = [];
      this.resultsProject = [];
      this.resultsTicketsAssigned = [];
      this.resultsTicketsSummary = [];
      this.resultsUsers = [];
      return;
    }
    //Searches the users by name - works
    if(this.usersFilter){
      this.userService.getAllUsers().subscribe((response:user[])=> {
        this.allUsersArray = this.sortUsers(response);
        const resultsFromUsers = this.allUsersArray.filter(item=>item.name.toLowerCase().includes(this.searchQuery.toLowerCase()));
        this.setResultsUsers(resultsFromUsers);
      });
  }
    //searches the clients by organisation - works
    if(this.clientsFilter){
    this.clientService.getAllClients().subscribe((response:client[])=>{
      this.allClientsArray = this.sortClients(response);
      const resultsFromCLients = this.allClientsArray.filter(item=>item.organisation.toLowerCase().includes(this.searchQuery.toLowerCase()));
      this.resultsClients = resultsFromCLients;
    })
  }
    //searches the clients by name - works
    if(this.clientsFilter){
    this.clientService.getAllClients().subscribe((response:client[])=>{
      this.allClientsArray = this.sortClients(response);
      const resultsFromCLients = this.allClientsArray.filter(item=>item.name.toLowerCase().includes(this.searchQuery.toLowerCase()));
      this.resultsClientsName = resultsFromCLients;
    })
  }
    //searches the tickets by assigned - works
    if(this.ticketFilter){
    this.ticketService.getAllTickets().subscribe((response:ticket[])=>{
    this.allTicketsArray = this.sortTickets(response);
    const resultsFromTickets = this.allTicketsArray.filter(item=>item.assigned.toLowerCase().includes(this.searchQuery.toLowerCase()));
    this.resultsTicketsAssigned = resultsFromTickets;
   })
  }
   //searches the tickets by summary - works
   if(this.ticketFilter){
    this.ticketService.getAllTickets().subscribe((response:ticket[])=>{
    this.allTicketsArray = this.sortTickets(response);
    const resultFromTickets = this.allTicketsArray.filter(item=>item.summary.toLowerCase().includes(this.searchQuery.toLowerCase()));
    this.resultsTicketsSummary = resultFromTickets;
   })
  }
  //searches the tickets by description - works
  if(this.ticketFilter){
    this.ticketService.getAllTickets().subscribe((response:ticket[])=>{
    this.allTicketsArray = this.sortTickets(response);
    const resultFromTickets = this.allTicketsArray.filter(item=>item.description.toLowerCase().includes(this.searchQuery.toLowerCase()));
    this.resultsTicketsDescription = resultFromTickets;
   })
  }
   //searches the clients by projects - works
   if(this.projectsFilter){
   this.clientService.getAllClients().subscribe((response:client[])=>{
    this.allClientsArray = this.sortClients(response);
    const resultsProjectName = this.allClientsArray.filter((item) =>
    item.projects.some((project)=>
    project.name.toLowerCase().includes(this.searchQuery.toLowerCase()))
    );
    this.resultsProject = resultsProjectName;
    const size = this.resultsProject[0].projects.length;
    for( let loop = 0; loop < size;loop++){
      if(this.resultsProject[0].projects[loop].name.toLowerCase() == this.searchQuery.toLowerCase()){
        //console.log('found');
        this.resultsProjectName.push(this.resultsProject[0].projects[loop]);
      }
    }
    console.log('Project:',this.resultsProjectName);
    // console.log('size', size);
   });
  }

  //searches groups by name - works
  if(this.groupsFilter){
    this.groupService.getGroups().subscribe((response:group[])=>{
    this.allGroupsArray = this.sortGroups(response);
    const resultGroup = this.allGroupsArray.filter(item=>item.groupName.toLowerCase().includes(this.searchQuery.toLowerCase()));
    this.resultsGroup = resultGroup;
    console.log("group:", this.resultsGroup);
  })
  }
}
}
