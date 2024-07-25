import { FaLinkedin, FaGithub, FaTwitter } from "react-icons/fa";

function Footer() {
  return (
    <footer className="bg-secondary text-secondary-foreground p-4">
      <div className="container mx-auto text-center">
        <p>
          &copy; 2024 The Enthusiast. This project is open-source under the{" "}
          <a
            href="https://opensource.org/licenses/MIT"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-primary"
          >
            MIT License
          </a>
          . Contributions are welcome!
        </p>
        <div className="flex justify-center space-x-4 mt-4">
          <a
            href="https://www.linkedin.com/company/the-enthusiast/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
          >
            <FaLinkedin className="text-xl hover:text-blue-600" />
          </a>
          <a
            href="https://github.com/The-Enthusiast-404"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
          >
            <FaGithub className="text-xl hover:text-black" />
          </a>
          <a
            href="https://twitter.com/introvertedbot"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Twitter"
          >
            <FaTwitter className="text-xl hover:text-blue-400" />
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
