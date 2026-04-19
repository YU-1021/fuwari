---
title: 绿色便携版 Chrome 浏览器制作教程
published: 2026-02-17
description: "自制绿色便携版 Chrome 浏览器，无需安装，解压即用，适合在不同电脑间携带使用"
image: "./cover.png"
tags: ["chrome", "便携版"]
category: 教程
draft: false
---

## 一、准备环境

制作前需要准备以下工具：

| 工具                           | 用途           |
| ------------------------------ | -------------- |
| Chrome 离线解压包              | 浏览器核心文件 |
| 7-Zip 解压缩软件               | 解压安装包     |
| Chrome Portable 便携版启动程序 | 便携化启动器   |

## 二、获取 Chrome 离线解压包

### 2.1 下载离线安装包

32位（x86）：https://dl.google.com/tag/s/installdataindex/update2/installers/ChromeStandaloneSetup.exe
64位（x64）：https://dl.google.com/tag/s/installdataindex/update2/installers/ChromeStandaloneSetup64.exe

### 2.2 处理离线安装包

如果下载的是**离线安装包**，需要先进行安装，然后：

1. 安装 Chrome
2. 右键桌面快捷方式 → "打开文件所在位置"
3. 提取以下文件到 `Chrome-bin` 文件夹：
   - 版本号文件夹（如 `108.0.5359.125`）
   - `chrome.exe`
   - `chrome.VisualElementsManifest.xml`
   - `chrome_proxy.exe`
4. 将 `Chrome-bin` 文件夹打包成 `chrome.7z`

![提取文件列表](https://pica.zhimg.com/v2-36a6258c37e1fe229b600d9803303a42_1440w.jpg)

## 三、配置 Chrome Portable

### 3.1 下载便携版启动程序

下载 Chrome Portable 便携版启动程序（`.paf.exe` 格式），使用 7-Zip 打开，提取以下三个文件：

- `GoogleChromePortable.exe`（主程序）
- `Other/GoogleChromePortable.ini`（配置文件）
- `help.html`（使用说明文档）

![提取便携版文件](https://picx.zhimg.com/v2-b83e30ad737831c67fbfba3778bf5f5d_1440w.jpg)

> 💡 提示：打开 `help.html` 可查看 `GoogleChromePortable.exe` 的详细使用方法。

### 3.2 组装便携版

1. 创建主文件夹，命名为 `chrome108`（或你想要的名称）

2. 将以下三个文件拷贝到该文件夹：
   - `GoogleChromePortable.exe`
   - `Other`
   - `chrome.7z`

3. 创建 `App` 文件夹，将 `chrome.7z` 解压到 `App` 文件夹内

4. 删除 `chrome.7z` 压缩包（已解压不再需要）

5. 双击运行 `GoogleChromePortable.exe`

首次运行会自动创建 `Data` 文件夹（用于存储用户数据），浏览器随即启动。

![最终目录结构](https://pica.zhimg.com/v2-9cee0125df4dba8186398e71a27f44b0_1440w.jpg)

## 四、完成与分享

便携版制作完成后：

- ✅ 所有数据存储在 `Data` 文件夹中，与系统隔离
- ✅ 可整体复制到 U 盘或其他电脑使用
- ✅ 如需分享，建议先删除 `Data` 文件夹（清除个人数据）后再打包

![Chrome 版本信息](https://pic3.zhimg.com/v2-02bce1b937fcd1354bdc6272ebead030_1440w.jpg)

> ⚠️ 注意：便携版 Chrome 会显示"检查更新时出错"，这是正常现象，因为便携版禁用了自动更新功能。

---

**目录结构示例：**

```
chrome108/
├── App/                          # Chrome 程序文件
│   └── Chrome-bin/
│       ├── [版本号文件夹]/
│       ├── chrome.exe
│       └── ...
├── Data/                         # 用户数据（自动生成）
├── GoogleChromePortable.exe      # 启动程序
└── GoogleChromePortable.ini      # 配置文件
```

现在你已经拥有了一个完整的绿色便携版 Chrome 浏览器！

教程思路来自[制作绿色便携Chrome浏览器 - 知乎](https://zhuanlan.zhihu.com/p/697311696)
