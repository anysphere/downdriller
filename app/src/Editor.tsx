//
// Copyright 2022 Anysphere, Inc.
// SPDX-License-Identifier: GPL-3.0-only
//

import { MutableRefObject, useEffect, useState } from "react";

import { useEditor, EditorContent, Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { classNames } from "./utils";

import { OpenAIApi, CreateCompletionResponse } from "openai";

const theme = {};

type CustomElement = { type: "paragraph"; children: CustomText[] };
type CustomText = { text: string };

export function EditorComp({
  className,
  editorRef,
}: {
  className?: string;
  editorRef: MutableRefObject<Editor | null>;
}): JSX.Element {
  const editor = useEditor({
    extensions: [StarterKit],
    content: "<p>Hello World!</p>",
    editorProps: {
      attributes: {
        class:
          "prose prose-sm prose-stone focus:outline-none p-2 mx-auto focus:ring-indigo-500 focus:border-indigo-500 h-[calc(100vh-2rem)]",
      },
    },
  });
  editorRef.current = editor;

  return (
    <div className={classNames("", className ?? "")}>
      <EditorContent editor={editor} />
    </div>
  );
}
