 'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function SlackAdmin() {
  const [command, setCommand] = useState('/service');
  const [text, setText] = useState('status');
  const [response, setResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      // Create form data to simulate Slack's request format
      const formData = new FormData();
      formData.append('command', command);
      formData.append('text', text);
      formData.append('user_id', 'U12345678'); // Simulated user ID
      
      // Send request to our Slack command API
      const res = await fetch('/api/slack/command', {
        method: 'POST',
        body: formData,
      });
      
      const data = await res.json();
      setResponse(data);
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const presetCommands = [
    { name: 'Status Check', command: '/service', text: 'status' },
    { name: 'Restart Service', command: '/service', text: 'restart' },
    { name: 'View Metrics', command: '/service', text: 'metrics' },
    { name: 'Help', command: '/service', text: 'help' },
  ];

  return (
    <div className="min-h-screen p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Slack Command Admin</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Test and manage your Slack service commands
        </p>
        <div className="mt-4">
          <Link 
            href="/" 
            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
          >
            ← Back to Home
          </Link>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1 bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Command Tester</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Command</label>
              <input
                type="text"
                value={command}
                onChange={(e) => setCommand(e.target.value)}
                className="w-full p-2 border rounded bg-white dark:bg-gray-700 dark:border-gray-600"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Text</label>
              <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="w-full p-2 border rounded bg-white dark:bg-gray-700 dark:border-gray-600"
              />
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded disabled:opacity-50"
            >
              {loading ? 'Sending...' : 'Send Command'}
            </button>
          </form>

          <div className="mt-6">
            <h3 className="text-sm font-medium mb-2">Quick Commands</h3>
            <div className="grid grid-cols-2 gap-2">
              {presetCommands.map((preset, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setCommand(preset.command);
                    setText(preset.text);
                  }}
                  className="text-sm bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 py-1 px-2 rounded"
                >
                  {preset.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="md:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Response</h2>
          
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 rounded">
              {error}
            </div>
          )}
          
          {response ? (
            <div>
              <div className="mb-4 p-4 border rounded bg-gray-50 dark:bg-gray-900 dark:border-gray-700">
                <pre className="whitespace-pre-wrap break-words text-sm">
                  {JSON.stringify(response, null, 2)}
                </pre>
              </div>
              
              {response.text && (
                <div className="mt-6">
                  <h3 className="text-lg font-medium mb-2">Slack Preview</h3>
                  <div className="p-4 border rounded bg-white dark:bg-gray-700 dark:border-gray-600">
                    <p className="whitespace-pre-line">{response.text}</p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center p-8 text-gray-500 dark:text-gray-400">
              {loading ? 'Loading response...' : 'Send a command to see the response'}
            </div>
          )}
        </div>
      </div>

      <div className="mt-10 bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Available Commands</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse">
            <thead>
              <tr className="bg-gray-100 dark:bg-gray-700">
                <th className="border p-2 text-left">Command</th>
                <th className="border p-2 text-left">Text</th>
                <th className="border p-2 text-left">Description</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border p-2">/service</td>
                <td className="border p-2">status</td>
                <td className="border p-2">Check the current service status</td>
              </tr>
              <tr>
                <td className="border p-2">/service</td>
                <td className="border p-2">restart</td>
                <td className="border p-2">Restart the service</td>
              </tr>
              <tr>
                <td className="border p-2">/service</td>
                <td className="border p-2">metrics</td>
                <td className="border p-2">View service metrics</td>
              </tr>
              <tr>
                <td className="border p-2">/service</td>
                <td className="border p-2">help</td>
                <td className="border p-2">Show available commands</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}