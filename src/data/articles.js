export const SAMPLE_ARTICLES = Array.from({ length: 20 }).map((_, i) => ({
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
    "Full article body — replace this text with real content. This demo contains a few paragraphs to show article layout and reading experience.\n\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi. Mauris hendrerit. Pellentesque aliquet nibh nec urna. In nisi neque, aliquet vel, dapibus id, mattis vel, nisi. Sed pretium, ligula sollicitudin laoreet viverra, tortor libero sodales leo, eget blandit nunc tortor eu nibh.",
  category: ["Business", "Tech", "Culture", "Health", "Sports"][i % 5],
  author: ["Jane Mwangi", "Olivier K.", "Aisha Otieno", "Kwame Mensah"][i % 4],
  date: new Date(Date.now() - i * 86400000).toISOString().slice(0, 10),
  image: `https://images.pexels.com/photos/${1000000 + i * 100000}/pexels-photo-${1000000 + i * 100000}.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop`,
}));