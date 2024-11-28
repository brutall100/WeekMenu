import { Routes, Route } from 'react-router-dom';
import './styles/App.css';
import Header from './components/header/Header';
import HomePage from './pages/HomePage';
import ErrorPage from './pages/ErrorPage';
// import StoriesPage from './pages/StoriesPage';
// import VideoPage from './pages/VideoPage';

function App() {
  return (
      <>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        {/* <Route path="/stories" element={<StoriesPage />} />  */}
        {/* <Route path="/video" element={<VideoPage />}/> */}
        <Route path="*" element={<ErrorPage />} />
      </Routes>
      </>

  );
}

export default App;
