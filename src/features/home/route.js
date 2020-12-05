import { WelcomePage } from './';
import { Chat } from './';

export default {
  path: '',
  childRoutes: [
    { path: 'welcome-page', component: WelcomePage, isIndex: true },
    { path: 'chat', component: Chat }
    ],
};
