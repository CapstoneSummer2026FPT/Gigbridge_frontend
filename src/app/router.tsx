import { createBrowserRouter, Outlet } from 'react-router';
import { AppProvider } from './providers/AppProvider';

// Lazy imports for all screens
import LandingScreen from '../features/landing/screens/LandingScreenNew';
import AuthScreen from '../features/auth/screens/AuthScreen';
import RoleSelectionScreen from '../features/onboarding/screens/RoleSelectionScreen';
import ProfileSetupScreen from '../features/onboarding/screens/ProfileSetupScreen';
import ClientDashboardScreen from '../features/dashboard/screens/ClientDashboardScreen';
import FreelancerDashboardScreen from '../features/dashboard/screens/FreelancerDashboardScreen';
import PostJobScreen from '../features/jobs/screens/PostJobScreen';
import PostJobInterviewQuestionsScreen from '../features/jobs/screens/PostJobInterviewQuestionsScreen';
import BrowseJobsScreen from '../features/jobs/screens/BrowseJobsScreen';
import JobDetailScreen from '../features/jobs/screens/JobDetailScreen';
import FreelancerProfileScreen from '../features/profile/screens/FreelancerProfileScreen';
import ClientProfileScreen from '../features/profile/screens/ClientProfileScreen';
import ProposalsInboxScreen from '../features/proposals/screens/ProposalsInboxScreen';
import ProjectsListScreen from '../features/workspace/screens/ProjectsListScreen';
import ProjectWorkspaceScreen from '../features/workspace/screens/ProjectWorkspaceScreen';
import AIAssistantScreen from '../features/ai-assistant/screens/AIAssistantScreen';
import AIInterviewScreen from '../features/ai-interview/screens/AIInterviewScreen';
import SettingsScreen from '../features/settings/screens/SettingsScreen';
import AdminDashboardScreen from '../features/admin/screens/AdminDashboardScreen';
import AdminUsersScreen from '../features/admin/screens/AdminUsersScreen';
import AdminJobsScreen from '../features/admin/screens/AdminJobsScreen';
import AdminContractsScreen from '../features/admin/screens/AdminContractsScreen';
import AdminSystemTrackingScreen from '../features/admin/screens/AdminSystemTrackingScreen';
import AdminRevenueScreen from '../features/admin/screens/AdminRevenueScreen';
import AdminReportsScreen from '../features/admin/screens/AdminReportsScreen';
import AdminFeedbackScreen from '../features/admin/screens/AdminFeedbackScreen';
import AdminNotificationsScreen from '../features/admin/screens/AdminNotificationsScreen';
import MarketInsightsScreen from '../features/market-insights/screens/MarketInsightsScreen';
import NotificationsScreen from '../features/notifications/screens/NotificationsScreen';
import AboutScreen from '../features/company/screens/AboutScreen';
import CareersScreen from '../features/company/screens/CareersScreen';
import FAQScreen from '../features/company/screens/FAQScreen';
import PressKitScreen from '../features/company/screens/PressKitScreen';
import GuideScreen from '../features/company/screens/GuideScreen';
import WalletDepositScreen from '../features/wallet/screens/WalletDepositScreen';
import SubscriptionScreen from '../features/wallet/screens/SubscriptionScreen';
import FinancialOverviewScreen from '../features/wallet/screens/FinancialOverviewScreen';
import WalletHistoryScreen from '../features/wallet/screens/WalletHistoryScreen';
import BuyGigcoinScreen from '../features/wallet/screens/BuyGigcoinScreen';

// Import router styles
import './styles/router.css';

function NotFound() {
  return (
    <div className="not-found-container">
      <div className="not-found-content">
        <p className="not-found-title">404</p>
        <p className="not-found-heading">Page Not Found</p>
        <p className="not-found-text">The page you're looking for doesn't exist.</p>
        <a href="/" className="not-found-button">Go Home</a>
      </div>
    </div>
  );
}

/**
 * RootLayout - Critical component that wraps all routes with AppProvider
 * 
 * This ensures AppContext is available to all child routes through React Router's Outlet.
 * Structure: RootLayout > AppProvider > Outlet > [All Screen Components]
 * 
 * ⚠️ DO NOT move AppProvider outside of router tree or context will not propagate correctly!
 */
function RootLayout() {
  return (
    <AppProvider>
      <Outlet />
    </AppProvider>
  );
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      // Public routes
      { index: true, element: <LandingScreen /> },
      { path: 'auth', element: <AuthScreen /> },

      // Onboarding routes
      { path: 'onboarding/role-selection', element: <RoleSelectionScreen /> },
      { path: 'onboarding/profile-setup', element: <ProfileSetupScreen /> },

      // Client routes
      { path: 'client/dashboard', element: <ClientDashboardScreen /> },

      // Freelancer routes
      { path: 'freelancer/dashboard', element: <FreelancerDashboardScreen /> },

      // Jobs
      { path: 'jobs/post', element: <PostJobScreen /> },
      { path: 'jobs/post/interview-questions', element: <PostJobInterviewQuestionsScreen /> },
      { path: 'jobs/browse', element: <BrowseJobsScreen /> },
      { path: 'jobs/my-jobs', element: <BrowseJobsScreen /> },
      { path: 'jobs/:id', element: <JobDetailScreen /> },

      // Profiles
      { path: 'profile/freelancer/:id', element: <FreelancerProfileScreen /> },
      { path: 'profile/client/:id', element: <ClientProfileScreen /> },

      // Proposals
      { path: 'proposals', element: <ProposalsInboxScreen /> },

      // Workspace
      { path: 'projects', element: <ProjectsListScreen /> },
      { path: 'workspace/:id', element: <ProjectWorkspaceScreen /> },

      // AI Features
      { path: 'ai-assistant', element: <AIAssistantScreen /> },
      { path: 'ai-interview', element: <AIInterviewScreen /> },

      // Settings
      { path: 'settings', element: <SettingsScreen /> },

      // Wallet & Subscription
      { path: 'wallet/deposit', element: <WalletDepositScreen /> },
      { path: 'wallet/history', element: <WalletHistoryScreen /> },
      { path: 'buy-gigcoin', element: <BuyGigcoinScreen /> },
      { path: 'subscription', element: <SubscriptionScreen /> },
      { path: 'financial-overview', element: <FinancialOverviewScreen /> },

      // Admin
      { path: 'admin', element: <AdminDashboardScreen /> },
      { path: 'admin/users', element: <AdminUsersScreen /> },
      { path: 'admin/jobs', element: <AdminJobsScreen /> },
      { path: 'admin/contracts', element: <AdminContractsScreen /> },
      { path: 'admin/reports', element: <AdminReportsScreen /> },
      { path: 'admin/feedback', element: <AdminFeedbackScreen /> },
      { path: 'admin/system-tracking', element: <AdminSystemTrackingScreen /> },
      { path: 'admin/revenue', element: <AdminRevenueScreen /> },
      { path: 'admin/notifications', element: <AdminNotificationsScreen /> },

      // Market Insights
      { path: 'market-insights', element: <MarketInsightsScreen /> },

      // Notifications
      { path: 'notifications', element: <NotificationsScreen /> },

      // Company Pages
      { path: 'about', element: <AboutScreen /> },
      { path: 'careers', element: <CareersScreen /> },
      { path: 'faq', element: <FAQScreen /> },
      { path: 'press-kit', element: <PressKitScreen /> },
      { path: 'guide', element: <GuideScreen /> },

      // 404
      { path: '*', element: <NotFound /> },
    ],
  },
]);
