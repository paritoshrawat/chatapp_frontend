import React, { Suspense, lazy, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { LayoutLoader } from "./components/layout/Loaders";
import axios from "axios";
import { server } from "./constants/config";
import { useDispatch, useSelector } from "react-redux";
import { userExists, userNotExists } from "./redux/reducers/auth";
import { Toaster } from "react-hot-toast";
import { SocketProvider } from "./socket";

const Home = lazy(() => import("./pages/Home"));
const Login = lazy(() => import("./pages/Login"));
const Chat = lazy(() => import("./pages/Chat"));
const Groups = lazy(() => import("./pages/Groups"));
const NotFound = lazy(() => import("./pages/NotFound"));

const App = () => {
  const { user, loader } = useSelector((state) => state.auth);

  const dispatch = useDispatch();

  useEffect(() => {
    // Check if a default user is set (for development/testing)
    const defaultUser = { id: 1, username: "testuser" };

    if (!user) {
      // Dispatch userExists action with the default user
      dispatch(userExists(defaultUser));
    }
  }, [dispatch]);

  if (loader) {
    return <LayoutLoader />;
  }

  return (
    <BrowserRouter>
      <Suspense fallback={<LayoutLoader />}>
        <Routes>
          <Route
            element={
              <SocketProvider>
                {user ? (
                  <Navigate to="/" replace />
                ) : (
                  <Navigate to="/login" replace />
                )}
              </SocketProvider>
            }
          >
            <Route path="/" element={<Home />} />
            <Route path="/chat/:chatId" element={<Chat />} />
            <Route path="/groups" element={<Groups />} />
          </Route>

          <Route path="/login" element={<Login />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>

      <Toaster position="bottom-center" />
    </BrowserRouter>
  );
};

export default App;

