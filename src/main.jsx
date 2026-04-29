import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

const systemProfiles = {
  gas: { label: "Gas furnace + AC", short: "Gas", icon: "flame", savings: 0.2 },
  propane: { label: "Propane heat", short: "Propane", icon: "flame", savings: 0.31 },
  oil: { label: "Oil heat", short: "Oil", icon: "drop", savings: 0.35 },
  electric: { label: "Electric resistance", short: "Electric", icon: "plug", savings: 0.43 },
  oldHeatPump: { label: "Older heat pump", short: "Old pump", icon: "fan", savings: 0.15 },
};

const youtubeUrl = "https://www.youtube.com/channel/UCa14nyZEA4jiSYQicx0zdtQ";
const assetUrl = (path) => `${import.meta.env.BASE_URL}${path}`;

const money = (value, clamp = true) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(clamp ? Math.max(0, value) : value);

function Icon({ name }) {
  const paths = {
    home: (
      <>
        <path d="M4 11.5 12 5l8 6.5" />
        <path d="M6.5 10.5V20h11v-9.5" />
        <path d="M10 20v-5h4v5" />
      </>
    ),
    leaf: (
      <>
        <path d="M19.5 4.5C12 4.5 6 8.5 6 15.5c0 2.6 1.7 4.5 4.4 4.5 6.9 0 9.1-8.2 9.1-15.5Z" />
        <path d="M4.5 21c2.2-5.1 6-8.4 11-10.4" />
      </>
    ),
    tag: (
      <>
        <path d="M4 12.2V5h7.2L20 13.8 13.8 20 4 12.2Z" />
        <path d="M8.5 8.5h.01" />
      </>
    ),
    chart: (
      <>
        <path d="M5 19V9" />
        <path d="M12 19V5" />
        <path d="M19 19v-7" />
        <path d="M3 19h18" />
      </>
    ),
    clock: (
      <>
        <path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z" />
        <path d="M12 7v5l3 2" />
      </>
    ),
    bookmark: (
      <>
        <path d="M7 4h10v16l-5-3-5 3V4Z" />
      </>
    ),
    shield: (
      <>
        <path d="M12 3 20 6v6c0 5-3.4 8-8 9-4.6-1-8-4-8-9V6l8-3Z" />
        <path d="m8.5 12 2.1 2.1 4.7-5" />
      </>
    ),
    bolt: (
      <>
        <path d="m13 2-7 12h5l-1 8 8-13h-5l0-7Z" />
      </>
    ),
    flame: (
      <>
        <path d="M12 22c4.2 0 7-2.7 7-6.7 0-2.6-1.2-4.8-3.6-6.7.2 2.3-.7 3.8-2 4.6.2-3.8-1.4-7-4.7-9.7.3 3.8-1.4 5.8-2.7 7.5A7.1 7.1 0 0 0 5 15.4C5 19.3 7.8 22 12 22Z" />
      </>
    ),
    drop: (
      <>
        <path d="M12 3s6 6.7 6 11a6 6 0 0 1-12 0c0-4.3 6-11 6-11Z" />
      </>
    ),
    plug: (
      <>
        <path d="M9 3v6" />
        <path d="M15 3v6" />
        <path d="M7 9h10v4a5 5 0 0 1-10 0V9Z" />
        <path d="M12 18v3" />
      </>
    ),
    fan: (
      <>
        <path d="M12 13.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z" />
        <path d="M12 10.5C10.8 7.1 11.7 4 14 3.4c2-.5 3.6.8 3.7 2.6.1 2.4-2.5 3.8-5.7 4.5Z" />
        <path d="M13.3 12.8c3.5-.7 6.4.8 6.9 3.1.4 2-1 3.5-2.8 3.5-2.4 0-3.5-2.8-4.1-6.6Z" />
        <path d="M10.8 12.6c-2.3 2.8-5.5 3.7-7.1 2-1.4-1.5-.9-3.5.6-4.4 2.1-1.3 4.5.5 6.5 2.4Z" />
      </>
    ),
    play: (
      <>
        <path d="m9 7 7 5-7 5V7Z" />
      </>
    ),
    arrow: (
      <>
        <path d="M5 12h14" />
        <path d="m13 6 6 6-6 6" />
      </>
    ),
    menu: (
      <>
        <path d="M5 7h14" />
        <path d="M5 12h14" />
        <path d="M5 17h14" />
      </>
    ),
    lock: (
      <>
        <path d="M7 11V8a5 5 0 0 1 10 0v3" />
        <path d="M5 11h14v10H5V11Z" />
      </>
    ),
  };

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      {paths[name]}
    </svg>
  );
}

