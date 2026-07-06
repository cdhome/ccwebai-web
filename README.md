# CCWebAI Web

CCWebAI 官网与运营后台仓库。

当前实现目标：

- 营销型官网首页
- 问题中心与问题提交页
- 安装/使用/地区/问题治理后台
- 插件匿名设备 ID 对应的遥测上报 API
- PostgreSQL + `ankane/pgvector` 数据层与迁移基线

## 技术栈

- 前端：React + Vite + TypeScript + Tailwind CSS
- 后端：Express + TypeScript
- 数据库：PostgreSQL + `pgvector`
- 测试：Vitest + Testing Library + Supertest

## 本地开发

```bash
pnpm install
pnpm run dev
```

前端默认地址：

- `http://localhost:5173`

后端默认地址：

- `http://localhost:3001`

## 环境变量

复制 `.env.example` 到 `.env.local` 后再启动。

关键变量：

- `PUBLIC_SITE_URL`
- `DATABASE_URL`
- `DB_HOST`
- `DB_PORT`
- `DB_NAME`
- `DB_USER`
- `DB_PASSWORD`
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `GOOGLE_REDIRECT_URI`
- `ADMIN_EMAILS`

## Google OAuth 配置

当前 Web 端登录走的是标准 Google OAuth 2.0 Web Application 流程：

- 前端点击 `/login`
- 后端生成 Google 授权地址
- Google 回调到 `GOOGLE_REDIRECT_URI`
- 服务端读取用户邮箱，并结合 `ADMIN_EMAILS` / `users.role` 判断是否允许进入后台

### 1. 在 Google Cloud Console 创建 OAuth 凭据

