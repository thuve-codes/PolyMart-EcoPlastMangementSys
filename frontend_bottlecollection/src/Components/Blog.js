import "./Blog.css";

const articles = [
  { title: "Why Recycling Matters", content: "Recycling helps reduce pollution..." },
  { title: "How to Recycle Properly", content: "Ensure plastics are clean before recycling." },
];

function Blog() {
  return (
    <div className="blog-section">
      <h3>Recycling Tips</h3>
      {articles.map((article, index) => (
        <div key={index} className="article">
          <h4>{article.title}</h4>
          <p>{article.content}</p>
        </div>
      ))}
    </div>
  );
}

export default Blog;
