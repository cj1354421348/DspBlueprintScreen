/**
 * 写文件
 * 
 */
import * as fs from 'fs';
import * as path from 'path';

/**
 *  保存Map类型文件到系统
 * @param fileName 
 * @param content 
 * @returns 
 */
export function createDir(fileName: string, content: Map<any, any>): Promise<string> {
    const mapObject = Object.fromEntries(content);
    const dirPath = 'D:\\project\\dsp_blueprint_screen\\test2';
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
}

