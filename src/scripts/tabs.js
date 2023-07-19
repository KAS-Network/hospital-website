function buildTabs() {
  const btns = document.querySelectorAll(".map-nav__btn");
  const tabs = document.querySelectorAll(".map-tabs__item");
  for (let btn of btns) {
    const target = btn.dataset.target;
    const tab = document.querySelector(`.map-tabs__item[data-path="${target}"]`);
    btn.addEventListener("click", function() {
      if (!tab.classList.contains("map-tabs__item_active")) {
        const activeBtn = document.querySelector(".map-nav__btn_active");
        if (activeBtn) {
          activeBtn.classList.remove("map-nav__btn_active");
        }
        const activeTab = document.querySelector(".map-tabs__item_active");
        if (activeTab) {
          activeTab.classList.remove("map-tabs__item_active");
        }
        btn.classList.add("map-nav__btn_active");
        tab.classList.add("map-tabs__item_active");
      }
    });
  }
}

buildTabs();