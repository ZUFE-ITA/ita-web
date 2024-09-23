## Dev

### 开发环境

|        | Version |
| ------ | ------- |
| NodeJS | >=18    |
| pnpm   | >=9     |

### 启动环境

0. 安装依赖

```sh
pnpm i
```

1. 登录 `Cloudflare`

```sh
pnpm wrangler login
```

2. 安装/迁移数据库 (本地)

该命令用于从 `schema.prisma` 生成迁移记录，并写入 `./prisma/migrations`，
因此每次修改完 schema 后都需要执行此命令。

当本地不存在数据库时，会自动创建。

```sh
pnpm db:migrate:local
```

3. 将迁移记录作用于本地数据库

生成迁移记录后，使用该命令将新的迁移记录作用于本地数据库

```sh
pnpm db:apply:local
```

## 权限

ExecEe\*\*： Priority; Event; Challenge; Blog

- Priority
  - [0-9]
- Event
  - Read
  - Write
  - DeleteSelf
  - DeleteOthers
  - Join
- Challenge
  - Read
  - Write
  - DeleteSelf
  - DeleteOthers
- Blog
  - Read
  - Write
  - DeleteSelf
  - DeleteOthers

| 权限         | 值  |
| ------------ | --- |
| Read         | 1   |
| Write        | 2   |
| DeleteSelf   | 4   |
| DeleteOthers | 8   |
| Join         | 16  |
