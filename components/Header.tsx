// Header.tsx
import Link from "next/link";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { FiMoon, FiSun, FiCode, FiSettings, FiMenu } from "react-icons/fi";
import { FaGithub } from "react-icons/fa";
import { editorThemes, EditorThemeName } from "@/lib/constants";
import Tooltip from "./Tooltip";
import { useState } from "react";
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { ChevronDownIcon, ChevronRightIcon, GearIcon } from '@radix-ui/react-icons';
import '../globals.css';

interface HeaderProps {
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
  highlightSyntax: boolean;
  setHighlightSyntax: (value: boolean) => void;
  editorTheme: EditorThemeName;
  setEditorTheme: (theme: EditorThemeName) => void;
}

function Header({
  darkMode,
  setDarkMode,
  highlightSyntax,
  setHighlightSyntax,
  editorTheme,
  setEditorTheme,
}: HeaderProps) {
  return (
    <header
      className={`p-4 w-full ${darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"}`}
    >
      <div className="max-w-screen-xl mx-auto flex flex-wrap justify-between items-center">
        <Link
          href="/"
          className="text-2xl md:text-3xl font-bold cursor-pointer hover:text-blue-500 transition duration-300"
          data-tooltip-id="home-tooltip"
        >
          TEXT BIN
        </Link>
        <Tooltip id="home-tooltip" content="Go to homepage" />

        <div className="lg:hidden flex flex-row gap-2">
          <Link
            href="https://github.com/The-Enthusiast-404/text-bin-frontend"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center  transition ease-in-out transform hover:scale-105 duration-300"
          >
            <FaGithub className="text-2xl" />
          </Link>
          <DropdownMenu.Root>
            <DropdownMenu.Trigger>
              <FiMenu className="text-2xl" />
            </DropdownMenu.Trigger>
            <DropdownMenu.Portal>
              <DropdownMenu.Content className="DropdownMenuContent">
                <DropdownMenu.Item className="DropdownMenuItem">
                  <div className="flex w-full items-center justify-between">
                    <Label
                      htmlFor="dark-mode"
                      className="flex items-center gap-0.5"
                      data-tooltip-id="dark-mode-tooltip"
                    >
                      {darkMode ? (
                        <FiMoon className="mr-2" />
                      ) : (
                        <FiSun className="mr-2" />
                      )}
                      {darkMode ? "Dark Mode" : "Light Mode"}
                    </Label>
                    <Switch
                      checked={darkMode}
                      onCheckedChange={setDarkMode}
                      id="dark-mode"
                      className="data-[state=checked]:bg-blue-500 data-[state=unchecked]:bg-gray-200"
                    />
                  </div></DropdownMenu.Item>
                <DropdownMenu.Item className="DropdownMenuItem">
                  <div className="flex items-center w-full justify-between gap-4">
                    <Label htmlFor="highlight-syntax" className="flex items-center gap-0.5" data-tooltip-id="toggle-syntax-tooltip">
                      <FiCode className="mr-2" />
                      Syntax Highlighting
                    </Label>
                    <Switch
                      checked={highlightSyntax}
                      onCheckedChange={setHighlightSyntax}
                      id="highlight-syntax"
                      className="data-[state=checked]:bg-green-500 data-[state=unchecked]:bg-gray-200"
                    />
                  </div>
                </DropdownMenu.Item>
                <DropdownMenu.Item className="DropdownMenuItem" disabled>
                  <div className="flex items-center w-full">
                  <Label className="flex items-center gap-0.5">
                      <FiSettings className="mr-2" />
                      Select Editor Theme
                    </Label>
                  </div>
                </DropdownMenu.Item>
                {
                  Object.entries(editorThemes).map(([key, value]) => (
                    <DropdownMenu.Item className="DropdownMenuItem cursor-pointer ml-4" key={key} onClick={() => setEditorTheme(key as 'vs' | 'vs-dark' | 'hc-black' | 'hc-light' | 'github-light' | 'github-dark' | 'hacker-blue' | 'ultra-focus' | 'solarized-chroma' | 'solarized-light' | 'solarized-dark')}>
                      {`- ${value}`}
                    </DropdownMenu.Item>
                  ))
                }
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>
        </div>

        <div className="hidden lg:flex space-x-6">
          <div className="flex items-center space-x-2">
            <Switch
              checked={darkMode}
              onCheckedChange={setDarkMode}
              id="dark-mode"
              className="data-[state=checked]:bg-blue-500 data-[state=unchecked]:bg-gray-200"
            />
            <Label
              htmlFor="dark-mode"
              className="flex items-center"
              data-tooltip-id="dark-mode-tooltip"
            >
              {darkMode ? (
                <FiMoon className="mr-2" />
              ) : (
                <FiSun className="mr-2" />
              )}
              {darkMode ? "Dark Mode" : "Light Mode"}
            </Label>
            <Tooltip id="dark-mode-tooltip" content="Toggle dark mode" />
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              checked={highlightSyntax}
              onCheckedChange={setHighlightSyntax}
              id="highlight-syntax"
              className="data-[state=checked]:bg-green-500 data-[state=unchecked]:bg-gray-200"
            />
            <Label htmlFor="highlight-syntax" className="flex items-center" data-tooltip-id="toggle-syntax-tooltip">
              <FiCode className="mr-2" />
              Syntax Highlighting
            </Label>
            <Tooltip id="toggle-syntax-tooltip" content="Toggle Syntax Highlighting" />
          </div>
          <div className="flex items-center space-x-2">
            <select
              value={editorTheme}
              onChange={(e) =>
                setEditorTheme(e.target.value as EditorThemeName)
              }
              className={`${darkMode ? "bg-gray-700 text-white" : "bg-white text-gray-900"
                } border rounded p-1`}
            >
              {Object.entries(editorThemes).map(([key, value]) => (
                <option key={key} value={key}>
                  {value}
                </option>
              ))}
            </select>
            <Label className="flex items-center">
              <FiSettings className="mr-2" />
              Editor Theme
            </Label>
            
          </div>
          <Link
            href="https://blog.theenthusiast.dev/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center transition ease-in-out transform hover:scale-105 duration-300"
          >
            Blog
          </Link>
          <Link
            href="https://github.com/The-Enthusiast-404/text-bin-frontend"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center  transition ease-in-out transform hover:scale-105 duration-300"
          >
            <FaGithub className="text-2xl" />
          </Link>
        </div>
      </div>
    </header>
  );
}

export default Header;
