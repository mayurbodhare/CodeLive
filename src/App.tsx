import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import HomePage from "./pages/HomePage";
import EditorPage from "./pages/EditorPage";
import { Toaster } from "react-hot-toast";


function App() {
	return (
		<>
      <div>
        <Toaster 
          position="top-right"
          toastOptions={
            {
              success: {
                iconTheme: {
                  primary: '#4aee88',
                  secondary: '#282a36'
                }
              }
            }
          }
        >

        </Toaster>
      </div>
			<BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/editor/:roomId" element={<EditorPage />} />
        </Routes>
      </BrowserRouter>
		</>
	);
}

export default App;
