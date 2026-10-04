import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, statSync } from 'node:fs';

const validCourses = new Set(['c01','c02','c03','c04','c05','c06','e01','e02','e03','e04','e05','e06','v01','v02','v03','v04','v05','v06','m01','m02','m03','m04','m05','m06']);
const actor = process.env.PR_AUTHOR || '';
const base = process.env.BASE_SHA;
const head = process.env.HEAD_SHA || 'HEAD';
const errors = [];
if (!actor || !base) { console.error('Missing pull request context.'); process.exit(1); }
const files = execFileSync('git', ['diff', '--name-only', `${base}...${head}`], { encoding: 'utf8' }).trim().split('\n').filter(Boolean);
const submissionFiles = files.filter(file => file.startsWith('training/submissions/'));
if (!submissionFiles.length) errors.push('本 Pull Request 没有包含 training/submissions/ 下的作业文件。');
const roots = new Set(submissionFiles.map(file => file.split('/').slice(0, 4).join('/')));
if (roots.size > 1) errors.push('每个 Pull Request 只能提交一位学员的一节课程。');
for (const root of roots) {
  const [, , username, courseId] = root.split('/');
  if (username.toLowerCase() !== actor.toLowerCase()) errors.push(`提交目录用户名 ${username} 与 PR 作者 ${actor} 不一致。`);
  if (!validCourses.has(courseId)) errors.push(`未知课程编号：${courseId}。`);
  const manifestPath = `${root}/submission.json`, readmePath = `${root}/README.md`;
  if (!existsSync(manifestPath)) errors.push(`${manifestPath} 不存在。`);
  if (!existsSync(readmePath)) errors.push(`${readmePath} 不存在。`);
  if (existsSync(manifestPath)) {
    try {
      const data = JSON.parse(readFileSync(manifestPath, 'utf8'));
      for (const key of ['courseId','student','title','summary','tested']) if (!(key in data)) errors.push(`${manifestPath} 缺少字段：${key}。`);
      if (data.courseId !== courseId) errors.push('submission.json 的 courseId 与目录不一致。');
      if (String(data.student).toLowerCase() !== actor.toLowerCase()) errors.push('submission.json 的 student 与 PR 作者不一致。');
    } catch { errors.push(`${manifestPath} 不是有效 JSON。`); }
  }
}
const forbidden = /(^|\/)(\.env|id_rsa|credentials\.json)$|\.(pem|key|p12|exe|o|a|so)$/i;
for (const file of files) {
  if (forbidden.test(file)) errors.push(`禁止提交敏感文件或构建产物：${file}`);
  if (existsSync(file) && statSync(file).isFile() && statSync(file).size > 10 * 1024 * 1024) errors.push(`文件超过 10 MB：${file}`);
}
if (errors.length) { console.error(`\n作业检查发现 ${errors.length} 个问题：\n`); errors.forEach((error, i) => console.error(`${i + 1}. ${error}`)); process.exit(1); }
console.log(`✓ ${actor} 的作业目录与提交清单检查通过。`);
