/* =====================================
   لوحة التحكم نسخة روان
   نظام تجريبي محلي
===================================== */


/* كلمة مرور الدخول */

const PASSWORD = "3601153";


/* تحميل الحسابات المحفوظة */

let users =
    JSON.parse(
        localStorage.getItem("boos_users") || "[]"
    );


/* حفظ الحسابات */

function saveUsers() {

    localStorage.setItem(
        "boos_users",
        JSON.stringify(users)
    );
}


/* تسجيل الدخول */

function login() {

    const password =
        document.getElementById(
            "passwordInput"
        ).value;

    const error =
        document.getElementById(
            "loginError"
        );


    if (password !== PASSWORD) {

        error.textContent =
            "كلمة المرور خاطئة";

        return;
    }


    error.textContent = "";


    document
        .getElementById("loginScreen")
        .classList.add("hidden");


    document
        .getElementById("appScreen")
        .classList.remove("hidden");
}


/* إنشاء رقم حساب من 7 أرقام */

function generateAccountNumber() {

    let number;

    do {

        number =
            String(
                Math.floor(
                    1000000 +
                    Math.random() * 9000000
                )
            );

    }

    while (
        users.some(
            user =>
                user.number === number
        )
    );


    return number;
}


/* حماية بسيطة لعرض النص */

