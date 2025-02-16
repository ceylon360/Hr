import { Suspense } from "react";
import {
  useRoutes,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";
import { ClerkProvider, SignedIn, SignedOut } from "@clerk/clerk-react";
import Home from "./components/home";
import HolidayCalendar from "./components/holidays/HolidayCalendar";
import Settings from "./components/settings/Settings";
import Layout from "./components/layout/Layout";
import AdminSignIn from "./components/auth/AdminSignIn";
import AuthGuard from "./components/auth/AuthGuard";
import routes from "tempo-routes";

const CLERK_PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!CLERK_PUBLISHABLE_KEY) {
  throw new Error("Missing Clerk Publishable Key");
}

import ErrorBoundary from "./utils/errorBoundary";

// Custom error handler for non-React errors
const handleGlobalError = (error: Error) => {
  console.error("Global error:", error);
  // You can add additional error reporting here
};

// Add global error handlers
if (typeof window !== "undefined") {
  window.onerror = function (msg, url, lineNo, columnNo, error) {
    handleGlobalError(error || new Error(String(msg)));
    return false;
  };

  window.addEventListener("unhandledrejection", (event) => {
    handleGlobalError(event.reason);
  });
}

function App() {
  const navigate = useNavigate();

  return (
    <ErrorBoundary
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Something went wrong
            </h2>
            <p className="text-gray-600">Please try refreshing the page</p>
          </div>
        </div>
      }
    >
      <ClerkProvider
        publishableKey={CLERK_PUBLISHABLE_KEY}
        routing="path"
        afterSignInUrl="/settings"
        afterSignUpUrl="/settings"
      >
        <Suspense fallback={<div>Loading...</div>}>
          <Layout>
            {/* Tempo routes */}
            {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)}

            <Routes>
              <Route path="/" element={<Home />} />
              <Route
                path="/admin/sign-in"
                element={
                  <SignedOut>
                    <AdminSignIn />
                  </SignedOut>
                }
              />
              <Route
                path="/holidays"
                element={
                  <AuthGuard>
                    <HolidayCalendar />
                  </AuthGuard>
                }
              />
              <Route
                path="/settings"
                element={
                  <AuthGuard>
                    <Settings />
                  </AuthGuard>
                }
              />
              {/* Add a catch-all route that redirects to home */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Layout>
        </Suspense>
      </ClerkProvider>
    </ErrorBoundary>
  );
}

export default App;
