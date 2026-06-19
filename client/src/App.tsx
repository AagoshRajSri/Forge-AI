import { Route, Routes, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Pricing from "./pages/Pricing";
import Preview from "./pages/Preview";
import Projects from "./pages/Projects";
import MyProjects from "./pages/MyProjects";
import Community from "./pages/Community";
import View from "./pages/View";
import Navbar from "./components/Navbar";
import { Toaster } from "sonner";
import Settings from "./pages/Settings";
import AuthPage from "./pages/auth/AuthPage";
import Loading from "./pages/Loading";
import Deployments from "./pages/Deployments";
import Models from "./pages/Models";
import Workflows from "./pages/Workflows";
import Monitoring from "./pages/Monitoring";
import PageTransition from "./components/PageTransition";

const App = () => {
  const { pathname } = useLocation();

  const hideNavbar =
    (pathname.startsWith("/projects/") && pathname !== "/projects") ||
    pathname.startsWith("/view/") ||
    pathname.startsWith("/preview/");

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased relative">
      <Toaster
        theme="light"
        toastOptions={{
          style: {
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            color: '#0f172a',
            fontSize: '14px',
          }
        }}
      />
      {!hideNavbar && <Navbar />}

      <div className="relative z-10">
        <PageTransition>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/models" element={<Models />} />
            <Route path="/workflows" element={<Workflows />} />
            <Route path="/deployments" element={<Deployments />} />
            <Route path="/monitoring" element={<Monitoring />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/projects" element={<MyProjects />} />
            <Route path="/projects/:projectId" element={<Projects />} />
            <Route path="/preview/:projectId" element={<Preview />} />
            <Route path="/preview/:projectId/:versionId" element={<Preview />} />
            <Route path="/community" element={<Community />} />
            <Route path="/view/:projectId" element={<View />} />
            <Route path="/auth/*" element={<AuthPage />} />
            <Route path="/account/settings" element={<Settings />} />
            <Route path="/loading" element={<Loading />} />
          </Routes>
        </PageTransition>
      </div>
    </div>
  );
};

export default App;
