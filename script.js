const PASS="3601153",KEY="boos_demo_users";let users=load();
const login=document.getElementById("login"),app=document.getElementById("app"),content=document.getElementById("content"),form=document.getElementById("loginForm"),pass=document.getElementById("password"),err=document.getElementById("loginError"),side=document.querySelector(".sidebar");
function load(){try{const x=JSON.parse(localStorage.getItem(KEY)||"[]");return Array.isArray(x)?x:[]}catch{return[]}}
function save(){localStorage.setItem(KEY,JSON.stringify(users))}
function esc(v){return String(v).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]))}
function fmt(v){return Number(v||0).toLocaleString("ar")}
function num(){let n;do{n=String(Math.floor(1e6+Math.random()*9e6))}while(users.some(u=>u.number===n));return n}
function find(){const x=document.getElementById("num");return x?users.find(u=>u.number===x.value.trim()):null}
function activeNav(a){document.querySelectorAll(".nav-item").forEach(x=>x.classList.toggle("active",x.dataset.action===a))}
function closeMenu(){side.classList.remove("open")}
function field(l,id,type="text",ph="",extra=""){return `<div class="field"><label for="${id}">${l}</label><input id="${id}" type="${type}" placeholder="${ph}" ${extra}></div>`}
function out(msg,error=false){const x=document.getElementById("out");if(x)x.innerHTML=`<div class="result ${error?"error-result":""}">${msg}</div>`}

function home(){
 activeNav("home");
 const balance=users.reduce((s,u)=>s+Number(u.balance||0),0),active=users.filter(u=>u.status==="نشطة").length,disabled=users.filter(u=>u.status==="معطلة").length;
 content.innerHTML=`<div class="page-head"><div><h2>الرئيسية</h2><p>ملخص سريع لحالة الحسابات والعمليات.</p></div></div>
 <div class="stats"><div class="stat-card"><div class="stat-label">إجمالي الحسابات</div><div class="stat-value">${fmt(users.length)}</div><div class="stat-note">جميع الحسابات</div></div>
 <div class="stat-card"><div class="stat-label">الحسابات النشطة</div><div class="stat-value">${fmt(active)}</div><div class="stat-note">${fmt(disabled)} حساب معطل</div></div>
 <div class="stat-card"><div class="stat-label">إجمالي الأرصدة</div><div class="stat-value">${fmt(balance)}</div><div class="stat-note">الرصيد الإجمالي</div></div></div>
 <div class="dashboard-panel"><h3>العمليات السريعة</h3><p>اختر العملية التي تريد تنفيذها.</p><div class="quick-actions">
 <button class="quick-btn" data-go="create">فتح حساب جديد</button><button class="quick-btn" data-go="deposit">زيادة رصيد</button><button class="quick-btn" data-go="users">عرض المستخدمين</button><button class="quick-btn" data-go="search">بحث حساب</button></div></div>`;
 content.querySelectorAll("[data-go]").forEach(b=>b.onclick=()=>show(b.dataset.go))
}

function usersTable(){if(!users.length)return `<div class="empty">لا توجد حسابات حتى الآن.</div>`;return `<div class="table-wrap"><table><thead><tr><th>رقم الحساب</th><th>اسم المستخدم</th><th>نوع الحساب</th><th>الحالة</th><th>الرصيد</th></tr></thead><tbody>${users.map(u=>`<tr><td><strong>${esc(u.number)}</strong></td><td>${esc(u.name)}</td><td>${esc(u.kind)}</td><td><span class="status ${u.status==="نشطة"?"active":"disabled"}">${u.status}</span></td><td>${fmt(u.balance)}</td></tr>`).join("")}</tbody></table></div>`}

