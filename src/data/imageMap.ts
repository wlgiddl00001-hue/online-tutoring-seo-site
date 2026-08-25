export const mainImages = [
  '/images/online/main-01.png',
  '/images/online/main-02.png',
  '/images/online/high-english-01.png',
];

export const detailImages = {
  elementary: [
    '/images/online/elementary-math-01.png',
    '/images/online/elementary-english-01.png',
    '/images/online/elementary-pink-01.png',
  ],
  middle: [
    '/images/online/middle-english-grammar-01.png',
    '/images/online/middle-performance-01.png',
    '/images/online/main-02.png',
  ],
  high: [
    '/images/online/high-math-01.png',
    '/images/online/high-science-01.png',
    '/images/online/high-korean-01.png',
    '/images/online/high-english-01.png',
  ],
};

const detailImageMap: Record<
  ReturnType<typeof getGradeKey>,
  {
    generic: string[];
    subjects: Partial<Record<string, string[]>>;
  }
> = {
  elementary: {
    generic: ['/images/online/elementary-pink-01.png'],
    subjects: {
      영어: ['/images/online/elementary-english-01.png'],
      수학: ['/images/online/elementary-math-01.png'],
    },
  },
  middle: {
    generic: ['/images/online/middle-performance-01.png', '/images/online/main-02.png'],
    subjects: {
      영어: ['/images/online/middle-english-grammar-01.png'],
    },
  },
  high: {
    generic: ['/images/online/main-02.png'],
    subjects: {
      국어: ['/images/online/high-korean-01.png'],
      영어: ['/images/online/high-english-01.png'],
      수학: ['/images/online/high-math-01.png'],
      과학: ['/images/online/high-science-01.png'],
    },
  },
};

export function getGradeKey(grade: string): 'elementary' | 'middle' | 'high' {
  if (grade === '초등') return 'elementary';
  if (grade === '중등') return 'middle';
  return 'high';
}

function hashString(value: string) {
  return Array.from(value).reduce(
    (hash, character) => (hash * 31 + character.charCodeAt(0)) >>> 0,
    2166136261,
  );
}

export function getStableImage(images: readonly string[], seed: string): string {
  if (images.length === 0) {
    throw new Error('이미지 배열은 비어 있을 수 없습니다.');
  }

  return images[hashString(seed) % images.length];
}

export function getStableImages(
  images: readonly string[],
  seed: string,
  count = 2,
): string[] {
  if (images.length === 0) {
    throw new Error('이미지 배열은 비어 있을 수 없습니다.');
  }

  const shuffled = [...images];
  let seedValue = hashString(seed);

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    seedValue = (seedValue * 1664525 + 1013904223) >>> 0;
    const targetIndex = seedValue % (index + 1);
    [shuffled[index], shuffled[targetIndex]] = [
      shuffled[targetIndex],
      shuffled[index],
    ];
  }

  return shuffled.slice(0, Math.min(Math.max(count, 0), shuffled.length));
}

export function getDetailImages(grade: string, subject: string, seed: string, count = 2) {
  const gradeKey = getGradeKey(grade);
  const imageGroup = detailImageMap[gradeKey];
  const exactImages = imageGroup.subjects[subject] ?? [];
  const selectedImages: string[] = [];
  const allExactImages = new Set(
    Object.values(detailImageMap).flatMap((group) => Object.values(group.subjects).flat()),
  );

  function addImages(candidates: readonly string[], seedSuffix: string) {
    if (selectedImages.length >= count || candidates.length === 0) {
      return;
    }

    for (const image of getStableImages(candidates, `${seed}:${seedSuffix}`, candidates.length)) {
      if (selectedImages.includes(image)) {
        continue;
      }

      selectedImages.push(image);

      if (selectedImages.length >= count) {
        return;
      }
    }
  }

  addImages(exactImages, 'exact');
  addImages(imageGroup.generic, 'grade');
  addImages(
    mainImages.filter((image) => exactImages.includes(image) || !allExactImages.has(image)),
    'common',
  );

  return selectedImages;
}

export function getDetailImageCoverage() {
  return detailImageMap;
}
