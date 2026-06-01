import { Link } from 'react-router-dom';

const footerLinks = [
  {
    title: 'Get to Know Us',
    links: ['About BuyZO', 'Careers', 'BuyZO in India', 'Sustainability'],
  },
  {
    title: 'Sell on BuyZO',
    links: ['Sell on BuyZO', 'Fulfilment by BuyZO', 'Become an Affiliate'],
  },
  {
    title: 'Payment & Rewards',
    links: ['UPI & Cards', 'Cash on Delivery', 'BuyZO Pay Later (soon)', 'Gift Cards'],
  },
  {
    title: 'Help',
    links: ['Your Account', 'Track Orders', 'Returns & Refunds', 'Help Centre'],
  },
];

const AmazonFooter = () => (
  <footer className="mt-auto">
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className="w-full bg-amazon-nav-secondary py-4 text-sm text-white hover:bg-amazon-nav"
    >
      Back to top
    </button>
    <div className="bg-amazon-nav py-10 text-white">
      <div className="mx-auto grid max-w-[1500px] gap-8 px-6 sm:grid-cols-2 lg:grid-cols-4">
        {footerLinks.map((col) => (
          <div key={col.title}>
            <h3 className="mb-3 font-bold">{col.title}</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              {col.links.map((link) => (
                <li key={link}>
                  <Link to="/products" className="hover:underline">
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
    <div className="bg-amazon-dark py-8 text-center text-sm text-gray-400">
      <Link to="/" className="font-display text-lg font-bold text-white">
        Buy<span className="text-amazon-gold">ZO</span>
      </Link>
      <p className="mt-2 text-xs">Prices shown in Indian Rupees (₹) · GST inclusive where noted</p>
      <p className="mt-4">&copy; {new Date().getFullYear()} BuyZO India. All rights reserved.</p>
    </div>
  </footer>
);

export default AmazonFooter;
