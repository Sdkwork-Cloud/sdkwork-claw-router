const fs = require('fs');
const admin = fs.readFileSync('packages/sdkwork-claw-router-admin-channel/src/index.tsx', 'utf8');
const consoleStr = fs.readFileSync('packages/sdkwork-claw-router-console-routing/src/components/ChannelsTab.tsx', 'utf8');
const adminLines = admin.split('\n');
const consoleLines = consoleStr.split('\n');

const newConsoleLines = [
  ...consoleLines.slice(0, 3), // import React..., import { ...lucide-react } ..., \n
  ...adminLines.slice(3, 392), // const protocolsList ... through ... } function AddAccountModal }
  ...consoleLines.slice(411) // export function ChannelsTab() { ...
];

fs.writeFileSync('packages/sdkwork-claw-router-console-routing/src/components/ChannelsTab.tsx', newConsoleLines.join('\n'));
console.log('Modified ChannelsTab.tsx successfully.');
