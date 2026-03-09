import { getSystemInfo } from "zmp-sdk";
import {
  AnimationRoutes,
  App,
  Route,
  SnackbarProvider,
  ZMPRouter,
} from "zmp-ui";
import { AppProps } from "zmp-ui/app";
import { FloatingActions } from "@/components/floating-actions";
import { AppBottomNavigation } from "@/components/bottom-nav";
import { MainHeader } from "@/components/main-header";

import HomePage from "@/pages/index";
import MapPage from "@/pages/map";
import DiscoveryPage from "@/pages/discovery";
import FeaturedPage from "@/pages/featured";
import FeedPage from "@/pages/feed";
import UserProfilePage from "@/pages/user/profile";
import LoginPage from "@/pages/login";
import RegisterPage from "@/pages/register";
import QRScannerPage from "@/pages/qr-scanner";
import AdminLoginPage from "@/pages/admin-login";
import BookingPage from "@/pages/booking/index";
import VisualBookingPage from "@/pages/booking/visual";
import ServiceSelectionPage from "@/pages/booking/services";
import BookingSummaryPage from "@/pages/booking/summary";
import PaymentPage from "@/pages/payment/index";
import NotificationListPage from "@/pages/notifications/index";
import SearchAdvancedPage from "@/pages/search/index";
import TestDBPage from "@/pages/test-db";
import CommunityRoomPage from "@/pages/community-room";
// new court/inside page
import CourtPage from "@/pages/court/index";
import CommunityCourtPage from "@/pages/community-court/index";
import CreateMatchPage from "@/pages/create-match/index";
import CreateTournamentPage from "@/pages/create-tournament/index";

// Admin Pages
import AdminDashboard from "@/pages/admin/dashboard";
import BookingManager from "@/pages/admin/booking-manager";
import FacilityManager from "@/pages/admin/facility-manager";
import UserListPage from "@/pages/admin/user-list";
import UserDetailPage from "@/pages/admin/user-detail";
import PackageListPage from "@/pages/admin/packages/list";
import PackageEditPage from "@/pages/admin/packages/edit";
import RevenuePage from "@/pages/admin/revenue/index";
import SendNotificationPage from "@/pages/admin/notifications/send";
import AdminSettingsPage from "@/pages/admin/settings/index";

const Layout = () => {
  return (
    <App theme={getSystemInfo().zaloTheme as AppProps["theme"]}>
      <SnackbarProvider>
        <ZMPRouter>
          <FloatingActions />
          <MainHeader />
          <div className="flex-1 overflow-auto pb-16">
            <AnimationRoutes>
              <Route path="/" element={<FeedPage />}></Route>
              <Route path="/pages/map" element={<MapPage />}></Route>
              <Route path="/pages/discovery" element={<DiscoveryPage />}></Route>
              <Route path="/pages/featured" element={<FeaturedPage />}></Route>
              <Route path="/pages/user/profile" element={<UserProfilePage />}></Route>
              <Route path="/profile" element={<UserProfilePage />}></Route>
              <Route path="/login" element={<LoginPage />}></Route>
              <Route path="/register" element={<RegisterPage />}></Route>
              <Route path="/qr-scanner" element={<QRScannerPage />}></Route>
              <Route path="/admin-login" element={<AdminLoginPage />}></Route>
              <Route path="/booking" element={<BookingPage />}></Route>
              <Route path="/booking/visual" element={<VisualBookingPage />}></Route>
              <Route path="/booking/services" element={<ServiceSelectionPage />}></Route>
              <Route path="/booking-summary" element={<BookingSummaryPage />}></Route>
              <Route path="/payment" element={<PaymentPage />}></Route>
              <Route path="/notifications" element={<NotificationListPage />}></Route>
              <Route path="/search" element={<SearchAdvancedPage />}></Route>
              <Route path="/test-db" element={<TestDBPage />}></Route>
              <Route path="/pages/community/room/:id" element={<CommunityRoomPage />}></Route>
              {/* Court / match page */}
              <Route path="/pages/court/index" element={<CourtPage />}></Route>
              <Route path="/court" element={<CourtPage />}></Route>
              <Route path="/pages/community-court/index" element={<CommunityCourtPage />}></Route>
              <Route path="/pages/create-match/index" element={<CreateMatchPage />}></Route>
              <Route path="/pages/create-tournament/index" element={<CreateTournamentPage />}></Route>

              {/* Admin Routes */}
              <Route path="/pages/admin/dashboard" element={<AdminDashboard />}></Route>
              <Route path="/admin/dashboard" element={<AdminDashboard />}></Route>
              <Route path="/pages/admin/booking-manager" element={<BookingManager />}></Route>
              <Route path="/pages/admin/facility-manager" element={<FacilityManager />}></Route>
              <Route path="/pages/admin/user-list" element={<UserListPage />}></Route>
              <Route path="/pages/admin/user-detail" element={<UserDetailPage />}></Route>
              <Route path="/pages/admin/packages/list" element={<PackageListPage />}></Route>
              <Route path="/pages/admin/packages/edit" element={<PackageEditPage />}></Route>
              <Route path="/pages/admin/revenue/index" element={<RevenuePage />}></Route>
              <Route path="/pages/admin/notifications/send" element={<SendNotificationPage />}></Route>
              <Route path="/pages/admin/settings/index" element={<AdminSettingsPage />}></Route>

            </AnimationRoutes>
          </div>
          <AppBottomNavigation />
        </ZMPRouter>
      </SnackbarProvider>
    </App>
  );
};
export default Layout;