function Slider({ label, value, min, max, step, onChange, display, marks }) {
  const fill = ((value - min) / (max - min)) * 100;

  return (
    <label className="slider-row">
      <span className="slider-top">
        <span>{label}</span>
        <strong>{display ?? money(value)}</strong>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        style={{ "--fill": `${fill}%` }}
        onChange={(event) => onChange(Number(event.target.value))}
      />
      {marks ? (
        <span className="marks">
          {marks.map((mark) => (
            <span key={mark}>{mark}</span>
          ))}
        </span>
      ) : null}
    </label>
  );
}

function YearToggle({ value, onChange }) {
  return (
    <div className="year-toggle" aria-label="Project year">
      <span>Placed in service</span>
      <div role="radiogroup" aria-label="Placed in service year">
        <button
          type="button"
          className={value === "2026" ? "active" : ""}
          role="radio"
          aria-checked={value === "2026"}
          onClick={() => onChange("2026")}
        >
          2026+
        </button>
        <button
          type="button"
          className={value === "2025" ? "active" : ""}
          role="radio"
          aria-checked={value === "2025"}
          onClick={() => onChange("2025")}
        >
          2025
        </button>
      </div>
    </div>
  );
}

function Result({ icon, title, value, note, tone }) {
  return (
    <div className={`result result-${tone}`}>
      <span className="result-icon">
        <Icon name={icon} />
      </span>
      <div>
        <span>{title}</span>
        <strong>{value}</strong>
        <small>{note}</small>
      </div>
    </div>
  );
}

