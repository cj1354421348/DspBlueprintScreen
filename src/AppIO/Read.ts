const electron = window.require && window.require('electron');
const path = require('path');
const fs = require('fs');
import * as crypto from 'crypto';
/**
 * 读取蓝图文件路径
 * @param dirPath 
 * @returns 
 */
export function getAllFiles(dirPath: string) {
  let results: any[] = [];

  // 读取目录中的所有文件和子目录
  const list = fs.readdirSync(dirPath);

  list.forEach((file: any) => {
    const filePath = path.join(dirPath, file);
    const stat = fs.statSync(filePath);

    // 如果是目录，则递归调用
    if (stat && stat.isDirectory()) {
      results = results.concat(getAllFiles(filePath));
    } else {
      // 如果是文件，则将路径添加到结果数组中
      results.push(filePath);
    }
  });

  return results;
}

/**
 * 读取 JSON 文件
 * @param filePath 文件路径
 * @returns 该文件的内容，如果不是 JSON 文件或读取失败则返回 null
 */
export function readJsonFile(filePath: string): any {
  // 检查文件扩展名是否为 .json
  if (!filePath.endsWith('.json')) {
    console.error(`文件 ${filePath} 不是 JSON 文件`);
    return null;
  }
  try {
    const fileContent = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(fileContent);
  } catch (error) {
    console.error(`读取JSON文件出错：${error}`);
    return null;
  }
}
//读取配置文件
export function readConfigFile(filePath: string): config|null {
    if (!filePath.endsWith('.json')) {
    console.error(`文件 ${filePath} 不是 JSON 文件`);
    return null;
  }
  try {
    const fileContent = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(fileContent);
  } catch (error) {
    console.error(`读取JSON文件出错：${error}`);
    return null;
  }
}
// const directoryPath = 'C:\\your\\directory\\path'; // 替换为你的目录路径
// const allFiles = getAllFiles(directoryPath);

// console.log(allFiles);
/**
 * 获取程序运行根目录
 * @returns
 */
export function getExePath() {
  //return path.dirname("C:");
  return path.dirname(electron.remote.app.getPath("exe"));
}

export function getSystem() {
  //这是mac系统
  if (process.platform == "darwin") {
    return 1;
  }
  //这是windows系统
  if (process.platform == "win32") {
    return 2;
  }
  //这是linux系统
  if (process.platform == "linux") {
    return 3;
  }
}
/**
*
* @returns 获取配置文件路径
*/
export function getConfigPath() {

  if (!electron.remote.app.isPackaged)
    return readConfigFile("D:\\project\\dsp_blueprint_screen\\config.json");
  if (getSystem() === 1) {
    return readConfigFile(getExePath() + "/config.json");
  } else {
    return readConfigFile(getExePath() + "\\config.json");
  }
}
/**
 * 读取数据内所有文件内容
 * @param filePaths 
 */
// 读取文件内容和计算 MD5 的函数
export async function readFiles(filePaths: string[]): Promise<Map<string, { filePath: string, data: string }>> {
  let result = new Map<string, { filePath: string, data: string }>();
  for (const filePath of filePaths) {
    try {
      const stats = await fs.promises.stat(filePath);
      if (stats.isFile() && path.extname(filePath) === '.txt') {
        // 读取文件内容
        const data = await fs.promises.readFile(filePath, 'utf8');
        const md5Hash = await calculateMD5(filePath);
        result.set(md5Hash, { filePath, data });
      }
    } catch (error) {
      console.error(`Failed to read file ${filePath}:`, error);
    }
  }
  return result;
}

// 计算文件的 MD5 哈希值的函数
function calculateMD5(filePath: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const hash = crypto.createHash('md5');
    const stream = fs.createReadStream(filePath);

    stream.on('data', (data: crypto.BinaryLike) => {
      hash.update(data);
    });

    stream.on('end', () => {
      resolve(hash.digest('hex'));
    });

    stream.on('error', (err: any) => {
      reject(err);
    });
  });
}
