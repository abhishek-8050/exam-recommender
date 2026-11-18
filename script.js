document.addEventListener("DOMContentLoaded", function () {
    setupNavToggle();
    setupAuthTabs();
    setupFormValidation();
    setupExamFilter();
});

/* ---------- Mobile menu ---------- */
function setupNavToggle() {
    var button = document.getElementById("navToggle");
    var links = document.getElementById("navLinks");
    if (!button || !links) return;

    button.addEventListener("click", function () {
        links.classList.toggle("open");
    });
}

/* ---------- Login / Register tabs ---------- */
function setupAuthTabs() {
    var tabBar = document.getElementById("authTabs");
    if (!tabBar) return;

    var buttons = tabBar.querySelectorAll(".tab-btn");
    var panels = document.querySelectorAll(".tab-panel");

    buttons.forEach(function (button) {
        button.addEventListener("click", function () {
            buttons.forEach(function (b) { b.classList.remove("active"); });
            panels.forEach(function (p) { p.classList.remove("active"); });

            button.classList.add("active");
            document.getElementById(button.dataset.tab).classList.add("active");
        });
    });
}

/* ---------- Form validation ---------- */
function setupFormValidation() {
    var forms = document.querySelectorAll("form[data-validate]");

    forms.forEach(function (form) {
        var fields = form.querySelectorAll("input, select");

        form.addEventListener("submit", function (event) {
            var allValid = true;
            fields.forEach(function (field) {
                if (!validateField(field)) allValid = false;
            });
            if (!allValid) event.preventDefault();
        });

        fields.forEach(function (field) {
            field.addEventListener("blur", function () { validateField(field); });
        });
    });
}

function validateField(field) {
    var value = field.value.trim();
    var message = "";

    if (field.required && value === "") {
        message = "This field is required.";
    } else if (value !== "") {
        if (field.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
            message = "Enter a valid email address.";
        } else if (field.minLength > 0 && value.length < field.minLength) {
            message = "Enter at least " + field.minLength + " characters.";
        } else if (field.type === "number") {
            var number = parseFloat(value);
            if (field.min !== "" && number < parseFloat(field.min)) {
                message = "Value must be at least " + field.min + ".";
            } else if (field.max !== "" && number > parseFloat(field.max)) {
                message = "Value must be at most " + field.max + ".";
            }
        } else if (field.dataset.match) {
            var other = document.getElementById(field.dataset.match);
            if (other && other.value !== field.value) {
                message = "Passwords do not match.";
            }
        }
    }

    var row = field.closest(".form-row");
    var errorBox = row ? row.querySelector(".error-text") : null;
    if (errorBox) errorBox.textContent = message;
    if (row) row.classList.toggle("has-error", message !== "");

    return message === "";
}

/* ---------- Exam category filter ---------- */
function setupExamFilter() {
    var filterBar = document.getElementById("filterBar");
    if (!filterBar) return;

    var buttons = filterBar.querySelectorAll(".filter-btn");
    var cards = document.querySelectorAll(".exam-card");
    var emptyMessage = document.getElementById("emptyMessage");
    var resultCount = document.getElementById("resultCount");

    function applyFilter(category) {
        var visible = 0;

        buttons.forEach(function (button) {
            button.classList.toggle("active", button.dataset.filter === category);
        });

        cards.forEach(function (card) {
            var show = category === "all" || card.dataset.category === category;
            card.hidden = !show;
            if (show) visible++;
        });

        emptyMessage.hidden = visible !== 0;
        resultCount.textContent = visible + (visible === 1 ? " exam shown" : " exams shown");
    }

    buttons.forEach(function (button) {
        button.addEventListener("click", function () {
            applyFilter(button.dataset.filter);
        });
    });

    // Start with the category chosen on the homepage (if any)
    applyFilter(filterBar.dataset.selected || "all");
}