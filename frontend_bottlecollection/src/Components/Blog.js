import "./Blog.css";

const articles = [
  { title: "Why Recycling Matters", content: "Recycling plays a crucial role in protecting our environment by reducing pollution, conserving natural resources, and decreasing the amount of waste sent to landfills." },
  { title: "How to Recycle Properly", content: "Proper recycling requires cleaning plastics to remove food residue, sorting materials by type, and following local guidelines to ensure efficient processing and reduce contamination." },
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
