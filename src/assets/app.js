/**
 * Mainichi Clinic Recruit Site - Frontend Logic
 */

document.addEventListener('DOMContentLoaded', () => {
  // Config: Google Form Base URL
  // 後で本番のGoogleフォームのURLに差し替え可能
  const GOOGLE_FORM_BASE_URL = 'https://docs.google.com/forms/d/e/1FAIpQLSdeX5sSjBWhx5WkI4g-T_Psk4ZtG3yR8Fh0Uqy2M3W9S-nTLw/viewform';
  
  // Googleフォーム内の「希望職種」入力欄のエントリーID
  // 例: ?entry.2005620554=看護師
  const JOB_FIELD_ENTRY_ID = 'entry.2005620554'; 

  // Initialize Elements & Functions
  initJobsFetcher();
  initScrollAnimations();
});

/**
 * 1. jobs.jsonから求人情報を取得し、UIを動的に生成する
 */
async function initJobsFetcher() {
  const container = document.getElementById('jobs-container');
  if (!container) return;

  try {
    const response = await fetch('data/jobs.json');
    if (!response.ok) {
      throw new Error(`Failed to fetch jobs data: ${response.status}`);
    }
    const jobs = await response.json();
    renderJobs(jobs, container);
  } catch (error) {
    console.error('Error fetching jobs:', error);
    container.innerHTML = `
      <div style="text-align: center; padding: 40px; color: var(--color-primary-dark); font-weight: 500;">
        求人情報の読み込みに失敗しました。時間をおいて再度お試しください。
      </div>
    `;
  }
}

/**
 * 求人情報のレンダリング
 */
function renderJobs(jobs, container) {
  container.innerHTML = ''; // Clear skeleton

  jobs.forEach(job => {
    const card = document.createElement('div');
    card.className = 'job-card';
    card.id = `job-${job.id}`;

    // 応募フォームへのリンクURLを構築 (職種パラメータを付加)
    const applyUrl = `https://docs.google.com/forms/d/e/1FAIpQLSdeX5sSjBWhx5WkI4g-T_Psk4ZtG3yR8Fh0Uqy2M3W9S-nTLw/viewform?entry.2005620554=${encodeURIComponent(job.title)}`;

    card.innerHTML = `
      <div class="job-card-header" role="button" aria-expanded="false">
        <div class="job-title-group">
          <h3 class="job-title">${job.title}</h3>
          <span class="job-tag">${job.type}</span>
        </div>
        <div class="job-arrow">▼</div>
      </div>
      <div class="job-card-body">
        <div class="job-card-content">
          <div class="job-info-grid">
            <div class="job-info-label">仕事内容</div>
            <div class="job-info-value">${job.description}</div>
          </div>
          <div class="job-info-grid">
            <div class="job-info-label">給与・待遇</div>
            <div class="job-info-value">${job.salary}</div>
          </div>
          <div class="job-info-grid">
            <div class="job-info-label">勤務時間</div>
            <div class="job-info-value">${job.hours}</div>
          </div>
          <div class="job-info-grid">
            <div class="job-info-label">応募要件</div>
            <div class="job-info-value">${job.requirements}</div>
          </div>
          <div class="job-info-grid">
            <div class="job-info-label">福利厚生</div>
            <div class="job-info-value">${job.benefits}</div>
          </div>
          <div class="job-apply-footer">
            <a href="${applyUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-job-apply">
              この職種に応募する
            </a>
          </div>
        </div>
      </div>
    `;

    container.appendChild(card);
  });

  // アコーディオン開閉のイベントリスナーを設定
  setupAccordion();
}

/**
 * アコーディオン開閉ロジック
 */
function setupAccordion() {
  const headers = document.querySelectorAll('.job-card-header');

  headers.forEach(header => {
    header.addEventListener('click', () => {
      const card = header.parentElement;
      const body = card.querySelector('.job-card-body');
      const isActive = card.classList.contains('active');

      // 他のすべてのアコーディオンを閉じる（アコーディオンの排他制御）
      document.querySelectorAll('.job-card').forEach(item => {
        item.classList.remove('active');
        item.querySelector('.job-card-body').style.maxHeight = null;
        item.querySelector('.job-card-header').setAttribute('aria-expanded', 'false');
      });

      // クリックされたカードのトグル
      if (!isActive) {
        card.classList.add('active');
        body.style.maxHeight = body.scrollHeight + 'px';
        header.setAttribute('aria-expanded', 'true');
      } else {
        card.classList.remove('active');
        body.style.maxHeight = null;
        header.setAttribute('aria-expanded', 'false');
      }
    });
  });
}

/**
 * 2. Intersection Observerを使ったスクロール連動フェードインアニメーション
 */
function initScrollAnimations() {
  const options = {
    root: null,
    rootMargin: '0px',
    threshold: 0.15
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target); // 一度フェードインしたら監視解除
      }
    });
  }, options);

  // 監視対象要素を追加
  const animTargets = [
    ...document.querySelectorAll('.number-card'),
    ...document.querySelectorAll('.timeline-item'),
    ...document.querySelectorAll('.philosophy-grid'),
    ...document.querySelectorAll('.jobs-list')
  ];

  animTargets.forEach(target => observer.observe(target));
}
