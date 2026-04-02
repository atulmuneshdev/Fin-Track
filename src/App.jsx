import React from 'react';
import useStore from './store/useStore';
import Layout from './components/Layout';
import Overview from './components/Overview';
import Transactions from './components/Transactions';
import Auth from './components/Auth';
import Profile from './components/Profile';

const Dashboard = () => {
  const [activeTab, setActiveTab] = React.useState('overview');

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <Overview />;
      case 'transactions':
        return <Transactions />;
      case 'profile':
        return <Profile />;
      default:
        return <Overview />;
    }
  };

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
      {renderContent()}
    </Layout>
  );
};

function App() {
  const { isAuthenticated, login } = useStore();

  if (!isAuthenticated) {
    return <Auth onLogin={login} />;
  }

  return <Dashboard />;
}

export default App;
