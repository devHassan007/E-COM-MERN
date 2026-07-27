import React from 'react';
import AppRoutes from './Routes/AppRoutes';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ChatWidget from './Components/Chat/ChatWidget';


const App = () => {
  return (
    <>
      <AppRoutes />
      <ChatWidget />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </>
  )
}

export default App;