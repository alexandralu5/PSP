(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin===`use-credentials`?t.credentials=`include`:e.crossOrigin===`anonymous`?t.credentials=`omit`:t.credentials=`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var e=class{constructor(e){this.parent=e}getHTML(e){return`
                <div class="col">
                    <div class="card equipment-card h-100" data-id="${e.id}" style="cursor: pointer;">
                        <img src="${e.src}" class="card-img-top" alt="${e.title}" style="height: 200px; object-fit: cover;">
                        <div class="card-body">
                            <h5 class="card-title">${e.title}</h5>
                            <p class="card-text text-muted">${e.type||`Тип оборудования`}</p>
                            <button class="btn btn-primary w-100" id="click-card-${e.id}" data-id="${e.id}">
                                Подробнее
                            </button>
                        </div>
                    </div>
                </div>
            `}addListeners(e,t){let n=document.getElementById(`click-card-${e.id}`);n&&n.addEventListener(`click`,e=>{e.stopPropagation(),t(e)});let r=document.querySelector(`.equipment-card[data-id="${e.id}"]`);r&&r.addEventListener(`click`,t=>{if(t.target.tagName!==`BUTTON`&&!t.target.closest(`button`)){let t=document.getElementById(`click-card-${e.id}`);t&&t.click()}})}render(e,t){let n=this.getHTML(e);this.parent.insertAdjacentHTML(`beforeend`,n),this.addListeners(e,t)}},t=class{constructor(e){this.parent=e}getHTML(e){return`
                <div class="card mb-4 mt-4" style="width: 100%;">
                    <div class="row g-0">
                        <div class="col-md-5">
                            <img src="${e.src}" class="img-fluid rounded-start" alt="${e.title}" style="height: 400px; width: 100%; object-fit: cover;">
                        </div>
                        <div class="col-md-7">
                            <div class="card-body">
                                <h2 class="card-title">${e.title}</h2>
                                <p class="card-text">
                                    <strong>Тип:</strong> ${e.type}<br>
                                    <strong>Мощность:</strong> ${e.magnification||e.speed||e.temperature}<br>
                                    <strong>Вместительность:</strong> ${e.resolution||e.capacity||e.accuracy}<br>
                                    <strong>Описание:</strong> ${e.text}
                                </p>
                                <div class="mt-4">
                                    <h5>Характеристики:</h5>
                                    <ul>
                                        <li>Сертифицированное оборудование</li>
                                        <li>Гарантийное обслуживание</li>
                                        <li>Калибровка включена</li>
                                    </ul>
                                </div>
                                <button class="btn btn-success btn-lg mt-3" id="order-button" data-id="${e.id}">
                                    Заказать оборудование
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            `}showNotification(e,t=`success`){let n=document.querySelector(`.notification-container`);n||(n=document.createElement(`div`),n.className=`notification-container`,n.style.position=`fixed`,n.style.bottom=`20px`,n.style.right=`20px`,n.style.zIndex=`9999`,document.body.appendChild(n));let r=document.createElement(`div`);r.className=`alert alert-${t} alert-dismissible fade show`,r.style.marginTop=`10px`,r.style.minWidth=`300px`,r.style.animation=`slideInRight 0.3s ease`,r.style.backgroundColor=`#2e7d64`,r.style.color=`white`,r.style.border=`none`,r.style.borderLeft=`4px solid #1a5c48`,r.innerHTML=`
            <strong>✓</strong> ${e}
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="alert" aria-label="Close"></button>
        `,n.appendChild(r),setTimeout(()=>{r.classList.remove(`show`),setTimeout(()=>{r.parentNode&&r.remove()},150)},5e3);let i=r.querySelector(`.btn-close`);i&&i.addEventListener(`click`,()=>{r.remove()})}addListeners(e){let t=document.getElementById(`order-button`);t&&t.addEventListener(`click`,()=>{this.showNotification(`Спасибо за интерес к ${e.title}! Наш менеджер свяжется с вами в ближайшее время для оформления заказа.`,`success`)})}render(e){let t=this.getHTML(e);this.parent.insertAdjacentHTML(`beforeend`,t),this.addListeners(e)}},n=class{constructor(e){this.parent=e}getHTML(){return`
                <button class="btn btn-secondary mb-4" id="back-button">
                    ← Назад к списку оборудования
                </button>
            `}addListeners(e){document.getElementById(`back-button`).addEventListener(`click`,e)}render(e){let t=this.getHTML();this.parent.insertAdjacentHTML(`beforeend`,t),this.addListeners(e)}},r=new class{get(e,t){let n=new XMLHttpRequest;n.open(`GET`,e),n.send(),n.onreadystatechange=()=>{n.readyState===4&&this._handleResponse(n,t)}}post(e,t,n){let r=new XMLHttpRequest;r.open(`POST`,e),r.setRequestHeader(`Content-Type`,`application/json`),r.send(JSON.stringify(t)),r.onreadystatechange=()=>{r.readyState===4&&this._handleResponse(r,n)}}patch(e,t,n){let r=new XMLHttpRequest;r.open(`PATCH`,e),r.setRequestHeader(`Content-Type`,`application/json`),r.send(JSON.stringify(t)),r.onreadystatechange=()=>{r.readyState===4&&this._handleResponse(r,n)}}delete(e,t){let n=new XMLHttpRequest;n.open(`DELETE`,e),n.send(),n.onreadystatechange=()=>{n.readyState===4&&this._handleResponse(n,t)}}_handleResponse(e,t){try{t(e.responseText?JSON.parse(e.responseText):null,e.status)}catch(n){console.error(`Ошибка парсинга JSON:`,n),t(null,e.status)}}},i=new class{constructor(){this.baseUrl=`http://localhost:3001`}getEquipment(){return`${this.baseUrl}/equipment`}getEquipmentById(e){return`${this.baseUrl}/equipment/${e}`}createEquipment(){return`${this.baseUrl}/equipment`}removeEquipmentById(e){return`${this.baseUrl}/equipment/${e}`}updateEquipmentById(e){return`${this.baseUrl}/equipment/${e}`}},a=class{constructor(e,t){this.parent=e,this.id=t}getData(){r.get(i.getEquipmentById(this.id),e=>{this.renderData(e)})}renderData(e){new t(this.pageRoot).render(e)}get pageRoot(){return document.getElementById(`equipment-page`)}getHTML(){return`
                <div id="equipment-page"></div>
            `}clickBack(){new o(this.parent).render()}render(){this.parent.innerHTML=``;let e=this.getHTML();this.parent.insertAdjacentHTML(`beforeend`,e),new n(this.pageRoot).render(this.clickBack.bind(this)),this.getData()}},o=class{constructor(e){this.parent=e,this.searchTerm=``,this.equipmentData=[]}get pageRoot(){return document.getElementById(`main-page`)}getHTML(){return`
                <div class="container py-4">
                    <h1 class="text-center mb-4">Лабораторное оборудование</h1>
                    <p class="text-center text-muted mb-4">Нажмите "Подробнее", чтобы узнать больше об оборудовании</p>

                    <div class="search-container">
                        <input type="text" class="search-input" id="search-input" placeholder="Поиск оборудования..." autocomplete="off">
                    </div>

                    <div id="main-page" class="row g-4"></div>
                </div>
            `}setupSearch(){let e=document.getElementById(`search-input`);e&&e.addEventListener(`input`,e=>{this.searchTerm=e.target.value.toLowerCase(),this.filterAndRenderCards()})}filterAndRenderCards(){let t=this.equipmentData.filter(e=>e.title.toLowerCase().includes(this.searchTerm)||e.type.toLowerCase().includes(this.searchTerm)||e.text&&e.text.toLowerCase().includes(this.searchTerm)),n=this.pageRoot;if(n){n.innerHTML=``;let r=t.slice(0,3),i=t.slice(3,4);if(r.length>0){let t=document.createElement(`div`);t.className=`row row-cols-1 row-cols-md-3 g-4 mb-4`,n.appendChild(t),r.forEach(n=>{new e(t).render(n,this.clickCard.bind(this))})}if(i.length>0){let t=document.createElement(`div`);t.className=`row`,n.appendChild(t);let r=document.createElement(`div`);r.className=`col-md-4`,t.appendChild(r),i.forEach(t=>{new e(r).render(t,this.clickCard.bind(this))})}}}getData(){r.get(i.getEquipment(),e=>{this.renderData(e)})}renderData(t){t.forEach(t=>{new e(this.pageRoot).render(t,this.clickCard.bind(this))})}clickCard(e){let t=e.target.dataset.id;new a(this.parent,t).render()}render(){this.parent.innerHTML=``;let e=this.getHTML();this.parent.insertAdjacentHTML(`beforeend`,e),this.filterAndRenderCards(),this.setupSearch(),this.getData()}},s=null;function c(e,t={}){let n=document.getElementById(`app`);switch(n.innerHTML=``,e){case`main`:s=new o(n);break;case`equipment`:s=new a(n,t.equipmentId);break}s&&s.render&&s.render()}document.addEventListener(`DOMContentLoaded`,()=>{c(`main`)});