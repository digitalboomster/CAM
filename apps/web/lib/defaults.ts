import type { WorkspaceGridData, WorkspaceRow } from "./types";
import { DEFAULT_DD_COLUMNS } from "./types";

type CellInput =
  | { status: "snippet"; text: string; source: string; docRef: string; stepId: number }
  | { status: "no-answer" }
  | { status: "reading" };

function cell(c: CellInput): WorkspaceRow["cells"][0] {
  return c;
}

export function createDefaultDDGridData(): WorkspaceGridData {
  return {
    extractionColumns: [...DEFAULT_DD_COLUMNS],
    rows: [
      // ─── Row 1: FY2025 Annual Report ───────────────────────────────────────
      {
        id: "1",
        documentName: "Dangote Cement FY2025 Annual Report",
        date: "Feb 14, 2026",
        documentType: "Annual Report",
        category: "Financials",
        cells: [
          cell({
            status: "snippet",
            text: "Supply chain disruptions and FX translation losses represent the two largest risk factors. Management acknowledged an NGN1.2bn contingent liability from an ongoing tax dispute.",
            source: "p.38, Risk Review: 'The Group faces ongoing supply chain disruption risk in the North and North-East regions, accounting for 18% of total distribution costs. A tax dispute with the FIRS remains unresolved with a potential liability of NGN1.2bn.'",
            docRef: "Dangote Cement FY2025 Annual Report",
            stepId: 3,
          }),
          cell({
            status: "snippet",
            text: "EV/EBITDA of 11.0× implied at current market price of NGN338.50. Net debt NGN142bn; EBITDA NGN310bn. Free cash flow yield 6.8%.",
            source: "p.12, Financial Highlights: 'EBITDA NGN310bn, net debt NGN142bn, FCF yield 6.8%. Market capitalisation NGN2.9tn at 31 Dec 2025.'",
            docRef: "Dangote Cement FY2025 Annual Report",
            stepId: 4,
          }),
          cell({
            status: "snippet",
            text: "Board targeting 18% EBITDA margin in FY2026 underpinned by energy cost reduction, pan-African expansion (Ethiopia, Congo), and pricing discipline in Nigeria.",
            source: "p.6, Chairman's Statement: 'We are targeting 18% EBITDA margin in FY2026 through energy efficiency programmes, completion of the Ethiopia plant, and disciplined pricing across all markets.'",
            docRef: "Dangote Cement FY2025 Annual Report",
            stepId: 5,
          }),
          cell({
            status: "snippet",
            text: "Revenue NGN1,240bn (+14% YoY). Nigerian volume +9% to 16.8mt. Pan-Africa revenue +22% YoY to NGN186bn. EBITDA margin 25% vs 24.2% prior year.",
            source: "p.11, Group Financial Summary: 'Revenue increased 14% to NGN1,240bn. Nigeria cement volume 16.8mt (+9%). Pan-Africa revenue NGN186bn (+22%). Group EBITDA margin 25%.'",
            docRef: "Dangote Cement FY2025 Annual Report",
            stepId: 4,
          }),
          cell({
            status: "snippet",
            text: "SEC/CAMA compliant. Unqualified audit opinion. IFRS-compliant. No material regulatory breaches in the reporting period.",
            source: "p.52, Auditor's Report: 'In our opinion, the financial statements give a true and fair view in accordance with IFRS. We found no material regulatory breaches.'",
            docRef: "Dangote Cement FY2025 Annual Report",
            stepId: 6,
          }),
          cell({
            status: "snippet",
            text: "Peers trade at 10.3–11.5× EV/EBITDA (BUA Cement 10.6×, Lafarge Africa 10.3×). Dangote commanded 11.0× on scale and pan-African optionality.",
            source: "p.41, Comparative Analysis: 'DANGCEM at 11.0× EV/EBITDA reflects market premium to BUA Cement (10.6×) and Lafarge Africa (10.3×) on scale and international diversification.'",
            docRef: "Dangote Cement FY2025 Annual Report",
            stepId: 7,
          }),
        ],
      },

      // ─── Row 2: Project Alpha CIM ──────────────────────────────────────────
      {
        id: "2",
        documentName: "Project Alpha CIM v3",
        date: "Jan 8, 2026",
        documentType: "CIM",
        category: "Other",
        cells: [
          cell({
            status: "snippet",
            text: "Three material risks: (1) regulatory exposure in 3 of 6 operating markets; (2) customer concentration — top-2 clients = 41% of revenue; (3) management key-person dependency on founder-CEO.",
            source: "Section 8, Risk Factors: 'Top-2 customers represent 41% of revenue. Regulatory risk flagged in Nigeria, Ghana, and Kenya. Founder-CEO holds key relationships across client base.'",
            docRef: "Project Alpha CIM v3",
            stepId: 3,
          }),
          cell({
            status: "snippet",
            text: "Management guidance: NGN28bn EBITDA on NGN115bn revenue for CY2025E. Comparable transactions imply 10.5–13.0× EV/EBITDA. Management asking price implies 12.8×.",
            source: "Section 6, Financial Summary: 'CY2025E Revenue NGN115bn, EBITDA NGN28bn (24.3% margin). Comparable transactions in West Africa industrial sector at 10.5–13.0× EV/EBITDA.'",
            docRef: "Project Alpha CIM v3",
            stepId: 4,
          }),
          cell({
            status: "snippet",
            text: "Management prioritises three themes: (1) product-led international expansion into East Africa; (2) supply chain vertical integration to reduce input cost volatility; (3) digital-first GTM for SME segment.",
            source: "Section 2, Strategy: 'International expansion into East Africa by Q3 2026. Supply chain JV in progress. Digital SME platform targeting 10,000 new clients in 24 months.'",
            docRef: "Project Alpha CIM v3",
            stepId: 5,
          }),
          cell({
            status: "snippet",
            text: "Revenue CAGR 21% over 3 years (2022–2025). Gross margin 42% — above sector median of 36%. Recurring revenue 68% of total, SaaS-like contract structure.",
            source: "Section 5, Financial Performance: 'Revenue CAGR 21% 2022–2025. Gross margin 42% vs sector median 36%. 68% recurring revenue under multi-year contracts.'",
            docRef: "Project Alpha CIM v3",
            stepId: 4,
          }),
          cell({
            status: "snippet",
            text: "Nigeria: CAC registration in order. Ghana: GIPC compliance certificate attached. Kenya: investment licence application pending as at filing date.",
            source: "Section 9, Legal & Regulatory: 'Nigeria CAC in good standing. Ghana GIPC compliant. Kenya investment licence application filed Nov 2025, pending approval.'",
            docRef: "Project Alpha CIM v3",
            stepId: 6,
          }),
          cell({
            status: "snippet",
            text: "No direct Nigerian-listed comparables. CIM references Andela (private, ~14× rev) and Flutterwave (private, ~10× rev) as proxies. Regional PE deal comps at 10.5–13.0× EV/EBITDA.",
            source: "Section 3, Market & Comparables: 'Andela and Flutterwave used as private market benchmarks. Regional PE deals 2021–2025 averaged 11.4× EV/EBITDA for tech-enabled businesses.'",
            docRef: "Project Alpha CIM v3",
            stepId: 7,
          }),
        ],
      },

      // ─── Row 3: Board Strategy Deck Q4 2025 ───────────────────────────────
      {
        id: "3",
        documentName: "Board Strategy Deck Q4 2025",
        date: "Dec 10, 2025",
        documentType: "Board Deck",
        category: "Other",
        cells: [
          cell({
            status: "snippet",
            text: "Board identified three 'red flags': (1) working capital cycle elongating from 62 to 84 days; (2) staff attrition in engineering at 22% (vs 14% target); (3) supply chain bottleneck in Q2–Q3.",
            source: "Slide 14, Risk Dashboard: 'Working capital cycle 84 days (+22 days YoY). Engineering attrition 22%. Supply chain bottleneck cost estimated at NGN820m in H2 2025.'",
            docRef: "Board Strategy Deck Q4 2025",
            stepId: 3,
          }),
          cell({
            status: "snippet",
            text: "FY2026 budget projects NGN135bn revenue (+17%). CapEx NGN8.2bn (6% of revenue) for new production line. Board approved NGN3bn share buyback.",
            source: "Slide 8, FY2026 Budget: 'Revenue budget NGN135bn (+17% vs FY2025 actuals). CapEx NGN8.2bn. Board approved NGN3bn buyback programme commencing Q1 2026.'",
            docRef: "Board Strategy Deck Q4 2025",
            stepId: 4,
          }),
          cell({
            status: "snippet",
            text: "Management committed to three strategic priorities: (1) professionalise the leadership bench (3 C-suite hires planned); (2) expand East Africa via organic entry rather than M&A; (3) improve NPS from 42 to 60 by FY2026.",
            source: "Slide 5, CEO Priorities: 'Three priorities: professionalise leadership, organic East Africa expansion, NPS improvement. NPS currently 42, target 60 by Dec 2026.'",
            docRef: "Board Strategy Deck Q4 2025",
            stepId: 5,
          }),
          cell({
            status: "snippet",
            text: "H2 2025 revenue NGN63.4bn (+12% HoH). Q4 EBITDA margin slipped to 22.1% from 26.3% in Q3, driven by supply chain disruption and one-off staff costs.",
            source: "Slide 7, Financial Results: 'H2 2025 Revenue NGN63.4bn. Q4 EBITDA margin 22.1% vs Q3 26.3%. Margin compression attributed to NGN820m supply chain cost and NGN340m exceptional staff charge.'",
            docRef: "Board Strategy Deck Q4 2025",
            stepId: 4,
          }),
          cell({ status: "no-answer" }),
          cell({ status: "no-answer" }),
        ],
      },

      // ─── Row 4: Management Accounts Dec 2025 ──────────────────────────────
      {
        id: "4",
        documentName: "Management Accounts December 2025",
        date: "Jan 20, 2026",
        documentType: "Management Accounts",
        category: "Financials",
        cells: [
          cell({
            status: "snippet",
            text: "EBITDA below budget by NGN1.1bn in December. Margin variance explained by one-off energy cost spike (+NGN640m) and NGN480m provision for doubtful receivable (single client).",
            source: "p.3, Month Commentary: 'December EBITDA shortfall NGN1.1bn: energy variance NGN640m and new NGN480m provision for Apex Industries receivable (90+ days overdue).'",
            docRef: "Management Accounts December 2025",
            stepId: 3,
          }),
          cell({
            status: "snippet",
            text: "LTM EBITDA to December 2025: NGN28.4bn. Net debt NGN18.2bn. Leverage ratio 0.64× ND/EBITDA. Interest cover 9.2×.",
            source: "p.2, Summary P&L: 'LTM EBITDA NGN28.4bn. Net debt NGN18.2bn. ND/EBITDA 0.64×. Interest cover 9.2× (covenant minimum 3.0×).'",
            docRef: "Management Accounts December 2025",
            stepId: 4,
          }),
          cell({
            status: "snippet",
            text: "MD note: energy costs being addressed through LPG conversion programme (completion Q2 2026). Receivable provision reflects single client dispute; legal recovery process initiated.",
            source: "p.4, MD Commentary: 'LPG conversion programme on track for Q2 completion, reducing energy costs by ~NGN200m pa. Apex Industries dispute referred to legal.'",
            docRef: "Management Accounts December 2025",
            stepId: 5,
          }),
          cell({
            status: "snippet",
            text: "Revenue Dec 2025: NGN10.8bn (vs NGN11.4bn budget). YTD FY2025 revenue NGN115.2bn vs NGN113bn budget (+2% ahead). Gross margin 42.3%.",
            source: "p.2, P&L Summary: 'December revenue NGN10.8bn (vs NGN11.4bn budget). YTD NGN115.2bn (+2% vs budget). Gross margin 42.3%.'",
            docRef: "Management Accounts December 2025",
            stepId: 4,
          }),
          cell({ status: "no-answer" }),
          cell({ status: "no-answer" }),
        ],
      },

      // ─── Row 5: Legal Due Diligence Summary ───────────────────────────────
      {
        id: "5",
        documentName: "Legal Due Diligence Summary",
        date: "Jan 31, 2026",
        documentType: "Legal",
        category: "Legal",
        cells: [
          cell({
            status: "snippet",
            text: "Two amber issues: (1) land title for Ogun plant — survey dispute with state government, not yet resolved; (2) contractor claim of NGN320m for early termination of Build A contract (arbitration pending).",
            source: "p.7, Amber Issues: 'Land title dispute at Ogun plant with Ogun State Government re: 4.2 hectares. Contractor claim NGN320m (Build A contract termination, arbitration filed Jan 2026).'",
            docRef: "Legal Due Diligence Summary",
            stepId: 3,
          }),
          cell({
            status: "snippet",
            text: "No material claims or undisclosed liabilities beyond disclosed. Total contingent liabilities (excluding tax dispute) NGN640m. Tax dispute quantified at NGN1.2bn (subject to separate negotiation).",
            source: "p.10, Contingent Liabilities: 'Disclosed contingent liabilities total NGN640m (land title + contractor claim). Tax dispute NGN1.2bn handled separately. No other material undisclosed liabilities found.'",
            docRef: "Legal Due Diligence Summary",
            stepId: 4,
          }),
          cell({ status: "no-answer" }),
          cell({ status: "no-answer" }),
          cell({
            status: "snippet",
            text: "CAC registration current. All material contracts reviewed — no change-of-control provisions triggered by proposed transaction. Environmental permit (NESREA) valid to Dec 2027.",
            source: "p.4, Corporate & Regulatory: 'CAC registration current. 47 material contracts reviewed — no change-of-control triggers identified. NESREA environmental permit valid to 31 Dec 2027.'",
            docRef: "Legal Due Diligence Summary",
            stepId: 6,
          }),
          cell({ status: "no-answer" }),
        ],
      },

      // ─── Row 6: Industry Research Report ──────────────────────────────────
      {
        id: "6",
        documentName: "Nigerian Cement Sector Research — Cordros",
        date: "Feb 28, 2026",
        documentType: "Research",
        category: "Other",
        cells: [
          cell({
            status: "snippet",
            text: "Sector risks: (1) FX headwinds on imported clinker (35–40% of input cost); (2) infrastructure spending volatility linked to oil price; (3) potential overcapacity if all announced plants are commissioned.",
            source: "p.12, Sector Risks: 'Imported clinker 35–40% of COGS, creating direct FX exposure. Overcapacity risk if 8 new plants commissioned 2026–2028 as announced. Infrastructure spend sensitive to federation account receipts.'",
            docRef: "Nigerian Cement Sector Research — Cordros",
            stepId: 3,
          }),
          cell({
            status: "snippet",
            text: "Sector median EV/EBITDA 10.6×. Price/earnings 13.5×. Earnings yield 7.4%. Top pick: DANGCEM (Buy, TP NGN420). Second pick: BUACEMENT (Hold, TP NGN395).",
            source: "p.18, Valuation Summary: 'Sector median EV/EBITDA 10.6×, P/E 13.5×. DANGCEM: Buy, 12m TP NGN420 (24% upside). BUACEMENT: Hold, TP NGN395 (4% upside).'",
            docRef: "Nigerian Cement Sector Research — Cordros",
            stepId: 4,
          }),
          cell({
            status: "snippet",
            text: "Sector demand driven by Federal Government housing and infrastructure push. FG committed to 22,000km road programme and 500,000 housing units. Demand outlook +8–10% pa to 2028.",
            source: "p.6, Demand Drivers: 'FG road programme (22,000km) and housing scheme (500,000 units) underpin 8–10% pa demand growth to 2028. Urbanisation rate 5.2% pa supports structural demand.'",
            docRef: "Nigerian Cement Sector Research — Cordros",
            stepId: 5,
          }),
          cell({
            status: "snippet",
            text: "Sector revenue grew 16% in 2025 to NGN2.1tn. DANGCEM market share 47%. BUACEMENT 28%. Lafarge Africa 12%. Others 13%.",
            source: "p.4, Sector Overview: 'Total sector revenue NGN2.1tn in 2025 (+16% YoY). DANGCEM 47% share. BUACEMENT 28%. Lafarge Africa 12%. Combined NGX cement market cap NGN4.4tn.'",
            docRef: "Nigerian Cement Sector Research — Cordros",
            stepId: 4,
          }),
          cell({
            status: "snippet",
            text: "Nigerian cement sector operating under CAMA 2020 and sector-specific guidelines from SON (Standards Organisation of Nigeria). No new regulatory risk identified beyond standard disclosure requirements.",
            source: "p.15, Regulatory Environment: 'Sector governed by CAMA 2020, SON quality standards, and NESREA environmental regulations. No material new regulations anticipated in 2026.'",
            docRef: "Nigerian Cement Sector Research — Cordros",
            stepId: 6,
          }),
          cell({
            status: "snippet",
            text: "Regional precedent deals: LafargeHolcim acquisition of Bamburi Cement (Kenya) at 9.8× EV/EBITDA (2021). PPC Limited South Africa at 8.7× (2022). Dangote Africa at premium to regional peers.",
            source: "p.19, Precedent Transactions: 'LafargeHolcim/Bamburi (Kenya) 9.8× EV/EBITDA 2021. PPC South Africa 8.7× 2022. Nigerian market commands premium on liquidity and scale.'",
            docRef: "Nigerian Cement Sector Research — Cordros",
            stepId: 7,
          }),
        ],
      },

      // ─── Row 7: Precedent Transactions Analysis ────────────────────────────
      {
        id: "7",
        documentName: "Precedent Transactions — West African Industrials 2020–2025",
        date: "Jan 15, 2026",
        documentType: "Analysis",
        category: "Other",
        cells: [
          cell({
            status: "snippet",
            text: "Key risk in precedent deals: integration failure and post-acquisition working capital deterioration. 3 of 8 deals reviewed underperformed on EBITDA within 18 months of closing.",
            source: "p.5, Risk Patterns: '3 of 8 reviewed deals missed post-acquisition EBITDA targets within 18 months. Primary causes: integration cost overruns and working capital deterioration.'",
            docRef: "Precedent Transactions — West African Industrials 2020–2025",
            stepId: 3,
          }),
          cell({
            status: "snippet",
            text: "Deal range: 8.5–14.2× EV/EBITDA. Median 11.4×. 75th percentile 13.0×. Technology-enabled industrials at premium (+1.8×) to traditional industrials.",
            source: "p.8, Valuation Range: '8 deals 2020–2025: range 8.5–14.2× EV/EBITDA, median 11.4×. Tech-enabled industrial premium +1.8× vs traditional industrial peers.'",
            docRef: "Precedent Transactions — West African Industrials 2020–2025",
            stepId: 4,
          }),
          cell({
            status: "snippet",
            text: "Management retention was a key value driver in 6 of 8 transactions. Deals with earn-out structures outperformed on 3-year basis. Retention packages averaged 2–3% of deal value.",
            source: "p.11, Value Creation: '6 of 8 deals included management retention packages averaging 2–3% of deal value. Earn-out structures in 4 deals correlated with better 3-year EBITDA performance.'",
            docRef: "Precedent Transactions — West African Industrials 2020–2025",
            stepId: 5,
          }),
          cell({
            status: "snippet",
            text: "Revenue multiple range 2.1–4.8×. EBITDA multiple is preferred metric. Average deal size NGN22bn (range NGN4bn–NGN120bn). Median leverage at close: 1.8× ND/EBITDA.",
            source: "p.7, Financial Metrics: 'Revenue multiples 2.1–4.8× (less reliable). EBITDA preferred. Average deal size NGN22bn. Leverage at close median 1.8× ND/EBITDA.'",
            docRef: "Precedent Transactions — West African Industrials 2020–2025",
            stepId: 4,
          }),
          cell({
            status: "snippet",
            text: "Regulatory clearance averaged 4.2 months in Nigeria (FCCPC merger notification required for deals >NGN1bn). FCC/competition clearance was the critical path in 3 deals.",
            source: "p.13, Regulatory Timeline: 'FCCPC merger notification mandatory for transactions exceeding NGN1bn. Average clearance 4.2 months. Competition review was critical path in 3 of 8 deals.'",
            docRef: "Precedent Transactions — West African Industrials 2020–2025",
            stepId: 6,
          }),
          cell({
            status: "snippet",
            text: "Closest comparables to Project Alpha: (1) TechBridge Nigeria acquisition by Sahara Group 2023 (12.8× EV/EBITDA); (2) Instore Africa PE buyout 2022 (11.2×). Both had similar recurring revenue profiles.",
            source: "p.9, Closest Comparables: 'TechBridge Nigeria (Sahara Group, 2023) at 12.8× — recurring revenue 71%, similar scale. Instore Africa PE buyout (2022) at 11.2× — recurring 65%.'",
            docRef: "Precedent Transactions — West African Industrials 2020–2025",
            stepId: 7,
          }),
        ],
      },
    ],
  };
}

export function createEmptyGridData(): WorkspaceGridData {
  return {
    extractionColumns: [...DEFAULT_DD_COLUMNS],
    rows: [],
  };
}

export function createNewWorkspace(name: string, id?: string): { id: string; name: string; createdAt: string } {
  return {
    id: id ?? crypto.randomUUID(),
    name,
    createdAt: new Date().toISOString(),
  };
}
