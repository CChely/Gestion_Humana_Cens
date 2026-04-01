/* eslint-disable */
import * as moment from 'moment';

export const notifications = [
    {
        id         : '493190c9-5b61-4912-afe5-78c21f1044d7',
        icon       : 'heroicons_solid:star',
        title      : 'Daily challenges',
        description: 'Your submission has been accepted',
        time       : moment().subtract(25, 'minutes').toISOString(), // 25 minutes ago
        read       : false
    },
    {
        id         : '6e3e97e5-effc-4fb7-b730-52a151f0b641',
        image      : 'assets/images/avatars/male-04.jpg',
        description: '<strong>Leo Gill</strong> added you to <em>Top Secret Project</em> group and assigned you as a <em>Project Manager</em>',
        time       : moment().subtract(50, 'minutes').toISOString(), // 50 minutes ago
        read       : true,
        link       : '/dashboards/project',
        useRouter  : true
    },
    {
        id         : 'b91ccb58-b06c-413b-b389-87010e03a120',
        icon       : 'heroicons_solid:mail',
        title      : 'Mailbox',
        description: 'You have 15 unread mails across 3 mailboxes',
        time       : moment().subtract(3, 'hours').toISOString(), // 3 hours ago
        read       : false,
        link       : '/dashboards/project',
        useRouter  : true
    },
    {
        id         : '541416c9-84a7-408a-8d74-27a43c38d797',
        icon       : 'heroicons_solid:refresh',
        title      : 'Cron jobs',
        description: 'Your <em>Docker container</em> is ready to publish',
        time       : moment().subtract(5, 'hours').toISOString(), // 5 hours ago
        read       : false,
        link       : '/dashboards/project',
        useRouter  : true
    },
    {
        id         : 'ef7b95a7-8e8b-4616-9619-130d9533add9',
        image      : 'assets/images/avatars/male-06.jpg',
        description: '<strong>Roger Murray</strong> accepted your friend request',
        time       : moment().subtract(7, 'hours').toISOString(), // 7 hours ago
        read       : true,
        link       : '/dashboards/project',
        useRouter  : true
    } 
  
];
