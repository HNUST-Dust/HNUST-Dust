const courses = window.DUST_COURSES;
const tracks = {all:'全部课程',common:'共同基础',embedded:'嵌入式控制',vision:'视觉与算法',mechanical:'机械与硬件'};
const trackCodes = {common:'FOUNDATION',embedded:'EMBEDDED',vision:'VISION',mechanical:'MECHANICAL'};
const completed = new Set(JSON.parse(localStorage.getItem('dust-course-progress') || '[]'));
let activeTrack = 'all', activePhase = 'all', query = '';
const grid = document.getElementById('course-grid'), dialog = document.getElementById('lesson-dialog');

function save(){localStorage.setItem('dust-course-progress', JSON.stringify([...completed]));updateProgress()}
function updateProgress(){
  const pct = Math.round(completed.size / courses.length * 100);
  document.getElementById('total-progress').textContent = `${pct}%`;
  document.getElementById('total-progress-bar').style.width = `${pct}%`;
  document.getElementById('progress-copy').textContent = completed.size ? `已完成 ${completed.size} / ${courses.length} 节，继续保持节奏。` : '还没有完成课程，今天就开始第一节吧。';
}
function filtered(){return courses.filter(c => (activeTrack==='all'||c.track===activeTrack) && (activePhase==='all'||String(c.phase)===activePhase) && (!query||`${c.title} ${c.summary} ${c.tags.join(' ')}`.toLowerCase().includes(query)))}
function render(){
  const list=filtered(); document.getElementById('view-label').textContent=tracks[activeTrack]; document.getElementById('course-count').textContent=`${list.length} 个学习单元`;
  document.getElementById('empty-state').hidden=!!list.length;
  grid.innerHTML=list.map(c=>`<article class="course-card ${completed.has(c.id)?'done':''}" data-id="${c.id}"><div class="card-top"><span>${trackCodes[c.track]} · PHASE 0${c.phase}</span><button class="complete" aria-label="标记${c.title}为完成">${completed.has(c.id)?'✓':'○'}</button></div><div class="card-number">${String(courses.filter(x=>x.track===c.track).indexOf(c)+1).padStart(2,'0')}</div><h2>${c.title}</h2><p>${c.summary}</p><div class="tags">${c.tags.map(t=>`<span>${t}</span>`).join('')}</div><div class="card-foot"><span>${c.duration}</span><span>${c.level}</span><b>查看课程 →</b></div></article>`).join('');
  grid.querySelectorAll('.course-card').forEach(card=>card.addEventListener('click',e=>{if(!e.target.closest('.complete'))openLesson(card.dataset.id)}));
  grid.querySelectorAll('.complete').forEach(btn=>btn.addEventListener('click',()=>{const id=btn.closest('.course-card').dataset.id;completed.has(id)?completed.delete(id):completed.add(id);save();render();showToast(completed.has(id)?'课程已完成，进度已保存':'已取消完成状态')}));
}
function openLesson(id){
  const c=courses.find(x=>x.id===id); const isDone=completed.has(id);
  document.getElementById('dialog-content').innerHTML=`<div class="dialog-eyebrow">${trackCodes[c.track]} · PHASE 0${c.phase}</div><h2>${c.title}</h2><div class="dialog-meta"><span>课程编号 ${c.id.toUpperCase()}</span><span>预计 ${c.duration}</span><span>难度 ${c.level}</span></div><p class="dialog-summary">${c.summary}</p><section><h3>学习目标</h3><ol>${c.goals.map(x=>`<li>${x}</li>`).join('')}</ol></section><section><h3>实践任务</h3><div class="task-list">${c.tasks.map((x,i)=>`<div><b>${String(i+1).padStart(2,'0')}</b><span>${x}</span></div>`).join('')}</div></section><div class="deliverable"><span>最终交付</span><strong>${c.deliverable}</strong></div><section class="github-submit"><h3>GitHub 作业提交</h3><div class="submit-steps"><span><b>01</b>Fork 官方仓库</span><span><b>02</b>按规范添加作业</span><span><b>03</b>发起 Pull Request</span></div><div class="submit-actions"><a href="https://github.com/HNUST-Dust/HNUST-Dust/fork" target="_blank" rel="noreferrer">Fork 作业仓库 ↗</a><a href="https://github.com/HNUST-Dust/HNUST-Dust/tree/main/training#提交作业" target="_blank" rel="noreferrer">查看提交指南 ↗</a><a href="https://github.com/HNUST-Dust/HNUST-Dust/compare/main..." target="_blank" rel="noreferrer">发起 Pull Request ↗</a></div><code>training/submissions/&lt;GitHub用户名&gt;/${c.id}/</code><small>Pull Request 创建后，GitHub Actions 会自动检查目录、清单和提交内容。</small></section><button class="dialog-complete ${isDone?'done':''}" data-id="${c.id}">${isDone?'✓ 已完成本课程':'标记为已完成 →'}</button>`;
  dialog.showModal();
  dialog.querySelector('.dialog-complete').addEventListener('click',e=>{completed.has(id)?completed.delete(id):completed.add(id);save();dialog.close();render();showToast(completed.has(id)?'课程已完成，进度已保存':'已取消完成状态')});
}
function showToast(message){const t=document.getElementById('toast');t.textContent=message;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),2200)}
document.querySelectorAll('.track').forEach(b=>b.addEventListener('click',()=>{document.querySelector('.track.active').classList.remove('active');b.classList.add('active');activeTrack=b.dataset.track;render()}));
document.querySelectorAll('.phase-tabs button').forEach(b=>b.addEventListener('click',()=>{document.querySelector('.phase-tabs .active').classList.remove('active');b.classList.add('active');activePhase=b.dataset.phase;render()}));
document.getElementById('course-search').addEventListener('input',e=>{query=e.target.value.trim().toLowerCase();render()});
document.querySelector('.dialog-close').addEventListener('click',()=>dialog.close());dialog.addEventListener('click',e=>{if(e.target===dialog)dialog.close()});
document.getElementById('count-all').textContent=courses.length; updateProgress(); render();
