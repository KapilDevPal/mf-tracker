import { cn } from '@/utils';

interface SkeletonProps {
  className?: string;
  style?: React.CSSProperties;
}

export function Skeleton({ className, style }: SkeletonProps) {
  return (
    <div
      className={cn('skeleton', className)}
      style={{
        height: '1rem',
        width: '100%',
        ...style,
      }}
    />
  );
}

export function FundCardSkeleton() {
  return (
    <div
      className="glass-card"
      style={{
        padding: '1.25rem',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: '180px',
      }}
    >
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
          <Skeleton style={{ width: '40%', height: '12px' }} />
          <Skeleton style={{ width: '20%', height: '12px' }} />
        </div>
        <Skeleton style={{ width: '90%', height: '16px', marginBottom: '0.5rem' }} />
        <Skeleton style={{ width: '60%', height: '16px' }} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', paddingTop: '0.5rem', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
        <div>
          <Skeleton style={{ width: '50px', height: '10px', marginBottom: '4px' }} />
          <Skeleton style={{ width: '80px', height: '18px' }} />
        </div>
        <Skeleton style={{ width: '60px', height: '10px' }} />
      </div>
    </div>
  );
}

export function ChartSkeleton() {
  return (
    <div
      className="glass-card"
      style={{
        padding: '1.5rem',
        height: '350px',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Skeleton style={{ width: '150px', height: '20px' }} />
        <Skeleton style={{ width: '120px', height: '30px' }} />
      </div>
      <div style={{ flex: 1, display: 'flex', alignItems: 'flex-end', gap: '8px', padding: '10px 0' }}>
        {Array.from({ length: 12 }).map((_, i) => (
          <Skeleton
            key={i}
            style={{
              flex: 1,
              height: `${20 + Math.random() * 70}%`,
              borderRadius: '4px 4px 0 0',
            }}
          />
        ))}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Skeleton style={{ width: '60px', height: '10px' }} />
        <Skeleton style={{ width: '60px', height: '10px' }} />
        <Skeleton style={{ width: '60px', height: '10px' }} />
        <Skeleton style={{ width: '60px', height: '10px' }} />
      </div>
    </div>
  );
}
