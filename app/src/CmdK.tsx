import { useEffect, useState, useRef, useCallback } from "react";
import { Command } from "cmdk";

export function CmdK({
  writeOpenAiKey,
}: {
  writeOpenAiKey: (apikey: string) => void;
}) {
  const [open, setOpen] = useState(false);

  // Toggle the menu when ⌘K is pressed
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && e.metaKey) {
        setOpen((open) => !open);
        e.preventDefault();
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [open]);

  const ref = useRef<HTMLDivElement | null>(null);
  const [inputValue, setInputValue] = useState("");

  const [pages, setPages] = useState<string[]>(["home"]);
  const activePage = pages[pages.length - 1];
  const isHome = activePage === "home";

  const popPage = useCallback(() => {
    setPages((pages) => {
      const x = [...pages];
      x.splice(-1, 1);
      if (x.length !== pages.length) {
        setInputValue("");
      }
      return x;
    });
  }, []);

  function bounce() {
    if (ref.current) {
      ref.current.style.transform = "scale(0.96)";
      setTimeout(() => {
        if (ref.current) {
          ref.current.style.transform = "";
        }
      }, 100);

      setInputValue("");
    }
  }

  let bigComponent;
  switch (activePage) {
    case "home":
    case "projects":
      bigComponent = (
        <>
          <div className="absolute top-8 left-0 right-0 pt-0 px-4 pb-4 border-b border-gray-300 flex flex-row gap-2">
            <Command.Input
              autoFocus
              placeholder="What do you need?"
              className="border-none outline-none "
              onValueChange={(value) => {
                setInputValue(value);
              }}
              value={inputValue}
            />
          </div>
          <Command.List className="absolute bottom-0 left-2 right-2 top-20 overflow-scroll text-sm overscroll-contain">
            <Command.Empty>No results found.</Command.Empty>
            {activePage === "home" && (
              <Home
                searchProjects={() => setPages([...pages, "projects"])}
                enterApiKey={() => setPages([...pages, "apikey"])}
              />
            )}
            {activePage === "projects" && <Projects />}
          </Command.List>
        </>
      );
      break;
    case "apikey":
      bigComponent = (
        <div className="absolute top-8 left-0 right-0 pt-0 px-4 pb-4 border-b border-gray-300 flex flex-row gap-2">
          Enter OpenAI API key:
          <Command.Input
            autoFocus
            placeholder="sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
            className="border-none outline-none "
            onValueChange={(value) => {
              setInputValue(value);
            }}
            onKeyDown={(e: KeyboardEvent) => {
              if (e.key === "Enter") {
                writeOpenAiKey(inputValue);
                setOpen(false);
              }
            }}
            value={inputValue}
          />
        </div>
      );
      break;
  }

  return (
    <div
      className=""
      style={{
        backgroundColor: open ? "rgba(0, 0, 0, 0.2)" : "",
      }}
    >
      {open && <div className="fixed inset-0 bg-gray-400/95" />}
      <div className="place-self-center bg-green-100 ">
        <Command.Dialog
          open={open}
          onOpenChange={setOpen}
          label="Global Command Menu"
          ref={ref}
          className="fixed inset-0 top-0 z-50 transition overflow-y-auto max-w-[640px] m-auto max-h-[400px] rounded-lg bg-white"
          onKeyDown={(e: KeyboardEvent) => {
            if (e.key === "Enter") {
              bounce();
            }

            if (isHome || inputValue.length) {
              return;
            }

            if (e.key === "Backspace") {
              e.preventDefault();
              popPage();
              bounce();
            }
          }}
        >
          <div className="relative w-full h-full ">
            <div className="flex flex-row gap-2 absolute top-1 left-1">
              {pages.map((p) => (
                <div
                  key={p}
                  className="text-sm px-1 bg-slate-100 rounded-lg text-slate-500"
                >
                  {p}
                </div>
              ))}
            </div>
            {bigComponent}
          </div>
        </Command.Dialog>
      </div>
    </div>
  );
}

