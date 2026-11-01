export type Artifact = {
  slug: string;
  title: string;
  description: string;
};

export const artifacts: Artifact[] = [
  {
    slug: 'number-formats',
    title: 'Number formats: FP32, FP16, BF16 and INT8',
    description: 'Quantization, part 1. How computers store numbers, in small interactive bites.',
  },
];
