import { ImageResponse } from 'next/og';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export function generateOGImage({
  title,
  description,
  icon,
}: {
  title: string;
  description: string;
  icon?: string;
}) {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        {/* Top accent bar */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '6px',
            background: 'linear-gradient(90deg, #3b82f6, #60a5fa, #3b82f6)',
            display: 'flex',
          }}
        />

        {/* Content */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '60px 80px',
            textAlign: 'center',
          }}
        >
          {/* Icon */}
          {icon && (
            <div
              style={{
                fontSize: 72,
                marginBottom: 24,
                display: 'flex',
              }}
            >
              {icon}
            </div>
          )}

          {/* Title */}
          <div
            style={{
              fontSize: icon ? 48 : 56,
              fontWeight: 800,
              color: '#f1f5f9',
              lineHeight: 1.2,
              marginBottom: 16,
              display: 'flex',
            }}
          >
            {title}
          </div>

          {/* Description */}
          <div
            style={{
              fontSize: 24,
              color: '#94a3b8',
              lineHeight: 1.5,
              maxWidth: 800,
              display: 'flex',
            }}
          >
            {description}
          </div>
        </div>

        {/* Bottom branding */}
        <div
          style={{
            position: 'absolute',
            bottom: 40,
            display: 'flex',
            alignItems: 'center',
            gap: 12,
          }}
        >
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 8,
              background: '#3b82f6',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: 18,
              fontWeight: 700,
            }}
          >
            C
          </div>
          <div
            style={{
              fontSize: 24,
              fontWeight: 700,
              color: '#f1f5f9',
              display: 'flex',
            }}
          >
            Calc
            <span style={{ color: '#3b82f6' }}>Pick</span>
          </div>
          <div
            style={{
              fontSize: 18,
              color: '#64748b',
              marginLeft: 8,
              display: 'flex',
            }}
          >
            Free Financial Calculators
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
