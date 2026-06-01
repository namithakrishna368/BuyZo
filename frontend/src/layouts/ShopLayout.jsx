import AmazonHeader from '../components/amazon/AmazonHeader';
import AmazonFooter from '../components/amazon/AmazonFooter';

const ShopLayout = ({ children }) => (
  <div className="flex min-h-screen flex-col bg-amazon-bg">
    <AmazonHeader />
    <main className="flex-1">{children}</main>
    <AmazonFooter />
  </div>
);

export default ShopLayout;
