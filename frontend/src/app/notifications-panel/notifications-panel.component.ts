import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NotificationsService } from 'src/services/notifications.service';
import { notifications } from '../../../../backend/src/models/notifications.model';
import { user } from '../../../../backend/src/models/user.model';
import { UserService } from 'src/services/user.service';
import { Router } from '@angular/router';
import { AuthService } from 'src/services/auth.service';

@Component({
  selector: 'app-notifications-panel',
  templateUrl: './notifications-panel.component.html',
  styleUrls: ['./notifications-panel.component.scss']
})
export class NotificationsPanelComponent implements OnInit {
  constructor(private notificationsService: NotificationsService, private userService: UserService, private authService: AuthService, private router: Router) {}

  allNotificationsArray: notifications[] = [];
  unreadNotificationsArray: notifications[] = [];
  sortedNotificationsArray: notifications[] = [];
  readNotificationsArray: notifications[] = [];

  activeTab: "unread" | "read" = "unread";

  @Input() notifications: notifications[] = [];

  getUnreadNotifications() {
    this.notificationsService.getAllNotifications().subscribe((response: notifications[]) => {
      this.allNotificationsArray = response;
      this.unreadNotificationsArray = this.allNotificationsArray.filter(notifications => notifications.readStatus === 'Unread');
      this.sortedNotificationsArray = this.unreadNotificationsArray.sort((a, b) => {
        // console.log("Unread: ", this.unreadNotificationsArray);
        return this.compareDates(a.notificationTime, b.notificationTime, false);
      });
    });
  }

  getReadNotifications() {
    this.notificationsService.getAllNotifications().subscribe((response: notifications[]) => {
      this.allNotificationsArray = response;
      this.readNotificationsArray = this.allNotificationsArray.filter(notification => notification.readStatus === 'Read');
      this.sortedNotificationsArray = this.readNotificationsArray.sort((a, b) => {
        // console.log("Read: ", this.readNotificationsArray);
        return this.compareDates(a.notificationTime, b.notificationTime, false);
      });
    });
  }

  compareDates(a: Date, b: Date, isAsc: boolean) {
    if (a < b) {
      return isAsc ? -1 : 1;
    } else if (a > b) {
      return isAsc ? 1 : -1;
    } else {
      return 0;
    }
  }

  ngOnInit(): void {
    //console.log("Notifications Initialising");
    this.getUnreadNotifications();
  }

  handleTabClick(tab: 'unread' | 'read') {
    this.activeTab = tab;

    if (this.activeTab === "unread") {
      this.getUnreadNotifications();
    }
    
    if (this.activeTab === "read") {
      this.getReadNotifications();
    }
  }

  handleKeyup(event: KeyboardEvent, link: string) {
    if (event.key === 'Enter') {
      this.navigateToTicket(link);
    }
  }

  async updateReadStatusNotifications(id: string) {
    try {
      const readNotification = await this.notificationsService.changeNotificationToRead(id).toPromise();
      console.log("Read Status Change");
    } catch (error) {
      console.error("Failed to update read status:", error);
      // Handle error if needed.
    }
  }
  
  navigateToTicket(id: string) {
    // update the notification so that it is read
    this.updateReadStatusNotifications(id).then(() => {
      location.replace(`/ticket/${id}`);
    });
  }

  getNotificationTime(notification: notifications): string {
    const notificationTime = new Date(notification.notificationTime);
    const currentTime = new Date();
    const timeDifference = currentTime.getTime() - notificationTime.getTime();
  
    // Convert the time difference to minutes, hours, days, etc.
    const minutes = Math.floor(timeDifference / (1000 * 60));
    const hours = Math.floor(timeDifference / (1000 * 60 * 60));
    const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
  
    if (days > 0) {
      return `${days} day${days > 1 ? 's' : ''} ago`;
    } else if (hours > 0) {
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else if (minutes > 0) {
      return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    } else {
      return 'Just now';
    }
  }  

  getCreatorName(emailAddress: string) {
    const user =  this.authService.getUserNameByEmail(emailAddress).subscribe((response: any) => {
      const name = response.name;
      console.log("Name: ", name);
      return name;
    });
    
  }
}
