import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

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
    <header className="bg-primary text-primary-foreground p-4">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-4xl font-bold">TEXT BIN</h1>
        <div className="flex space-x-6">
          <div className="flex items-center space-x-2">
            <Switch
              checked={darkMode}
              onCheckedChange={setDarkMode}
              id="dark-mode"
              className="data-[state=checked]:bg-blue-500 data-[state=unchecked]:bg-gray-200"
            />
            <Label htmlFor="dark-mode">
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
            <Label htmlFor="highlight-syntax">Syntax Highlighting</Label>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
