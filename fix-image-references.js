const fs = require('fs');
const path = require('path');

// 读取main.js文件
const mainJsPath = path.join(__dirname, 'dist', 'main.js');
let content = fs.readFileSync(mainJsPath, 'utf8');

// 获取dist目录中的所有图片文件
const distPath = path.join(__dirname, 'dist');
const files = fs.readdirSync(distPath);
const imageFiles = files.filter(file => file.endsWith('.png') || file.endsWith('.jpg'));

// 创建一个映射表，将带哈希的文件名映射到实际文件名
const fileMap = {};
imageFiles.forEach(file => {
  // 查找main.js中对应的带哈希的引用
  const baseName = path.basename(file, path.extname(file));
  const ext = path.extname(file);
  
  // 在main.js中查找对应的引用
  const regex = new RegExp(`\.\/${baseName}-[A-Z0-9]+${ext}`, 'g');
  content = content.replace(regex, `./${file}`);
});

// 写回文件
fs.writeFileSync(mainJsPath, content);
console.log('图片引用已修复');