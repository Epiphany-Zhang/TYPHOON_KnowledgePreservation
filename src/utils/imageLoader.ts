/**
 * imageLoader.ts
 * 图片加载优化工具，解决图片加载冲突、资源竞争和跨域问题
 * 提供统一的图片加载管理机制，确保图片正常加载且避免重复请求
 */

import React from 'react';

/**
 * 图片加载状态枚举
 */
export enum ImageLoadStatus {
  PENDING = 'pending',
  LOADING = 'loading',
  LOADED = 'loaded',
  ERROR = 'error'
}

/**
 * 图片加载配置接口
 */
export interface ImageLoadConfig {
  /** 图片URL */
  src: string;
  /** 替代文本 */
  alt?: string;
  /** 加载超时时间（毫秒） */
  timeout?: number;
  /** 重试次数 */
  retryCount?: number;
  /** 是否启用缓存 */
  cache?: boolean;
  /** 图片加载完成回调 */
  onLoad?: (img: HTMLImageElement) => void;
  /** 图片加载失败回调 */
  onError?: (error: Error) => void;
}

/**
 * 图片加载结果接口
 */
export interface ImageLoadResult {
  status: ImageLoadStatus;
  img?: HTMLImageElement;
  error?: Error;
}

/**
 * 图片加载管理器类
 * 统一管理图片加载，避免资源竞争和重复请求
 */
class ImageLoader {
  private static instance: ImageLoader;
  private loadingMap: Map<string, Promise<ImageLoadResult>> = new Map();
  private cacheMap: Map<string, HTMLImageElement> = new Map();
  private defaultConfig: Partial<ImageLoadConfig> = {
    timeout: 10000,
    retryCount: 3,
    cache: true
  };

  /**
   * 获取单例实例
   */
  public static getInstance(): ImageLoader {
    if (!ImageLoader.instance) {
      ImageLoader.instance = new ImageLoader();
    }
    return ImageLoader.instance;
  }

  /**
   * 设置默认配置
   */
  public setDefaultConfig(config: Partial<ImageLoadConfig>): void {
    this.defaultConfig = { ...this.defaultConfig, ...config };
  }

  /**
   * 加载图片
   */
  public async load(config: ImageLoadConfig): Promise<ImageLoadResult> {
    const finalConfig = { ...this.defaultConfig, ...config };
    const { src, timeout, retryCount, cache, onLoad, onError } = finalConfig;

    // 检查缓存
    if (cache && this.cacheMap.has(src)) {
      const cachedImg = this.cacheMap.get(src)!;
      onLoad?.(cachedImg);
      return { status: ImageLoadStatus.LOADED, img: cachedImg };
    }

    // 检查是否正在加载
    if (this.loadingMap.has(src)) {
      return this.loadingMap.get(src)!;
    }

    // 创建加载任务
    const loadTask = this.createLoadTask(finalConfig);
    this.loadingMap.set(src, loadTask);

    try {
      const result = await loadTask;
      
      // 加载成功，更新缓存
      if (result.status === ImageLoadStatus.LOADED && result.img && cache) {
        this.cacheMap.set(src, result.img);
      }
      
      return result;
    } finally {
      // 清理加载状态
      this.loadingMap.delete(src);
    }
  }

  /**
   * 创建图片加载任务
   */
  private createLoadTask(config: ImageLoadConfig): Promise<ImageLoadResult> {
    return new Promise((resolve) => {
      const { src, timeout = 10000, retryCount = 3, onLoad, onError } = config;
      
      let retries = 0;
      let timeoutId: NodeJS.Timeout;

      const attemptLoad = () => {
        const img = new Image();
        
        // 设置超时
        timeoutId = setTimeout(() => {
          img.onload = null;
          img.onerror = null;
          
          if (retries < retryCount) {
            retries++;
            attemptLoad();
          } else {
            const error = new Error(`图片加载超时: ${src}`);
            onError?.(error);
            resolve({ status: ImageLoadStatus.ERROR, error });
          }
        }, timeout);

        img.onload = () => {
          clearTimeout(timeoutId);
          onLoad?.(img);
          resolve({ status: ImageLoadStatus.LOADED, img });
        };

        img.onerror = (error) => {
          clearTimeout(timeoutId);
          
          if (retries < retryCount) {
            retries++;
            attemptLoad();
          } else {
            const loadError = new Error(`图片加载失败: ${src}`);
            onError?.(loadError);
            resolve({ status: ImageLoadStatus.ERROR, error: loadError });
          }
        };

        // 开始加载
        img.src = src;
        
        // 处理跨域问题
        if (src.startsWith('http')) {
          img.crossOrigin = 'anonymous';
        }
        
        // 处理相对路径问题
        if (!src.startsWith('http') && !src.startsWith('/') && typeof window !== 'undefined') {
          // 确保相对路径正确解析
          const basePath = window.location.origin + window.location.pathname.replace(/\/[^\/]*$/, '/');
          if (!src.startsWith(basePath) && !src.startsWith('./')) {
            img.src = './' + src;
          }
        }
      };

      attemptLoad();
    });
  }

  /**
   * 预加载图片
   */
  public preload(src: string): Promise<ImageLoadResult> {
    return this.load({ src, cache: true });
  }

  /**
   * 批量预加载图片
   */
  public async preloadMultiple(sources: string[]): Promise<ImageLoadResult[]> {
    const results = await Promise.allSettled(
      sources.map(src => this.preload(src))
    );
    
    return results.map(result => 
      result.status === 'fulfilled' ? result.value : { status: ImageLoadStatus.ERROR }
    );
  }

  /**
   * 清除缓存
   */
  public clearCache(src?: string): void {
    if (src) {
      this.cacheMap.delete(src);
    } else {
      this.cacheMap.clear();
    }
  }

  /**
   * 获取加载状态
   */
  public getLoadStatus(src: string): ImageLoadStatus | null {
    if (this.loadingMap.has(src)) {
      return ImageLoadStatus.LOADING;
    }
    if (this.cacheMap.has(src)) {
      return ImageLoadStatus.LOADED;
    }
    return null;
  }
}

// 导出单例实例
export const imageLoader = ImageLoader.getInstance();

/**
 * React Hook：使用图片加载器
 */
export const useImageLoader = (src: string, config?: Partial<ImageLoadConfig>) => {
  const [status, setStatus] = React.useState<ImageLoadStatus>(ImageLoadStatus.PENDING);
  const [img, setImg] = React.useState<HTMLImageElement | null>(null);
  const [error, setError] = React.useState<Error | null>(null);

  React.useEffect(() => {
    if (!src) {
      setStatus(ImageLoadStatus.ERROR);
      setError(new Error('图片URL不能为空'));
      return;
    }

    setStatus(ImageLoadStatus.LOADING);
    
    imageLoader.load({
      src,
      ...config,
      onLoad: (loadedImg) => {
        setImg(loadedImg);
        setStatus(ImageLoadStatus.LOADED);
        config?.onLoad?.(loadedImg);
      },
      onError: (loadError) => {
        setError(loadError);
        setStatus(ImageLoadStatus.ERROR);
        config?.onError?.(loadError);
      }
    });
  }, [src]);

  return { status, img, error };
};

export default ImageLoader;