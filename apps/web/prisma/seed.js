const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const DEFAULT_DD_COLUMNS = ["Key risks", "Valuation inputs", "Management themes"];

const SOURCE_CATEGORIES = ["Financials", "Legal", "Regulatory", "Other"];

async function main() {
  const existing = await prisma.workspace.count();
  if (existing === 0) {
  const project = await prisma.project.create({
    data: { name: "Project Alpha" },
  });

  const workspace = await prisma.workspace.create({
    data: {
      name: "Project Alpha — IC memo prep",
      projectId: project.id,
      fields: {
        create: DEFAULT_DD_COLUMNS.map((name, i) => ({ name, sortOrder: i })),
      },
    },
    include: { fields: true },
  });

  const sources = [
    {
      documentName: "FY2024 P&L",
      date: "Jan 18, 2024",
      documentType: "Financials",
      category: "Financials",
      cells: [
        { status: "snippet", text: "Supply chain and labor cost inflation drove a 12% YoY increase in operating expenses.", citationSource: "Page 4, FY2024 P&L: 'Operating expenses increased 12% YoY...'", citationDocRef: "FY2024 P&L", stepId: 3 },
        { status: "snippet", text: "Revenue growth 8%; EBITDA margin 22%. Management cited pricing and volume mix.", citationSource: "Page 2, FY2024 P&L: 'Revenue growth of 8% with EBITDA margin at 22%.'", citationDocRef: "FY2024 P&L", stepId: 4 },
        { status: "snippet", text: "Focus on cost discipline and selective M&A; no change to capital allocation policy.", citationSource: "Page 6, FY2024 P&L: 'Management reiterated focus on cost discipline.'", citationDocRef: "FY2024 P&L", stepId: 5 },
      ],
    },
    {
      documentName: "Project Alpha CIM",
      date: "Apr 29, 2024",
      documentType: "Marketing Materials",
      category: "Other",
      cells: [
        { status: "snippet", text: "Regulatory risk in key markets; competitive intensity and new entrants noted.", citationSource: "Section 8, Project Alpha CIM: 'The company operates in jurisdictions subject to evolving regulation.'", citationDocRef: "Project Alpha CIM", stepId: 3 },
        { status: "snippet", text: "TAM and growth assumptions in Section 3; comparable multiples referenced in Appendix.", citationSource: "Section 3, Project Alpha CIM: 'Addressable market expanding.'", citationDocRef: "Project Alpha CIM", stepId: 4 },
        { status: "snippet", text: "Positioning as category leader; international expansion and product roadmap highlighted.", citationSource: "Section 2, Project Alpha CIM: 'Category leadership and international expansion priorities.'", citationDocRef: "Project Alpha CIM", stepId: 5 },
      ],
    },
    {
      documentName: "Board Deck Q3",
      date: "Sep 12, 2024",
      documentType: "Financials",
      category: "Financials",
      cells: [{ status: "reading" }, { status: "reading" }, { status: "reading" }],
    },
  ];

  for (const s of sources) {
    const source = await prisma.source.create({
      data: {
        workspaceId: workspace.id,
        documentName: s.documentName,
        date: s.date,
        documentType: s.documentType,
        category: s.category || "Other",
      },
    });
    for (let i = 0; i < workspace.fields.length; i++) {
      const cell = s.cells[i] ?? { status: "reading" };
      await prisma.cell.create({
        data: {
          sourceId: source.id,
          fieldId: workspace.fields[i].id,
          status: cell.status,
          text: cell.text ?? null,
          citationSource: cell.citationSource ?? null,
          citationDocRef: cell.citationDocRef ?? null,
          stepId: cell.stepId ?? null,
        },
      });
    }
  }
  }

  // Seed deal targets for Deal Sourcing module (run even if workspaces already exist)
  const dealTargetCount = await prisma.dealTarget.count();
  if (dealTargetCount === 0) {
    await prisma.dealTarget.createMany({
      data: [
        { name: "Acme Corp", summary: "Mid-cap industrials; strong margin profile.", marketMultiple: "11.2x EV/EBITDA", regulatoryFlag: "Clean", sourceRef: "Screener Q4 2024", sourceDetail: "Screener output, p.2: Acme Corp passed initial filters." },
        { name: "Nordic Telecoms Ltd", summary: "European telecoms; fibre rollout and cost synergies.", marketMultiple: "8.1x", regulatoryFlag: "Under review", sourceRef: "Deal memo Nov 2024", sourceDetail: "Regulatory review in progress in two jurisdictions." },
        { name: "GrowthIQ Inc", summary: "SaaS; high growth, path to profitability.", marketMultiple: "24x NTM revenue", regulatoryFlag: "Clean", sourceRef: "CIM Section 3", sourceDetail: "Management presentation, comparable set." },
        { name: "Heritage Manufacturing", summary: "Legacy industrials; turnaround story.", marketMultiple: "6.5x EV/EBITDA", regulatoryFlag: "Clean", sourceRef: "Internal memo", sourceDetail: "Internal screening, Oct 2024." },
        { name: "Pacific Energy Co", summary: "Renewables and gas; regulatory exposure.", marketMultiple: "9.0x", regulatoryFlag: "Flagged", sourceRef: "Compliance note", sourceDetail: "Ongoing regulatory inquiry in one market." },
      ],
    });
  }
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
