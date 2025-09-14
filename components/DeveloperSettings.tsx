import React from 'react';

const CodeBlock: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <pre className="bg-gray-900/80 p-4 rounded-lg text-sm text-gray-300 overflow-x-auto">
        <code>{children}</code>
    </pre>
);

const DeveloperSettings: React.FC = () => {
    return (
        <div className="glass-card p-6 rounded-2xl space-y-8">
            <div>
                <h2 className="text-xl font-bold text-white mb-2">Developer Customization Guide</h2>
                <p className="text-gray-400">This section provides instructions for developers to customize the appearance and branding of the application.</p>
            </div>

            <div className="space-y-4">
                <h3 className="text-lg font-semibold text-blue-400">Favicon and App Icons</h3>
                <p className="text-gray-400">To change the favicon and app icons, replace the following files in the project's root directory. These files are typically served from a `public` folder in most Vite setups.</p>
                <ul className="list-disc list-inside text-gray-400 space-y-1">
                    <li><code className="text-amber-400 bg-gray-700/50 px-1 py-0.5 rounded">favicon.ico</code> - The main browser tab icon.</li>
                    <li><code className="text-amber-400 bg-gray-700/50 px-1 py-0.5 rounded">logo192.png</code> - App icon for manifests (192x192).</li>
                    <li><code className="text-amber-400 bg-gray-700/50 px-1 py-0.5 rounded">logo512.png</code> - Larger app icon for manifests (512x512).</li>
                </ul>
                <p className="text-gray-400">Ensure the new files have the exact same names. You may need to update the <code className="text-amber-400 bg-gray-700/50 px-1 py-0.5 rounded">index.html</code> if you use different file names or formats.</p>
            </div>

            <div className="space-y-4">
                <h3 className="text-lg font-semibold text-blue-400">UI Icons (SVG)</h3>
                <p className="text-gray-400">All UI icons used in the application are React components located in the <code className="text-amber-400 bg-gray-700/50 px-1 py-0.5 rounded">/components/icons/</code> directory. To change an icon, edit the corresponding SVG code within its file.</p>
                <p className="text-gray-400">For example, to change the 'Send' icon, you would edit the file:</p>
                <CodeBlock>{`// /components/icons/SendIcon.tsx

import React from 'react';

export const SendIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" ...>
    // Replace with your new SVG path data
    <path d="m22 2-7 20-4-9-9-4Z" />
    <path d="M22 2 11 13" />
  </svg>
);`}</CodeBlock>
            </div>

            <div className="space-y-4">
                <h3 className="text-lg font-semibold text-blue-400">Color Scheme</h3>
                <p className="text-gray-400">The entire application color scheme is controlled by CSS variables defined in <code className="text-amber-400 bg-gray-700/50 px-1 py-0.5 rounded">index.html</code>. Modify these values to re-brand the application instantly.</p>
                <CodeBlock>{`<style>
  :root {
    --bg-primary: #111827;
    --bg-secondary: #1F2937;
    --text-primary: #F3F4F6;
    --text-secondary: #9CA3AF;
    --border-color: rgba(75, 85, 99, 0.5);
    --accent-primary: #3B82F6;
    --accent-secondary: #60A5FA;
    --accent-gradient: linear-gradient(135deg, var(--accent-secondary), var(--accent-primary));
  }
</style>`}</CodeBlock>
            </div>
        </div>
    );
};

export default DeveloperSettings;