function Home({
  searchProjects,
  enterApiKey,
}: {
  searchProjects: Function;
  enterApiKey: Function;
}) {
  return (
    <>
      <Item
        onSelect={() => {
          enterApiKey();
        }}
      >
        Add API Key
      </Item>
      <Command.Group heading="Projects">
        <Item
          shortcut="S P"
          onSelect={() => {
            searchProjects();
          }}
        >
          <ProjectsIcon />
          Search Projects...
        </Item>
        <Item>
          <PlusIcon />
          Create New Project...
        </Item>
      </Command.Group>
      <Command.Group heading="Teams">
        <Item shortcut="⇧ P">
          <TeamsIcon />
          Search Teams...
        </Item>
        <Item>
          <PlusIcon />
          Create New Team...
        </Item>
      </Command.Group>
      <Command.Group heading="Help">
        <Item shortcut="⇧ D">
          <DocsIcon />
          Search Docs...
        </Item>
        <Item>
          <FeedbackIcon />
          Send Feedback...
        </Item>
        <Item>
          <ContactIcon />
          Contact Support
        </Item>
      </Command.Group>
    </>
  );
}

function Projects() {
  return (
    <>
      <Item>Project 1</Item>
      <Item>Project 2</Item>
      <Item>Project 3</Item>
      <Item>Project 4</Item>
      <Item>Project 5</Item>
      <Item>Project 6</Item>
    </>
  );
}

function ApiKey() {
  return (
    <>
      <Item>Enter OpenAI API key: </Item>
    </>
  );
}

function Item({
  children,
  shortcut,
  onSelect,
}: {
  children: React.ReactNode;
  shortcut?: string;
  onSelect?: (value: string) => void;
}) {
  return (
    <Command.Item
      onSelect={onSelect}
      className="cursor-pointer h-12 flex items-center gap-2 py-0 px-4 unselectable active:bg-gray-100 hover:bg-gray-100"
    >
      {children}
      {shortcut != null ? (
        <div className="flex gap-2">
          {shortcut.split(" ").map((key) => {
            return (
              <kbd className="p-2 pt-1 h-8 rounded-sm bg-gray-100" key={key}>
                {key}
              </kbd>
            );
          })}
        </div>
      ) : null}
    </Command.Item>
  );
}

function ProjectsIcon() {
  return (
    <svg
      fill="none"
      height="24"
      shapeRendering="geometricPrecision"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
      viewBox="0 0 24 24"
      width="24"
    >
      <path d="M3 3h7v7H3z"></path>
      <path d="M14 3h7v7h-7z"></path>
      <path d="M14 14h7v7h-7z"></path>
      <path d="M3 14h7v7H3z"></path>
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg
      fill="none"
      height="24"
      shapeRendering="geometricPrecision"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
      viewBox="0 0 24 24"
      width="24"
    >
      <path d="M12 5v14"></path>
      <path d="M5 12h14"></path>
    </svg>
  );
}

function TeamsIcon() {
  return (
    <svg
      fill="none"
      height="24"
      shapeRendering="geometricPrecision"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
      viewBox="0 0 24 24"
      width="24"
    >
      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"></path>
      <circle cx="9" cy="7" r="4"></circle>
      <path d="M23 21v-2a4 4 0 00-3-3.87"></path>
      <path d="M16 3.13a4 4 0 010 7.75"></path>
    </svg>
  );
}

function CopyIcon() {
  return (
    <svg
      fill="none"
      height="24"
      shapeRendering="geometricPrecision"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
      viewBox="0 0 24 24"
      width="24"
    >
      <path d="M8 17.929H6c-1.105 0-2-.912-2-2.036V5.036C4 3.91 4.895 3 6 3h8c1.105 0 2 .911 2 2.036v1.866m-6 .17h8c1.105 0 2 .91 2 2.035v10.857C20 21.09 19.105 22 18 22h-8c-1.105 0-2-.911-2-2.036V9.107c0-1.124.895-2.036 2-2.036z"></path>
    </svg>
  );
}

function DocsIcon() {
  return (
    <svg
      fill="none"
      height="24"
      shapeRendering="geometricPrecision"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
      viewBox="0 0 24 24"
      width="24"
    >
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"></path>
      <path d="M14 2v6h6"></path>
      <path d="M16 13H8"></path>
      <path d="M16 17H8"></path>
      <path d="M10 9H8"></path>
    </svg>
  );
}

function FeedbackIcon() {
  return (
    <svg
      fill="none"
      height="24"
      shapeRendering="geometricPrecision"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
      viewBox="0 0 24 24"
      width="24"
    >
      <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"></path>
    </svg>
  );
}

function ContactIcon() {
  return (
    <svg
      fill="none"
      height="24"
      shapeRendering="geometricPrecision"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
      viewBox="0 0 24 24"
      width="24"
    >
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
      <path d="M22 6l-10 7L2 6"></path>
    </svg>
  );
}
