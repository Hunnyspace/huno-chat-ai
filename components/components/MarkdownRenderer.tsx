import React from 'react';

interface MarkdownRendererProps {
  content: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  const renderContent = () => {
    return content
      .split('\n')
      .map((line, index) => {
        // Headings
        if (line.startsWith('### ')) {
          return <h3 key={index} className="text-lg font-semibold text-indigo-300 mt-4 mb-2">{line.substring(4)}</h3>;
        }
        if (line.startsWith('## ')) {
          return <h2 key={index} className="text-xl font-bold text-indigo-300 mt-5 mb-3 border-b border-slate-700 pb-2">{line.substring(3)}</h2>;
        }
        // Bold text with **
        const boldedLine = line.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-slate-100">$1</strong>');
        
        // List items
        if (line.match(/^\s*(\*|\-|\d+\.)\s/)) {
            const listItemHtml = { __html: boldedLine.replace(/^\s*(\*|\-|\d+\.)\s/, '') };
            return <li key={index} className="ml-5 list-disc" dangerouslySetInnerHTML={listItemHtml} />;
        }
        
        // Paragraphs
        if (line.trim() === '') {
            return <br key={index} />;
        }

        const paragraphHtml = { __html: boldedLine };
        return <p key={index} className="mb-2" dangerouslySetInnerHTML={paragraphHtml} />;
      });
  };

  return <div className="prose prose-invert text-slate-300 text-sm">{renderContent()}</div>;
};

export default MarkdownRenderer;
