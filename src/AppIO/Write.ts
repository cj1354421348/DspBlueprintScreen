/**
 * 写文件
 * 
 */
import * as fs from 'fs';
import * as path from 'path';

// 创建目录（如果不存在）
// 创建目录（如果不存在）
export function createDir(fileName: string, content: any): Promise<string> {
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
            content = JSON.stringify(content);
            fs.writeFile(filePath, content, 'utf8', (err) => {
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

