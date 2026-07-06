import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "@/pages/Home";
import DocsPage from "@/pages/DocsPage";
import DocsQuickStartPage from "@/pages/docs/DocsQuickStartPage";
import DocsApiPage from "@/pages/docs/DocsApiPage";
import DocsRoutingPage from "@/pages/docs/DocsRoutingPage";
import DocsPlatformsPage from "@/pages/docs/DocsPlatformsPage";
import DocsProblemsPage from "@/pages/docs/DocsProblemsPage";
import DocsIssueWorkflowPage from "@/pages/docs/DocsIssueWorkflowPage";
import IssuesPage from "@/pages/IssuesPage";
import IssueDetailPage from "@/pages/IssueDetailPage";
import IssueSubmitPage from "@/pages/IssueSubmitPage";
import AdminOverviewPage from "@/pages/AdminOverviewPage";
import AdminInstallationsPage from "@/pages/AdminInstallationsPage";
import AdminUsagePage from "@/pages/AdminUsagePage";
import AdminRegionsPage from "@/pages/AdminRegionsPage";
import AdminIssuesPage from "@/pages/AdminIssuesPage";
import AdminReleasesPage from "@/pages/AdminReleasesPage";
import LoginPage from "@/pages/LoginPage";
import MyIssuesPage from "@/pages/MyIssuesPage";
import DownloadPage from "@/pages/DownloadPage";
import NotFoundPage from "@/pages/NotFoundPage";
import RequireAdminRoute from "@/components/RequireAdminRoute";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/download" element={<DownloadPage />} />
        <Route path="/docs" element={<DocsPage />} />
        <Route path="/docs/quick-start" element={<DocsQuickStartPage />} />
        <Route path="/docs/api" element={<DocsApiPage />} />
        <Route path="/docs/routing" element={<DocsRoutingPage />} />
        <Route path="/docs/platforms" element={<DocsPlatformsPage />} />
        <Route path="/docs/problems" element={<DocsProblemsPage />} />
        <Route path="/docs/issues" element={<DocsIssueWorkflowPage />} />
        <Route path="/issues" element={<IssuesPage />} />
        <Route path="/issues/new" element={<IssueSubmitPage />} />
        <Route path="/issues/:id" element={<IssueDetailPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/me/issues" element={<MyIssuesPage />} />
        <Route element={<RequireAdminRoute />}>
          <Route path="/admin" element={<AdminOverviewPage />} />
          <Route path="/admin/installations" element={<AdminInstallationsPage />} />
          <Route path="/admin/usage" element={<AdminUsagePage />} />
          <Route path="/admin/regions" element={<AdminRegionsPage />} />
          <Route path="/admin/issues" element={<AdminIssuesPage />} />
          <Route path="/admin/releases" element={<AdminReleasesPage />} />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}
