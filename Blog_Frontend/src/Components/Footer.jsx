import { mutedText } from "../styles/common";

function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="border-t border-[#e8e8ed] bg-[#f5f5f7] py-8 mt-auto">
      <div className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Brand/Credits */}
        <p className={`${mutedText} font-semibold`}>
          MyBlog — A Premium Reading Experience.
        </p>
        
        {/* Copyright */}
        <p className="text-xs text-[#a1a1a6] font-normal">
          © {currentYear} MyBlog Inc. All rights reserved. Built with precision and elegance.
        </p>
      </div>
    </footer>
  );
}

export default Footer;