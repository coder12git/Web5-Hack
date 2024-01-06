import "./index.css";

// @ts-ignore
const Rating = ({ rating }) => {
  return (
    <div className="ratings-container">
      {rating >= 1 && rating < 2 && (
        <div>
          <i className="fa-solid fa-star"></i>
        </div>
      )}
      {rating >= 2 && rating < 3 && (
        <div>
          <i className="fa-solid fa-star"></i>
          <i className="fa-solid fa-star"></i>
        </div>
      )}
      {rating >= 3 && rating < 4 && (
        <div>
          <i className="fa-solid fa-star"></i>
          <i className="fa-solid fa-star"></i>
          <i className="fa-solid fa-star"></i>
        </div>
      )}
      {rating >= 4 && rating < 5 && (
        <div>
          <i className="fa-solid fa-star"></i>
          <i className="fa-solid fa-star"></i>
          <i className="fa-solid fa-star"></i>
          <i className="fa-solid fa-star"></i>
        </div>
      )}
      {rating >= 5 && (
        <div>
          <i className="fa-solid fa-star"></i>
          <i className="fa-solid fa-star"></i>

          <i className="fa-solid fa-star"></i>
          <i className="fa-solid fa-star"></i>
        </div>
      )}
    </div>
  );
};

// @ts-ignore
const createRatingsIcons = (ratings) => {
  const icons = [];
  for (let n = 0; n < ratings; n++) {
    icons.push(<i className="fa fa-leaf"></i>);
  }

  return icons;
};

const index = ({
  // @ts-ignore
  name,
  // @ts-ignore
  description,
  // @ts-ignore
  created_by,
  url,
  // @ts-ignore
  rating,
  // @ts-ignore
  isClicked,
}) => {
  return (
    <div className="remedy-card">
      <div
        style={{
          background: `linear-gradient(rgba(0,0,0,0.7),rgba(0,0,0,0.5)),url(${url})`,
          backgroundPosition: "center",
          backgroundSize: "cover",
        }}
        className="remedy-card-image-container"
      >
        <h1>{name}</h1>
        <p>--by {created_by}</p>
        <div className="ratings-container">
          <h3>
            {rating}{" "}
            {createRatingsIcons(rating).map((icon) => {
              return icon;
            })}
          </h3>
        </div>
      </div>
      <div className="remedy-info-container">
        <p>{desc_snippet.slice(0, 150) + "..."}</p>
        <button onClick={() => isClicked[1](isClicked[0])}>View Remedy</button>
      </div>
    </div>
  );
};

export default index;
