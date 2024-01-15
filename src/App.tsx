import React from 'react';
import * as marked from 'marked';
import ReactDOM from 'react-dom';

const renderer = new marked.Renderer();

const Bold = () => <strong>B</strong>;
const Italic = () => <em>I</em>;
const Underline = () => <u>U</u>;

function App() {
  const [text, setText] = React.useState("");
  const [options, setOptions] = React.useState({
    breaks: true,
  });

  const applyStyle = (style: string) => {
    let updatedText = text;

    switch (style) {
      case "bold":
        updatedText = applyMarkdownStyle(updatedText, '**');
        break;
      case "italic":
        updatedText = applyMarkdownStyle(updatedText, '*');
        break;
      case "underline":
        updatedText = applyMarkdownStyle(updatedText, '_');
        break;
      case "align-left":
        updatedText = applyMarkdownStyle(updatedText, '<div style="text-align: left;">', '</div>');
        break;
      case "align-center":
        updatedText = applyMarkdownStyle(updatedText, '<div style="text-align: center;">', '</div>');
        break;
      case "align-right":
        updatedText = applyMarkdownStyle(updatedText, '<div style="text-align: right;">', '</div>');
        break;
      case "bullets":
        updatedText = applyBullets(updatedText);
        break;
      // Add more cases for other styles as needed
      default:
        break;
    }

    setText(updatedText);
  };

  const applyMarkdownStyle = (text: string, startTag: string, endTag: string = ""): string => {
    const textarea = document.getElementById('editor') as HTMLTextAreaElement;
    const selectionStart = textarea.selectionStart || 0;
    const selectionEnd = textarea.selectionEnd || 0;

    let updatedText = text;

    if (selectionStart !== undefined && selectionEnd !== undefined) {
      const selectedText = text.substring(selectionStart, selectionEnd);
      const styledText = `${startTag}${selectedText}${endTag}`;

      updatedText = text.substring(0, selectionStart) + styledText + text.substring(selectionEnd);
    }

    return updatedText;
  };

  const applyBullets = (text: string): string => {
    const textarea = document.getElementById('editor') as HTMLTextAreaElement;
    const selectionStart = textarea.selectionStart || 0;
    const selectionEnd = textarea.selectionEnd || 0;

    let updatedText = text;

    if (selectionStart !== undefined && selectionEnd !== undefined) {
      const selectedText = text.substring(selectionStart, selectionEnd);
      const lines = selectedText.split('\n');
      const bulletedText = lines.map(line => `• ${line}`).join('\n');

      updatedText = text.substring(0, selectionStart) + bulletedText + text.substring(selectionEnd);
    }

    return updatedText;
  };

  return (
    <div className="text-center px-4">
      <h1 className="p-4">My Markdown of Arnaud</h1>
      <div>
        <h4 className="text-center">Place of typing:</h4>
        <textarea
          name="text"
          id="editor"
          rows={10}
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="editor"
        ></textarea>

        <label>
          <input
            type="checkbox"
            checked={options.breaks}
            onChange={() => setOptions({ breaks: !options.breaks })}
          />{" "}
          Enable Line Breaks
        </label>

        <div className="flex justify-evenly py-3 items-center bg-gray-600">
          <button onClick={() => applyStyle("bold")}>
            <Bold />
          </button>
          <button onClick={() => applyStyle("italic")}>
            <Italic />
          </button>
          <button onClick={() => applyStyle("underline")}>
            <Underline />
          </button>
          <button onClick={() => applyStyle("align-left")}>
            Align Left
          </button>
          <button onClick={() => applyStyle("align-center")}>
            Align Center
          </button>
          <button onClick={() => applyStyle("align-right")}>
            Align Right
          </button>
          <button onClick={() => applyStyle("bullets")}>
            Bullets
          </button>
        </div>

        <h3 className="mt-3">Result:</h3>

        <Preview markdown={text} options={options} />
      </div>
    </div>
  );
}

interface PreviewProps {
  markdown: string;
  options: { breaks: boolean };
}

const Preview: React.FC<PreviewProps> = ({ markdown, options }) => {
  const previewRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    const parseMarkdown = async () => {
      const result = await marked.parse(markdown, { renderer, ...options });
      if (previewRef.current) {
        previewRef.current.innerHTML = result;
      }
    };

    parseMarkdown();
  }, [markdown, options]);

  return <div ref={previewRef} id="preview"></div>;
};

export default App;
