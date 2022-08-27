//
// Copyright 2022 Anysphere, Inc.
// SPDX-License-Identifier: GPL-3.0-only
//

import { MutableRefObject, useEffect } from "react";
import { COMMAND_PRIORITY_LOW, EditorState, FOCUS_COMMAND } from "lexical";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { PlainTextPlugin } from "@lexical/react/LexicalPlainTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { LexicalEditor } from "lexical/LexicalEditor";

const prose = "prose-stone";

const theme = {
  paragraph: "mt-0 mb-0",
  placeholder: prose,
  quote: "mt-0 mb-0",
  heading: {
    h1: "mt-0 mb-0",
    h2: "mt-0 mb-0",
    h3: "mt-0 mb-0",
    h4: "mt-0 mb-0",
    h5: "mt-0 mb-0",
  },
  list: {
    nested: {
      listitem: prose,
    },
    ol: "mt-0 mb-0",
    ul: "mt-0 mb-0",
    listitem: "mt-1 mb-1",
  },
};

function FocusPlugin({
  focused,
  onFocus,
}: {
  focused: boolean;
  onFocus?: () => void;
}): JSX.Element | null {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (focused) {
      editor.focus();
    }
  }, [editor, focused]);

  useEffect(() => {
    return editor.registerCommand(
      FOCUS_COMMAND,
      () => {
        if (onFocus) {
          onFocus();
        }
        return false;
      },
      COMMAND_PRIORITY_LOW
    );
  }, [editor, onFocus]);

  return null;
}

export function Editor({
  focused,
  onFocus,
  editorStateRef,
}: {
  focused: boolean;
  onFocus?: () => void;
  editorStateRef: MutableRefObject<EditorState | null>;
}): JSX.Element {
  const initialConfig = {
    namespace: "MyEditor",
    theme,
    onError: (error: Error, _: LexicalEditor) => {
      console.error(error);
    },
    nodes: [],
  };

  return (
    <div className="prose prose-sm prose-stone prose-stonex relative bg-white">
      <LexicalComposer initialConfig={initialConfig}>
        <PlainTextPlugin
          contentEditable={
            <ContentEditable className="min-h-[100px] text-sm outline-none" />
          }
          placeholder=""
        />
        <OnChangePlugin
          onChange={(editorState) => (editorStateRef.current = editorState)}
        />

        <HistoryPlugin />
        <FocusPlugin focused={focused} onFocus={onFocus} />
      </LexicalComposer>
    </div>
  );
}
