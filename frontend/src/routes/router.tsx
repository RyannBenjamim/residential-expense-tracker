import { createBrowserRouter } from "react-router-dom";
import Transactions from "../pages/Transactions/Transactions";
import Dashboard from "../pages/Dashboard/Dashboard";
import Peoples from "../pages/Peoples/Peoples";
import UserTransactions from "../pages/UserTransactions/UserTransactions";
import Layout from "../pages/Layout/Layout";

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />, 
    children: [
      {
        path: '/',
        element: <Dashboard />, 
      },
      {
        path: '/pessoas',
        element: <Peoples />,
      },
      {
        path: '/transacoes',
        element: <Transactions />,
      },
      {
        path: '/extrato-integrante/:personId', 
        element: <UserTransactions />,
      },
      {
        path: '*',
        element: <div style={{ padding: '20px' }}><h2>404 - Página não encontrada</h2></div>,
      },
    ],
  },
]);

export default router;