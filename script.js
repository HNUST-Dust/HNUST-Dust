const nav = document.querySelector('.nav-wrap');
const menuButton = document.querySelector('.menu-button');
const navLinks = document.querySelector('.nav-links');

addEventListener('scroll', () => nav.classList.toggle('scrolled', scrollY > 24), { passive: true });
menuButton.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(open));
});
navLinks.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  navLinks.classList.remove('open');
  menuButton.setAttribute('aria-expanded', 'false');
}));

const observer = new IntersectionObserver(entries => entries.forEach(entry => {
  if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); }
}), { threshold: .12 });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
document.getElementById('year').textContent = new Date().getFullYear();

const escapeHTML = value => String(value ?? '').replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
const formatDate = value => new Intl.DateTimeFormat('zh-CN', { year:'numeric', month:'2-digit', day:'2-digit' }).format(new Date(value)).replaceAll('/', '.');

async function syncRepositories() {
  try {
    const response = await fetch('https://api.github.com/orgs/HNUST-Dust/repos?per_page=100&sort=updated', { headers: { Accept: 'application/vnd.github+json' } });
    if (!response.ok) throw new Error('GitHub API unavailable');
    const all = await response.json();
    const originals = all.filter(repo => !repo.fork && !repo.archived).sort((a,b) => new Date(b.pushed_at) - new Date(a.pushed_at));
    const repos = originals.slice(0, 3);
    document.querySelector('[data-count]').textContent = originals.length;
    document.getElementById('repo-grid').innerHTML = repos.map((repo, index) => `
      <a class="repo ${index === 0 ? 'featured' : ''}" href="${escapeHTML(repo.html_url)}" target="_blank" rel="noreferrer">
        <div class="repo-top"><span>${index === 0 ? 'LATEST / ' : ''}${escapeHTML(repo.language || 'PROJECT')}</span><b>↗</b></div>
        <h3>${escapeHTML(repo.name)}</h3>
        <p>${escapeHTML(repo.description || 'DUST 开源工程项目')}</p>
        <div class="repo-meta"><span>★ ${repo.stargazers_count}</span><span>⑂ ${repo.forks_count}</span><time>${formatDate(repo.pushed_at)}</time></div>
      </a>`).join('');
  } catch (error) {
    console.info('Using the bundled repository snapshot.', error.message);
  }
}
syncRepositories();
