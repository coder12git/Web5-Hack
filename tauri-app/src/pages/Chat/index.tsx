import "./index.css";
import UserProfile from "../../components/UserProfile/";

const index = () => {
  return (
    <div className="main-chat-container">
      <UserProfile
        username={"gravyboat247"}
        about_user={
          "Lorem ipsum dolor sit amet, qui minim labore adipisicing minim sint cillum sint consectetur cupidatat."
        }
        profile_pic={"/pg.jpg"}
        cover_pic={"/pic.jpg"}
        friends={45}
      />
    </div>
  );
};

export default index;
