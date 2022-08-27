//
// Copyright 2022 Anysphere, Inc.
// SPDX-License-Identifier: GPL-3.0-only
//

import { MutableRefObject, useEffect, useState } from "react";

import { createEditor, BaseEditor, Descendant } from "slate";
import { ReactEditor, Slate, Editable, withReact } from "slate-react";

import { OpenAIApi, CreateCompletionResponse } from "openai";

const theme = {};

type CustomElement = { type: "paragraph"; children: CustomText[] };
type CustomText = { text: string };

declare module "slate" {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor;
    Element: CustomElement;
    Text: CustomText;
  }
}

const initialValue: Descendant[] = [
  {
    type: "paragraph",
    children: [{ text: "A line of text in a paragraph." }],
  },
];

export function Editor({
  editorStateRef,
  className,
  openai,
}: {
  editorStateRef: MutableRefObject<null>;
  className?: string;
  openai: OpenAIApi;
}): JSX.Element {
  const [editor] = useState(() => withReact(createEditor()));

  return (
    <div
      className={`prose prose-sm prose-stone outline-none relative ${
        className ?? ""
      } mx-auto`}
    >
      <Slate editor={editor} value={initialValue}>
        <Editable className="min-h-[100px] text-sm outline-none w-full h-full pt-12" />
      </Slate>
    </div>
  );
}