function escapeHTML(value) {

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


/* البحث عن حساب */

function getUser() {

    const number =
        document.getElementById(
            "accountNumber"
        ).value.trim();


    return users.find(
        user =>
            user.number === number
    );
}


/* عرض رسالة */

function result(message) {

    document.getElementById(
        "result"
    ).innerHTML =
        `<div class="result">${message}</div>`;
}


/* فتح العمليات */

function openPanel(type) {

    const panel =
        document.getElementById("panel");


    /* فتح حساب */

    if (type === "create") {

        panel.innerHTML = `

            <h2>
                فتح حساب جديد
            </h2>

            <div class="row">

                <div>
                    <label>
                        اسم المستخدم
                    </label>

                    <input
                        id="username"
                        placeholder="اسم المستخدم"
                    >
                </div>


                <div>
                    <label>
                        كلمة المرور
                    </label>

                    <input
                        id="userPassword"
                        type="password"
                        placeholder="كلمة المرور"
                    >
                </div>

            </div>


            <label>
                نوع الحساب
            </label>

            <select id="accountType">

                <option>
                    حساب توفير
                </option>

                <option>
                    حساب جاري
                </option>

                <option>
                    حساب مميز
                </option>

            </select>


            <button
                class="action-button"
                onclick="createAccount()"
            >
                إنشاء الحساب
            </button>


            <div id="result"></div>
        `;

        return;
    }


    /* زيادة الرصيد */

    if (type === "deposit") {

        panel.innerHTML = `

            <h2>
                زيادة رصيد المستخدم
            </h2>

            ${accountAndAmount()}

            <button
                class="action-button"
                onclick="deposit()"
            >
                شحن
            </button>

            <div id="result"></div>
        `;

        return;
    }


    /* حظر الحساب */

    if (type === "block") {

        panel.innerHTML = `

            <h2>
                حظر حساب
            </h2>

            ${accountField()}

            <button
                class="action-button danger-button"
                onclick="changeStatus(false)"
            >
                حظر الحساب
            </button>

            <div id="result"></div>
        `;

        return;
    }


    /* تفعيل الحساب */

    if (type === "activate") {

        panel.innerHTML = `

            <h2>
                تفعيل حساب
            </h2>

            ${accountField()}

            <button
                class="action-button"
                onclick="changeStatus(true)"
            >
                تفعيل الحساب
            </button>

            <div id="result"></div>
        `;

        return;
    }


    /* عرض المستخدمين */

    if (type === "users") {

        panel.innerHTML = `

            <h2>
                المستخدمون
            </h2>

            ${usersTable()}
        `;

        return;
    }


    /* حذف الحساب */

    if (type === "delete") {

        panel.innerHTML = `

            <h2>
                حذف حساب
            </h2>

            ${accountField()}

            <button
                class="action-button danger-button"
                onclick="deleteAccount()"
            >
                حذف الحساب
            </button>

            <div id="result"></div>
        `;

        return;
    }


    /* شحن جماعي */

    if (type === "bulk") {

        panel.innerHTML = `

            <h2>
                شحن جماعي
            </h2>

            <label>
                المبلغ لكل حساب
            </label>

            <input
                id="bulkAmount"
                type="number"
                min="0"
                placeholder="المبلغ"
            >

            <button
                class="action-button"
                onclick="bulkDeposit()"
            >
                شحن الجميع
            </button>

            <div id="result"></div>
        `;

        return;
    }


    /* تصفير الأرصدة */

    if (type === "zero") {

        panel.innerHTML = `

            <h2>
                تصفير الأرصدة
            </h2>

            <div class="notice">

                سيتم جعل رصيد جميع
                الحسابات التجريبية
                يساوي صفر.

            </div>

            <button
                class="action-button danger-button"
                onclick="zeroBalances()"
            >
                تصفير الأرصدة
            </button>

            <div id="result"></div>
        `;

        return;
    }


    /* البحث */

    if (type === "search") {

        panel.innerHTML = `

            <h2>
                بحث حساب
            </h2>

            ${accountField()}

            <button
                class="action-button"
                onclick="searchAccount()"
            >
                بحث
            </button>

            <div id="result"></div>
        `;

        return;
    }


    /* السحب */

    if (type === "withdraw") {

        panel.innerHTML = `

            <h2>
                سحب رصيد
            </h2>

            ${accountAndAmount()}

            <button
                class="action-button"
                onclick="withdraw()"
            >
                سحب
            </button>

            <div id="result"></div>
        `;

        return;
    }

}


/* خانة رقم الحساب */

function accountField() {

    return `

        <label>
            رقم الحساب
        </label>

        <input
            id="accountNumber"
            inputmode="numeric"
            placeholder="رقم الحساب المكون من 7 أرقام"
        >
    `;
}


/* رقم الحساب + المبلغ */

function accountAndAmount() {

    return `

        <div class="row">

            <div>

                <label>
                    رقم الحساب
                </label>

                <input
                    id="accountNumber"
                    inputmode="numeric"
                    placeholder="رقم الحساب"
                >

            </div>


            <div>

                <label>
                    المبلغ
                </label>

                <input
                    id="amount"
                    type="number"
                    min="0"
                    placeholder="المبلغ"
                >

            </div>

        </div>
    `;
}


/* إنشاء حساب */

function createAccount() {

    const username =
        document
            .getElementById("username")
            .value.trim();


    const password =
        document
            .getElementById("userPassword")
            .value;


    const type =
        document
            .getElementById("accountType")
            .value;


    if (!username || !password) {

        result(
            "أدخل اسم المستخدم وكلمة المرور."
        );

        return;
    }


    const user = {

        number:
            generateAccountNumber(),

        username:
            username,

        password:
            password,

        type:
            type,

        status:
            "نشطة",

        balance:
            0
    };


    users.push(user);

    saveUsers();


    result(`

        <b>
            تم إنشاء الحساب بنجاح
        </b>

        <br>

        رقم الحساب:
        ${user.number}

        <br>

        اسم المستخدم:
        ${escapeHTML(user.username)}

        <br>

        كلمة المرور:
        ${escapeHTML(user.password)}

        <br>

        نوع الحساب:
        ${user.type}

        <br>

        الحالة:
        ${user.status}

        <br>

        الرصيد الابتدائي:
        0

    `);
}


/* إضافة رصيد */

function deposit() {

    const user =
        getUser();


    const amount =
        Number(
            document
                .getElementById("amount")
                .value
        );


    if (!user) {

        result(
            "رقم الحساب غير موجود."
        );

        return;
    }


    if (!(amount > 0)) {

        result(
            "أدخل مبلغاً صحيحاً."
        );

        return;
    }


    user.balance += amount;

    saveUsers();


    result(`

        <b>
            تم الشحن بنجاح
        </b>

        <br>

        رقم الحساب:
        ${user.number}

        <br>

        المبلغ المضاف:
        ${amount}

        <br>

        الرصيد الجديد:
        ${user.balance}

    `);
}


/* حظر / تفعيل */

function changeStatus(active) {

    const user =
        getUser();


    if (!user) {

        result(
            "رقم الحساب غير موجود."
        );

        return;
    }


    user.status =
        active
            ? "نشطة"
            : "معطلة";


    saveUsers();


    result(`

        تم
        ${active ? "تفعيل" : "حظر"}
        الحساب بنجاح.

        <br>

        رقم الحساب:
        ${user.number}

    `);
}


/* حذف الحساب */

function deleteAccount() {

    const number =
        document
            .getElementById("accountNumber")
            .value.trim();


    const index =
        users.findIndex(
            user =>
                user.number === number
        );


    if (index === -1) {

        result(
            "رقم الحساب غير موجود."
        );

        return;
    }


    users.splice(index, 1);

    saveUsers();


    result(`

        تم حذف الحساب بنجاح.

        <br>

        رقم الحساب:
        ${number}

    `);
}


/* الشحن الجماعي */

function bulkDeposit() {

    const amount =
        Number(
            document
                .getElementById("bulkAmount")
                .value
        );


    if (!(amount > 0)) {

        result(
            "أدخل مبلغاً صحيحاً."
        );

        return;
    }


    users.forEach(
        user => {
            user.balance += amount;
        }
    );


    saveUsers();


    result(`

        تم شحن
        ${users.length}
        حساب.

        <br>

        المبلغ لكل حساب:
        ${amount}

    `);
}


/* تصفير الأرصدة */

function zeroBalances() {

    users.forEach(
        user => {
            user.balance = 0;
        }
    );


    saveUsers();


    result(
        "تم تصفير أرصدة جميع الحسابات."
    );
}


/* البحث */

function searchAccount() {

    const user =
        getUser();


    if (!user) {

        result(
            "رقم الحساب غير موجود."
        );

        return;
    }


    result(`

        <b>
            بيانات الحساب
        </b>

        <br>

        رقم الحساب:
        ${user.number}

        <br>

        اسم المستخدم:
        ${escapeHTML(user.username)}

        <br>

        كلمة المرور:
        ${escapeHTML(user.password)}

        <br>

        نوع الحساب:
        ${user.type}

        <br>

        الحالة:
        ${user.status}

        <br>

        الرصيد:
        ${user.balance}

    `);
}


/* السحب */

function withdraw() {

    const user =
        getUser();


    const amount =
        Number(
            document
                .getElementById("amount")
                .value
        );


    if (!user) {

        result(
            "رقم الحساب غير موجود."
        );

        return;
    }


    if (!(amount > 0)) {

        result(
            "أدخل مبلغاً صحيحاً."
        );

        return;
    }


    if (amount > user.balance) {

        result(
            "الرصيد غير كافٍ."
        );

        return;
    }


    user.balance -= amount;

    saveUsers();


    result(`

        تم السحب بنجاح.

        <br>

        رقم الحساب:
        ${user.number}

        <br>

        المبلغ المسحوب:
        ${amount}

        <br>

        الرصيد المتبقي:
        ${user.balance}

    `);
}


/* جدول المستخدمين */

function usersTable() {

    if (users.length === 0) {

        return `

            <div class="notice">

                لا توجد حسابات
                حتى الآن.

            </div>
        `;
    }


    return `

        <div class="table-wrapper">

            <table>

                <tr>

                    <th>
                        رقم الحساب
                    </th>

                    <th>
                        الاسم
                    </th>

                    <th>
                        النوع
                    </th>

                    <th>
                        الحالة
                    </th>

                    <th>
                        الرصيد
                    </th>

                </tr>

                ${users.map(user => `

                    <tr>

                        <td>
                            ${user.number}
                        </td>

                        <td>
                            ${escapeHTML(
                                user.username
                            )}
                        </td>

                        <td>
                            ${user.type}
                        </td>

                        <td>
                            ${user.status}
                        </td>

                        <td>
                            ${user.balance}
                        </td>

                    </tr>

                `).join("")}

            </table>

        </div>
    `;
}


/* السماح بالدخول بزر Enter */

document.addEventListener(
    "keydown",
    function(event) {

        if (
            event.key === "Enter" &&
            !document
                .getElementById("loginScreen")
                .classList
                .contains("hidden")
        ) {

            login();
        }

    }
);