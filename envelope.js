/* =============================================================
   信封拆信组件 · 独立模块
   引入方式：<script src="envelope.js" defer></script>
   依赖（由主页面提供）：
     - playStampSound(freq, dur)  音效函数
     - launchConfetti(x, y)       彩带函数
   ============================================================= */

/* 13 条生日祝福（《诡秘之主》风格） */
const blessings = [
  '愿晨昏之眼爱佑其身，赐予<span class="blessing-highlight">【天空】</span>的自由；',
  '愿磐岩之脊爱佑其身，赐予<span class="blessing-highlight">【大地】</span>的坚韧；',
  '愿满溢之杯爱佑其身，赐予<span class="blessing-highlight">【海洋】</span>的纯真；',
  '愿黄金之茧爱佑其身，赐予<span class="blessing-highlight">【浪漫】</span>的渴求；',
  '愿全世之座爱佑其身，赐予<span class="blessing-highlight">【负世】</span>的意志；',
  '愿裂分之枝爱佑其身，赐予<span class="blessing-highlight">【理性】</span>的智识；',
  '愿翻飞之币爱佑其身，赐予<span class="blessing-highlight">【诡计】</span>的决绝；',
  '愿天谴之矛爱佑其身，赐予<span class="blessing-highlight">【纷争】</span>的赤诚；',
  '愿灰黯之手爱佑其身，赐予<span class="blessing-highlight">【死亡】</span>的慈爱；',
  '愿永夜之帷爱佑其身，赐予<span class="blessing-highlight">【岁月】</span>的奇迹；',
  '愿公正之秤爱佑其身，赐予<span class="blessing-highlight">【律法】</span>的光辉；',
  '愿万径之门爱佑其身，赐予<span class="blessing-highlight">【门径】</span>的理想；',
  '愿无瑕之人爱佑其身，赐予<span class="blessing-highlight">【真我】</span>的回归。',
];

/**
 * 初始化信封拆信组件
 * - 渲染 13 条祝福到信纸
 * - 绑定拆信点击事件
 * - 时间线：火漆炸裂(1s) → 信封飞走 + 信纸滑入
 */
function initBlessings() {
  const letterBody = document.getElementById('letterBody');
  const envelope = document.getElementById('envelope');
  const letter = document.getElementById('letter');
  const openBtn = document.getElementById('openLetterBtn');
  if (!letterBody) return;

  // 13 条祝福 → 信纸段落
  blessings.forEach((text, i) => {
    const line = document.createElement('div');
    line.className = 'letter-line';
    line.style.animationDelay = (i * 0.12) + 's';
    line.innerHTML = text;
    letterBody.appendChild(line);
  });

  // 拆信逻辑
  const doOpen = () => {
    if (envelope.classList.contains('open')) return;
    const rect = envelope.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + 20;

    // 第 1 步：火漆碎片炸裂（40 块 + 1 秒时长 + 闪星）
    for (let i = 0; i < 40; i++) {
      const shard = document.createElement('div');
      shard.className = 'wax-shard';
      shard.style.left = cx + 'px';
      shard.style.top = cy + 'px';
      const size = 6 + Math.random() * 14;
      shard.style.width = shard.style.height = size + 'px';
      document.body.appendChild(shard);
      const angle = Math.random() * Math.PI * 2;
      const dist = 100 + Math.random() * 220;
      const dur = 0.8 + Math.random() * 0.5;
      shard.style.transition = `transform ${dur}s cubic-bezier(0.15,0.55,0.35,1), opacity ${dur}s ease`;
      requestAnimationFrame(() => {
        shard.style.transform = `translate(${Math.cos(angle)*dist}px, ${Math.sin(angle)*dist}px) rotate(${Math.random()*720-360}deg)`;
        shard.style.opacity = '0';
      });
      setTimeout(() => shard.remove(), dur * 1000 + 50);
    }

    // 闪星小点（白+粉）
    for (let i = 0; i < 20; i++) {
      const star = document.createElement('div');
      star.style.cssText = 'position:fixed;border-radius:50%;z-index:999;pointer-events:none;';
      star.style.width = star.style.height = (4 + Math.random() * 6) + 'px';
      star.style.left = cx + 'px';
      star.style.top = cy + 'px';
      star.style.background = Math.random() > 0.5 ? '#fff' : '#F9A8D4';
      star.style.boxShadow = '0 0 10px ' + (Math.random() > 0.5 ? '#fff' : '#F9A8D4');
      document.body.appendChild(star);
      const angle = Math.random() * Math.PI * 2;
      const dist = 50 + Math.random() * 160;
      const dur = 0.7 + Math.random() * 0.5;
      star.style.transition = `transform ${dur}s ease-out, opacity ${dur}s ease`;
      requestAnimationFrame(() => {
        star.style.transform = `translate(${Math.cos(angle)*dist}px, ${Math.sin(angle)*dist}px)`;
        star.style.opacity = '0';
      });
      setTimeout(() => star.remove(), dur * 1000 + 30);
    }

    // 第 2 步：1 秒后炸裂结束 → 翻盖 3D 翻转打开 + 信纸弹出 + 信封同时滑走（消除重叠）
    setTimeout(() => {
      envelope.classList.add('opened');     // 翻盖向后翻 180°
      letter.classList.remove('letter-hidden');
      letter.classList.add('letter-slide-in');
      letter.style.pointerEvents = 'auto';
      envelope.classList.add('opened-fly'); // 信封立刻开始滑走，和翻盖+信纸同时发生！
      if (typeof playStampSound === 'function') playStampSound();
      if (typeof launchConfetti === 'function') launchConfetti(cx, cy);
    }, 1000);

    // 第 3 步：信封飞走动画结束后彻底消失（不再占位）
    setTimeout(() => {
      envelope.classList.add('opened-gone');
    }, 1600);
  };

  openBtn.addEventListener('click', (e) => { e.stopPropagation(); doOpen(); });
  envelope.addEventListener('click', doOpen);
}

// DOM 加载完成后自动初始化
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initBlessings);
} else {
  initBlessings();
}
