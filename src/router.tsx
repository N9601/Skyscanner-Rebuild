import { createBrowserRouter } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { HomePage } from "@/pages/HomePage";
import { ExplorePage } from "@/pages/ExplorePage";
import { ProfilePage } from "@/pages/ProfilePage";
import { BookPage } from "@/pages/BookPage";
import { FlightsPage } from "@/pages/FlightsPage";
import { StaysPage } from "@/pages/StaysPage";
import { CarsPage } from "@/pages/CarsPage";
import { TripsPage } from "@/pages/TripsPage";
import { AlertsPage } from "@/pages/AlertsPage";
import { AssistantPage } from "@/pages/AssistantPage";
import { NotFoundPage } from "@/pages/NotFoundPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <NotFoundPage />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "explore", element: <ExplorePage /> },
      { path: "profile", element: <ProfilePage /> },
      { path: "book", element: <BookPage /> },
      { path: "flights", element: <FlightsPage /> },
      { path: "stays", element: <StaysPage /> },
      { path: "cars", element: <CarsPage /> },
      { path: "trips", element: <TripsPage /> },
      { path: "alerts", element: <AlertsPage /> },
      { path: "assistant", element: <AssistantPage /> },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
]);
