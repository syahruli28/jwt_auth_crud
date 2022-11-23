import React from 'react';
import ReactDOM from 'react-dom';
// import ReactDOM from "react-dom/client";
import App from './App';

//import bootstrap CSS
import 'bootstrap/dist/css/bootstrap.min.css'

//import custom CSS
import './index.css';

//BrowserRouter dari react router
import { BrowserRouter } from 'react-router-dom';

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);


// const root = ReactDOM.createRoot(document.getElementById("root"));
// root.render(
//   <React.StrictMode>
//     <BrowserRouter>
//       <App />
//     </BrowserRouter>
//   </React.StrictMode>
// );