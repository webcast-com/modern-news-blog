import React, { useState, useMemo } from "react";
import { SAMPLE_ARTICLES } from "../data/articles.js";

export default function NewsBlog() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [visible, setVisible] = useState(6);
  const [selected, setSelected] = useState(null);
  const [sortNewest, setSortNewest] = useState(true);

  const categories = useMemo(() => ["All", ...new Set(SAMPLE_ARTICLES.map(a => a.category))], []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = SAMPLE_ARTICLES.filter(a => {
      if (category !== "All" && a.category !== category) return false;
      if (!q) return true;
      return (a.title + " " + a.excerpt + " " + a.author).toLowerCase().includes(q);
    });
    list = list.sort((a, b) => (sortNewest ? b.date.localeCompare(a.date) : a.date.localeCompare(b.date)));
    return list;
  }, [query, category, sortNewest]);

  function loadMore() {
    setVisible(v => Math.min(SAMPLE_ARTICLES.length, v + 6));
  }

  function generateRSS() {
    const items = filtered.slice(0, 25).map(a => `  <item>\n    <title>${escapeXml(a.title)}</title>\n    <link>/articles/${a.id}</link>\n    <pubDate>${new Date(a.date).toUTCString()}</pubDate>\n    <description>${escapeXml(a.excerpt)}</description>\n  </item>`).join("\n");
    const rss = `<?xml version="1.0" encoding="UTF-8" ?>\n<rss version="2.0">\n<channel>\n  <title>The Daily Pulse</title>\n  <link>/</link>\n  <description>Independent news — quick reads, deep context.</description>\n${items}\n</channel>\n</rss>`;
    const blob = new Blob([rss], { type: "application/rss+xml" });
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank");
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-gray-900">The Daily Pulse</h1>
            <p className="text-sm text-gray-500">Independent news — quick reads, deep context.</p>
          </div>
          <div className="flex items-center gap-3">
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 w-56 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="Search headlines, authors, excerpts..."
            />
            <button onClick={() => { setQuery(''); setCategory('All'); }} className="text-sm text-gray-600 hover:text-gray-900">Clear</button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg p-8 mb-6">
              <h2 className="text-3xl font-bold mb-2">Top stories</h2>
              <p className="max-w-xl opacity-90">Curated by editors. Updated hourly.</p>
            </div>

            <div className="flex items-center justify-between mb-4">
              <div className="flex space-x-2 items-center">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setCategory(cat)}
                    className={`px-3 py-1 rounded-full text-sm transition-colors ${
                      category === cat 
                        ? 'bg-indigo-600 text-white' 
                        : 'bg-white border border-gray-300 hover:bg-gray-50'
                    }`}>
                    {cat}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-3">
                <label className="text-sm text-gray-600">Sort</label>
                <select 
                  value={sortNewest ? 'new' : 'old'} 
                  onChange={e => setSortNewest(e.target.value === 'new')}
                  className="border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                  <option value="new">Newest</option>
                  <option value="old">Oldest</option>
                </select>
                <button onClick={generateRSS} className="text-sm text-indigo-600 hover:text-indigo-800 underline">Export RSS</button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {filtered.slice(0, visible).map(article => (
                <article key={article.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                  <div className="flex flex-col h-full">
                    <img src={article.image} alt="" className="h-40 w-full object-cover" />
                    <div className="p-4 flex flex-col flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold px-2 py-1 rounded-full bg-gray-100 text-gray-700">{article.category}</span>
                        <span className="text-xs text-gray-500">{article.date}</span>
                      </div>
                      <h3 className="text-lg font-semibold leading-tight mb-2 text-gray-900">{article.title}</h3>
                      <p className="text-sm text-gray-600 flex-1 line-clamp-3">{article.excerpt}</p>
                      <div className="mt-3 flex items-center justify-between">
                        <div className="text-xs text-gray-500">By {article.author}</div>
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => setSelected(article)} 
                            className="text-sm text-indigo-600 hover:text-indigo-800 underline">
                            Read
                          </button>
                          <a 
                            className="text-sm text-green-600 hover:text-green-800" 
                            href={`https://wa.me/?text=${encodeURIComponent(article.title + ' — read more at: ' + window.location.origin + '/articles/' + article.id)}`} 
                            target="_blank" 
                            rel="noreferrer">
                            Share
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            <div className="mt-8 flex justify-center">
              {visible < filtered.length ? (
                <button 
                  onClick={loadMore} 
                  className="px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors">
                  Load more articles
                </button>
              ) : (
                <div className="text-sm text-gray-500">No more stories to load.</div>
              )}
            </div>
          </div>

          <aside className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h4 className="font-semibold text-gray-900 mb-2">Newsletter</h4>
              <p className="text-sm text-gray-600 mb-4">Get top stories delivered to your inbox.</p>
              <div className="flex gap-2">
                <input 
                  placeholder="Email address" 
                  className="border border-gray-300 rounded-md px-3 py-2 flex-1 focus:outline-none focus:ring-2 focus:ring-indigo-500" 
                />
                <button className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors">
                  Subscribe
                </button>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h4 className="font-semibold text-gray-900 mb-4">Trending</h4>
              <ul className="space-y-3">
                {filtered.slice(0, 5).map(t => (
                  <li key={t.id} className="flex items-start gap-3">
                    <img src={t.image} className="w-16 h-12 object-cover rounded-sm flex-shrink-0" alt="" />
                    <div className="min-w-0">
                      <div className="font-medium text-sm text-gray-900 line-clamp-2">{t.title}</div>
                      <div className="text-xs text-gray-500 mt-1">{t.date}</div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h4 className="font-semibold text-gray-900 mb-2">About</h4>
              <p className="text-sm text-gray-600">
                The Daily Pulse delivers independent journalism with quick reads and deep context. 
                Stay informed with our curated selection of stories that matter.
              </p>
            </div>
          </aside>
        </section>
      </main>

      {selected && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setSelected(null)}>
          <div className="bg-white max-w-4xl w-full rounded-lg overflow-hidden max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b flex justify-between items-start">
              <div className="flex-1 pr-4">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{selected.title}</h2>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span>By {selected.author}</span>
                  <span>{selected.date}</span>
                  <span className="px-2 py-1 bg-gray-100 rounded-full text-xs">{selected.category}</span>
                </div>
              </div>
              <button 
                onClick={() => setSelected(null)} 
                className="text-gray-400 hover:text-gray-600 text-xl font-bold">
                ×
              </button>
            </div>
            <div className="flex-1 overflow-auto">
              <img src={selected.image} alt="" className="w-full h-64 object-cover" />
              <div className="p-6">
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">{selected.body}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <footer className="bg-white border-t mt-16">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-gray-600">
              © {new Date().getFullYear()} The Daily Pulse. All rights reserved.
            </div>
            <div className="flex gap-6">
              <a className="text-sm text-gray-600 hover:text-gray-900" href="#">Privacy Policy</a>
              <a className="text-sm text-gray-600 hover:text-gray-900" href="#">Terms of Service</a>
              <a className="text-sm text-gray-600 hover:text-gray-900" href="#">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function escapeXml(unsafe) {
  return unsafe.replace(/[<>&"']/g, function (c) {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '"': return '&quot;';
      case "'": return '&apos;';
    }
  });
}