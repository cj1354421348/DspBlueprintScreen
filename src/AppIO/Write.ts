/**
 * 写文件
 * 
 */
import * as fs from 'fs';
import * as path from 'path';
import { getConfigPath } from './Read';
const config: config = getConfigPath() as config;
/**
 *  保存Map类型文件到系统
 * @param fileName 
 * @param content 
 * @returns 
 */
export function createDir(fileName: string, content: Map<any, any>): Promise<string> {
    const mapObject = Object.fromEntries(content);
    const dirPath = config.stagingPath;
    return new Promise((resolve, reject) => {
        fs.mkdir(dirPath, { recursive: true }, (err) => {
            if (err) {
                console.error('创建目录时出错:', err);
                reject(err);
                return;
            }
            // 写入文件
            const filePath = path.join(dirPath, fileName + '.json');
            let contentStr = JSON.stringify(mapObject);
            fs.writeFile(filePath, contentStr, 'utf8', (err) => {
                if (err) {
                    console.error('写入文件时出错:', err);
                    reject(err);
                    return;
                }
                resolve(filePath);
            });
        });
    });
};
/**
 *  保存字符串类型文件到系统    
 * @param fileName 源路径
 * @param content 目标文件路径
 * @returns 
 */
export function copyFile(src: string, dest: string): Promise<void> {
    const destPath = path.join(dest, path.basename(src));
    // 如果目标文件夹不存在，则创建它
    const dirPath = path.dirname(destPath);
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }
    return new Promise((resolve, reject) => {
        fs.copyFile(src, destPath, (err) => {
            if (err) {
                console.error('拷贝文件时出错:', err);
                reject(err);
                return;
            }
            resolve();
        });
    });
}

