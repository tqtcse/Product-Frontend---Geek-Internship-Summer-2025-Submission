
import { BrowserRouter } from 'react-router-dom';
import '@refinedev/antd/dist/reset.css';
import './index.css';
import Views from './views/Views';
import Layout from './components/Layout';

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Views />
      </Layout>

    </BrowserRouter>
  );
}

export default App;
