// .md / .txt ファイルのプレビュー表示
(function () {
  const dialog = document.createElement("dialog");
  dialog.className = "preview-dialog";
  dialog.innerHTML =
    '<div class="preview-header">' +
    '<h2></h2>' +
    '<a href="#" download>ダウンロード</a>' +
    '<button type="button" class="preview-close" aria-label="閉じる">×</button>' +
    "</div>" +
    '<div class="preview-body"></div>';
  document.body.appendChild(dialog);

  const title = dialog.querySelector("h2");
  const link = dialog.querySelector(".preview-header a");
  const body = dialog.querySelector(".preview-body");

  dialog.querySelector(".preview-close").addEventListener("click", () => dialog.close());
  // 背景クリックで閉じる
  dialog.addEventListener("click", (e) => {
    if (e.target === dialog) dialog.close();
  });

  document.querySelectorAll("button.preview").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const src = btn.dataset.src;
      title.textContent = btn.dataset.name;
      link.href = src;
      body.textContent = "読み込み中…";
      dialog.showModal();
      try {
        const res = await fetch(src);
        if (!res.ok) throw new Error(res.status);
        const text = await res.text();
        if (src.toLowerCase().endsWith(".md")) {
          body.innerHTML = DOMPurify.sanitize(marked.parse(text));
        } else {
          const pre = document.createElement("pre");
          pre.textContent = text;
          body.replaceChildren(pre);
        }
      } catch (err) {
        body.textContent = "プレビューを読み込めませんでした。";
      }
    });
  });
})();
