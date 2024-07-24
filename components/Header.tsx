import Link from "next/link";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { FiMoon, FiSun, FiCode } from "react-icons/fi";

interface HeaderProps {
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
  highlightSyntax: boolean;
  setHighlightSyntax: (value: boolean) => void;
}

function Header({
  darkMode,
  setDarkMode,
  highlightSyntax,
  setHighlightSyntax,
}: HeaderProps) {
  return (
    <header
      className={`p-4 ${darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"}`}
    >
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/">
          <h1 className="text-4xl font-bold cursor-pointer hover:text-blue-500 transition duration-300">
            TEXT BIN
          </h1>
        </Link>
        <div className="flex space-x-6">
          <div className="flex items-center space-x-2">
            <Switch
              checked={darkMode}
              onCheckedChange={setDarkMode}
              id="dark-mode"
              className="data-[state=checked]:bg-blue-500 data-[state=unchecked]:bg-gray-200"
            />
            <Label htmlFor="dark-mode" className="flex items-center">
              {darkMode ? (
                <FiMoon className="mr-2" />
              ) : (
                <FiSun className="mr-2" />
              )}
              {darkMode ? "Dark Mode" : "Light Mode"}
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              checked={highlightSyntax}
              onCheckedChange={setHighlightSyntax}
              id="highlight-syntax"
              className="data-[state=checked]:bg-green-500 data-[state=unchecked]:bg-gray-200"
            />
            <Label htmlFor="highlight-syntax" className="flex items-center">
              <FiCode className="mr-2" />
              Syntax Highlighting
            </Label>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
