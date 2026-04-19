export type Project = {
  title: string;
  tagline: string;
  tags: string[];
  description: string;
  year: string;
  featured?: boolean;
  thumbLabel?: string;
  thumbImage?: string;
  href?: string;
};

export const projects: Project[] = [
  {
    title: 'Envel MCP',
    tagline: 'personal finance, agent-native',
    tags: ['MCP', 'FastMCP', 'OAuth 2.1', 'SQLite'],
    description:
      'An AI-powered personal finance agent built on the Model Context Protocol. Implements envelope budgeting — every rupiah has a job — with a FastMCP server, OAuth 2.1 auth service, and a lightweight dashboard. Works with Claude, Cursor, or any MCP client.',
    year: '2026 — in progress',
    featured: true,
    thumbLabel: 'wip · github.com/maulairfani/envel-mcp',
    thumbImage: '/thumbs/envel.svg',
    href: 'https://github.com/maulairfani/envel-mcp',
  },
  {
    title: 'Attend',
    tagline: 'real-time face-recognition attendance',
    tags: ['DeepFace', 'YOLO', 'FastAPI', 'Next.js', 'DVC'],
    description:
      'A smart attendance system that identifies people through live camera feeds, logs events, and surfaces them in a dashboard. DeepFace for recognition, YOLO for segmentation, Next.js on the front. A companion repo wires the training and serving side with DVC and Docker.',
    year: '2026 — in progress',
    featured: true,
    thumbLabel: 'wip · github.com/maulairfani/attend-mlops',
    thumbImage: '/thumbs/attend.svg',
    href: 'https://github.com/maulairfani/attend-mlops',
  },
  {
    title: 'Ica',
    tagline: 'an AI tutor that remembers you',
    tags: ['Multi-agent', 'Function calling', 'FastAPI', 'Pinecone'],
    description:
      'An AI personal tutor serving 5,000+ monthly students at Analitica. Multi-agent with function calling, long-term memory on Pinecone, and real-time interactive widgets for calculus and physics — turning static answers into things you can poke at.',
    year: '2024 — 2026',
    featured: true,
    thumbLabel: '5,000+ monthly users',
    thumbImage: '/thumbs/ica.svg',
  },
  {
    title: 'Hospitality LLM',
    tagline: 'fine-tuning Llama 3 for customer service',
    tags: ['Fine-tuning', 'LoRA', 'Unsloth', 'RAG Evals'],
    description:
      'Fine-tuned Llama 3 with Unsloth and LoRA as a specialized customer-service agent. Benchmarked the retrieval stack on noise robustness, negative rejection, and counterfactual robustness — because eval is often harder than training.',
    year: '2024',
  },
  {
    title: 'Indo-LegalBERT',
    tagline: 'a language model that speaks legalese',
    tags: ['Fine-tuning', 'IndoBERT', 'MLM', 'Embeddings'],
    description:
      'Domain-adapted IndoBERT on 10,000+ Indonesian legal documents via masked language modeling. Deployed as an embedding layer to improve semantic retrieval over legal text.',
    year: '2024',
  },
  {
    title: 'License Plate OCR',
    tagline: 'reading Indonesian plates at 98%',
    tags: ['OCR', 'CRAFT', 'Transformer'],
    description:
      'An OCR pipeline using CRAFT for text detection and Transformer-based recognition. Won Best Metric Performance at Satria Data 2023.',
    year: '2023',
  },
];
