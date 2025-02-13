import { Suspense } from "react";
import { useRoutes, Routes, Route, Navigate } from "react-router-dom";
import { ClerkProvider } from "@clerk/clerk-react";
import Home from "./components/home";
import HolidayCalendar from "./components/holidays/HolidayCalendar";
import Settings from "./components/settings/Settings";
import Layout from "./components/layout/Layout";
import AdminProtectedRoute from "./components/auth/AdminProtectedRoute";
import AdminSignIn from "./components/auth/AdminSignIn";
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
        navigate={(to) => (window.location.href = to)}
      >
        <Suspense fallback={<div>Loading...</div>}>
          <Layout>
            {/* Tempo routes */}
            {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)}

            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/admin/sign-in" element={<AdminSignIn />} />
              <Route
                path="/holidays"
                element={
                  <AdminProtectedRoute>
                    <HolidayCalendar
                      employees={[
                        {
                          id: "1",
                          name: "Haridu",
                          username: "haridu",
                          password: "password123",
                          leavePackage: {
                            personalLeavesPerMonth: 4,
                            holidaysPerMonth: 14,
                            sickLeavesPerYear: 7,
                          },
                        },
                        {
                          id: "2",
                          name: "Sudhara",
                          username: "sudhara",
                          password: "password123",
                          leavePackage: {
                            personalLeavesPerMonth: 4,
                            holidaysPerMonth: 14,
                            sickLeavesPerYear: 7,
                          },
                        },
                        {
                          id: "3",
                          name: "Chamara",
                          username: "chamara",
                          password: "password123",
                          leavePackage: {
                            personalLeavesPerMonth: 4,
                            holidaysPerMonth: 14,
                            sickLeavesPerYear: 7,
                          },
                        },
                        {
                          id: "4",
                          name: "Shehani",
                          username: "shehani",
                          password: "password123",
                          leavePackage: {
                            personalLeavesPerMonth: 4,
                            holidaysPerMonth: 14,
                            sickLeavesPerYear: 7,
                          },
                        },
                        {
                          id: "5",
                          name: "Sandipani",
                          username: "sandipani",
                          password: "password123",
                          leavePackage: {
                            personalLeavesPerMonth: 4,
                            holidaysPerMonth: 14,
                            sickLeavesPerYear: 7,
                          },
                        },
                      ]}
                    />
                  </AdminProtectedRoute>
                }
              />
              <Route
                path="/settings"
                element={
                  <AdminProtectedRoute>
                    <Settings />
                  </AdminProtectedRoute>
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
