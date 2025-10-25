/**
 * OptimizedImage.tsx
 * 优化的图片组件，解决图片加载冲突问题
 * 提供加载状态、错误处理和性能优化
 */

import React from 'react';
import { useImageLoader, ImageLoadStatus } from '../../utils/imageLoader';

/**
 * 图片组件属性接口
 */
export interface OptimizedImageProps {
  /** 图片URL */
  src: string;
  /** 替代文本 */
  alt?: string;
  /** 图片宽度 */
  width?: number | string;
  /** 图片高度 */
  height?: number | string;
  /** CSS类名 */
  className?: string;
  /** 图片样式 */
  style?: React.CSSProperties;
  /** 加载占位符 */
  placeholder?: React.ReactNode;
  /** 错误占位符 */
  errorPlaceholder?: React.ReactNode;
  /** 是否延迟加载 */
  lazy?: boolean;
  /** 加载完成回调 */
  onLoad?: () => void;
  /** 加载失败回调 */
  onError?: (error: Error) => void;
  /** 图片质量优化 */
  quality?: 'low' | 'medium' | 'high' | 'auto';
  /** 是否启用WebP格式（如果支持） */
  webp?: boolean;
}

/**
 * 优化的图片组件
 */
const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt = '',
  width,
  height,
  className = '',
  style = {},
  placeholder,
  errorPlaceholder,
  lazy = true,
  onLoad,
  onError,
  quality = 'auto',
  webp = true
}) => {
  // 使用图片加载器
  const { status, img, error } = useImageLoader(src, {
    onLoad: () => onLoad?.(),
    onError
  });

  // 生成优化的图片URL
  const getOptimizedSrc = (originalSrc: string): string => {
    // 如果是相对路径且不是以/开头，确保路径正确
    if (!originalSrc.startsWith('http') && !originalSrc.startsWith('/')) {
      // 处理esbuild导入的图片路径
      return originalSrc;
    }
    
    // 如果是远程图片，可以添加优化参数
    if (originalSrc.startsWith('http')) {
      const url = new URL(originalSrc);
      
      // 添加质量参数
      if (quality !== 'auto') {
        const qualityMap = { low: '50', medium: '75', high: '90' };
        url.searchParams.set('quality', qualityMap[quality]);
      }
      
      // 添加WebP格式支持
      if (webp && supportsWebP()) {
        url.searchParams.set('format', 'webp');
      }
      
      return url.toString();
    }
    
    return originalSrc;
  };

  // 检查WebP支持
  const supportsWebP = (): boolean => {
    if (typeof window === 'undefined') return false;
    
    const canvas = document.createElement('canvas');
    if (canvas.getContext && canvas.getContext('2d')) {
      return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
    }
    return false;
  };

  // 渲染占位符
  const renderPlaceholder = () => {
    if (placeholder) {
      return placeholder;
    }
    
    return (
      <div 
        className={`animate-pulse bg-slate-200 dark:bg-slate-700 ${className}`}
        style={{ width, height, ...style }}
      >
        <div className="flex items-center justify-center h-full">
          <span className="text-slate-400 text-sm">加载中...</span>
        </div>
      </div>
    );
  };

  // 渲染错误状态
  const renderError = () => {
    if (errorPlaceholder) {
      return errorPlaceholder;
    }
    
    return (
      <div 
        className={`bg-red-50 border border-red-200 rounded-lg flex items-center justify-center ${className}`}
        style={{ width, height, ...style }}
      >
        <div className="text-center p-4">
          <div className="text-red-500 text-lg mb-2">⚠️</div>
          <p className="text-red-700 text-sm">图片加载失败</p>
          <p className="text-red-600 text-xs mt-1">{alt || '图片'}</p>
        </div>
      </div>
    );
  };

  // 根据状态渲染
  switch (status) {
    case ImageLoadStatus.LOADING:
      return renderPlaceholder();
      
    case ImageLoadStatus.ERROR:
      return renderError();
      
    case ImageLoadStatus.LOADED:
      return (
        <img
          src={getOptimizedSrc(src)}
          alt={alt}
          width={width}
          height={height}
          className={className}
          style={style}
          loading={lazy ? 'lazy' : 'eager'}
          decoding="async"
          onLoad={onLoad}
          onError={(e) => {
            const error = new Error(`图片加载失败: ${src}`);
            onError?.(error);
          }}
        />
      );
      
    default:
      return renderPlaceholder();
  }
};

export default OptimizedImage;

/**
 * 图片组件的便捷导出
 */
export const Image = OptimizedImage;

/**
 * 带背景的图片组件
 */
export const BackgroundImage: React.FC<OptimizedImageProps & {
  children?: React.ReactNode;
}> = ({ src, children, style, ...props }) => {
  const { status } = useImageLoader(src);
  
  const backgroundStyle = status === ImageLoadStatus.LOADED 
    ? { 
        ...style, 
        backgroundImage: `url(${src})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }
    : style;
  
  return (
    <div style={backgroundStyle} {...props}>
      {children}
    </div>
  );
};