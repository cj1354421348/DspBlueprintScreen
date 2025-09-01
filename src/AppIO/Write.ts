/**
 * 写文件
 * 
 */
import * as fs from 'fs';
import * as path from 'path';
import { getConfigPath } from './Read';
import { newitemData } from '@/DataType/tiemData';
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
    return new Promise((resolve, reject) => {
        try {
            const destPath = path.join(dest, path.basename(src));

            // 如果目标文件夹不存在，则创建它
            const dirPath = path.dirname(destPath);
            if (!fs.existsSync(dirPath)) {
                fs.mkdirSync(dirPath, { recursive: true });
            }

            let finalDestPath = destPath;
            let counter = 1;
            // 如果目标文件存在，添加编号来避免覆盖
            while (fs.existsSync(finalDestPath)) {
                const parsedPath = path.parse(destPath);
                finalDestPath = path.join(parsedPath.dir, `${parsedPath.name}(${counter})${parsedPath.ext}`);
                counter++;
            }
            // 同步执行文件复制
            fs.copyFileSync(src, finalDestPath);
            resolve(); // 成功时调用 resolve
        } catch (err) {
            console.error('拷贝文件时出错:', err);
            reject(err); // 出错时调用 reject
        }
    });
}
export function itemDataToJson(fileName: string, content: newitemData): Promise<string> {
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
            const dataToSave = {
                longItem: content.longItem,
                typtItem: Object.fromEntries(content.typtItem),
                numItem: Object.fromEntries(content.numItem)
            };
            fs.writeFile(filePath, JSON.stringify(dataToSave, null, 2), 'utf8', (err) => {
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

const electron = window.require('electron');
import { TipError, Tipsessage } from '@/Toop/Tips';

export function writeConfigFile(config: any) {
  const isDev = !electron.remote.app.isPackaged;
  let appRoot: string;

  if (isDev) {
    appRoot = path.join(electron.remote.app.getAppPath(), '..');
  } else {
    appRoot = path.dirname(electron.remote.app.getPath("exe"));
  }

  const configFilePath = path.join(appRoot, 'config.json');

  try {
    fs.writeFileSync(configFilePath, JSON.stringify(config, null, 2));
    Tipsessage('配置已保存');
  } catch (error) {
    console.error(`写入JSON文件出错：${error}`);
    TipError('配置保存失败');
  }
}

