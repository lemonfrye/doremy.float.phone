import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";

import { ChatPluginBootstrap } from "@/components/chat-plugin-bootstrap";
import { ChatReasoningVisibilityController } from "@/components/chat-reasoning-visibility-controller";
import { CSSImportEnhancer } from "@/components/css-import-enhancer";
import { PWAManifestInjector } from "@/components/pwa-manifest-injector";
import { PWARegistrar } from "@/components/pwa-registrar";
import "../styles/fonts.css";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  // Android 键盘弹出时让浏览器原生压缩布局视口（而非只压缩 visualViewport）。
  // 配合 desktop-shell 的 --phone-screen-height 同步：输入栏天然贴在键盘上方，
  // 点击命中区域由原生布局保证，彻底避免手动抬升带来的视觉/hit-test 错位。
  interactiveWidget: "resizes-content",
};

export const metadata: Metadata = {
  title: "float",
  description: "float",
};

export default function RootLayout({
  children
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <head>
        <link rel="manifest" href="/manifest.webmanifest" crossOrigin="use-credentials" />
        <meta name="theme-color" content="#f8f7f2" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
        <link rel="icon" href="/icon-192.png" type="image/png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-title" content="float" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="mobile-web-app-capable" content="yes" />
        {/* 原生安卓壳（android-shell/MainActivity.kt）的 WebView 环境探测。
            部分设备（如部分华为/鸿蒙 WebView 内核）对 `(hover: none) and (pointer: coarse)`
            媒体特性判断不稳定，导致 phone-shell.css 的移动端铺满样式不生效，表现为
            桌面态的手机外壳卡片居中显示、四周留白不对称（见与用户的排障记录）。
            window.AndroidShell 是壳注入的原生桥对象（唯一在普通移动浏览器里不存在、
            只在这个壳里一定存在的信号），比 UA 字符串嗅探更可靠。必须用同步内联脚本
            在首次样式计算前就挂上标记，否则会有一帧桌面布局闪烁后才跳转为移动布局。 */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{if(window.AndroidShell){document.documentElement.setAttribute('data-shell-env','android')}}catch(e){}`,
          }}
        />
      </head>
      <body>
        <PWAManifestInjector />
        <PWARegistrar />
        <CSSImportEnhancer />
        <ChatPluginBootstrap />
        <ChatReasoningVisibilityController />
        {children}
      </body>
    </html>
  );
}
