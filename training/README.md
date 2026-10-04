# DUST Training · 作业提交中心

所有课程作业采用 **Fork + Pull Request** 提交。课程编号可在 [DUST Academy](https://hnust-dust.github.io/HNUST-Dust/course.html) 的课程详情中查看。

## 提交作业

1. 点击仓库右上角 **Fork**，创建一份个人副本。
2. 克隆自己的 Fork，并从 `main` 创建分支：`submission/<课程编号>-<GitHub用户名>`。
3. 复制 [`training/templates/submission`](templates/submission) 到 `training/submissions/<GitHub用户名>/<课程编号>/`。
4. 填写 `submission.json`，将代码、报告和图片放在同一目录。请勿提交密钥、个人隐私或大型二进制文件。
5. 推送分支，向 `HNUST-Dust/HNUST-Dust:main` 发起 Pull Request。
6. 等待 **DUST Training Autograde** 检查通过，然后由教练进行代码评审。

```bash
git clone https://github.com/<GitHub用户名>/HNUST-Dust.git
cd HNUST-Dust
git switch -c submission/c01-<GitHub用户名>
mkdir -p training/submissions/<GitHub用户名>/c01
cp training/templates/submission/* training/submissions/<GitHub用户名>/c01/
```

## 提交目录

```text
training/submissions/<GitHub用户名>/<课程编号>/
├── submission.json       # 必需：提交清单
├── README.md             # 必需：设计说明与运行方法
├── src/                  # 代码或工程文件
└── evidence/             # 可选：日志、截图、测试结果
```

## 自动检查

Pull Request 会自动检查目录与 PR 作者是否匹配、清单字段和课程编号是否有效、README 是否存在，以及是否误提交密钥、构建产物或超大文件。工作流只有仓库内容读取权限，不使用组织密钥。

自动检查通过不代表课程完成，最终结果以教练评审与实机验收为准。

## 更新自己的 Fork

```bash
git remote add upstream https://github.com/HNUST-Dust/HNUST-Dust.git
git fetch upstream
git switch main
git merge --ff-only upstream/main
git push origin main
```
