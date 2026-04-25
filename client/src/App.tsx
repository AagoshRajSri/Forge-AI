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

const App = () => {
  const { pathname } = useLocation();

  const hideNavbar =
    (pathname.startsWith("/projects/") && pathname !== "/projects") ||
    pathname.startsWith("/view/") ||
    pathname.startsWith("/preview/");

  return (
    <div style={{ background: 'var(--void)', minHeight: '100vh', position: 'relative' }}>
      {/* Persistent starfield — lives behind everything */}
      <div className="starfield" aria-hidden="true" />
      
      {/* Background Data Streams */}
      <div className="data-stream left">
        <div className="data-stream-inner">
          01001011 01101001 01101100 01101100 00100000 01110100 01101000 01100101 00100000 01000001 01110110 01100101 01101110 01100111 01100101 01110010 01110011 
          01010000 01100101 01100001 01100011 01100101 00100000 01101001 01101110 00100000 01101111 01110101 01110010 00100000 01110100 01101001 01101101 01100101 
          01001011 01101001 01101100 01101100 00100000 01110100 01101000 01100101 00100000 01000001 01110110 01100101 01101110 01100111 01100101 01110010 01110011
        </div>
      </div>
      <div className="data-stream right">
        <div className="data-stream-inner" style={{ animationDirection: 'reverse', animationDuration: '25s' }}>
          46 4F 52 47 45 20 4D 41 54 52 49 58 20 4F 4E 4C 49 4E 45 
          4E 4F 20 53 54 52 49 4E 47 53 20 4F 4E 20 4D 45 
          46 4F 52 47 45 20 4D 41 54 52 49 58 20 4F 4E 4C 49 4E 45 
          4E 4F 20 53 54 52 49 4E 47 53 20 4F 4E 20 4D 45
        </div>
      </div>

      <Toaster
        theme="dark"
        toastOptions={{
          style: {
            background: 'var(--nebula)',
            border: '1px solid var(--seam-glow)',
            color: 'var(--star-1)',
            fontSize: '13px',
            letterSpacing: '0.01em',
          }
        }}
      />
      {!hideNavbar && <Navbar />}

      <div style={{ position: 'relative', zIndex: 1 }}>
        <Routes>
          <Route path="/" element={<Home />} />
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
      </div>
    </div>
  );
};

export default App;
