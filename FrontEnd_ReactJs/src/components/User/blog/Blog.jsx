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
    <div className="w-full px-4 md:px-10 lg:px-24 py-10 max-w-7xl mx-auto">
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
        {/* Left Column - Main Story */}
        <div className="w-full lg:w-5/12 flex flex-col">
          <h2 className="font-bold text-orange-500 text-2xl md:text-3xl lg:text-4xl text-center lg:text-left pb-6">
            Videos and photos
          </h2>
          <div className="rounded-xl overflow-hidden shadow-lg mb-4">
            <img src={imgBlog1} alt="10 Cloverfield Lane" className="w-full h-auto object-cover hover:scale-105 transition duration-300" />
          </div>
          <h3 className="font-bold text-xl pt-2 pb-2 text-gray-800">10 Cloverfield Lane</h3>
          <p className="text-gray-600 text-sm md:text-base leading-relaxed text-justify">
            A young woman wakes up after a terrible accident to find that she’s… locked in a cellar with a doomsday prepper,… who insists that he saved her life and that the world outside is uninhabitable following an apocalyptic catastrophe. Uncertain what to believe, the woman soon….
          </p>
        </div>

        {/* Right Column - Image Grid */}
        <div className="w-full lg:w-7/12">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 md:gap-4 h-full">
            {[imgBlog5, imgBlog2, imgBlog3, imgBlog4, imgBlog6, imgBlog7, imgBlog8, imgBlog9, imgBlog10].map((img, index) => (
              <div key={index} className="rounded-lg overflow-hidden shadow-md aspect-video">
                <img 
                  src={img} 
                  alt={`Blog ${index + 1}`} 
                  className="w-full h-full object-cover hover:scale-110 transition duration-500 cursor-pointer"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Blog;
