---
title: cloudflare workers ip优选
published: 2026-02-17
description: "详细演示cloudflare workers如何优选域名，适合零基础用户一键跟做。"
image: "./cover.jpg"
tags: ["cloudflare","workers","IP优选","建站"]
category: 教程
draft: false
---

# Cloudflare Workers IP 优选完整教程

本教程面向**没有任何技术背景**的小白用户，按照以下步骤操作，即可让你的 Cloudflare Workers 访问速度显著提升。

---

## 📌 准备工作

在开始之前，请确认你已经拥有：

1. **一个 Cloudflare 账号**（官网：https://dash.cloudflare.com）
2. **一个域名**托管在 Cloudflare（例如 `114591.xyz`）
3. **已经创建好了一个 Workers 服务**（例如服务名称叫 `blog`，访问地址为 `blog.114591.xyz`）

> 如果还没有 Workers 服务，请先创建一个：
> - 进入 Cloudflare 控制台 → Workers 和 Pages → 创建应用程序 → 编写 Worker → 部署
> - 部署成功后你会得到一个 `*.workers.dev` 的地址，然后按照官方文档绑定你自己的域名（这一步不在本教程范围，请自行完成）

---

## 🧭 第一步：在 Workers 中添加路由

**目的**：告诉 Cloudflare，访问你域名的请求要交给 Workers 处理。

1. **登录 Cloudflare 控制台**（https://dash.cloudflare.com）
2. 左侧菜单点击 **Workers 和 Pages**
3. 点击你的 **Worker 名称**（例如 `blog`）
4. 切换到 **触发器**（Triggers）选项卡
5. 向下滚动找到 **路由**（Routes）区域，点击 **添加路由**（Add route）
6. 在弹出的窗口中：
   - **区域**（Zone）：选择你绑定的域名（例如 `114591.xyz`）
   - **路由**（Route）：输入你的完整域名 + `/*`  
     ✅ 示例：`blog.114591.xyz/*`
7. 点击 **添加路由**

> 此时，访问 `blog.114591.xyz` 的流量已经可以正确到达你的 Worker。

---

## 🌐 第二步：配置 DNS 解析（CNAME 到优选域名）

**目的**：将你的域名解析到速度最快的 Cloudflare 边缘节点。

1. 返回 Cloudflare 控制台首页，点击你的域名（例如 `114591.xyz`）
2. 左侧菜单点击 **DNS** → **记录**
3. 点击 **添加记录**（Add record）
4. 按照以下内容填写：
   - **类型**（Type）：选择 `CNAME`
   - **名称**（Name）：输入你的 Worker 子域名前缀  
     ✅ 示例：`blog`
   - **目标**（Target）：输入一个**优选域名**  
     ✅ 推荐优选域名（任选其一）：
     - `www.shopify.com`
     - `youxuan.cf.090227.xyz`
     - `www.visa.cn`
     - `mfa.gov.ua`
     - `staticdelivery.nexusmods.com`
   - **TTL**：保持默认（Auto）
   - **代理状态**（Proxy status）：**必须关闭**（仅 DNS）  
     ⚠️ 灰色云朵图标，不是橙色云朵。
5. 点击 **保存**

> 此时 DNS 记录应该类似：
> | 类型  | 名称 | 内容            | 代理状态 |
> | ----- | ---- | --------------- | -------- |
> | CNAME | blog | www.shopify.com | 仅 DNS   |

---

## ⏳ 第三步：等待生效与测试

1. 1. **等待 DNS 解析生效**  
   
      通常 1~5 分钟全球生效，最长可能需要 10 分钟。
   
   2. **测试是否成功**  
   
      打开 [ITDOG](https://www.itdog.cn/tcping/) 输入你的域名
   
      如果<font color="#00B83E">绿色</font>变深，说明解析生效。
   
   3. **访问你的 Worker 测试速度**  
   
      直接在浏览器打开 `https://bk.114591.xyz`  
   
      如果页面能正常打开并且速度很快，说明优选成功。
   
2. 🔄 第四步：更换优选域名（可选）

如果你觉得当前选择的优选域名速度不理想，可以随时更换：

1. 回到 Cloudflare 域名的 **DNS** 记录页面
2. 找到刚才添加的 CNAME 记录，点击 **编辑**
3. 将 **目标** 改为另一个优选域名
4. 点击 **保存**
5. 等待几分钟即可生效

> - 收集的优选域名（仅供参考，部分 IP 可能受干扰，请自行验证）
>
>   #### 常用官方域名
>
>   - shopify.com
>   - time.is
>   - icook.hk
>   - icook.tw
>   - ip.sb
>   - japan.com
>   - malaysia.com
>   - russia.com
>   - singapore.com
>   - skk.moe
>   - www.visa.com.sg
>   - www.visa.com.hk
>   - www.visa.com.tw
>   - www.visa.co.jp
>   - www.visakorea.com
>   - www.gco.gov.qa
>   - www.gov.se
>   - www.gov.ua
>
>   #### 三方维护优选域名
>
>   - cfip.xxxxxxxx.tk（OTC 维护）
>   - bestcf.onecf.eu.org（Mingyu 维护）
>   - cf.zhetengsha.eu.org（小一 维护）
>   - acjp2.cloudflarest.link（KJKKK 维护）
>   - achk.cloudflarest.link（KJKKK 维护）
>   - xn--b6gac.eu.org
>   - yx.887141.xyz
>   - 8.889288.xyz
>   - cfip.1323123.xyz
>   - cf.515188.xyz
>   - cf-st.annoy.eu.org
>   - cf.0sm.com
>   - cf.877771.xyz
>   - cf.345673.xyz
>
> - `

---

## ✅ 完成

至此，你的 Cloudflare Workers 已经完成了 IP 优选配置。  
以后访问 `blog.114591.xyz` 都将通过最快的 Cloudflare 边缘节点进入，延迟大幅降低。

**无需任何额外维护**，只要 DNS 记录不变，优选效果就会一直保持。

---

> **注意**：
> - 如果更换了 Worker 域名（例如改成 `blog2.114591.xyz`），需要**重新添加路由**和**重新添加 CNAME 记录**。
> - 如果域名更换了托管商，需要重新按照本教程操作。
> - 本教程仅适用于 Cloudflare Workers 在**自定义域名**下的加速。
