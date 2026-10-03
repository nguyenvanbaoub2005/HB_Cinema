import React from "react";
import "./blog.css";
import imgBlog1 from "../../../assets/images/blog1.png"
import imgBlog2 from "../../../assets/images/blog2.png"
import imgBlog3 from "../../../assets/images/blog3.png"
import imgBlog4 from "../../../assets/images/blog4.png"
import imgBlog5 from "../../../assets/images/blog5.png"
import imgBlog6 from "../../../assets/images/blog6.png"
import imgBlog7 from "../../../assets/images/blog7.png"
import imgBlog8 from "../../../assets/images/blog8.png"
import imgBlog9 from "../../../assets/images/blog9.png"
import imgBlog10 from "../../../assets/images/blog10.png"


const Blog = () => {
  return (
      <div className="container row p-[40px] pr-[100px] pl-[110px]">
      <div className="col-md-5 flex flex-column">
        <h2 className="font-bold text-orange-500 text-3xl text-center pb-4">Videos and photos</h2>
        <img src={imgBlog1} alt="" />
        <h3 className="font-bold pt-2 pb-2">10 Cloverfield Lane</h3>
        <p>A young woman wakes up after a terrible accident to find that she’s… locked in a cellar with a doomsday prepper,… who insists that he saved her life and that the world outside is uninhabitable following an apocalyptic catastrophe. Uncertain what to believe, the woman soon….</p>
        </div>
      <div className="col-md-7">
        <div className="row pb-4">
          <div className="col-md-4"><img src={imgBlog5} alt="" /></div>
          <div className="col-md-4"><img src={imgBlog2} alt="" /></div>
          <div className="col-md-4"><img src={imgBlog3} alt="" /></div>
        </div>
        <div className="row pb-4">
          <div className="col-md-4"><img src={imgBlog4} alt="" /></div>
          <div className="col-md-4"><img src={imgBlog6} alt="" /></div>
          <div className="col-md-4"><img src={imgBlog7} alt="" /></div>
        </div>
        <div className="row">
          <div className="col-md-4"><img src={imgBlog8} alt="" /></div>
          <div className="col-md-4"><img src={imgBlog9} alt="" /></div>
          <div className="col-md-4"><img src={imgBlog10} alt="" /></div>
        </div>
      </div>

    </div>
  );
};

export default Blog;
