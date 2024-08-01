import React, { useState } from "react";
import {
  FacebookShareButton,
  TwitterShareButton,
  LinkedinShareButton,
  WhatsappShareButton,
  RedditShareButton,
  EmailShareButton,
  FacebookIcon,
  TwitterIcon,
  LinkedinIcon,
  WhatsappIcon,
  RedditIcon,
  EmailIcon,
} from "react-share";
import { FiLink } from "react-icons/fi";
import { TextResponse } from "@/types";
import Tooltip from "./Tooltip";

interface SocialShareProps {
  text: TextResponse["text"];
  darkMode: boolean;
}

const SocialShare: React.FC<SocialShareProps> = ({ text, darkMode }) => {
  const [copySuccess, setCopySuccess] = useState("");
  const shareUrl = `https://app.textbin.theenthusiast.dev/${text.slug}`;
  const title = text.title;
  const description = text.content.substring(0, 100) + "...";

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopySuccess("Copied!");
      setTimeout(() => setCopySuccess(""), 2000);
    } catch (err) {
      setCopySuccess("Failed to copy");
    }
  };

  return (
    <div
      className={`mt-4 p-4 rounded-lg ${darkMode ? "bg-gray-700" : "bg-gray-200"}`}
    >
      <h3
        className={`text-lg font-semibold mb-2 ${darkMode ? "text-white" : "text-gray-800"}`}
      >
        Share this text
      </h3>
      <div className="flex flex-wrap gap-2">
        <div data-tooltip-id="facebook-tooltip">
          <FacebookShareButton url={shareUrl} quote={title} hashtag="#TextBin">
            <FacebookIcon size={32} round />
          </FacebookShareButton>
        </div>
        <Tooltip id="facebook-tooltip" content="Share on Facebook" />

        <div data-tooltip-id="twitter-tooltip">
          <TwitterShareButton
            url={shareUrl}
            title={title}
            hashtags={["TextBin"]}
          >
            <TwitterIcon size={32} round />
          </TwitterShareButton>
        </div>
        <Tooltip id="twitter-tooltip" content="Share on Twitter" />

        <div data-tooltip-id="linkedin-tooltip">
          <LinkedinShareButton
            url={shareUrl}
            title={title}
            summary={description}
            source="TextBin"
          >
            <LinkedinIcon size={32} round />
          </LinkedinShareButton>
        </div>
        <Tooltip id="linkedin-tooltip" content="Share on LinkedIn" />

        <div data-tooltip-id="whatsapp-tooltip">
          <WhatsappShareButton url={shareUrl} title={title} separator=" - ">
            <WhatsappIcon size={32} round />
          </WhatsappShareButton>
        </div>
        <Tooltip id="whatsapp-tooltip" content="Share on WhatsApp" />

        <div data-tooltip-id="reddit-tooltip">
          <RedditShareButton url={shareUrl} title={title}>
            <RedditIcon size={32} round />
          </RedditShareButton>
        </div>
        <Tooltip id="reddit-tooltip" content="Share on Reddit" />

        <div data-tooltip-id="email-tooltip">
          <EmailShareButton
            url={shareUrl}
            subject={title}
            body={`Check out this text I found on TextBin:\n\n${description}\n\n${shareUrl}`}
          >
            <EmailIcon size={32} round />
          </EmailShareButton>
        </div>
        <Tooltip id="email-tooltip" content="Share via Email" />

        <button
          onClick={handleCopyLink}
          className={`flex items-center justify-center w-8 h-8 rounded-full ${
            darkMode
              ? "bg-gray-600 hover:bg-gray-500"
              : "bg-gray-300 hover:bg-gray-400"
          } transition-colors duration-200`}
          data-tooltip-id="copy-link-tooltip"
        >
          <FiLink className={darkMode ? "text-white" : "text-gray-800"} />
        </button>
        <Tooltip id="copy-link-tooltip" content={copySuccess || "Copy link"} />
      </div>
    </div>
  );
};

export default SocialShare;
