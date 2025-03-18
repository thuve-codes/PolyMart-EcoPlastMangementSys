export default function ProductCard() {
    return (
        <div className="col-sm-12 col-md-6 col-lg-3 my-3">
        <div className="card p-3 rounded">
          <img
            className="card-img-top mx-auto"
            src="/images/products/1.jpg"
          />
          <div className="card-body d-flex flex-column">
            <h5 className="card-title">
              <a href="">OPPO F21s Pro 5G (Dawnlight Gold, 8GB RAM, 128 Storage) with No Cost EMI/Additional Exchange Offers</a>
            </h5>
            <div className="ratings mt-auto">
              <div className="rating-outer">
                <div className="rating-inner"></div>
              </div>
            </div>
            <p className="card-text">$245.67</p>
            <a href="#" id="view_btn" className="btn btn-block">View Details</a>
          </div>
        </div>
      </div>
    )
}