const DEV = { name: "Your Name", email: "you@example.com" }; // edit these two lines

document.getElementById("devname").textContent = DEV.name;
document.getElementById("devmail").href =
  "mailto:" +
  DEV.email +
  "?subject=" +
  encodeURIComponent("Professional services website quote");

const SV = [
  {
    n: "Bookkeeping",
    f: "from $150 a month",
    d: "We record and categorize every transaction, reconcile your accounts each month and send a simple report. Best for owners who want accurate numbers without the weekly admin.",
  },
  {
    n: "Tax preparation and planning",
    f: "from $450 a year",
    d: "Annual returns for you and your business, plus planning during the year so there are no nasty surprises. Best for anyone with business income, deductions or multiple income sources.",
  },
  {
    n: "Payroll",
    f: "from $60 a month",
    d: "Pay runs, payroll tax filings and year-end forms handled for you. Best for businesses with their first employees through to teams of 25.",
  },
  {
    n: "Business setup",
    f: "one-time fee",
    d: "Help choosing a structure, registering the business and setting up your books correctly from day one. Best for new founders.",
  },
  {
    n: "Advisory and part-time CFO",
    f: "$150 an hour",
    d: "Cash flow forecasts, pricing advice and budgeting. Best for growing businesses that need a financial partner, not a full-time hire.",
  },
];

const ENT = {
  sole: { n: "Sole proprietor", base: 0, tax: 450 },
  llc: { n: "LLC", base: 25, tax: 700 },
  corp: { n: "Corporation", base: 60, tax: 1300 },
};

const $id = (i) => document.getElementById(i);

const esc = (s) =>
  String(s).replace(
    /[&<>"']/g,
    (c) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      })[c],
  );

const $ = (n) => "$" + Math.round(n).toLocaleString("en-US");

let last = "";

// Services accordion
$id("svc").innerHTML = SV.map(
  (s) =>
    `<details><summary>${s.n}<span>${s.f}</span></summary><p>${s.d}</p></details>`,
).join("");

// Fee estimator
function est() {
  const e = ENT[$id("en").value];
  const L = [];
  const on = (k) => $id("c-" + k).checked;

  $id("s-pr").hidden = !on("pr");
  $id("s-ad").hidden = !on("ad");

  $id("txv").textContent = $id("tx").value;
  $id("emv").textContent = $id("em").value;
  $id("hrv").textContent = $id("hr").value;

  if (on("bk")) {
    L.push([
      "Bookkeeping (" + $id("tx").value + " transactions)",
      90 + $id("tx").value * 0.7,
    ]);
  }
  if (on("pr")) {
    L.push([
      "Payroll (" + $id("em").value + " employees)",
      45 + $id("em").value * 9,
    ]);
  }
  if (on("tx")) {
    L.push(["Tax return, spread monthly", e.tax / 12]);
  }
  if (on("ad")) {
    L.push(["Advisory (" + $id("hr").value + " hrs)", $id("hr").value * 150]);
  }
  if (L.length && e.base) {
    L.push(["Compliance for " + e.n, e.base]);
  }

  const t = L.reduce((s, l) => s + l[1], 0);
  const lo = Math.round((t * 0.9) / 5) * 5;
  const hi = Math.round((t * 1.2) / 5) * 5;

  $id("out").textContent = L.length ? $(lo) + " to " + $(hi) : "Pick a service";

  $id("brk").innerHTML = L.map(
    (l) => `<div class="row"><span>${l[0]}</span><b>${$(l[1])}</b></div>`,
  ).join("");

  last = L.length
    ? `My estimate: ${$(lo)} to ${$(hi)} per month for ${e.n}: ` +
      L.map((l) => l[0]).join("; ") +
      "."
    : "";
}

["en", "tx", "em", "hr", "c-bk", "c-pr", "c-tx", "c-ad"].forEach((i) =>
  $id(i).addEventListener("input", est),
);

$id("use").onclick = () => {
  if (last) $id("ms").value = last;
  $id("book").scrollIntoView();
  $id("ms").focus();
};

// Preferred day options: the next 7 weekdays
(function days() {
  const o = [];
  for (let k = 1; o.length < 7; k++) {
    const d = new Date();
    d.setDate(d.getDate() + k);
    if (d.getDay() % 6) {
      o.push(
        d.toLocaleDateString(undefined, {
          weekday: "long",
          day: "numeric",
          month: "long",
        }),
      );
    }
  }
  $id("dy").innerHTML = o.map((x) => `<option>${x}</option>`).join("");
})();

// Booking form
$id("bf").onsubmit = (e) => {
  e.preventDefault();

  if ($id("ms").value.trim().length < 5) {
    $id("err").textContent =
      "Please add a line about what you need help with, so we can prepare.";
    $id("ms").focus();
    return;
  }

  $id("done").innerHTML =
    `<div class="ok" role="status">Thank you, ${esc($id("nm").value)}. ` +
    `We’ll email you at ${esc($id("em2").value)} to confirm your call on ` +
    `${$id("dy").value} (${$id("tm").value.split(" (")[0].toLowerCase()}). ` +
    `(Demo: no message was sent.)</div>`;

  $id("bf").hidden = true;
  $id("done").scrollIntoView();
};

$id("ms").oninput = () => {
  $id("err").textContent = "";
};

est();