
import * as fs from 'fs';
import * as path from 'path';
import { TipError, Tipsessage } from '@/Toop/Tips';

const remote = window.require && window.require('@electron/remote');

interface AppConfig {
  rootPath: string;
  stagingPath: string;
  outputPath: string;
}

class ConfigManager {
  private static instance: ConfigManager;
  private config: AppConfig;
  private appRoot: string;
  private configFilePath: string;

  private constructor() {
    this.appRoot = this.getAppRoot();
    this.configFilePath = path.join(this.appRoot, 'config.json');
    this.config = this.loadConfig();
  }

  public static getInstance(): ConfigManager {
    if (!ConfigManager.instance) {
      ConfigManager.instance = new ConfigManager();
    }
    return ConfigManager.instance;
  }

  private getAppRoot(): string {
    const isDev = !remote.app.isPackaged;
    if (isDev) {
      // 开发模式：使用项目根目录
      return path.join(remote.app.getAppPath(), '..');
    } else {
      // 生产模式：使用用户数据目录，避免 Program Files 权限问题
      return remote.app.getPath('userData');
    }
  }

  private loadConfig(): AppConfig {
    let config: AppConfig;
    try {
      if (!fs.existsSync(this.configFilePath)) {
        // Create a default config if it doesn't exist
        const defaultConfig = {
          rootPath: '',
          stagingPath: '',
          outputPath: '',
        };
        fs.writeFileSync(this.configFilePath, JSON.stringify(defaultConfig, null, 2));
      }
      const fileContent = fs.readFileSync(this.configFilePath, 'utf8');
      config = JSON.parse(fileContent);
    } catch (error) {
      console.error(`读取或创建配置文件出错: ${error}`);
      config = {
        rootPath: '',
        stagingPath: '',
        outputPath: '',
      };
    }

    return this.sanitizePaths(config);
  }
  
  private sanitizePaths(config: AppConfig): AppConfig {
    const fallbacks = {
      rootPath: './aaa',
      stagingPath: './bbb',
      outputPath: './ccc'
    };
    
    const sanitize = (key: keyof AppConfig) => {
      const userPath = config[key];
      const safeFallbackDir = remote.app.getPath('userData');
      let finalPath: string;

      if (userPath) {
        const resolvedPath = path.resolve(this.appRoot, userPath);
        const pathRoot = path.parse(resolvedPath).root;
        
        if (fs.existsSync(pathRoot)) {
          finalPath = resolvedPath;
        } else {
          console.warn(`路径 ${key} ("${userPath}") 无效，将回退到默认用户数据目录。`);
          finalPath = path.join(safeFallbackDir, fallbacks[key]);
        }
      } else {
        finalPath = path.join(safeFallbackDir, fallbacks[key]);
      }
      
      if (!fs.existsSync(finalPath)) {
        try {
          fs.mkdirSync(finalPath, { recursive: true });
        } catch (e) {
          console.error(`为 ${key} 创建目录 ${finalPath} 失败`);
          TipError(`创建目录 ${key} 失败`);
        }
      }
      config[key] = finalPath;
    };

    sanitize('rootPath');
    sanitize('stagingPath');
    sanitize('outputPath');

    return config;
  }
  
  public getConfig(): AppConfig {
    // Always read from the file to ensure the latest version is used
    return this.loadConfig();
  }

  public saveConfig(newConfig: AppConfig): void {
    try {
      fs.writeFileSync(this.configFilePath, JSON.stringify(newConfig, null, 2));
      // After saving, update the internal state by reloading
      this.config = this.loadConfig();
      Tipsessage('配置已保存');
    } catch (error) {
      console.error(`写入配置文件出错: ${error}`);
      TipError('配置保存失败');
    }
  }
}

export const configManager = ConfigManager.getInstance();