function SystemPicker({ value, onChange }) {
  return (
    <div className="system-picker" role="radiogroup" aria-label="Current heating system">
      <div className="system-picker-head">
        <span>Current heating system</span>
        <strong>{systemProfiles[value].label}</strong>
      </div>
      <div className="system-options">
        {Object.entries(systemProfiles).map(([key, profile]) => (
          <button
            className={`system-chip ${value === key ? "active" : ""}`}
            type="button"
            role="radio"
            aria-checked={value === key}
            key={key}
            onClick={() => onChange(key)}
          >
            <Icon name={profile.icon} />
            <span>{profile.short}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function GuideDialog({ onClose }) {
  return (
    <div className="guide-overlay" role="presentation" onMouseDown={onClose}>
      <section
        className="guide-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="guide-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <button className="guide-close" type="button" aria-label="Close guide" onClick={onClose}>
          ×
        </button>
        <div className="guide-kicker">
          <Icon name="play" />
          <span>Quick guide</span>
        </div>
        <h2 id="guide-title">How to use the Heat Pump Helper calculator</h2>
        <p className="guide-intro">
          This is a planning estimator for homeowners. It helps you compare the quote, rebates,
          rough yearly savings, and payback time before you call a contractor or sign anything.
        </p>

        <div className="guide-grid">
          <article>
            <span>01</span>
            <h3>Enter your home numbers</h3>
            <p>Use your home size, monthly heating and cooling bill, and the heat pump quote.</p>
          </article>
          <article>
            <span>02</span>
            <h3>Add rebates you found</h3>
            <p>Put in state, local, or utility rebates. For 2026+, federal tax credit is not assumed.</p>
          </article>
          <article>
            <span>03</span>
            <h3>Choose your current system</h3>
            <p>Gas, propane, oil, electric, or older heat pump changes the savings estimate.</p>
          </article>
        </div>

        <div className="guide-results">
          <div>
            <strong>Final cost</strong>
            <span>Quote minus rebates and any eligible tax credit.</span>
          </div>
          <div>
            <strong>Yearly savings</strong>
            <span>A rough operating-cost estimate based on your current bill.</span>
          </div>
          <div>
            <strong>Payback time</strong>
            <span>How many years estimated savings may take to cover the final cost.</span>
          </div>
        </div>

        <div className="guide-note">
          <Icon name="shield" />
          <p>
            This is not an official rebate or tax calculator. Always confirm program rules,
            equipment eligibility, and tax details with official sources.
          </p>
        </div>

        <div className="guide-footer">
          <div className="guide-links" aria-label="Official sources">
            <a href="https://www.energy.gov/save/home-upgrades" target="_blank" rel="noreferrer">
              DOE rebates
            </a>
            <a href="https://www.irs.gov/instructions/i5695" target="_blank" rel="noreferrer">
              IRS Form 5695
            </a>
            <a
              href="https://www.energystar.gov/about/federal_tax_credits/air_source_heat_pumps"
              target="_blank"
              rel="noreferrer"
            >
              ENERGY STAR
            </a>
          </div>
          <button className="primary-button guide-action" type="button" onClick={onClose}>
            Start Calculator
            <Icon name="arrow" />
          </button>
        </div>
      </section>
    </div>
  );
}

function App() {
  const [homeSize, setHomeSize] = useState(2000);
  const [monthlyBill, setMonthlyBill] = useState(320);
  const [installQuote, setInstallQuote] = useState(16000);
  const [stateRebate, setStateRebate] = useState(3000);
  const [projectYear, setProjectYear] = useState("2026");
  const [system, setSystem] = useState("propane");
  const [saved, setSaved] = useState(false);
  const [guideOpen, setGuideOpen] = useState(false);

  const results = useMemo(() => {
    const federalTaxCredit = projectYear === "2025" ? Math.min(2000, installQuote * 0.3) : 0;
    const finalCost = Math.max(0, installQuote - stateRebate - federalTaxCredit);
    const sizeFactor = Math.min(1.28, Math.max(0.82, homeSize / 2000));
    const yearlySavings = monthlyBill * 12 * systemProfiles[system].savings * sizeFactor;
    const payback = yearlySavings > 0 ? finalCost / yearlySavings : 0;

    return {
      rebates: stateRebate,
      taxCredit: federalTaxCredit,
      totalIncentives: stateRebate + federalTaxCredit,
      finalCost,
      yearlySavings,
      payback,
    };
  }, [homeSize, installQuote, monthlyBill, projectYear, stateRebate, system]);

  const saveResults = () => {
    const payload = {
      homeSize,
      monthlyBill,
      installQuote,
      stateRebate,
      projectYear,
      system,
      results,
      savedAt: new Date().toISOString(),
    };
    localStorage.setItem("heat-pump-helper-estimate", JSON.stringify(payload));
    setSaved(true);
  };

  useEffect(() => {
    if (!guideOpen) return undefined;

    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        setGuideOpen(false);
      }
    };

    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [guideOpen]);

  return (
    <main className="page">
      <section className="product-frame">
        <nav className="nav">
          <a href="#top" className="brand" aria-label="Heat Pump Helper">
            <span className="brand-icon">
              <Icon name="leaf" />
            </span>
            <strong>
              Heat Pump <em>Helper</em>
            </strong>
          </a>
          <div className="nav-status">
            <span>Free Calculator</span>
          </div>
          <button className="save-button" type="button" onClick={saveResults}>
            <Icon name="bookmark" />
            <span>{saved ? "Saved Locally" : "Save My Results"}</span>
          </button>
        </nav>

        <div className="hero-grid" id="top">
          <div className="hero-visual">
            <img src={assetUrl("heat-pump-home.png")} alt="Home with outdoor heat pump unit" />
            <span className="bubble bubble-ticket">
              <Icon name="tag" />
            </span>
            <span className="bubble bubble-save">
              <Icon name="leaf" />
            </span>
            <span className="bubble bubble-money">
              <Icon name="chart" />
            </span>
          </div>

          <div className="hero-copy">
            <h1>
              Estimate Your <span>Heat Pump Savings</span>
            </h1>
            <p>Check rebates, final cost, yearly savings, and payback before you call a contractor.</p>
            <div className="actions">
              <a href={youtubeUrl} className="primary-button" target="_blank" rel="noreferrer">
                YouTube Channel
                <Icon name="arrow" />
              </a>
              <button className="ghost-button" type="button" onClick={() => setGuideOpen(true)}>
                <Icon name="play" />
                Watch Guide
              </button>
            </div>
          </div>

          <aside className="calculator-card" id="calculator">
            <header>
              <Icon name="home" />
              <h2>Your Home & Costs</h2>
            </header>
            <Slider
              label="Home size"
              value={homeSize}
              min={1000}
              max={4000}
              step={50}
              onChange={setHomeSize}
              display={`${homeSize.toLocaleString()} sq ft`}
              marks={["1,000", "2,000", "3,000", "4,000+"]}
            />
            <Slider
              label="Monthly heating / cooling bill"
              value={monthlyBill}
              min={50}
              max={700}
              step={10}
              onChange={setMonthlyBill}
              display={`${money(monthlyBill)}/mo`}
              marks={["$50", "$200", "$450", "$700+"]}
            />
            <Slider
              label="Heat pump install quote"
              value={installQuote}
              min={8000}
              max={25000}
              step={250}
              onChange={setInstallQuote}
              marks={["$8k", "$12k", "$16k", "$25k+"]}
            />
            <Slider
              label="State / utility rebates found"
              value={stateRebate}
              min={0}
              max={8000}
              step={100}
              onChange={setStateRebate}
              marks={["$0", "$2k", "$5k", "$8k"]}
            />

            <YearToggle value={projectYear} onChange={setProjectYear} />

            <SystemPicker value={system} onChange={setSystem} />

            <div className="incentive-line">
              <span>State / utility rebates</span>
              <strong>- {money(results.rebates)}</strong>
            </div>
            <div className="incentive-line">
              <span>{projectYear === "2025" ? "Federal tax credit estimate" : "Federal tax credit not assumed"}</span>
              <strong>- {money(results.taxCredit)}</strong>
            </div>
            <div className="save-callout">
              <Icon name="leaf" />
              <div>
                <strong>You could reduce upfront cost by {money(results.totalIncentives)}</strong>
                <span>{projectYear === "2025" ? "including estimated 2025 federal credit" : "before any confirmed tax benefit"}</span>
              </div>
            </div>
          </aside>

          <section className="results-strip">
            <Result
              icon="tag"
              title="Estimated Final Cost"
              value={money(results.finalCost)}
              note="After rebates & tax credit"
              tone="teal"
            />
            <Result
              icon="chart"
              title="Yearly Savings"
              value={money(results.yearlySavings)}
              note="Rough operating estimate"
              tone="green"
            />
            <Result
              icon="clock"
              title="Payback Time"
              value={results.payback.toFixed(1)}
              note="Years"
              tone="gold"
            />
            <p>
              <Icon name="shield" />
              Planning estimate only. Confirm rebates, equipment eligibility, and tax rules with official sources.
            </p>
          </section>
        </div>
      </section>

      {guideOpen ? <GuideDialog onClose={() => setGuideOpen(false)} /> : null}
    </main>
  );
}

createRoot(document.getElementById("root")).render(<App />);
