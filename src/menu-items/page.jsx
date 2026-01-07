// assets
import { LoginOutlined, ProfileOutlined } from '@ant-design/icons';

// icons
const icons = {
  LoginOutlined,
  ProfileOutlined
};

// ==============================|| MENU ITEMS - EXTRA PAGES ||============================== //

const pages = {
  // id: 'authentication',
  // title: 'Authentication',
  // type: 'group',
  // children: [
  //   {
  //     id: 'login1',
  //     title: 'Login',
  //     type: 'item',
  //     url: '/login',
  //     icon: icons.LoginOutlined,
  //     target: true
  //   },
  //   {
  //     id: 'register1',
  //     title: 'Register',
  //     type: 'item',
  //     url: '/register',
  //     icon: icons.ProfileOutlined,
  //     target: true
  //   }
  // ]
  id: 'item-blogs',
  title: 'Blogs',
  type: 'item',
  url: '/blogs',
  icon: icons.LoginOutlined,
  target: false,
  breadcrumbs: false
};

export default pages;
