import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HomePage from "./containers/HomePage/HomePage";
import QueryTest from "./containers/QueryTest/QueryTest";
import Entity from "./containers/Entity/Entity";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <HomePage />,
    },
    {
      path: "/:tab",
      element: <HomePage />,
    },
    {
      path: "/query-test",
      element: <QueryTest />,
    },
    {
      path: "/ontologies/:name",
      element: <Entity />,
    },
  ]);
  return (
    <div className="app">
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
      />
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