function show(t){
 closeMenu();activeNav(t);if(t==="home")return home();
 const V={
 create:`<div class="panel"><h2 class="panel-title">فتح حساب جديد</h2><p class="panel-desc">إنشاء حساب وتوليد رقم تلقائي.</p><div class="form-grid">${field("اسم المستخدم","u","text","اسم المستخدم")}${field("كلمة المرور","pw","password","كلمة المرور")}<div class="field full"><label for="kind">نوع الحساب</label><select id="kind"><option>حساب توفير</option><option>حساب جاري</option><option>حساب مميز</option></select></div></div><div class="action-row"><button class="btn primary" id="createBtn">إنشاء الحساب</button></div><div id="out"></div></div>`,
 deposit:`<div class="panel"><h2 class="panel-title">زيادة رصيد المستخدم</h2><p class="panel-desc">أدخل رقم الحساب والمبلغ.</p><div class="form-grid">${field("رقم الحساب","num","text","رقم الحساب",'inputmode="numeric"')}${field("المبلغ","amount","number","المبلغ",'min="0" step="any"')}</div><div class="action-row"><button class="btn primary" id="depositBtn">إضافة الرصيد</button></div><div id="out"></div></div>`,
 block:`<div class="panel"><h2 class="panel-title">حظر حساب</h2><p class="panel-desc">تغيير حالة الحساب إلى معطلة.</p>${field("رقم الحساب","num","text","رقم الحساب",'inputmode="numeric"')}<div class="action-row"><button class="btn danger" id="blockBtn">حظر الحساب</button></div><div id="out"></div></div>`,
 activate:`<div class="panel"><h2 class="panel-title">تفعيل حساب</h2><p class="panel-desc">إعادة الحساب إلى الحالة النشطة.</p>${field("رقم الحساب","num","text","رقم الحساب",'inputmode="numeric"')}<div class="action-row"><button class="btn primary" id="activateBtn">تفعيل الحساب</button></div><div id="out"></div></div>`,
 delete:`<div class="panel"><h2 class="panel-title">حذف حساب</h2><p class="panel-desc">الحذف نهائي من بيانات هذا المتصفح.</p>${field("رقم الحساب","num","text","رقم الحساب",'inputmode="numeric"')}<div class="action-row"><button class="btn danger" id="deleteBtn">حذف الحساب</button></div><div id="out"></div></div>`,
 bulk:`<div class="panel"><h2 class="panel-title">شحن جماعي</h2><p class="panel-desc">إضافة مبلغ إلى جميع الحسابات.</p>${field("المبلغ لكل حساب","amount","number","المبلغ",'min="0" step="any"')}<div class="action-row"><button class="btn primary" id="bulkBtn">شحن الجميع</button></div><div id="out"></div></div>`,
 zero:`<div class="panel"><h2 class="panel-title">تصفير الأرصدة</h2><p class="panel-desc">جعل رصيد جميع الحسابات يساوي صفراً.</p><div class="notice">هذه العملية تعدّل البيانات المحفوظة في هذا المتصفح.</div><div class="action-row"><button class="btn danger" id="zeroBtn">تصفير جميع الأرصدة</button></div><div id="out"></div></div>`,
 search:`<div class="panel"><h2 class="panel-title">بحث حساب</h2><p class="panel-desc">عرض تفاصيل حساب باستخدام رقم الحساب.</p>${field("رقم الحساب","num","text","رقم الحساب",'inputmode="numeric"')}<div class="action-row"><button class="btn primary" id="searchBtn">بحث</button></div><div id="out"></div></div>`,
 withdraw:`<div class="panel"><h2 class="panel-title">سحب رصيد</h2><p class="panel-desc">سحب مبلغ محدد من رصيد الحساب.</p><div class="form-grid">${field("رقم الحساب","num","text","رقم الحساب",'inputmode="numeric"')}${field("المبلغ","amount","number","المبلغ",'min="0" step="any"')}</div><div class="action-row"><button class="btn primary" id="withdrawBtn">تنفيذ السحب</button></div><div id="out"></div></div>`,
 users:`<div class="panel"><div class="toolbar"><div><div class="toolbar-title">المستخدمون</div><div class="panel-desc">جميع الحسابات المسجلة حالياً.</div></div><div class="notice">عدد الحسابات: ${fmt(users.length)}</div></div>${usersTable()}</div>`
 };
 content.innerHTML=V[t]||V.home;bind(t)
}
function bind(t){
 if(t==="create")document.getElementById("createBtn").onclick=createUser;
 if(t==="deposit")document.getElementById("depositBtn").onclick=deposit;
 if(t==="block")document.getElementById("blockBtn").onclick=()=>status(false);
 if(t==="activate")document.getElementById("activateBtn").onclick=()=>status(true);
 if(t==="delete")document.getElementById("deleteBtn").onclick=del;
 if(t==="bulk")document.getElementById("bulkBtn").onclick=bulk;
 if(t==="zero")document.getElementById("zeroBtn").onclick=zero;
 if(t==="search")document.getElementById("searchBtn").onclick=search;
 if(t==="withdraw")document.getElementById("withdrawBtn").onclick=withdraw
}
function createUser(){const name=document.getElementById("u").value.trim(),pw=document.getElementById("pw").value,kind=document.getElementById("kind").value;if(!name||!pw)return out("أدخل اسم المستخدم وكلمة المرور.",true);const u={number:num(),name,pw,kind,status:"نشطة",balance:0};users.push(u);save();out(`<strong>تم إنشاء الحساب بنجاح</strong><br>رقم الحساب: <span class="account-number">${u.number}</span><br>اسم المستخدم: ${esc(u.name)}<br>كلمة المرور: ${esc(u.pw)}<br>النوع: ${esc(u.kind)}<br>الحالة: ${u.status}<br>الرصيد الابتدائي: 0`)}
function deposit(){const u=find(),a=Number(document.getElementById("amount").value);if(!u)return out("رقم الحساب غير موجود.",true);if(!(a>0))return out("أدخل مبلغاً صحيحاً.",true);u.balance=Number(u.balance||0)+a;save();out(`<strong>تمت إضافة الرصيد بنجاح</strong><br>رقم الحساب: ${u.number}<br>المبلغ المضاف: ${fmt(a)}<br>الرصيد الجديد: ${fmt(u.balance)}`)}
function status(active){const u=find();if(!u)return out("رقم الحساب غير موجود.",true);u.status=active?"نشطة":"معطلة";save();out(`<strong>تم ${active?"تفعيل":"حظر"} الحساب بنجاح</strong><br>رقم الحساب: ${u.number}<br>الحالة الحالية: ${u.status}`)}
function del(){const n=document.getElementById("num").value.trim(),i=users.findIndex(u=>u.number===n);if(i<0)return out("رقم الحساب غير موجود.",true);if(!confirm("هل أنت متأكد من حذف الحساب؟"))return;users.splice(i,1);save();out(`<strong>تم حذف الحساب بنجاح</strong><br>رقم الحساب: ${esc(n)}`)}
function bulk(){const a=Number(document.getElementById("amount").value);if(!(a>0))return out("أدخل مبلغاً صحيحاً.",true);if(!users.length)return out("لا توجد حسابات لشحنها.",true);users.forEach(u=>u.balance=Number(u.balance||0)+a);save();out(`<strong>تم تنفيذ الشحن الجماعي</strong><br>عدد الحسابات: ${fmt(users.length)}<br>المبلغ لكل حساب: ${fmt(a)}`)}
function zero(){if(!users.length)return out("لا توجد حسابات لتصفيرها.",true);if(!confirm("هل أنت متأكد من تصفير جميع الأرصدة؟"))return;users.forEach(u=>u.balance=0);save();out("<strong>تم تصفير جميع الأرصدة بنجاح.</strong>")}
function withdraw(){const u=find(),a=Number(document.getElementById("amount").value);if(!u)return out("رقم الحساب غير موجود.",true);if(!(a>0))return out("أدخل مبلغاً صحيحاً.",true);if(a>Number(u.balance||0))return out("الرصيد غير كافٍ.",true);u.balance=Number(u.balance||0)-a;save();out(`<strong>تم السحب بنجاح</strong><br>رقم الحساب: ${u.number}<br>المبلغ المسحوب: ${fmt(a)}<br>الرصيد المتبقي: ${fmt(u.balance)}`)}
function search(){const u=find();if(!u)return out("رقم الحساب غير موجود.",true);out(`<strong>بيانات الحساب</strong><br>رقم الحساب: <span class="account-number">${u.number}</span><br>اسم المستخدم: ${esc(u.name)}<br>كلمة المرور: ${esc(u.pw)}<br>نوع الحساب: ${esc(u.kind)}<br>الحالة: ${u.status}<br>الرصيد: ${fmt(u.balance)}`)}

form.addEventListener("submit",e=>{e.preventDefault();if(pass.value!==PASS){err.textContent="كلمة المرور غير صحيحة";pass.focus();return}err.textContent="";login.classList.add("hidden");app.classList.remove("hidden");home()});
document.getElementById("logoutBtn").onclick=()=>{app.classList.add("hidden");login.classList.remove("hidden");pass.value="";err.textContent="";pass.focus()};
document.getElementById("menuBtn").onclick=()=>side.classList.toggle("open");
document.querySelectorAll(".nav-item").forEach(x=>x.onclick=()=>show(x.dataset.action));
pass.oninput=()=>err.textContent="";
home();
