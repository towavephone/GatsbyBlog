interface GetAnimateProgressProps {
  progress: number;
  start: number;
  duration: number;
}

// 获取单个进度
export const getAnimateProgress = ({ progress, start, duration }: GetAnimateProgressProps) =>
  (progress - start) / duration;

type GetAnimateProgressesOptions = Omit<GetAnimateProgressProps, 'progress'>;

// 获取多个进度
export const getAnimateProgresses = (progress: number, options: GetAnimateProgressesOptions[]) =>
  options.map(({ start, duration }) =>
    getAnimateProgress({
      progress,
      start,
      duration
    })
  );
