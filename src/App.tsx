import { Suspense } from "react";
import { useRoutes, Routes, Route } from "react-router-dom";
import Home from "./components/home";
import HolidayCalendar from "./components/holidays/HolidayCalendar";
import Settings from "./components/settings/Settings";
import Layout from "./components/layout/Layout";
import routes from "tempo-routes";

function App() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/holidays"
            element={
              <HolidayCalendar
                employees={[
                  { id: "1", name: "Haridu" },
                  { id: "2", name: "Sudhara" },
                  { id: "3", name: "Chamara" },
                  { id: "4", name: "Shehani" },
                  { id: "5", name: "Sandipani" },
                ]}
              />
            }
          />
          <Route path="/settings" element={<Settings />} />
        </Routes>
        {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)}
      </Layout>
    </Suspense>
  );
}

export default App;
