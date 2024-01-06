import "./index.css";

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
  created_by, useUrl,
  // @ts-ignore
  rating,
  // @ts-ignore
  isClicked,
}) => {
  return (
    <div className="remedy-card">
      <div
        style={{
          background: `linear-gradient(rgba(0,0,0,0.7),rgba(0,0,0,0.5)),url(${useUrl})`,
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
        <p>{description.substring(0,50) + "..."}</p>
        <button onClick={() => isClicked[1](isClicked[0])}>View Remedy</button>
      </div>
    </div>
  );
};

export default index;
