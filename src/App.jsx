import React, { useState, useMemo } from "react";
/const SAMPLE_ARTICLES = Array.from({ length: 20 }).map((_, i) => ({
  id: i + 1,
  title: [
    "Global Markets Rally After Policy Shift",
    "New Tech Promises Faster Batteries",
    "Local Artists Turn Old Warehouses Into Galleries",
    "Health Officials Warn of Seasonal Surge",
    "Championship Match Ends in Dramatic Shootout",
    "Breaking: Major Merger Announced in Telecom",
    "Study Shows Urban Gardens Improve Air Quality",
    "Startup Raises Series B to Expand Across Africa",
    "How To Save For Retirement At Any Age",
    "Chef Reinvents Street Food With Fine-Dining Flair",
  ][i % 10],
  excerpt:
    "Short summary: this article covers the latest developments and why they matter to readers.",
  body:
    "Full article body — replace this text with real content. This demo contains a few paragraphs to show article layout and reading experience.\n\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam.",
  category: ["Business", "Tech", "Culture", "Health", "Sports"][i % 5],
  author: ["Jane Mwangi", "Olivier K.|", "Aisha Otieno", "Kwame Mensah"][i % 4],
  date: new Date(Date.now() - i * 86400000).toISOString().slice(0, 10),
  image: `https://source.unsplash.com/collection/190727/800x600?sig=${i}`,
}));
/ The same NewsBlogSingleFileDemo component code from previous file here
// Paste entire component body as-is.
// Optionally rename it to App.

export default function App() {
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
    // Simple client-side RSS string (useful for static exports or to send to a backend)
    const items = filtered.slice(0, 25).map(a => `  <item>\n    <title>${escapeXml(a.title)}</title>\n    <link>/articles/${a.id}</link>\n    <pubDate>${new Date(a.date).toUTCString()}</pubDate>\n    <description>${escapeXml(a.excerpt)}</description>\n  </item>`).join("\n");
    const rss = `<?xml version="1.0" encoding="UTF-8" ?>\n<rss version="2.0">\n<channel>\n  <title>Demo News Blog</title>\n  <link>/</link>\n  <description>A demo RSS feed</description>\n${items}\n</channel>\n</rss>`;
    const blob = new Blob([rss], { type: "application/rss+xml" });
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank");
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <header className="bg-white shadow">
        <div className="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight">The Daily Pulse</h1>
            <p className="text-sm text-gray-500">Independent news — quick reads, deep context.</p>
          </div>
          <div className="flex items-center gap-3">
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              className="border rounded-md px-3 py-2 w-56 focus:outline-none"
              placeholder="Search headlines, authors, excerpts..."
            />
            <button onClick={() => { setQuery(''); setCategory('All'); }} className="text-sm">Clear</button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg p-8 mb-6">
              <h2 className="text-3xl font-bold">Top stories</h2>
              <p className="mt-2 max-w-xl">Curated by editors. Updated hourly.</p>
            </div>

            <div className="flex items-center justify-between mb-4">
              <div className="flex space-x-2 items-center">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setCategory(cat)}
                    className={`px-3 py-1 rounded-full text-sm ${category === cat ? 'bg-indigo-600 text-white' : 'bg-white border'}`}>
                    {cat}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-3">
                <label className="text-sm">Sort</label>
                <select value={sortNewest ? 'new' : 'old'} onChange={e => setSortNewest(e.target.value === 'new')}
                  className="border rounded-md px-2 py-1 text-sm">
                  <option value="new">Newest</option>
                  <option value="old">Oldest</option>
                </select>
                <button onClick={generateRSS} className="text-sm underline">Export RSS</button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {filtered.slice(0, visible).map(article => (
                <article key={article.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                  <div className="flex flex-col h-full">
                    <img src={article.image} alt="" className="h-40 w-full object-cover" />
                    <div className="p-4 flex flex-col flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold px-2 py-1 rounded-full bg-gray-100">{article.category}</span>
                        <span className="text-xs text-gray-500">{article.date}</span>
                      </div>
                      <h3 className="text-lg font-semibold leading-tight mb-2">{article.title}</h3>
                      <p className="text-sm text-gray-600 flex-1">{article.excerpt}</p>
                      <div className="mt-3 flex items-center justify-between">
                        <div className="text-xs text-gray-500">By {article.author}</div>
                        <div className="flex items-center gap-2">
                          <button onClick={() => setSelected(article)} className="text-sm underline">Read</button>
                          <a className="text-sm" href={`https://wa.me/?text=${encodeURIComponent(article.title + ' — read more at: https://example.com/articles/' + article.id)}`} target="_blank" rel="noreferrer">WhatsApp</a>
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            <div className="mt-6 flex justify-center">
              {visible < filtered.length ? (
                <button onClick={loadMore} className="px-6 py-2 bg-indigo-600 text-white rounded-md">Load more</button>
              ) : (
                <div className="text-sm text-gray-500">No more stories.</div>
              )}
            </div>
          </div>

          <aside className="space-y-6">
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h4 className="font-semibold">Newsletter</h4>
              <p className="text-sm text-gray-500">Get top stories in your inbox.</p>
              <div className="mt-3 flex gap-2">
                <input placeholder="Email address" className="border rounded-md px-3 py-2 flex-1" />
                <button className="px-3 py-2 bg-indigo-600 text-white rounded-md">Subscribe</button>
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h4 className="font-semibold">Trending</h4>
              <ul className="mt-2 text-sm space-y-2">
                {filtered.slice(0, 5).map(t => (
                  <li key={t.id} className="flex items-start gap-3">
                    <img src={t.image} className="w-12 h-8 object-cover rounded-sm" />
                    <div>
                      <div className="font-medium">{t.title}</div>
                      <div className="text-xs text-gray-500">{t.date}</div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h4 className="font-semibold">About</h4>
              <p className="text-sm text-gray-500">A lightweight news demo. Replace sample data with your CMS or markdown files.</p>
            </div>
          </aside>
        </section>
      </main>

      {selected && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={() => setSelected(null)}>
          <div className="bg-white max-w-3xl w-full rounded-lg overflow-auto max-h-[85vh]" onClick={e => e.stopPropagation()}>
            <div className="p-4 border-b flex justify-between items-start">
              <div>
                <h2 className="text-xl font-bold">{selected.title}</h2>
                <div className="text-xs text-gray-500">{selected.author} • {selected.date}</div>
              </div>
              <button onClick={() => setSelected(null)} className="text-gray-600">Close</button>
            </div>
            <img src={selected.image} alt="" className="w-full h-64 object-cover" />
            <div className="p-6">
              <p className="whitespace-pre-line">{selected.body}</p>
            </div>
          </div>
        </div>
      )}

      <footer className="bg-white border-t mt-12">
        <div className="max-w-6xl mx-auto px-6 py-6 text-sm text-gray-500 flex justify-between items-center">
          <div>© {new Date().getFullYear()} The Daily Pulse — Demo</div>
          <div>
            <a className="underline mr-4" href="#">Privacy</a>
            <a className="underline" href="#">Terms</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

function escapeXml(unsafe) {
  return unsafe.replace(/[<>&\"']/g, function (c) {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '"': return '&quot;';
      case "'": return '&apos;';
    }
  });
}
  
