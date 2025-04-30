import "./Blog.css";

const articles = [
  {
    title: "Why Recycling Matters",
    content: "Recycling is one of the most effective ways to combat environmental degradation. By recycling, we reduce pollution, conserve precious natural resources, and divert waste from overflowing landfills. Each bottle you recycle makes a direct impact on reducing plastic waste in our oceans and ecosystems, contributing to a cleaner, healthier planet."
  },
  {
    title: "How to Recycle Properly",
    content: "Recycling properly ensures that materials are processed efficiently and don’t end up in the wrong places. Start by thoroughly cleaning plastic items to remove any food residue or contaminants. Sort plastics by type to avoid contamination. Always check your local recycling guidelines to make sure you’re following the best practices for your community. By recycling correctly, you help maximize the impact of your efforts and ensure that materials are properly reused and repurposed."
  },
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
