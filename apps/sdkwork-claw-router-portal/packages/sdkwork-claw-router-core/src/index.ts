import { API_BASE_URL } from 'sdkwork-claw-router-commons/runtime';
import { resolveApiRequestUrl } from 'sdkwork-claw-router-commons/runtime';

export function generateCodeSnippets(curlCommand: string) {
  try {
    // Extract URL
    const urlMatch = curlCommand.match(/curl\s+([^\s\\]+)/);
    const url = urlMatch ? urlMatch[1] : resolveApiRequestUrl(API_BASE_URL, '/v1/chat/completions').url;

    // Extract Headers
    const headers: Record<string, string> = {};
    const headerRegex = /-H\s+"([^"]+)"/g;
    let match;
    while ((match = headerRegex.exec(curlCommand)) !== null) {
      const parts = match[1].split(': ');
      if (parts.length === 2) {
        headers[parts[0]] = parts[1];
      }
    }

    // Extract Body
    const bodyMatch = curlCommand.match(/-d\s+'([^']+)'/);
    let body = bodyMatch ? bodyMatch[1] : '{}';

    // Format JSON body for snippets
    try {
      body = JSON.stringify(JSON.parse(body), null, 2);
    } catch {
      // Ignore parse error, use raw body
    }

    const jsSnippet = `fetch('${url}', {
  method: 'POST',
  headers: ${JSON.stringify(headers, null, 2)},
  body: JSON.stringify(${body})
})
.then(response => response.json())
.then(data => console.log(data));`;

    const pythonSnippet = `import requests

url = '${url}'
headers = ${JSON.stringify(headers, null, 2)}
data = ${body}

response = requests.post(url, headers=headers, json=data)
print(response.json())`;

    return {
      cURL: curlCommand,
      JavaScript: jsSnippet,
      Python: pythonSnippet,
    };
  } catch {
    return { cURL: curlCommand };
  }
}
