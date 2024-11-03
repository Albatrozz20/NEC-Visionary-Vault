import { useState } from "react";
import './home.css';
import Posts from "../../components/common/Posts";
import CreatePost from "./CreatePost";
import'../../index.css'

const HomePage = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [feedType, setFeedType] = useState("forYou");
  const openUpload = () => {
    console.log("Function called!");
    setIsVisible(true);
  };

  const closeUpload = () => {
    setIsVisible(false);
  };

  return (
    <>

      <div className="container">
        <button className="uploadBtn button rounded" onClick={openUpload}>Upload Project</button>
      </div>
      <br />
      {isVisible && (
        <div className="container uploadContainer" >
          <div className="innerUpload p-3 rounded">
            <button className="rounded closeBtn" onClick={closeUpload}>Cancel</button>
            <CreatePost />
          </div>
        </div>
      )}

      <div className="overall-feed-type">
        {/* Header */}
        <div className="d-flex w-100 feed-type border">
          <div
            className={
              "d-flex two-div col-6 justify-content-center p-3"
            }
            onClick={() => setFeedType("forYou")}
          >
            All Projects
            {feedType === "forYou" && (
              <div className="two-div-underline bg-orange"></div>
            )}
          </div>
          <div
            className="d-flex two-div col-6 justify-content-center p-3"
            onClick={() => setFeedType("following")}
          >
            Colleagues
            {feedType === "following" && (
              <div className="two-div-underline bg-orange"></div>
            )}
          </div>
        </div>
        {/*  CREATE POST INPUT */}
        

        {/* POSTS */}
        <Posts feedType={feedType} />
      </div>
    </>
  );
};
export default HomePage;
