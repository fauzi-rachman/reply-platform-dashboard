'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { auth } from '@/lib/auth';
import type { User, Website } from '@/lib/api';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [websites, setWebsites] = useState<Website[]>([]);
  const [loading, setLoading] = useState(true);
  const [domain, setDomain] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = auth.getToken();
    
    if (!token) {
      router.push('/login');
      return;
    }

    const loadData = async () => {
      try {
        const [userData, websitesData] = await Promise.all([
          api.getMe(token),
          api.getWebsites(token),
        ]);
        
        setUser(userData);
        setWebsites(websitesData);
      } catch (err) {
        console.error('Failed to load data:', err);
        auth.removeToken();
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [router]);

  const handleAddWebsite = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    const token = auth.getToken();
    if (!token) return;

    setSubmitting(true);
    try {
      const website = await api.addWebsite(token, domain);
      setWebsites([website, ...websites]);
      setDomain('');
    } catch (err: any) {
      setError(err.message || 'Failed to add website');
    } finally {
      setSubmitting(false);
    }
  };

  const handleLogout = () => {
    auth.removeToken();
    router.push('/login');
  };

  const getSnippet = (websiteId: string) => {
    return `<!-- Reply.sh Chatbot -->
<script>
  (function() {
    window.replyConfig = { websiteId: '${websiteId}' };
    var script = document.createElement('script');
    script.src = 'https://cdn.reply.sh/widget.js';
    script.async = true;
    document.body.appendChild(script);
  })();
</script>`;
  };

  const copySnippet = (websiteId: string) => {
    navigator.clipboard.writeText(getSnippet(websiteId));
    alert('Snippet copied to clipboard!');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <img 
                src="/reply-sh-logo-wide.png" 
                alt="Reply.sh Logo" 
                className="h-8"
              />
              {user && (
                <div className="flex items-center gap-2">
                  {user.picture && (
                    <img
                      src={user.picture}
                      alt={user.name || user.email}
                      className="w-8 h-8 rounded-full"
                    />
                  )}
                  <span className="text-sm text-gray-600">{user.email}</span>
                </div>
              )}
            </div>
            <button
              onClick={handleLogout}
              className="btn btn-secondary"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Add Website Form */}
        <div className="card mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Add a New Website</h2>
          <form onSubmit={handleAddWebsite} className="space-y-4">
            <div>
              <label htmlFor="domain" className="block text-sm font-medium text-gray-700 mb-2">
                Domain Name
              </label>
              <input
                type="text"
                id="domain"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                placeholder="example.com"
                className="input"
                required
              />
              <p className="mt-1 text-sm text-gray-500">
                Enter your website domain without http:// or https://
              </p>
            </div>
            
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}
            
            <button
              type="submit"
              disabled={submitting}
              className="btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'Adding...' : 'Add Website'}
            </button>
          </form>
        </div>

        {/* Websites List */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-gray-900">Your Websites</h2>
          
          {websites.length === 0 ? (
            <div className="card text-center py-12">
              <p className="text-gray-500 mb-2">No websites added yet</p>
              <p className="text-sm text-gray-400">Add your first website above to get started</p>
            </div>
          ) : (
            websites.map((website) => (
              <div key={website.id} className="card">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{website.domain}</h3>
                    <p className="text-sm text-gray-500">
                      Added {new Date(website.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="text-sm font-medium text-gray-700">Installation Code</h4>
                    <button
                      onClick={() => copySnippet(website.id)}
                      className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                    >
                      Copy to Clipboard
                    </button>
                  </div>
                  <pre className="text-xs bg-white border border-gray-200 rounded p-3 overflow-x-auto">
                    <code>{getSnippet(website.id)}</code>
                  </pre>
                  <p className="mt-2 text-xs text-gray-500">
                    Paste this code before the closing &lt;/body&gt; tag on your website
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}