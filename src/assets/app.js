/**
 * Mainichi Clinic Recruit Site - Frontend Logic
 */

// Config: Google Form Base URL (後で本番のGoogleフォームのURLに差し替えます)
const GOOGLE_FORM_BASE_URL = 'https://docs.google.com/forms/d/e/1FAIpQLSd24mI40l5uV4OYr8yG7biOLVY7-T5l0uBcouBNE7BNYysRNQ/viewform';

// Googleフォーム内の「希望職種」入力欄のエントリーID
// 例: entry.26776348 (URLパラメータでは ?entry.26776348=職種名 となります)
const JOB_FIELD_ENTRY_ID = 'entry.531493880';

// Google Apps Script (GAS) API URL (スプレッドシート連携用)
// 後ほどデプロイ完了したGASのウェブアプリURLをここに設定します
const GAS_API_URL = 'https://script.google.com/macros/s/AKfycbxi0sx081penOQxC5zMRWQOdmXn5o8o3ia1IrAvFpFw0Our2dIwCnx91zrUvaZ8ld9y5A/exec';

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Elements & Functions
  initJobsFetcher();
  initScrollAnimations();
});

/**
 * 1. GAS API または jobs.json から求人情報を取得し、UIを動的に生成する
 */
async function initJobsFetcher() {
  const container = document.getElementById('jobs-container');
  if (!container) return;

  let jobs = null;

  // 1. まずGAS APIからの取得を試みる
  if (GAS_API_URL) {
    try {
      const response = await fetch(`${GAS_API_URL}?v=${new Date().getTime()}`);
      if (response.ok) {
        jobs = await response.json();
        console.log('Successfully fetched job data from GAS API.');
      } else {
        console.warn(`GAS API returned status ${response.status}. Falling back to local JSON.`);
      }
    } catch (error) {
      console.warn('Failed to fetch from GAS API. Falling back to local JSON:', error);
    }
  }

  // 2. GAS APIが未設定、または取得失敗した場合はローカルの jobs.json を読み込む (フォールバック)
  if (!jobs) {
    try {
      const response = await fetch(`data/jobs.json?v=${new Date().getTime()}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch local jobs data: ${response.status}`);
      }
      jobs = await response.json();
      console.log('Successfully fetched job data from local JSON.');
    } catch (error) {
      console.error('Error fetching local jobs:', error);
      container.innerHTML = `
        <div style="text-align: center; padding: 40px; color: var(--color-primary-dark); font-weight: 500;">
          求人情報の読み込みに失敗しました。時間をおいて再度お試しください。
        </div>
      `;
      return;
    }
  }

  renderJobs(jobs, container);
}

/**
 * 求人情報のレンダリング
 */
function renderJobs(jobs, container) {
  container.innerHTML = ''; // Clear skeleton

  jobs.forEach(job => {
    const card = document.createElement('div');
    const isFeatured = job.featured === true;
    card.className = isFeatured ? 'job-card featured active' : 'job-card';
    card.id = `job-${job.id}`;

    // 応募フォームへのリンクURLを構築 (職種パラメータを付加)
    const prefillVal = job.form_title || job.title;
    const applyUrl = `${GOOGLE_FORM_BASE_URL}?${JOB_FIELD_ENTRY_ID}=${encodeURIComponent(prefillVal)}`;

    // バッジのHTML
    const badgeHtml = job.badge ? `<span class="job-badge">${job.badge}</span>` : '';

    card.innerHTML = `
      <div class="job-card-header" role="button" aria-expanded="${isFeatured ? 'true' : 'false'}">
        <div class="job-title-group">
          <h3 class="job-title">${job.title}</h3>
          <span class="job-tag">${job.type}</span>
          ${badgeHtml}
        </div>
        <div class="job-arrow">▼</div>
      </div>
      <div class="job-card-body" ${isFeatured ? 'style="max-height: none;"' : ''}>
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

  // DOMが追加された後、アクティブなカードの高さを scrollHeight に設定する (初期展開アニメーションのため)
  setTimeout(() => {
    container.querySelectorAll('.job-card.active').forEach(activeCard => {
      const body = activeCard.querySelector('.job-card-body');
      if (body) {
        body.style.maxHeight = body.scrollHeight + 'px';
      }
    });
  }, 100);

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
    ...document.querySelectorAll('.timeline-item'),
    ...document.querySelectorAll('.philosophy-grid'),
    ...document.querySelectorAll('.jobs-list'),
    ...document.querySelectorAll('.facility-card'),
    ...document.querySelectorAll('.message-card'),
    ...document.querySelectorAll('.schedule-item')
  ];

  animTargets.forEach(target => observer.observe(target));
}
