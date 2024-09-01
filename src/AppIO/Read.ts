const electron = window.require && window.require('electron');
const path = require('path');
const fs = require('fs');
import { MapData } from '@/MyIns/MapData';
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
// 使用示例
// const directoryPath = 'C:\\your\\directory\\path'; // 替换为你的目录路径
// const allFiles = getAllFiles(directoryPath);

// console.log(allFiles);
/**
 * 获取程序运行根目录
 * @param addPath 
 * @returns
 */
export function getExePath(addPath='') {
    return path.dirname("C:");
    return path.dirname(electron.remote.app.getPath("exe"))+addPath;
  }
/**
 * 读取数据内所有文件内容
 * @param filePaths 
 */
// 读取文件内容和计算 MD5 的函数
export async function readFiles(filePaths: string[]): Promise<Map<string, string>> {
    let result = new Map<string, string>();
    for (const filePath of filePaths) {
        try {
            const stats = await fs.promises.stat(filePath);
            if (stats.isFile()) {
                // 读取文件内容
                const data = await fs.promises.readFile(filePath, 'utf8');
                const md5Hash = await calculateMD5(filePath);
                result.set(md5Hash, data); // 或者你想将文件内容和 MD5 哈希值一一对应
                // MapData.getInstance().setDeftData(md5Hash);
            }
        } catch (error) {
            console.error(`Failed to read file ${filePath}:`, error);
        }
    }
    return result; // 确保函数总是返回一个字符串
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