进入 [Google Cloud Console](https://console.cloud.google.com/) 后，按下面步骤操作：

1. 创建或选择一个 Project
2. 打开 `APIs & Services -> OAuth consent screen`
3. 选择 `External`
4. 填写应用名称、支持邮箱、开发者邮箱
5. 在 `Scopes` 中至少保留默认的：
   - `openid`
   - `email`
   - `profile`
6. 回到 `Credentials`
7. 点击 `Create Credentials -> OAuth client ID`
8. `Application type` 选择 `Web application`

### 2. 配置回调地址

本项目当前本地开发默认回调地址是：

```text
http://localhost:3001/api/auth/google/callback
```

如果正式环境由同域名统一对外提供服务，建议使用：

```text
https://www.ccwebai.com/api/auth/google/callback
```

在 Google OAuth Client 中至少填写：

- `http://localhost:5173`
- `http://localhost:3001`
- `https://www.ccwebai.com`
  - `http://localhost:3001/api/auth/google/callback`
  - `https://www.ccwebai.com/api/auth/google/callback`

如果你还希望把浏览器来源也一并登记，建议同时加入：

- `Authorized JavaScript origins`
  - `http://localhost:5173`
  - `http://localhost:3001`
  - `https://www.ccwebai.com`

说明：

- 本地开发时，前端通常跑在 `5173`，后端跑在 `3001`
- 真正处理 OAuth 回调的是后端，所以最关键的是 `Authorized redirect URIs`
- 如果线上不是 `www.ccwebai.com` 直接承接 API，而是单独后端域名，请把生产回调地址改成真实 API 域名

### 3. 将凭据写入 `.env.local`

Google Console 创建成功后会拿到：

- `Client ID`
- `Client Secret`

将它们写入 `ccwebai-web/.env.local`：

```env
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT_URI=http://localhost:3001/api/auth/google/callback
SESSION_SECRET=replace_with_a_long_random_string
ADMIN_EMAILS=you@example.com,ops@example.com
```

如果你是在正式环境部署，则推荐使用：

```env
GOOGLE_REDIRECT_URI=https://www.ccwebai.com/api/auth/google/callback
```

`SESSION_SECRET` 建议：

- 至少 32 位
- 使用随机字符串
- 不要和其他系统复用

### 4. 测试账号与测试用户

如果你的 OAuth Consent Screen 还处于 Testing 状态：

- 只有被加入 `Test users` 的 Google 账号能登录
- 你自己的超管邮箱必须先加入测试用户列表

如果后续切到 Production：

- 公开用户都可以完成 OAuth 登录
- 但只有在 `ADMIN_EMAILS` 中，或者数据库 `users.role` 为 `admin / super_admin` 的账号，才可以进入 `/admin`

### 5. 登录与超管权限关系

系统里“能登录”和“能进后台”是两层逻辑：

- Google OAuth 成功：表示身份真实
- 超管校验通过：表示允许访问后台

后台权限来源有两种：

- `.env.local` 中配置了 `ADMIN_EMAILS`
- 数据库 `users.role` 被设为 `admin` 或 `super_admin`

因此推荐你第一次这样做：

1. 先把自己的 Google 邮箱写进 `ADMIN_EMAILS`
2. 完成一次 `/login`
3. 登录成功后会自动把账号写入 `users`
4. 后续如果要长期管理，也可以再用命令固化角色：

```bash
pnpm admin:grant -- your@email.com "Your Name" admin
```

### 6. 常见问题

- `redirect_uri_mismatch`
  - Google Console 中配置的回调地址和 `GOOGLE_REDIRECT_URI` 不一致
- 登录后回到 `/login` 但进不了后台
  - 当前邮箱不在 `ADMIN_EMAILS`，且数据库里不是 `admin`
- 本地能登录，线上不能登录
  - 生产回调地址没有加入 `Authorized redirect URIs`
- 点击登录后提示未配置
  - `.env.local` 中 `GOOGLE_CLIENT_ID` 或 `GOOGLE_CLIENT_SECRET` 为空
- OAuth 页面提示应用未验证
  - 说明当前还在测试模式，先把你的账号加入 `Test users`

## 数据库迁移

初始建表脚本：

- [migrations/001\_initial\_schema.sql](file:///Users/apple/Documents/github/cc-ai-bridge/ccwebai-web/migrations/001_initial_schema.sql)
- [migrations/002\_native\_host\_releases.sql](file:///Users/apple/Documents/github/cc-ai-bridge/ccwebai-web/migrations/002_native_host_releases.sql)

该脚本会：

- 启用 `vector` 扩展
- 建立安装、使用事件、问题、投票、日志等表
- 为问题语义相似度预留 `issue_embeddings` 表
- 建立 Native Host Release 管理表

推荐直接使用迁移脚本：

```bash
pnpm db:migrate
```

## 超管初始化

当前后台登录模型分两层：

- 身份来源：Google OAuth 登录
- 权限来源：数据库 `users.role` 或 `ADMIN_EMAILS`

推荐流程：

1. 在 `.env.local` 配置 `GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET / GOOGLE_REDIRECT_URI`
2. 将你的超管邮箱填入 `ADMIN_EMAILS`
3. 访问 `/login`，使用同一个 Google 邮箱登录
4. 登录回调时会自动 upsert 用户，并赋予 `admin` 权限

如果你想直接在数据库里初始化超管，也可以执行：

```bash
pnpm admin:grant -- your@email.com "Your Name" admin
```

如果需要更高权限角色，也支持：

```bash
pnpm admin:grant -- your@email.com "Your Name" super_admin
```

## 已实现页面

- `/` 官网首页
- `/docs` 文档中心
- `/issues` 问题中心
- `/issues/new` 提交问题
- `/issues/:id` 问题详情
- `/login` 登录入口占位
- `/me/issues` 我的问题
- `/admin` 后台总览
- `/admin/installations` 安装分析
- `/admin/usage` 使用分析
- `/admin/regions` 地区分布
- `/admin/issues` 问题治理
- `/admin/releases` Release 管理

## 已实现 API

- `GET /api/health`
- `GET /api/auth/session`
- `GET /api/auth/google-url`
- `GET /api/auth/google/callback`
- `POST /api/auth/logout`
- `POST /api/telemetry/install`
- `POST /api/telemetry/usage`
- `GET /api/issues`
- `GET /api/issues/:id`
- `POST /api/issues`
- `POST /api/issues/:id/vote`
- `GET /api/admin/overview`
- `GET /api/admin/installations`
- `GET /api/admin/usage`
- `GET /api/admin/regions`
- `GET /api/admin/issues`
- `GET /api/releases/native-host/latest`
- `GET /api/releases/admin/native-host`
- `POST /api/releases/admin/native-host`
- `POST /api/releases/admin/native-host/:id/activate`
- `POST /api/uploads/logs`

## 校验命令

```bash
pnpm run check
pnpm run test
pnpm run build
```

## 当前实现说明

- API 现在只面向真实 PostgreSQL，不再提供运行时 mock 回退
- Google OAuth 已接入真实回调，后台页要求超管身份
- 官网统一对外地址由 `PUBLIC_SITE_URL` 管理，默认值为 `https://www.ccwebai.com`
- 插件端“提交问题”后续可直接跳转：

```text
https://www.ccwebai.com/issues/new?deviceId=<device-id>
```

