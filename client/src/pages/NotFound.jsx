import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import ReactGA from 'react-ga4';
import { Home, Search, ArrowLeft } from 'lucide-react';

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    // Track 404 errors as a custom event
    ReactGA.event('page_not_found', {
      page_path: location.pathname,
      referrer: document.referrer || 'direct'
    });
  }, [location]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center space-y-8">
        <div className="space-y-4">
          <h1 className="text-9xl font-black text-gray-200">404</h1>
          <h2 className="text-3xl md:text-4xl font-bold">Page Not Found</h2>
          <p className="text-gray-600 text-lg max-w-md mx-auto">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            to="/"
            className="flex items-center gap-2 px-6 py-3 bg-black text-white rounded-xl font-bold hover:bg-gray-800 transition-colors"
          >
            <Home size={20} />
            Go Home
          </Link>
          <Link
            to="/browse"
            className="flex items-center gap-2 px-6 py-3 border-2 border-black rounded-xl font-bold hover:bg-black hover:text-white transition-colors"
          >
            <Search size={20} />
            Browse Products
          </Link>
          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-2 px-6 py-3 border-2 border-gray-300 rounded-xl font-bold hover:border-gray-400 transition-colors"
          >
            <ArrowLeft size={20} />
            Go Back
          </button>
        </div>

        <div className="pt-8 border-t border-gray-200 mt-12">
          <p className="text-sm text-gray-500">
            Looking for something specific? Try our{' '}
            <Link to="/quiz" className="text-black font-bold underline hover:no-underline">
              Gift Quiz
            </Link>{' '}
            to find the perfect product!
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
