import fs from 'fs';
const adminPath = 'packages/sdkwork-claw-router-admin-channel/src/index.tsx';
const consolePath = 'packages/sdkwork-claw-router-console-routing/src/components/ChannelsTab.tsx';

const admin = fs.readFileSync(adminPath, 'utf8');
const consoleStr = fs.readFileSync(consolePath, 'utf8');

const adminLines = admin.split('\n');
const consoleLines = consoleStr.split('\n');

const adminReturnStart = adminLines.findIndex((l, i) => l.includes('return (') && adminLines[i+1]?.includes('className="w-full h-full max-w-[1400px]'));
// Actually, earlier grep says: <div className="flex-1 bg-white dark:bg-[#1a1a1a]... Let me just replace from <div className="flex-1 bg-white... down to {isModalOpen &&
// Wait, I want EVERYTHING replacing from the opening <div className="w-full h-full...

const findIndexSafe = (lines, str) => lines.findIndex(l => l.includes(str));

const adminStart = findIndexSafe(adminLines, '<div className="w-full h-full flex flex-col');
const adminEnd = adminLines.length - 2;

const consoleStart = findIndexSafe(consoleLines, '<div className="w-full h-full flex flex-col');
const consoleEnd = consoleLines.length - 2;

let copiedReturn = adminLines.slice(adminStart, adminEnd).join('\n');

copiedReturn = copiedReturn.replaceAll('添加路由账号', '添加渠道账号');
copiedReturn = copiedReturn.replaceAll('个路由账号', '个渠道账号');
copiedReturn = copiedReturn.replaceAll('路由账号管理', '渠道账号管理');

const newConsoleLines = [
  ...consoleLines.slice(0, consoleStart),
  ...copiedReturn.split('\n'),
  '}'
];

fs.writeFileSync(consolePath, newConsoleLines.join('\n'));
console.log('Done sync fixed.');
