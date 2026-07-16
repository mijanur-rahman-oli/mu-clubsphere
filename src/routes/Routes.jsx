import Home from '../pages/Home/Home';
import ErrorPage from '../pages/ErrorPage';
import Login from '../pages/Login/Login';
import SignUp from '../pages/SignUp/SignUp';
import PrivateRoute from './PrivateRoute';
import DashboardLayout from '../layouts/DashboardLayout';
import ManageUsers from '../pages/Dashboard/Admin/ManageUsers';
import Profile from '../pages/Dashboard/Common/Profile';
import Statistics from '../pages/Dashboard/Common/Statistics';
import MainLayout from '../layouts/MainLayout';
import MyInventory from '../pages/Dashboard/Seller/MyInventory';
import ManageOrders from '../pages/Dashboard/Seller/ManageOrders';
import MyOrders from '../pages/Dashboard/Customer/MyOrders';
import { createBrowserRouter } from 'react-router';
import SellerRequests from '../pages/Dashboard/Admin/SellerRequests';
import SellerRoute from './SellerRoute';
import AdminRoute from './AdminRoute';
import Club from '../pages/Club/Club';
import Event from '../pages/Event/Event';
import ViewPayments from '../pages/Dashboard/Admin/ViewPayments';
import ManageClubs from '../pages/Dashboard/Admin/ManageClubs';
import ManageEvents from '../pages/Dashboard/Seller/ManageEvents';
import EventRegistrations from '../pages/Dashboard/Seller/EventRegistrations';
import MyEvents from '../pages/Dashboard/Customer/MyEvents';
import Transactions from '../pages/Dashboard/Customer/Transactions';
import AddClub from '../pages/Dashboard/Seller/AddClub';;
import PaymentSuccess from '../pages/Payment/PayementSuccess';
import ClubDetails from '../pages/ClubDetails/ClubDetails';
import About from '../pages/About/About'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    errorElement: <ErrorPage />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/club', element: <Club /> },
      { path: '/event', element: <Event /> },
      { path: '/club/:id', element: <ClubDetails /> },
      { path: '/payment-success', element: <PaymentSuccess /> },
      { path: '/about', element: <About /> },
    ],
  },
  { path: '/login', element: <Login /> },
  { path: '/signup', element: <SignUp /> },
  {
    path: '/dashboard',
    element: (
      <PrivateRoute>
        <DashboardLayout />
      </PrivateRoute>
    ),
    children: [
      {
        index: true,
        element: (
          <PrivateRoute>
            <Statistics />
          </PrivateRoute>
        ),
      },
      {
        path: 'add-club',
        element: (
          <PrivateRoute>
            <SellerRoute>
              <AddClub />
            </SellerRoute>
          </PrivateRoute>
        ),
      },
      {
        path: 'my-inventory',
        element: (
          <PrivateRoute>
            <SellerRoute>
              <MyInventory />
            </SellerRoute>
          </PrivateRoute>
        ),
      },
      {
        path: 'manage-members',
        element: (
          <PrivateRoute>
            <AdminRoute>
              <ManageUsers />
            </AdminRoute>
          </PrivateRoute>
        ),
      },
      {
        path: 'manager-requests',
        element: (
          <PrivateRoute>
            <AdminRoute>
              <SellerRequests />
            </AdminRoute>
          </PrivateRoute>
        ),
      },
      {
        path: 'view-payments',
        element: (
          <PrivateRoute>
            <AdminRoute>
              <ViewPayments />
            </AdminRoute>
          </PrivateRoute>
        ),
      },
      {
        path: 'manage-clubs',
        element: (
          <PrivateRoute>
            <AdminRoute>
              <ManageClubs />
            </AdminRoute>
          </PrivateRoute>
        ),
      },
      {
        path: 'profile',
        element: (
          <PrivateRoute>
            <Profile />
          </PrivateRoute>
        ),
      },
      {
        path: 'my-orders',
        element: (
          <PrivateRoute>
            <MyOrders />
          </PrivateRoute>
        ),
      },
      {
        path: 'manage-orders',
        element: (
          <PrivateRoute>
            <SellerRoute>
              <ManageOrders />
            </SellerRoute>
          </PrivateRoute>
        ),
      },
      {
        path: 'manage-events',
        element: (
          <PrivateRoute>
            <SellerRoute>
              <ManageEvents />
            </SellerRoute>
          </PrivateRoute>
        ),
      },
      {
        path: 'event-registrations',
        element: (
          <PrivateRoute>
            <SellerRoute>
              <EventRegistrations />
            </SellerRoute>
          </PrivateRoute>
        ),
      },
      {
        path: 'my-events',
        element: (
          <PrivateRoute>
            <MyEvents />
          </PrivateRoute>
        ),
      },
      {
        path: 'transaction',
        element: (
          <PrivateRoute>
            <Transactions />
          </PrivateRoute>
        ),
      },
    ],
  },
]);